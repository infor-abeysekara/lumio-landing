"use client";

import { useState } from "react";
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
  Star,
  Zap,
  Menu,
  X
} from "lucide-react";

export default function AdminSidebar({ role, username }: { role: string; username: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.replace('/');
  };

  const navItems = role === 'SUPER_ADMIN' ? [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Tenants", href: "/admin/tenants", icon: Users },
    { name: "Activations", href: "/admin/activations", icon: Zap },
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
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-brand-dark flex items-center justify-between px-4 z-[50] shadow-md">
         <img src="/images/Logo.png" alt="Lumio POS Logo" className="h-6 w-auto" />
         <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
           {isOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-[40]" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-brand-dark text-white h-screen fixed left-0 top-0 flex flex-col z-[45] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 hidden md:block">
          <img src="/images/Logo.png" alt="Lumio POS Logo" className="h-8 w-auto mb-2" />
          <div className="mt-4 text-xs text-gray-400">
            Logged in as: <span className="text-white font-bold">{username}</span> 
            <br/>
            <span className="text-[10px] uppercase text-brand-blue">{role.replace('_', ' ')}</span>
          </div>
        </div>
        
        {/* Mobile user info */}
        <div className="p-6 md:hidden mt-12 border-b border-white/10">
          <div className="text-xs text-gray-400">
            Logged in as: <span className="text-white font-bold">{username}</span> 
            <br/>
            <span className="text-[10px] uppercase text-brand-blue">{role.replace('_', ' ')}</span>
          </div>
        </div>
        
        <nav className="flex-1 min-h-0 px-4 mt-8 md:mt-8 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 pb-20">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsOpen(false)}
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

        <div className="p-4 mt-auto border-t border-white/10 bg-brand-dark">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
