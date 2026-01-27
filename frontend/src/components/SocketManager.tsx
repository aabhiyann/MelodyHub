import { useEffect } from "react";

import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";

export const SocketManager = () => {
    const { user } = useUser();
    const { connectSocket, disconnectSocket } = useChatStore();

    useEffect(() => {
        if (user?.id) {
            connectSocket(user.id);
        }

        return () => {
            disconnectSocket();
        };
    }, [user, connectSocket, disconnectSocket]);

    return null;
};
