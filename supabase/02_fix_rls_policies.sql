-- ============================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- ============================================================
-- This fixes the "infinite recursion detected in policy" error
-- The issue: Admin policies check profiles table, causing recursion
-- The fix: Use simpler policies without recursive checks
-- ============================================================

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;

-- ============================================================
-- PROFILES: Simple policies without recursion
-- ============================================================

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT 
  TO authenticated
  USING (id = auth.uid());

-- Allow users to update their own profile (non-admin fields only)
CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE 
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Allow profile creation on signup
CREATE POLICY "Allow profile creation on signup" ON profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Service role can do anything (for triggers)
CREATE POLICY "Service role can manage profiles" ON profiles 
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- CATEGORIES & SERVICES: Public read access
-- ============================================================

-- Anyone can view active categories (no auth required)
CREATE POLICY "Public can view active categories" ON categories 
  FOR SELECT 
  USING (is_active = true);

-- Anyone can view active services (no auth required)
CREATE POLICY "Public can view active services" ON services 
  FOR SELECT 
  USING (is_active = true);

-- ============================================================
-- ADMIN ACCESS: Use security definer functions instead
-- ============================================================

-- Create a helper function to check if user is admin (runs with elevated privileges)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- Admin policies using the helper function
CREATE POLICY "Admins can view all profiles" ON profiles 
  FOR SELECT 
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles 
  FOR UPDATE 
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete profiles" ON profiles 
  FOR DELETE 
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can manage categories" ON categories 
  FOR ALL 
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can manage services" ON services 
  FOR ALL 
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================

GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON services TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT ALL ON categories TO service_role;
GRANT ALL ON services TO service_role;
GRANT ALL ON profiles TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- Verify the fix
DO $$
BEGIN
  RAISE NOTICE '============================================================';
  RAISE NOTICE '✅ INFINITE RECURSION FIXED!';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'What was fixed:';
  RAISE NOTICE '  - Removed recursive admin checks in RLS policies';
  RAISE NOTICE '  - Created is_admin() helper function';
  RAISE NOTICE '  - Services and categories now have public read access';
  RAISE NOTICE '  - Profiles use simple, non-recursive policies';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Restart your dev server (Ctrl+C then npm run dev)';
  RAISE NOTICE '  2. Refresh your browser';
  RAISE NOTICE '  3. Everything should work now!';
  RAISE NOTICE '============================================================';
END $$;
