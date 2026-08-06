-- ============================================
-- GATEWAY CONSULTATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gateway_consultation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seeker_id UUID NOT NULL,
    country VARCHAR(100),
    other_country VARCHAR(100),
    study_field VARCHAR(100),
    other_study_field VARCHAR(100),
    study_level VARCHAR(100),
    intake VARCHAR(50),
    university_type VARCHAR(50),
    language_test_status VARCHAR(50),
    budget DECIMAL(20,2),
    family_sponsorship VARCHAR(5),
    education_loan VARCHAR(5),
    has_passport VARCHAR(5),
    visa_rejection VARCHAR(5),
    apply_within VARCHAR(20),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_gateway_consultation_status CHECK (status IN ('PENDING', 'REVIEW', 'CANCELLED', 'COMPLETED'))
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_gateway_consultation_status ON gateway_consultation(status);
CREATE INDEX IF NOT EXISTS idx_gateway_consultation_country ON gateway_consultation(country);
CREATE INDEX IF NOT EXISTS idx_gateway_consultation_seeker_id ON gateway_consultation(seeker_id);
