-- ============================================================================
-- RLS Policies for profiles table
-- ============================================================================

-- Allow public read access to all profiles (profiles are public)
CREATE POLICY "Allow public read access to profiles"
ON public.profiles
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Allow users to insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Allow users to update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own profile
CREATE POLICY "Allow users to delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================================================
-- RLS Policies for profile_links table
-- ============================================================================

-- Allow public read access to all profile links
CREATE POLICY "Allow public read access to profile_links"
ON public.profile_links
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert links for their own profile
CREATE POLICY "Allow users to insert links for their own profile"
ON public.profile_links
FOR INSERT
TO authenticated
WITH CHECK (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_links.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- Allow authenticated users to update links for their own profile
CREATE POLICY "Allow users to update links for their own profile"
ON public.profile_links
FOR UPDATE
TO authenticated
USING (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_links.profile_id
		AND profiles.user_id = auth.uid()
	)
)
WITH CHECK (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_links.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- Allow authenticated users to delete links for their own profile
CREATE POLICY "Allow users to delete links for their own profile"
ON public.profile_links
FOR DELETE
TO authenticated
USING (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_links.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- ============================================================================
-- RLS Policies for profile_interests table
-- ============================================================================

-- Allow public read access to all profile interests
CREATE POLICY "Allow public read access to profile_interests"
ON public.profile_interests
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert interests for their own profile
CREATE POLICY "Allow users to insert interests for their own profile"
ON public.profile_interests
FOR INSERT
TO authenticated
WITH CHECK (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_interests.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- Allow authenticated users to update interests for their own profile
CREATE POLICY "Allow users to update interests for their own profile"
ON public.profile_interests
FOR UPDATE
TO authenticated
USING (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_interests.profile_id
		AND profiles.user_id = auth.uid()
	)
)
WITH CHECK (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_interests.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- Allow authenticated users to delete interests for their own profile
CREATE POLICY "Allow users to delete interests for their own profile"
ON public.profile_interests
FOR DELETE
TO authenticated
USING (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_interests.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- ============================================================================
-- RLS Policies for profile_skills table
-- ============================================================================

-- Allow public read access to all profile skills
CREATE POLICY "Allow public read access to profile_skills"
ON public.profile_skills
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert skills for their own profile
CREATE POLICY "Allow users to insert skills for their own profile"
ON public.profile_skills
FOR INSERT
TO authenticated
WITH CHECK (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_skills.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- Allow authenticated users to update skills for their own profile
CREATE POLICY "Allow users to update skills for their own profile"
ON public.profile_skills
FOR UPDATE
TO authenticated
USING (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_skills.profile_id
		AND profiles.user_id = auth.uid()
	)
)
WITH CHECK (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_skills.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- Allow authenticated users to delete skills for their own profile
CREATE POLICY "Allow users to delete skills for their own profile"
ON public.profile_skills
FOR DELETE
TO authenticated
USING (
	EXISTS (
		SELECT 1 FROM public.profiles
		WHERE profiles.id = profile_skills.profile_id
		AND profiles.user_id = auth.uid()
	)
);

-- ============================================================================
-- RLS Policies for skills table (system table)
-- ============================================================================

-- Allow public read access to all skills
CREATE POLICY "Allow public read access to skills"
ON public.skills
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert new skills (for creating unapproved tags)
CREATE POLICY "Allow authenticated users to insert skills"
ON public.skills
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Note: Update and delete policies are intentionally omitted for skills
-- Only admins should modify approved skills (can be added later if needed)

-- ============================================================================
-- RLS Policies for interests table (system table)
-- ============================================================================

-- Allow public read access to all interests
CREATE POLICY "Allow public read access to interests"
ON public.interests
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert new interests (for creating unapproved tags)
CREATE POLICY "Allow authenticated users to insert interests"
ON public.interests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Note: Update and delete policies are intentionally omitted for interests
-- Only admins should modify approved interests (can be added later if needed)

