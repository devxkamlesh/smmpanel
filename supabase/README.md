# Supabase SQL Scripts

Run these scripts in order in your Supabase SQL Editor.

## Setup Scripts

### 1. Initial Setup (Required)
**File:** `01_initial_setup.sql`

Run this first to set up your entire database:
- Creates all tables (profiles, services, categories, orders, etc.)
- Sets up RLS policies
- Creates triggers for auto-profile creation
- Inserts 20 categories and 37 sample services

After running:
1. Disable email confirmation in Supabase (Authentication > Providers > Email)
2. Register your account in the app
3. Run the "Make Admin" section at the bottom of the file

### 2. Fix RLS Policies (If Needed)
**File:** `02_fix_rls_policies.sql`

Run this if you see errors like:
- "infinite recursion detected in policy"
- "RLS POLICY ERROR"
- "Services table is not accessible"

This fixes the infinite recursion issue in RLS policies by using a SECURITY DEFINER function.

## Quick Start

```sql
-- Step 1: Run in Supabase SQL Editor
-- Copy and paste: 01_initial_setup.sql

-- Step 2: Disable email confirmation
-- Go to: Authentication > Providers > Email
-- Turn OFF "Confirm email"

-- Step 3: Register your account
-- Go to your app and register

-- Step 4: Make yourself admin
-- Update the email in 01_initial_setup.sql (bottom section)
-- Run the "Make Admin" section
```

## Troubleshooting

### Services not loading?
Run `02_fix_rls_policies.sql`

### Profile errors?
Run `02_fix_rls_policies.sql` - it fixes both services and profiles

### Email rate limit?
Wait 1 hour or disable email confirmation in Supabase settings

## Database Structure

- **profiles** - User accounts and balances
- **categories** - Service categories (Instagram, Facebook, etc.)
- **services** - Available SMM services
- **orders** - User orders
- **transactions** - Payment history
- **tickets** - Support tickets
- **api_providers** - External API providers
- **user_favorites** - Saved services
- **auto_subscriptions** - Recurring orders
