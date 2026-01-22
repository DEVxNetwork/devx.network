-- Create profiles table combining member and member_profile
CREATE TABLE profiles (
	id BIGSERIAL PRIMARY KEY,
	user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
	email TEXT NOT NULL,
	full_name TEXT NOT NULL,
	profile_photo TEXT,
	title TEXT,
	affiliation TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Create index on email for lookups
CREATE INDEX idx_profiles_email ON profiles(email);

-- Migrate data from member and member_profile to profiles
INSERT INTO profiles (user_id, email, full_name, profile_photo, title, affiliation, created_at, updated_at)
SELECT 
	m.user_id,
	m.email,
	m.full_name,
	mp.profile_photo,
	mp.title,
	mp.affiliation,
	m.created_at,
	COALESCE(mp.updated_at, m.updated_at)
FROM member m
LEFT JOIN member_profile mp ON mp.member_id = m.id
WHERE m.user_id IS NOT NULL;

-- Drop old tables (cascade will handle foreign keys)
DROP TABLE IF EXISTS member_profile CASCADE;
DROP TABLE IF EXISTS member CASCADE;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
	BEFORE UPDATE ON profiles
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

-- Update the trigger function to create profiles instead of member/member_profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
	-- Check if profile already exists for this user
	IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
		-- Insert profile with OAuth metadata
		INSERT INTO public.profiles (user_id, email, full_name, profile_photo)
		VALUES (
			NEW.id,
			NEW.email,
			COALESCE(
				NEW.raw_user_meta_data->>'full_name',
				NEW.raw_user_meta_data->>'name',
				NEW.raw_user_meta_data->>'display_name',
				SPLIT_PART(NEW.email, '@', 1)
			),
			COALESCE(
				NEW.raw_user_meta_data->>'avatar_url',
				NEW.raw_user_meta_data->>'picture'
			)
		);
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

