export type Vector = number[];

/**
 * Calculate the magnitude (length) of a vector
 */
export const magnitude = (vec: Vector): number => {
    return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
};

/**
 * Calculate the dot product of two vectors
 */
export const dotProduct = (vecA: Vector, vecB: Vector): number => {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must be of same length");
    }
    return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
};

/**
 * Calculate Cosine Similarity between two vectors
 * Returns a value between -1 and 1 (1 means identical direction)
 * For audio features (all positive 0-1), range is usually 0-1.
 */
export const cosineSimilarity = (vecA: Vector, vecB: Vector): number => {
    try {
        const dot = dotProduct(vecA, vecB);
        const magA = magnitude(vecA);
        const magB = magnitude(vecB);

        if (magA === 0 || magB === 0) return 0;

        return dot / (magA * magB);
    } catch (error) {
        console.error("Error calculating cosine similarity", error);
        return 0;
    }
};

/**
 * Extract feature vector from Song object
 * Features: [energy, danceability, valence, acousticness, instrumentalness, speechiness]
 */
export const extractFeatures = (song: any): Vector | null => {
    if (!song.features) return null;

    // Ensure all required features exist. 
    // We select key audio features that define "mood" and "intensity".
    const { energy, danceability, valence, acousticness, instrumentalness } = song.features;

    if (
        energy === undefined ||
        danceability === undefined ||
        valence === undefined ||
        acousticness === undefined ||
        instrumentalness === undefined
    ) {
        return null; // Incomplete data
    }

    return [
        Number(energy),
        Number(danceability),
        Number(valence),
        Number(acousticness),
        Number(instrumentalness)
    ];
};
