-- Add user_id foreign key to member table (nullable initially)
ALTER TABLE member
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique index on user_id (allows NULL)
CREATE UNIQUE INDEX idx_member_user_id ON member(user_id)
WHERE user_id IS NOT NULL;

-- Update existing members to link to auth.users by email
-- This assumes email matches between member and auth.users
UPDATE member
SET user_id = (
	SELECT id
	FROM auth.users
	WHERE auth.users.email = member.email
	LIMIT 1
)
WHERE user_id IS NULL;

-- Delete any members that don't have a matching auth.users
-- (These would be orphaned records from before OAuth was set up)
DELETE FROM member
WHERE user_id IS NULL;

-- Now make user_id NOT NULL since we've cleaned up orphaned records
ALTER TABLE member
ALTER COLUMN user_id SET NOT NULL;

-- Recreate index as regular unique index (not partial) now that NULLs are gone
DROP INDEX idx_member_user_id;
CREATE UNIQUE INDEX idx_member_user_id ON member(user_id);

-- Update the trigger function to use user_id and check if member exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
	-- Check if member already exists for this user
	IF NOT EXISTS (SELECT 1 FROM public.member WHERE user_id = NEW.id) THEN
		-- Insert member with user_id FK
		INSERT INTO public.member (user_id, email, full_name)
		VALUES (
			NEW.id,
			NEW.email,
			COALESCE(
				NEW.raw_user_meta_data->>'full_name',
				NEW.raw_user_meta_data->>'name',
				NEW.raw_user_meta_data->>'display_name',
				SPLIT_PART(NEW.email, '@', 1)
			)
		);

		-- Create the profile entry linked to the member
		INSERT INTO public.member_profile (member_id, profile_photo)
		SELECT id, NEW.raw_user_meta_data->>'avatar_url'
		FROM public.member
		WHERE user_id = NEW.id
		LIMIT 1;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

