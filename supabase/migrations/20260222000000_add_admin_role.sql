-- Add is_admin column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for quick admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin)
WHERE is_admin = TRUE;

-- Prevent non-privileged users from setting or changing is_admin
CREATE OR REPLACE FUNCTION protect_is_admin()
RETURNS TRIGGER AS $$
BEGIN
	IF coalesce(current_setting('role', true), '') != 'service_role'
		AND session_user NOT IN ('postgres', 'supabase_admin') THEN
		IF TG_OP = 'INSERT' AND NEW.is_admin = TRUE THEN
			RAISE EXCEPTION 'Only service_role can set is_admin';
		ELSIF TG_OP = 'UPDATE' AND NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
			RAISE EXCEPTION 'Only service_role can modify is_admin';
		END IF;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

DROP TRIGGER IF EXISTS protect_is_admin_trigger ON profiles;
CREATE TRIGGER protect_is_admin_trigger
	BEFORE INSERT OR UPDATE ON profiles
	FOR EACH ROW
	EXECUTE FUNCTION protect_is_admin();

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
