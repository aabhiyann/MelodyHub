/**
 * Virtual scrolling component for large lists
 * Uses react-window for performance optimization
 */

import * as ReactWindow from 'react-window';

// React Window interop for Vite/Rollup
const FixedSizeList = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList || (ReactWindow as any).default;

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

    // Cast to usage
    const ListComponent = FixedSizeList as any;

    if (!ListComponent) {
        console.error("VirtualScrollList: FixedSizeList not found in react-window");
        return null;
    }

    return (
        <ListComponent
            className={className}
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
        >
            {Row}
        </ListComponent>
    );
};
