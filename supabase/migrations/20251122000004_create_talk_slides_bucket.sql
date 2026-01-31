-- Create a storage bucket for talk slides
INSERT INTO storage.buckets (id, name, public)
VALUES ('talk-slides', 'talk-slides', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the talk-slides bucket

-- Allow public read access to talk slides
CREATE POLICY "Talk slides are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'talk-slides' );

-- Allow authenticated users to upload talk slides
CREATE POLICY "Users can upload talk slides"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'talk-slides' AND
    auth.role() = 'authenticated'
  );

-- Allow users to update their own talk slides
CREATE POLICY "Users can update their own talk slides"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'talk-slides' AND
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own talk slides
CREATE POLICY "Users can delete their own talk slides"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'talk-slides' AND
    auth.role() = 'authenticated'
  );

