-- ═════════════════════════════════════════════════════════════════════════════
-- FULL MIGRATION — profiles + events + categories
-- Run once in Supabase SQL editor on a clean database
-- ═════════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- TYPES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TYPE event_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE event_type   AS ENUM ('Event', 'Experience');

-- NOTE: event_category enum intentionally omitted.
-- Categories are managed dynamically via the `categories` table below.


-- ─────────────────────────────────────────────────────────────────────────────
-- SHARED HELPERS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.slugify(text)
RETURNS text LANGUAGE sql IMMUTABLE STRICT AS $$
SELECT regexp_replace(
               regexp_replace(lower(trim($1)), '[^a-z0-9\s-]', '', 'g'),
               '[\s-]+', '-', 'g'
       );
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
RETURN NEW;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- CATEGORIES
-- Must be created BEFORE events so the FK reference is valid.
--
-- `icon`  — Lucide icon name, e.g. "music", "utensils"
--           Admin pastes from lucide.dev/icons
-- `color` — hex string, e.g. "#f472b6"
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.categories (
                                   id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
                                   name       text        NOT NULL UNIQUE,
                                   icon       text        NOT NULL DEFAULT 'sparkles',
                                   color      text        NOT NULL DEFAULT '#94a3b8',
                                   slug       text        NOT NULL UNIQUE,
                                   is_active  boolean     NOT NULL DEFAULT true,
                                   sort_order integer     NOT NULL DEFAULT 0,
                                   created_at timestamptz NOT NULL DEFAULT now(),
                                   updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed — mirrors the original static EventCategory list
INSERT INTO public.categories (name, icon, color, slug, sort_order) VALUES
                                                                        ('Music',         'music',       '#f472b6', 'music',         1),
                                                                        ('Food & Drink',  'utensils',    '#fb923c', 'food-drink',    2),
                                                                        ('Art',           'palette',     '#c084fc', 'art',           3),
                                                                        ('Sports',        'trophy',      '#4ade80', 'sports',        4),
                                                                        ('Business',      'briefcase',   '#60a5fa', 'business',      5),
                                                                        ('Culture',       'landmark',    '#facc15', 'culture',       6),
                                                                        ('Entertainment', 'theater',     '#f87171', 'entertainment', 7),
                                                                        ('Education',     'book-open',   '#34d399', 'education',     8),
                                                                        ('Health',        'heart-pulse', '#22d3ee', 'health',        9),
                                                                        ('Other',         'sparkles',    '#94a3b8', 'other',         10)
    ON CONFLICT (name) DO NOTHING;

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "categories_admin_all" ON public.categories
  FOR ALL
  USING     (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'));


-- ─────────────────────────────────────────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.events (
                               id             uuid          PRIMARY KEY DEFAULT gen_random_uuid(),

    -- ownership
                               organizer_id   uuid          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- slug (auto-generated from title + uuid prefix)
                               slug           text          NOT NULL UNIQUE,

    -- core content
                               title          text          NOT NULL CHECK (char_length(title)       BETWEEN 3  AND 120),
                               description    text          NOT NULL CHECK (char_length(description) BETWEEN 10 AND 2000),
                               city           text          NOT NULL CHECK (char_length(city)        BETWEEN 1  AND 80),

    -- category: plain text FK to categories.name
    --   ON UPDATE CASCADE     → renaming a category updates all events automatically
    --   ON DELETE SET DEFAULT → deleting a category falls events back to 'Other'
                               category       text          NOT NULL DEFAULT 'Other'
                                   REFERENCES public.categories(name)
                                       ON UPDATE CASCADE
                                       ON DELETE SET DEFAULT,

                               event_type     event_type    NOT NULL DEFAULT 'Event',

    -- dates
                               start_date     timestamptz   NOT NULL,
                               end_date       timestamptz,

    -- optional info (display only — no payments or ticketing)
                               price          numeric(10,2) CHECK (price >= 0),
                               capacity       integer       CHECK (capacity > 0),
                               external_link  text,

    -- images: index 0 is always the cover
                               images         text[]        NOT NULL DEFAULT '{}'
                               CHECK (array_length(images, 1) BETWEEN 1 AND 8),

    -- moderation
                               status         event_status  NOT NULL DEFAULT 'pending',
                               rejection_note text,

    -- featuring
                               is_featured    boolean       NOT NULL DEFAULT false,
                               featured_at    timestamptz,
                               feature_note   text,

    -- timestamps
                               created_at     timestamptz   NOT NULL DEFAULT now(),
                               updated_at     timestamptz   NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX events_organizer_id_idx ON public.events (organizer_id);
CREATE INDEX events_status_idx       ON public.events (status);
CREATE INDEX events_city_idx         ON public.events (city);
CREATE INDEX events_category_idx     ON public.events (category);
CREATE INDEX events_type_idx         ON public.events (event_type);
CREATE INDEX events_start_date_idx   ON public.events (start_date);
CREATE INDEX events_slug_idx         ON public.events (slug);
CREATE INDEX events_is_featured_idx  ON public.events (is_featured) WHERE is_featured = true;

-- Triggers
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


-- ─────────────────────────────────────────────────────────────────────────────
-- RLS — EVENTS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_organizer()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND user_type = 'organizer'
);
$$;

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


-- ─────────────────────────────────────────────────────────────────────────────
-- ADMIN FUNCTIONS
-- ─────────────────────────────────────────────────────────────────────────────

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


-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE — event images
-- ─────────────────────────────────────────────────────────────────────────────

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