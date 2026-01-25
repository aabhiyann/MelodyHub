import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { clerkTheme } from "./styles/clerk-theme";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProviders.tsx";
import { initWebVitals } from "./utils/webVitals";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

// Initialize Web Vitals monitoring in production
if (import.meta.env.PROD) {
	initWebVitals();
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ClerkProvider
			publishableKey={PUBLISHABLE_KEY}
			afterSignOutUrl='/'
			appearance={{
				baseTheme: dark,
				...clerkTheme
			}}
		>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</QueryClientProvider>
			</AuthProvider>
		</ClerkProvider>
	</StrictMode>
);
