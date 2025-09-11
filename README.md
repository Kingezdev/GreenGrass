# GreenGrass - Property Management Platform

## Project Setup

### Backend Setup

1. **Install Python Dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   
   # Django
   SECRET_KEY=your_secret_key
   DEBUG=True
   
   # Pusher Configuration
   PUSHER_APP_ID=your_app_id
   PUSHER_KEY=your_key
   PUSHER_SECRET=your_secret
   PUSHER_CLUSTER=your_cluster  # e.g., 'mt1', 'us2', 'eu'
   PUSHER_SSL=true
   
   # Frontend URLs
   FRONTEND_URL=http://localhost:5137
   ```

3. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

4. **Start Development Server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   npm install tailwindcss @tailwindcss/vite
   ```

2. **Environment Variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_PUSHER_KEY=your_pusher_key
   VITE_PUSHER_CLUSTER=your_pusher_cluster
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Pusher Integration

### Backend Implementation

The backend uses Pusher for real-time messaging with the following features:

- **Authentication**: Private channels for user-specific notifications
- **Events**:
  - `new_message`: Triggered when a new message is sent
  - `messages_read`: Triggered when messages are marked as read

### Frontend Implementation

1. **Install Pusher Client**
   ```bash
   npm install pusher-js
   ```

2. **Initialize Pusher**
   ```javascript
   import Pusher from 'pusher-js';
   
   const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
     cluster: import.meta.env.VITE_PUSHER_CLUSTER,
     forceTLS: true
   });
   ```

3. **Subscribe to Private Channel**
   ```javascript
   const channel = pusher.subscribe(`private-user-${userId}`);
   
   // Listen for new messages
   channel.bind('new_message', (data) => {
     console.log('New message:', data);
   });
   
   // Listen for read receipts
   channel.bind('messages_read', (data) => {
     console.log('Messages read:', data);
   });
   ```

## Testing

Run backend tests:
```bash
cd backend
python manage.py test messaging.tests
```

## Deployment

### Environment Variables
Ensure all required environment variables are set in your production environment.

### CORS Configuration
CORS is configured to allow requests from:
- Development: http://localhost:5137
- Production: https://loom-in.vercel.app
- Any Vercel preview deployments