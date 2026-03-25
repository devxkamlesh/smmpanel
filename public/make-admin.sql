-- ============================================================
-- Make User Admin - Run this in Supabase SQL Editor
-- ============================================================

-- Option 1: Make admin by email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Option 2: Make admin by username
UPDATE profiles 
SET role = 'admin' 
WHERE username = 'your-username';

-- Option 3: Make the first registered user admin
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);

-- Verify the change
SELECT id, username, email, role, status 
FROM profiles 
WHERE role = 'admin';
