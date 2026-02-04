-- Create profile_photos table
-- Stores a hash of the original image as the primary key.
-- Resized variants are stored in the avatars bucket under photos/{hash}/{size}.webp
-- and can be resolved via URL convention, keeping the profiles table lean.

CREATE TABLE profile_photos (
  id TEXT PRIMARY KEY,              -- SHA-256 hex digest of the original image bytes
  original_width INTEGER NOT NULL,
  original_height INTEGER NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add photo_id to profiles so we can look up sized variants by hash
ALTER TABLE profiles ADD COLUMN photo_id TEXT REFERENCES profile_photos(id);

-- RLS --

ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can read photos (they are public profile images)
CREATE POLICY "Photos are publicly readable"
  ON profile_photos FOR SELECT
  USING (true);

-- Authenticated users can insert new photos
CREATE POLICY "Authenticated users can insert photos"
  ON profile_photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
