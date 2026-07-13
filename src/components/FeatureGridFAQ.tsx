"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Barcode, WifiOff, Users, ShieldCheck, QrCode, FileText, Settings, Printer, LineChart, Database, Lock, Receipt, Plus, Minus } from "lucide-react";

const minorFeatures = [
  { icon: <Barcode size={24} />, title: "Barcode Generation", desc: "Easily generate and print barcodes for all your products." },
  { icon: <WifiOff size={24} />, title: "Offline Mode", desc: "Keep selling even when your internet connection goes down." },
  { icon: <FileText size={24} />, title: "GRN Management", desc: "Manage stock intake with comprehensive Good Received Notes." },
  { icon: <Users size={24} />, title: "User Permissions", desc: "Create multiple cashier accounts with restricted access levels." },
  { icon: <ShieldCheck size={24} />, title: "Warranty Claiming", desc: "Track product serial numbers and manage warranty periods seamlessly." },
  { icon: <QrCode size={24} />, title: "Lanka QR Integrated", desc: "Print Lanka QR codes directly on your receipts for instant payments." },
  { icon: <Printer size={24} />, title: "Dual Print Modes", desc: "Print thermal receipts for POS or detailed A4 invoices for bulk sales." },
  { icon: <LineChart size={24} />, title: "Profit Reporting", desc: "Instantly view daily, weekly, or monthly profit margins." },
  { icon: <Settings size={24} />, title: "System Control", desc: "Customize shop details, taxes, and settings from a single panel." },
  { icon: <Database size={24} />, title: "Cloud Backups", desc: "Your database is automatically synced to the cloud securely." },
  { icon: <Lock size={24} />, title: "End-of-day Closing", desc: "Securely tally cash and close the day's sales with accurate reports." },
  { icon: <Receipt size={24} />, title: "Flexible Discounts", desc: "Apply item-wise discounts, bill-wise discounts, or promo codes." }
];

const faqs = [
  {
    question: "Do I need an active internet connection to use Lumio POS?",
    answer: "No. Lumio POS is designed to work offline. It will seamlessly sync your data to the cloud in the background as soon as an internet connection is restored."
  },
  {
    question: "Can I use multiple computers in the same shop?",
    answer: "Yes, you can install Lumio POS on a main server PC and connect multiple cashier terminals within the same local WiFi or LAN network."
  },
  {
    question: "What hardware is required?",
    answer: "Lumio POS works on any standard Windows PC or laptop. It supports all standard POS hardware including thermal printers, barcode scanners, and cash drawers."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level encryption for your cloud backups. Your local database is also secured, and role-based permissions ensure your staff only sees what they need to."
  }
];

export default function FeatureGridFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-24 bg-brand-light relative">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Feature Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">Everything you need to run your store</h2>
            <p className="text-brand-gray">Packed with features to streamline your daily operations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {minorFeatures.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-lg flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h4 className="text-xl font-serif font-semibold text-brand-dark mb-2">{feat.title}</h4>
                <p className="text-brand-gray text-sm">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-medium text-lg text-brand-dark">{faq.question}</span>
                  <span className="text-brand-blue ml-4 flex-shrink-0">
                    {openFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-brand-gray border-t border-gray-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
