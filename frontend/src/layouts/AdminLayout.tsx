import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/features/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/features/admin/layout/AdminHeader';

import { useState } from 'react';

export const AdminLayout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-brand-primary/20">
            <AdminSidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            <main className="lg:pl-[260px] transition-all duration-300 ease-in-out min-h-screen flex flex-col">
                <AdminHeader onOpenSidebar={() => setIsMobileSidebarOpen(true)} />

                <div className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
