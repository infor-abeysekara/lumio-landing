import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { query } from '@/lib/db';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lumio_super_secret_key_2026_xyz'
);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('lumio_session')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const userId = verified.payload.id;

    // Fetch tenant's cloud access status
    const tenantResult = await query('SELECT has_cloud_access FROM tenants WHERE id = $1', [userId]);
    
    if (tenantResult.rows.length === 0) {
      // Not a valid tenant
      redirect('/login');
    }

    const hasCloudAccess = tenantResult.rows[0].has_cloud_access;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Simple Dashboard Navbar */}
        <nav className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <img src="/images/Logo.png" alt="Lumio POS" className="h-8" />
            <span className="font-bold text-gray-400 text-sm border-l pl-4 border-gray-200">Cloud Dashboard</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors">Dashboard</Link>
            <Link href="/dashboard/feedbacks" className="text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors">My Feedbacks</Link>
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-brand-dark transition-colors">Home</Link>
            <LogoutButton />
          </div>
        </nav>

        {!hasCloudAccess ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full p-8 text-center rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-2">Access Denied</h1>
              <p className="text-gray-500 mb-8">
                You do not have Cloud Database access enabled on your account. Your current license does not include the Cloud Dashboard feature.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-2xl border mb-8 text-left">
                <h3 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wider">Activate Cloud Dashboard</h3>
                <p className="text-sm text-gray-600 mb-4">Pay the annual service charge to enable cloud syncing, analytics, and remote shop management.</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-brand-blue">Rs. 6,000<span className="text-sm font-medium text-gray-400">/yr</span></span>
                </div>
              </div>

              <Link 
                href="/activate"
                className="w-full inline-block bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Pay Service Charge & Activate
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8">
            {children}
          </div>
        )}
      </div>
    );
  } catch (error) {
    redirect('/login');
  }
}
