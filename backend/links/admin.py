from django.contrib import admin
from .models import Link

# We use the @admin.register decorator to register our custom Link model.
# This makes it show up nicely inside the Django Admin Dashboard panel!
@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    # list_display controls which fields are visible as columns in the main links list table.
    # This gives administrators a quick summary of each link at a glance!
    list_display = [
        "title", 
        "user", 
        "url", 
        "order", 
        "is_active", 
        "created_at"
    ]
    
    # list_filter adds a sidebar filtering panel on the right side of the page.
    # Administrators can click 'Yes' or 'No' to filter links by whether they are active/visible.
    list_filter = [
        "is_active"
    ]
    
    # search_fields adds a search bar at the top of the admin page.
    # This allows admins to search for specific links using the link's title or the owner's email address.
    # Note the double underscore 'user__email' - this tells Django to search the email field of the connected User!
    search_fields = [
        "title", 
        "user__email"
    ]
