"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function PublicFeedbackPage() {
  const [formData, setFormData] = useState({
    reviewer_name: "",
    shop_name: "",
    rating: 5,
    feedback_text: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const submitData = new FormData();
    submitData.append('reviewer_name', formData.reviewer_name);
    submitData.append('shop_name', formData.shop_name);
    submitData.append('rating', formData.rating.toString());
    submitData.append('feedback_text', formData.feedback_text);
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        body: submitData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: "Thank you! Your feedback has been submitted successfully." });
        setFormData({ reviewer_name: "", shop_name: "", rating: 5, feedback_text: "" });
        setImageFile(null);
        setImagePreview(null);
      } else {
        setMessage({ type: 'error', text: data.error || "Failed to submit feedback." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An error occurred while submitting." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
        <div className="text-center mb-10">
          <img src="/images/Logo.png" alt="Lumio POS Logo" className="h-10 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">Leave a Review</h1>
          <p className="text-brand-gray text-lg">We'd love to hear about your experience with Lumio POS.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-8 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                value={formData.reviewer_name}
                onChange={(e) => setFormData({...formData, reviewer_name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
                value={formData.shop_name}
                onChange={(e) => setFormData({...formData, shop_name: e.target.value})}
                placeholder="Doe's Grocery"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo / Your Photo (Optional)</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({...formData, rating: star})}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={32} 
                    className={star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200"} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue resize-none"
              value={formData.feedback_text}
              onChange={(e) => setFormData({...formData, feedback_text: e.target.value})}
              placeholder="Tell us what you think..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </main>
  );
}
