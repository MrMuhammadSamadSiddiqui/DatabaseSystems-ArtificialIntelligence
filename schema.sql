-- ============================================================
--   VE - Virtual Education Institute
--   LMS Database Schema (Updated Version)
--   Grades: O Level | A Level | IGCSE | Edexcel
--   Login: Role based (Teacher / Student)
-- ============================================================


-- ─── 1. ADMIN ────────────────────────────────────────────────
-- Sirf institute ka admin — teachers aur students banata hai
-- Admin hi roll numbers assign karta hai

-- ─── 2. TEACHERS ─────────────────────────────────────────────
-- Roll number institute dega e.g. TCH-001
-- Teacher khud login karega roll_number + password se

CREATE TABLE teachers (
    id              SERIAL PRIMARY KEY,  -- e.g. TCH-001 (admin assign karega)
    full_name       VARCHAR(100) NOT NULL,
    password        TEXT NOT NULL,                 -- bcrypt hashed
    subject         VARCHAR(100),                  -- e.g. "Physics"
    phone           VARCHAR(20),
    created_at      TIMESTAMP DEFAULT NOW()
);


-- ─── 3. GRADE LEVELS ─────────────────────────────────────────

CREATE TABLE grade_levels (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO grade_levels (name) VALUES
    ('O Level'),
    ('A Level'),
    ('IGCSE'),
    ('Edexcel');


-- ─── 4. STUDENTS ─────────────────────────────────────────────
-- Roll number institute dega e.g. STU-2025-001
-- Student khud login karega roll_number + password se

CREATE TABLE students (
    roll_number     SERIAL PRIMARY KEY,  -- e.g. STU-2025-001 (admin assign karega)
    full_name       VARCHAR(100) NOT NULL,
    password        TEXT NOT NULL,                 -- bcrypt hashed
    grade_level_id  INT REFERENCES grade_levels(id) ON DELETE SET NULL,
    phone           VARCHAR(20),
    guardian_name   VARCHAR(100),
    created_at      TIMESTAMP DEFAULT NOW()
);


-- ─── 5. SUBJECTS ─────────────────────────────────────────────

CREATE TABLE subjects (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    grade_level_id  INT REFERENCES grade_levels(id) ON DELETE CASCADE
);

INSERT INTO subjects (name, grade_level_id) VALUES
    ('Mathematics',       1),  -- O Level
    ('Physics',           1),
    ('Chemistry',         1),
    ('English',           1),
    ('Mathematics',       2),  -- A Level
    ('Physics',           2),
    ('Chemistry',         2),
    ('Mathematics',       3),  -- IGCSE
    ('English Language',  3),
    ('Mathematics',       4),  -- Edexcel
    ('Business Studies',  4);


-- ─── 6. COURSES ──────────────────────────────────────────────
-- Har subject ka ek course — teacher assign hoga

CREATE TABLE courses (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,       -- e.g. "O Level Physics 2025"
    subject_id      INT REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id      INT REFERENCES teachers(id) ON DELETE SET NULL,
    is_published    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);


-- ─── 7. CHAPTERS ─────────────────────────────────────────────

CREATE TABLE chapters (
    id          SERIAL PRIMARY KEY,
    course_id   INT REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    position    INT NOT NULL
);


-- ─── 8. STUDY MATERIAL / LECTURES ────────────────────────────
-- Teacher yahan lectures aur notes upload karega

CREATE TABLE study_material (
    id              SERIAL PRIMARY KEY,
    chapter_id      INT REFERENCES chapters(id) ON DELETE CASCADE,
    teacher_id      INT REFERENCES teachers(id) ON DELETE SET NULL,
    title           VARCHAR(200) NOT NULL,
    material_type   VARCHAR(20) CHECK (material_type IN ('video', 'notes', 'slides', 'other')),
    file_url        TEXT NOT NULL,     -- link to uploaded file / video
    description     TEXT,
    uploaded_at     TIMESTAMP DEFAULT NOW()
);


-- ─── 9. ENROLLMENTS ──────────────────────────────────────────
-- Student kaunse course mein hai

CREATE TABLE enrollments (
    id              SERIAL PRIMARY KEY,
    student_id      INT REFERENCES students(id) ON DELETE CASCADE,
    course_id       INT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at     TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);


-- ─── 10. ATTENDANCE ──────────────────────────────────────────
-- Teacher attendance upload karega — per student per date

CREATE TABLE attendance (
    id              SERIAL PRIMARY KEY,
    student_id      INT REFERENCES students(id) ON DELETE CASCADE,
    course_id       INT REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id      INT REFERENCES teachers(id) ON DELETE SET NULL,
    date            DATE NOT NULL,
    status          VARCHAR(10) CHECK (status IN ('present', 'absent', 'leave')) NOT NULL,
    marked_at       TIMESTAMP DEFAULT NOW(),
    UNIQUE (student_id, course_id, date)   -- ek din mein ek baar sirf
);


-- ─── 11. MARKS ───────────────────────────────────────────────
-- Teacher marks upload karega — test / assignment / exam

CREATE TABLE marks (
    id              SERIAL PRIMARY KEY,
    student_id      INT REFERENCES students(id) ON DELETE CASCADE,
    course_id       INT REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id      INT REFERENCES teachers(id) ON DELETE SET NULL,
    exam_type       VARCHAR(50) CHECK (exam_type IN ('test', 'assignment', 'mid_exam', 'final_exam')),
    total_marks     INT NOT NULL,
    obtained_marks  INT NOT NULL,
    remarks         TEXT,
    exam_date       DATE,
    uploaded_at     TIMESTAMP DEFAULT NOW()
);


-- ─── 12. STUDENT PROGRESS ────────────────────────────────────
-- Student ne kaunsa material dekha / complete kiya

CREATE TABLE progress (
    id              SERIAL PRIMARY KEY,
    student_id      INT REFERENCES students(id) ON DELETE CASCADE,
    material_id     INT REFERENCES study_material(id) ON DELETE CASCADE,
    completed       BOOLEAN DEFAULT FALSE,
    completed_at    TIMESTAMP,
    UNIQUE (student_id, material_id)
);


-- ============================================================
--   TABLE SUMMARY
--   admins          → institute ka admin
--   teachers        → TCH-001 se login
--   students        → STU-2025-001 se login
--   grade_levels    → O Level, A Level, IGCSE, Edexcel
--   subjects        → Math, Physics, etc.
--   courses         → subject ka course + teacher assigned
--   chapters        → course ke andar topics
--   study_material  → teacher uploads lectures/notes
--   enrollments     → student joins course
--   attendance      → teacher marks attendance
--   marks           → teacher uploads marks
--   progress        → student ne kya dekha
--
--   Run Command:
--   psql -U postgres -d lms_db -f schema.sql
-- ============================================================
