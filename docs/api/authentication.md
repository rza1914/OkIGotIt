# Authentication API

## Overview

iShop uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for authenticated requests:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### POST /api/v1/auth/login

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

**Status Codes:**
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid credentials
- `422 Validation Error` - Invalid request data

---

### POST /api/v1/auth/register

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

**Status Codes:**
- `201 Created` - Registration successful
- `400 Bad Request` - Email already exists
- `422 Validation Error` - Invalid request data

---

### POST /api/v1/auth/refresh

Refresh an access token.

**Request Body:**
```json
{
  "refresh_token": "your-refresh-token"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Status Codes:**
- `200 OK` - Token refreshed successfully
- `401 Unauthorized` - Invalid or expired refresh token

---

## Security Notes

- Passwords must be at least 8 characters
- Tokens expire after 30 minutes (1800 seconds)
- Refresh tokens expire after 7 days
- Use HTTPS in production to protect credentials
- Store tokens securely (not in localStorage for sensitive apps)

## Example Usage

### JavaScript/Fetch
```javascript
// Login
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.access_token;

// Use token for authenticated requests
const protectedResponse = await fetch('http://localhost:8000/api/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Python/Requests
```python
import requests

# Login
response = requests.post(
    'http://localhost:8000/api/v1/auth/login',
    json={
        'email': 'user@example.com',
        'password': 'password123'
    }
)

data = response.json()
token = data['access_token']

# Use token for authenticated requests
protected_response = requests.get(
    'http://localhost:8000/api/v1/users/me',
    headers={'Authorization': f'Bearer {token}'}
)
```

### cURL
```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
