import { motion } from 'framer-motion';

interface SpinnerProps {
    size?: number;
    className?: string;
}

export const Spinner = ({ size = 24, className = '' }: SpinnerProps) => (
    <motion.div
        className={`spinner ${className}`}
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
        }}
    >
        <svg viewBox="0 0 50 50" className="w-full h-full text-current">
            <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="80, 200"
            />
        </svg>
    </motion.div>
);
