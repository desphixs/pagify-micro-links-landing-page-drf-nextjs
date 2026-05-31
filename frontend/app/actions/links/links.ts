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

