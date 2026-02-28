import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProviders.tsx";
import { initWebVitals } from "./utils/webVitals";
import { HelmetProvider } from "react-helmet-async";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

// Initialize Web Vitals monitoring in production
if (import.meta.env.PROD) {
	initWebVitals();
}

// Register PWA Service Worker
import { registerSW } from 'virtual:pwa-register';

// if (import.meta.env.PROD) {
const updateSW = registerSW({
	onNeedRefresh() {
		if (confirm('New content available. Reload?')) {
			updateSW(true);
		}
	},
	onOfflineReady() {
		console.log('App is ready for offline use.');
	},
});
// }

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
				variables: {
					colorPrimary: '#22C55E', // brand accent
					colorBackground: '#0a0a0a', // zinc-950
					colorText: 'white',
				}
			}}
		>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<HelmetProvider>
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</HelmetProvider>
				</QueryClientProvider>
			</AuthProvider>
		</ClerkProvider>
	</StrictMode>
);
