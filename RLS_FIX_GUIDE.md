# RLS Policy Fix for Transactions

## Problem
Users were getting error: `new row violates row-level security policy for table "transactions"`

This happened because the transactions table only had a SELECT policy, but no INSERT policy for users.

## Solution
Added RLS policies to allow:
1. Users to create their own transaction records (fund requests)
2. Admins to view and update all transactions

## How to Apply

### Option 1: Run the fix file (Quick)
Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Copy and paste contents of fix-transactions-rls.sql
```

### Option 2: Run individual commands
Execute these in Supabase SQL Editor:

```sql
-- Allow users to create their own transactions
CREATE POLICY "Users can create own transactions" ON transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all transactions
CREATE POLICY "Admins can view all transactions" ON transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to update transactions (for approvals/rejections)
CREATE POLICY "Admins can update transactions" ON transactions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

## Verification
After applying the fix:
1. Try adding funds from `/add-funds`
2. Should see success message: "Fund request submitted. Admin will approve shortly."
3. Check `/admin/transactions` to see pending requests
4. Approve/reject should work without errors

## Files Updated
- `fix-transactions-rls.sql` - Migration file with fix
- `supabase-schema.sql` - Updated main schema (for fresh installs)

## Note
If you already have a database running, you only need to run `fix-transactions-rls.sql` once.
The updated `supabase-schema.sql` is for future reference or fresh database setups.
