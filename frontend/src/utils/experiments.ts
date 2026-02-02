/**
 * Simple A/B testing framework
 * Uses deterministic hashing to assign users to variants
 */

interface Experiment {
  variants: string[];
  weights: number[];
}

export const EXPERIMENTS: Record<string, Experiment> = {
  'grid-density': {
    variants: ['standard', 'dense'],
    weights: [0.5, 0.5],
  },
  'card-animation': {
    variants: ['subtle', 'prominent'],
    weights: [0.5, 0.5],
  },
};

// Simple hash function for consistent variant assignment
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const getVariant = (experimentId: string, userId: string): string => {
  const experiment = EXPERIMENTS[experimentId];
  
  if (!experiment) {
    console.warn(`Experiment "${experimentId}" not found`);
    return 'control';
  }

  // Use hash to deterministically assign variant
  const hash = hashCode(userId + experimentId);
  const index = hash % experiment.variants.length;
  
  return experiment.variants[index];
};

export const isVariant = (
  experimentId: string,
  userId: string,
  variantName: string
): boolean => {
  return getVariant(experimentId, userId) === variantName;
};
