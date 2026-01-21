/**
 * Holiday theme detection and accessories
 * Adds seasonal flair to Melody
 */

export interface HolidayTheme {
    name: string;
    accessory: 'santa-hat' | 'party-hat' | 'witch-hat' | 'none';
    message: string;
}

export function getHolidayTheme(): HolidayTheme | null {
    const today = new Date();
    const month = today.getMonth(); // 0-11
    const day = today.getDate();

    // Christmas (Dec 25)
    if (month === 11 && day === 25) {
        return {
            name: 'Christmas',
            accessory: 'santa-hat',
            message: 'Merry Christmas! 🎄',
        };
    }

    // Christmas Eve & Week
    if (month === 11 && day >= 20 && day <= 31) {
        return {
            name: 'Holiday Season',
            accessory: 'santa-hat',
            message: 'Happy Holidays! ✨',
        };
    }

    // New Year's (Jan 1)
    if (month === 0 && day === 1) {
        return {
            name: 'New Year',
            accessory: 'party-hat',
            message: 'Happy New Year! 🎉',
        };
    }

    // Halloween (Oct 31)
    if (month === 9 && day === 31) {
        return {
            name: 'Halloween',
            accessory: 'witch-hat',
            message: 'Happy Halloween! 🎃',
        };
    }

    // Halloween Week
    if (month === 9 && day >= 25) {
        return {
            name: 'Spooky Season',
            accessory: 'witch-hat',
            message: 'Spooky vibes! 👻',
        };
    }

    // Valentine's Day (Feb 14)
    if (month === 1 && day === 14) {
        return {
            name: 'Valentine\'s Day',
            accessory: 'none',
            message: 'Spread the love! 💕',
        };
    }

    return null;
}

export function isBirthday(userBirthday?: string): boolean {
    if (!userBirthday) return false;

    const today = new Date();
    const birthday = new Date(userBirthday);

    return (
        today.getMonth() === birthday.getMonth() &&
        today.getDate() === birthday.getDate()
    );
}
