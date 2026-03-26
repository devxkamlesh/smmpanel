# SMM Panel - Setup Guide

## 🚀 Quick Setup (3 Steps)

### 1. Run Database Setup
```bash
# Open Supabase SQL Editor
# Run: supabase/01_initial_setup.sql
```

### 2. Disable Email Confirmation (Important!)
```bash
# Go to: Supabase Dashboard > Authentication > Providers > Email
# Turn OFF "Confirm email"
# This prevents rate limit errors
```

### 3. Start Development
```bash
npm run dev
```

## 📝 Make Admin

After registering your account:

```sql
-- Run in Supabase SQL Editor (bottom of 01_initial_setup.sql)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## ✅ Done!

Your SMM Panel is ready with:
- 37 services across all platforms
- Custom comments support
- Admin panel at `/admin`
- Service editing capability
- Automated order status updates
- Email notifications (optional)

## 🔧 Troubleshooting

### Not sure what's wrong?
Check the detailed guide: `supabase/README.md`

### Error: "infinite recursion detected in policy"
This is the main RLS policy issue:
1. Go to Supabase SQL Editor
2. Run: `supabase/02_fix_rls_policies.sql`
3. Restart your dev server: Stop (Ctrl+C) then `npm run dev`
4. Refresh your browser

### Error: "Error fetching profile"
This means your auth user doesn't have a profile record:
1. Go to Supabase SQL Editor
2. Run: `supabase/02_fix_rls_policies.sql`
3. Restart your dev server: `npm run dev`

### Error: "RLS POLICY ERROR: Services table is not accessible"
Services aren't loading due to RLS policies:
1. Go to Supabase SQL Editor
2. Run: `supabase/02_fix_rls_policies.sql`
3. Restart your dev server: `npm run dev`

### Error: "email rate limit exceeded"
You've hit Supabase's email rate limit:
- Wait 1 hour before trying again
- OR use a different email address
- OR disable email confirmation:
  1. Go to Supabase Dashboard > Authentication > Providers > Email
  2. Turn OFF "Confirm email"
  3. Save changes

### Nuclear Option: Complete Reset
If nothing works, reset everything:
1. Go to Supabase SQL Editor
2. Run: `supabase/01_initial_setup.sql` (this will recreate everything)
3. Delete all users from Authentication > Users
4. Restart dev server and register a new account

---

**Need help?** Check `supabase/README.md` for detailed documentation.
