"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Receipt, ArrowRight, Download } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function PurchaseHistory() {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/account/purchases")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setPurchases(data.purchases);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <Navbar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Purchase History</h1>
            <p className="text-gray-500 mt-1">View your past subscriptions and payments.</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-2xl">
            <Receipt className="text-brand-blue" size={28} />
          </div>
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Receipt className="text-gray-300 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-700">No purchases found</h3>
            <p className="text-gray-500 mt-2 text-sm">You haven't made any payments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 font-bold text-gray-500 text-sm">Date</th>
                  <th className="py-4 px-4 font-bold text-gray-500 text-sm">Description</th>
                  <th className="py-4 px-4 font-bold text-gray-500 text-sm">Amount</th>
                  <th className="py-4 px-4 font-bold text-gray-500 text-sm">Status</th>
                  <th className="py-4 px-4 font-bold text-gray-500 text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-brand-dark">
                      {new Date(p.payment_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {p.description || "Cloud Dashboard Subscription"}
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-brand-dark">
                      Rs. {Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-brand-blue hover:text-blue-700 transition-colors inline-flex items-center gap-1 text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-lg">
                        <Download size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
