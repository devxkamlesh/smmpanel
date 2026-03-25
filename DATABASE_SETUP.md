# Database Setup Instructions

## Step 1: Run the Schema

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase-schema.sql`
4. Paste and run it in the SQL Editor

This will create all the necessary tables, indexes, RLS policies, and triggers.

## Step 2: Seed Sample Data

1. In the SQL Editor, create a new query
2. Copy the contents of `supabase-seed.sql`
3. Paste and run it

This will populate your database with:
- 18 service categories across different platforms
- 31 sample services with realistic pricing and details

## Step 3: Create a Test User

You can create a test user in two ways:

### Option A: Through the App
1. Start your development server: `npm run dev`
2. Navigate to `/register`
3. Sign up with an email and password
4. The profile will be created automatically via the trigger

### Option B: Through Supabase Dashboard
1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password
4. The profile will be created automatically

## Step 4: Add Test Balance (Optional)

To test ordering functionality, add balance to your test user:

```sql
-- Replace 'your-user-id' with the actual user ID from auth.users
UPDATE profiles 
SET balance = 100.00 
WHERE id = 'your-user-id';
```

## Verification

Check that everything is set up correctly:

```sql
-- Check categories
SELECT COUNT(*) FROM categories;
-- Should return 18

-- Check services
SELECT COUNT(*) FROM services WHERE is_active = true;
-- Should return 31

-- Check your profile
SELECT * FROM profiles WHERE email = 'your-email@example.com';
-- Should show your profile with balance
```

## Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vojwbgngzempqpxfespa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7jHd3SWhltdGB7FfxsSp0Q_s8UTPV4V
DATABASE_URL=postgresql://postgres:K7!BHSiuf"r^L2Q@db.vojwbgngzempqpxfespa.supabase.co:5432/postgres
```

## Testing the Integration

1. Start the dev server: `npm run dev`
2. Register/login at `/login`
3. Visit `/services` - should show 31 real services from database
4. Visit `/orders` - should show your orders (empty initially)
5. Visit `/new-order` - should be able to create orders (if you have balance)

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the schema SQL completely
- Check the Supabase logs for any errors

### "permission denied" error
- Check that RLS policies are enabled
- Verify you're logged in
- Check the policies match your user ID

### Services not showing
- Verify services were inserted: `SELECT * FROM services LIMIT 5;`
- Check `is_active = true` on services
- Look at browser console for errors

### Orders not showing
- Make sure you're logged in
- Check RLS policies allow reading your own orders
- Verify the user_id matches your auth.users id
