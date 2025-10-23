# iShop API Documentation

## Overview

Welcome to the iShop API documentation! This RESTful API provides complete e-commerce functionality including product management, orders, payments, and user management.

**Base URL:**
- Development: `http://localhost:8000/api/v1`
- Production: `https://your-domain.com/api/v1`

**API Version:** 1.0.0

---

## Quick Start

### 1. Register a User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "first_name": "علی",
    "last_name": "احمدی",
    "phone": "09123456789"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Get Products

```bash
curl http://localhost:8000/api/v1/products
```

### 4. Create an Order

```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"product_id": 1, "quantity": 2}],
    "shipping_address": {...},
    "payment_method": "zarinpal"
  }'
```

---

## API Documentation

### Core Resources

| Resource | Description | Documentation |
|----------|-------------|---------------|
| [Authentication](./authentication.md) | User authentication and registration | [View Docs](./authentication.md) |
| [Products](./products.md) | Product catalog and management | [View Docs](./products.md) |
| [Orders](./orders.md) | Order creation and tracking | [View Docs](./orders.md) |
| [Cart](./cart.md) | Shopping cart management | [View Docs](./cart.md) |
| [Users](./users.md) | User profiles and management | [View Docs](./users.md) |
| [Common Patterns](./common.md) | Error handling, pagination, rate limiting | [View Docs](./common.md) |

---

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Token Lifetime:**
- Access Token: 30 minutes
- Refresh Token: 7 days

**Example:**
```javascript
const response = await fetch('http://localhost:8000/api/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

## Rate Limits

| User Type | Requests/Hour | Burst Limit |
|-----------|---------------|-------------|
| Anonymous | 100 | 10/minute |
| Authenticated | 1,000 | 50/minute |
| Admin | 10,000 | 200/minute |

Rate limit information is included in response headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1640995200
```

---

## Response Format

All responses are JSON with the following structure:

### Success Response

```json
{
  "id": 1,
  "name": "محصول نمونه",
  "price": 100000,
  ...
}
```

### Error Response

```json
{
  "detail": "Error message",
  "status_code": 400,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content to return |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Validation Error - Request validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Pagination

List endpoints support pagination:

```http
GET /api/v1/products?page=1&per_page=20
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Filtering & Sorting

### Filtering

```http
GET /api/v1/products?category_id=1&min_price=50000&max_price=200000
```

### Sorting

```http
GET /api/v1/products?sort_by=price&sort_order=asc
```

### Search

```http
GET /api/v1/search?q=موبایل
```

---

## Webhooks

Subscribe to real-time events:

**Available Events:**
- `order.created`
- `order.updated`
- `order.completed`
- `payment.completed`
- `payment.failed`
- `product.stock_low`

See [Webhooks Documentation](./webhooks.md) for setup instructions.

---

## Testing

### Interactive API Documentation

FastAPI provides interactive API documentation:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Example Collections

Download Postman/Insomnia collections:
- [Postman Collection](../testing/postman-collection.json)
- [Insomnia Collection](../testing/insomnia-collection.json)

---

## SDKs & Libraries

### JavaScript/TypeScript

```bash
npm install @ishop/api-client
```

```javascript
import { iShopClient } from '@ishop/api-client';

const client = new iShopClient({
  baseURL: 'http://localhost:8000',
  apiKey: 'your-api-key'
});

const products = await client.products.list();
```

### Python

```bash
pip install ishop-client
```

```python
from ishop import iShopClient

client = iShopClient(
    base_url='http://localhost:8000',
    api_key='your-api-key'
)

products = client.products.list()
```

---

## Support

### Resources

- 📖 [Full Documentation](../)
- 🐛 [Report Issues](https://github.com/yourusername/iShop/issues)
- 💬 [Community Forum](https://forum.ishop.com)
- 📧 [Email Support](mailto:support@ishop.com)

### Getting Help

1. Check the documentation first
2. Search existing issues on GitHub
3. Ask in the community forum
4. Contact support for urgent issues

---

## Changelog

See [CHANGELOG.md](../../CHANGELOG.md) for API changes and updates.

---

## License

This API is part of the iShop e-commerce platform.

---

**Happy Coding!** 🚀
