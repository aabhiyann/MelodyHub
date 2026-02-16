import { memo } from 'react';

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
    return (
        <div
            className={className}
            style={{
                height,
                width: '100%',
                overflowY: 'auto',
                position: 'relative'
            }}
        >
            <div style={{ height: items.length * itemHeight, position: 'relative' }}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            top: index * itemHeight,
                            left: 0,
                            width: '100%',
                            height: itemHeight
                        }}
                    >
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>
        </div>
    );
};
