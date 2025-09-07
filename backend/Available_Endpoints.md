# HOLO API Endpoints Documentation

Base URL: `https://greengrass-backend.onrender.com`

## Table of Contents
- [Authentication](#authentication)
- [Accounts](#accounts)
- [Properties](#properties)
- [Rooms](#rooms)
- [Messaging](#messaging)
- [Reviews](#reviews)
- [Favorites](#favorites)
- [Analytics](#analytics)

## Authentication

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `POST` | `/api/token/` | Obtain JWT access and refresh tokens | No |
| `POST` | `/api/accounts/register/` | Register a new user | No |
| `POST` | `/api/accounts/login/` | User login | No |

## Accounts

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/accounts/profile/` | Get current user's profile | Yes |
| `GET` | `/api/accounts/profile/<str:username>/` | Get user profile by username | Yes |
| `GET` | `/api/accounts/landlords/` | List all landlords | No |

## Properties

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/rooms/properties/` | List all properties | No |
| `POST` | `/api/rooms/properties/` | Create a new property | Yes (Landlord) |
| `GET` | `/api/rooms/properties/<int:pk>/` | Get property details | No |

## Rooms

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/rooms/properties/<int:property_id>/` | List all rooms in a property | No |
| `POST` | `/api/rooms/properties/<int:property_id>/` | Add a room to property | Yes (Property Owner/Admin) |

## Messaging

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/messaging/conversations/` | List user's conversations | Yes |
| `POST` | `/api/messaging/start-conversation/` | Start a new conversation | Yes |

## Authentication Headers

For authenticated endpoints, include:
```
Authorization: Bearer your_jwt_token_here
```
## Reviews

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/rooms/properties/<int:property_id>/reviews/` | List property reviews | No |
| `POST` | `/api/rooms/properties/<int:property_id>/reviews/` | Create property review | Yes (Tenant) |

## Favorites

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/rooms/favorites/` | List user's favorite properties | Yes |
| `POST` | `/api/rooms/favorites/` | Add property to favorites | Yes |
| `DELETE` | `/api/rooms/favorites/<int:property_id>/` | Remove property from favorites | Yes |

## Response Format

All API responses follow this format:
```json
{
    "status": "success",
    "data": {},
    "message": "Operation completed"
}
```

## Error Format
```json
{
    "status": "error",
    "message": "Error description",
    "code": "ERROR_CODE"
}
```
## Rate Limiting

- Authentication endpoints: 100 requests per hour per IP
- Other endpoints: 1000 requests per hour per user

## Support

For support, please contact the development team.

---
Last Updated: September 7, 2025
