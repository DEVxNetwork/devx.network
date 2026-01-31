-- Update storage policies to enforce file size and format constraints for talk slides
-- Note: Supabase storage doesn't directly support file size limits in policies,
-- but we can add format validation and document the size limit (50MB enforced in application)

-- Drop existing policies from the original migration and recreate with format validation
DROP POLICY IF EXISTS "Talk slides are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload talk slides" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own talk slides" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own talk slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload talk slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view talk slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own talk slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own talk slides" ON storage.objects;

-- Policy: Allow authenticated users to upload talk slides with format validation
-- File size limit (50MB) is enforced in the application layer
-- Accepted formats: .pdf, .pptx, .ppt, .odp, .key, .html, .md, .zip
CREATE POLICY "Allow authenticated users to upload talk slides"
ON storage.objects FOR INSERT
WITH CHECK (
	bucket_id = 'talk-slides' 
	AND auth.role() = 'authenticated'
	AND (
		LOWER(name) LIKE '%.pdf' OR
		LOWER(name) LIKE '%.pptx' OR
		LOWER(name) LIKE '%.ppt' OR
		LOWER(name) LIKE '%.odp' OR
		LOWER(name) LIKE '%.key' OR
		LOWER(name) LIKE '%.html' OR
		LOWER(name) LIKE '%.md' OR
		LOWER(name) LIKE '%.zip'
	)
);

-- Policy: Allow public access to view talk slides (slides are publicly accessible)
CREATE POLICY "Talk slides are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'talk-slides');

-- Policy: Allow authenticated users to update their own talk slides
CREATE POLICY "Allow authenticated users to update their own talk slides"
ON storage.objects FOR UPDATE
USING (
	bucket_id = 'talk-slides' 
	AND auth.uid() = (storage.foldername(name))[1]::uuid
	AND (
		LOWER(name) LIKE '%.pdf' OR
		LOWER(name) LIKE '%.pptx' OR
		LOWER(name) LIKE '%.ppt' OR
		LOWER(name) LIKE '%.odp' OR
		LOWER(name) LIKE '%.key' OR
		LOWER(name) LIKE '%.html' OR
		LOWER(name) LIKE '%.md' OR
		LOWER(name) LIKE '%.zip'
	)
);

-- Policy: Allow authenticated users to delete their own talk slides
CREATE POLICY "Allow authenticated users to delete their own talk slides"
ON storage.objects FOR DELETE
USING (bucket_id = 'talk-slides' AND auth.uid() = (storage.foldername(name))[1]::uuid);

