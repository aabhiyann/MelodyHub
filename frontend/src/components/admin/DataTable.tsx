/**
 * DataTable - Advanced table with sorting, filtering, and selection
 * Using TanStack Table (React Table v8)
 */

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    onRowSelectionChange?: (selectedRows: TData[]) => void;
    searchPlaceholder?: string;
}

export function DataTable<TData>({
    columns,
    data,
    onRowSelectionChange,
    searchPlaceholder = 'Search...',
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: (updater) => {
            setRowSelection(updater);
            // Notify parent of selection changes
            if (onRowSelectionChange) {
                const selectedRowModel = table.getSelectedRowModel();
                onRowSelectionChange(selectedRowModel.rows.map((row) => row.original));
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className='space-y-4'>
            {/* Search */}
            <div className='flex items-center gap-4'>
                <div className='relative flex-1 max-w-sm'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
                    <input
                        type='text'
                        placeholder={searchPlaceholder}
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent'
                    />
                </div>

                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <p className='text-body-sm text-gray-600'>
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s) selected
                    </p>
                )}
            </div>

            {/* Table */}
            <div className='border border-gray-200 rounded-lg overflow-hidden bg-white'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className='px-4 py-3 text-left text-body-sm font-semibold text-gray-700'
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={cn(
                                                        'flex items-center gap-2',
                                                        header.column.getCanSort() && 'cursor-pointer select-none hover:text-gray-900'
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <span className='ml-auto'>
                                                            {header.column.getIsSorted() === 'asc' ? (
                                                                <ChevronUp className='size-4' />
                                                            ) : header.column.getIsSorted() === 'desc' ? (
                                                                <ChevronDown className='size-4' />
                                                            ) : (
                                                                <div className='size-4 opacity-30'>
                                                                    <ChevronDown className='size-4' />
                                                                </div>
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className='px-4 py-8 text-center text-body-md text-gray-500'
                                    >
                                        No results found
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={cn(
                                            'hover:bg-gray-50 transition-colors',
                                            row.getIsSelected() && 'bg-brand-primary/5'
                                        )}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className='px-4 py-3 text-body-md text-gray-900'>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-between'>
                <p className='text-body-sm text-gray-600'>
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} results
                </p>

                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className='px-4 py-2 border border-gray-300 rounded-lg text-body-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className='px-4 py-2 border border-gray-300 rounded-lg text-body-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
