"use client";

import { useState } from "react";
import { Loader2, Key } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LinkLicenseForm() {
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLinkLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey) return;
    
    setLoading(true);

    try {
      const res = await fetch("/api/tenant/link-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKey }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("License linked successfully! Reloading...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(data.error || "Failed to link license.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border mb-8 text-left shadow-sm">
      <Toaster position="top-right" />
      <h3 className="font-bold text-sm text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
        <Key size={16} className="text-brand-blue" />
        Link POS License
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Already have a POS license? Enter your License Key here to link your Cloud account and gain instant access.
      </p>
      
      <form onSubmit={handleLinkLicense} className="flex gap-2">
        <input
          type="text"
          required
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          placeholder="Enter License Key"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
        />
        <button
          type="submit"
          disabled={loading || !licenseKey}
          className="bg-brand-blue hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Link"}
        </button>
      </form>
    </div>
  );
}
