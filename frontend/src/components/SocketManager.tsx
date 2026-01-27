import { useEffect } from "react";

import { useChatStore } from "@/stores/ChatStore";
import { useUser } from "@clerk/clerk-react";

export const SocketManager = () => {
    const { user } = useUser();
    const { initSocket, disconnectSocket } = useChatStore();

    useEffect(() => {
        if (user?.id) {
            initSocket(user.id);
        }

        return () => {
            disconnectSocket();
        };
    }, [user, initSocket, disconnectSocket]);

    return null;
};
