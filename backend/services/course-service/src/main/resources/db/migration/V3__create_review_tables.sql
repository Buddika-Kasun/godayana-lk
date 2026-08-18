-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    user_id UUID NOT NULL,
    comment TEXT,
    rating DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_review_course_id ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_review_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_review_rating ON reviews(rating);

-- Add foreign key constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'fk_reviews_course'
                   AND table_name = 'reviews') THEN
        ALTER TABLE reviews
        ADD CONSTRAINT fk_reviews_course
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
    END IF;
END $$;