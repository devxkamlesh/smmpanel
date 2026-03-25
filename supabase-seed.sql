-- ============================================================
-- SMM Panel - Sample Data Seed
-- ============================================================
--
-- INSTRUCTIONS:
-- 1. Make sure you've run supabase-schema.sql first
-- 2. Run this entire file to add sample categories and services
-- 3. This adds 18 categories and 31 services across all platforms
-- 4. You can modify or delete this data later via admin panel
--
-- ============================================================

-- Insert Categories
INSERT INTO categories (name, platform, sort_order, is_active) VALUES
('🔥 Top-Performing IG Services 🔥 🚀', 'instagram', 1, true),
('Instagram Followers - Real & Active', 'instagram', 2, true),
('Instagram Likes - Premium Quality', 'instagram', 3, true),
('Instagram Views & Impressions', 'instagram', 4, true),
('Facebook Page Likes', 'facebook', 5, true),
('Facebook Post Engagement', 'facebook', 6, true),
('YouTube Views - High Retention', 'youtube', 7, true),
('YouTube Subscribers', 'youtube', 8, true),
('TikTok Followers & Likes', 'tiktok', 9, true),
('TikTok Views', 'tiktok', 10, true),
('Twitter Followers', 'twitter', 11, true),
('Twitter Engagement', 'twitter', 12, true),
('Telegram Channel Members', 'telegram', 13, true),
('Spotify Plays & Followers', 'spotify', 14, true),
('SoundCloud Plays', 'soundcloud', 15, true),
('LinkedIn Connections', 'linkedin', 16, true),
('Reddit Upvotes', 'reddit', 17, true),
('Website Traffic', 'website_traffic', 18, true);

-- Insert Services
INSERT INTO services (category_id, name, description, type, rate, min_quantity, max_quantity, refill, refill_days, average_time, speed, quality, features, country, is_active, sort_order) VALUES
-- Instagram Services
(1, 'Instagram Likes - 100% Real Brazilian Accounts', 'Premium quality likes from real Brazilian users with profile pictures and posts', 'default', 0.15, 100, 50000, true, 365, '0-1 Hour', 'Up to 2k Per Day', '100% Real Brazilian Accounts', '{"all_with_bio": true, "all_with_avatars": true, "works_with_flag_on": true, "works_with_flag_off": true}', 'Brazil 🇧🇷', true, 1),
(2, 'Instagram Followers - Real Active Users', 'High-quality followers from real active Instagram accounts', 'default', 0.25, 50, 100000, true, 180, '0-6 Hours', 'Fast', 'Real Active Users', '{"refill_button": true, "start_time": "Within 0-1 Hour"}', 'Worldwide 🌍', true, 2),
(2, 'Instagram Followers - Premium Quality', 'Premium followers with high engagement rate', 'default', 0.35, 100, 50000, true, 365, '0-2 Hours', 'Medium', 'Premium Quality', '{"refill_button": true}', 'Worldwide 🌍', true, 3),
(3, 'Instagram Likes - Instant Start', 'Fast delivery Instagram likes', 'default', 0.12, 100, 100000, false, null, '0-30 Min', 'Very Fast', 'Standard Quality', '{"start_time": "Instant"}', 'Worldwide 🌍', true, 4),
(3, 'Instagram Likes - High Quality', 'Premium quality likes from aged accounts', 'default', 0.20, 50, 50000, true, 90, '0-2 Hours', 'Fast', 'High Quality', '{"refill_button": true}', 'Worldwide 🌍', true, 5),
(4, 'Instagram Views - Story Views', 'Real story views from active users', 'default', 0.08, 100, 100000, false, null, '0-1 Hour', 'Fast', 'Real Views', null, 'Worldwide 🌍', true, 6),
(4, 'Instagram Views - Reel Views', 'High retention reel views', 'default', 0.10, 500, 1000000, false, null, '0-6 Hours', 'Medium', 'High Retention', '{"retention": "70%+"}', 'Worldwide 🌍', true, 7),

-- Facebook Services
(5, 'Facebook Page Likes - Worldwide', 'Real Facebook page likes from worldwide users', 'default', 0.90, 100, 10000, true, 90, '0-2 Hours', 'Medium', 'Real Users', '{"refill_button": true}', 'Worldwide 🌍', true, 8),
(5, 'Facebook Page Likes - USA', 'USA targeted page likes', 'default', 1.50, 50, 5000, true, 60, '0-4 Hours', 'Slow', 'USA Targeted', '{"refill_button": true}', 'USA 🇺🇸', true, 9),
(6, 'Facebook Post Likes', 'Instant Facebook post likes', 'default', 0.50, 100, 50000, false, null, '0-1 Hour', 'Fast', 'Standard', null, 'Worldwide 🌍', true, 10),
(6, 'Facebook Post Shares', 'Real post shares from active accounts', 'default', 1.20, 50, 10000, false, null, '0-6 Hours', 'Medium', 'Real Shares', null, 'Worldwide 🌍', true, 11),

-- YouTube Services
(7, 'YouTube Views - High Retention 70%+', 'Premium YouTube views with 70%+ retention rate', 'default', 0.50, 500, 1000000, false, null, '0-12 Hours', 'Medium', 'High Retention 70%+', '{"retention": "70%+"}', 'Worldwide 🌍', true, 12),
(7, 'YouTube Views - Instant Start', 'Fast delivery YouTube views', 'default', 0.30, 1000, 10000000, false, null, '0-1 Hour', 'Very Fast', 'Standard', '{"start_time": "Instant"}', 'Worldwide 🌍', true, 13),
(8, 'YouTube Subscribers - Real', 'Real YouTube subscribers from active channels', 'default', 2.50, 50, 5000, true, 180, '0-24 Hours', 'Slow', 'Real Subscribers', '{"refill_button": true}', 'Worldwide 🌍', true, 14),
(8, 'YouTube Likes', 'YouTube video likes', 'default', 0.80, 100, 50000, false, null, '0-6 Hours', 'Fast', 'Standard', null, 'Worldwide 🌍', true, 15),

-- TikTok Services
(9, 'TikTok Likes - Instant Start', 'Fast TikTok likes delivery', 'default', 0.10, 100, 50000, false, null, '0-30 Min', 'Very Fast', 'Standard', '{"start_time": "Instant"}', 'Worldwide 🌍', true, 16),
(9, 'TikTok Followers - Real Users', 'Real TikTok followers from active accounts', 'default', 0.40, 100, 100000, true, 90, '0-6 Hours', 'Fast', 'Real Users', '{"refill_button": true}', 'Worldwide 🌍', true, 17),
(10, 'TikTok Views - High Quality', 'High-quality TikTok video views', 'default', 0.05, 1000, 10000000, false, null, '0-2 Hours', 'Very Fast', 'High Quality', null, 'Worldwide 🌍', true, 18),

-- Twitter Services
(11, 'Twitter Followers - Real Users', 'Real Twitter followers from active accounts', 'default', 0.30, 100, 50000, true, 120, '0-4 Hours', 'Medium', 'Real Users', '{"refill_button": true}', 'Worldwide 🌍', true, 19),
(12, 'Twitter Likes', 'Twitter post likes', 'default', 0.25, 50, 50000, false, null, '0-2 Hours', 'Fast', 'Standard', null, 'Worldwide 🌍', true, 20),
(12, 'Twitter Retweets', 'Real Twitter retweets', 'default', 0.50, 50, 10000, false, null, '0-4 Hours', 'Medium', 'Real Retweets', null, 'Worldwide 🌍', true, 21),

-- Telegram Services
(13, 'Telegram Channel Members', 'Real Telegram channel members', 'default', 0.20, 500, 100000, true, 60, '0-6 Hours', 'Medium', 'Real Members', '{"refill_button": true}', 'Worldwide 🌍', true, 22),
(13, 'Telegram Post Views', 'Telegram post views', 'default', 0.05, 1000, 1000000, false, null, '0-1 Hour', 'Fast', 'Standard', null, 'Worldwide 🌍', true, 23),

-- Spotify Services
(14, 'Spotify Plays - Premium Quality', 'High-quality Spotify plays', 'default', 0.05, 1000, 1000000, false, null, '0-24 Hours', 'Medium', 'Premium Quality', null, 'Worldwide 🌍', true, 24),
(14, 'Spotify Followers', 'Real Spotify profile followers', 'default', 1.50, 100, 50000, true, 90, '0-12 Hours', 'Slow', 'Real Followers', '{"refill_button": true}', 'Worldwide 🌍', true, 25),

-- SoundCloud Services
(15, 'SoundCloud Plays', 'SoundCloud track plays', 'default', 0.08, 1000, 1000000, false, null, '0-12 Hours', 'Medium', 'Standard', null, 'Worldwide 🌍', true, 26),
(15, 'SoundCloud Followers', 'Real SoundCloud followers', 'default', 1.20, 100, 10000, true, 60, '0-24 Hours', 'Slow', 'Real Followers', '{"refill_button": true}', 'Worldwide 🌍', true, 27),

-- LinkedIn Services
(16, 'LinkedIn Connections', 'Real LinkedIn connection requests', 'default', 2.00, 50, 1000, false, null, '0-48 Hours', 'Very Slow', 'Real Connections', null, 'Worldwide 🌍', true, 28),
(16, 'LinkedIn Post Likes', 'LinkedIn post engagement', 'default', 1.50, 50, 5000, false, null, '0-12 Hours', 'Medium', 'Real Engagement', null, 'Worldwide 🌍', true, 29),

-- Reddit Services
(17, 'Reddit Upvotes', 'Reddit post upvotes', 'default', 0.80, 50, 10000, false, null, '0-6 Hours', 'Medium', 'Real Upvotes', null, 'Worldwide 🌍', true, 30),

-- Website Traffic
(18, 'Website Traffic - Worldwide', 'Real website traffic from worldwide visitors', 'default', 0.30, 1000, 1000000, false, null, '0-24 Hours', 'Medium', 'Real Traffic', '{"bounce_rate": "Low", "session_duration": "30s+"}', 'Worldwide 🌍', true, 31);
