"use client";

import { useState } from "react";
import { Send, Loader2, MessageSquare, AlertTriangle, Users } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function BroadcastPage() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // SMS length calculation (basic GSM 7-bit assumption)
  // Usually 160 chars for 1 part, 306 for 2 parts
  const charCount = message.length;
  const smsCount = charCount === 0 ? 0 : charCount <= 160 ? 1 : Math.ceil(charCount / 153);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!confirm("Are you sure you want to send this message to ALL active tenants?")) {
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Broadcast sent to ${data.count} tenants successfully!`);
        setMessage("");
      } else {
        toast.error(data.error || "Failed to send broadcast");
      }
    } catch (error) {
      console.error("Broadcast failed", error);
      toast.error("Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Broadcast System</h1>

      <div className="max-w-3xl">
        
        {/* Compose Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <MessageSquare className="text-brand-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Compose SMS</h2>
              <p className="text-sm text-gray-500">Send an SMS alert to all active tenants</p>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none text-gray-800"
                placeholder="Type your message here..."
                required
              />
              
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className={`font-medium ${smsCount > 1 ? 'text-yellow-600' : 'text-gray-500'}`}>
                  Characters: {charCount} | SMS Parts: {smsCount}
                </span>
                {smsCount > 1 && (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <AlertTriangle size={14} />
                    This will cost {smsCount} SMS credits per tenant.
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={sending || message.length === 0}
                className="px-8 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {sending ? "Sending Broadcast..." : "Send to All Tenants"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
