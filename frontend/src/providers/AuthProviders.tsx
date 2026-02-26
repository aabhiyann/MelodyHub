import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";
import { useChatStore } from "@/stores/ChatStore";
import { getErrorMessage } from "@/utils/errors";


const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId, isLoaded } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		const initAuth = async () => {
			// Check for Test Mode
			const isTestMode = typeof window !== 'undefined' && window.localStorage.getItem('TEST_MODE') === 'true';

			if (isTestMode) {
				console.log("TEST MODE ACTIVE: Bypassing Clerk");
				updateApiToken("test-token");
				// Manually trigger initSocket with fake user
				if (!userId) initSocket("test-user-123");
				setLoading(false);
				return;
			}

			if (!isLoaded) return;
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					// Check admin status in background - don't block rendering
					checkAdminStatus().catch((err) => console.log("Not an admin:", (err instanceof Error ? err.message : "Unknown error")));
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error) {
				updateApiToken(null);
				console.log("Error in auth provider:", getErrorMessage(error));
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket, isLoaded]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-brand-primary animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
