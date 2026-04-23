-- ============================================================
--   VE - Virtual Education Institute
--   LMS Database Schema (Basic Version)
--   Grades: O Level | A Level | IGCSE | Edexcel
-- ============================================================
 
 
-- ─── 1. USERS ────────────────────────────────────────────────
-- Students, Teachers, Admin sab yahan honge
 
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    role        VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
    created_at  TIMESTAMP DEFAULT NOW()
);
 
 
-- ─── 2. GRADE LEVELS ─────────────────────────────────────────
-- VE ke 4 grade systems
 
CREATE TABLE grade_levels (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(50) UNIQUE NOT NULL
    -- Examples: 'O Level', 'A Level', 'IGCSE', 'Edexcel'
);
 
-- VE ke grade levels seed karo
INSERT INTO grade_levels (name) VALUES
    ('O Level'),
    ('A Level'),
    ('IGCSE'),
    ('Edexcel');
 
 
-- ─── 3. SUBJECTS ─────────────────────────────────────────────
-- Har grade ka alag subject hoga
 
CREATE TABLE subjects (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,   -- e.g. "Physics", "Mathematics"
    grade_level_id  INT REFERENCES grade_levels(id) ON DELETE CASCADE,
    created_at      TIMESTAMP DEFAULT NOW()
);
 
-- Kuch example subjects
INSERT INTO subjects (name, grade_level_id) VALUES
    ('Mathematics',         1),  -- O Level
    ('Physics',             1),  -- O Level
    ('Chemistry',           1),  -- O Level
    ('Mathematics',         2),  -- A Level
    ('Physics',             2),  -- A Level
    ('Mathematics',         3),  -- IGCSE
    ('English Language',    3),  -- IGCSE
    ('Mathematics',         4),  -- Edexcel
    ('Business Studies',    4);  -- Edexcel
 
 
-- ─── 4. COURSES ──────────────────────────────────────────────
-- Har subject ka ek course hoga
 
CREATE TABLE courses (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,        -- e.g. "O Level Physics 2025"
    description     TEXT,
    subject_id      INT REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id      INT REFERENCES users(id) ON DELETE SET NULL,
    is_published    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);
 
 
-- ─── 5. CHAPTERS ─────────────────────────────────────────────
-- Course ke andar chapters / topics
 
CREATE TABLE chapters (
    id          SERIAL PRIMARY KEY,
    course_id   INT REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,   -- e.g. "Chapter 1: Forces"
    position    INT NOT NULL             -- chapter ka order
);
 
 
-- ─── 6. LESSONS ──────────────────────────────────────────────
-- Chapter ke andar actual content (video/notes)
 
CREATE TABLE lessons (
    id              SERIAL PRIMARY KEY,
    chapter_id      INT REFERENCES chapters(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    content_type    VARCHAR(20) CHECK (content_type IN ('video', 'notes', 'quiz')),
    content_url     TEXT,       -- video link ya PDF link
    position        INT NOT NULL
);
 
 
-- ─── 7. ENROLLMENTS ──────────────────────────────────────────
-- Student kaunse course mein enrolled hai
 
CREATE TABLE enrollments (
    id              SERIAL PRIMARY KEY,
    student_id      INT REFERENCES users(id) ON DELETE CASCADE,
    course_id       INT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at     TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, course_id)   -- ek baar se zyada enroll nahi ho sakta
);
 
 
-- ─── 8. PROGRESS ─────────────────────────────────────────────
-- Student ne konsa lesson complete kiya
 
CREATE TABLE progress (
    id              SERIAL PRIMARY KEY,
    student_id      INT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id       INT REFERENCES lessons(id) ON DELETE CASCADE,
    completed       BOOLEAN DEFAULT FALSE,
    completed_at    TIMESTAMP,
    UNIQUE (student_id, lesson_id)
);
 
 
-- ============================================================
--   DONE! Basic schema ready hai.
--   Run karo: psql -U postgres -d lms_db -f schema.sql
-- ===========================================================