'use server';

import { apiFetch } from '@/lib/api';

/**
 * GET USER LINKS ACTION
 * 
 * Analogy:
 * Think of this action like a secure delivery courier.
 * It travels back to the Django backend to retrieve only the social links
 * belonging to the currently logged-in user, and delivers them back to our frontend links page.
 */
export async function getLinksAction() {
    try {
        // Dispatch a secure GET request to our Django /api/links/ endpoint.
        // apiFetch will automatically handle reading the HttpOnly cookie and appending the Bearer token!
        const { ok, data } = await apiFetch('/links/', {
            method: 'GET',
            cache: 'no-store', // Disable caching so we always fetch fresh data from our database
        });

        if (ok) {
            return {
                success: true,
                message: "Links retrieved successfully.",
                links: data, // Return the translated JSON array of links
            };
        } else {
            return {
                success: false,
                message: data.detail || data.message || "Failed to retrieve links.",
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: `Network error: ${error.message || 'Failed to connect to backend server.'}`,
        };
    }
}

/**
 * CREATE USER LINK ACTION
 * 
 * Analogy:
 * Think of this action like an express mailing service.
 * It takes your new link parcel (Title and URL), packages it up safely as JSON,
 * carries it securely to the Django backend via a POST request, and hands back
 * the newly filed link object or any validation error responses.
 */
export async function createLinkAction(title: string, url: string, order?: number) {
    try {
        // Prepare the payload body to send to the Django backend
        const bodyPayload = {
            title,
            url,
            order: order !== undefined ? order : 0,
        };

        // Dispatch a secure POST request to the merged endpoint `/links/`
        const { ok, data } = await apiFetch('/links/', {
            method: 'POST',
            body: bodyPayload,
        });

        if (ok) {
            return {
                success: true,
                message: "Link created successfully.",
                link: data, // Return the newly created link row object
            };
        } else {
            return {
                success: false,
                // Check if the backend returned a custom manual validation check error
                message: data.error || data.detail || data.message || "Failed to create link.",
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: `Network error: ${error.message || 'Failed to connect to backend server.'}`,
        };
    }
}

/**
 * DELETE USER LINK ACTION
 * 
 * Analogy:
 * Think of this action like a secure document shredding instruction.
 * It takes the specific file ID (linkId) you want to remove, and runs to the
 * Django backend via a secure DELETE request to instruct the database to safely purge it.
 */
export async function deleteLinkAction(linkId: number) {
    try {
        // Dispatch a secure DELETE request to our unified Django `/links/<pk>/` endpoint.
        // apiFetch will automatically handle reading the HttpOnly cookie and appending the Bearer token!
        const { ok, data } = await apiFetch(`/links/${linkId}/`, {
            method: 'DELETE',
        });

        if (ok) {
            return {
                success: true,
                message: "Link deleted successfully.",
            };
        } else {
            return {
                success: false,
                message: data.error || data.detail || data.message || "Failed to delete link.",
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: `Network error: ${error.message || 'Failed to connect to backend server.'}`,
        };
    }
}

/**
 * UPDATE USER LINK ACTION
 * 
 * Analogy:
 * Think of this action like visiting the secure vault service counter to update a folder's documents.
 * You present your key card (JWT Token), hand the clerk a list of modifications (new Title, URL, sorting Order, or visibility switch),
 * and the clerk modifies the specific file (linkId) on the spot, handing you back the fresh updated folder.
 */
export async function updateLinkAction(
    linkId: number,
    title: string,
    url: string,
    order: number,
    isActive: boolean
) {
    try {
        // Construct the body payload containing updated details to send to the backend.
        // We match the fields Django expects: title, url, order, and is_active.
        const bodyPayload = {
            title: title.trim(),
            url: url.trim(),
            order: order,
            is_active: isActive,
        };

        // Dispatch a secure PUT request to our unified RESTful Django endpoint: `/links/<pk>/`
        // apiFetch automatically fetches cookie credentials and appends Bearer authorization!
        const { ok, data } = await apiFetch(`/links/${linkId}/`, {
            method: 'PUT',
            body: bodyPayload,
        });

        if (ok) {
            return {
                success: true,
                message: "Link updated successfully.",
                link: data, // Return the newly updated link row object
            };
        } else {
            return {
                success: false,
                // Check if the backend returned a custom manual validation error (like empty fields)
                message: data.error || data.detail || data.message || "Failed to update link.",
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: `Network error: ${error.message || 'Failed to connect to backend server.'}`,
        };
    }
}



