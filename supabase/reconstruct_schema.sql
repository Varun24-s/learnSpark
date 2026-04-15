-- ============================================================
-- LearnSpark: COMPLETE RECONSTRUCTION SCRIPT
-- RUN THIS TO FIX "UUID = TEXT" ERRORS
-- ============================================================

-- 1. DROP EVERYTHING IN REVERSE ORDER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP TABLE IF EXISTS public.progress;
DROP TABLE IF EXISTS public.parent_child_links;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.modules;

-- 2. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. PROFILES TABLE
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username     TEXT UNIQUE NOT NULL,
  role         TEXT NOT NULL DEFAULT 'CHILD'
               CHECK (role IN ('CHILD', 'PARENT', 'ADMIN')),
  display_name TEXT NOT NULL DEFAULT 'Learner',
  high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Child profiles are searchable" ON public.profiles FOR SELECT USING (role = 'CHILD');

-- 4. PARENT_CHILD_LINKS TABLE
CREATE TABLE public.parent_child_links (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

-- RLS: Links
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their links" ON public.parent_child_links FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can add links" ON public.parent_child_links FOR INSERT WITH CHECK (auth.uid() = parent_id);

-- 5. MODULES TABLE
CREATE TABLE public.modules (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL,
  category   TEXT NOT NULL CHECK (category IN ('Numeracy', 'Shapes')),
  level      INTEGER NOT NULL DEFAULT 1,
  content    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules readable by authenticated" ON public.modules FOR SELECT USING (auth.role() = 'authenticated');

-- 6. PROGRESS TABLE
CREATE TABLE public.progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id    UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  stars        INTEGER NOT NULL DEFAULT 0 CHECK (stars >= 1 AND stars <= 3),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- RLS: Progress
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Parents view linked child progress" ON public.progress FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.parent_child_links
    WHERE parent_id = auth.uid() AND child_id = public.progress.user_id
  )
);

-- 7. AUTH TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'role', 'CHILD'),
    COALESCE(new.raw_user_meta_data->>'display_name', 'Learner')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. INDEXES
CREATE INDEX idx_progress_user_id ON public.progress(user_id);
CREATE INDEX idx_progress_module_id ON public.progress(module_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
