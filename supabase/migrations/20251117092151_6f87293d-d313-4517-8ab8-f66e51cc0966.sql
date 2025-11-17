-- Fix the view to use SECURITY INVOKER instead of SECURITY DEFINER
-- This ensures the view uses the permissions of the querying user, not the view creator
ALTER VIEW public.provider_profiles_public SET (security_invoker = true);