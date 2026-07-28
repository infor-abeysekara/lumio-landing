"use client";

import { useState, useEffect } from "react";
import { Trash2, Search, Filter, ShieldAlert, Shield, Users, UserCog, User, Eye, EyeOff } from "lucide-react";

type UserData = {
  id: number;
  source: 'user' | 'tenant';
  name: string;
  email: string;
  store_name: string;
  role: string;
  created_at: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [superAdminPassword, setSuperAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    if (filter !== "ALL") {
      result = result.filter(u => u.role === filter);
    }
    if (search) {
      result = result.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.store_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredUsers(result);
  }, [users, filter, search]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { cache: 'no-store' });
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (user: UserData) => {
    setUserToDelete(user);
    setSuperAdminPassword("");
    setDeleteError("");
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    if (!superAdminPassword) {
      setDeleteError("Password is required.");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: userToDelete.id,
          source: userToDelete.source,
          superAdminPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete user.");
      } else {
        setDeleteModalOpen(false);
        setSearch(""); 
        setFilter("ALL");
        fetchUsers(); // Refresh list
      }
    } catch (err) {
      setDeleteError("Network error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'SUPER_ADMIN': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-max"><Shield size={14}/> Admin</span>;
      case 'ASSISTANT': return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1 w-max"><UserCog size={14}/> Assistant</span>;
      case 'CLIENT': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-max"><User size={14}/> Client</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold w-max">{role}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-brand-dark font-bold">User Management</h1>
          <p className="text-gray-500 mt-1">Manage Admins, Assistants, and Clients centrally.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['ALL', 'SUPER_ADMIN', 'ASSISTANT', 'CLIENT'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {f === 'SUPER_ADMIN' ? 'Admins' : f === 'ASSISTANT' ? 'Assistants' : f === 'CLIENT' ? 'Clients' : 'All'}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-6 font-medium">Name</th>
                <th className="p-6 font-medium">Contact / Store</th>
                <th className="p-6 font-medium">Role</th>
                <th className="p-6 font-medium">Joined</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={`${user.source}-${user.id}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{user.source} ID: {user.id}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm text-gray-600">{user.email !== 'N/A' ? user.email : '-'}</div>
                      <div className="text-xs font-medium text-brand-blue mt-1">{user.store_name !== 'N/A' ? user.store_name : ''}</div>
                    </td>
                    <td className="p-6">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-6 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => openDeleteModal(user)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-2xl font-serif text-center font-bold text-gray-900 mb-2">Delete {userToDelete?.name}?</h3>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              This action is <span className="font-bold text-red-500">permanent</span> and cannot be undone. 
              To confirm deletion, please enter your Super Admin password.
            </p>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={superAdminPassword}
                  onChange={e => setSuperAdminPassword(e.target.value)}
                  className="w-full border-2 border-gray-100 p-3 pr-10 rounded-xl outline-none focus:border-red-400 transition-colors"
                  placeholder="••••••••"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {deleteError && <p className="text-red-500 text-sm font-medium mt-2 text-center">{deleteError}</p>}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
