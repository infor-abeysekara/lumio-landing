"use client";

import { useState, useEffect } from "react";
import { Check, X, Eye, Loader2, Zap } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ActivationsManager() {
  const [activations, setActivations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

  useEffect(() => {
    fetchActivations();
  }, [filter]);

  const fetchActivations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/activations?filter=${filter}`);
      const data = await res.json();
      if (res.ok) {
        setActivations(data.activations || []);
      } else {
        toast.error(data.error || "Failed to fetch activations");
      }
    } catch (error) {
      toast.error("Error fetching activations");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (tenantId: string, action: "APPROVE" | "REJECT") => {
    if (!confirm(`Are you sure you want to ${action} this activation?`)) return;

    try {
      const res = await fetch(`/api/admin/activations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: tenantId, action })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(`Activation ${action === 'APPROVE' ? 'Approved' : 'Rejected'}!`);
        fetchActivations(); // Refresh list
      } else {
        toast.error(data.error || "Failed to perform action");
      }
    } catch (error) {
      toast.error("Error updating activation status");
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
          <Zap className="text-brand-primary" />
          Activations
        </h1>
        
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : activations.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No {filter.toLowerCase()} activations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100 text-left">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Bank Slip</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activations.map(act => (
                  <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{act.first_name} {act.last_name}</div>
                      <div className="text-xs text-gray-500">{act.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{act.store_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        act.activation_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        act.activation_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {act.activation_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {act.bank_slip_url && (
                        <button 
                          onClick={() => setSelectedSlip(act.bank_slip_url)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-brand-primary rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={16} /> View Slip
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {act.activation_status === 'PENDING' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(act.id, "APPROVE")}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Approve & Activate"
                          >
                            <Check size={20} />
                          </button>
                          <button 
                            onClick={() => handleAction(act.id, "REJECT")}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Reject"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slip Modal */}
      <AnimatePresence>
        {selectedSlip && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm"
            onClick={() => setSelectedSlip(null)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white p-2 rounded-2xl max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4">
                <h3 className="font-bold text-gray-800">Bank Slip Image</h3>
                <button onClick={() => setSelectedSlip(null)} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-auto p-2 bg-gray-50 rounded-xl">
                <img src={selectedSlip} alt="Bank Slip" className="max-w-full h-auto object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
