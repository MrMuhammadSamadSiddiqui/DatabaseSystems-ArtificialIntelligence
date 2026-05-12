-- TABLES

-- ATTEDANCE LOGS TABLE

create table public.attendance_logs (
  id serial not null,
  student_roll_no character varying(20) not null,
  course_id integer not null,
  attendance_date date not null,
  status character(1) not null,
  constraint attendance_logs_pkey primary key (id),
  constraint attendance_logs_student_roll_no_course_id_attendance_date_key unique (student_roll_no, course_id, attendance_date),
  constraint attendance_logs_course_id_fkey foreign KEY (course_id) references courses (id) on delete CASCADE,
  constraint attendance_logs_student_roll_no_fkey foreign KEY (student_roll_no) references students (roll_no) on delete CASCADE,
  constraint attendance_logs_status_check check ((status = any (array['P'::bpchar, 'A'::bpchar])))
) TABLESPACE pg_default;

create trigger update_attend_trig
after INSERT
or DELETE
or
update on attendance_logs for EACH row
execute FUNCTION update_attend ();



-- COURSE POSTS TABLE

create table public.course_posts (
  id serial not null,
  post_type character varying(20) not null,
  course_id integer not null,
  title character varying(150) not null,
  content text not null,
  link text null,
  created_at timestamp without time zone null default now(),
  constraint course_posts_pkey primary key (id),
  constraint course_posts_course_id_fkey foreign KEY (course_id) references courses (id) on delete CASCADE,
  constraint course_posts_post_type_check check (
    (
      (post_type)::text = any (
        (
          array[
            'ANNOUNCEMENT'::character varying,
            'RESOURCE'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;


-- COURSES 

create table public.courses (
  id serial not null,
  subject_id integer null,
  teacher_id character varying(20) null,
  is_published boolean null default false,
  created_at timestamp without time zone null default now(),
  student_count integer null default 0,
  constraint courses_pkey primary key (id),
  constraint courses_subject_id_fkey foreign KEY (subject_id) references subjects (id) on delete set null,
  constraint courses_teacher_id_fkey foreign KEY (teacher_id) references teachers (id) on delete set null
) TABLESPACE pg_default;


-- ENROLLMENTS
create table public.enrollments (
  id serial not null,
  student_roll_no character varying(20) null,
  course_id integer null,
  enrolled_at timestamp without time zone null default now(),
  attendance numeric(5, 2) not null default 0,
  constraint enrollments_pkey primary key (id),
  constraint enrollments_student_roll_no_course_id_key unique (student_roll_no, course_id),
  constraint enrollments_course_id_fkey foreign KEY (course_id) references courses (id) on delete CASCADE,
  constraint enrollments_student_roll_no_fkey foreign KEY (student_roll_no) references students (roll_no) on delete CASCADE,
  constraint enrollments_attendance_check check ((attendance <= (100)::numeric))
) TABLESPACE pg_default;

create trigger add_student_counter
after INSERT on enrollments for EACH row
execute FUNCTION increase_student_count ();


-- GRADE LEVELS
create table public.grade_levels (
  id serial not null,
  name character varying(50) not null,
  constraint grade_levels_pkey primary key (id),
  constraint grade_levels_name_key unique (name)
) TABLESPACE pg_default;

-- REGISTER STUDENTS

create table public.register_students (
  register_id serial not null,
  full_name character varying(100) not null,
  father_name character varying(100) not null,
  guardian_contact character varying(50) not null,
  date_of_birth date not null,
  date_of_registration date null default CURRENT_DATE,
  grade_level_id integer not null,
  class_year character varying(100) not null,
  has_sibling boolean null default false,
  status character varying(30) null default 'PENDING'::character varying,
  constraint register_students_pkey primary key (register_id),
  constraint fk_grade_level foreign KEY (grade_level_id) references grade_levels (id),
  constraint register_students_status_check check (
    (
      (status)::text = any (
        (
          array[
            'ACCEPTED'::character varying,
            'PENDING'::character varying,
            'REJECTED'::character varying,
            'LEFT'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create trigger reject_student_trigger
after
update OF status on register_students for EACH row when (
  old.status::text is distinct from new.status::text
)
execute FUNCTION remove_siblings_on_rejection ();

create trigger student_approval_trigger
after
update OF status on register_students for EACH row when (
  old.status::text is distinct from new.status::text
)
execute FUNCTION approve_student_trigger ();

-- SIBLINGS

create table public.siblings (
  sibling_id integer not null,
  register_id integer not null,
  constraint siblings_pkey primary key (sibling_id, register_id),
  constraint fk_student foreign KEY (register_id) references register_students (register_id) on delete CASCADE
) TABLESPACE pg_default;


-- STUDENTS 
create table public.students (
  student_id integer not null,
  roll_no character varying(20) not null,
  password character varying(500) not null,
  accepted_at timestamp without time zone null default now(),
  constraint students_pkey primary key (roll_no),
  constraint students_student_id_key unique (student_id),
  constraint fk_student_registration foreign KEY (student_id) references register_students (register_id) on delete CASCADE
) TABLESPACE pg_default;

create trigger remove_student_fun
after DELETE on students for EACH row
execute FUNCTION remove_students ();

-- SUBJECTS 

create table public.subjects (
  id integer not null,
  name character varying(100) not null,
  grade_level_id integer null,
  constraint subjects_pkey primary key (id),
  constraint subjects_grade_level_id_fkey foreign KEY (grade_level_id) references grade_levels (id) on delete CASCADE
) TABLESPACE pg_default;


-- TEACHERS

create table public.subjects (
  id integer not null,
  name character varying(100) not null,
  grade_level_id integer null,
  constraint subjects_pkey primary key (id),
  constraint subjects_grade_level_id_fkey foreign KEY (grade_level_id) references grade_levels (id) on delete CASCADE
) TABLESPACE pg_default;



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



-- ATTENDANCE UPDATE

CREATE OR REPLACE FUNCTION update_attend()
RETURNS TRIGGER
AS $$
DECLARE   
total_count NUMERIC;
present_count NUMERIC;
attend NUMERIC;
s_id VARCHAR(20);
c_id INT;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        c_id:=NEW.course_id;
        s_id:=NEW.student_roll_no;
    ELSE
        c_id:=OLD.course_id;
        s_id:=OLD.student_roll_no;
    END IF;

    SELECT COUNT(*) INTO total_count FROM attendance_logs WHERE course_id=c_id AND student_roll_no=s_id ;
    SELECT COUNT(*) INTO present_count FROM attendance_logs WHERE course_id=c_id AND student_roll_no=s_id AND status='P' ;
    if(total_count=0) THEN 
    attend:=0;
    else 
    attend:= (present_count/total_count)*100;
    END IF;
    UPDATE enrollments
    SET attendance=attend
    WHERE course_id=c_id AND student_roll_no=s_id ;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER update_attend_trig
AFTER INSERT OR UPDATE OR DELETE ON attendance_logs
FOR EACH ROW
EXECUTE FUNCTION update_attend();
