-- =============================================
-- V2 Migration: Add new fields to courses table
-- =============================================

-- 1. Add new columns to courses table
DO $$
BEGIN
    -- Add instructor fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'instructor') THEN
        ALTER TABLE courses ADD COLUMN instructor VARCHAR(200);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'instructor_bio') THEN
        ALTER TABLE courses ADD COLUMN instructor_bio TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'instructor_avatar') THEN
        ALTER TABLE courses ADD COLUMN instructor_avatar VARCHAR(500);
    END IF;

    -- Add duration and schedule
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'duration') THEN
        ALTER TABLE courses ADD COLUMN duration VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'schedule') THEN
        ALTER TABLE courses ADD COLUMN schedule VARCHAR(500);
    END IF;

    -- Add enrolled students count (separate from enrollment_count for tracking)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'enrolled_students') THEN
        ALTER TABLE courses ADD COLUMN enrolled_students INTEGER DEFAULT 0;
    END IF;

    -- Add rating fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'rating') THEN
        ALTER TABLE courses ADD COLUMN rating DECIMAL(3, 2);
    END IF;

    -- Add learning outcomes (array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'learning_outcomes') THEN
        ALTER TABLE courses ADD COLUMN learning_outcomes TEXT[];
    END IF;

    -- Add what's included (array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'includes') THEN
        ALTER TABLE courses ADD COLUMN includes TEXT[];
    END IF;

    -- Add target audience (array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'target_audience') THEN
        ALTER TABLE courses ADD COLUMN target_audience TEXT[];
    END IF;

    -- Add certificate fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'certificate') THEN
        ALTER TABLE courses ADD COLUMN certificate BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'certificate_type') THEN
        ALTER TABLE courses ADD COLUMN certificate_type VARCHAR(200);
    END IF;

    -- Add contact phone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'contact_phone') THEN
        ALTER TABLE courses ADD COLUMN contact_phone VARCHAR(50);
    END IF;

    -- Add curriculum as JSONB for nested structure (modules with lessons)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'curriculum') THEN
        ALTER TABLE courses ADD COLUMN curriculum JSONB;
    END IF;

    -- Add category label
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'category_label') THEN
        ALTER TABLE courses ADD COLUMN category_label VARCHAR(100);
    END IF;

    -- Add course image file key (for internal reference)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'course_image_file_key') THEN
        ALTER TABLE courses ADD COLUMN course_image_file_key VARCHAR(500);
    END IF;

    -- Add is_enrolled flag (though this is user-specific, stored in separate table)
    -- Note: This is typically derived from enrollments table, not stored here

    -- Add is_saved flag (stored in saved_courses table)

    -- Add posted_date and last_updated (alias for created_at/updated_at)
    -- These are already covered by created_at and updated_at

END $$;

-- 2. Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating);
CREATE INDEX IF NOT EXISTS idx_courses_certificate ON courses(certificate);
CREATE INDEX IF NOT EXISTS idx_courses_duration ON courses(duration);

-- 3. Update existing courses with default values
UPDATE courses SET
    enrolled_students = COALESCE(enrolled_students, enrollment_count, 0),
    certificate = COALESCE(certificate, FALSE),
    rating = COALESCE(rating, 0)
WHERE enrolled_students IS NULL;

-- 4. Add check constraints for new fields
ALTER TABLE courses DROP CONSTRAINT IF EXISTS chk_course_rating;
ALTER TABLE courses ADD CONSTRAINT chk_course_rating
    CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));

-- 5. Comment on columns for documentation
COMMENT ON COLUMN courses.instructor IS 'Name of the course instructor';
COMMENT ON COLUMN courses.instructor_bio IS 'Biography of the instructor';
COMMENT ON COLUMN courses.instructor_avatar IS 'URL to instructor avatar image';
COMMENT ON COLUMN courses.duration IS 'Course duration (e.g., "8 weeks")';
COMMENT ON COLUMN courses.schedule IS 'Course schedule (e.g., "Monday & Wednesday, 6:00 PM - 8:00 PM")';
COMMENT ON COLUMN courses.enrolled_students IS 'Number of students currently enrolled';
COMMENT ON COLUMN courses.rating IS 'Average course rating (0-5)';
COMMENT ON COLUMN courses.learning_outcomes IS 'Array of learning outcomes for the course';
COMMENT ON COLUMN courses.includes IS 'Array of what is included in the course';
COMMENT ON COLUMN courses.target_audience IS 'Array of target audience descriptions';
COMMENT ON COLUMN courses.certificate IS 'Whether the course provides a certificate';
COMMENT ON COLUMN courses.certificate_type IS 'Type of certificate provided';
COMMENT ON COLUMN courses.contact_phone IS 'Contact phone number for the course';
COMMENT ON COLUMN courses.curriculum IS 'JSON structure containing modules and lessons';
COMMENT ON COLUMN courses.category_label IS 'Display label for the course category';

-- 6. Update course_enrollments table status constraint if needed
ALTER TABLE course_enrollments DROP CONSTRAINT IF EXISTS chk_enrollment_status;
ALTER TABLE course_enrollments ADD CONSTRAINT chk_enrollment_status
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED', 'ENROLLED', 'DROPPED'));