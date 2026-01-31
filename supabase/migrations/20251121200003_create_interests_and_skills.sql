-- Create interests table
CREATE TABLE interests (
	id BIGSERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	approved BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create skills table
CREATE TABLE skills (
	id BIGSERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE,
	approved BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create junction table for profile interests
CREATE TABLE profile_interests (
	id BIGSERIAL PRIMARY KEY,
	profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	interest_id BIGINT NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE(profile_id, interest_id)
);

-- Create junction table for profile skills
CREATE TABLE profile_skills (
	id BIGSERIAL PRIMARY KEY,
	profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE(profile_id, skill_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_interests_name ON interests(name);
CREATE INDEX idx_interests_approved ON interests(approved);
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_approved ON skills(approved);
CREATE INDEX idx_profile_interests_profile_id ON profile_interests(profile_id);
CREATE INDEX idx_profile_interests_interest_id ON profile_interests(interest_id);
CREATE INDEX idx_profile_skills_profile_id ON profile_skills(profile_id);
CREATE INDEX idx_profile_skills_skill_id ON profile_skills(skill_id);

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_interests_updated_at
	BEFORE UPDATE ON interests
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
	BEFORE UPDATE ON skills
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

