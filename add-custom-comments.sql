-- ============================================================
-- Add Custom Comment Services
-- ============================================================
-- Run this in Supabase SQL Editor to add custom comment services

-- Add Instagram Comments category if not exists
INSERT INTO categories (name, platform, sort_order, is_active) VALUES
('Instagram Custom Comments', 'instagram', 19, true),
('Facebook Custom Comments', 'facebook', 20, true)
ON CONFLICT DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  ig_comments_cat_id INTEGER;
  fb_comments_cat_id INTEGER;
BEGIN
  -- Get Instagram Comments category ID
  SELECT id INTO ig_comments_cat_id FROM categories WHERE name = 'Instagram Custom Comments' LIMIT 1;
  
  -- Get Facebook Comments category ID
  SELECT id INTO fb_comments_cat_id FROM categories WHERE name = 'Facebook Custom Comments' LIMIT 1;

  -- Insert Instagram Custom Comment Services
  INSERT INTO services (category_id, name, description, type, rate, min_quantity, max_quantity, refill, refill_days, average_time, speed, quality, features, country, is_active, sort_order) VALUES
  (ig_comments_cat_id, 'Instagram Custom Comments - USA', 'Custom comments from USA accounts. Write your own comments (1 per line)', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'USA Accounts', '{"custom_comments": true, "comments_per_line": 1}', 'USA 🇺🇸', true, 1),
  (ig_comments_cat_id, 'Instagram Custom Comments - Australia', 'Custom comments from Australian accounts. Write your own comments (1 per line)', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'Australian Accounts', '{"custom_comments": true, "comments_per_line": 1}', 'Australia 🇦🇺', true, 2),
  (ig_comments_cat_id, 'Instagram Custom Comments - Europe', 'Custom comments from European accounts. Write your own comments (1 per line)', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'European Accounts', '{"custom_comments": true, "comments_per_line": 1}', 'Europe 🇪🇺', true, 3);

  -- Insert Facebook Custom Comment Services
  INSERT INTO services (category_id, name, description, type, rate, min_quantity, max_quantity, refill, refill_days, average_time, speed, quality, features, country, is_active, sort_order) VALUES
  (fb_comments_cat_id, 'Facebook Custom Comments - USA', 'Custom comments from USA accounts. Write your own comments (1 per line)', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'USA Accounts', '{"custom_comments": true, "comments_per_line": 1}', 'USA 🇺🇸', true, 1),
  (fb_comments_cat_id, 'Facebook Custom Comments - Australia', 'Custom comments from Australian accounts. Write your own comments (1 per line)', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'Australian Accounts', '{"custom_comments": true, "comments_per_line": 1}', 'Australia 🇦🇺', true, 2),
  (fb_comments_cat_id, 'Facebook Custom Comments - Europe', 'Custom comments from European accounts. Write your own comments (1 per line)', 'default', 1.50, 1, 1000, false, null, '0-6 Hours', 'Medium', 'European Accounts', '{"custom_comments": true, "comments_per_line": 1}', 'Europe 🇪🇺', true, 3);

END $$;
