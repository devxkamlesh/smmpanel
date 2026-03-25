# 📋 How to Access Admin Panel - Step by Step

## Prerequisites
- ✅ Database is set up (schema.sql and seed.sql executed)
- ✅ Application is running (`npm run dev`)
- ✅ You have registered an account

## Method 1: Using Supabase Dashboard (Easiest)

### Step 1: Go to Supabase
1. Open https://supabase.com/dashboard
2. Sign in to your account
3. Select your SMM Panel project

### Step 2: Open Table Editor
1. Click "Table Editor" in the left sidebar
2. Click on "profiles" table
3. You'll see all registered users

### Step 3: Make User Admin
1. Find your user row (look for your email or username)
2. Click on the "role" cell in your row
3. A dropdown will appear
4. Select "admin" from the dropdown
5. Press Enter or click outside to save
6. You'll see a green success message

### Step 4: Access Admin Panel
1. Go back to your website
2. Press F5 to refresh the page
3. Look at the sidebar - you should now see "Admin Panel" with a shield icon
4. Click it to access `/admin`

## Method 2: Using SQL Editor

### Step 1: Open SQL Editor
1. Go to Supabase Dashboard
2. Click "SQL Editor" in left sidebar
3. Click "New Query"

### Step 2: Run Admin Query
Copy and paste this (replace with your email):

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Step 3: Execute
1. Click "Run" button or press Ctrl+Enter
2. You should see "Success. 1 rows affected"

### Step 4: Verify
Run this to confirm:
```sql
SELECT username, email, role 
FROM profiles 
WHERE role = 'admin';
```

You should see your account listed.

### Step 5: Access Admin Panel
1. Refresh your website (F5)
2. Click "Admin Panel" in sidebar
3. You're in!

## Method 3: Using Downloaded SQL File

### Step 1: Download File
1. The file `make-admin.sql` is in your project root
2. Or download it from admin panel (once you have access)

### Step 2: Edit File
Open `make-admin.sql` and choose one option:

**Option A - By Email:**
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

**Option B - By Username:**
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE username = 'your-username';
```

**Option C - First User:**
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1);
```

### Step 3: Run in Supabase
1. Copy your chosen query
2. Go to Supabase SQL Editor
3. Paste and run

## Troubleshooting

### ❌ "Admin Panel" link not showing

**Check 1: Verify Role**
```sql
SELECT username, email, role FROM profiles WHERE email = 'your-email@example.com';
```
Role should be 'admin', not 'user'

**Check 2: Clear Cache**
- Press Ctrl+Shift+R (hard refresh)
- Or clear browser cache
- Or try incognito mode

**Check 3: Log Out and Back In**
- Click "Sign out"
- Log back in with your credentials

### ❌ Redirected when accessing /admin

**Solution:**
Your role is not 'admin'. Run the UPDATE query again.

### ❌ Can't find my user in profiles table

**Solution:**
You haven't registered yet. Go to `/register` and create an account first.

### ❌ Multiple users, which one is me?

**Solution:**
Look for your email address in the email column, or check the most recent created_at timestamp.

## Quick Verification Checklist

Run these queries to verify everything:

```sql
-- 1. Check if profiles table exists
SELECT COUNT(*) FROM profiles;

-- 2. Check your user exists
SELECT * FROM profiles WHERE email = 'your-email@example.com';

-- 3. Check admin users
SELECT username, email, role FROM profiles WHERE role = 'admin';

-- 4. Check all roles
SELECT role, COUNT(*) as count FROM profiles GROUP BY role;
```

## What You Can Do as Admin

Once you have admin access:

### User Management (`/admin/users`)
- View all users
- Change roles: user ↔ reseller ↔ admin
- Update status: active / suspended / banned
- Modify user balance
- Delete users

### Service Management (`/admin/services`)
- View all services
- Enable/disable services
- Delete services
- See service details (rate, min/max, category)

### SQL Manager (`/admin/sql`)
- Download schema, seed, and make-admin SQL files
- Execute SELECT queries (view data)
- Execute DELETE queries (remove data)
- Use predefined queries
- Clear test data

### Dashboard (`/admin`)
- View statistics (users, orders, revenue)
- See recent activity
- Quick action links

## Security Notes

⚠️ **Important:**
- Only make trusted users admin
- Admin can delete users and data
- Admin can modify balances
- Keep your admin credentials secure
- Don't share admin access

## Need More Help?

📚 **Documentation:**
- `QUICK_START.md` - Fast setup guide
- `ADMIN_SETUP_GUIDE.md` - Detailed admin setup
- `ADMIN_PANEL.md` - Feature documentation
- `DATABASE_SETUP.md` - Database configuration

💡 **Tips:**
- Bookmark `/admin` for quick access
- Use predefined queries in SQL Manager
- Backup before deleting data
- Test on a test user first

## Success! 🎉

You should now have:
- ✅ Admin role assigned
- ✅ Admin Panel link visible in sidebar
- ✅ Access to `/admin` routes
- ✅ Full management capabilities

Enjoy managing your SMM Panel!
