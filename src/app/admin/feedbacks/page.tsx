"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";

import ConfirmModal from "@/components/ui/ConfirmModal";

interface Feedback {
  id: number;
  reviewer_name: string;
  shop_name: string;
  rating: number;
  feedback_text: string;
  status: string;
  image_url?: string;
  created_at: string;
}

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false, title: "", message: "", variant: 'danger', onConfirm: () => {}
  });

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/feedbacks");
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/admin/feedbacks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Feedback",
      message: "Are you sure you want to delete this feedback?",
      variant: 'danger',
      onConfirm: async () => {
        closeConfirm();
        try {
          await fetch("/api/admin/feedbacks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          fetchFeedbacks();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Client Feedbacks</h1>

      {loading ? (
        <div className="text-gray-500">Loading feedbacks...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Reviewer / Shop</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Rating</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Feedback</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No feedbacks found.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {fb.image_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                          <img src={fb.image_url} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs flex-shrink-0">
                          {fb.shop_name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900">{fb.reviewer_name}</div>
                        <div className="text-sm text-gray-500">{fb.shop_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < fb.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2" title={fb.feedback_text}>
                        {fb.feedback_text}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        fb.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        fb.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {fb.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {fb.status !== 'APPROVED' && (
                          <button 
                            onClick={() => updateStatus(fb.id, 'APPROVED')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {fb.status !== 'REJECTED' && (
                          <button 
                            onClick={() => updateStatus(fb.id, 'REJECTED')}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(fb.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
        onCancel={closeConfirm}
        confirmText="Yes, Delete"
      />
    </div>
  );
}
