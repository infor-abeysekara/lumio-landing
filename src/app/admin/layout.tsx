import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
      <AdminSidebar role={session.role} username={session.username} />
      <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0 md:ml-64 overflow-y-auto w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
