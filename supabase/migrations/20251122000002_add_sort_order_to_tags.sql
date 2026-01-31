-- Add sort_order column to profile_interests junction table
ALTER TABLE profile_interests
ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

-- Add sort_order column to profile_skills junction table
ALTER TABLE profile_skills
ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

-- Create indexes for sort_order to improve query performance
CREATE INDEX idx_profile_interests_sort_order ON profile_interests(profile_id, sort_order);
CREATE INDEX idx_profile_skills_sort_order ON profile_skills(profile_id, sort_order);

-- Update existing records to have sequential sort_order based on created_at
WITH ranked_interests AS (
	SELECT
		id,
		ROW_NUMBER() OVER (PARTITION BY profile_id ORDER BY created_at) - 1 AS new_sort_order
	FROM profile_interests
)
UPDATE profile_interests
SET sort_order = ranked_interests.new_sort_order
FROM ranked_interests
WHERE profile_interests.id = ranked_interests.id;

WITH ranked_skills AS (
	SELECT
		id,
		ROW_NUMBER() OVER (PARTITION BY profile_id ORDER BY created_at) - 1 AS new_sort_order
	FROM profile_skills
)
UPDATE profile_skills
SET sort_order = ranked_skills.new_sort_order
FROM ranked_skills
WHERE profile_skills.id = ranked_skills.id;

