import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { Store, Users, DollarSign, Activity } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getSession();

  if (session?.role !== 'SUPER_ADMIN') {
    // If assistant, redirect to accessories
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400">Welcome, {session?.username}!</h2>
          <p className="text-gray-500 mt-2">Please use the sidebar to navigate to Accessories or Quotations.</p>
        </div>
      </div>
    );
  }

  // Fetch Stats for Super Admin
  const tenantsRes = await query("SELECT count(*) FROM tenants");
  const usersRes = await query("SELECT count(*) FROM users");
  const pendingAccRes = await query("SELECT count(*) FROM accessories WHERE is_approved = false");
  
  const totalStores = parseInt(tenantsRes.rows[0].count);
  const totalUsers = parseInt(usersRes.rows[0].count);
  const pendingAccessories = parseInt(pendingAccRes.rows[0].count);

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Active Stores</p>
              <h3 className="text-3xl font-bold text-brand-dark mt-1">{totalStores}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-brand-blue">
              <Store size={24} />
            </div>
          </div>
          <p className="text-sm text-green-500 font-medium">+0 this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-3xl font-bold text-brand-dark mt-1">Rs. 0</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-sm text-green-500 font-medium">+Rs. 0 this month</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Accessories</p>
              <h3 className="text-3xl font-bold text-brand-dark mt-1">{pendingAccessories}</h3>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl text-orange-500">
              <PackageSearchIcon />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Require approval</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">System Status</p>
              <h3 className="text-xl font-bold text-brand-dark mt-2">All Systems Operational</h3>
            </div>
            <div className="bg-brand-blue/10 p-3 rounded-xl text-brand-blue">
              <Activity size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="text-lg font-bold text-brand-dark mb-4">Recent Stores</h3>
          <div className="text-center py-8 text-gray-500">
            No stores registered yet.
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h3 className="text-lg font-bold text-brand-dark mb-4">Recent Payments</h3>
          <div className="text-center py-8 text-gray-500">
            No payments recorded yet.
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline icon for package
function PackageSearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="M16.5 9.4 7.55 4.24"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/><circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/></svg>
  );
}
