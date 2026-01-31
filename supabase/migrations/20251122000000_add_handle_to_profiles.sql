-- Add handle field to profiles table
ALTER TABLE profiles
ADD COLUMN handle TEXT UNIQUE;

-- Create index on handle for faster lookups
CREATE INDEX idx_profiles_handle ON profiles(handle);

-- Add constraint to ensure handle is lowercase and alphanumeric with underscores/hyphens
-- This will be enforced at the application level, but we can add a check constraint
ALTER TABLE profiles
ADD CONSTRAINT handle_format_check CHECK (
	handle IS NULL OR (
		handle ~ '^[a-z0-9_-]+$' AND
		LENGTH(handle) >= 3 AND
		LENGTH(handle) <= 30
	)
);

