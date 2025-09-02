# Base API
http://127.0.0.1:8000/api/

## Authentication & User Management
POST /api/accounts/register/ - Register a new user
POST /api/accounts/login/ - User login
GET /api/accounts/profile/ - Get current user's profile 
GET /api/accounts/profile/<str:username>/ - Get specific user's profile 
GET /api/accounts/landlords/ - List all landlords


## Rooms Management
POST /api/rooms/ - Create a new room
GET /api/rooms/ - List all rooms
GET /api/rooms/<int:room_id>/ - Get specific room details
PUT /api/rooms/<int:room_id>/ - Update a room
DELETE /api/rooms/<int:room_id>/ - Delete a room


## Messaging
POST /api/messaging/send/ - Send a message
GET /api/messaging/inbox/ - Get user's inbox
GET /api/messaging/conversations/ - List all conversations
GET /api/messaging/conversations/<int:conversation_id>/ - Get specific conversation
POST /api/messaging/conversations/<int:conversation_id>/ - Send a message in a conversation

## WT Authentication
POST /api/accounts/token/ - Obtain JWT token pair
POST /api/accounts/token/refresh/ - Refresh JWT token
POST /api/token/verify/ - Verify JWT token

## Properties
GET /api/core/properties/ - List all properties
POST /api/core/properties/ - Create a new property
GET /api/core/properties/<id>/ - Get property details
PUT /api/core/properties/<id>/ - Update property
DELETE /api/core/properties/<id>/ - Delete property

