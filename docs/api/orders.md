# Orders API

## Overview

Manage customer orders, including order creation, tracking, and status updates.

## Endpoints

### GET /api/v1/orders

**[Authenticated]** Get orders. Regular users see their own orders, admins see all orders.

**Query Parameters:**
- `skip` (int) - Number of orders to skip (default: 0)
- `limit` (int) - Maximum orders to return (default: 20)
- `status` (str) - Filter by status: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`
- `from_date` (str) - Filter orders from date (ISO format)
- `to_date` (str) - Filter orders to date (ISO format)

**Example Request:**
```
GET /api/v1/orders?status=confirmed&from_date=2024-01-01
```

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
      "discount_amount": 0,
      "final_amount": 287500,
      "created_at": "2023-12-01T10:00:00Z",
      "updated_at": "2023-12-01T10:15:00Z",
      "shipping_address": {
        "first_name": "علی",
        "last_name": "احمدی",
        "phone": "09123456789",
        "address": "تهران، خیابان ولیعصر، پلاک 123",
        "city": "تهران",
        "province": "تهران",
        "postal_code": "1234567890"
      },
      "items_count": 3,
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "product_name": "محصول نمونه",
          "product_image": "/uploads/products/image1.jpg",
          "quantity": 2,
          "unit_price": 100000,
          "discount_amount": 0,
          "total_price": 200000
        }
      ],
      "payment": {
        "id": 1,
        "method": "zarinpal",
        "status": "completed",
        "transaction_id": "A1B2C3D4",
        "amount": 287500,
        "paid_at": "2023-12-01T10:10:00Z"
      },
      "tracking": {
        "tracking_number": "TRK-123456",
        "carrier": "پست پیشتاز",
        "estimated_delivery": "2023-12-05T00:00:00Z"
      }
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 3,
  "has_next": true,
  "has_prev": false
}
```

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Not authenticated

---

### GET /api/v1/orders/{order_id}

**[Authenticated]** Get detailed information about a specific order.

**Path Parameters:**
- `order_id` (int) - The order ID

**Response:**
```json
{
  "id": 1,
  "order_number": "IS-1001",
  "status": "confirmed",
  "user_id": 5,
  "user_email": "user@example.com",
  "total_amount": 250000,
  "tax_amount": 22500,
  "tax_rate": 9,
  "shipping_cost": 15000,
  "discount_amount": 0,
  "discount_code": null,
  "final_amount": 287500,
  "notes": "لطفا با احتیاط ارسال شود",
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T10:15:00Z",
  "confirmed_at": "2023-12-01T10:15:00Z",
  "shipping_address": {
    "first_name": "علی",
    "last_name": "احمدی",
    "phone": "09123456789",
    "email": "user@example.com",
    "address": "تهران، خیابان ولیعصر، پلاک 123",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "1234567890"
  },
  "billing_address": {
    "first_name": "علی",
    "last_name": "احمدی",
    "phone": "09123456789",
    "address": "تهران، خیابان آزادی، پلاک 456",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "0987654321"
  },
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product_name": "محصول نمونه",
      "product_sku": "PROD-001",
      "product_image": "/uploads/products/image1.jpg",
      "quantity": 2,
      "unit_price": 100000,
      "discount_amount": 0,
      "tax_amount": 18000,
      "total_price": 200000,
      "specifications": {
        "color": "آبی",
        "size": "بزرگ"
      }
    }
  ],
  "payment": {
    "id": 1,
    "method": "zarinpal",
    "method_name": "درگاه زرین‌پال",
    "status": "completed",
    "transaction_id": "A1B2C3D4",
    "reference_id": "REF123456",
    "amount": 287500,
    "paid_at": "2023-12-01T10:10:00Z",
    "card_number": "****1234"
  },
  "tracking": {
    "tracking_number": "TRK-123456",
    "carrier": "پست پیشتاز",
    "carrier_url": "https://tracking.post.ir/TRK-123456",
    "status": "in_transit",
    "estimated_delivery": "2023-12-05T00:00:00Z",
    "history": [
      {
        "status": "picked_up",
        "description": "بسته توسط پست تحویل گرفته شد",
        "location": "تهران - مرکز توزیع",
        "timestamp": "2023-12-01T14:00:00Z"
      },
      {
        "status": "in_transit",
        "description": "بسته در حال ارسال است",
        "location": "قم - مرکز توزیع",
        "timestamp": "2023-12-02T09:00:00Z"
      }
    ]
  },
  "status_history": [
    {
      "status": "pending",
      "changed_at": "2023-12-01T10:00:00Z",
      "changed_by": "system"
    },
    {
      "status": "confirmed",
      "changed_at": "2023-12-01T10:15:00Z",
      "changed_by": "admin",
      "notes": "سفارش تایید و آماده ارسال است"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Order found
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized to view this order
- `404 Not Found` - Order doesn't exist

---

### POST /api/v1/orders

**[Authenticated]** Create a new order.

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ],
  "shipping_address": {
    "first_name": "علی",
    "last_name": "احمدی",
    "phone": "09123456789",
    "email": "user@example.com",
    "address": "تهران، خیابان ولیعصر، پلاک 123",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "1234567890"
  },
  "billing_address": {
    "first_name": "علی",
    "last_name": "احمدی",
    "phone": "09123456789",
    "address": "تهران، خیابان آزادی، پلاک 456",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "0987654321"
  },
  "payment_method": "zarinpal",
  "discount_code": "SUMMER2024",
  "notes": "لطفا با احتیاط ارسال شود"
}
```

**Response:**
```json
{
  "id": 1,
  "order_number": "IS-1001",
  "status": "pending",
  "total_amount": 250000,
  "tax_amount": 22500,
  "shipping_cost": 15000,
  "discount_amount": 25000,
  "final_amount": 262500,
  "payment_url": "https://payment.zarinpal.com/pg/StartPay/A1B2C3D4",
  "created_at": "2023-12-01T10:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Order created successfully
- `400 Bad Request` - Invalid items, out of stock, or invalid discount code
- `401 Unauthorized` - Not authenticated
- `422 Validation Error` - Invalid request data

**Notes:**
- If `billing_address` is not provided, `shipping_address` will be used
- Stock quantities are reserved temporarily after order creation
- Payment must be completed within 30 minutes or order will be cancelled

---

### PUT /api/v1/orders/{order_id}/status

**[Admin Only]** Update order status.

**Path Parameters:**
- `order_id` (int) - The order ID

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "سفارش تایید و آماده ارسال است",
  "tracking_number": "TRK-123456",
  "carrier": "پست پیشتاز"
}
```

**Allowed Status Transitions:**
- `pending` → `confirmed` or `cancelled`
- `confirmed` → `processing` or `cancelled`
- `processing` → `shipped` or `cancelled`
- `shipped` → `delivered`
- Any status → `cancelled` (before shipped)

**Response:**
```json
{
  "id": 1,
  "order_number": "IS-1001",
  "status": "confirmed",
  "updated_at": "2023-12-01T10:15:00Z",
  "notes": "سفارش تایید و آماده ارسال است"
}
```

**Status Codes:**
- `200 OK` - Status updated successfully
- `400 Bad Request` - Invalid status transition
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - Order doesn't exist

---

### POST /api/v1/orders/{order_id}/cancel

**[Authenticated]** Cancel an order.

**Path Parameters:**
- `order_id` (int) - The order ID

**Request Body:**
```json
{
  "reason": "تغییر نظر مشتری",
  "notes": "محصول دیگر مورد نیاز نیست"
}
```

**Response:**
```json
{
  "id": 1,
  "order_number": "IS-1001",
  "status": "cancelled",
  "cancelled_at": "2023-12-01T11:00:00Z",
  "refund_status": "pending",
  "refund_amount": 262500
}
```

**Status Codes:**
- `200 OK` - Order cancelled successfully
- `400 Bad Request` - Order cannot be cancelled (already shipped)
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized to cancel this order
- `404 Not Found` - Order doesn't exist

**Notes:**
- Orders can only be cancelled before they are shipped
- Refunds are processed automatically within 3-7 business days
- Stock quantities are restored after cancellation

---

## Order Statistics

### GET /api/v1/orders/stats

**[Admin Only]** Get order statistics.

**Query Parameters:**
- `from_date` (str) - Start date (ISO format)
- `to_date` (str) - End date (ISO format)
- `group_by` (str) - Group by: `day`, `week`, `month`

**Response:**
```json
{
  "total_orders": 150,
  "total_revenue": 45000000,
  "average_order_value": 300000,
  "status_breakdown": {
    "pending": 10,
    "confirmed": 25,
    "processing": 30,
    "shipped": 40,
    "delivered": 35,
    "cancelled": 10
  },
  "top_products": [
    {
      "product_id": 1,
      "product_name": "محصول پرفروش",
      "quantity_sold": 120,
      "revenue": 12000000
    }
  ],
  "revenue_by_period": [
    {
      "period": "2024-01-01",
      "orders": 25,
      "revenue": 7500000
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin

---

## Order Statuses

| Status | Description | Next Allowed Status |
|--------|-------------|---------------------|
| `pending` | سفارش ثبت شده، در انتظار پرداخت | `confirmed`, `cancelled` |
| `confirmed` | پرداخت انجام شده، سفارش تایید شد | `processing`, `cancelled` |
| `processing` | در حال آماده‌سازی برای ارسال | `shipped`, `cancelled` |
| `shipped` | ارسال شده | `delivered` |
| `delivered` | تحویل داده شده | - |
| `cancelled` | لغو شده | - |

---

## Payment Methods

| Method | Code | Description |
|--------|------|-------------|
| زرین‌پال | `zarinpal` | درگاه پرداخت زرین‌پال |
| پی‌پینگ | `payping` | درگاه پرداخت پی‌پینگ |
| ملت | `mellat` | درگاه بانک ملت |
| پرداخت در محل | `cash_on_delivery` | پرداخت هنگام تحویل |

---

## Webhooks

Orders trigger the following webhook events:

- `order.created` - When a new order is created
- `order.confirmed` - When payment is completed
- `order.shipped` - When order is shipped
- `order.delivered` - When order is delivered
- `order.cancelled` - When order is cancelled

See [Webhooks Documentation](../webhooks.md) for more details.
