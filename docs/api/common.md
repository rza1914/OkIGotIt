# Common API Patterns

## Base URL

- **Development:** `http://localhost:8000`
- **Production:** `https://your-domain.com`

All API endpoints are prefixed with `/api/v1/`

**Example:**
```
http://localhost:8000/api/v1/products
https://your-domain.com/api/v1/auth/login
```

---

## Error Responses

All API endpoints return standardized error responses with appropriate HTTP status codes.

### 400 Bad Request

Invalid request data or business logic error.

```json
{
  "detail": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "status_code": 400
}
```

### 401 Unauthorized

Authentication required or invalid credentials.

```json
{
  "detail": "Authentication required",
  "message": "لطفا وارد حساب کاربری خود شوید",
  "status_code": 401
}
```

### 403 Forbidden

User doesn't have permission to access the resource.

```json
{
  "detail": "Insufficient permissions",
  "message": "شما دسترسی لازم برای این عملیات را ندارید",
  "required_role": "admin",
  "status_code": 403
}
```

### 404 Not Found

Resource doesn't exist.

```json
{
  "detail": "Resource not found",
  "message": "محصول مورد نظر یافت نشد",
  "resource_type": "product",
  "resource_id": 123,
  "status_code": 404
}
```

### 409 Conflict

Request conflicts with current state.

```json
{
  "detail": "Resource already exists",
  "message": "این ایمیل قبلا ثبت شده است",
  "conflict_field": "email",
  "status_code": 409
}
```

### 422 Validation Error

Request validation failed (FastAPI Pydantic validation).

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    },
    {
      "loc": ["body", "price"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error.number.not_gt",
      "ctx": {
        "limit_value": 0
      }
    }
  ],
  "status_code": 422
}
```

### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "detail": "Rate limit exceeded",
  "message": "تعداد درخواست‌های شما از حد مجاز گذشته است",
  "retry_after": 3600,
  "limit": 100,
  "remaining": 0,
  "reset_at": "2024-01-10T15:00:00Z",
  "status_code": 429
}
```

### 500 Internal Server Error

Unexpected server error.

```json
{
  "detail": "Internal server error",
  "message": "خطای سرور، لطفا بعدا تلاش کنید",
  "error_id": "err_abc123",
  "status_code": 500
}
```

**Note:** In production, detailed error messages are hidden for security. Use `error_id` for support inquiries.

---

## Rate Limiting

The API implements rate limiting to prevent abuse and ensure fair usage.

### Rate Limits by User Type

| User Type | Requests per Hour | Burst Limit |
|-----------|------------------|-------------|
| Anonymous | 100 | 10/minute |
| Authenticated | 1,000 | 50/minute |
| Admin | 10,000 | 200/minute |

### Rate Limit Headers

All responses include rate limit information in headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 3600
```

**Header Descriptions:**
- `X-RateLimit-Limit` - Maximum requests allowed in the current window
- `X-RateLimit-Remaining` - Remaining requests in current window
- `X-RateLimit-Reset` - Unix timestamp when the rate limit resets
- `X-RateLimit-Window` - Window duration in seconds

### Handling Rate Limits

When rate limit is exceeded (429 status):

1. Read `Retry-After` header for wait time
2. Implement exponential backoff
3. Use `X-RateLimit-Reset` to know when limit resets

**Example (JavaScript):**
```javascript
async function apiRequest(url) {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.log(`Rate limited. Retry after ${retryAfter} seconds`);
    await sleep(retryAfter * 1000);
    return apiRequest(url); // Retry
  }

  return response.json();
}
```

### Rate Limit Strategies

**Per Endpoint Limits** (stricter limits on sensitive endpoints):

| Endpoint | Limit |
|----------|-------|
| `/api/v1/auth/login` | 5 attempts per 15 minutes |
| `/api/v1/auth/register` | 3 attempts per hour |
| `/api/v1/users/me/send-verification-sms` | 3 per hour |
| `/api/v1/orders` (POST) | 10 per hour |

---

## Pagination

List endpoints support pagination to manage large datasets efficiently.

### Pagination Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | int | 1 | - | Page number (1-indexed) |
| `per_page` | int | 20 | 100 | Items per page |
| `skip` | int | 0 | - | Number of items to skip |
| `limit` | int | 20 | 100 | Maximum items to return |

**Note:** Use either `page/per_page` OR `skip/limit`, not both.

### Pagination Response Format

```json
{
  "data": [
    {
      "id": 1,
      "name": "Item 1"
    },
    {
      "id": 2,
      "name": "Item 2"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  }
}
```

**Pagination Fields:**
- `page` - Current page number
- `per_page` - Items per page
- `total` - Total number of items
- `pages` - Total number of pages
- `has_next` - Whether there's a next page
- `has_prev` - Whether there's a previous page
- `next_page` - Next page number (null if last page)
- `prev_page` - Previous page number (null if first page)

### Example Requests

**Using page/per_page:**
```
GET /api/v1/products?page=2&per_page=50
```

**Using skip/limit:**
```
GET /api/v1/products?skip=50&limit=50
```

### Link Headers

Paginated responses also include Link headers for easy navigation:

```http
Link: <http://api.example.com/products?page=1>; rel="first",
      <http://api.example.com/products?page=2>; rel="prev",
      <http://api.example.com/products?page=4>; rel="next",
      <http://api.example.com/products?page=8>; rel="last"
```

---

## Sorting

List endpoints support sorting by various fields.

### Sort Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `sort_by` | string | Field to sort by |
| `sort_order` | string | Sort direction: `asc` or `desc` |

**Example:**
```
GET /api/v1/products?sort_by=price&sort_order=asc
```

### Common Sort Fields

**Products:**
- `price` - Product price
- `rating` - Average rating
- `date` - Creation date
- `name` - Product name
- `popularity` - Number of sales

**Orders:**
- `created_at` - Order date
- `total` - Order total amount
- `status` - Order status

**Users:**
- `created_at` - Registration date
- `last_login` - Last login time
- `total_spent` - Total amount spent

---

## Filtering

List endpoints support filtering by various criteria.

### Filter Parameters

Filters are passed as query parameters:

```
GET /api/v1/products?category_id=1&min_price=50000&max_price=200000&is_available=true
```

### Common Filters

**Products:**
- `category_id` - Filter by category
- `min_price` / `max_price` - Price range
- `is_available` - Availability status
- `search` - Text search in name/description

**Orders:**
- `status` - Order status
- `from_date` / `to_date` - Date range
- `user_id` - Filter by user (admin only)

**Users:**
- `is_active` - Active status
- `is_verified` - Verification status
- `search` - Search by name, email, or phone

---

## Search

Global search across multiple fields and resources.

### Search Parameters

| Parameter | Description |
|-----------|-------------|
| `q` | Search query (required) |
| `type` | Resource type: `products`, `orders`, `users` |
| `fields` | Comma-separated fields to search |

**Example:**
```
GET /api/v1/search?q=موبایل&type=products
```

### Search Response

```json
{
  "results": [
    {
      "type": "product",
      "id": 1,
      "title": "موبایل سامسونگ",
      "description": "توضیحات محصول",
      "score": 0.95,
      "url": "/api/v1/products/1"
    }
  ],
  "total": 25,
  "query": "موبایل",
  "took": 45
}
```

---

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for specified origins.

**Allowed Origins:**
- `http://localhost:3000` (development)
- `http://localhost:5173` (Vite dev server)
- `https://your-domain.com` (production)

**Allowed Methods:**
- GET
- POST
- PUT
- DELETE
- PATCH
- OPTIONS

**Allowed Headers:**
- Content-Type
- Authorization
- X-Requested-With

---

## Content Types

### Request Content-Type

- **JSON:** `application/json` (default)
- **Form Data:** `multipart/form-data` (for file uploads)
- **URL Encoded:** `application/x-www-form-urlencoded`

### Response Content-Type

All API responses are JSON with UTF-8 encoding:
```http
Content-Type: application/json; charset=utf-8
```

---

## Versioning

The API uses URL versioning: `/api/v1/`

**Future versions:**
- `/api/v2/` (when available)

**Backward Compatibility:**
- v1 endpoints will be supported for at least 1 year after v2 release
- Breaking changes will only be introduced in new versions
- Deprecated endpoints will include a `Deprecated` header

---

## Caching

API responses include caching headers:

```http
Cache-Control: public, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 10 Jan 2024 10:00:00 GMT
```

**Cacheable Endpoints:**
- `GET /api/v1/products` - 5 minutes
- `GET /api/v1/categories` - 1 hour
- `GET /api/v1/products/{id}` - 10 minutes

**Non-Cacheable:**
- User-specific data (cart, orders, profile)
- Authentication endpoints
- Admin endpoints

### ETag Support

Use `If-None-Match` header to check for updates:

```http
GET /api/v1/products/1
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

If resource hasn't changed, returns `304 Not Modified`.

---

## Compression

API responses support gzip compression. Include header:

```http
Accept-Encoding: gzip, deflate
```

Compressed responses include:
```http
Content-Encoding: gzip
```

---

## Webhooks

Subscribe to events via webhooks. See [Webhooks Documentation](./webhooks.md) for details.

### Common Webhook Events

- `order.created`
- `order.updated`
- `payment.completed`
- `product.stock_low`
- `user.registered`

---

## API Status

Check API health and status:

### GET /api/health

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-01-10T10:00:00Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "storage": "ok"
  }
}
```

### GET /api/v1/status

```json
{
  "api_version": "1.0.0",
  "docs_url": "/docs",
  "rate_limits": {
    "anonymous": 100,
    "authenticated": 1000,
    "admin": 10000
  }
}
```
