"use client";

import { useState } from "react";
import { Loader2, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RequestQuote() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    client_name: "",
    client_attention: "",
    client_phone: "",
    client_email: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // We send a draft quotation request
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: [{ name: "Lumio POS System Quotation Request", description: "Awaiting admin assignment", price: 0, qty: 1 }],
          subtotal: 0,
          vat: 0,
          total: 0
        })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          setFormData({ client_name: "", client_attention: "", client_phone: "", client_email: "" });
        }, 3000);
      }
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-24 z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-dark hover:bg-gray-800 text-white px-6 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 transition-transform hover:scale-105"
        >
          <FileText size={24} /> Get a Custom Quote
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => !loading && !success && setIsOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10"
            >
              {success ? (
                <div className="text-center py-8">
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Request Sent!</h3>
                  <p className="text-gray-500">Our team will generate your custom quote and email it to you shortly.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Request a Quote</h3>
                  <p className="text-gray-500 mb-6 text-sm">Need a full computer setup or specialized hardware? Let us build a custom quotation for your business.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Business/Company Name *</label>
                      <input required value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} type="text" className="w-full border p-3 rounded-xl outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Your Name (Attention To) *</label>
                      <input required value={formData.client_attention} onChange={e => setFormData({...formData, client_attention: e.target.value})} type="text" className="w-full border p-3 rounded-xl outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Phone Number *</label>
                      <input required value={formData.client_phone} onChange={e => setFormData({...formData, client_phone: e.target.value})} type="text" className="w-full border p-3 rounded-xl outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Email Address *</label>
                      <input required value={formData.client_email} onChange={e => setFormData({...formData, client_email: e.target.value})} type="email" className="w-full border p-3 rounded-xl outline-none focus:border-brand-blue" />
                    </div>
                    <div className="pt-2 flex gap-4">
                      <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                      <button disabled={loading} type="submit" className="flex-[2] bg-brand-blue text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Request"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
