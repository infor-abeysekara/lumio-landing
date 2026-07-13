"use client";

import { motion } from "framer-motion";
import { Calculator, Zap, Cloud, LineChart } from "lucide-react";

export default function BentoFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="features" className="py-24 bg-brand-light relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-brand-dark mb-4"
          >
            Built for Speed & Accuracy
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-brand-gray"
          >
            We only included what you actually need. No clutter, just pure performance.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Large Feature - Full Width */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col group hover:border-brand-blue/30 transition-colors"
          >
            <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-brand-dark group-hover:opacity-10 transition-opacity">
              <Calculator size={300} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 mb-10 text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Zap size={24} />
              </div>
              <h3 className="text-3xl font-serif font-semibold text-brand-dark mb-4">Lightning Fast Cashier Register</h3>
              <p className="text-brand-gray text-lg">Process credit sales, scan barcodes instantly, and generate thermal or A4 receipts without breaking a sweat. Built for high-traffic environments.</p>
            </div>
            
            <div className="mt-auto relative z-10 mx-auto w-full max-w-4xl p-2 md:p-4 rounded-t-xl md:rounded-t-2xl bg-gray-50 border border-gray-200 border-b-0 shadow-xl group-hover:-translate-y-2 transition-transform duration-500 -mb-8 md:-mb-12">
              <div className="bg-white border border-gray-200 shadow-sm border-b-0">
                <img 
                  src="/images/pos panel.png" 
                  alt="POS Interface" 
                  className="w-full h-auto object-cover object-top block rounded-none"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/1000x500/e2e8f0/64748b?text=POS+Panel"; }}
                />
              </div>
            </div>
          </motion.div>

          {/* Medium Feature 1 - 50% Width */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:border-brand-blue/30 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
              <LineChart size={24} />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-brand-dark mb-3">Quick & Smart Control</h3>
            <p className="text-brand-gray text-base mb-10">Total system control at your fingertips. Manage permissions and adapt quickly.</p>
            
            <div className="mt-auto -mx-6 md:-mx-8 -mb-8 md:-mb-10 p-2 md:p-3 rounded-t-xl bg-gray-50 border border-gray-200 border-b-0 shadow-lg group-hover:-translate-y-2 transition-transform duration-500">
              <div className="bg-white border border-gray-200 shadow-sm border-b-0">
                <img 
                  src="/images/Systeme contrall panel.png" 
                  alt="Control Panel" 
                  className="w-full h-auto block rounded-none"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=System+Control"; }}
                />
              </div>
            </div>
          </motion.div>

          {/* Medium Feature 2 - 50% Width */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col group hover:border-brand-blue/30 transition-colors bg-gradient-to-br from-white to-blue-50/50 overflow-hidden relative"
          >
            <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
              <Cloud size={24} />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-brand-dark mb-3">Cloud Synchronization</h3>
            <p className="text-brand-gray text-base max-w-sm relative z-10">Your local data is automatically synced and backed up to our secure cloud servers seamlessly in the background.</p>

            {/* Cloud Animation Graphic */}
            <div className="mt-12 flex-1 flex items-center justify-center relative min-h-[160px]">
              {/* Central Database/Server Icon */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-blue-100 flex items-center justify-center relative z-20"
              >
                <Cloud size={40} className="text-brand-blue" />
              </motion.div>

              {/* Syncing Nodes */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-48 h-48 border border-dashed border-blue-200 rounded-full relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-brand-blue rounded-full shadow-md shadow-blue-500/50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-brand-blue-light rounded-full shadow-md shadow-blue-500/30 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </motion.div>

              {/* Pulsing rings */}
              <motion.div
                animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-20 h-20 bg-brand-blue/20 rounded-2xl z-10"
              ></motion.div>
            </div>
          </motion.div>

          {/* Wide Feature - Full Width */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between group hover:border-brand-blue/30 transition-colors"
          >
            <div className="md:w-5/12 mb-8 md:mb-0 md:pr-10">
              <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center mb-6">
                <LineChart size={24} />
              </div>
              <h3 className="text-3xl font-serif font-semibold text-brand-dark mb-4">Expense Tracking & Analytics</h3>
              <p className="text-brand-gray text-lg">Know exactly where your money goes. Track daily expenses and view detailed sales reports to understand your true profit margins.</p>
            </div>
            <div className="md:w-7/12 w-full p-2 md:p-4 rounded-l-xl md:rounded-l-2xl rounded-r-none bg-gray-50 border border-gray-200 border-r-0 shadow-xl group-hover:-translate-x-2 transition-transform duration-500 -mr-8 -mb-8 md:-mr-12 md:-mb-12 md:-my-12">
              <div className="bg-white border border-gray-200 shadow-sm border-r-0">
                <img 
                  src="/images/Salse anelize.png" 
                  alt="Analytics" 
                  className="w-full h-auto object-cover object-left-top block rounded-none"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/1000x500/e2e8f0/64748b?text=Analytics"; }}
                />
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
