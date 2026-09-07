-- ============================================
-- V4__add_is_profile_complete_to_profiles.sql
-- ============================================
-- Add is_profile_complete to seeker_profiles
-- ============================================
ALTER TABLE seeker_profiles
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN seeker_profiles.is_profile_complete IS 'Indicates whether the seeker profile is complete';

-- ============================================
-- Add is_profile_complete to company_profiles
-- ============================================
ALTER TABLE company_profiles
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN company_profiles.is_profile_complete IS 'Indicates whether the company profile is complete';
