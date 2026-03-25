-- ============================================================
-- SMM Panel - Supabase Database Schema
-- ============================================================
-- 
-- SETUP INSTRUCTIONS:
-- 1. Run this entire file in Supabase SQL Editor to create all tables
-- 2. Then run supabase-seed.sql to add sample data
-- 3. After registering your account, run this to make yourself admin:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- 4. Refresh your website and access /admin
--
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('user', 'admin', 'reseller');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'banned');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'in_progress', 'completed', 'partial', 'cancelled', 'refunded');
CREATE TYPE transaction_type AS ENUM ('deposit', 'purchase', 'refund', 'bonus');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE ticket_status AS ENUM ('open', 'answered', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE service_type AS ENUM ('default', 'subscription', 'drip-feed');
CREATE TYPE platform_type AS ENUM ('facebook', 'instagram', 'twitter', 'youtube', 'tiktok', 'telegram', 'spotify', 'soundcloud', 'whatsapp', 'threads', 'reddit', 'quora', 'linkedin', 'deezer', 'audiomack', 'website_traffic');

-- ============================================================
-- PROFILES TABLE (extends auth.users)
-- ============================================================

CREATE TABLE profiles (
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

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  platform platform_type NOT NULL,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- SERVICES TABLE
-- ============================================================

CREATE TABLE services (
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

-- ============================================================
-- ORDERS TABLE
-- ============================================================

CREATE TABLE orders (
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
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TRANSACTIONS TABLE
-- ============================================================

CREATE TABLE transactions (
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

-- ============================================================
-- TICKETS TABLE
-- ============================================================

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  status ticket_status DEFAULT 'open' NOT NULL,
  priority ticket_priority DEFAULT 'medium' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TICKET MESSAGES TABLE
-- ============================================================

CREATE TABLE ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- API PROVIDERS TABLE
-- ============================================================

CREATE TABLE api_providers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  api_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  balance DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- USER FAVORITES TABLE
-- ============================================================

CREATE TABLE user_favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, service_id)
);

-- ============================================================
-- AUTO SUBSCRIPTIONS TABLE
-- ============================================================

CREATE TABLE auto_subscriptions (
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
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Users can view their own orders, admins can view all
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions: Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Tickets: Users can view and create their own tickets
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ticket Messages: Users can view messages for their tickets
CREATE POLICY "Users can view own ticket messages" ON ticket_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM tickets WHERE tickets.id = ticket_messages.ticket_id AND tickets.user_id = auth.uid()));
CREATE POLICY "Users can create ticket messages" ON ticket_messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM tickets WHERE tickets.id = ticket_messages.ticket_id AND tickets.user_id = auth.uid()));

-- User Favorites: Users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create favorites" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete favorites" ON user_favorites FOR DELETE USING (auth.uid() = user_id);

-- Auto Subscriptions: Users can manage their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON auto_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create subscriptions" ON auto_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update subscriptions" ON auto_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete subscriptions" ON auto_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- Public read access for categories and services
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
