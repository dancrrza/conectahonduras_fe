-- ─────────────────────────────────────────────────────────────────────────────
-- FULL MIGRATION — profiles + events
-- Run once in Supabase SQL editor on a clean database
-- ─────────────────────────────────────────────────────────────────────────────
-- EVENTS
-- ═════════════════════════════════════════════════════════════════════════════

-- ── Enums ─────────────────────────────────────────────────────────────────────

CREATE TYPE event_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE event_category AS ENUM (
  'Music', 'Food & Drink', 'Art', 'Sports', 'Business',
  'Culture', 'Entertainment', 'Education', 'Health', 'Other'
);

CREATE TYPE event_type AS ENUM ('Event', 'Experience');

-- ── Slugify helper ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.slugify(text)
RETURNS text LANGUAGE sql IMMUTABLE STRICT AS $$
  SELECT regexp_replace(
    regexp_replace(lower(trim($1)), '[^a-z0-9\s-]', '', 'g'),
    '[\s-]+', '-', 'g'
  );
$$;

-- ── Events table ──────────────────────────────────────────────────────────────

CREATE TABLE public.events (
  id              uuid            PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ownership
  organizer_id    uuid            NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- slug (SEO-friendly URL, auto-generated from title + uuid prefix)
  slug            text            NOT NULL UNIQUE,

  -- core content
  title           text            NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  description     text            NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
  city            text            NOT NULL CHECK (char_length(city) BETWEEN 1 AND 80),
  category        event_category  NOT NULL,
  event_type      event_type      NOT NULL DEFAULT 'Event',

  -- dates
  start_date      timestamptz     NOT NULL,
  end_date        timestamptz,

  -- optional info (display only — no payments or ticketing)
  price           numeric(10,2)   CHECK (price >= 0),
  capacity        integer         CHECK (capacity > 0),
  external_link   text,

  -- images: index 0 is always the cover
  images          text[]          NOT NULL DEFAULT '{}'
                                  CHECK (array_length(images, 1) BETWEEN 1 AND 8),

  -- moderation
  status          event_status    NOT NULL DEFAULT 'pending',
  rejection_note  text,

  -- featuring
  is_featured     boolean         NOT NULL DEFAULT false,
  featured_at     timestamptz,
  feature_note    text,

  -- timestamps
  created_at      timestamptz     NOT NULL DEFAULT now(),
  updated_at      timestamptz     NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX events_organizer_id_idx ON public.events (organizer_id);
CREATE INDEX events_status_idx       ON public.events (status);
CREATE INDEX events_city_idx         ON public.events (city);
CREATE INDEX events_category_idx     ON public.events (category);
CREATE INDEX events_type_idx         ON public.events (event_type);
CREATE INDEX events_start_date_idx   ON public.events (start_date);
CREATE INDEX events_slug_idx         ON public.events (slug);
CREATE INDEX events_is_featured_idx  ON public.events (is_featured) WHERE is_featured = true;

-- ── Triggers ──────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.events_set_slug()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.slugify(NEW.title) || '-' || substring(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER events_auto_slug
  BEFORE INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.events_set_slug();

-- ── is_organizer() ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_organizer()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'organizer'
  );
$$;

-- ── RLS ───────────────────────────────────────────────────────────────────────

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved events"
  ON public.events FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Organizers can read own events"
  ON public.events FOR SELECT
  USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can create events"
  ON public.events FOR INSERT
  WITH CHECK (
    organizer_id = auth.uid()
    AND public.is_organizer()
    AND status = 'pending'
  );

CREATE POLICY "Organizers can edit pending events"
  ON public.events FOR UPDATE
  USING  (organizer_id = auth.uid() AND status = 'pending')
  WITH CHECK (
    organizer_id = auth.uid()
    AND status = 'pending'
    AND is_featured = false
  );

CREATE POLICY "Organizers can delete own events"
  ON public.events FOR DELETE
  USING (organizer_id = auth.uid());

-- ── Security definer functions ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.request_event_featuring(
  p_event_id uuid,
  p_note     text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.events
    WHERE id = p_event_id AND organizer_id = auth.uid() AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Not authorized or event is not approved';
  END IF;
  UPDATE public.events
  SET featured_at = now(), feature_note = p_note
  WHERE id = p_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_approve_event(p_event_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.events
  SET status = 'approved', rejection_note = NULL
  WHERE id = p_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reject_event(p_event_id uuid, p_note text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.events
  SET status = 'rejected', rejection_note = p_note
  WHERE id = p_event_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_featured(p_event_id uuid, p_featured boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.events SET is_featured = p_featured WHERE id = p_event_id;
END;
$$;

-- ── Storage: event-images bucket ──────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Organizers can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Organizers can delete own event images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can view event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');