import { lazy, Suspense, useState, useEffect } from "react";
import { Route, Routes, useLocation, Outlet } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { LoadingBar } from "@/components/shared/LoadingBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireGuest } from "./guards/RequireGuest";
import { PageErrorBoundary } from "@/components/shared/PageErrorBoundary";
import { SEO } from "@/components/shared/SEO";
// Lazy load all pages for better code splitting
import { SidebarLayout } from '@/components/layout/navigation/SidebarLayout';
import AudioPlayer from '@/components/features/player/AudioPlayer';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
// Accessibility
import { SkipLinks } from "@/components/accessibility/SkipLinks";
import { ShortcutsModal } from "@/components/accessibility/ShortcutsModal";
import { useAccessibilityStore } from "@/stores/AccessibilityStore";

// Lazy load heavy global components
const FullScreenPlayer = lazy(() => import('@/components/features/player/FullScreenPlayer').then(m => ({ default: m.FullScreenPlayer })));
const Mascot = lazy(() => import('@/components/features/mascot/Mascot').then(m => ({ default: m.Mascot })));
const AIPlaylistModal = lazy(() => import('@/components/features/ai/AIPlaylistModal').then(m => ({ default: m.AIPlaylistModal })));
const InstallPrompt = lazy(() => import('@/components/features/mobile/InstallPrompt').then(m => ({ default: m.InstallPrompt })));
const OfflineIndicator = lazy(() => import('@/components/shared/OfflineIndicator').then(m => ({ default: m.OfflineIndicator })));

// Lazy load all pages for better code splitting
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const AlbumPage = lazy(() => import("./pages/AlbumPage"));
const AdminLayout = lazy(() => import("@/components/layout/AdminLayout").then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard")); // Fallback
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));
const AdminSongsPage = lazy(() => import("./pages/admin/AdminSongsPage"));
// const AdminPage = lazy(() => import("./pages/AdminPage")); // Deprecated
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
const FollowersPage = lazy(() => import("./pages/FollowersPage"));
const FollowingPage = lazy(() => import("./pages/FollowingPage"));

function App() {
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(false);
	const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
	const { highContrast, largeText } = useAccessibilityStore();

	// Enable global keyboard controls
	useKeyboardControls();

	// Handle accessibility classes
	useEffect(() => {
		if (highContrast) document.body.classList.add('high-contrast');
		else document.body.classList.remove('high-contrast');

		if (largeText) document.body.classList.add('large-text');
		else document.body.classList.remove('large-text');
	}, [highContrast, largeText]);

	// Handle shortcuts modal
	useEffect(() => {
		const handleOpenShortcuts = () => setIsShortcutsOpen(true);
		window.addEventListener('melody-open-shortcuts', handleOpenShortcuts);
		return () => window.removeEventListener('melody-open-shortcuts', handleOpenShortcuts);
	}, []);

	// Show loading bar during route transitions
	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => setIsLoading(false), 300);
		return () => clearTimeout(timer);
	}, [location.pathname]);

	return (

		<Suspense fallback={<LoadingScreen />}>
			<SEO />
			<SkipLinks />
			<OfflineIndicator />
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

			<ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

			<AnimatePresence mode="wait">
				<PageErrorBoundary>
					<Routes location={location}>
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
							<Route path='/home' element={<Suspense fallback={<LoadingScreen message="Loading your feed..." fullScreen={false} />}><PageTransition><HomePage /></PageTransition></Suspense>} />
							<Route path='/browse' element={<Suspense fallback={<LoadingScreen message="Curating genres..." fullScreen={false} />}><PageTransition><BrowsePage /></PageTransition></Suspense>} />
							<Route path='/radio' element={<Suspense fallback={<LoadingScreen message="Tuning the dial..." fullScreen={false} />}><PageTransition><RadioPage /></PageTransition></Suspense>} />
							<Route path='/search' element={<Suspense fallback={<LoadingScreen message="Ready to explore..." fullScreen={false} />}><PageTransition><SearchPage /></PageTransition></Suspense>} />
							<Route path='/library' element={<Suspense fallback={<LoadingScreen message="Opening your library..." fullScreen={false} />}><PageTransition><LibraryPage /></PageTransition></Suspense>} />
							<Route path='/community' element={<Suspense fallback={<LoadingScreen message="Finding fellow listeners..." fullScreen={false} />}><PageTransition><CommunityPage /></PageTransition></Suspense>} />
							<Route path='/profile' element={<Suspense fallback={<LoadingScreen message="Loading profile..." fullScreen={false} />}><PageTransition><ProfilePage /></PageTransition></Suspense>} />
							<Route path='/profile/:userId' element={<Suspense fallback={<LoadingScreen message="Loading profile..." fullScreen={false} />}><PageTransition><ProfilePage /></PageTransition></Suspense>} />
							<Route path='/user/:userId' element={<Suspense fallback={<LoadingScreen message="Loading user data..." fullScreen={false} />}><PageTransition><ProfilePage /></PageTransition></Suspense>} />
							<Route path='/followers/:userId' element={<Suspense fallback={<LoadingScreen message="Fetching followers..." fullScreen={false} />}><PageTransition><FollowersPage /></PageTransition></Suspense>} />
							<Route path='/following/:userId' element={<Suspense fallback={<LoadingScreen message="Fetching following..." fullScreen={false} />}><PageTransition><FollowingPage /></PageTransition></Suspense>} />
							<Route path='/chat' element={<Suspense fallback={<LoadingScreen message="Connecting to friends..." fullScreen={false} />}><PageTransition><ChatPage /></PageTransition></Suspense>} />
							<Route path='/playlists/:id' element={<Suspense fallback={<LoadingScreen message="Loading playlist..." fullScreen={false} />}><PageTransition><PlaylistPage /></PageTransition></Suspense>} />
							<Route path='/analytics' element={<Suspense fallback={<LoadingScreen message="Crunching the numbers..." fullScreen={false} />}><PageTransition><AnalyticsPage /></PageTransition></Suspense>} />
							<Route path='/settings' element={<Suspense fallback={<LoadingScreen message="Warming up the studio..." fullScreen={false} />}><PageTransition><SettingsPage /></PageTransition></Suspense>} />
							<Route path='/radio/:songId' element={<Suspense fallback={<LoadingScreen message="Creating station..." fullScreen={false} />}><PageTransition><RadioPage /></PageTransition></Suspense>} />
							<Route path='/albums/:albumId' element={<Suspense fallback={<LoadingScreen message="Loading album..." fullScreen={false} />}><PageTransition><AlbumPage /></PageTransition></Suspense>} />
							<Route path='/artists/:artistId' element={<Suspense fallback={<LoadingScreen message="Loading artist..." fullScreen={false} />}><PageTransition><ArtistPage /></PageTransition></Suspense>} />
							<Route path='/quests' element={<Suspense fallback={<LoadingScreen message="Gathering your quests..." fullScreen={false} />}><PageTransition><GamificationPage /></PageTransition></Suspense>} />
							<Route path='*' element={<Suspense fallback={<LoadingScreen fullScreen={false} />}><PageTransition><NotFoundPage /></PageTransition></Suspense>} />
						</Route>

						{/* Admin Routes - Separate Layout */}
						<Route
							element={
								<RequireAuth>
									<Outlet />
								</RequireAuth>
							}
						>
							<Route path='/admin' element={<AdminLayout />}>
								<Route index element={<Suspense fallback={<LoadingScreen message="Loading dashboard..." fullScreen={false} />}><PageTransition><AdminDashboard /></PageTransition></Suspense>} />
								<Route path='songs' element={<Suspense fallback={<LoadingScreen message="Loading catalog..." fullScreen={false} />}><PageTransition><AdminSongsPage /></PageTransition></Suspense>} />
								<Route path='analytics' element={<Suspense fallback={<LoadingScreen message="Analyzing platform data..." fullScreen={false} />}><PageTransition><AnalyticsPage /></PageTransition></Suspense>} />
								<Route path='settings' element={<Suspense fallback={<LoadingScreen message="Loading settings..." fullScreen={false} />}><PageTransition><AdminSettingsPage /></PageTransition></Suspense>} />
								<Route path='*' element={<Suspense fallback={<LoadingScreen fullScreen={false} />}><PageTransition><AdminDashboard /></PageTransition></Suspense>} />
							</Route>
						</Route>
					</Routes>
				</PageErrorBoundary>
			</AnimatePresence>
			<AudioPlayer />
			<Suspense fallback={null}>
				<FullScreenPlayer />
				<Mascot />
				<AIPlaylistModal />
				<InstallPrompt />
			</Suspense>
		</Suspense>
	);
}

export default App;