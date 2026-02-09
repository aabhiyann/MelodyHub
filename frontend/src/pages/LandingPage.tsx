import { HeroSection } from "./landing/components/HeroSection";
import { FeatureSection } from "./landing/components/FeatureSection";
import { SocialProofSection } from "./landing/components/SocialProofSection";
import { Footer } from "./landing/components/Footer";

import { SEO } from "@/components/shared/SEO";

const LandingPage = () => {
    return (
        <div className="bg-black min-h-screen text-white selection:bg-brand-primary/30 font-sans">
            <SEO
                title="MelodyHub - The Future of Music Streaming"
                description="Experience music like never before with AI-powered playlists, real-time social listening, and a stunning interface. Join MelodyHub today."
            />
            <HeroSection />
            <FeatureSection />
            <SocialProofSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
