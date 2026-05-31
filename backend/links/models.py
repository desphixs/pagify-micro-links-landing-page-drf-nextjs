from django.db import models
from django.contrib.auth import get_user_model

# We fetch the custom user model that is currently configured in settings.py
# Using get_user_model() is the standard and safest practice in modern Django development.
User = get_user_model()

class Link(models.Model):
    """
    THE LINK MODEL
    
    Analogy:
    Think of this model like a row in a digital filing cabinet.
    Each row holds the information for one single clickable link on a creator's page.
    This filing card points back to the specific User who owns it, has a custom Title (like "My Portfolio"),
    an actual URL destination address, a sorting order number to determine which links appear first,
    a toggle to show or hide the link without deleting it, and a timestamp of when it was created.
    """

    # We link this Link to a specific User.
    # models.ForeignKey creates a "Many-to-One" relationship, meaning a single user can have multiple links.
    # on_delete=models.CASCADE means if the User account is deleted, all their links will be automatically deleted too.
    # related_name='links' allows us to easily fetch all links for a user by calling `user.links.all()`.
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='links',
        verbose_name="Owner"
    )

    # The title or display label that creators give to their link (e.g., "My Twitter Profile").
    # We set a max_length of 100 characters to keep our frontend cards looking clean and uniform.
    title = models.CharField(
        max_length=100,
        verbose_name="Link Title"
    )

    # The actual destination address where the link points to.
    # Django's built-in URLField automatically verifies that whatever is typed in looks like a real, valid URL.
    # We give it a generous max_length of 500 characters so long tracking URLs don't break.
    url = models.URLField(
        max_length=500,
        verbose_name="Destination URL"
    )

    # A simple sorting number that determines the visual order of the links on the landing page.
    # Links with smaller numbers (like 0 or 1) will be displayed before links with higher numbers (like 10).
    # We default this to 0 so new links start at the very top.
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order"
    )

    # An active/inactive toggle switch.
    # This is a boolean field that can be either True or False.
    # It allows users to hide a link temporarily on their profile without permanently deleting it from the database.
    is_active = models.BooleanField(
        default=True,
        verbose_name="Is Visible Publicly"
    )

    # A automatic date and time recorder.
    # auto_now_add=True tells Django to automatically grab the current exact time when this link is first created
    # and save it in this field. It is read-only and never changes.
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date Created"
    )

    class Meta:
        # We tell Django to automatically sort links by their 'order' number by default.
        # This makes it so whenever we query the database for a user's links, they arrive pre-sorted!
        ordering = ['order']

    def __str__(self):
        """
        Returns a friendly, human-readable string representation of this object.
        This is what displays when we view links inside the Django Admin dashboard!
        """
        return f"{self.user.email} - {self.title}"
