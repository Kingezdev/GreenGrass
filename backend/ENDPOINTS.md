# HOLO API Endpoints Documentation

This document outlines all available API endpoints for the HOLO (House Listing) application. All endpoints are prefixed with the base URL: `https://greengrass-backend.onrender.com`

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
| `POST` | `/api/token/refresh/` | Refresh JWT access token | No |
| `POST` | `/api/token/verify/` | Verify JWT token | No |
| `POST` | `/api/accounts/register/` | Register a new user | No |
| `POST` | `/api/accounts/login/` | User login | No |
| `GET` | `/api/accounts/verify-email/<uuid:token>/` | Verify email address | No |
| `POST` | `/api/accounts/resend-verification-email/` | Resend verification email | No |

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
| `PUT` | `/api/rooms/properties/<int:pk>/` | Update property | Yes (Owner/Admin) |
| `DELETE` | `/api/rooms/properties/<int:pk>/` | Delete property | Yes (Owner/Admin) |
| `GET` | `/api/rooms/my-properties/` | Get current user's properties | Yes (Landlord) |

## Property Images

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `POST` | `/api/rooms/properties/<int:property_id>/images/` | Upload property images | Yes (Property Owner/Admin) |

## Rooms

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/rooms/properties/<int:property_id>/` | List all rooms in a property | No |
| `POST` | `/api/rooms/properties/<int:property_id>/` | Add a room to property | Yes (Property Owner/Admin) |
| `GET` | `/api/rooms/properties/<int:property_id>/<int:pk>/` | Get room details | No |
| `PUT` | `/api/rooms/properties/<int:property_id>/<int:pk>/` | Update room | Yes (Property Owner/Admin) |
| `DELETE` | `/api/rooms/properties/<int:property_id>/<int:pk>/` | Delete room | Yes (Property Owner/Admin) |

## Messaging

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/messaging/conversations/` | List user's conversations | Yes |
| `POST` | `/api/messaging/conversations/` | Create a new conversation | Yes |
| `GET` | `/api/messaging/conversations/<int:pk>/` | Get conversation details | Yes (Participant) |
| `GET` | `/api/messaging/conversations/<int:conversation_id>/messages/` | Get conversation messages | Yes (Participant) |
| `POST` | `/api/messaging/start-conversation/` | Start a new conversation | Yes |
| `GET` | `/api/messaging/unread-count/` | Get count of unread messages | Yes |

## Reviews

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/rooms/properties/<int:property_id>/reviews/` | List property reviews | No |
| `POST` | `/api/rooms/properties/<int:property_id>/reviews/` | Create property review | Yes (Tenant) |
| `GET` | `/api/rooms/landlords/<int:landlord_id>/reviews/` | List landlord reviews | No |
| `POST` | `/api/rooms/landlords/<int:landlord_id>/reviews/` | Create landlord review | Yes (Tenant) |

## Favorites

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/rooms/favorites/` | List user's favorite properties | Yes |
| `POST` | `/api/rooms/favorites/` | Add property to favorites | Yes |
| `DELETE` | `/api/rooms/favorites/<int:property_id>/` | Remove property from favorites | Yes |

## Analytics

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `GET` | `/api/rooms/properties/<int:property_id>/views/` | Get property view statistics | Yes (Property Owner/Admin) |

## Authentication Headers

For endpoints that require authentication, include the JWT token in the request headers:

```http
Authorization: Bearer your_jwt_token_here
```

## Response Format

All API responses follow a standard format:

```json
{
    "status": "success",
    "data": {
        // Response data
    },
    "message": "Operation completed successfully"
}
```

## Error Handling

Error responses include an error message and status code:

```json
{
    "status": "error",
    "message": "Detailed error message",
    "code": "ERROR_CODE"
}
```

## Rate Limiting

- Authentication endpoints: 100 requests per hour per IP
- Other endpoints: 1000 requests per hour per user

## Versioning

This is version 1 of the API. The API uses URL versioning (e.g., `/api/v1/...`).

## Support

For support, please contact the development team at [support email].

---
Last Updated: September 7, 2025
