# Admin Panel Documentation

## Overview
The admin panel provides comprehensive management tools for your SMM Panel platform. Only users with the `admin` role can access these features.

## Access
- URL: `/admin`
- Requirement: User must have `role = 'admin'` in the profiles table
- Navigation: Admin users will see an "Admin Panel" link in the dashboard sidebar

## Features

### 1. Dashboard Overview (`/admin`)
- View key statistics:
  - Total Users
  - Total Orders
  - Total Revenue
  - Growth metrics
- Recent activity feed
- Quick action links

### 2. User Management (`/admin/users`)
Manage all registered users with the following capabilities:

- **View all users** with detailed information:
  - Username, email, ID
  - Role (user, reseller, admin)
  - Status (active, suspended, banned)
  - Balance and total spent
  
- **Edit user roles** - Change between:
  - User (default)
  - Reseller (can resell services)
  - Admin (full access)
  
- **Update user status** - Set to:
  - Active (normal operation)
  - Suspended (temporary restriction)
  - Banned (permanent restriction)
  
- **Modify user balance** - Adjust account balance directly
- **Delete users** - Permanently remove user accounts

### 3. Service Management (`/admin/services`)
Manage all services and their availability:

- View all services with:
  - Service ID, name, description
  - Category and platform
  - Rate (price per 1000)
  - Min/Max quantity limits
  - Active/Inactive status
  
- **Toggle service status** - Enable or disable services
- **Delete services** - Remove services permanently

### 4. SQL Manager (`/admin/sql`)
Execute database queries and manage SQL files:

#### Features:
- **Download SQL files**:
  - Schema file (database structure)
  - Seed file (sample data)
  
- **Predefined queries**:
  - View All Users
  - View All Orders
  - View All Services
  - View All Categories
  - View All Transactions
  - Clear All Orders
  
- **Custom query execution**:
  - Supports SELECT queries (view data)
  - Supports DELETE queries (remove data)
  - Results displayed in table format
  
- **Danger Zone**:
  - Clear All Orders
  - Clear All Transactions

#### Limitations:
- For security, only SELECT and DELETE queries are supported
- Complex operations (UPDATE, INSERT, JOIN) should be done via Supabase SQL Editor
- All queries are logged and require admin authentication

## Security

### Authentication
- All admin routes check for authenticated user
- User role is verified on every request
- Non-admin users are redirected to home page

### Authorization
- Server actions validate admin role before execution
- API routes require admin authentication
- Row Level Security (RLS) policies protect data

### Best Practices
1. **Backup before destructive operations** - Always backup your database before running DELETE queries
2. **Test queries carefully** - Verify queries on test data first
3. **Use Supabase SQL Editor for complex operations** - The built-in SQL manager is for simple queries only
4. **Monitor admin activity** - Keep track of who accesses admin features
5. **Limit admin accounts** - Only grant admin role to trusted users

## Database Schema

### Admin-Relevant Tables
- `profiles` - User accounts and roles
- `orders` - Customer orders
- `services` - Available services
- `categories` - Service categories
- `transactions` - Payment history
- `tickets` - Support tickets

### Key Fields
- `profiles.role` - Determines admin access (user/admin/reseller)
- `profiles.status` - Account status (active/suspended/banned)
- `services.is_active` - Service availability
- `categories.is_active` - Category visibility

## Common Tasks

### Make a User an Admin
1. Go to `/admin/users`
2. Find the user in the list
3. Change their role dropdown to "Admin"
4. Changes apply immediately

### Disable a Service
1. Go to `/admin/services`
2. Find the service
3. Click the status badge or eye icon
4. Service becomes inactive immediately

### Clear Test Data
1. Go to `/admin/sql`
2. Use predefined query "Clear All Orders"
3. Or write custom DELETE query
4. Confirm the action

### View User Activity
1. Go to `/admin/users`
2. Check "Total Spent" column
3. Click user to see detailed order history

## Troubleshooting

### Can't Access Admin Panel
- Verify your user has `role = 'admin'` in profiles table
- Check you're logged in
- Clear browser cache and cookies

### SQL Queries Not Working
- Ensure query syntax is correct
- Use simple SELECT or DELETE queries
- For complex queries, use Supabase SQL Editor
- Check error messages for details

### Changes Not Reflecting
- Refresh the page
- Check browser console for errors
- Verify database connection in .env.local

## Future Enhancements
- Bulk user operations
- Service creation/editing UI
- Category management
- Analytics and reporting
- Activity logs and audit trail
- Email notifications for admin actions
