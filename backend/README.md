# House Listing Backend

A Django REST Framework backend for a property listing application with JWT authentication.

## Features

- User authentication with JWT
- Role-based access control (Landlord/Tenant)
- Property management (CRUD operations)
- Advanced filtering and search
- File uploads
- CORS support
- Security best practices

## Prerequisites

- Python 3.9+
- PostgreSQL
- Node.js & npm (for frontend)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/house-listing-backend.git
   cd house-listing-backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   python setup_env.py
   ```
   Review and update the generated `.env` file as needed.

5. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

## Development

### Running Tests
```bash
pytest
```

### Code Style
We use Black for code formatting and Flake8 for linting.

```bash
# Auto-format code
black .

# Check for style issues
flake8
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Enable debug mode | `False` |
| `SECRET_KEY` | Django secret key | Randomly generated |
| `ALLOWED_HOSTS` | Allowed hostnames | `localhost,127.0.0.1` |
| `DB_*` | Database connection settings | PostgreSQL defaults |
| `JWT_SECRET_KEY` | JWT signing key | Randomly generated |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:5173,http://localhost:5174` |

## API Documentation

API documentation is available at `/api/docs/` when DEBUG is True.

## Deployment

### Production Setup

1. Set `DEBUG=False` in your production environment variables
2. Configure a production database (PostgreSQL recommended)
3. Set up a production web server (e.g., Gunicorn + Nginx)
4. Configure HTTPS using Let's Encrypt
5. Set up proper logging and monitoring

### Docker

```bash
# Build the Docker image
docker-compose build

# Run migrations
docker-compose run --rm web python manage.py migrate

# Start the application
docker-compose up -d
```

## Security

- All passwords are hashed using Argon2
- CSRF protection is enabled
- CORS is properly configured
- Security headers are set
- Rate limiting is in place
- JWT tokens have short expiration times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
