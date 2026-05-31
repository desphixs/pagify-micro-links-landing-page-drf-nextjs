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
