-- =============================================
-- V3 Migration: Add migration_paths and requirement_level to courses
-- =============================================

-- 1. Add new columns to courses table
DO $$
BEGIN
    -- Add migration_paths as text array
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'migration_paths') THEN
        ALTER TABLE courses ADD COLUMN migration_paths TEXT[];
    END IF;

    -- Add requirement_level as enum (varchar with check constraint)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'courses' AND column_name = 'requirement_level') THEN
        ALTER TABLE courses ADD COLUMN requirement_level VARCHAR(50);
    END IF;

END $$;

-- 3. Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_courses_migration_paths ON courses USING GIN (migration_paths);
CREATE INDEX IF NOT EXISTS idx_courses_requirement_level ON courses(requirement_level);

-- 4. Create combined index for common queries
CREATE INDEX IF NOT EXISTS idx_courses_req_level_status ON courses(requirement_level, status);

-- 5. Add comments for documentation
COMMENT ON COLUMN courses.migration_paths IS 'Array of migration paths available (e.g., {"Skilled Migration", "Student Visa"})';

-- 8. Verify the changes
DO $$
DECLARE
    column_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'courses' AND column_name = 'migration_paths'
    ) INTO column_exists;

    IF column_exists THEN
        RAISE NOTICE '✅ migration_paths column created successfully';
    ELSE
        RAISE NOTICE '❌ migration_paths column creation failed';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'courses' AND column_name = 'requirement_level'
    ) INTO column_exists;

    IF column_exists THEN
        RAISE NOTICE '✅ requirement_level column created successfully';
    ELSE
        RAISE NOTICE '❌ requirement_level column creation failed';
    END IF;
END $$;