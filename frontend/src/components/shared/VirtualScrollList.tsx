/**
 * Virtual scrolling component for large lists
 * Uses react-window for performance optimization
 */

// This tool call is actually to refactor VirtualScrollList to be generic first.
import { List } from 'react-window';

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
        <List
            className={className}
            height={height as number} // react-window types might enforce number, but it often accepts string for 100% if width, but height usually needs explicit number for virtual calc.
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
        >
            {Row}
        </List>
    );
};
