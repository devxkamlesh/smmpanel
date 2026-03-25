# Admin Panel Setup Guide

## Quick Start: How to Access Admin Panel

### Step 1: Create Your Account
1. Go to your website: `http://localhost:3000` (or your deployed URL)
2. Click "Get Started" or "Sign Up"
3. Register with your email and password
4. You'll be automatically logged in

### Step 2: Make Your Account Admin

You have 3 options to grant admin access:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Go to "SQL Editor" in the left sidebar
4. Click "New Query"
5. Paste this SQL and replace with your email:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

6. Click "Run" or press `Ctrl+Enter`
7. You should see "Success. 1 rows affected"

#### Option B: Using Table Editor
1. Go to Supabase Dashboard
2. Click "Table Editor" in left sidebar
3. Select "profiles" table
4. Find your user row
5. Click on the "role" cell
6. Change from "user" to "admin"
7. Press Enter to save

#### Option C: Using the SQL file provided
1. Open `make-admin.sql` file in this project
2. Copy the appropriate query
3. Run it in Supabase SQL Editor

### Step 3: Access Admin Panel
1. Refresh your website (press F5)
2. You should now see "Admin Panel" link in the sidebar (with shield icon)
3. Click it to access `/admin`

## Admin Panel Features

Once you have admin access, you can:

### 1. Dashboard (`/admin`)
- View statistics (users, orders, revenue)
- See recent activity
- Quick action links

### 2. User Management (`/admin/users`)
- View all registered users
- Change user roles (user → admin → reseller)
- Update user status (active/suspended/banned)
- Edit user balance
- Delete users

### 3. Service Management (`/admin/services`)
- View all services
- Enable/disable services
- Delete services

### 4. SQL Manager (`/admin/sql`)
- Download schema and seed SQL files
- Execute SELECT queries to view data
- Execute DELETE queries to remove data
- Predefined queries for common tasks

## Database Setup

### Initial Setup (First Time)

1. **Run Schema SQL** (creates tables):
   - Go to Supabase Dashboard → SQL Editor
   - Click "New Query"
   - Copy entire content from `supabase-schema.sql`
   - Click "Run"
   - Wait for "Success" message

2. **Run Seed SQL** (adds sample data):
   - Click "New Query" again
   - Copy entire content from `supabase-seed.sql`
   - Click "Run"
   - This adds 18 categories and 31 services

3. **Make yourself admin**:
   - Run the query from Step 2 above

### Reset Database (Remove All Data)

If you want to start fresh:

```sql
-- Delete all data (run in order)
DELETE FROM ticket_messages;
DELETE FROM tickets;
DELETE FROM auto_subscriptions;
DELETE FROM user_favorites;
DELETE FROM transactions;
DELETE FROM orders;
DELETE FROM services;
DELETE FROM categories;
DELETE FROM profiles WHERE role != 'admin';  -- Keep admin accounts

-- Or to delete EVERYTHING including admins:
DELETE FROM ticket_messages;
DELETE FROM tickets;
DELETE FROM auto_subscriptions;
DELETE FROM user_favorites;
DELETE FROM transactions;
DELETE FROM orders;
DELETE FROM services;
DELETE FROM categories;
DELETE FROM profiles;
```

Then re-run the seed SQL to add sample data back.

## Common Issues & Solutions

### Issue: "Admin Panel" link not showing
**Solution:**
- Make sure you ran the UPDATE query to set role = 'admin'
- Refresh the page (F5)
- Log out and log back in
- Check Supabase Table Editor to verify role is 'admin'

### Issue: Can't access `/admin` - redirected to home
**Solution:**
- Your role is not set to 'admin'
- Run the UPDATE query again
- Verify in Supabase Table Editor

### Issue: SQL queries not working in admin panel
**Solution:**
- The built-in SQL manager only supports simple SELECT and DELETE
- For complex queries (UPDATE, INSERT, JOIN), use Supabase SQL Editor directly
- Check the error message for details

### Issue: No users showing in admin panel
**Solution:**
- Make sure you've registered at least one account
- Check if profiles table has data in Supabase Table Editor
- Verify RLS policies are set up correctly (run schema.sql)

## Quick Reference: SQL Queries

### View all users
```sql
SELECT id, username, email, role, status, balance, created_at 
FROM profiles 
ORDER BY created_at DESC;
```

### View all orders
```sql
SELECT o.id, o.link, o.quantity, o.charge, o.status, o.created_at,
       p.username, s.name as service_name
FROM orders o
JOIN profiles p ON o.user_id = p.id
JOIN services s ON o.service_id = s.id
ORDER BY o.created_at DESC;
```

### View all services
```sql
SELECT s.id, s.name, s.rate, s.is_active, c.name as category
FROM services s
JOIN categories c ON s.category_id = c.id
ORDER BY s.id;
```

### Make multiple users admin
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email IN ('user1@example.com', 'user2@example.com');
```

### Reset all user balances
```sql
UPDATE profiles 
SET balance = 0.00 
WHERE role = 'user';
```

### Delete test users
```sql
DELETE FROM profiles 
WHERE username LIKE 'test%' OR email LIKE 'test%';
```

## Security Best Practices

1. **Limit admin accounts** - Only make trusted users admin
2. **Backup before deleting** - Always backup before running DELETE queries
3. **Use Supabase backups** - Enable automatic backups in Supabase settings
4. **Monitor admin activity** - Check who accesses admin features
5. **Secure your .env.local** - Never commit database credentials to git

## Next Steps

After setting up admin access:

1. ✅ Test user management - Create a test user and modify it
2. ✅ Test service management - Toggle a service on/off
3. ✅ Download SQL files - Use the SQL Manager to download schema/seed
4. ✅ Run sample queries - Try the predefined queries
5. ✅ Customize services - Add your own services via Supabase

## Support

If you need help:
- Check `ADMIN_PANEL.md` for detailed feature documentation
- Check `DATABASE_SETUP.md` for database configuration
- Check `INTEGRATION_SUMMARY.md` for system overview
- Review Supabase logs for errors
