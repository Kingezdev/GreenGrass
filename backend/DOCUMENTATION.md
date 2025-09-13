# GreenGrass Backend API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Accounts](#accounts)
   - [Properties](#properties)
   - [Rooms](#rooms)
   - [Messaging](#messaging)
   - [Transactions](#transactions)
   - [Leases](#leases)
4. [File Uploads](#file-uploads)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [WebSocket Support](#websocket-support)
8. [Development Setup](#development-setup)
9. [Deployment](#deployment)

## Introduction

GreenGrass is a property management platform that connects landlords and tenants. This document provides comprehensive documentation for the GreenGrass Backend API.

**Base URL**: `https://api.greengrass.app` (Production)
**Development URL**: `http://localhost:8000`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Obtaining Tokens

```http
POST /api/token/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

### Token Refresh

```http
POST /api/token/refresh/
Content-Type: application/json

{
    "refresh": "your_refresh_token_here"
}
```

### Authentication Header

Include the JWT in the Authorization header for authenticated requests:
```
Authorization: Bearer your_access_token_here
```

## API Endpoints

### Accounts

#### Register a New User
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

#### Get Current User Profile
```http
GET /api/accounts/profile/
Authorization: Bearer your_access_token_here
```

#### Update Profile
```http
PATCH /api/accounts/profile/
Authorization: Bearer your_access_token_here
Content-Type: multipart/form-data

{
    "first_name": "John",
    "last_name": "Updated",
    "phone_number": "+1234567890",
    "bio": "Updated bio"
}
```

#### Upload Profile Picture
```http
PATCH /api/accounts/profile/
Authorization: Bearer your_access_token_here
Content-Type: multipart/form-data

avatar: [binary file data]
```

### Properties

#### List Properties
```http
GET /api/rooms/properties/
```

#### Create Property
```http
POST /api/rooms/properties/
Authorization: Bearer your_access_token_here
Content-Type: multipart/form-data

{
    "title": "Luxury Apartment",
    "description": "Beautiful 3-bedroom apartment",
    "property_type": "apartment",
    "price": 1500,
    "location": "New York, NY"
}
```

### File Uploads

#### Supported File Types
- Images: JPG, PNG, WEBP
- Maximum file size: 5MB
- Automatic resizing: 500x500px

#### Uploading Files
Files can be uploaded using multipart/form-data. The API will automatically process and optimize the uploaded files.

## Error Handling

### Common HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded

### Error Response Format
```json
{
    "error": {
        "code": "error_code",
        "message": "Human-readable error message",
        "details": {
            "field_name": ["Error details"]
        }
    }
}
```

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- API endpoints: 1000 requests per hour
- File uploads: 20 requests per hour

## Development Setup

### Prerequisites
- Python 3.9+
- PostgreSQL
- Redis (for caching and async tasks)

### Installation
1. Clone the repository
2. Create and activate a virtual environment
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables (copy .env.example to .env)
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Deployment

### Production Requirements
- Gunicorn or uWSGI
- Nginx or Apache
- PostgreSQL
- Redis
- AWS S3 (for file storage)

### Environment Variables
```
DEBUG=False
SECRET_KEY=your_secret_key
DATABASE_URL=postgres://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379/0
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_STORAGE_BUCKET_NAME=your_bucket_name
```

## Support
For support, please contact support@greengrass.app
