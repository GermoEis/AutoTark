ALTER TABLE discovered_claims ADD COLUMN IF NOT EXISTS research_job_id uuid REFERENCES research_jobs(id) ON DELETE CASCADE;
ALTER TABLE discovered_claims DROP CONSTRAINT IF EXISTS discovered_claims_claim_key_key;
CREATE UNIQUE INDEX IF NOT EXISTS discovered_claims_job_claim_key_unique ON discovered_claims(research_job_id, claim_key);
CREATE INDEX IF NOT EXISTS discovered_claims_research_job_id_idx ON discovered_claims(research_job_id);

CREATE TABLE IF NOT EXISTS saved_cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  listing_url text NOT NULL,
  listing_id text,
  title text,
  make text NOT NULL,
  model text NOT NULL,
  generation text,
  variant text,
  engine text,
  engine_code text,
  transmission text,
  year int,
  mileage_km int,
  price_eur numeric,
  location text,
  vin text,
  analysis_id uuid REFERENCES analysis_requests(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, listing_url)
);
CREATE INDEX IF NOT EXISTS saved_cars_client_id_idx ON saved_cars(client_id, created_at DESC);

CREATE TABLE IF NOT EXISTS comparison_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL UNIQUE,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS comparison_items (
  comparison_id uuid NOT NULL REFERENCES comparison_sets(id) ON DELETE CASCADE,
  saved_car_id uuid NOT NULL REFERENCES saved_cars(id) ON DELETE CASCADE,
  position int NOT NULL CHECK(position BETWEEN 0 AND 3),
  PRIMARY KEY(comparison_id, saved_car_id),
  UNIQUE(comparison_id, position)
);
