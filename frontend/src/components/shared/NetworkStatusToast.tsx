/**
 * Network Status Toast Component
 * 
 * Shows toast notifications when network status changes.
 */

import { useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import toast from 'react-hot-toast';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatusToast = () => {
    const { online } = useNetworkStatus();

    useEffect(() => {
        if (!online) {
            toast.error("You're offline. Check your connection and try again.", {
                icon: <WifiOff className="size-5" />,
                duration: Infinity, // Stay until dismissed or back online
                id: 'network-offline'
            });
        } else {
            // Dismiss offline toast and show brief online message
            toast.dismiss('network-offline');

            // Only show "back online" if we were previously offline
            // (check if there was an offline toast)
            const wasOffline = document.querySelector('[data-sonner-toast-id="network-offline"]');
            if (wasOffline) {
                toast.success('Back online: Connection restored', {
                    icon: <Wifi className="size-5" />,
                    duration: 3000
                });
            }
        }
    }, [online]);

    return null; // This component doesn't render anything
};
