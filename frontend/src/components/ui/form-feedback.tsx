/**
 * FormFeedback - Validation animations for forms
 * Success checkmarks and error shake animations
 */

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { checkmarkVariants, shakeAnimation } from '@/lib/interactions';
import { cn } from '@/lib/utils';

interface FormFeedbackProps {
    type: 'success' | 'error' | 'info';
    message?: string;
    className?: string;
}

export const FormFeedback = ({ type, message, className }: FormFeedbackProps) => {
    return (
        <motion.div
            className={cn('flex items-center gap-2 mt-2', className)}
            initial={{ opacity: 0, y: -10 }}
            animate={type === 'error' ? 'shake' : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            variants={type === 'error' ? shakeAnimation : undefined}
        >
            {type === 'success' && (
                <motion.div className='flex-shrink-0'>
                    <svg className='size-5' viewBox='0 0 24 24'>
                        <motion.path
                            d='M5 13l4 4L19 7'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth={3}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='text-success'
                            variants={checkmarkVariants}
                            initial='hidden'
                            animate='visible'
                        />
                    </svg>
                </motion.div>
            )}

            {type === 'error' && <AlertCircle className='size-5 text-error flex-shrink-0' />}

            {message && (
                <span
                    className={cn(
                        'text-body-sm',
                        type === 'success' && 'text-success',
                        type === 'error' && 'text-error',
                        type === 'info' && 'text-info'
                    )}
                >
                    {message}
                </span>
            )}
        </motion.div>
    );
};

// Enhanced Input with validation feedback
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    success?: boolean;
}

export const ValidatedInput = ({
    label,
    error,
    success,
    className,
    ...props
}: ValidatedInputProps) => {
    return (
        <div className='space-y-1'>
            {label && (
                <label className='text-body-md font-medium text-text-primary'>
                    {label}
                </label>
            )}

            <motion.div animate={error ? 'shake' : undefined} variants={shakeAnimation}>
                <input
                    className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-surface border transition-all',
                        'text-text-primary placeholder-text-tertiary',
                        'outline-none focus:ring-4',
                        error
                            ? 'border-error focus:border-error focus:ring-error/20'
                            : success
                                ? 'border-success focus:border-success focus:ring-success/20'
                                : 'border-border focus:border-brand-primary focus:ring-brand-primary/20',
                        className
                    )}
                    {...props}
                />
            </motion.div>

            {error && <FormFeedback type='error' message={error} />}
            {success && !error && <FormFeedback type='success' message='Looks good!' />}
        </div>
    );
};
