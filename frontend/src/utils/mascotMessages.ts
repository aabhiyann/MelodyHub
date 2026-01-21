/**
 * Mascot Messages Database
 * Contextual, personality-rich messages for Melody
 */

export const mascotMessages = {
    // Empty states
    emptyPlaylist: [
        "Time to create your first playlist! 🎵",
        "An empty playlist is just a masterpiece waiting to happen!",
        "Let's fill this up with your favorite tunes!",
        "Every great playlist starts with a single song!",
    ],

    emptyLibrary: [
        "Your library is looking a bit empty... let's fix that!",
        "Ready to build your music collection? Let's go!",
        "An empty library means endless possibilities! ✨",
    ],

    noSearchResults: [
        "Hmm, I couldn't find anything matching that...",
        "No matches yet, but don't give up!",
        "Try a different search term? I'm here to help!",
    ],

    // Success messages
    playlistCreated: [
        "You did it! High five! 🙌",
        "Awesome sauce! New playlist created! ✨",
        "That's music to my ears! 🎶",
        "Playlist created! Time to fill it with bangers!",
    ],

    songAdded: [
        "Song added! Your playlist is getting better!",
        "Nice choice! Added to your playlist! 🎵",
        "One more hit added to the collection!",
    ],

    profileUpdated: [
        "Profile updated! Looking good! ✨",
        "Changes saved! You're all set!",
        "Profile polished and ready to rock! 🎸",
    ],

    // Loading messages
    loading: [
        "Just a sec, finding the perfect songs...",
        "Patience is a virtue (but I'm almost done!)",
        "Loading... but make it groovy! 🕺",
        "Crunching the musical numbers...",
        "Tuning the algorithms... almost there!",
    ],

    // Error messages
    error: [
        "Oops! Something went wrong, but don't worry!",
        "That didn't work, but let's try again together!",
        "Error? More like error-tunity to learn!",
        "Hmm, that's not right. Let's give it another shot!",
    ],

    // Encouraging messages
    keepGoing: [
        "You're doing great! Keep it up! 💪",
        "You got this! I believe in you!",
        "Almost there! Don't stop now!",
        "You're on fire! 🔥",
    ],

    // Achievement unlocks
    firstPlaylist: [
        "Your first playlist! I'm so proud! 🎉",
        "One playlist down, infinity to go!",
        "You're officially a curator now!",
    ],

    songMilestone: (count: number) => [
        `Wow! ${count} songs! You're a true collector! 🎵`,
        `${count} songs and counting! Impressive!`,
        `Your library hit ${count} songs! Legend status! ⭐`,
    ],

    // Onboarding
    welcome: [
        "Welcome to MelodyHub! Let me show you around! 👋",
        "Hey there! I'm Melody, your musical companion!",
        "Welcome! Ready to discover amazing music?",
    ],

    // Thinking
    thinking: [
        "Hmm, let me think about that...",
        "Processing... this requires my full turtle brain power!",
        "Give me a moment to figure this out...",
    ],

    // Celebrating
    celebrating: [
        "Party time! 🎉",
        "Let's celebrate! You earned it!",
        "Woohoo! Time to dance! 💃",
    ],

    // Sleeping (for Easter eggs)
    sleeping: [
        "Zzz... wake me up when the beat drops...",
        "Just resting my eyes between tracks...",
        "*slow turtle snores*",
    ],
};

/**
 * Get a random message from a category
 */
export function getRandomMessage(category: keyof typeof mascotMessages): string {
    const messages = mascotMessages[category];
    if (Array.isArray(messages)) {
        return messages[Math.floor(Math.random() * messages.length)];
    }
    return "";
}
