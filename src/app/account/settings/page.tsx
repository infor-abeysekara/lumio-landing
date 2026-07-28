"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, User, Store, Mail, Phone, UploadCloud } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function AccountSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    shop_name: "",
    email: "",
    phone: "",
    profile_photo: ""
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          shop_name: data.shop_name || "",
          email: data.email || "",
          phone: data.phone || "",
          profile_photo: data.profile_photo || ""
        });
        setPhotoPreview(data.profile_photo || "");
        setLoading(false);
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError("Profile photo must be less than 2MB");
        return;
      }
      setNewPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value as string);
      });
      if (newPhoto) {
        form.append("new_profile_photo", newPhoto);
      }

      const res = await fetch("/api/account/update", {
        method: "PUT",
        body: form
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      
      setSuccess("Profile updated successfully!");
      if (data.profile_photo) {
        setFormData({...formData, profile_photo: data.profile_photo});
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <Navbar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-brand-dark mb-6">Account Settings</h1>
        
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium border border-green-200 flex items-center gap-2">
            <CheckCircle size={18} /> {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex flex-col items-center justify-center mb-8">
            <label className="cursor-pointer group relative">
              <div className="w-32 h-32 rounded-full border-4 border-gray-100 flex items-center justify-center overflow-hidden hover:border-brand-blue transition-colors">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-300" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloud className="text-white" size={24} />
                </div>
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            <p className="text-xs text-gray-400 mt-2">Click to change (Max 2MB)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">First Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full border border-gray-200 p-3 pl-10 rounded-xl outline-none focus:border-brand-blue bg-gray-50 focus:bg-white" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Last Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full border border-gray-200 p-3 pl-10 rounded-xl outline-none focus:border-brand-blue bg-gray-50 focus:bg-white" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Email (Read Only)</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="email" value={formData.email} disabled className="w-full border border-gray-200 p-3 pl-10 rounded-xl outline-none bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 p-3 pl-10 rounded-xl outline-none focus:border-brand-blue bg-gray-50 focus:bg-white" required />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Shop Name</label>
            <div className="relative">
              <Store size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input type="text" value={formData.shop_name} onChange={e => setFormData({...formData, shop_name: e.target.value})} className="w-full border border-gray-200 p-3 pl-10 rounded-xl outline-none focus:border-brand-blue bg-gray-50 focus:bg-white" required />
            </div>
          </div>

          <button disabled={saving} type="submit" className="w-full bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md">
            {saving ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
