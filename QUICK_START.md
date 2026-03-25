# 🚀 Quick Start Guide

## 1. Setup Database (First Time Only)

### Go to Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in sidebar

### Run Schema (Creates Tables)
1. Click "New Query"
2. Copy all content from `supabase-schema.sql`
3. Paste and click "Run"
4. Wait for success message

### Run Seed Data (Adds Sample Services)
1. Click "New Query" again
2. Copy all content from `supabase-seed.sql`
3. Paste and click "Run"
4. This adds 18 categories and 31 services

## 2. Create Your Account

1. Start your dev server: `npm run dev`
2. Open http://localhost:3000
3. Click "Get Started" or "Sign Up"
4. Register with your email and password

## 3. Make Yourself Admin

### In Supabase SQL Editor:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```
Replace `your-email@example.com` with your actual email.

## 4. Access Admin Panel

1. Refresh your website (F5)
2. Look for "Admin Panel" in the sidebar (shield icon)
3. Click it to access `/admin`

## 🎉 Done!

You now have full admin access to:
- Manage users (roles, status, balance)
- Manage services (enable/disable, delete)
- Execute SQL queries
- Download database files

## Need Help?

- **Detailed Setup**: See `ADMIN_SETUP_GUIDE.md`
- **Admin Features**: See `ADMIN_PANEL.md`
- **Database Info**: See `DATABASE_SETUP.md`
- **Integration Details**: See `INTEGRATION_SUMMARY.md`

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Make sure `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=your-database-url
```
