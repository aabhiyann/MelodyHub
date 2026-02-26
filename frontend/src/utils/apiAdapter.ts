/**
 * API Response Adapter Utility
 * 
 * Handles both legacy and new API response formats during migration.
 * This utility ensures backward compatibility while we migrate endpoints.
 * 
 * Legacy Format: response.data = T (just the data)
 * New Format: response.data = { success: true, data: T }
 * 
 * Usage:
 * ```typescript
 * const response = await axios.get('/api/songs');
 * const songs = extractData<Song[]>(response.data);
 * ```
 */

/**
 * Extract data from API response, handling both formats
 * @param response - The axios response data
 * @returns The extracted data
 */
export function extractData<T>(response: unknown): T {
    // Check if response follows new format
    if (isNewFormat(response)) {
        // New format: { success: true, data: T }
        return response.data as T;
    }

    // Legacy format: just T
    return response as T;
}

/**
 * Type guard to check if response is in new format
 */
export function isNewFormat(response: unknown): response is { success: boolean; data: unknown } {
    return !!response && typeof response === 'object' && 'success' in response;
}
