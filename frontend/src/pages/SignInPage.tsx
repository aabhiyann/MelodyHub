import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { SEO } from "@/components/shared/SEO";

/**
 * Dedicated sign-in page. Accessible at /sign-in for users who need to log in
 * (e.g. after logout, or returning users). Provides a fallback when the
 * Get Started modal (openSignIn) is not available or fails.
 */
const SignInPage = () => {
	return (
		<div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
			<SEO
				title="Sign in – MelodyHub"
				description="Sign in to your MelodyHub account to access your music, playlists, and more."
			/>
			<SignIn
				appearance={{
					baseTheme: dark,
					variables: {
						colorPrimary: "#22C55E",
						colorBackground: "#0a0a0a",
						colorText: "white",
					},
				}}
				fallbackRedirectUrl="/home"
				signUpUrl="/sign-up"
			/>
		</div>
	);
};

export default SignInPage;
