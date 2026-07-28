"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, CreditCard, MessageSquare } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [merchantId, setMerchantId] = useState("");
  const [merchantSecret, setMerchantSecret] = useState("");
  const [paymentEnabled, setPaymentEnabled] = useState(true);
  const [smsToken, setSmsToken] = useState("");
  const [smsSenderId, setSmsSenderId] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setMerchantId(data.payhere_merchant_id || "");
        setMerchantSecret(data.payhere_secret || "");
        setPaymentEnabled(data.payment_gateway_enabled === "true" || data.payment_gateway_enabled === undefined);
        setSmsToken(data.smsapi_token || "");
        setSmsSenderId(data.smsapi_sender_id || "");
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent, type: "payhere" | "sms") => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (type === "payhere") {
        await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "payhere_merchant_id", value: merchantId }) });
        await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "payhere_secret", value: merchantSecret }) });
        await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "payment_gateway_enabled", value: paymentEnabled ? "true" : "false" }) });
        toast.success("PayHere settings saved successfully");
      } else if (type === "sms") {
        await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "smsapi_token", value: smsToken }) });
        await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "smsapi_sender_id", value: smsSenderId }) });
        toast.success("SMS settings saved successfully");
      }
    } catch (error) {
      console.error("Failed to save settings", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Global Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PayHere Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <CreditCard className="text-brand-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">PayHere Gateway</h2>
          </div>
          
          <form onSubmit={(e) => handleSave(e, "payhere")} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merchant ID</label>
              <input type="text" value={merchantId} onChange={(e) => setMerchantId(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" placeholder="e.g. 21xxxx" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Secret</label>
              <input type="password" value={merchantSecret} onChange={(e) => setMerchantSecret(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" placeholder="PayHere Merchant Secret" required />
            </div>

            <div className="flex items-center gap-3 pt-2 pb-2">
              <button 
                type="button" 
                onClick={() => setPaymentEnabled(!paymentEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${paymentEnabled ? 'bg-brand-blue' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${paymentEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <div>
                <p className="text-sm font-bold text-gray-800">Enable Online Payments</p>
                <p className="text-xs text-gray-500">Allow customers to pay via PayHere at checkout</p>
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full mt-4 bg-brand-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>

        {/* SMS API Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-50 p-3 rounded-lg">
              <MessageSquare className="text-green-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">SMSAPI.lk Gateway</h2>
          </div>
          
          <form onSubmit={(e) => handleSave(e, "sms")} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Token</label>
              <input type="password" value={smsToken} onChange={(e) => setSmsToken(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all" placeholder="API Token" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sender ID</label>
              <input type="text" value={smsSenderId} onChange={(e) => setSmsSenderId(e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all" placeholder="e.g. SMSAPI Demo" required />
            </div>

            <button type="submit" disabled={saving} className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex justify-center items-center gap-2 disabled:opacity-70">
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? "Saving..." : "Save SMS Settings"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
