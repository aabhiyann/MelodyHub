import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCardReveal } from '@/hooks/useCardReveal';

interface CategoryCardProps {
  title: string;
  gradient: string;
  icon?: string | React.ReactNode;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
  size?: 'default' | 'large';
  index?: number;
  'data-grid-index'?: number;
  tabIndex?: number;
  'data-focused'?: boolean;
}

export const CategoryCard = ({
  title,
  gradient,
  icon,
  imageUrl,
  onClick,
  className,
  size = 'default',
  index = 0,
  'data-grid-index': gridIndex,
  tabIndex = 0,
  'data-focused': isFocused,
}: CategoryCardProps) => {
  const { ref, animate, transition: revealTransition } = useCardReveal({ delay: index });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animate}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={revealTransition}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role="button"
      aria-label={`${title} category`}
      data-grid-index={gridIndex}
      data-focused={isFocused}
      className={cn(
        'category-card group relative overflow-hidden rounded-xl cursor-pointer shadow-lg',
        'hover:shadow-2xl transition-all duration-300',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50',
        isFocused && 'ring-4 ring-brand-primary',
        size === 'large' ? 'aspect-[2/1]' : 'aspect-square',
        gradient,
        className
      )}
    >
      {/* Background Image (optional) */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className={cn(
            'absolute object-cover opacity-80',
            'transition-transform duration-300 group-hover:scale-110',
            size === 'large'
              ? 'right-0 bottom-0 w-32 h-32 rotate-12'
              : 'right-0 bottom-0 w-24 h-24 rotate-12'
          )}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 flex flex-col justify-end h-full',
          size === 'large' ? 'p-6' : 'p-4'
        )}
      >
        {/* Icon */}
        {icon && (
          <div className={cn('mb-2', size === 'large' ? 'text-6xl' : 'text-5xl')}>
            {typeof icon === 'string' ? icon : icon}
          </div>
        )}

        {/* Title */}
        <h3
          className={cn(
            'font-bold text-white leading-tight',
            size === 'large' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
          )}
        >
          {title}
        </h3>
      </div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};
