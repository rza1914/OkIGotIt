# iShop API Documentation

## Base URL
- Development: `http://localhost:8000`
- Production: `https://your-domain.com`

## Authentication

iShop uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /api/v1/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "علی",
    "last_name": "احمدی",
    "is_active": true,
    "is_admin": false
  }
}
```

#### POST /api/v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "علی",
  "last_name": "احمدی",
  "phone": "09123456789"
}
```

#### POST /api/v1/auth/refresh
Refresh an access token.

**Request Body:**
```json
{
  "refresh_token": "your-refresh-token"
}
```

### Products

#### GET /api/v1/products
Get all products with optional filtering.

**Query Parameters:**
- `skip` (int): Number of products to skip (default: 0)
- `limit` (int): Maximum number of products to return (default: 100)
- `category_id` (int): Filter by category ID
- `search` (str): Search in product name and description
- `min_price` (float): Minimum price filter
- `max_price` (float): Maximum price filter
- `is_available` (bool): Filter by availability

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "محصول نمونه",
      "description": "توضیحات محصول",
      "price": 100000,
      "sale_price": 90000,
      "is_available": true,
      "stock_quantity": 50,
      "category_id": 1,
      "images": [
        {
          "id": 1,
          "url": "/uploads/products/image1.jpg",
          "alt_text": "تصویر محصول"
        }
      ],
      "category": {
        "id": 1,
        "name": "دسته‌بندی اصلی"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 2,
  "has_next": true,
  "has_prev": false
}
```

#### GET /api/v1/products/{product_id}
Get a single product by ID.

**Response:**
```json
{
  "id": 1,
  "name": "محصول نمونه",
  "description": "توضیحات کامل محصول...",
  "price": 100000,
  "sale_price": 90000,
  "is_available": true,
  "stock_quantity": 50,
  "category_id": 1,
  "specifications": {
    "weight": "500g",
    "dimensions": "10x15x20 cm",
    "color": "آبی"
  },
  "images": [...],
  "reviews": [
    {
      "id": 1,
      "user_name": "علی احمدی",
      "rating": 5,
      "comment": "محصول عالی",
      "created_at": "2023-12-01T10:00:00Z"
    }
  ],
  "average_rating": 4.5,
  "review_count": 12
}
```

#### POST /api/v1/products (Admin Only)
Create a new product.

**Request Body:**
```json
{
  "name": "محصول جدید",
  "description": "توضیحات محصول",
  "price": 100000,
  "sale_price": 90000,
  "category_id": 1,
  "stock_quantity": 100,
  "specifications": {
    "weight": "500g",
    "color": "قرمز"
  }
}
```

#### PUT /api/v1/products/{product_id} (Admin Only)
Update an existing product.

#### DELETE /api/v1/products/{product_id} (Admin Only)
Delete a product.

### Categories

#### GET /api/v1/categories
Get all product categories.

**Response:**
```json
[
  {
    "id": 1,
    "name": "الکترونیک",
    "description": "محصولات الکترونیکی",
    "parent_id": null,
    "image_url": "/uploads/categories/electronics.jpg",
    "product_count": 150,
    "children": [
      {
        "id": 2,
        "name": "موبایل",
        "parent_id": 1,
        "product_count": 45
      }
    ]
  }
]
```

#### POST /api/v1/categories (Admin Only)
Create a new category.

#### PUT /api/v1/categories/{category_id} (Admin Only)
Update a category.

#### DELETE /api/v1/categories/{category_id} (Admin Only)
Delete a category.

### Orders

#### GET /api/v1/orders (Authenticated)
Get user's orders or all orders (admin only).

**Response:**
```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "IS-1001",
      "status": "confirmed",
      "total_amount": 250000,
      "tax_amount": 22500,
      "shipping_cost": 15000,
      "final_amount": 287500,
      "created_at": "2023-12-01T10:00:00Z",
      "shipping_address": {
        "first_name": "علی",
        "last_name": "احمدی",
        "phone": "09123456789",
        "address": "تهران، خیابان ولیعصر",
        "postal_code": "1234567890"
      },
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "product_name": "محصول نمونه",
          "quantity": 2,
          "unit_price": 100000,
          "total_price": 200000
        }
      ],
      "payment": {
        "id": 1,
        "method": "zarinpal",
        "status": "completed",
        "transaction_id": "A1B2C3D4",
        "amount": 287500
      }
    }
  ]
}
```

#### POST /api/v1/orders (Authenticated)
Create a new order.

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "shipping_address": {
    "first_name": "علی",
    "last_name": "احمدی",
    "phone": "09123456789",
    "address": "تهران، خیابان ولیعصر",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "1234567890"
  },
  "payment_method": "zarinpal"
}
```

#### GET /api/v1/orders/{order_id} (Authenticated)
Get order details.

#### PUT /api/v1/orders/{order_id}/status (Admin Only)
Update order status.

### Cart

#### GET /api/v1/cart (Authenticated)
Get user's cart.

#### POST /api/v1/cart/items (Authenticated)
Add item to cart.

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

#### PUT /api/v1/cart/items/{item_id} (Authenticated)
Update cart item quantity.

#### DELETE /api/v1/cart/items/{item_id} (Authenticated)
Remove item from cart.

#### DELETE /api/v1/cart (Authenticated)
Clear entire cart.

### Users

#### GET /api/v1/users/me (Authenticated)
Get current user profile.

#### PUT /api/v1/users/me (Authenticated)
Update user profile.

**Request Body:**
```json
{
  "first_name": "علی",
  "last_name": "احمدی",
  "phone": "09123456789",
  "birth_date": "1990-01-01",
  "gender": "male",
  "address": {
    "address": "تهران، خیابان ولیعصر",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "1234567890"
  }
}
```

#### GET /api/v1/users (Admin Only)
Get all users.

#### GET /api/v1/users/{user_id} (Admin Only)
Get user by ID.

### Reviews

#### GET /api/v1/products/{product_id}/reviews
Get product reviews.

#### POST /api/v1/products/{product_id}/reviews (Authenticated)
Add a product review.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "محصول فوق‌العاده‌ای است"
}
```

### Search

#### GET /api/v1/search
Global search across products.

**Query Parameters:**
- `q` (str): Search query
- `category` (int): Category filter
- `min_price` (float): Minimum price
- `max_price` (float): Maximum price
- `sort_by` (str): Sort field (price, rating, date)
- `sort_order` (str): asc or desc

### Analytics (Admin Only)

#### GET /api/v1/analytics/sales
Get sales analytics.

#### GET /api/v1/analytics/products
Get product performance analytics.

#### GET /api/v1/analytics/users
Get user analytics.

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "detail": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "detail": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Anonymous users**: 100 requests per hour
- **Authenticated users**: 1000 requests per hour
- **Admin users**: 10000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following parameters:
- `page` (int): Page number (default: 1)
- `per_page` (int): Items per page (default: 20, max: 100)

Paginated responses include metadata:
```json
{
  "data": [...],
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

## Webhooks

iShop supports webhooks for real-time event notifications:

### Webhook Events
- `order.created`
- `order.updated`
- `order.completed`
- `payment.completed`
- `payment.failed`
- `product.stock_low`

### Webhook Payload Example
```json
{
  "event": "order.completed",
  "data": {
    "order_id": 123,
    "order_number": "IS-1001",
    "customer_email": "customer@example.com",
    "total_amount": 250000
  },
  "timestamp": "2023-12-01T10:00:00Z"
}
```