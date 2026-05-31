from django.urls import path
from .views import LinkListCreateView, LinkDetailView, LinkReorderView, PublicProfileView

# We set the namespace for this URL configuration.
# This makes it easy to reverse reference URLs in Python if needed (e.g. reverse('links:link-list')).
app_name = 'links'

urlpatterns = [
    # We map the URL path "links/" to our LinkListCreateView.
    # This single path handles GET (list all user's links) and POST (create a new link) requests!
    # .as_view() is a built-in DRF method that converts our class-based view into a standard URL controller.
    # We give it a friendly name "link-list" so we can refer to it easily in our tests and logs.
    path("links/", LinkListCreateView.as_view(), name="link-list"),

    # We map the URL path "links/reorder/" to our LinkReorderView.
    # This endpoint receives ordered lists of IDs and updates their DB display orders.
    path("links/reorder/", LinkReorderView.as_view(), name="link-reorder"),

    # We map the URL path "profile/<str:username>/" to our PublicProfileView.
    # This dynamic URL allows any guest visitor to browse a creator's public profile and links.
    path("profile/<str:username>/", PublicProfileView.as_view(), name="public-profile"),

    # We map the URL path "links/<int:pk>/" to our LinkDetailView.
    # The <int:pk> part is a Django path converter that extracts the integer from the URL and passes it as "pk".
    # This single path handles GET (retrieve detail), PUT (update fields), and DELETE (remove row)!
    # We give it a friendly name "link-detail" so we can refer to it easily in our tests and actions.
    path("links/<int:pk>/", LinkDetailView.as_view(), name="link-detail"),
]






