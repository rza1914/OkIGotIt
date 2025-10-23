# Users API

## Overview

Manage user accounts, profiles, and user-related operations.

## Endpoints

### GET /api/v1/users/me

**[Authenticated]** Get current user's profile.

**Response:**
```json
{
  "id": 5,
  "email": "user@example.com",
  "first_name": "علی",
  "last_name": "احمدی",
  "full_name": "علی احمدی",
  "phone": "09123456789",
  "birth_date": "1990-01-01",
  "gender": "male",
  "avatar_url": "/uploads/avatars/user5.jpg",
  "is_active": true,
  "is_admin": false,
  "is_verified": true,
  "email_verified": true,
  "phone_verified": true,
  "address": {
    "address": "تهران، خیابان ولیعصر، پلاک 123",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "1234567890",
    "country": "ایران"
  },
  "preferences": {
    "language": "fa",
    "currency": "IRR",
    "newsletter": true,
    "sms_notifications": true,
    "email_notifications": true
  },
  "statistics": {
    "total_orders": 15,
    "total_spent": 4500000,
    "total_reviews": 8,
    "wishlist_count": 12
  },
  "created_at": "2023-01-15T10:00:00Z",
  "updated_at": "2023-12-01T14:30:00Z",
  "last_login": "2023-12-10T09:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Not authenticated

---

### PUT /api/v1/users/me

**[Authenticated]** Update current user's profile.

**Request Body:** (all fields optional)
```json
{
  "first_name": "علی",
  "last_name": "احمدی",
  "phone": "09123456789",
  "birth_date": "1990-01-01",
  "gender": "male",
  "address": {
    "address": "تهران، خیابان ولیعصر، پلاک 123",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "1234567890"
  },
  "preferences": {
    "language": "fa",
    "newsletter": true,
    "sms_notifications": true,
    "email_notifications": true
  }
}
```

**Response:**
```json
{
  "id": 5,
  "email": "user@example.com",
  "first_name": "علی",
  "last_name": "احمدی",
  "phone": "09123456789",
  "birth_date": "1990-01-01",
  "gender": "male",
  "address": {
    "address": "تهران، خیابان ولیعصر، پلاک 123",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "1234567890"
  },
  "updated_at": "2023-12-10T10:00:00Z",
  "message": "پروفایل با موفقیت به‌روزرسانی شد"
}
```

**Status Codes:**
- `200 OK` - Profile updated successfully
- `401 Unauthorized` - Not authenticated
- `422 Validation Error` - Invalid request data

**Validation Rules:**
- `phone` - Must be valid Iranian phone number (e.g., 09123456789)
- `birth_date` - Must be in ISO format (YYYY-MM-DD)
- `gender` - Must be one of: `male`, `female`, `other`
- `postal_code` - Must be 10 digits

---

### POST /api/v1/users/me/avatar

**[Authenticated]** Upload user avatar image.

**Request:** Multipart form data
```
avatar: <file> (image/jpeg, image/png, max 5MB)
```

**Response:**
```json
{
  "avatar_url": "/uploads/avatars/user5.jpg",
  "message": "تصویر پروفایل با موفقیت آپلود شد"
}
```

**Status Codes:**
- `200 OK` - Avatar uploaded successfully
- `400 Bad Request` - Invalid file type or size
- `401 Unauthorized` - Not authenticated

**Supported Formats:**
- JPEG/JPG
- PNG
- WebP

**Maximum Size:** 5 MB

---

### DELETE /api/v1/users/me/avatar

**[Authenticated]** Remove user avatar image.

**Response:**
```json
{
  "message": "تصویر پروفایل حذف شد",
  "avatar_url": null
}
```

**Status Codes:**
- `200 OK` - Avatar deleted successfully
- `401 Unauthorized` - Not authenticated

---

### POST /api/v1/users/me/change-password

**[Authenticated]** Change user password.

**Request Body:**
```json
{
  "current_password": "old_password",
  "new_password": "new_password123",
  "confirm_password": "new_password123"
}
```

**Response:**
```json
{
  "message": "رمز عبور با موفقیت تغییر یافت"
}
```

**Status Codes:**
- `200 OK` - Password changed successfully
- `400 Bad Request` - Current password incorrect or passwords don't match
- `401 Unauthorized` - Not authenticated
- `422 Validation Error` - Password doesn't meet requirements

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (optional)

---

### POST /api/v1/users/me/change-email

**[Authenticated]** Request email change.

**Request Body:**
```json
{
  "new_email": "newemail@example.com",
  "password": "current_password"
}
```

**Response:**
```json
{
  "message": "لینک تایید به ایمیل جدید ارسال شد",
  "verification_required": true
}
```

**Status Codes:**
- `200 OK` - Verification email sent
- `400 Bad Request` - Email already exists or invalid password
- `401 Unauthorized` - Not authenticated

**Notes:**
- A verification link is sent to the new email address
- Email change is completed after clicking the verification link
- Old email remains active until verification

---

### POST /api/v1/users/me/verify-email

**[Authenticated]** Verify email address.

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response:**
```json
{
  "message": "ایمیل با موفقیت تایید شد",
  "email_verified": true
}
```

**Status Codes:**
- `200 OK` - Email verified successfully
- `400 Bad Request` - Invalid or expired token
- `401 Unauthorized` - Not authenticated

---

### POST /api/v1/users/me/verify-phone

**[Authenticated]** Verify phone number via SMS code.

**Request Body:**
```json
{
  "code": "123456"
}
```

**Response:**
```json
{
  "message": "شماره تلفن با موفقیت تایید شد",
  "phone_verified": true
}
```

**Status Codes:**
- `200 OK` - Phone verified successfully
- `400 Bad Request` - Invalid or expired code
- `401 Unauthorized` - Not authenticated

---

### POST /api/v1/users/me/send-verification-sms

**[Authenticated]** Request SMS verification code.

**Response:**
```json
{
  "message": "کد تایید به شماره تلفن شما ارسال شد",
  "phone": "09123456789",
  "expires_in": 300
}
```

**Status Codes:**
- `200 OK` - SMS sent successfully
- `400 Bad Request` - Phone number not set
- `401 Unauthorized` - Not authenticated
- `429 Too Many Requests` - Rate limit exceeded

**Notes:**
- Verification code expires in 5 minutes
- Maximum 3 attempts per hour

---

### DELETE /api/v1/users/me

**[Authenticated]** Delete user account.

**Request Body:**
```json
{
  "password": "current_password",
  "reason": "دلیل حذف حساب کاربری",
  "confirm": true
}
```

**Response:**
```json
{
  "message": "حساب کاربری با موفقیت حذف شد"
}
```

**Status Codes:**
- `200 OK` - Account deleted successfully
- `400 Bad Request` - Invalid password or confirmation
- `401 Unauthorized` - Not authenticated

**Notes:**
- All personal data will be permanently deleted
- Order history is anonymized but retained for legal reasons
- This action cannot be undone
- Active orders must be completed or cancelled first

---

## Admin Endpoints

### GET /api/v1/users

**[Admin Only]** Get all users with pagination and filtering.

**Query Parameters:**
- `skip` (int) - Number of users to skip (default: 0)
- `limit` (int) - Maximum users to return (default: 50)
- `search` (str) - Search by name, email, or phone
- `is_active` (bool) - Filter by active status
- `is_verified` (bool) - Filter by verification status
- `sort_by` (str) - Sort by: `created_at`, `last_login`, `total_spent`
- `sort_order` (str) - Sort order: `asc` or `desc`

**Response:**
```json
{
  "users": [
    {
      "id": 5,
      "email": "user@example.com",
      "first_name": "علی",
      "last_name": "احمدی",
      "phone": "09123456789",
      "is_active": true,
      "is_admin": false,
      "is_verified": true,
      "total_orders": 15,
      "total_spent": 4500000,
      "created_at": "2023-01-15T10:00:00Z",
      "last_login": "2023-12-10T09:00:00Z"
    }
  ],
  "total": 1250,
  "page": 1,
  "pages": 25,
  "has_next": true,
  "has_prev": false
}
```

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin

---

### GET /api/v1/users/{user_id}

**[Admin Only]** Get detailed information about a specific user.

**Path Parameters:**
- `user_id` (int) - The user ID

**Response:**
```json
{
  "id": 5,
  "email": "user@example.com",
  "first_name": "علی",
  "last_name": "احمدی",
  "phone": "09123456789",
  "birth_date": "1990-01-01",
  "gender": "male",
  "avatar_url": "/uploads/avatars/user5.jpg",
  "is_active": true,
  "is_admin": false,
  "is_verified": true,
  "email_verified": true,
  "phone_verified": true,
  "address": {
    "address": "تهران، خیابان ولیعصر، پلاک 123",
    "city": "تهران",
    "province": "تهران",
    "postal_code": "1234567890"
  },
  "statistics": {
    "total_orders": 15,
    "completed_orders": 12,
    "cancelled_orders": 2,
    "pending_orders": 1,
    "total_spent": 4500000,
    "average_order_value": 300000,
    "total_reviews": 8,
    "wishlist_count": 12
  },
  "activity": {
    "created_at": "2023-01-15T10:00:00Z",
    "last_login": "2023-12-10T09:00:00Z",
    "login_count": 156,
    "last_order": "2023-12-05T15:30:00Z"
  },
  "recent_orders": [
    {
      "id": 45,
      "order_number": "IS-1045",
      "status": "delivered",
      "total": 350000,
      "created_at": "2023-12-05T15:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - User found
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - User doesn't exist

---

### PUT /api/v1/users/{user_id}

**[Admin Only]** Update user account.

**Path Parameters:**
- `user_id` (int) - The user ID

**Request Body:**
```json
{
  "is_active": true,
  "is_admin": false,
  "is_verified": true
}
```

**Status Codes:**
- `200 OK` - User updated successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - User doesn't exist

---

### DELETE /api/v1/users/{user_id}

**[Admin Only]** Delete a user account.

**Path Parameters:**
- `user_id` (int) - The user ID

**Status Codes:**
- `200 OK` - User deleted successfully
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - User doesn't exist
- `409 Conflict` - User has active orders

---

## User Roles

| Role | Permissions |
|------|-------------|
| `user` | Standard customer access |
| `admin` | Full system access |
| `moderator` | Manage products and orders |
| `support` | View orders and users |

---

## User Statistics

### GET /api/v1/users/{user_id}/statistics

**[Admin Only]** Get detailed statistics for a user.

**Response:**
```json
{
  "user_id": 5,
  "orders": {
    "total": 15,
    "completed": 12,
    "cancelled": 2,
    "pending": 1,
    "total_value": 4500000,
    "average_value": 300000
  },
  "products": {
    "total_purchased": 45,
    "favorite_category": "الکترونیک",
    "most_purchased_product": {
      "id": 10,
      "name": "محصول پرخرید",
      "purchase_count": 3
    }
  },
  "engagement": {
    "total_reviews": 8,
    "average_rating_given": 4.2,
    "wishlist_items": 12,
    "cart_abandonment_rate": 0.15
  },
  "loyalty": {
    "member_since": "2023-01-15",
    "days_active": 330,
    "loyalty_points": 4500,
    "tier": "gold"
  }
}
```

**Status Codes:**
- `200 OK` - Request successful
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin
- `404 Not Found` - User doesn't exist
