/**
 * Virtual scrolling component for large lists
 * Uses react-window for performance optimization
 */

import { FixedSizeList } from 'react-window';

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
