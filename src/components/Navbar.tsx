"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, UserCircle, LogOut, Settings, History, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-3 md:py-4 mx-4 lg:mx-auto mt-4 max-w-6xl bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl md:rounded-full shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/images/Logo.png" alt="Lumio POS Logo" className="h-7 md:h-8 w-auto cursor-pointer group-hover:scale-105 transition-transform" />
          <span className="font-black text-lg md:text-xl tracking-tight text-brand-dark hidden sm:block">LUMIO POS</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-gray">
        <Link href="/#features" className="hover:text-brand-blue transition-colors">Features</Link>
        <Link href="/#analytics" className="hover:text-brand-blue transition-colors">Analytics</Link>
        <Link href="/#pricing" className="hover:text-brand-blue transition-colors">Pricing</Link>
        <Link href="/shop" className="hover:text-brand-blue transition-colors">Accessories</Link>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <Link 
          href="/download" 
          className="text-brand-dark px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-brand-blue hover:border-blue-200 transition-all duration-300 border border-gray-200"
        >
          Download Software
        </Link>
        
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 pl-2 pr-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              {user.profile_photo ? (
                <img src={user.profile_photo} alt={user.first_name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <UserCircle size={32} className="text-gray-400" />
              )}
              <span className="text-sm font-bold text-brand-dark hidden sm:block">{user.first_name || user.username}</span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 flex flex-col"
                >
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold text-brand-dark truncate">{user.shop_name || "My Business"}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email || user.role}</p>
                  </div>
                  
                  <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-brand-blue flex items-center gap-3 transition-colors">
                    <LayoutDashboard size={16} /> My Dashboard
                  </Link>
                  <Link href="/account/settings" onClick={() => setProfileOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-brand-blue flex items-center gap-3 transition-colors">
                    <Settings size={16} /> Account Settings
                  </Link>
                  <Link href="/account/purchases" onClick={() => setProfileOpen(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-brand-blue flex items-center gap-3 transition-colors">
                    <History size={16} /> Purchase History
                  </Link>
                  
                  <div className="h-px bg-gray-100 my-1 mx-2" />
                  
                  <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors text-left w-full">
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-blue transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 inline-block"
          >
            Dashboard Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center gap-3">
        {user && (
          <Link href="/dashboard" className="text-brand-dark">
            {user.profile_photo ? (
              <img src={user.profile_photo} alt={user.first_name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <UserCircle size={32} className="text-brand-blue" />
            )}
          </Link>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="text-brand-dark p-2 focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-xl flex flex-col gap-2 md:hidden max-h-[80vh] overflow-y-auto"
          >
            {user && (
              <div className="p-3 bg-gray-50 rounded-xl mb-2 border border-gray-100">
                <p className="font-bold text-brand-dark">{user.first_name || user.username}</p>
                <p className="text-xs text-gray-500">{user.email || user.role}</p>
              </div>
            )}
          
            <Link href="/#features" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-brand-dark font-medium hover:bg-gray-50 rounded-xl">Features</Link>
            <Link href="/#analytics" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-brand-dark font-medium hover:bg-gray-50 rounded-xl">Analytics</Link>
            <Link href="/#pricing" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-brand-dark font-medium hover:bg-gray-50 rounded-xl">Pricing</Link>
            <Link href="/shop" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-brand-dark font-medium hover:bg-gray-50 rounded-xl">Accessories</Link>
            
            <div className="h-px bg-gray-100 my-2" />
            
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-brand-dark font-medium hover:bg-blue-50 hover:text-brand-blue rounded-xl flex items-center gap-3">
                  <LayoutDashboard size={18} /> My Dashboard
                </Link>
                <Link href="/account/settings" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-brand-dark font-medium hover:bg-blue-50 hover:text-brand-blue rounded-xl flex items-center gap-3">
                  <Settings size={18} /> Account Settings
                </Link>
                <Link href="/account/purchases" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-brand-dark font-medium hover:bg-blue-50 hover:text-brand-blue rounded-xl flex items-center gap-3">
                  <History size={18} /> Purchase History
                </Link>
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="px-4 py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-xl flex items-center gap-3 text-left">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/download" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-center text-brand-dark font-medium border border-gray-200 rounded-xl hover:bg-blue-50 hover:text-brand-blue transition-all">
                  Download Software
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-center bg-brand-dark text-white font-medium rounded-xl hover:bg-brand-blue shadow-md mt-2">
                  Dashboard Login
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
