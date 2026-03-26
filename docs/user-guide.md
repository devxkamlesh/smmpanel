# User Guide

Complete guide to using SMM Panel features.

## Dashboard Overview

Your dashboard provides quick access to:
- Account balance and statistics
- Quick order placement
- Recent orders
- Account points and spending

## Placing Orders

### Single Order

1. Navigate to **New Order**
2. **Select Platform**: Choose from Instagram, Facebook, YouTube, TikTok, etc.
3. **Select Category**: Pick the service category
4. **Choose Service**: Browse and select a specific service
5. **Enter Details**:
   - Link: The URL of the post/profile/video
   - Quantity: Number of likes/followers/views (within min/max limits)
6. **Review Charge**: Check the total cost
7. **Place Order**: Click the button to submit

### Mass Orders

Place multiple orders at once:

1. Navigate to **Mass Order**
2. Enter orders in the format: `service_id | link | quantity`
3. One order per line
4. Example:
   ```
   12841 | https://instagram.com/p/example | 1000
   12842 | https://instagram.com/p/example2 | 500
   ```
5. Click **Submit Mass Order**

### Custom Comments

Some services support custom comments:

1. Select a service with "Custom Comments" feature
2. Enter one comment per line in the text area
3. Quantity auto-updates based on number of comments
4. Each comment will be posted separately

## Adding Funds

### Payment Methods

We support multiple payment methods:
- Bank Transfer
- UPI
- Paytm
- PhonePe
- Google Pay
- Cryptocurrency
- Other methods

### Adding Funds Process

1. Go to **Add Funds**
2. Select or enter amount ($5 minimum, $10,000 maximum)
3. Choose payment method
4. Make payment using provided details
5. Enter transaction ID or payment proof
6. Submit request
7. Wait for admin approval (1-24 hours typically)

### Quick Amount Selection

Use quick select buttons for common amounts:
- $10, $25, $50, $100, $250, $500

## Managing Orders

### Viewing Orders

1. Go to **Orders** in sidebar
2. View all your orders with details:
   - Order ID
   - Date and time
   - Service name
   - Link
   - Quantity
   - Charge
   - Status

### Searching Orders

- Use the search box to find orders by:
  - Order ID
  - Service name
  - Link

### Order Details

Each order shows:
- **Start Count**: Initial count when order started
- **Remains**: Quantity remaining to be delivered
- **Status**: Current order status
- **Link**: Direct link to the post/profile

## Services

### Browsing Services

1. Go to **Services**
2. Filter by platform
3. Search by service name
4. View service details:
   - Rate per 1000
   - Minimum quantity
   - Maximum quantity
   - Average delivery time
   - Speed and quality

### Service Types

- **Default**: Standard one-time delivery
- **Subscription**: Recurring delivery over time
- **Drip-Feed**: Gradual delivery in intervals

### Service Features

- **Refill**: Automatic refill if count drops
- **Custom Comments**: Support for custom text
- **High Quality**: Premium quality delivery
- **Fast Delivery**: Quick turnaround time

## Account Settings

### Profile Settings

Update your account information:
- Username
- Full name
- Email address

### Security Settings

Change your password:
1. Enter current password
2. Enter new password
3. Confirm new password
4. Save changes

### API Key

Generate API key for programmatic access:
1. Go to Settings → API Key
2. Click "Generate API Key"
3. Copy and save your key securely
4. Use in API requests

## Account Points

Earn points with every purchase:
- 1 point = $0.01
- Points accumulate automatically
- View points in dashboard
- Track total spending

## Support & Tickets

### Creating a Ticket

1. Go to **Tickets**
2. Click "Create Ticket"
3. Enter subject and message
4. Submit ticket
5. Wait for admin response

### Ticket Status

- **Open**: Waiting for response
- **Answered**: Admin has responded
- **Closed**: Ticket is resolved

## Best Practices

### Order Placement

- Always verify the link before ordering
- Check service min/max quantities
- Ensure sufficient balance
- Read service description carefully

### Account Security

- Use a strong password
- Don't share your API key
- Log out on shared devices
- Enable two-factor authentication (if available)

### Payment

- Keep transaction IDs for reference
- Provide accurate payment details
- Contact support if payment not approved within 24 hours

## Troubleshooting

### Order Issues

**Order stuck in pending:**
- Wait 1-2 hours for processing
- Check if link is correct
- Contact support if issue persists

**Order not starting:**
- Verify link is public/accessible
- Check service requirements
- Ensure account is active

### Payment Issues

**Payment not approved:**
- Verify transaction ID is correct
- Check payment was completed
- Wait full 24 hours before contacting support

**Insufficient balance:**
- Add funds before placing orders
- Check pending transactions

## Tips & Tricks

1. **Save Favorite Services**: Bookmark frequently used services
2. **Use Mass Orders**: Save time with bulk ordering
3. **Monitor Orders**: Check order progress regularly
4. **Plan Ahead**: Add funds in advance for faster ordering
5. **Read Descriptions**: Understand service requirements before ordering

## Next Steps

- [Explore API Documentation](./api-documentation.md)
- [Read FAQ](./faq.md)
- [Contact Support](./README.md#support)
