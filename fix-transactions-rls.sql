-- Fix RLS policy for transactions table
-- This allows users to create their own transaction records (fund requests)

-- Add INSERT policy for transactions
CREATE POLICY "Users can create own transactions" ON transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Optional: Add admin policies for full access
CREATE POLICY "Admins can view all transactions" ON transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update transactions" ON transactions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
