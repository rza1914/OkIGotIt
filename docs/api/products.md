# Products API

## Overview

Manage and retrieve product information including listings, details, and inventory.

## Endpoints

### GET /api/v1/products

Get all products with optional filtering and pagination.

**Query Parameters:**
- `skip` (int) - Number of products to skip (default: 0)
- `limit` (int) - Maximum number of products to return (default: 100)
- `category_id` (int) - Filter by category ID
- `search` (str) - Search in product name and description
- `min_price` (float) - Minimum price filter
- `max_price` (float) - Maximum price filter
- `is_available` (bool) - Filter by availability
- `sort_by` (str) - Sort field: `price`, `rating`, `date`, `name`
- `sort_order` (str) - Sort order: `asc` or `desc`

**Example Request:**
```
GET /api/v1/products?category_id=1&min_price=50000&max_price=200000&sort_by=price&sort_order=asc
```

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
      "discount_percentage": 10,
      "is_available": true,
      "stock_quantity": 50,
      "category_id": 1,
      "sku": "PROD-001",
      "images": [
        {
          "id": 1,
          "url": "/uploads/products/image1.jpg",
          "alt_text": "تصویر محصول",
          "is_primary": true
        }
      ],
      "category": {
        "id": 1,
        "name": "دسته‌بندی اصلی",
        "slug": "main-category"
      },
      "average_rating": 4.5,
      "review_count": 12,
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 2,
  "has_next": true,
  "has_prev": false
}
```

**Status Codes:**
- `200 OK` - Request successful
- `400 Bad Request` - Invalid query parameters

---

### GET /api/v1/products/{product_id}

Get detailed information about a single product.

**Path Parameters:**
- `product_id` (int) - The product ID

**Response:**
```json
{
  "id": 1,
  "name": "محصول نمونه",
  "description": "توضیحات کامل محصول...",
  "price": 100000,
  "sale_price": 90000,
  "discount_percentage": 10,
  "is_available": true,
  "stock_quantity": 50,
  "category_id": 1,
  "sku": "PROD-001",
  "weight": "500g",
  "dimensions": {
    "length": 10,
    "width": 15,
    "height": 20,
    "unit": "cm"
  },
  "specifications": {
    "weight": "500g",
    "dimensions": "10x15x20 cm",
    "color": "آبی",
    "material": "پلاستیک",
    "warranty": "1 سال"
  },
  "images": [
    {
      "id": 1,
      "url": "/uploads/products/image1.jpg",
      "alt_text": "تصویر اصلی محصول",
      "is_primary": true
    },
    {
      "id": 2,
      "url": "/uploads/products/image2.jpg",
      "alt_text": "تصویر جانبی محصول",
      "is_primary": false
    }
  ],
  "category": {
    "id": 1,
    "name": "دسته‌بندی اصلی",
    "slug": "main-category",
    "parent_id": null
  },
  "reviews": [
    {
      "id": 1,
      "user_id": 5,
      "user_name": "علی احمدی",
      "rating": 5,
      "comment": "محصول عالی",
      "helpful_count": 3,
      "created_at": "2023-12-01T10:00:00Z"
    }
  ],
  "average_rating": 4.5,
  "review_count": 12,
  "related_products": [
    {
      "id": 2,
      "name": "محصول مرتبط",
      "price": 120000,
      "sale_price": 110000,
      "image_url": "/uploads/products/related.jpg"
    }
  ],
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Product found
- `404 Not Found` - Product doesn't exist

---

### POST /api/v1/products

**[Admin Only]** Create a new product.

**Authentication Required:** Yes (Admin)

**Request Body:**
```json
{
  "name": "محصول جدید",
  "description": "توضیحات کامل محصول",
  "price": 100000,
  "sale_price": 90000,
  "category_id": 1,
  "stock_quantity": 100,
  "sku": "PROD-002",
  "is_available": true,
  "specifications": {
    "weight": "500g",
    "color": "قرمز",
    "material": "فلز"
  },
  "tags": ["جدید", "محبوب"]
}
```

**Response:**
```json
{
  "id": 10,
  "name": "محصول جدید",
  "description": "توضیحات کامل محصول",
  "price": 100000,
  "sale_price": 90000,
  "discount_percentage": 10,
  "is_available": true,
  "stock_quantity": 100,
  "category_id": 1,
  "sku": "PROD-002",
  "specifications": {
    "weight": "500g",
    "color": "قرمز",
    "material": "فلز"
  },
  "created_at": "2024-01-20T14:30:00Z",
  "updated_at": "2024-01-20T14:30:00Z"
}
```

**Status Codes:**
- `201 Created` - Product created successfully
- `400 Bad Request` - SKU already exists
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `422 Validation Error` - Invalid request data

---

### PUT /api/v1/products/{product_id}

**[Admin Only]** Update an existing product.

**Authentication Required:** Yes (Admin)

**Path Parameters:**
- `product_id` (int) - The product ID

**Request Body:** (all fields optional)
```json
{
  "name": "نام جدید محصول",
  "description": "توضیحات به‌روزشده",
  "price": 110000,
  "sale_price": 95000,
  "stock_quantity": 75,
  "is_available": true
}
```

**Response:**
```json
{
  "id": 1,
  "name": "نام جدید محصول",
  "description": "توضیحات به‌روزشده",
  "price": 110000,
  "sale_price": 95000,
  "stock_quantity": 75,
  "is_available": true,
  "updated_at": "2024-01-20T15:45:00Z"
}
```

**Status Codes:**
- `200 OK` - Product updated successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - Product doesn't exist
- `422 Validation Error` - Invalid request data

---

### DELETE /api/v1/products/{product_id}

**[Admin Only]** Delete a product.

**Authentication Required:** Yes (Admin)

**Path Parameters:**
- `product_id` (int) - The product ID

**Response:**
```json
{
  "message": "Product deleted successfully",
  "id": 1
}
```

**Status Codes:**
- `200 OK` - Product deleted successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - Product doesn't exist
- `409 Conflict` - Product has existing orders

---

## Categories

### GET /api/v1/categories

Get all product categories with hierarchy.

**Response:**
```json
[
  {
    "id": 1,
    "name": "الکترونیک",
    "slug": "electronics",
    "description": "محصولات الکترونیکی",
    "parent_id": null,
    "image_url": "/uploads/categories/electronics.jpg",
    "product_count": 150,
    "is_active": true,
    "children": [
      {
        "id": 2,
        "name": "موبایل",
        "slug": "mobile",
        "parent_id": 1,
        "product_count": 45,
        "is_active": true
      },
      {
        "id": 3,
        "name": "لپ‌تاپ",
        "slug": "laptop",
        "parent_id": 1,
        "product_count": 30,
        "is_active": true
      }
    ]
  }
]
```

**Status Codes:**
- `200 OK` - Request successful

---

### POST /api/v1/categories

**[Admin Only]** Create a new category.

**Request Body:**
```json
{
  "name": "دسته‌بندی جدید",
  "slug": "new-category",
  "description": "توضیحات دسته‌بندی",
  "parent_id": null,
  "is_active": true
}
```

**Status Codes:**
- `201 Created` - Category created successfully
- `400 Bad Request` - Slug already exists
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin

---

### PUT /api/v1/categories/{category_id}

**[Admin Only]** Update a category.

**Status Codes:**
- `200 OK` - Category updated successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - Category doesn't exist

---

### DELETE /api/v1/categories/{category_id}

**[Admin Only]** Delete a category.

**Status Codes:**
- `200 OK` - Category deleted successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - Category doesn't exist
- `409 Conflict` - Category has products or subcategories

---

## Product Reviews

### GET /api/v1/products/{product_id}/reviews

Get all reviews for a product.

**Query Parameters:**
- `skip` (int) - Number of reviews to skip (default: 0)
- `limit` (int) - Maximum reviews to return (default: 20)
- `sort_by` (str) - Sort by: `date`, `rating`, `helpful`

**Response:**
```json
{
  "reviews": [
    {
      "id": 1,
      "user_id": 5,
      "user_name": "علی احمدی",
      "rating": 5,
      "comment": "محصول فوق‌العاده‌ای است",
      "helpful_count": 3,
      "created_at": "2023-12-01T10:00:00Z"
    }
  ],
  "total": 12,
  "average_rating": 4.5
}
```

---

### POST /api/v1/products/{product_id}/reviews

**[Authenticated]** Add a review for a product.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "محصول فوق‌العاده‌ای است"
}
```

**Status Codes:**
- `201 Created` - Review added successfully
- `400 Bad Request` - Already reviewed or haven't purchased
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Product doesn't exist

---

## Search

### GET /api/v1/search

Global search across products.

**Query Parameters:**
- `q` (str) - Search query (required)
- `category` (int) - Category filter
- `min_price` (float) - Minimum price
- `max_price` (float) - Maximum price
- `sort_by` (str) - Sort field: `relevance`, `price`, `rating`, `date`
- `sort_order` (str) - Sort order: `asc` or `desc`
- `page` (int) - Page number (default: 1)
- `per_page` (int) - Items per page (default: 20)

**Example:**
```
GET /api/v1/search?q=موبایل&category=1&min_price=1000000&sort_by=price
```

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "موبایل سامسونگ",
      "price": 5000000,
      "sale_price": 4500000,
      "image_url": "/uploads/products/mobile1.jpg",
      "rating": 4.5,
      "relevance_score": 0.95
    }
  ],
  "total": 25,
  "query": "موبایل",
  "page": 1,
  "pages": 2
}
```

**Status Codes:**
- `200 OK` - Search successful
- `400 Bad Request` - Invalid query parameters
