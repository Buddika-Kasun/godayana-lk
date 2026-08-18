-- ============================================
-- VISA POST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS visa_post (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(100) NOT NULL,
    other_country VARCHAR(100),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    documents TEXT[],
    common_mistakes TEXT[],
    cost VARCHAR(100),
    processing_time VARCHAR(100),
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- ============================================
-- INDEXES
-- ============================================
--CREATE INDEX IF NOT EXISTS idx_visa_post_country ON visa_post(country);
--CREATE INDEX IF NOT EXISTS idx_visa_post_type ON visa_post(type);
--CREATE INDEX IF NOT EXISTS idx_visa_post_is_active ON visa_post(is_active);
--CREATE INDEX IF NOT EXISTS idx_visa_post_created_at ON visa_post(created_at DESC);
--CREATE INDEX IF NOT EXISTS idx_visa_post_country_type ON visa_post(country, type);

-- ============================================
-- COMMENTS
-- ============================================
--COMMENT ON TABLE visa_post IS 'Visa guides and information posts';
--COMMENT ON COLUMN visa_post.country IS 'Country name (e.g., UK, Australia)';
--COMMENT ON COLUMN visa_post.other_country IS 'Other country name if country is "Other"';
--COMMENT ON COLUMN visa_post.type IS 'Visa type (Student, Work, Visit)';
--COMMENT ON COLUMN visa_post.documents IS 'Array of required documents';
--COMMENT ON COLUMN visa_post.common_mistakes IS 'Array of common mistakes to avoid';
--COMMENT ON COLUMN visa_post.is_active IS 'Whether the post is active/publicly visible';

-- ============================================
-- SEED DATA (Optional)
-- ============================================
--INSERT INTO visa_post (id, country, type, title, description, documents, common_mistakes, cost, processing_time, is_active)
--VALUES
--(
--    gen_random_uuid(),
--    'UK',
--    'Student',
--    'UK Student Visa Guide',
--    'Everything you need to know about studying in the United Kingdom from Sri Lanka.',
--    ARRAY['CAS Letter', 'IELTS Result (6.5+)', 'Bank Statement (6 months)', 'TB Test Certificate'],
--    ARRAY['Insufficient Funds', 'Gap in Education', 'Weak Statement of Purpose'],
--    '£1,500 - £2,000',
--    '3 - 6 weeks',
--    TRUE
--),
--(
--    gen_random_uuid(),
--    'Australia',
--    'Student',
--    'Australia Student Visa Guide',
--    'Complete guide for Sri Lankan students applying to Australian universities.',
--    ARRAY['Confirmation of Enrollment', 'IELTS/PTE Results', 'Genuine Student Check', 'Health Insurance (OSHC)'],
--    ARRAY['GTE Statement Issues', 'Incorrect Financials', 'Health Requirements'],
--    'AUD 30,000 - 45,000',
--    '4 - 8 weeks',
--    TRUE
--);