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
    id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
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

INSERT INTO grade_levels (name)
VALUES
    ('O Level'),
    ('A Level'),
    ('IGCSE'),
    ('Edexcel');

CREATE TABLE register_students (

    register_id          SERIAL PRIMARY KEY,

    full_name            VARCHAR(100) NOT NULL,

    father_name          VARCHAR(100) NOT NULL,

    guardian_contact     VARCHAR(50) NOT NULL,

    date_of_birth        DATE NOT NULL,

    date_of_registration DATE DEFAULT CURRENT_DATE,

    grade_level_id       INT NOT NULL,

    class_year           VARCHAR(100) NOT NULL,

    email                VARCHAR(100),

    has_sibling          BOOLEAN DEFAULT FALSE,

    status               VARCHAR(30)
                          CHECK (
                              status IN (
                                  'ACCEPTED',
                                  'PENDING',
                                  'REJECTED'
                              )
                          )
                          DEFAULT 'PENDING',

    CONSTRAINT fk_grade_level
        FOREIGN KEY (grade_level_id)
        REFERENCES grade_levels(id)

);





-- SIBLING

CREATE TABLE siblings (
    sibling_id      SERIAL PRIMARY KEY,
    register_id     INT NOT NULL,
    sibling_name    VARCHAR(100) NOT NULL,
    sibling_class   VARCHAR(100),
    CONSTRAINT fk_student
        FOREIGN KEY (register_id)
        REFERENCES register_students(register_id)
        ON DELETE CASCADE
);


create table public.students (
  student_id integer not null,
  roll_no character varying(20) not null,
  password character varying(500) not null,
  accepted_at timestamp without time zone null default now(),
  constraint students_pkey primary key (roll_no),
  constraint students_student_id_key unique (student_id),
  constraint fk_student_registration foreign KEY (student_id) references register_students (register_id) on delete CASCADE
)




-- ─── 5. SUBJECTS ─────────────────────────────────────────────

CREATE TABLE subjects (
    id              INT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    grade_level_id  INT REFERENCES grade_levels(id) ON DELETE CASCADE
);

INSERT INTO subjects (id ,name, grade_level_id) VALUES
    (4034 ,'Mathematics',       1),  -- O Level
    (5054 , 'Physics',           1),
    (5070 , 'Chemistry',         1),
    (1123 ,'English',           1),
    (4037 , 'Additional Mathematics',  1),
    (9709 , 'Mathematics',       2),  -- A Level
    (9702 , 'Physics',           2),
    (9701 ,'Chemistry',         2),
    (0580 , 'Mathematics',       3),  -- IGCSE
    (0500 , 'English Language',  3),
    (0625 , 'Physics',  3),
    (1122 , 'Mathematics',       4),  -- Edexcel
    (1127 , 'Business Studies',  4);


    


-- ─── 6. COURSES ──────────────────────────────────────────────
-- Har subject ka ek course — teacher assign hoga

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    subject_id INT
    teacher_id VARCHAR(20)
    batch VARCHAR(50) NOT NULL,
    academic_year INT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    student_count INT DEFAULT 0,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE (teacher_id, subject_id, academic_year)
);





CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_roll_no VARCHAR(20),
    course_id INT,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (student_roll_no) REFERENCES students(roll_no) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(student_roll_no, course_id)
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




CREATE TABLE course_posts(
    id SERIAL PRIMARY KEY,
    post_type VARCHAR(20) CHECK(post_type IN ('ANNOUNCEMENT','RESOURCE')) NOT NULL,
    course_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE
);



-- TRIGGERS AND PROCEDURES 


-- TRIGGER OF ADDING AND APPROVING STUDENTS

CREATE OR REPLACE FUNCTION approve_student_trigger()
RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.status = 'ACCEPTED'
    AND OLD.status = 'PENDING'
    THEN
        INSERT INTO students(student_id,roll_no,password)
        VALUES (
            NEW.register_id,
            'VE-' ||
            LPAD(NEW.register_id::TEXT,3,'0'),
            've' ||
            LPAD(NEW.register_id::TEXT,3,'0')
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER student_approval_trigger
AFTER UPDATE OF status
ON register_students
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION approve_student_trigger();



-- TRIGGER OF REMOVING SIBLING IF REJECTED 

CREATE OR REPLACE FUNCTION remove_siblings_on_rejection()
RETURNS TRIGGER
AS $$
BEGIN
    IF NEW.status='REJECTED'
    AND OLD.status<>'REJECTED'
    THEN
        DELETE FROM siblings
        WHERE register_id=NEW.register_id;
        DELETE FROM siblings
        WHERE sibling_id=NEW.register_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER reject_student_trigger
AFTER UPDATE OF status
ON register_students
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION remove_siblings_on_rejection();


-- STUDENT LEAVE FROM INSTITUTE 

CREATE OR REPLACE FUNCTION remove_students()
RETURNS TRIGGER 
AS $$
BEGIN 
        UPDATE register_students
        SET status='LEFT'
        WHERE register_id=OLD.student_id;
        DELETE FROM siblings
        WHERE register_id=OLD.student_id;
        DELETE FROM siblings
        WHERE sibling_id=OLD.student_id;
        RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER remove_student_fun
AFTER DELETE 
ON students
FOR EACH ROW    
EXECUTE FUNCTION remove_students()


-- ADD STUDENT COUNT IF NEW STUDENT IS ENROLLED TO A COURSE

CREATE OR REPLACE FUNCTION increase_student_count()
RETURNS TRIGGER
AS $$
BEGIN
    UPDATE courses
    SET student_count = student_count + 1
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_student_counter
AFTER INSERT
ON enrollments
FOR EACH ROW
EXECUTE FUNCTION increase_student_count();




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
