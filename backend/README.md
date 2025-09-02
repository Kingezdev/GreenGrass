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
- Email verification system
- Synchronous email sending with console output for development

## Prerequisites

- Python 3.9+
- PostgreSQL


## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kingezdev/greengrass.git
   cd greengrass
   cd backend
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Configure your database settings in `.env`

## Email Configuration

The application uses synchronous email sending with the following configuration:

1. **Development (Default)**
   - Emails are printed to the console
   - No additional setup required
   - View email content in the terminal where the server is running

2. **Production**
   Configure your email settings in `.env`:
   ```
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=your-smtp-host
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@example.com
   EMAIL_HOST_PASSWORD=your-email-password
   DEFAULT_FROM_EMAIL=your-email@example.com
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

## Email Verification

The application includes a built-in email verification system:

1. On registration, users receive a verification email
2. The email contains a verification link
3. Clicking the link verifies the user's email
4. Users must verify their email before logging in

### Testing Email Verification

1. Register a new user
2. Check the terminal for the verification email output
3. Click the verification link or use the API endpoint:
   ```
   POST /api/accounts/verify-email/<token>/
   ```

### Running in Development Mode

For development, you can run the development server normally.
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
