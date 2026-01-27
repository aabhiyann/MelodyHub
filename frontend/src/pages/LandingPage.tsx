import { HeroSection } from "./landing/components/HeroSection";
import { FeatureSection } from "./landing/components/FeatureSection";
import { SocialProofSection } from "./landing/components/SocialProofSection";
import { Footer } from "./landing/components/Footer";

const LandingPage = () => {
    return (
        <div className="bg-black min-h-screen text-white selection:bg-brand-primary/30 font-sans">
            <HeroSection />
            <FeatureSection />
            <SocialProofSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
