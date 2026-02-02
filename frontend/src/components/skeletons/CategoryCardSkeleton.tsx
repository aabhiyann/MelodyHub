interface CategoryCardSkeletonProps {
  count?: number;
  size?: 'default' | 'large';
}

export const CategoryCardSkeleton = ({ 
  count = 12, 
  size = 'default' 
}: CategoryCardSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-xl skeleton-shimmer ${
            size === 'large' ? 'aspect-[2/1]' : 'aspect-square'
          }`}
        />
      ))}
    </div>
  );
};
