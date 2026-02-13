/**
 * Virtual scrolling component for large lists
 * Uses react-window for performance optimization
 */

// react-window uses CommonJS exports, not ES6 modules
// Using require to avoid module export issues with Vite
const ReactWindow = require('react-window');
const { FixedSizeList } = ReactWindow;

interface VirtualScrollListProps<T> {
    items: T[];
    height: number | string;
    itemHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
}

export const VirtualScrollList = <T extends any>({
    items,
    height,
    itemHeight,
    renderItem,
    className,
}: VirtualScrollListProps<T>) => {
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
        <div style={style}>{renderItem(items[index], index)}</div>
    );

    return (
        <FixedSizeList
            className={className}
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
        >
            {Row}
        </FixedSizeList>
    );
};
