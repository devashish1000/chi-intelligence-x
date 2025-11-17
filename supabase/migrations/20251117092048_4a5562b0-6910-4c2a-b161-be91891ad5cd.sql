-- 1. Create a public view that excludes sensitive PII fields
-- Views inherit RLS from the underlying table, so no policy needed on the view
CREATE VIEW public.provider_profiles_public AS
SELECT 
  id, 
  slug, 
  first_name, 
  last_name,
  specialties, 
  years_experience, 
  availability,
  session_types, 
  accepts_insurance, 
  languages,
  therapeutic_approaches, 
  is_public, 
  created_at,
  updated_at
FROM public.provider_profiles
WHERE is_public = true;

-- 2. Make user_id NOT NULL to enforce ownership
-- First update any NULL values (shouldn't be any with current code)
UPDATE public.provider_profiles 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid
WHERE user_id IS NULL;

-- Now make the column NOT NULL
ALTER TABLE public.provider_profiles 
ALTER COLUMN user_id SET NOT NULL;

-- Ensure the foreign key constraint is properly set
ALTER TABLE public.provider_profiles
DROP CONSTRAINT IF EXISTS provider_profiles_user_id_fkey;

ALTER TABLE public.provider_profiles
ADD CONSTRAINT provider_profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;