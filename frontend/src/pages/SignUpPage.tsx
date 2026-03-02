import { SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { SEO } from "@/components/shared/SEO";

/**
 * Dedicated sign-up page. Accessible at /sign-up for new users.
 */
const SignUpPage = () => {
	return (
		<div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
			<SEO
				title="Sign up – MelodyHub"
				description="Create your MelodyHub account to start streaming music with AI-powered playlists and real-time social features."
			/>
			<SignUp
				appearance={{
					baseTheme: dark,
					variables: {
						colorPrimary: "#22C55E",
						colorBackground: "#0a0a0a",
						colorText: "white",
					},
				}}
				fallbackRedirectUrl="/home"
				signInUrl="/sign-in"
			/>
		</div>
	);
};

export default SignUpPage;
