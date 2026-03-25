# 🔌 Provider Setup Guide

## Quick Start

### 1. Get Provider Account

Choose an SMM provider that offers API access:

**Popular Providers:**
- JustAnotherPanel (JAP)
- PerfectPanel
- SMMHeaven
- SMMKings
- BulkFollows
- SocialPanel

**Requirements:**
- API access enabled
- Sufficient balance
- API v2 format support

### 2. Get API Credentials

From your provider panel:
1. Go to API section
2. Copy API URL (usually ends with `/api/v2`)
3. Copy API Key
4. Note the API format (should be JSON POST)

### 3. Configure Environment

Edit `.env.local`:

```env
# SMM Provider Configuration
PROVIDER_NAME=JustAnotherPanel
PROVIDER_API_URL=https://justanotherpanel.com/api/v2
PROVIDER_API_KEY=your-api-key-here
```

### 4. Test Connection

1. Start your dev server: `npm run dev`
2. Login as admin
3. Go to `/admin/provider`
4. Click "Test Connection"
5. Should see: "Connection Successful!"

### 5. Check Balance

1. Click "Get Balance"
2. Verify you have funds
3. If balance is low, add funds in provider panel

### 6. Map Services

**Option A: Use Provider Service IDs**

In your database, update services with provider IDs:

```sql
UPDATE services 
SET provider_service_id = '123' 
WHERE id = 1;
```

**Option B: Auto-sync (Future)**

The system can fetch services from provider and auto-map.

### 7. Place Test Order

1. Go to `/new-order`
2. Select a service
3. Enter a test link
4. Enter minimum quantity
5. Submit order
6. Check if `external_order_id` is set in database

### 8. Verify in Provider Panel

1. Login to your provider panel
2. Go to orders section
3. Find your order by ID
4. Verify it's processing

---

## Troubleshooting

### Connection Failed

**Check:**
- API URL is correct (include `/api/v2`)
- API key is valid
- Provider API is online
- No typos in .env

**Test manually:**
```bash
curl -X POST https://provider.com/api/v2 \
  -H "Content-Type: application/json" \
  -d '{"key":"your-key","action":"balance"}'
```

### Order Not Sent to Provider

**Check:**
- Provider configured in .env
- Service has provider_service_id
- Provider balance sufficient
- Check console logs for errors

**Debug:**
```typescript
// Check logs in terminal
// Look for: "Provider order creation failed"
```

### Status Not Updating

**Check:**
- Order has external_order_id
- Provider API responding
- Order status in provider panel

**Manual update:**
1. Go to `/admin/provider`
2. Click "Update All Orders"
3. Check results

---

## Provider API Formats

### Standard Format (Most Common)

```json
POST /api/v2
Content-Type: application/json

{
  "key": "api-key",
  "action": "add|status|balance|services",
  "service": "123",
  "link": "url",
  "quantity": 1000
}
```

### Alternative Formats

If your provider uses different format, extend `SMMProvider`:

```typescript
export class CustomProvider extends BaseProvider {
  async createOrder(request: CreateOrderRequest) {
    // Custom API call format
    const response = await fetch(this.config.apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Custom format
        serviceId: request.service,
        targetUrl: request.link,
        amount: request.quantity,
      }),
    });
    // Parse custom response
  }
}
```

---

## Service Mapping

### Manual Mapping

1. Get service list from provider
2. Match with your services
3. Update database:

```sql
-- Example: Map Instagram Followers
UPDATE services 
SET provider_service_id = '123',
    provider_id = 1
WHERE name LIKE '%Instagram Followers%';
```

### Bulk Mapping

```sql
-- Map multiple services
UPDATE services SET provider_service_id = '123' WHERE id = 1;
UPDATE services SET provider_service_id = '124' WHERE id = 2;
UPDATE services SET provider_service_id = '125' WHERE id = 3;
-- ... etc
```

### Auto-sync (Future Feature)

```typescript
// Fetch provider services
const { services } = await provider.getServices();

// Auto-match by name similarity
for (const providerService of services) {
  const match = await findBestMatch(providerService.name);
  if (match) {
    await updateServiceMapping(match.id, providerService.service);
  }
}
```

---

## Multiple Providers (Future)

### Setup

```env
# Provider 1
PROVIDER_1_NAME=Provider A
PROVIDER_1_API_URL=https://provider-a.com/api/v2
PROVIDER_1_API_KEY=key-a

# Provider 2
PROVIDER_2_NAME=Provider B
PROVIDER_2_API_URL=https://provider-b.com/api/v2
PROVIDER_2_API_KEY=key-b
```

### Database

```sql
-- Store in api_providers table
INSERT INTO api_providers (name, api_url, api_key, is_active)
VALUES 
  ('Provider A', 'https://...', 'key-a', true),
  ('Provider B', 'https://...', 'key-b', true);

-- Map services to providers
UPDATE services SET provider_id = 1 WHERE id IN (1,2,3);
UPDATE services SET provider_id = 2 WHERE id IN (4,5,6);
```

---

## Monitoring

### Check Provider Balance

```bash
# Via admin panel
/admin/provider → Get Balance

# Via API (future)
curl /api/admin/provider/balance
```

### Monitor Orders

```sql
-- Orders without provider ID (failed to send)
SELECT * FROM orders 
WHERE external_order_id IS NULL 
AND status = 'pending';

-- Orders stuck in processing
SELECT * FROM orders 
WHERE status IN ('pending', 'processing')
AND created_at < NOW() - INTERVAL '1 hour';
```

### Set Up Alerts

```typescript
// Check balance daily
if (balance < 100) {
  sendAlert('Provider balance low: $' + balance);
}

// Check failed orders
const failedCount = await countFailedOrders();
if (failedCount > 10) {
  sendAlert('High failure rate: ' + failedCount);
}
```

---

## Best Practices

### Security
```
✅ Never commit API keys
✅ Use environment variables
✅ Rotate keys periodically
✅ Monitor API usage
✅ Set up IP whitelist (if supported)
```

### Reliability
```
✅ Monitor provider uptime
✅ Have backup provider
✅ Set up alerts
✅ Test regularly
✅ Keep balance sufficient
```

### Performance
```
✅ Cache provider instances
✅ Batch status updates
✅ Use async operations
✅ Implement rate limiting
✅ Monitor response times
```

---

## FAQ

### Q: Which provider should I use?
**A:** Choose based on:
- Service quality
- Pricing
- API reliability
- Support quality
- Payment methods

### Q: Can I use multiple providers?
**A:** Yes, but requires database setup. Currently supports single provider.

### Q: What if provider API is down?
**A:** Orders stay in "pending" status. Process manually or wait for provider to come back online.

### Q: How often are statuses updated?
**A:** Currently manual. Set up cron job for automatic updates (Phase 5).

### Q: Can I change providers?
**A:** Yes, just update .env and remap services.

### Q: Do I need to map all services?
**A:** Only services you want to offer. Unmapped services won't be sent to provider.

---

## Support

### Provider Issues
- Contact your provider support
- Check provider status page
- Review API documentation

### System Issues
- Check console logs
- Test connection in admin panel
- Review error messages
- Check database for external_order_id

### Need Help?
- Review `PHASE_2_COMPLETE.md`
- Check `IMPLEMENTATION_STATUS.md`
- Test with small orders first
- Monitor closely initially

---

**Setup Time:** ~15 minutes  
**Difficulty:** Easy  
**Requirements:** Provider account with API access

