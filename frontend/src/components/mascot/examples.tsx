/**
 * Mascot Integration Examples
 * Practical usage patterns for Melody the Turtle
 */

import { useMascot } from '@/hooks/useMascot';
import { getRandomMessage } from '@/utils/mascotMessages';

/**
 * Example 1: Empty Playlist State
 */
export function PlaylistEmpty() {
    const mascot = useMascot();

    useEffect(() => {
        mascot.setState('encouraging');
        mascot.showMessage(getRandomMessage('emptyPlaylist'));
        mascot.show();
    }, []);

    return <div>No playlists yet...</div>;
}

/**
 * Example 2: Success Toast with Mascot
 */
export function handlePlaylistCreated() {
    const mascot = useMascot();

    mascot.celebrate(getRandomMessage('playlistCreated'));

    // Auto-hide after 3 seconds
    setTimeout(() => mascot.hide(), 3000);
}

/**
 * Example 3: Loading State
 */
export function AIPlaylistGenerator() {
    const mascot = useMascot();
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePlaylist = async () => {
        setIsGenerating(true);
        mascot.startLoading(getRandomMessage('loading'));

        try {
            await aiService.generatePlaylist();
            mascot.celebrate('Perfect playlist created! 🎉');
        } catch (error) {
            mascot.showError('Oops! Let\'s try that again.');
        } finally {
            setIsGenerating(false);
            setTimeout(() => mascot.hide(), 3000);
        }
    };

    return <button onClick={generatePlaylist}>Generate</button>;
}

/**
 * Example 4: Onboarding Welcome
 */
export function OnboardingWelcome() {
    const mascot = useMascot();

    useEffect(() => {
        mascot.setState('excited');
        mascot.showMessage(getRandomMessage('welcome'));
        mascot.show();
        mascot.setPosition('center');
    }, []);

    return <div>Welcome to MelodyHub!</div>;
}

/**
 * Example 5: Achievement Unlock
 */
export function unlockAchievement(name: string, count?: number) {
    const mascot = useMascot();

    mascot.setState('celebrating');

    if (count) {
        const messages = mascotMessages.songMilestone(count);
        mascot.showMessage(messages[0]);
    } else {
        mascot.showMessage(`Achievement unlocked: ${name}! 🏆`);
    }

    mascot.show();
}

/**
 * Example 6: Error Handling
 */
export function handleError(error: Error) {
    const mascot = useMascot();

    mascot.showError(
        error.message || getRandomMessage('error')
    );

    mascot.show();
}

/**
 * Example 7: Adding Mascot to Layout
 */
export function AppLayout({ children }) {
    return (
        <>
            {children}
            <Mascot /> {/* Always available globally */}
        </>
    );
}
