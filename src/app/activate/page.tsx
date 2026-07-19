"use client";

import { motion } from "framer-motion";
import { CheckCircle, ShieldCheck, Zap, Server } from "lucide-react";
import Link from "next/link";

export default function ActivateCloud() {
  const benefits = [
    { title: "Real-time Sync", desc: "Your shop data is synced instantly across devices", icon: Zap },
    { title: "Remote Access", desc: "Manage your business from anywhere in the world", icon: Server },
    { title: "Advanced Security", desc: "Bank-level encryption and daily automated backups", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        <div className="md:w-1/2 p-8 md:p-12 bg-brand-dark text-white flex flex-col justify-center">
          <Link href="/">
            <img src="/images/Logo.png" alt="Lumio POS" className="h-10 mb-8 filter brightness-0 invert" />
          </Link>
          <h1 className="text-3xl font-black tracking-tight mb-4">Unlock Cloud Features</h1>
          <p className="text-gray-400 mb-8">Activate your cloud database to unlock the full potential of Lumio POS.</p>
          
          <div className="space-y-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4">
                <div className="p-2 bg-white/10 rounded-xl h-fit">
                  <b.icon size={20} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-bold">{b.title}</h3>
                  <p className="text-sm text-gray-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-dark">Annual Service Charge</h2>
            <p className="text-gray-500 mt-2">Activate your dashboard instantly.</p>
          </div>

          <div className="bg-gray-50 border-2 border-brand-blue/20 rounded-2xl p-6 text-center mb-8 relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              POPULAR
            </div>
            <span className="text-4xl font-black text-brand-dark">Rs. 6,000</span>
            <span className="text-gray-500 font-medium"> / year</span>
            
            <ul className="mt-6 text-left space-y-3">
              {['1 Year Cloud Database Hosting', 'Premium Support via WhatsApp', 'Free Software Updates', 'Mobile App Access'].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <CheckCircle size={18} className="text-green-500" /> {feature}
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 mb-4">
            Pay via PayHere
          </button>
          
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
            Upload Bank Slip
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-6 mt-auto">
            By proceeding, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
