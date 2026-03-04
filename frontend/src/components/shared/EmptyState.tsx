/**
 * EmptyState - Friendly message when a section has no content.
 * DESIGN_PLAN: text #6B7280 (muted).
 */

import { Music2 } from "lucide-react";
import React from "react";

interface EmptyStateProps {
    message?: string;
    secondary?: string;
    icon?: React.ReactNode;
    className?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState = ({
    message = "Nothing here yet",
    secondary,
    icon,
    className = "",
    actionLabel,
    onAction,
}: EmptyStateProps) => {
    const Icon = icon ?? <Music2 className="size-10 text-[#6B7280]" />;

    return (
        <div
            className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}
        >
            <div className="mb-3 opacity-80">{Icon}</div>
            <p className="text-sm font-medium text-[#6B7280]">{message}</p>
            {secondary && (
                <p className="text-xs text-[#6B7280]/80 mt-1 max-w-[240px]">{secondary}</p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-4 px-4 py-2 rounded-full bg-brand-primary text-black text-xs font-semibold hover:scale-105 transition-transform"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};
