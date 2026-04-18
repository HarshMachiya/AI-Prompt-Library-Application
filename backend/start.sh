#!/bin/sh

# Wait for postgres
echo "Waiting for postgres..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Start server
python manage.py runserver 0.0.0.0:8000
