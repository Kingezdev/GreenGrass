# GreenGrass API Reference

## Authentication

### Login

```http
POST /api/token/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

**Response**
```json
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Refresh Token

```http
POST /api/token/refresh/
Content-Type: application/json

{
    "refresh": "your_refresh_token_here"
}
```

## Accounts

### Register User

```http
POST /api/accounts/register/
Content-Type: application/json

{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "password2": "securepassword123",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "tenant"
}
```

### Get Profile

```http
GET /api/accounts/profile/
Authorization: Bearer your_access_token_here
```

**Response**
```json
{
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "avatar": "https://api.greengrass.app/media/avatars/2023/01/01/avatar.jpg",
    "bio": "Hello, I'm John!",
    "user_type": "tenant",
    "date_joined": "2023-01-01T12:00:00Z"
}
```

### Update Profile

```http
PATCH /api/accounts/profile/
Authorization: Bearer your_access_token_here
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Updated",
    "phone_number": "+1234567890",
    "bio": "Updated bio"
}
```

### Upload Profile Picture

```http
PATCH /api/accounts/profile/
Authorization: Bearer your_access_token_here
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"; filename="profile.jpg"
Content-Type: image/jpeg

[binary data]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

## Properties

### List Properties

```http
GET /api/rooms/properties/
```

**Query Parameters**
- `min_price` (number)
- `max_price` (number)
- `property_type` (string)
- `location` (string)
- `page` (number)
- `page_size` (number, max 100)

### Create Property

```http
POST /api/rooms/properties/
Authorization: Bearer your_access_token_here
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="title"

Luxury Apartment
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="description"

Beautiful 3-bedroom apartment
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="property_type"

apartment
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="price"

1500
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="location"

New York, NY
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

## Error Responses

### 400 Bad Request
```json
{
    "error": {
        "code": "validation_error",
        "message": "Invalid input data",
        "details": {
            "email": ["This field is required."],
            "password": ["This password is too short."]
        }
    }
}
```

### 401 Unauthorized
```json
{
    "error": {
        "code": "authentication_failed",
        "message": "Incorrect authentication credentials."
    }
}
```

### 403 Forbidden
```json
{
    "error": {
        "code": "permission_denied",
        "message": "You do not have permission to perform this action."
    }
}
```

### 404 Not Found
```json
{
    "error": {
        "code": "not_found",
        "message": "The requested resource was not found."
    }
}
```

### 429 Too Many Requests
```json
{
    "error": {
        "code": "throttled",
        "message": "Request was throttled. Expected available in 60 seconds."
    }
}
```

## WebSocket Endpoints

### Chat
```
ws://api.greengrass.app/ws/chat/<conversation_id>/
```

**Authentication**: Include JWT token in the query string:
```
ws://api.greengrass.app/ws/chat/123/?token=your_jwt_token
```

**Events**:
- `message`: New message
- `typing`: User is typing
- `read_receipt`: Message read receipt
