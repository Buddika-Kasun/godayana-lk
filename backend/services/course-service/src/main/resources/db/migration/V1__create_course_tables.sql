-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    enroll_type VARCHAR(20) DEFAULT 'online',
    location VARCHAR(200),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    price DECIMAL(10, 2),
    max_students INTEGER,
    benefits TEXT[],
    requirements TEXT[],
    lessons TEXT[],
    course_image_url VARCHAR(500),
    confirmation_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING',
    view_count INTEGER DEFAULT 0,
    enrollment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMP,

    CONSTRAINT chk_course_enroll_type CHECK (enroll_type IN ('online', 'physical')),
    CONSTRAINT chk_course_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CLOSED', 'DRAFT'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_courses_company_id ON courses(company_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(enroll_type);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    seeker_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'ENROLLED',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    payment_id UUID,

    CONSTRAINT chk_enrollment_status CHECK (status IN ('ENROLLED', 'COMPLETED', 'DROPPED', 'CANCELLED'))
);

-- Create indexes for enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_seeker_id ON course_enrollments(seeker_id);

-- Saved courses table
CREATE TABLE IF NOT EXISTS saved_courses (
    seeker_id UUID NOT NULL,
    course_id UUID NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (seeker_id, course_id)
);

-- Add foreign key constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'fk_course_enrollments_course'
                   AND table_name = 'course_enrollments') THEN
        ALTER TABLE course_enrollments
        ADD CONSTRAINT fk_course_enrollments_course
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'fk_saved_courses_course'
                   AND table_name = 'saved_courses') THEN
        ALTER TABLE saved_courses
        ADD CONSTRAINT fk_saved_courses_course
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_enrollments_updated_at ON course_enrollments;
CREATE TRIGGER update_course_enrollments_updated_at
    BEFORE UPDATE ON course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();