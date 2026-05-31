from django.urls import path
from .views import LinkListCreateView

# We set the namespace for this URL configuration.
# This makes it easy to reverse reference URLs in Python if needed (e.g. reverse('links:link-list')).
app_name = 'links'

urlpatterns = [
    # We map the URL path "links/" to our LinkListCreateView.
    # This single path handles GET (list all user's links) and POST (create a new link) requests!
    # .as_view() is a built-in DRF method that converts our class-based view into a standard URL controller.
    # We give it a friendly name "link-list" so we can refer to it easily in our tests and logs.
    path("links/", LinkListCreateView.as_view(), name="link-list"),
]


