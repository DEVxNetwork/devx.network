-- Add is_admin column to profiles table
ALTER TABLE profiles
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for quick admin lookups
CREATE INDEX idx_profiles_is_admin ON profiles(is_admin)
WHERE is_admin = TRUE;

-- Allow admins to read ALL talk submissions (not just their own)
CREATE POLICY "Admins can view all talk submissions"
	ON talk_submissions
	FOR SELECT
	TO authenticated
	USING (
		EXISTS (
			SELECT 1 FROM profiles
			WHERE profiles.user_id = auth.uid()
			AND profiles.is_admin = TRUE
		)
	);

-- Allow admins to update any talk submission (status, admin_notes, reviewed_by, reviewed_at)
CREATE POLICY "Admins can update any talk submission"
	ON talk_submissions
	FOR UPDATE
	TO authenticated
	USING (
		EXISTS (
			SELECT 1 FROM profiles
			WHERE profiles.user_id = auth.uid()
			AND profiles.is_admin = TRUE
		)
	)
	WITH CHECK (
		EXISTS (
			SELECT 1 FROM profiles
			WHERE profiles.user_id = auth.uid()
			AND profiles.is_admin = TRUE
		)
	);
