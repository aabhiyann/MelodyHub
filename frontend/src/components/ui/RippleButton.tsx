import React, { useState } from 'react';
import { Button, ButtonProps } from './button'; // Extend existing button

interface RippleButtonProps extends ButtonProps {
    enableRipple?: boolean;
}

export const RippleButton = ({ children, onClick, enableRipple = true, className, ...props }: RippleButtonProps) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (enableRipple) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newRipple = { x, y, id: Date.now() };
            setRipples((prev) => [...prev, newRipple]);

            // Remove ripple after animation
            setTimeout(() => {
                setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
            }, 600);
        }

        onClick?.(e);
    };

    return (
        <Button
            className={`relative overflow-hidden ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '20px',
                        height: '20px',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}
        </Button>
    );
};
