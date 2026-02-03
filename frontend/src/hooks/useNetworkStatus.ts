/**
 * React Hook for Network Status
 * 
 * Monitors network connectivity and provides online/offline status.
 */

import { useState, useEffect } from 'react';
import { isOnline, onNetworkStatusChange } from '@/utils/networkErrorHandler';

export const useNetworkStatus = () => {
    const [online, setOnline] = useState(isOnline());

    useEffect(() => {
        const cleanup = onNetworkStatusChange(setOnline);
        // Update immediately in case status changed
        setOnline(isOnline());
        return cleanup;
    }, []);

    return { online, offline: !online };
};
