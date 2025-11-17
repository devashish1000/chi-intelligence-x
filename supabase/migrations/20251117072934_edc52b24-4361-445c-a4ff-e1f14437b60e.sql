-- Create provider profiles table
CREATE TABLE public.provider_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  license_number text NOT NULL,
  license_state text NOT NULL,
  specialties text[] NOT NULL DEFAULT '{}',
  years_experience text NOT NULL,
  availability text[] NOT NULL DEFAULT '{}',
  session_types text[] NOT NULL DEFAULT '{}',
  accepts_insurance text NOT NULL,
  languages text[] NOT NULL DEFAULT '{}',
  therapeutic_approaches text[] NOT NULL DEFAULT '{}',
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only for public profiles)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.provider_profiles 
FOR SELECT 
USING (is_public = true);

-- Create policy for inserting profiles (anyone can create)
CREATE POLICY "Anyone can create a profile" 
ON public.provider_profiles 
FOR INSERT 
WITH CHECK (true);

-- Create policy for updating profiles (anyone can update for now)
CREATE POLICY "Anyone can update profiles" 
ON public.provider_profiles 
FOR UPDATE 
USING (true);

-- Create index on slug for faster lookups
CREATE INDEX idx_provider_profiles_slug ON public.provider_profiles(slug);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_provider_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_provider_profiles_updated_at
BEFORE UPDATE ON public.provider_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_provider_profile_updated_at();