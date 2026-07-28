"use client";

import { motion, Variants } from "framer-motion";
import { Download, Monitor, Server, HardDrive, Cpu, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#fafcff] flex flex-col font-sans relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tight"
            >
              Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-600">Lumio POS</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-gray-600 font-medium"
            >
              Get started with the smartest Point of Sale system. Choose the right setup for your business needs.
            </motion.p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24"
          >
            {/* Server Setup Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-8 shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col relative overflow-hidden group hover:border-brand-blue/30 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-blue-400" />
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center transition-transform duration-300"
                >
                  <Server size={32} />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-dark">Server Setup</h3>
                  <p className="text-brand-blue font-semibold">For Main PC / Single PC</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8 flex-1 leading-relaxed">
                This is the complete package for your main billing computer. It includes the Lumio POS software along with the WAMP Server which powers the local database.
              </p>

              <div className="bg-blue-50/50 rounded-xl p-5 mb-8 border border-blue-100/50 group-hover:bg-blue-50 transition-colors">
                <div className="flex gap-4">
                  <ShieldCheck className="text-brand-blue shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm font-bold text-brand-dark">Includes WAMP Server</p>
                    <p className="text-sm text-gray-500 mt-1">Automatically installs and configures the Apache and MySQL environment required to run the local database securely.</p>
                  </div>
                </div>
              </div>

              <motion.a 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="/downloads/LumioPOS_Server_Setup.exe"
                download
                className="w-full py-4 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(37,99,235,0.25)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.4)] transition-all duration-300"
              >
                <Download size={20} className="animate-bounce" />
                Download Server Setup
              </motion.a>
            </motion.div>

            {/* Client Setup Card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col relative overflow-hidden group hover:border-gray-300 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-600 to-gray-400" />
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-700 flex items-center justify-center transition-transform duration-300"
                >
                  <Monitor size={32} />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-dark">Client Setup</h3>
                  <p className="text-gray-600 font-semibold">For Secondary PCs</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8 flex-1 leading-relaxed">
                Use this lightweight installer for additional computers on your network (like a second billing counter or back-office PC). It connects to your Main PC's database.
              </p>

              <div className="bg-gray-50/80 rounded-xl p-5 mb-8 border border-gray-100 group-hover:bg-gray-100 transition-colors">
                <div className="flex gap-4">
                  <ShieldCheck className="text-gray-500 shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-sm font-bold text-brand-dark">No Database Included</p>
                    <p className="text-sm text-gray-500 mt-1">This setup only contains the POS interface. You must connect it to the IP address of your Server PC during login.</p>
                  </div>
                </div>
              </div>

              <motion.a 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="/downloads/LumioPOS_Client_Setup.exe"
                download
                className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(31,41,55,0.2)] hover:shadow-[0_8px_30px_rgb(31,41,55,0.35)] transition-all duration-300"
              >
                <Download size={20} className="animate-bounce" style={{ animationDuration: '2s' }} />
                Download Client Setup
              </motion.a>
            </motion.div>
          </motion.div>

          {/* System Requirements */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-10 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
            
            <h3 className="text-3xl font-bold text-brand-dark mb-10 text-center tracking-tight">System Requirements</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div whileHover={{ scale: 1.05 }} className="text-center p-4">
                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-brand-blue shadow-sm">
                  <Monitor size={28} />
                </div>
                <p className="font-bold text-brand-dark text-lg mb-1">OS</p>
                <p className="text-sm text-gray-500 font-medium">Windows 10 or 11<br/>(64-bit)</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center p-4">
                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-brand-blue shadow-sm">
                  <Cpu size={28} />
                </div>
                <p className="font-bold text-brand-dark text-lg mb-1">Processor</p>
                <p className="text-sm text-gray-500 font-medium">Intel Core i3 / AMD<br/>Ryzen 3 or better</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center p-4">
                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-brand-blue shadow-sm">
                  <HardDrive size={28} />
                </div>
                <p className="font-bold text-brand-dark text-lg mb-1">Memory</p>
                <p className="text-sm text-gray-500 font-medium">4GB RAM Min<br/>(8GB Rec.)</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="text-center p-4">
                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-brand-blue shadow-sm">
                  <Server size={28} />
                </div>
                <p className="font-bold text-brand-dark text-lg mb-1">Storage</p>
                <p className="text-sm text-gray-500 font-medium">500MB Free Space</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
