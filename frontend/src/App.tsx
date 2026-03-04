import { lazy, Suspense, useState, useEffect } from "react";
import { Route, Routes, useLocation, Outlet } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { RouteSkeleton } from "@/components/shared/LoadingSkeletons";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { LoadingBar } from "@/components/shared/LoadingBar";
import { PageTransition } from "@/components/layout/PageTransition";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireGuest } from "./guards/RequireGuest";
import { RequireAdmin } from "./guards/RequireAdmin";
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
import { FullScreenPlayer } from '@/components/features/player/FullScreenPlayer';
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
const SignInPage = lazy(() => import("./pages/SignInPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
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

		<Suspense fallback={<RouteSkeleton variant="generic" fullHeight />}>
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
							primary: '#22C55E', // brand-primary (green)
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

						{/* Sign in / Sign up - dedicated pages for auth (fallback when modal fails) */}
						<Route
							path='/sign-in'
							element={
								<RequireGuest>
									<PageTransition><SignInPage /></PageTransition>
								</RequireGuest>
							}
						/>
						<Route
							path='/sign-up'
							element={
								<RequireGuest>
									<PageTransition><SignUpPage /></PageTransition>
								</RequireGuest>
							}
						/>

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
							<Route path='/home' element={<Suspense fallback={<RouteSkeleton variant="home" fullHeight={false} />}><PageTransition><HomePage /></PageTransition></Suspense>} />
							<Route path='/browse' element={<Suspense fallback={<RouteSkeleton variant="browse" fullHeight={false} />}><PageTransition><BrowsePage /></PageTransition></Suspense>} />
							<Route path='/radio' element={<Suspense fallback={<RouteSkeleton variant="generic" fullHeight={false} />}><PageTransition><RadioPage /></PageTransition></Suspense>} />
							<Route path='/search' element={<Suspense fallback={<RouteSkeleton variant="search" fullHeight={false} />}><PageTransition><SearchPage /></PageTransition></Suspense>} />
							<Route path='/library' element={<Suspense fallback={<RouteSkeleton variant="library" fullHeight={false} />}><PageTransition><LibraryPage /></PageTransition></Suspense>} />
							<Route path='/community' element={<Suspense fallback={<RouteSkeleton variant="generic" fullHeight={false} />}><PageTransition><CommunityPage /></PageTransition></Suspense>} />
							<Route path='/profile' element={<Suspense fallback={<RouteSkeleton variant="profile" fullHeight={false} />}><PageTransition><ProfilePage /></PageTransition></Suspense>} />
							<Route path='/profile/:userId' element={<Suspense fallback={<RouteSkeleton variant="profile" fullHeight={false} />}><PageTransition><ProfilePage /></PageTransition></Suspense>} />
							<Route path='/user/:userId' element={<Suspense fallback={<RouteSkeleton variant="profile" fullHeight={false} />}><PageTransition><ProfilePage /></PageTransition></Suspense>} />
							<Route path='/followers/:userId' element={<Suspense fallback={<RouteSkeleton variant="generic" fullHeight={false} />}><PageTransition><FollowersPage /></PageTransition></Suspense>} />
							<Route path='/following/:userId' element={<Suspense fallback={<RouteSkeleton variant="generic" fullHeight={false} />}><PageTransition><FollowingPage /></PageTransition></Suspense>} />
							<Route path='/chat' element={<Suspense fallback={<RouteSkeleton variant="chat" fullHeight={false} />}><PageTransition><ChatPage /></PageTransition></Suspense>} />
							<Route path='/playlists/:id' element={<Suspense fallback={<RouteSkeleton variant="playlist" fullHeight={false} />}><PageTransition><PlaylistPage /></PageTransition></Suspense>} />
							<Route path='/analytics' element={<Suspense fallback={<RouteSkeleton variant="analytics" fullHeight={false} />}><PageTransition><AnalyticsPage /></PageTransition></Suspense>} />
							<Route path='/settings' element={<Suspense fallback={<RouteSkeleton variant="generic" fullHeight={false} />}><PageTransition><SettingsPage /></PageTransition></Suspense>} />
							<Route path='/radio/:songId' element={<Suspense fallback={<RouteSkeleton variant="generic" fullHeight={false} />}><PageTransition><RadioPage /></PageTransition></Suspense>} />
							<Route path='/albums/:albumId' element={<Suspense fallback={<RouteSkeleton variant="album" fullHeight={false} />}><PageTransition><AlbumPage /></PageTransition></Suspense>} />
							<Route path='/artists/:artistId' element={<Suspense fallback={<RouteSkeleton variant="artist" fullHeight={false} />}><PageTransition><ArtistPage /></PageTransition></Suspense>} />
							<Route path='/quests' element={<Suspense fallback={<RouteSkeleton variant="generic" fullHeight={false} />}><PageTransition><GamificationPage /></PageTransition></Suspense>} />
							<Route path='*' element={<Suspense fallback={<RouteSkeleton variant="generic" fullHeight={false} />}><PageTransition><NotFoundPage /></PageTransition></Suspense>} />
						</Route>

						{/* Admin Routes - Separate Layout, requires admin role */}
						<Route
							element={
								<RequireAdmin>
									<Outlet />
								</RequireAdmin>
							}
						>
							<Route path='/admin' element={<AdminLayout />}>
								<Route index element={<Suspense fallback={<RouteSkeleton variant="admin" fullHeight={false} />}><PageTransition><AdminDashboard /></PageTransition></Suspense>} />
								<Route path='songs' element={<Suspense fallback={<RouteSkeleton variant="admin" fullHeight={false} />}><PageTransition><AdminSongsPage /></PageTransition></Suspense>} />
								<Route path='analytics' element={<Suspense fallback={<RouteSkeleton variant="admin" fullHeight={false} />}><PageTransition><AnalyticsPage /></PageTransition></Suspense>} />
								<Route path='settings' element={<Suspense fallback={<RouteSkeleton variant="admin" fullHeight={false} />}><PageTransition><AdminSettingsPage /></PageTransition></Suspense>} />
								<Route path='*' element={<Suspense fallback={<RouteSkeleton variant="admin" fullHeight={false} />}><PageTransition><AdminDashboard /></PageTransition></Suspense>} />
							</Route>
						</Route>
					</Routes>
				</PageErrorBoundary>
			</AnimatePresence>
			<AudioPlayer />
			<FullScreenPlayer />
			<Suspense fallback={null}>
				<Mascot />
				<AIPlaylistModal />
				<InstallPrompt />
			</Suspense>
		</Suspense>
	);
}

export default App;