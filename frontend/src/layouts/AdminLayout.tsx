import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';

export const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-brand-primary/20">
            <AdminSidebar />

            <main className="pl-[72px] lg:pl-[260px] transition-all duration-300 ease-in-out min-h-screen flex flex-col">
                <AdminHeader />

                <div className="flex-1 p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
