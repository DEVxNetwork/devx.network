-- Create profile_links table
CREATE TABLE profile_links (
	id BIGSERIAL PRIMARY KEY,
	profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	url TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE(profile_id, url)
);

-- Create index for faster lookups
CREATE INDEX idx_profile_links_profile_id ON profile_links(profile_id);

