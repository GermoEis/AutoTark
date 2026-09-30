ALTER TABLE discovered_claims ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en';
