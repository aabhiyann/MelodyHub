/**
 * Base props that all components should extend.
 * Provides consistent className, testId, and accessibility support.
 */
export interface BaseComponentProps {
    /** Additional CSS classes to apply */
    className?: string;
    /** Test ID for automated testing */
    testId?: string;
    /** ARIA label for accessibility */
    ariaLabel?: string;
    /** ARIA described by for accessibility */
    ariaDescribedBy?: string;
}

/**
 * Props for interactive components (buttons, inputs, etc.)
 */
export interface InteractiveComponentProps extends BaseComponentProps {
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Whether the component is in a loading state */
    isLoading?: boolean;
}

/**
 * Props for components that can be in an error state
 */
export interface ValidatableComponentProps extends InteractiveComponentProps {
    /** Error message to display */
    error?: string;
    /** Whether the component is in an error state */
    hasError?: boolean;
}
