-- Seeker profiles table
CREATE TABLE IF NOT EXISTS seeker_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    full_name VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(20),
    profile_pic_url VARCHAR(500),
    resume_url VARCHAR(500),
    skills TEXT[],
    experience_years INTEGER,
    education VARCHAR(500),
    study_field VARCHAR(200),
    location VARCHAR(200),
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100),
    employment_status VARCHAR(50),
    current_job_title VARCHAR(200),
    current_salary DECIMAL(10,2),
    expected_salary DECIMAL(10,2),
    notice_period VARCHAR(50),
    portfolio_url VARCHAR(500),
    professional_summary TEXT,
    preferred_job_categories TEXT[],
    share_cv BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company profiles table
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    company_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(100),
    website VARCHAR(200),
    logo_url VARCHAR(500),
    description TEXT,
    industry VARCHAR(100),
    company_type VARCHAR(50),
    employee_count VARCHAR(50),
    location VARCHAR(200),
    company_email VARCHAR(255),
    hotline_number VARCHAR(20),
    facebook_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    instagram_url VARCHAR(500),
    contact_person_name VARCHAR(200),
    designation VARCHAR(100),
    cv_delivery_email VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO seeker_profiles (
    id,
    user_id,
    full_name,
    phone,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'DEV User',
    '+94123456789',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (user_id) DO NOTHING;


INSERT INTO company_profiles (
    id,
    user_id,
    company_name,
    company_email,
    hotline_number,
    contact_person_name,
    designation,
    is_verified,
    status,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'DEV User',
    'dev@godayana.lk',
    '+94123456789',
    'DEV User',
    'Lead Developer',
    true,
    'APPROVED',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO seeker_profiles (
    id,
    user_id,
    full_name,
    phone,
    created_at,
    updated_at
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'SEEKER',
    '+94000000000',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO company_profiles (
    id,
    user_id,
    company_name,
    company_email,
    hotline_number,
    contact_person_name,
    designation,
    is_verified,
    status,
    created_at,
    updated_at
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    'COMPANY',
    'company@godayana.lk',
    '+94773333333',
    'COMPANY User',
    'HR',
    true,
    'APPROVED',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (user_id) DO NOTHING;