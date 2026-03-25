# 🛡️ Admin Panel - Complete Guide

## 🚀 Quick Access (3 Steps)

### 1️⃣ Register Account
```
Go to: http://localhost:3000/register
Create your account
```

### 2️⃣ Make Admin (Choose One Method)

**Method A: Supabase Table Editor** ⭐ Easiest
```
1. Supabase Dashboard → Table Editor → profiles
2. Find your row → Click "role" cell
3. Change to "admin" → Press Enter
```

**Method B: SQL Query**
```sql
-- In Supabase SQL Editor:
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### 3️⃣ Access Admin Panel
```
Refresh website (F5)
Click "Admin Panel" in sidebar
Go to: /admin
```

---

## 📁 Project Files

### SQL Files (in project root)
- `supabase-schema.sql` - Database structure (run first)
- `supabase-seed.sql` - Sample data (run second)
- `make-admin.sql` - Make user admin (run after registration)

### Documentation Files
- `QUICK_START.md` - Fast setup guide
- `HOW_TO_ACCESS_ADMIN.md` - Detailed access instructions
- `ADMIN_SETUP_GUIDE.md` - Complete admin setup
- `ADMIN_PANEL.md` - Feature documentation
- `DATABASE_SETUP.md` - Database configuration
- `INTEGRATION_SUMMARY.md` - System overview

---

## 🎯 Admin Panel Features

### 📊 Dashboard (`/admin`)
```
✓ Total Users
✓ Total Orders  
✓ Total Revenue
✓ Growth Metrics
✓ Recent Activity
✓ Quick Actions
```

### 👥 User Management (`/admin/users`)
```
✓ View all users
✓ Change roles (user/reseller/admin)
✓ Update status (active/suspended/banned)
✓ Edit balance
✓ Delete users
✓ View spending history
```

### ⚙️ Service Management (`/admin/services`)
```
✓ View all services
✓ Toggle active/inactive
✓ Delete services
✓ See service details
✓ Filter by category
```

### 💾 SQL Manager (`/admin/sql`)
```
✓ Download SQL files (schema, seed, make-admin)
✓ Execute SELECT queries
✓ Execute DELETE queries
✓ Predefined queries
✓ View results in table
✓ Danger zone (clear data)
```

---

## 🔐 User Roles

### User (Default)
- Can place orders
- Can add funds
- Can view own data
- Can create tickets

### Reseller
- All user permissions
- Can resell services
- Special pricing
- API access

### Admin
- All permissions
- User management
- Service management
- SQL access
- Full control

---

## 📝 Common SQL Queries

### Make User Admin
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'user@example.com';
```

### View All Admins
```sql
SELECT username, email, role FROM profiles WHERE role = 'admin';
```

### View All Users
```sql
SELECT * FROM profiles ORDER BY created_at DESC;
```

### Reset User Balance
```sql
UPDATE profiles SET balance = 0.00 WHERE role = 'user';
```

### Delete Test Users
```sql
DELETE FROM profiles WHERE username LIKE 'test%';
```

### Clear All Orders
```sql
DELETE FROM orders;
```

### View Order Statistics
```sql
SELECT status, COUNT(*) as count FROM orders GROUP BY status;
```

---

## 🛠️ Setup Checklist

### Initial Setup
- [ ] Run `supabase-schema.sql` in Supabase SQL Editor
- [ ] Run `supabase-seed.sql` in Supabase SQL Editor
- [ ] Verify tables created (check Table Editor)
- [ ] Start dev server: `npm run dev`
- [ ] Register your account at `/register`

### Admin Access
- [ ] Run make-admin query with your email
- [ ] Verify role changed to 'admin' in Table Editor
- [ ] Refresh website (F5)
- [ ] See "Admin Panel" link in sidebar
- [ ] Access `/admin` successfully

### Testing
- [ ] View dashboard statistics
- [ ] Create a test user
- [ ] Modify test user role/status
- [ ] Toggle a service on/off
- [ ] Run a SELECT query
- [ ] Download SQL files

---

## ⚠️ Important Notes

### Security
- ⚠️ Only make trusted users admin
- ⚠️ Admin can delete all data
- ⚠️ Admin can modify any user
- ⚠️ Keep credentials secure
- ⚠️ Backup before destructive operations

### Limitations
- SQL Manager supports SELECT and DELETE only
- For complex queries, use Supabase SQL Editor
- Changes are immediate (no undo)
- Deleted data cannot be recovered

### Best Practices
- ✅ Backup database regularly
- ✅ Test on test users first
- ✅ Use predefined queries when possible
- ✅ Monitor admin activity
- ✅ Keep admin accounts minimal

---

## 🆘 Troubleshooting

### Admin Panel Not Showing
```
1. Check role in Supabase Table Editor
2. Hard refresh (Ctrl+Shift+R)
3. Log out and back in
4. Clear browser cache
```

### Can't Access /admin
```
1. Verify role = 'admin' in database
2. Run make-admin query again
3. Check browser console for errors
```

### SQL Queries Not Working
```
1. Use simple SELECT or DELETE only
2. Check table name is correct
3. Use Supabase SQL Editor for complex queries
4. Check error message in admin panel
```

### No Data Showing
```
1. Verify seed.sql was run
2. Check RLS policies are set up
3. Verify user is authenticated
4. Check Supabase logs
```

---

## 📞 Support Resources

### Documentation
- `HOW_TO_ACCESS_ADMIN.md` - Access instructions
- `ADMIN_SETUP_GUIDE.md` - Setup guide
- `ADMIN_PANEL.md` - Feature docs
- `DATABASE_SETUP.md` - Database info

### Supabase Resources
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- SQL Editor: Dashboard → SQL Editor
- Table Editor: Dashboard → Table Editor

### Quick Links
- Admin Panel: `/admin`
- User Management: `/admin/users`
- Service Management: `/admin/services`
- SQL Manager: `/admin/sql`

---

## ✅ Success Indicators

You have admin access when:
- ✅ "Admin Panel" link visible in sidebar (shield icon)
- ✅ Can access `/admin` without redirect
- ✅ Can see all users in User Management
- ✅ Can modify user roles and status
- ✅ Can toggle service status
- ✅ Can execute SQL queries

---

## 🎉 You're All Set!

Your admin panel is ready to use. Start by:
1. Exploring the dashboard
2. Viewing all users
3. Checking services
4. Running sample queries

Happy managing! 🚀
