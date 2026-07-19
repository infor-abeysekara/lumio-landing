"use client";

import { useState, useEffect } from "react";
import { Star, Edit2, Trash2, Plus } from "lucide-react";

import ConfirmModal from "@/components/ui/ConfirmModal";

interface Feedback {
  id: number;
  rating: number;
  feedback_text: string;
  status: string;
  created_at: string;
}

export default function DashboardFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [editId, setEditId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

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
      const res = await fetch("/api/dashboard/feedbacks");
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

  const openAddModal = () => {
    setEditId(null);
    setRating(5);
    setFeedbackText("");
    setShowModal(true);
  };

  const openEditModal = (fb: Feedback) => {
    setEditId(fb.id);
    setRating(fb.rating);
    setFeedbackText(fb.feedback_text);
    setShowModal(true);
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
          await fetch("/api/dashboard/feedbacks", {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetch("/api/dashboard/feedbacks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, rating, feedback_text: feedbackText }),
        });
      } else {
        await fetch("/api/dashboard/feedbacks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, feedback_text: feedbackText }),
        });
      }
      setShowModal(false);
      fetchFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Feedbacks</h1>
          <p className="text-gray-500 mt-1">Manage your reviews for Lumio POS</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-brand-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Add Feedback
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading feedbacks...</div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue">
            <Star size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Feedbacks Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't submitted any feedback yet. We value your opinion, please leave a review!</p>
          <button onClick={openAddModal} className="text-brand-blue font-medium hover:underline">
            Submit your first review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden">
              {/* Status Badge */}
              <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold ${
                fb.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                fb.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {fb.status}
              </div>

              <div className="flex items-center gap-1 mb-4 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < fb.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                  />
                ))}
              </div>

              <p className="text-gray-600 flex-1 italic mb-6">"{fb.feedback_text}"</p>

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
                <button onClick={() => openEditModal(fb)} className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(fb.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editId ? "Edit Feedback" : "Add Feedback"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star 
                        size={28} 
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue resize-none"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your experience..."
                ></textarea>
                {editId && <p className="text-xs text-orange-600 mt-2">Note: Editing an approved feedback will return it to pending status for review.</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-brand-blue text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
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
