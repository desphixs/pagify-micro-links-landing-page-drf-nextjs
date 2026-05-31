import os
import django

# Set up the Django environment settings module so we can query database models
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from links.models import Link

User = get_user_model()

# Grab the first user in the database
user = User.objects.first()

if not user:
    # If no user exists yet, let's create a default admin/test user so seeding doesn't fail
    print("No user found in the database. Creating a default test user first...")
    user = User.objects.create_superuser(
        email="testuser@example.com",
        password="password123",
        full_name="Sarah Jenkins"
    )
    print(f"Created default user: {user.email}")
else:
    print(f"Found existing user: {user.email}")

# Let's clean up any existing links first to make this repeatable
Link.objects.filter(user=user).delete()

# Create 4 beautiful sample links with ascending order values
sample_links = [
    {
        "title": "My Personal Portfolio",
        "url": "https://sarahjenkins.design",
        "order": 1,
        "is_active": True
    },
    {
        "title": "Follow me on Twitter/X",
        "url": "https://twitter.com/sarahj_design",
        "order": 2,
        "is_active": True
    },
    {
        "title": "My Design Projects on Dribbble",
        "url": "https://dribbble.com/sarahjenkins",
        "order": 3,
        "is_active": True
    },
    {
        "title": "Professional Network (LinkedIn)",
        "url": "https://linkedin.com/in/sarahjenkins-design",
        "order": 4,
        "is_active": True
    }
]

print("Seeding database with sample links...")
for link_data in sample_links:
    new_link = Link.objects.create(
        user=user,
        title=link_data["title"],
        url=link_data["url"],
        order=link_data["order"],
        is_active=link_data["is_active"]
    )
    print(f"Created Link: {new_link.title} (Order: {new_link.order})")

print("Database seeding completed successfully!")
