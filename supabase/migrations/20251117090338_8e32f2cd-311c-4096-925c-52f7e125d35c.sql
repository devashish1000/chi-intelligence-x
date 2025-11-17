-- Add user_id column to track ownership
ALTER TABLE public.provider_profiles 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX idx_provider_profiles_user_id ON public.provider_profiles(user_id);

-- Drop the old permissive policies
DROP POLICY IF EXISTS "Anyone can create a profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.provider_profiles;

-- Create secure ownership-based policies
CREATE POLICY "Authenticated users can create their own profile"
ON public.provider_profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.provider_profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
ON public.provider_profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Keep the public SELECT policy for public profiles (unchanged)
-- "Public profiles are viewable by everyone" policy already exists