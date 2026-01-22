-- Create talk_submissions table
CREATE TABLE talk_submissions (
	id BIGSERIAL PRIMARY KEY,
	profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	
	-- Contact Information
	phone_number TEXT NOT NULL,
	
	-- Talk Details
	talk_title TEXT NOT NULL,
	talk_synopsis TEXT NOT NULL,
	
	-- Slides (either URL or file path)
	slides_type TEXT NOT NULL CHECK (slides_type IN ('url', 'upload')),
	slides_url TEXT,
	slides_file_path TEXT, -- Path in storage bucket if uploaded
	
	-- Status Workflow
	status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'scheduled', 'completed', 'cancelled')),
	
	-- Scheduling
	scheduled_date TIMESTAMPTZ, -- Set when talk is approved/scheduled
	
	-- Admin Notes (for internal use)
	admin_notes TEXT,
	reviewed_by UUID REFERENCES auth.users(id),
	reviewed_at TIMESTAMPTZ,
	
	-- Timestamps
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	
	-- Constraints
	CONSTRAINT slides_url_or_file CHECK (
		(slides_type = 'url' AND slides_url IS NOT NULL AND slides_file_path IS NULL) OR
		(slides_type = 'upload' AND slides_file_path IS NOT NULL AND slides_url IS NULL)
	)
);

-- Indexes
CREATE INDEX idx_talk_submissions_profile_id ON talk_submissions(profile_id);
CREATE INDEX idx_talk_submissions_user_id ON talk_submissions(user_id);
CREATE INDEX idx_talk_submissions_status ON talk_submissions(status);
CREATE INDEX idx_talk_submissions_scheduled_date ON talk_submissions(scheduled_date);
CREATE INDEX idx_talk_submissions_created_at ON talk_submissions(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_talk_submissions_updated_at
	BEFORE UPDATE ON talk_submissions
	FOR EACH ROW
	EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE talk_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own submissions
CREATE POLICY "Users can insert their own talk submissions"
	ON talk_submissions
	FOR INSERT
	TO authenticated
	WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own submissions
CREATE POLICY "Users can view their own talk submissions"
	ON talk_submissions
	FOR SELECT
	TO authenticated
	USING (auth.uid() = user_id);

-- Policy: Users can update their own pending submissions
CREATE POLICY "Users can update their own pending submissions"
	ON talk_submissions
	FOR UPDATE
	TO authenticated
	USING (auth.uid() = user_id AND status = 'pending')
	WITH CHECK (auth.uid() = user_id AND status = 'pending');

