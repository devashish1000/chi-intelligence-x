-- Allow authenticated users to read their own profiles
CREATE POLICY "Users can read their own profile"
ON public.provider_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);