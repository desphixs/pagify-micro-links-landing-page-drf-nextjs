from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Link
from .serializers import LinkSerializer
from django.contrib.auth import get_user_model
from userauths.serializers import UserProfileSerializer
User = get_user_model()

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


class LinkReorderView(APIView):
    """
    THE LINK REORDER VIEW
    
    Analogy:
    Think of this View like a card dealer reorganizing a hand of cards on a table.
    The user hands the dealer a specific order sheet of card IDs (ordered_ids, e.g. [12, 10, 8]).
    The dealer checks that all these cards actually belong to the user's hand.
    If they do, the dealer updates the 'order' index of each card one by one in the database:
    first ID gets order 0, second gets order 1, and so on.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handles incoming POST requests to update the ordering of a list of user links.
        Expects a JSON body: {"ordered_ids": [id1, id2, id3, ...]}
        """
        ordered_ids = request.data.get("ordered_ids")

        # Step 1: Validate that ordered_ids is provided and is a valid list
        if not isinstance(ordered_ids, list):
            return Response(
                {"error": "A list of ordered link IDs is required under the 'ordered_ids' key."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 2: Fetch all links belonging to the logged-in user to verify ownership
        user_links = Link.objects.filter(user=request.user)
        user_link_ids = set(user_links.values_list("id", flat=True))

        # Step 3: Loop through each ID to ensure it is valid and belongs to the user
        for link_id in ordered_ids:
            try:
                # Ensure the ID is a valid integer
                parsed_id = int(link_id)
            except (ValueError, TypeError):
                return Response(
                    {"error": f"Invalid link ID format: {link_id}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Security Check: Ensure the link belongs to this user!
            if parsed_id not in user_link_ids:
                return Response(
                    {"error": f"Link with ID {parsed_id} does not exist or does not belong to your account."},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Step 4: Perform the explicit reordering updates line-by-line in the database
        updated_links = []
        for index, link_id in enumerate(ordered_ids):
            # Fetch the link instance and set its order attribute to match its index in the sorted list
            link = user_links.get(id=int(link_id))
            link.order = index
            link.save() # Commit the new display order to the SQLite database
            updated_links.append(link)

        # Step 5: Serialize the reordered links and return them with 200 OK status
        serializer = LinkSerializer(updated_links, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class PublicProfileView(APIView):
    """
    THE PUBLIC PROFILE VIEW
    
    Analogy:
    Think of this View like a public showcase window for a creator's workshop.
    Anyone walking down the street (a guest visitor) can look through the window (dynamic URL)
    by reading the creator's username label (e.g. sarah).
    1. The window bouncer looks up the master ledger to see if a user exists whose email starts with 'sarah@'.
    2. If no matching user is found, the bouncer displays a 'Closed' sign (HTTP 404 Not Found).
    3. If the user exists, we check if they have turned on their 'Public visibility' switch. If they have set
       it to False (private), we treat it as missing and return a 404.
    4. If it's public, we pull only their active, visible links sorted by display order and present them!
    """
    # This is a public profile endpoint, so we do NOT require authentication!
    permission_classes = []

    def get(self, request, username):
        """
        Handles incoming GET requests to view a creator's dynamic public profile.
        Accepts the username parameter parsed from the URL path.
        """
        # Step 1: Query the custom User model by matching the email prefix to the username.
        # Since User uses email as its primary identifier, the email prefix represents the username.
        user = User.objects.filter(email__istartswith=f"{username}@").first()

        # Step 2: If the user is None (not found), return a 404 response immediately
        if user is None:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 3: Check visibility toggles. If the user's profile visibility is set to False, return a 404.
        # This keeps the profile completely secure and private from the public web!
        if not hasattr(user, 'profile') or not user.profile.public_profile:
            return Response(
                {"error": "Profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Step 4: Query only the visible active links belonging to this creator.
        # We sort them explicitly using .order_by("order") to match their display order indices!
        links = Link.objects.filter(user=user, is_active=True).order_by("order")

        # Step 5: Extract the username slug from the email prefix to return to the frontend
        username_val = user.email.split('@')[0]

        # Step 6: Serialize the user profile and their links separately, and return both in a single response!
        user_serializer = UserProfileSerializer(user)
        links_serializer = LinkSerializer(links, many=True)

        response_payload = {
            "username": username_val,
            "user": user_serializer.data,
            "links": links_serializer.data
        }

        return Response(response_payload, status=status.HTTP_200_OK)






