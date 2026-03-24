/**
 * Custom fetch wrapper to handle Next.js RSCs + Client Components
 * Automatic Token refreshing logic would go here if using a state manager context.
 * For now, this securely wraps the proxied calls.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    // Include credentials for the HttpOnly Refresh Token
    options.credentials = 'include';

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Return default error message if body is not JSON
        }

        // Automatic Refresh token logic can be hooked here (401 Unauthorized interceptor scenario)
        if (response.status === 401 && endpoint !== '/auth/refresh') {
            try {
                const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
                if (refreshRes.ok) {
                    // Retry the original request
                    const retryResponse = await fetch(url, { ...options, headers });
                    return retryResponse.json() as Promise<T>;
                }
            } catch (err) {
                throw new Error('Session Expired');
            }
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return null as unknown as T; // No content
    }

    return response.json() as Promise<T>;
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) => fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, data?: any, options?: RequestInit) => fetchApi<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    put: <T>(endpoint: string, data?: any, options?: RequestInit) => fetchApi<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    delete: <T>(endpoint: string, options?: RequestInit) => fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),

    products: {
        list: (page = 1, limit = 20) => fetchApi<any>(`/products?page=${page}&limit=${limit}`),
        search: (query: string, page = 1, limit = 20) => fetchApi<any>(`/products/search?q=${query}&page=${page}&limit=${limit}`),
        get: (slug: string) => fetchApi<any>(`/products/${slug}`),
    }
};
