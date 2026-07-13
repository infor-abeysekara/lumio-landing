"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glow-orb"></div>
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 glow-orb" style={{ background: "radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, rgba(255, 255, 255, 0) 70%)" }}></div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-brand-blue font-semibold uppercase tracking-wider text-sm mb-4"
        >
          #1 Point of Sale System
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl font-serif text-brand-dark mb-6 leading-tight"
        >
          Run On Facts,<br />Not Guesswork.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-brand-gray max-w-2xl mx-auto mb-10"
        >
          Make smarter decisions with real-time analytics, lightning-fast checkouts, and complete control over your retail business.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-20"
        >
          <a href="#demo" className="bg-brand-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1">
            Get Started
          </a>
          <a href="#features" className="text-brand-dark px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all">
            See Features
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="relative mx-auto p-3 md:p-5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_0_100px_rgba(96,165,250,0.4)] max-w-5xl"
        >
          <div className="bg-white border border-gray-100 shadow-sm">
            <img 
              src="/images/Dashboard.png" 
              alt="Lumio POS Dashboard" 
              className="w-full h-auto block rounded-none"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/1200x800/e2e8f0/64748b?text=Dashboard+Screenshot";
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
