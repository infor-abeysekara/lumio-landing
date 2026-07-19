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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar role={session.role} username={session.username} />
      <div className="flex-1 p-8 ml-64 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
