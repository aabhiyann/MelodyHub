/**
 * UsersTab - User management interface for admin
 * Complete user administration panel
 */

import { UsersTable } from "@/components/features/admin/UsersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { useChatStore } from "@/stores/ChatStore";
import { useMusicStore } from "@/stores/MusicStore";
import { useEffect } from "react";

export const UsersTab = () => {
    const { users, fetchUsers, isLoading } = useChatStore();
    const { stats } = useMusicStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-heading-lg font-bold text-gray-900 flex items-center gap-2">
                        <Users className="size-6 text-brand-primary" />
                        User Management
                    </h2>
                    <p className="text-body-md text-gray-600 mt-1">
                        Manage user accounts, roles, and permissions
                    </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors">
                    <UserPlus className="size-4" />
                    Add User
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-body-sm text-gray-600">Total Users</p>
                                <p className="text-display-md font-bold text-gray-900 mt-1">{stats.totalUsers || users.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="size-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-body-sm text-gray-600">Active Users</p>
                                <p className="text-display-md font-bold text-gray-900 mt-1">{users.length}</p>
                            </div>
                            <div className="p-3 bg-success/20 rounded-lg">
                                <Users className="size-6 text-success" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-border">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-body-sm text-gray-600">Admins</p>
                                <p className="text-display-md font-bold text-gray-900 mt-1">1</p>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <Users className="size-6 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card className="bg-white border-border">
                <CardHeader>
                    <CardTitle className="text-heading-md font-bold text-gray-900">
                        All Users
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UsersTable users={users} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
};
