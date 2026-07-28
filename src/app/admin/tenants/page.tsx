"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Store, Mail, Phone, Cloud } from "lucide-react";

type Tenant = {
  id: number;
  first_name: string;
  last_name: string;
  store_name: string;
  email: string;
  phone: string;
  status: string;
  plan: string;
  has_cloud_access: boolean;
  created_at: string;
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await fetch("/api/admin/tenants");
      if (res.ok) {
        const data = await res.json();
        setTenants(data.tenants || []);
      }
    } catch (error) {
      console.error("Failed to fetch tenants", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.store_name.toLowerCase().includes(search.toLowerCase()) || 
    t.first_name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Tenant Management</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none w-64 transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-brand-primary" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Store</th>
                  <th className="p-4 font-semibold">Owner</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Plan</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No tenants found.
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <Store className="text-brand-primary" size={18} />
                          </div>
                          <span className="font-semibold text-gray-800">{tenant.store_name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700">{tenant.first_name} {tenant.last_name && tenant.last_name !== 'Unknown' ? tenant.last_name : ''}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400"/> {tenant.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400"/> {tenant.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700">{tenant.plan}</span>
                          {tenant.has_cloud_access && (
                            <span title="Cloud Access Enabled">
                              <Cloud size={16} className="text-blue-500" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                          tenant.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tenant.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
