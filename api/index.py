import os
import sys

# Get the absolute path to the backend directory
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Add the backend directory to sys.path so Django can find 'config' and other apps
if path not in sys.path:
    sys.path.insert(0, path)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Import the WSGI application from the Django project
from config.wsgi import application as app
