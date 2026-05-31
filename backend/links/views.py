from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Link
from .serializers import LinkSerializer

class LinkListView(APIView):
    """
    THE LINK LIST VIEW
    
    Analogy:
    Think of this View like a secure bank teller window.
    Only registered account holders with active passes (authenticated users) are allowed to walk up to this window.
    Furthermore, the teller (the View) has strict instructions: they must only retrieve and show files that belong
    to the specific user standing at the counter. They must never show one customer's files to another!
    """

    # We protect this view so only logged-in (authenticated) users are allowed to access it.
    # If a logged-out user tries to access it, they will automatically receive a "401 Unauthorized" error response.
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handles incoming GET requests from our frontend application.
        This gets called whenever the user navigates to their dashboard to see their links!
        """
        # We explicitly query the database to fetch only the links that belong to the logged-in user.
        # request.user represents the current logged-in User instance making the request!
        # By doing this, we guarantee that users can never see another user's links.
        links = Link.objects.filter(user=request.user)

        # We pass our database results (the query list) into our translator (LinkSerializer).
        # many=True tells the serializer that we are translating a LIST of links, not just a single one!
        serializer = LinkSerializer(links, many=True)

        # We send the translated data back to the frontend in a clean JSON format inside a Response!
        # DRF's Response will automatically add a "200 OK" status code to tell the client the request succeeded.
        return Response(serializer.data)
