-- ===================================
-- CHALK 3.0 DATABASE SCHEMA
-- Supabase (PostgreSQL)
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- PROFILES (extends auth.users)
-- ===================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ===================================
-- STUDENTS
-- ===================================
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tutor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    subject_id TEXT NOT NULL, -- e.g., 'ap-calc-ab', 'ap-physics-1'
    parent_email TEXT,
    parent_phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can CRUD their own students"
    ON public.students FOR ALL
    USING (auth.uid() = tutor_id);

-- ===================================
-- SESSIONS
-- ===================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tutor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    subject_id TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    transcript TEXT,
    notes TEXT,
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for sessions
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can CRUD their own sessions"
    ON public.sessions FOR ALL
    USING (auth.uid() = tutor_id);

-- ===================================
-- SESSION TOPICS (extracted by AI)
-- ===================================
CREATE TABLE IF NOT EXISTS public.session_topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    topic_id TEXT NOT NULL, -- e.g., 'calc-1-2' from knowledge graph
    status_before TEXT CHECK (status_before IN ('new', 'learning', 'reviewed', 'mastered')),
    status_after TEXT CHECK (status_after IN ('new', 'learning', 'reviewed', 'mastered')),
    score_delta INTEGER,
    evidence TEXT, -- AI가 추출한 증거 문장
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for session_topics
ALTER TABLE public.session_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view their session topics"
    ON public.session_topics FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.sessions s
            WHERE s.id = session_topics.session_id
            AND s.tutor_id = auth.uid()
        )
    );

-- ===================================
-- STUDENT MASTERY (cumulative scores)
-- ===================================
CREATE TABLE IF NOT EXISTS public.student_mastery (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    topic_id TEXT NOT NULL,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'learning', 'reviewed', 'mastered')),
    last_reviewed_at TIMESTAMPTZ,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, topic_id)
);

-- RLS for student_mastery
ALTER TABLE public.student_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view their students' mastery"
    ON public.student_mastery FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.students s
            WHERE s.id = student_mastery.student_id
            AND s.tutor_id = auth.uid()
        )
    );

-- ===================================
-- INDEXES
-- ===================================
CREATE INDEX IF NOT EXISTS idx_students_tutor ON public.students(tutor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tutor ON public.sessions(tutor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student ON public.sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled ON public.sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_mastery_student ON public.student_mastery(student_id);
CREATE INDEX IF NOT EXISTS idx_mastery_topic ON public.student_mastery(topic_id);

-- ===================================
-- FUNCTIONS & TRIGGERS
-- ===================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_mastery_updated_at
    BEFORE UPDATE ON public.student_mastery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
