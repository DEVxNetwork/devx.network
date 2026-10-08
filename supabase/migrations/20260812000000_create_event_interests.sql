-- Store per-account "interested" flags for Luma events (events live in JSON/Luma, not Postgres).
CREATE TABLE event_interests (
	id BIGSERIAL PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	event_id TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT event_interests_user_event_unique UNIQUE (user_id, event_id)
);

CREATE INDEX idx_event_interests_user_id ON event_interests(user_id);
CREATE INDEX idx_event_interests_event_id ON event_interests(event_id);
CREATE INDEX idx_event_interests_profile_id ON event_interests(profile_id);

ALTER TABLE event_interests ENABLE ROW LEVEL SECURITY;

-- Interests are private to the owning account
CREATE POLICY "Users can view their own event interests"
	ON event_interests
	FOR SELECT
	TO authenticated
	USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own event interests"
	ON event_interests
	FOR INSERT
	TO authenticated
	WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event interests"
	ON event_interests
	FOR DELETE
	TO authenticated
	USING (auth.uid() = user_id);
