# Environment Variables Fix

## CRITICAL: Fix Supabase Anon Key

Your current `.env.local` has an incorrect Supabase anon key format.

### Current (WRONG):
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7jHd3SWhltdGB7FfxsSp0Q_s8UTPV4V
```

### How to Get the Correct Key:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/vojwbgngzempqpxfespa

2. Navigate to: **Settings** → **API**

3. Look for **Project API keys** section

4. Copy the **anon public** key (it's a long JWT token that starts with `eyJ...`)

5. Replace in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvandiZ25nemVtcHFweGZlc3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTg1Nzc2OTYwMH0.YOUR_ACTUAL_KEY_HERE
```

### Complete .env.local Template:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vojwbgngzempqpxfespa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ACTUAL_ANON_KEY_FROM_DASHBOARD

# Supabase Database Connection
DATABASE_URL=postgresql://postgres:K7!BHSiuf"r^L2Q@db.vojwbgngzempqpxfespa.supabase.co:5432/postgres

# SMM Provider Configuration (JustAnotherPanel)
PROVIDER_NAME=JustAnotherPanel
PROVIDER_API_URL=https://justanotherpanel.com/api/v2
PROVIDER_API_KEY=96c792acb657c61f21c0de56fed4fad2
```

## After Fixing:

1. Save the `.env.local` file
2. Restart your development server: `npm run dev`
3. The 500 error should be resolved
4. You should be able to login/register

## Why This Matters:

The anon key is a JWT token that Supabase uses to:
- Authenticate API requests
- Enforce Row Level Security (RLS) policies
- Identify which project the request belongs to

Without the correct key, the middleware fails to create a Supabase client, causing the 500 error.
