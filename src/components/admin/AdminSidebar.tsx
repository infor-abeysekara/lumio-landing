"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  PackageSearch, 
  FileText,
  CreditCard,
  LogOut,
  Radio,
  List,
  Star
} from "lucide-react";

export default function AdminSidebar({ role, username }: { role: string; username: string }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.replace('/');
  };

  const navItems = role === 'SUPER_ADMIN' ? [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Tenants", href: "/admin/tenants", icon: Users },
    { name: "Accessories", href: "/admin/accessories", icon: PackageSearch },
    { name: "Categories", href: "/admin/categories", icon: List },
    { name: "Quotations", href: "/admin/quotations", icon: FileText },
    { name: "Feedbacks", href: "/admin/feedbacks", icon: Star },
    { name: "Billing & Software", href: "/admin/billing", icon: CreditCard },
    { name: "Assistants", href: "/admin/assistants", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Broadcast", href: "/admin/broadcast", icon: Radio },
  ] : [
    // Assistant specific view
    { name: "Accessories", href: "/admin/accessories", icon: PackageSearch },
    { name: "Quotations", href: "/admin/quotations", icon: FileText },
    { name: "Feedbacks", href: "/admin/feedbacks", icon: Star },
  ];

  return (
    <div className="w-64 bg-brand-dark text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-serif font-bold tracking-wider">LUMIO<span className="text-brand-blue">POS</span></h2>
        <div className="mt-2 text-xs text-gray-400">
          Logged in as: <span className="text-white font-bold">{username}</span> 
          <br/>
          <span className="text-[10px] uppercase text-brand-blue">{role.replace('_', ' ')}</span>
        </div>
      </div>
      
      <nav className="flex-1 min-h-0 px-4 mt-8 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === item.href 
                ? 'bg-brand-blue text-white font-bold shadow-lg shadow-brand-blue/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
