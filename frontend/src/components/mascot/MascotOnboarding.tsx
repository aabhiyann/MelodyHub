import { useState, useEffect } from "react";
import { useMascot } from "@/hooks/useMascot";
import { Button } from "@/components/ui/button";
import { ChevronRight, Check } from "lucide-react";
import { playSound } from "@/utils/audio"; // Hypothetical audio util

interface OnboardingStep {
    target: string;
    message: string;
    position: 'center' | 'bottom-right' | 'top-right';
    mascotState: 'idle' | 'thinking' | 'encouraging' | 'celebrating';
}

const steps: OnboardingStep[] = [
    {
        target: 'none',
        message: "Hi! I'm Melody, your musical companion! 🐢 Let me show you around.",
        position: 'center',
        mascotState: 'celebrating'
    },
    {
        target: '#sidebar',
        message: "Here you can browse your Library and discover new music.",
        position: 'bottom-right',
        mascotState: 'thinking'
    },
    {
        target: '.player-controls',
        message: "Control your music playback here. You can also swipe up on mobile!",
        position: 'bottom-right',
        mascotState: 'idle'
    },
    {
        target: 'none',
        message: "That's it! Have fun streaming! 🎵",
        position: 'center',
        mascotState: 'encouraging'
    }
];

export const MascotOnboarding = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const mascot = useMascot();

    // Check if user has seen onboarding
    useEffect(() => {
        const seen = localStorage.getItem('melody_onboarding_seen');
        if (!seen) {
            // Delay start slightly
            setTimeout(() => {
                setIsActive(true);
                startStep(0);
            }, 1000);
        }
    }, []);

    const startStep = (index: number) => {
        const step = steps[index];
        mascot.setPosition(step.position);

        // Use timeout to allow position transition
        setTimeout(() => {
            mascot.setState(step.mascotState as any);
            mascot.showMessage({
                text: step.message,
                dismissible: false,
                duration: 0 // indefinite until next step
            });
        }, 300);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const next = currentStep + 1;
            setCurrentStep(next);
            startStep(next);
        } else {
            // Finish
            finishOnboarding();
        }
    };

    const finishOnboarding = () => {
        setIsActive(false);
        mascot.celebrate("You're all set! Enjoy MelodyHub!");
        mascot.setPosition('bottom-right');
        setTimeout(() => {
            mascot.hideMessage();
            mascot.setState('idle');
        }, 4000);
        localStorage.setItem('melody_onboarding_seen', 'true');
    };

    const handleSkip = () => {
        finishOnboarding();
    };

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-40 pointer-events-none">
            {/* Overlay for focus if needed */}
            {/* <div className="absolute inset-0 bg-black/20" /> */}

            <div className="fixed z-50 pointer-events-auto" style={{
                bottom: '120px',
                right: '20px',
                // In a real implementation we'd calculate position based on target
            }}>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl w-64 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mt-2 gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            className="text-xs text-text-secondary h-8 hover:text-white"
                        >
                            Skip
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleNext}
                            className="bg-brand-primary h-8 text-xs"
                        >
                            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                            {currentStep === steps.length - 1 ? <Check className="ml-1 size-3" /> : <ChevronRight className="ml-1 size-3" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
