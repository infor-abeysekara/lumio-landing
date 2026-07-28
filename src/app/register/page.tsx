"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UnifiedRegister() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    shop_name: "",
    nic: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirm_password: "",
    license_key: "",
  });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("Profile photo must be less than 2MB");
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG, and WEBP formats are allowed.");
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one capital letter.";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one simple letter.";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return "Password must contain at least one symbol.";
    return null;
  };

  const validateNIC = (nic: string) => {
    const oldFormat = /^[0-9]{9}[vVxX]$/;
    const newFormat = /^[0-9]{12}$/;
    if (!oldFormat.test(nic) && !newFormat.test(nic)) {
      return "NIC must be in the format '123456789012' or '123456789V'";
    }
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const pwdError = validatePassword(formData.password);
    if (pwdError) {
      setError(pwdError);
      setLoading(false);
      return;
    }

    const nicError = validateNIC(formData.nic);
    if (nicError) {
      setError(nicError);
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      if (profilePhoto) {
        form.append("profile_photo", profilePhoto);
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: form, // sending as FormData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Account Created!</h2>
          <p className="text-gray-500 mb-6">You can now login to your Lumio Dashboard.</p>
          <Loader2 className="animate-spin text-brand-blue mx-auto" size={24} />
          <p className="text-xs text-gray-400 mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/">
            <img src="/images/Logo.png" alt="Lumio POS" className="h-10 mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-black text-brand-dark tracking-tight">Create an Account</h1>
          <p className="text-gray-500 mt-2">Sign up to manage your Lumio POS Cloud Dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-medium border border-red-100 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* License Information */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-brand-dark mb-4">POS License Information</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">POS License Key</label>
              <input 
                type="text" 
                required
                value={formData.license_key}
                onChange={(e) => setFormData({...formData, license_key: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                placeholder="Enter the license key from your POS software"
              />
              <p className="text-xs text-gray-500">This connects your Web Dashboard to your shop's POS system.</p>
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center justify-center mb-8">
            <label className="cursor-pointer group relative">
              <div className={`w-32 h-32 rounded-full border-4 border-dashed flex items-center justify-center overflow-hidden transition-all ${photoPreview ? 'border-brand-blue' : 'border-gray-300 group-hover:border-brand-blue'}`}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400 group-hover:text-brand-blue">
                    <UploadCloud size={32} className="mx-auto mb-1" />
                    <span className="text-xs font-bold uppercase">Upload Photo</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            <p className="text-xs text-gray-400 mt-2">Max 2MB (Optional)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">First Name *</label>
              <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-brand-blue" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Last Name *</label>
              <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-brand-blue" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Shop/Business Name *</label>
            <input type="text" value={formData.shop_name} onChange={e => setFormData({...formData, shop_name: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-brand-blue" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">NIC Number *</label>
              <input type="text" placeholder="123456789012 or 123456789V" value={formData.nic} onChange={e => setFormData({...formData, nic: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-brand-blue" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Mobile Number *</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-brand-blue" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Email Address *</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-brand-blue" required />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Address *</label>
            <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-brand-blue min-h-[100px]" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Create Password *</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border-2 border-gray-100 p-3 pr-10 rounded-xl outline-none focus:border-brand-blue" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Min 6 chars, uppercase, lowercase, number & symbol</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Confirm Password *</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} value={formData.confirm_password} onChange={e => setFormData({...formData, confirm_password: e.target.value})} className="w-full border-2 border-gray-100 p-3 pr-10 rounded-xl outline-none focus:border-brand-blue" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl mt-8"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-dark font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
