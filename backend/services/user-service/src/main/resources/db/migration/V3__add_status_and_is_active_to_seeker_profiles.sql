-- ============================================
-- Migration: Add status and is_active to seeker_profiles
-- Version: V3
-- ============================================

-- Step 1: Add status column with default 'APPROVED'
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'APPROVED';

-- Step 2: Add is_active column with default true
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Step 3: Add constraint to ensure valid status values (FIXED)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.constraint_column_usage
        WHERE constraint_name = 'chk_seeker_profile_status'
        AND table_name = 'seeker_profiles'
    ) THEN
        ALTER TABLE seeker_profiles
        ADD CONSTRAINT chk_seeker_profile_status
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'));
    END IF;
END $$;

-- Step 4: Update existing profiles to have default values
UPDATE seeker_profiles
SET status = 'APPROVED'
WHERE status IS NULL;

UPDATE seeker_profiles
SET is_active = true
WHERE is_active IS NULL;

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seeker_profiles_status ON seeker_profiles(status);
CREATE INDEX IF NOT EXISTS idx_seeker_profiles_is_active ON seeker_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_seeker_profiles_status_active ON seeker_profiles(status, is_active);