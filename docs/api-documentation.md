# API Documentation

Complete API reference for integrating with SMM Panel.

## Authentication

All API requests require authentication using your API key.

### Getting Your API Key

1. Log in to your dashboard
2. Go to **Settings** → **API Key**
3. Click "Generate API Key"
4. Copy and save your key securely

### Using Your API Key

Include your API key in the request headers or as a parameter:

**Header Authentication:**
```
Authorization: Bearer YOUR_API_KEY
```

**Parameter Authentication:**
```
?api_key=YOUR_API_KEY
```

## Base URL

```
https://your-domain.com/api/v1
```

## Endpoints

### 1. Get Balance

Get your current account balance.

**Endpoint:** `GET /balance`

**Request:**
```bash
curl -X GET "https://your-domain.com/api/v1/balance" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "success": true,
  "balance": 150.50,
  "currency": "USD"
}
```

### 2. Get Services

Retrieve list of available services.

**Endpoint:** `GET /services`

**Parameters:**
- `platform` (optional): Filter by platform (instagram, facebook, youtube, etc.)
- `category_id` (optional): Filter by category ID

**Request:**
```bash
curl -X GET "https://your-domain.com/api/v1/services?platform=instagram" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "id": 12841,
      "name": "Instagram Likes - 100% Real Brazilian Accounts",
      "category": "Instagram Likes",
      "rate": 0.15,
      "min_quantity": 100,
      "max_quantity": 50000,
      "average_time": "0-1 Hour",
      "description": "Premium quality likes from real Brazilian users"
    }
  ]
}
```

### 3. Place Order

Create a new order.

**Endpoint:** `POST /order`

**Parameters:**
- `service_id` (required): Service ID
- `link` (required): Target URL
- `quantity` (required): Order quantity
- `custom_comments` (optional): Custom comments (one per line)

**Request:**
```bash
curl -X POST "https://your-domain.com/api/v1/order" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": 12841,
    "link": "https://instagram.com/p/example",
    "quantity": 1000
  }'
```

**Response:**
```json
{
  "success": true,
  "order_id": 12345,
  "charge": 0.15,
  "balance_after": 150.35,
  "message": "Order placed successfully"
}
```

### 4. Get Order Status

Check the status of an order.

**Endpoint:** `GET /order/:order_id`

**Request:**
```bash
curl -X GET "https://your-domain.com/api/v1/order/12345" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 12345,
    "service_id": 12841,
    "service_name": "Instagram Likes",
    "link": "https://instagram.com/p/example",
    "quantity": 1000,
    "start_count": 5000,
    "remains": 200,
    "charge": 0.15,
    "status": "in_progress",
    "created_at": "2024-03-25T10:30:00Z"
  }
}
```

### 5. Get Orders

Retrieve your order history.

**Endpoint:** `GET /orders`

**Parameters:**
- `status` (optional): Filter by status
- `limit` (optional): Number of orders to return (default: 50, max: 100)
- `offset` (optional): Pagination offset

**Request:**
```bash
curl -X GET "https://your-domain.com/api/v1/orders?status=completed&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": 12345,
      "service_name": "Instagram Likes",
      "quantity": 1000,
      "charge": 0.15,
      "status": "completed",
      "created_at": "2024-03-25T10:30:00Z"
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0
}
```

### 6. Mass Order

Place multiple orders at once.

**Endpoint:** `POST /mass-order`

**Parameters:**
- `orders` (required): Array of order objects

**Request:**
```bash
curl -X POST "https://your-domain.com/api/v1/mass-order" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "orders": [
      {
        "service_id": 12841,
        "link": "https://instagram.com/p/example1",
        "quantity": 1000
      },
      {
        "service_id": 12842,
        "link": "https://instagram.com/p/example2",
        "quantity": 500
      }
    ]
  }'
```

**Response:**
```json
{
  "success": true,
  "orders_placed": 2,
  "total_charge": 0.25,
  "balance_after": 150.25,
  "order_ids": [12345, 12346]
}
```

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 403 | Forbidden - Insufficient balance |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Error Handling

All errors return a JSON response:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

- `INVALID_API_KEY`: API key is invalid or expired
- `INSUFFICIENT_BALANCE`: Not enough balance for order
- `INVALID_SERVICE`: Service ID doesn't exist
- `INVALID_LINK`: Link format is incorrect
- `QUANTITY_OUT_OF_RANGE`: Quantity outside min/max limits
- `SERVICE_UNAVAILABLE`: Service is currently inactive

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Standard**: 60 requests per minute
- **Burst**: 100 requests per minute (short bursts)

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1616161616
```

## Best Practices

### 1. Error Handling

Always check the `success` field in responses:

```javascript
const response = await fetch('/api/v1/order', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
});

const data = await response.json();

if (data.success) {
  console.log('Order placed:', data.order_id);
} else {
  console.error('Error:', data.error);
}
```

### 2. Balance Checking

Check balance before placing orders:

```javascript
const balance = await getBalance();
if (balance >= orderCost) {
  await placeOrder(orderData);
} else {
  console.log('Insufficient balance');
}
```

### 3. Order Monitoring

Poll order status periodically:

```javascript
async function waitForCompletion(orderId) {
  const maxAttempts = 60; // 5 minutes
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const order = await getOrderStatus(orderId);
    
    if (order.status === 'completed') {
      return order;
    }
    
    await sleep(5000); // Wait 5 seconds
    attempts++;
  }
  
  throw new Error('Order timeout');
}
```

### 4. Retry Logic

Implement exponential backoff for failed requests:

```javascript
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}
```

## Code Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_KEY = 'your_api_key';
const BASE_URL = 'https://your-domain.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Get services
async function getServices() {
  const response = await api.get('/services');
  return response.data.services;
}

// Place order
async function placeOrder(serviceId, link, quantity) {
  const response = await api.post('/order', {
    service_id: serviceId,
    link: link,
    quantity: quantity
  });
  return response.data;
}

// Get order status
async function getOrderStatus(orderId) {
  const response = await api.get(`/order/${orderId}`);
  return response.data.order;
}
```

### Python

```python
import requests

API_KEY = 'your_api_key'
BASE_URL = 'https://your-domain.com/api/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Get services
def get_services():
    response = requests.get(f'{BASE_URL}/services', headers=headers)
    return response.json()['services']

# Place order
def place_order(service_id, link, quantity):
    data = {
        'service_id': service_id,
        'link': link,
        'quantity': quantity
    }
    response = requests.post(f'{BASE_URL}/order', json=data, headers=headers)
    return response.json()

# Get order status
def get_order_status(order_id):
    response = requests.get(f'{BASE_URL}/order/{order_id}', headers=headers)
    return response.json()['order']
```

### PHP

```php
<?php

$apiKey = 'your_api_key';
$baseUrl = 'https://your-domain.com/api/v1';

function makeRequest($endpoint, $method = 'GET', $data = null) {
    global $apiKey, $baseUrl;
    
    $ch = curl_init($baseUrl . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ]);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Get services
$services = makeRequest('/services');

// Place order
$order = makeRequest('/order', 'POST', [
    'service_id' => 12841,
    'link' => 'https://instagram.com/p/example',
    'quantity' => 1000
]);

// Get order status
$orderStatus = makeRequest('/order/12345');
?>
```

## Webhooks

Configure webhooks to receive real-time order updates:

1. Go to Settings → API → Webhooks
2. Enter your webhook URL
3. Select events to receive
4. Save configuration

### Webhook Payload

```json
{
  "event": "order.completed",
  "order_id": 12345,
  "status": "completed",
  "timestamp": "2024-03-25T10:30:00Z"
}
```

### Webhook Events

- `order.created`: Order was created
- `order.processing`: Order started processing
- `order.completed`: Order completed
- `order.partial`: Order partially completed
- `order.cancelled`: Order was cancelled

## Support

Need help with API integration?

- Email: api@smmPanel.com
- Documentation: https://docs.smmPanel.com
- Support Tickets: Create in dashboard

## Changelog

### v1.0.0 (2024-03-25)
- Initial API release
- Basic order management
- Service listing
- Balance checking
