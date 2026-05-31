from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Link
from .serializers import LinkSerializer

class LinkListCreateView(APIView):
    """
    THE LINK LIST & CREATE VIEW
    
    Analogy:
    Think of this View like a multipurpose service counter in a bank.
    1. GET Request (List): Walk up to the counter, show your credentials, and the clerk (this View)
       retrieves all your social link folders from the filing cabinet and displays them.
    2. POST Request (Create): Walk up to the counter, present your credentials and a new document sheet
       (Title and URL), and the clerk validates the sheet before saving it as a brand new folder in the cabinet.
    """

    # We protect this view so only logged-in (authenticated) users can list or create links.
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

    def post(self, request):
        """
        Handles incoming POST requests to create a new link for the logged-in user.
        """
        # Step 1: Pull the incoming text data from the request body.
        # request.data is a dictionary-like object containing all values sent by the frontend form.
        title = request.data.get("title")
        url = request.data.get("url")
        order = request.data.get("order")

        # Step 2: Write a basic manual validation check.
        # We must make sure that both title and URL are actually provided and not just empty spaces.
        # If either is missing, we immediately halt the operation and send back a 400 Bad Request error.
        if not title or not url or str(title).strip() == "" or str(url).strip() == "":
            # We return a JSON error message so the frontend can display a helpful alert to the user.
            return Response(
                {"error": "Both title and url are required and cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 3: Handle the optional 'order' parameter.
        # If the order is not provided, or is sent as an empty value, we default to 0.
        # If it is provided, we try to convert it safely to a positive integer.
        if order is None or str(order).strip() == "":
            order = 0
        else:
            try:
                order = int(order)
            except ValueError:
                # If they sent something that isn't a valid number (e.g. "abc"), we fall back to 0.
                order = 0

        # Step 4: Explicitly save the new Link row to our database using Django's ORM.
        # CRITICAL SECURITY RULE: We pull the owner ('user') directly from request.user (the verified, logged-in user).
        # We NEVER trust the request body to specify the owner, preventing malicious users from creating links on others' behalf!
        new_link = Link.objects.create(
            user=request.user,
            title=title,
            url=url,
            order=order
        )

        # Step 5: Translate the brand new database record into a clean JSON layout using our serializer.
        serializer = LinkSerializer(new_link)

        # Step 6: Return the translated JSON data along with a HTTP 201 Created status code.
        # This tells the frontend that the resource has been successfully generated in the database!
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LinkDetailView(APIView):
    """
    THE LINK DETAIL VIEW (RETRIEVE, UPDATE, & DELETE)
    
    Analogy:
    Think of this View like a private, secure safety deposit locker cabinet.
    Every locker (Link) has a unique ID number.
    1. GET Request (Retrieve): Walk up, show your ID, and retrieve details for this specific folder (Locker).
    2. PUT Request (Update): Walk up, show your ID, present a sheet of changes (new Title, URL, or Order),
       the clerk validates the new values, and overwrites the active folder contents (Explicit ORM Update).
    3. DELETE Request (Purge): Walk up, show your ID, instruct the clerk to shred the folder,
       the clerk checks ownership, and wipes it completely from the cabinet (Explicit link.delete()).
    """
    
    # We protect this view so only logged-in (authenticated) users can view, edit, or delete links.
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        Handles incoming GET requests to view the details of a single specific link.
        """
        # Step 1: Query the database to find the link by its primary key (ID)
        link = Link.objects.filter(id=pk).first()

        # Step 2: If the link is None (not found), return a 404 response immediately
        if link is None:
            return Response(
                {"error": "Link not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 3: Check ownership. A user must not be allowed to view details of links they do not own.
        if link.user != request.user:
            return Response(
                {"error": "You do not have permission to view this link."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Step 4: Serialize the object and return it with status 200 OK
        serializer = LinkSerializer(link)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Handles incoming PUT requests to update a specific link's fields (title, url, order, is_active).
        """
        # Step 1: Query the database to find the link by its primary key (ID)
        link = Link.objects.filter(id=pk).first()

        # Step 2: If the link is None (not found), return a 404 response immediately
        if link is None:
            return Response(
                {"error": "Link not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 3: Check ownership. Ensure only the owner can modify their links!
        if link.user != request.user:
            return Response(
                {"error": "You do not have permission to update this link."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Step 4: Pull the incoming update values from the request body
        title = request.data.get("title")
        url = request.data.get("url")
        order = request.data.get("order")
        is_active = request.data.get("is_active")

        # Step 5: Perform manual validation checks on each updated parameter
        # If title is provided, ensure it is not just blank spaces
        if title is not None:
            if str(title).strip() == "":
                return Response(
                    {"error": "Title cannot be empty."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            link.title = title.strip()

        # If url is provided, ensure it is not just blank spaces
        if url is not None:
            if str(url).strip() == "":
                return Response(
                    {"error": "URL cannot be empty."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            link.url = url.strip()

        # If order is provided, attempt to convert it safely to a positive integer
        if order is not None:
            try:
                link.order = int(order)
            except ValueError:
                return Response(
                    {"error": "Display order must be a valid whole number."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # If active visibility toggle is provided, convert it safely to a boolean
        if is_active is not None:
            link.is_active = bool(is_active)

        # Step 6: Explicitly save the updated model instance to the SQLite database
        link.save()

        # Step 7: Serialize the updated link record and return it along with status 200 OK
        serializer = LinkSerializer(link)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        Handles incoming DELETE requests to safely remove a specific link by its ID.
        """
        # Step 1: Query the database to find the link by its primary key (ID)
        link = Link.objects.filter(id=pk).first()

        # Step 2: If the link is None (not found), return a 404 response immediately
        if link is None:
            return Response(
                {"error": "Link not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 3: Check ownership. If the owner of the link is not the logged-in user, reject with 403 Forbidden!
        if link.user != request.user:
            return Response(
                {"error": "You do not have permission to delete this link."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Step 4: Call .delete() on the model instance to remove the row from the SQLite database
        link.delete()

        # Step 5: Return an empty Response and a HTTP 204 No Content status code.
        return Response(status=status.HTTP_204_NO_CONTENT)




