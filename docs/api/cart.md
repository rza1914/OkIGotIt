# Cart API

## Overview

Manage shopping cart functionality for authenticated users.

## Endpoints

### GET /api/v1/cart

**[Authenticated]** Get current user's cart with all items.

**Response:**
```json
{
  "id": 1,
  "user_id": 5,
  "items": [
    {
      "id": 1,
      "cart_id": 1,
      "product_id": 1,
      "product": {
        "id": 1,
        "name": "محصول نمونه",
        "price": 100000,
        "sale_price": 90000,
        "image_url": "/uploads/products/image1.jpg",
        "is_available": true,
        "stock_quantity": 50
      },
      "quantity": 2,
      "unit_price": 90000,
      "total_price": 180000,
      "added_at": "2023-12-01T10:00:00Z"
    },
    {
      "id": 2,
      "cart_id": 1,
      "product_id": 3,
      "product": {
        "id": 3,
        "name": "محصول دوم",
        "price": 150000,
        "sale_price": null,
        "image_url": "/uploads/products/image2.jpg",
        "is_available": true,
        "stock_quantity": 20
      },
      "quantity": 1,
      "unit_price": 150000,
      "total_price": 150000,
      "added_at": "2023-12-01T10:05:00Z"
    }
  ],
  "items_count": 2,
  "total_quantity": 3,
  "subtotal": 330000,
  "discount_amount": 10000,
  "tax_amount": 28800,
  "shipping_cost": 15000,
  "total": 363800,
  "updated_at": "2023-12-01T10:05:00Z"
}
```

**Status Codes:**
- `200 OK` - Cart retrieved successfully
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Cart doesn't exist (empty cart)

---

### POST /api/v1/cart/items

**[Authenticated]** Add an item to the cart.

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "id": 1,
  "cart_id": 1,
  "product_id": 1,
  "product": {
    "id": 1,
    "name": "محصول نمونه",
    "price": 100000,
    "sale_price": 90000,
    "image_url": "/uploads/products/image1.jpg",
    "is_available": true,
    "stock_quantity": 50
  },
  "quantity": 2,
  "unit_price": 90000,
  "total_price": 180000,
  "added_at": "2023-12-01T10:00:00Z",
  "message": "محصول به سبد خرید اضافه شد"
}
```

**Status Codes:**
- `201 Created` - Item added successfully
- `200 OK` - Item quantity updated (if already in cart)
- `400 Bad Request` - Product out of stock or insufficient stock
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Product doesn't exist

**Notes:**
- If the product is already in the cart, the quantity will be increased
- Maximum quantity per item is limited by stock availability
- Sale prices are applied automatically if available

---

### PUT /api/v1/cart/items/{item_id}

**[Authenticated]** Update cart item quantity.

**Path Parameters:**
- `item_id` (int) - The cart item ID

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response:**
```json
{
  "id": 1,
  "cart_id": 1,
  "product_id": 1,
  "quantity": 5,
  "unit_price": 90000,
  "total_price": 450000,
  "updated_at": "2023-12-01T10:10:00Z",
  "message": "تعداد محصول به‌روزرسانی شد"
}
```

**Status Codes:**
- `200 OK` - Quantity updated successfully
- `400 Bad Request` - Insufficient stock or invalid quantity
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized to update this item
- `404 Not Found` - Item doesn't exist

**Notes:**
- Quantity must be greater than 0
- To remove an item, use the DELETE endpoint instead of setting quantity to 0

---

### DELETE /api/v1/cart/items/{item_id}

**[Authenticated]** Remove an item from the cart.

**Path Parameters:**
- `item_id` (int) - The cart item ID

**Response:**
```json
{
  "message": "محصول از سبد خرید حذف شد",
  "cart_summary": {
    "items_count": 1,
    "total_quantity": 1,
    "total": 183800
  }
}
```

**Status Codes:**
- `200 OK` - Item removed successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized to remove this item
- `404 Not Found` - Item doesn't exist

---

### DELETE /api/v1/cart

**[Authenticated]** Clear entire cart (remove all items).

**Response:**
```json
{
  "message": "سبد خرید خالی شد",
  "items_removed": 3
}
```

**Status Codes:**
- `200 OK` - Cart cleared successfully
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Cart is already empty

---

### POST /api/v1/cart/apply-coupon

**[Authenticated]** Apply a discount coupon to the cart.

**Request Body:**
```json
{
  "coupon_code": "SUMMER2024"
}
```

**Response:**
```json
{
  "coupon": {
    "code": "SUMMER2024",
    "type": "percentage",
    "value": 10,
    "description": "تخفیف 10 درصدی تابستانه"
  },
  "discount_amount": 33000,
  "cart_total": 330800,
  "message": "کد تخفیف با موفقیت اعمال شد"
}
```

**Status Codes:**
- `200 OK` - Coupon applied successfully
- `400 Bad Request` - Invalid, expired, or already used coupon
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Coupon doesn't exist

**Coupon Types:**
- `percentage` - Percentage discount (e.g., 10%)
- `fixed` - Fixed amount discount (e.g., 50,000 تومان)
- `free_shipping` - Free shipping

---

### DELETE /api/v1/cart/remove-coupon

**[Authenticated]** Remove applied coupon from cart.

**Response:**
```json
{
  "message": "کد تخفیف حذف شد",
  "cart_total": 363800
}
```

**Status Codes:**
- `200 OK` - Coupon removed successfully
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - No coupon applied

---

## Cart Calculations

### Price Breakdown

```
Subtotal (مجموع اقلام) = Sum of all item prices
Discount (تخفیف)       = Coupon discount + product discounts
Tax (مالیات)           = (Subtotal - Discount) × Tax Rate (9%)
Shipping (هزینه ارسال) = Based on weight/location
─────────────────────────────────────────────────
Total (مجموع نهایی)   = Subtotal - Discount + Tax + Shipping
```

### Shipping Cost Calculation

| Weight | Cost |
|--------|------|
| < 1kg | 15,000 تومان |
| 1-5kg | 25,000 تومان |
| 5-10kg | 40,000 تومان |
| > 10kg | 60,000 تومان |

**Free shipping** for orders over 1,000,000 تومان

---

## Cart Validation

Before proceeding to checkout, the cart is validated for:

1. **Stock Availability**: All items must be in stock
2. **Price Changes**: Prices are updated to current values
3. **Product Availability**: All products must be active
4. **Coupon Validity**: Coupon must still be valid
5. **Minimum Order**: Cart total must meet minimum order amount (50,000 تومان)

**Validation Example:**
```json
{
  "is_valid": true,
  "errors": [],
  "warnings": [
    {
      "item_id": 1,
      "message": "قیمت این محصول تغییر کرده است",
      "old_price": 90000,
      "new_price": 95000
    }
  ],
  "can_checkout": true
}
```

---

## Guest Cart (Anonymous Users)

For non-authenticated users, cart data can be stored client-side and later merged:

### POST /api/v1/cart/merge

**[Authenticated]** Merge guest cart items with user's cart after login.

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
  ]
}
```

**Response:**
```json
{
  "message": "سبد خرید ادغام شد",
  "items_merged": 2,
  "cart": {
    "items_count": 5,
    "total": 850000
  }
}
```

**Status Codes:**
- `200 OK` - Cart merged successfully
- `400 Bad Request` - Invalid items or out of stock
- `401 Unauthorized` - Not authenticated

---

## Cart Events

Cart operations trigger the following events:

- `cart.item_added` - Item added to cart
- `cart.item_updated` - Item quantity updated
- `cart.item_removed` - Item removed from cart
- `cart.cleared` - Cart cleared
- `cart.coupon_applied` - Coupon applied
- `cart.abandoned` - Cart abandoned (24 hours inactive)

These events can be used for:
- Analytics tracking
- Abandoned cart recovery emails
- Inventory management
- Marketing automation
