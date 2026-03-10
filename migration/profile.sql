-- ─────────────────────────────────────────────────────────────────────────────
-- MIGRATION: profiles
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Table ─────────────────────────────────────────────────────────────────────

CREATE TABLE public.profiles (
  id                  uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name           text        NOT NULL,
  username            text        NOT NULL UNIQUE,
  bio                 text,
  profile_image_url   text,
  extra_images        text[]      DEFAULT '{}',
  organizer_name      text,
  city                text,
  description         text,
  contact_info        text,
  user_type           text        NOT NULL DEFAULT 'user'
                                  CHECK (user_type IN ('user', 'organizer', 'admin')),
  application_status  text        DEFAULT NULL
                                  CHECK (application_status IN ('pending', 'approved', 'rejected')),
  rejection_reason    text,
  applied_at          timestamptz,
  reviewed_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ── RLS ───────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow trigger to insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND user_type = (
      SELECT user_type FROM public.profiles WHERE id = auth.uid()
    )
    AND application_status IS NOT DISTINCT FROM (
      SELECT application_status FROM public.profiles WHERE id = auth.uid()
    )
  );

-- ── Triggers ──────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'username',  '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Functions ─────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.apply_for_organizer(
  p_organizer_name    text,
  p_city              text,
  p_description       text,
  p_contact_info      text,
  p_profile_image_url text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_profile public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = auth.uid();

  IF v_profile.user_type = 'organizer' THEN
    RAISE EXCEPTION 'Already an organizer';
  END IF;

  IF v_profile.application_status = 'pending' THEN
    RAISE EXCEPTION 'You already have a pending application';
  END IF;

  UPDATE public.profiles SET
    organizer_name     = p_organizer_name,
    city               = p_city,
    description        = p_description,
    contact_info       = p_contact_info,
    profile_image_url  = COALESCE(p_profile_image_url, profile_image_url),
    application_status = 'pending',
    rejection_reason   = NULL,
    applied_at         = now()
  WHERE id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.review_organizer_application(
  p_user_id          uuid,
  p_decision         text,
  p_rejection_reason text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_decision NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Decision must be approved or rejected';
  END IF;

  UPDATE public.profiles SET
    user_type          = CASE WHEN p_decision = 'approved' THEN 'organizer' ELSE 'user' END,
    application_status = p_decision,
    rejection_reason   = p_rejection_reason,
    reviewed_at        = now()
  WHERE id = p_user_id AND application_status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pending application found for this user';
  END IF;
END;
$$;

-- ── Storage: avatars bucket ───────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can replace own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');