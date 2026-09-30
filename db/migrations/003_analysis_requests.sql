CREATE TABLE IF NOT EXISTS analysis_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), listing_url text NOT NULL, listing_id text, title text,
  make text NOT NULL, model text NOT NULL, generation text, variant text, engine text, engine_code text,
  transmission text, year int, mileage_km int, price_eur numeric, location text,
  research_job_id uuid REFERENCES research_jobs(id),
  status text NOT NULL DEFAULT 'confirming' CHECK(status IN ('confirming','researching','completed','needs_review','failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
