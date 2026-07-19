"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-3 md:py-4 mx-4 lg:mx-auto mt-4 max-w-6xl bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl md:rounded-full shadow-sm"
    >
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2 group">
          <img src="/images/Logo.png" alt="Lumio POS Logo" className="h-7 md:h-8 w-auto cursor-pointer group-hover:scale-105 transition-transform" />
          <span className="font-black text-lg md:text-xl tracking-tight text-brand-dark hidden sm:block">LUMIO POS</span>
        </a>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-gray">
        <a href="/#features" className="hover:text-brand-blue transition-colors">Features</a>
        <a href="/#analytics" className="hover:text-brand-blue transition-colors">Analytics</a>
        <a href="/shop" className="hover:text-brand-blue transition-colors">Accessories</a>
        <a href="/#pricing" className="hover:text-brand-blue transition-colors">Pricing</a>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <a 
          href="/download" 
          className="text-brand-dark px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-brand-blue hover:border-blue-200 transition-all duration-300 border border-gray-200"
        >
          Download Software
        </a>
        <a 
          href="/login" 
          className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-blue transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 inline-block"
        >
          Dashboard Login
        </a>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
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
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-100 rounded-2xl shadow-xl flex flex-col gap-4 md:hidden"
          >
            <a href="/#features" onClick={() => setIsOpen(false)} className="px-4 py-2 text-brand-dark font-medium hover:bg-gray-50 rounded-lg">Features</a>
            <a href="/#analytics" onClick={() => setIsOpen(false)} className="px-4 py-2 text-brand-dark font-medium hover:bg-gray-50 rounded-lg">Analytics</a>
            <a href="/shop" onClick={() => setIsOpen(false)} className="px-4 py-2 text-brand-dark font-medium hover:bg-gray-50 rounded-lg">Accessories</a>
            <a href="/#pricing" onClick={() => setIsOpen(false)} className="px-4 py-2 text-brand-dark font-medium hover:bg-gray-50 rounded-lg">Pricing</a>
            <hr className="border-gray-100" />
            <a href="/download" className="px-4 py-2 text-center text-brand-dark font-medium border border-gray-200 rounded-xl hover:bg-blue-50 hover:text-brand-blue hover:border-blue-200 transition-all duration-300">
              Download Software
            </a>
            <a href="/login" className="px-4 py-3 text-center bg-brand-dark text-white font-medium rounded-xl hover:bg-brand-blue shadow-md">
              Dashboard Login
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
