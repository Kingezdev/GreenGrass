# PostgreSQL Setup for HouseListing Project

## Step 1: Install PostgreSQL

### Option A: Download from Official Website
1. Go to https://www.postgresql.org/download/windows/
2. Download PostgreSQL installer for Windows
3. Run the installer and follow the setup wizard
4. Remember the password you set for the 'postgres' user
5. Default port is 5432 (keep this)

### Option B: Using Chocolatey (if you have it)
```powershell
choco install postgresql
```

### Option C: Using Winget
```powershell
winget install PostgreSQL.PostgreSQL
```

## Step 2: Create Database and User

After PostgreSQL is installed, open Command Prompt as Administrator and run:

```cmd
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE houselisting_db;

# Create user
CREATE USER houselisting_user WITH PASSWORD 'houselisting_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE houselisting_db TO houselisting_user;

# Exit psql
\q
```

## Step 3: Test Connection

Run this command to test if everything is working:
```cmd
psql -U houselisting_user -d houselisting_db -h localhost
```

## Alternative: Use Docker (Recommended for Development)

If you have Docker installed, you can run PostgreSQL in a container:

```cmd
docker run --name houselisting-postgres -e POSTGRES_DB=houselisting_db -e POSTGRES_USER=houselisting_user -e POSTGRES_PASSWORD=houselisting_password -p 5432:5432 -d postgres:13
```

## Next Steps

After PostgreSQL is set up, run these Django commands:
```cmd
cd HouseListing_Backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```
