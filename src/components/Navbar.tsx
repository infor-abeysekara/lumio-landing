"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 mx-auto mt-4 max-w-6xl bg-white/70 backdrop-blur-md border border-gray-100 rounded-full shadow-sm"
    >
      <div className="flex items-center gap-3">
        <img src="/images/Logo.png" alt="Lumio POS Logo" className="h-8 w-auto" />
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-gray">
        <a href="#features" className="hover:text-brand-blue transition-colors">Features</a>
        <a href="#analytics" className="hover:text-brand-blue transition-colors">Analytics</a>
        <a href="#pricing" className="hover:text-brand-blue transition-colors">Pricing</a>
      </div>

      <div className="flex items-center gap-3">
        <a 
          href="/download" 
          className="text-brand-dark px-4 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-300 hidden sm:inline-block border border-gray-200"
        >
          Download Software
        </a>
        <a 
          href="http://localhost/Lumio POS Publish/login.php" 
          className="bg-brand-dark text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-blue transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 inline-block"
        >
          Dashboard Login
        </a>
      </div>
    </motion.nav>
  );
}
