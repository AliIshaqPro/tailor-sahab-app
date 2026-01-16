-- Fix RLS policies for proper authentication
-- Drop existing permissive policies

DROP POLICY IF EXISTS "Allow public access to customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all access to app_settings" ON public.app_settings;

-- Create new policies requiring authentication
CREATE POLICY "Authenticated users can access customers" 
ON public.customers 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access orders" 
ON public.orders 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Block direct access to app_settings - will use edge function
CREATE POLICY "No direct access to app_settings" 
ON public.app_settings 
FOR ALL 
USING (false)
WITH CHECK (false);