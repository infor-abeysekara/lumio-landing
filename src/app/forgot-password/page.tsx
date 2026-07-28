"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPassword() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [identifier, setIdentifier] = useState("");
  const [phoneHint, setPhoneHint] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleError = (msg: string) => {
    setError(msg);
    setLoading(false);
  };

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "identify", identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPhoneHint(data.phoneHint);
      setStep(2);
      setLoading(false);
    } catch (err: any) {
      handleError(err.message || "Failed to find account.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-send", identifier, nic, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep(3);
      setLoading(false);
    } catch (err: any) {
      handleError(err.message || "Verification failed.");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", identifier, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResetToken(data.resetToken);
      setStep(4);
      setLoading(false);
    } catch (err: any) {
      handleError(err.message || "Invalid OTP.");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", identifier, resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("Password reset successfully! You can now log in.");
      setStep(5); // Success state
      setLoading(false);
    } catch (err: any) {
      handleError(err.message || "Reset failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <img src="/images/Logo.png" alt="Lumio POS" className="h-10 mx-auto mb-6" />
          </Link>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">
            {step === 5 ? "Password Reset!" : "Forgot Password"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {step === 1 && "Enter your email to recover your account"}
            {step === 2 && "We need to verify it's really you"}
            {step === 3 && "Check your email or SMS for the OTP"}
            {step === 4 && "Choose a strong new password"}
            {step === 5 && "Your account is secure."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleIdentify} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">Email Address</label>
                <input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-medium bg-gray-50 focus:bg-white"
                  required
                  placeholder="e.g. hello@shop.com"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Continue"}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">NIC Number</label>
                <input
                  type="text"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-medium bg-gray-50 focus:bg-white"
                  required
                  placeholder="Enter your registered NIC"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">Mobile Number</label>
                <p className="text-xs text-gray-500 mb-2">Hint: {phoneHint}</p>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-medium bg-gray-50 focus:bg-white"
                  required
                  placeholder="Enter full mobile number"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Identity"}
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-bold text-center text-2xl tracking-widest bg-gray-50 focus:bg-white"
                  required
                  placeholder="000000"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit OTP"}
              </button>
            </motion.form>
          )}

          {step === 4 && (
            <motion.form key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleReset} className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-2 border-gray-100 p-4 pr-12 rounded-xl outline-none focus:border-brand-blue transition-colors font-medium bg-gray-50 focus:bg-white"
                  required
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-brand-blue transition-colors font-medium bg-gray-50 focus:bg-white"
                  required
                  placeholder="••••••••"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-brand-dark hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
              </button>
            </motion.form>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5">
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium border border-green-200">
                {success}
              </div>
              <Link href="/login" className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Back to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 5 && (
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <Link href="/login" className="text-gray-500 text-sm font-medium hover:text-brand-dark transition-colors inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
