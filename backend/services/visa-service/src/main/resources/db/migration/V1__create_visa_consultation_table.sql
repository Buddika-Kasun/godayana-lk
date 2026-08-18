-- ============================================
-- VISA CONSULTATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS visa_consultation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seeker_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL,
    country VARCHAR(100),
    visa_rejection BOOLEAN,
    has_passport BOOLEAN,
    travel_date TIMESTAMP,
    note TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_visa_consultation_status CHECK (status IN ('PENDING', 'REVIEW', 'CANCELLED', 'COMPLETED')),
    CONSTRAINT chk_visa_consultation_visa_type CHECK (type IN ('STUDENT', 'WORK', 'VISIT'))
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_visa_consultation_status ON visa_consultation(status);
CREATE INDEX IF NOT EXISTS idx_visa_consultation_type ON visa_consultation(type);
CREATE INDEX IF NOT EXISTS idx_visa_consultation_country ON visa_consultation(country);
CREATE INDEX IF NOT EXISTS idx_visa_consultation_seeker_id ON visa_consultation(seeker_id);
