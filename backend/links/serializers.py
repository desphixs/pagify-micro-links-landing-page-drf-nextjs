from rest_framework import serializers
from .models import Link

class LinkSerializer(serializers.ModelSerializer):
    """
    THE LINK SERIALIZER
    
    Analogy:
    Think of a Serializer like a translator at an international customs office.
    Our Next.js frontend (speaking JavaScript/JSON) cannot understand raw complex Python objects 
    straight from our Django database. The Serializer takes those Python database objects and 
    translates them into a standardized JSON format that the frontend can easily read and display.
    """

    class Meta:
        # We tell the serializer that it should map directly to our Link database model
        model = Link
        
        # We define exactly which database fields/columns should be translated and sent to the frontend
        fields = [
            "id",          # The unique ID of the link (useful for React list keys!)
            "title",       # The display name of the link
            "url",         # The website destination URL
            "order",       # The sorting order value
            "is_active",   # Toggle representing if it's visible or hidden
            "created_at"   # Timestamp when the link was added
        ]
        
        # Mark automatically managed fields as read-only.
        # This prevents users from trying to forge or manually alter their ID numbers and timestamps!
        read_only_fields = [
            "id", 
            "created_at"
        ]
