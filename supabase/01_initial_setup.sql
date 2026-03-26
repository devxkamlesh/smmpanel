-- ============================================================
-- SMM PANEL - COMPLETE DATABASE SETUP
-- ============================================================
-- Run this ENTIRE file in Supabase SQL Editor
-- This is the ONLY file you need to run
-- ============================================================
-- After running this:
-- 1. Register your account in the app
-- 2. Update the email at the bottom of this file
-- 3. Run the "Make Admin" section at the end
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CREATE ENUMS
-- ============================================================

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('user', 'admin', 'reseller');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE account_status AS ENUM ('active', 'suspended', 'banned');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE order_status AS ENUM ('pending', 'processing', 'in_progress', 'completed', 'partial', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE transaction_type AS ENUM ('deposit', 'purchase', 'refund', 'bonus');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE ticket_status AS ENUM ('open', 'answered', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE service_type AS ENUM ('default', 'subscription', 'drip-feed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE platform_type AS ENUM ('facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'telegram', 'spotify', 'soundcloud', 'whatsapp', 'threads', 'reddit', 'quora', 'linkedin', 'deezer', 'audiomack', 'website_traffic');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================
-- CREATE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  balance DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
  role user_role DEFAULT 'user' NOT NULL,
  status account_status DEFAULT 'active' NOT NULL,
  api_key TEXT UNIQUE,
  account_points INTEGER DEFAULT 0 NOT NULL,
  total_spent DECIMAL(10, 2) DEFAULT 0.00 NOT NULL,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  platform platform_type NOT NULL,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type service_type DEFAULT 'default' NOT NULL,
  rate DECIMAL(10, 4) NOT NULL,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER NOT NULL,
  refill BOOLEAN DEFAULT false NOT NULL,
  refill_days INTEGER,
  average_time TEXT,
  speed TEXT,
  quality TEXT,
  features JSONB,
  country TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  provider_service_id TEXT,
  provider_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id INTEGER REFERENCES services(id) NOT NULL,
  link TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  charge DECIMAL(10, 2) NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  start_count INTEGER,
  remains INTEGER,
  external_order_id TEXT,
  custom_comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2),
  description TEXT,
  payment_method TEXT,
  payment_id TEXT,
  status transaction_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  status ticket_status DEFAULT 'open' NOT NULL,
  priority ticket_priority DEFAULT 'medium' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS api_providers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  api_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  balance DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS user_favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, service_id)
);

CREATE TABLE IF NOT EXISTS auto_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  link TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  interval_hours INTEGER NOT NULL,
  runs_remaining INTEGER,
  status TEXT DEFAULT 'active' NOT NULL,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- CREATE INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- ============================================================
-- CREATE FUNCTIONS & TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_username TEXT;
BEGIN
  new_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (id, username, email, referral_code)
  VALUES (
    NEW.id,
    new_username,
    NEW.email,
    SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CREATE RLS POLICIES
-- ============================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "System can update orders" ON orders;
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "System can create transactions" ON transactions;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON profiles 
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can update all profiles" ON profiles 
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Admins can delete profiles" ON profiles 
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Allow profile creation on signup" ON profiles 
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Service role can insert profiles" ON profiles 
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Categories & Services policies (PUBLIC ACCESS)
CREATE POLICY "Public can view active categories" ON categories 
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories 
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Public can view active services" ON services 
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage services" ON services 
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders 
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all orders" ON orders 
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Users can create orders" ON orders 
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update orders" ON orders 
  FOR UPDATE TO authenticated, service_role
  USING (true);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions 
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions" ON transactions 
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "System can create transactions" ON transactions 
  FOR INSERT TO authenticated, service_role
  WITH CHECK (true);

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT SELECT ON categories TO anon, authenticated;
GRANT SELECT ON services TO anon, authenticated;

-- ============================================================
-- INSERT SAMPLE DATA (20 Categories + 37 Services)
-- ============================================================

INSERT INTO categories (name, platform, sort_order, is_active) VALUES
('🔥 Top-Performing IG Services 🔥 🚀', 'instagram', 1, true),
('Instagram Followers - Real & Active', 'instagram', 2, true),
('Instagram Likes - Premium Quality', 'instagram', 3, true),
('Instagram Views & Impressions', 'instagram', 4, true),
('Instagram Custom Comments', 'instagram', 5, true),
('Facebook Page Likes', 'facebook', 6, true),
('Facebook Post Engagement', 'facebook', 7, true),
('Facebook Custom Comments', 'facebook', 8, true),
('YouTube Views - High Retention', 'youtube', 9, true),
('YouTube Subscribers', 'youtube', 10, true),
('TikTok Followers & Likes', 'tiktok', 11, true),
('TikTok Views', 'tiktok', 12, true),
('Twitter Followers', 'twitter', 13, true),
('Twitter Engagement', 'twitter', 14, true),
('Telegram Channel Members', 'telegram', 15, true),
('Spotify Plays & Followers', 'spotify', 16, true),
('SoundCloud Plays', 'soundcloud', 17, true),
('LinkedIn Connections', 'linkedin', 18, true),
('Reddit Upvotes', 'reddit', 19, true),
('Website Traffic', 'website_traffic', 20, true)
ON CONFLICT DO NOTHING;

INSERT INTO services (category_id, name, description, type, rate, min_quantity, max_quantity, refill, refill_days, average_time, speed, quality, features, country, is_active, sort_order) VALUES
(1, 'Instagram Likes - 100% Real Brazilian Accounts', 'Premium quality likes from real Brazilian users', 'default', 0.15, 100, 50000, true, 365, '0-1 Hour', 'Up to 2k Per Day', '100% Real Brazilian Accounts', '{"all_with_bio": true, "all_with_avatars": true}', 'Brazil 🇧🇷', true, 1),
(2, 'Instagram Followers - Real Active Users', 'High-quality followers from real active Instagram accounts', 'default', 0.25, 50, 100000, true, 180, '0-6 Hours', 'Fast', 'Real Active Users', '{"refill_button": true}', 'Worldwide 🌍', true, 2),
(2, 'Instagram Followers - Premium Quality', 'Premium followers with high engagement rate', 'default', 0.35, 100, 50000, true, 365, '0-2 Hours', 'Medium', 'Premium Quality', '{"refill_button": true}', 'Worldwide 🌍', true, 3),
(3, 'Instagram Likes - Instant Start', 'Fast delivery Instagram likes', 'default', 0.12, 100, 100000, false, null, '0-30 Min', 'Very Fast', 'Standard Quality', '{"start_time": "Instant"}', 'Worldwide 🌍', true, 4),
(3, 'Instagram Likes - High Quality', 'Premium quality likes from aged accounts', 'default', 0.20, 50, 50000, true, 90, '0-2 Hours', 'Fast', 'High Quality', '{"refill_button": true}', 'Worldwide 🌍', true, 5),
(4, 'Instagram Views - Story Views', 'Real story views from active users', 'default', 0.08, 100, 100000, false, null, '0-1 Hour', 'Fast', 'Real Views', null, 'Worldwide 🌍', true, 6),
(4, 'Instagram Views - Reel Views', 'High retention reel views', 'default', 0.10, 500, 1000000, false, null, '0-6 Hours', 'Medium', 'High Retention', '{"retention": "70%+"}', 'Worldwide 🌍', true, 7),
(5, 'Instagram Custom Comments - USA', 'Custom comments from USA accounts (one per line)', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'USA Accounts', '{"custom_comments": true}', 'USA 🇺🇸', true, 8),
(5, 'Instagram Custom Comments - AUS', 'Custom comments from Australian accounts', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'Australian Accounts', '{"custom_comments": true}', 'Australia 🇦🇺', true, 9),
(5, 'Instagram Custom Comments - EU', 'Custom comments from European accounts', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'European Accounts', '{"custom_comments": true}', 'Europe 🇪🇺', true, 10),
(6, 'Facebook Page Likes - Worldwide', 'Real Facebook page likes from worldwide users', 'default', 0.90, 100, 10000, true, 90, '0-2 Hours', 'Medium', 'Real Users', '{"refill_button": true}', 'Worldwide 🌍', true, 11),
(6, 'Facebook Page Likes - USA', 'USA targeted page likes', 'default', 1.50, 50, 5000, true, 60, '0-4 Hours', 'Slow', 'USA Targeted', '{"refill_button": true}', 'USA 🇺🇸', true, 12),
(7, 'Facebook Post Likes', 'Instant Facebook post likes', 'default', 0.50, 100, 50000, false, null, '0-1 Hour', 'Fast', 'Standard', null, 'Worldwide 🌍', true, 13),
(7, 'Facebook Post Shares', 'Real post shares from active accounts', 'default', 1.20, 50, 10000, false, null, '0-6 Hours', 'Medium', 'Real Shares', null, 'Worldwide 🌍', true, 14),
(8, 'Facebook Custom Comments - USA', 'Custom comments from USA accounts', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'USA Accounts', '{"custom_comments": true}', 'USA 🇺🇸', true, 15),
(8, 'Facebook Custom Comments - AUS', 'Custom comments from Australian accounts', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'Australian Accounts', '{"custom_comments": true}', 'Australia 🇦🇺', true, 16),
(8, 'Facebook Custom Comments - EU', 'Custom comments from European accounts', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'European Accounts', '{"custom_comments": true}', 'Europe 🇪🇺', true, 17),
(9, 'YouTube Views - High Retention 70%+', 'Premium YouTube views with 70%+ retention', 'default', 0.50, 500, 1000000, false, null, '0-12 Hours', 'Medium', 'High Retention 70%+', '{"retention": "70%+"}', 'Worldwide 🌍', true, 18),
(9, 'YouTube Views - Instant Start', 'Fast delivery YouTube views', 'default', 0.30, 1000, 10000000, false, null, '0-1 Hour', 'Very Fast', 'Standard', '{"start_time": "Instant"}', 'Worldwide 🌍', true, 19),
(10, 'YouTube Subscribers - Real', 'Real YouTube subscribers from active channels', 'default', 2.50, 50, 5000, true, 180, '0-24 Hours', 'Slow', 'Real Subscribers', '{"refill_button": true}', 'Worldwide 🌍', true, 20),
(10, 'YouTube Likes', 'YouTube video likes', 'default', 0.80, 100, 50000, false, null, '0-6 Hours', 'Fast', 'Standard', null, 'Worldwide 🌍', true, 21),
(11, 'TikTok Likes - Instant Start', 'Fast TikTok likes delivery', 'default', 0.10, 100, 50000, false, null, '0-30 Min', 'Very Fast', 'Standard', '{"start_time": "Instant"}', 'Worldwide 🌍', true, 22),
(11, 'TikTok Followers - Real Users', 'Real TikTok followers from active accounts', 'default', 0.40, 100, 100000, true, 90, '0-6 Hours', 'Fast', 'Real Users', '{"refill_button": true}', 'Worldwide 🌍', true, 23),
(12, 'TikTok Views - High Quality', 'High-quality TikTok video views', 'default', 0.05, 1000, 10000000, false, null, '0-2 Hours', 'Very Fast', 'High Quality', null, 'Worldwide 🌍', true, 24),
(13, 'Twitter Followers - Real Users', 'Real Twitter followers from active accounts', 'default', 0.30, 100, 50000, true, 120, '0-4 Hours', 'Medium', 'Real Users', '{"refill_button": true}', 'Worldwide 🌍', true, 25),
(14, 'Twitter Likes', 'Twitter post likes', 'default', 0.25, 50, 50000, false, null, '0-2 Hours', 'Fast', 'Standard', null, 'Worldwide 🌍', true, 26),
(14, 'Twitter Retweets', 'Real Twitter retweets', 'default', 0.50, 50, 10000, false, null, '0-4 Hours', 'Medium', 'Real Retweets', null, 'Worldwide 🌍', true, 27),
(15, 'Telegram Channel Members', 'Real Telegram channel members', 'default', 0.20, 500, 100000, true, 60, '0-6 Hours', 'Medium', 'Real Members', '{"refill_button": true}', 'Worldwide 🌍', true, 28),
(15, 'Telegram Post Views', 'Telegram post views', 'default', 0.05, 1000, 1000000, false, null, '0-1 Hour', 'Fast', 'Standard', null, 'Worldwide 🌍', true, 29),
(16, 'Spotify Plays - Premium Quality', 'High-quality Spotify plays', 'default', 0.05, 1000, 1000000, false, null, '0-24 Hours', 'Medium', 'Premium Quality', null, 'Worldwide 🌍', true, 30),
(16, 'Spotify Followers', 'Real Spotify profile followers', 'default', 1.50, 100, 50000, true, 90, '0-12 Hours', 'Slow', 'Real Followers', '{"refill_button": true}', 'Worldwide 🌍', true, 31),
(17, 'SoundCloud Plays', 'SoundCloud track plays', 'default', 0.08, 1000, 1000000, false, null, '0-12 Hours', 'Medium', 'Standard', null, 'Worldwide 🌍', true, 32),
(17, 'SoundCloud Followers', 'Real SoundCloud followers', 'default', 1.20, 100, 10000, true, 60, '0-24 Hours', 'Slow', 'Real Followers', '{"refill_button": true}', 'Worldwide 🌍', true, 33),
(18, 'LinkedIn Connections', 'Real LinkedIn connection requests', 'default', 2.00, 50, 1000, false, null, '0-48 Hours', 'Very Slow', 'Real Connections', null, 'Worldwide 🌍', true, 34),
(18, 'LinkedIn Post Likes', 'LinkedIn post engagement', 'default', 1.50, 50, 5000, false, null, '0-12 Hours', 'Medium', 'Real Engagement', null, 'Worldwide 🌍', true, 35),
(19, 'Reddit Upvotes', 'Reddit post upvotes', 'default', 0.80, 50, 10000, false, null, '0-6 Hours', 'Medium', 'Real Upvotes', null, 'Worldwide 🌍', true, 36),
(20, 'Website Traffic - Worldwide', 'Real website traffic from worldwide visitors', 'default', 0.30, 1000, 1000000, false, null, '0-24 Hours', 'Medium', 'Real Traffic', '{"bounce_rate": "Low"}', 'Worldwide 🌍', true, 37)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '============================================================';
  RAISE NOTICE '✅ DATABASE SETUP COMPLETE!';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  - 10 tables with proper relationships';
  RAISE NOTICE '  - 20 categories across all platforms';
  RAISE NOTICE '  - 37 services (including 6 custom comment services)';
  RAISE NOTICE '  - RLS policies for security';
  RAISE NOTICE '  - Triggers for auto-profile creation';
  RAISE NOTICE '';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '1. Restart your dev server: npm run dev';
  RAISE NOTICE '2. Register a new account in your app';
  RAISE NOTICE '3. Come back here and scroll to MAKE ADMIN section below';
  RAISE NOTICE '4. Update the email and run that section';
  RAISE NOTICE '============================================================';
END $$;

-- ============================================================
-- ============================================================
-- MAKE ADMIN - RUN THIS AFTER REGISTERING YOUR ACCOUNT
-- ============================================================
-- ============================================================
-- INSTRUCTIONS:
-- 1. Register your account in the app FIRST
-- 2. Replace 'your-email@example.com' below with your actual email
-- 3. Select and run ONLY the lines below (from UPDATE to the final SELECT)
-- ============================================================

-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-email@example.com';

-- SELECT 
--   username,
--   email,
--   role,
--   balance,
--   created_at
-- FROM profiles 
-- WHERE email = 'your-email@example.com';

-- ============================================================
-- After running the admin update:
-- - Refresh your app
-- - You can now access /admin
-- - Your SMM Panel is ready to use!
-- ============================================================
