/**
 * UsersTable - User management table with advanced features
 * Admin interface for managing users, roles, and permissions
 */

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { BulkActions } from "@/components/admin/BulkActions";
import { Shield, ShieldOff, MoreVertical, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface User {
    _id: string;
    name: string;
    email: string;
    imageUrl?: string;
    role: 'admin' | 'user';
    status: 'active' | 'suspended';
    createdAt: string;
    lastLogin?: string;
}

interface UsersTableProps {
    users?: User[];
    onRoleChange?: (userId: string, role: 'admin' | 'user') => void;
    onStatusChange?: (userId: string, status: 'active' | 'suspended') => void;
}

// Mock data generator
const generateMockUsers = (): User[] => {
    return [
        {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            role: 'admin',
            status: 'active',
            createdAt: new Date('2024-01-15').toISOString(),
            lastLogin: new Date().toISOString(),
        },
        {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            role: 'user',
            status: 'active',
            createdAt: new Date('2024-02-20').toISOString(),
            lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            _id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
            role: 'user',
            status: 'suspended',
            createdAt: new Date('2024-03-10').toISOString(),
        },
    ];
};

export const UsersTable = ({
    users = generateMockUsers(),
    onRoleChange,
    onStatusChange,
}: UsersTableProps) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const columns: ColumnDef<User>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                    className="size-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="size-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: "name",
            header: "User",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={row.original.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.name}`}
                            alt={row.original.name}
                            className="size-10 rounded-full object-cover ring-2 ring-white"
                        />
                        {row.original.status === 'active' && (
                            <div className="absolute bottom-0 right-0 size-3 bg-success rounded-full border-2 border-white" />
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{row.original.name}</p>
                        <p className="text-body-sm text-gray-500 flex items-center gap-1">
                            <Mail className="size-3" />
                            {row.original.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <span
                    className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-body-xs font-semibold",
                        row.original.role === 'admin'
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                    )}
                >
                    {row.original.role === 'admin' ? (
                        <Shield className="size-3" />
                    ) : (
                        <ShieldOff className="size-3" />
                    )}
                    {row.original.role}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span
                    className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-body-xs font-semibold",
                        row.original.status === 'active'
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                    )}
                >
                    {row.original.status}
                </span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({ row }) => (
                <span className="text-body-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="size-3" />
                    {format(new Date(row.original.createdAt), "MMM d, yyyy")}
                </span>
            ),
        },
        {
            accessorKey: "lastLogin",
            header: "Last Login",
            cell: ({ row }) => (
                <span className="text-body-sm text-gray-600">
                    {row.original.lastLogin
                        ? format(new Date(row.original.lastLogin), "MMM d, h:mm a")
                        : "Never"}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="size-4 text-gray-600" />
                </button>
            ),
            enableSorting: false,
        },
    ];

    const handleBulkAction = () => {
        console.log("Bulk action for", selectedUsers.length, "users");
    };

    return (
        <div className="space-y-4">
            <BulkActions
                selectedCount={selectedUsers.length}
                onDelete={handleBulkAction}
            />

            <DataTable
                columns={columns}
                data={users}
                onRowSelectionChange={setSelectedUsers}
                searchPlaceholder="Search users by name or email..."
            />
        </div>
    );
};
