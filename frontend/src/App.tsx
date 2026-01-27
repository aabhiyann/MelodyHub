import { lazy, Suspense, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { LoadingScreen } from "./components/LoadingScreen";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { LoadingBar } from "./components/LoadingBar";
import { PageTransition } from "./components/PageTransition";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireGuest } from "./guards/RequireGuest";

// New UI components
import { SidebarLayout } from '@/components/navigation/SidebarLayout';
import AudioPlayer from '@/components/AudioPlayer';
import { FullScreenPlayer } from '@/components/player/FullScreenPlayer';
import { Mascot } from '@/components/mascot/Mascot';
import { InstallPrompt } from '@/components/mobile/InstallPrompt';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsGuide } from '@/components/KeyboardShortcutsGuide';

// Lazy load all pages for better code splitting
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ArtistPage = lazy(() => import("./pages/ArtistPage"));
const BrowsePage = lazy(() => import("./pages/BrowsePage"));
const RadioPage = lazy(() => import("./pages/RadioPage"));
const PlaylistPage = lazy(() => import("./pages/PlaylistPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const GamificationPage = lazy(() => import("./pages/GamificationPage"));

function App() {
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);

	// Enable global keyboard shortcuts
	useKeyboardShortcuts();

	// Show loading bar during route transitions
	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => setIsLoading(false), 300);
		return () => clearTimeout(timer);
	}, [location.pathname]);

	return (
		<Suspense fallback={<LoadingScreen />}>
			<LoadingBar isLoading={isLoading} />
			<Toaster
				position="top-right"
				reverseOrder={false}
				toastOptions={{
					style: {
						background: '#18181b', // zinc-900
						color: '#fff',
						border: '1px solid #27272a', // zinc-800
						padding: '12px 16px',
						borderRadius: '12px',
						fontSize: '14px',
						maxWidth: '400px',
						boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
						backdropFilter: 'blur(10px)',
					},
					success: {
						iconTheme: {
							primary: '#8b5cf6', // brand-primary (violet)
							secondary: '#fff',
						},
					},
					error: {
						iconTheme: {
							primary: '#ef4444', // red-500
							secondary: '#fff',
						},
					},
				}}
			/>
			<KeyboardShortcutsGuide />
			<AnimatePresence mode="wait">
				<Routes location={location} key={location.pathname}>
					{/* SSO Callback - Use full URL for redirects */}
					<Route
						path='/sso-callback'
						element={
							<AuthenticateWithRedirectCallback
								signUpUrl={window.location.origin + "/auth-callback"}
								signInUrl={window.location.origin + "/auth-callback"}
								continueSignUpUrl={window.location.origin + "/auth-callback"}
							/>
						}
					/>

					{/* Auth Callback */}
					<Route path='/auth-callback' element={<PageTransition><AuthCallbackPage /></PageTransition>} />

					{/* Landing Page - for guests only */}
					<Route
						path='/'
						element={
							<RequireGuest>
								<PageTransition><LandingPage /></PageTransition>
							</RequireGuest>
						}
					/>

					{/* Authenticated Routes - wrapped in RequireAuth */}
					<Route
						element={
							<RequireAuth>
								<SidebarLayout />
							</RequireAuth>
						}
					>
						<Route path='/home' element={<PageTransition><HomePage /></PageTransition>} />
						<Route path='/browse' element={<PageTransition><BrowsePage /></PageTransition>} />
						<Route path='/radio' element={<PageTransition><RadioPage /></PageTransition>} />
						<Route path='/search' element={<PageTransition><SearchPage /></PageTransition>} />
						<Route path='/library' element={<PageTransition><LibraryPage /></PageTransition>} />
						<Route path='/community' element={<PageTransition><CommunityPage /></PageTransition>} />
						<Route path='/profile' element={<PageTransition><ProfilePage /></PageTransition>} />
						<Route path='/user/:userId' element={<PageTransition><ProfilePage /></PageTransition>} />
						<Route path='/chat' element={<PageTransition><ChatPage /></PageTransition>} />
						<Route path='/playlists/:id' element={<PageTransition><PlaylistPage /></PageTransition>} />
						<Route path='/analytics' element={<PageTransition><AnalyticsPage /></PageTransition>} />
						<Route path='/settings' element={<PageTransition><SettingsPage /></PageTransition>} />
						<Route path='/radio/:songId' element={<PageTransition><RadioPage /></PageTransition>} />
						<Route path='/albums/:albumId' element={<PageTransition><AlbumPage /></PageTransition>} />
						<Route path='/artists/:artistId' element={<PageTransition><ArtistPage /></PageTransition>} />
						<Route path='/admin' element={<PageTransition><AdminPage /></PageTransition>} />
						<Route path='/quests' element={<PageTransition><GamificationPage /></PageTransition>} />
						<Route path='*' element={<PageTransition><NotFoundPage /></PageTransition>} />
					</Route>
				</Routes>
			</AnimatePresence>
			<AudioPlayer />
			<FullScreenPlayer />
			<Mascot />
			<InstallPrompt />
		</Suspense>
	);
}

export default App;