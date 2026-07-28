"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function PaymentSuccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    if (searchParams?.get("payment") === "success") {
      clearCart(); // Clear the cart after successful payment
      setIsOpen(true);
      // Clean up the URL so it doesn't show the modal again on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams, clearCart]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/60 backdrop-blur-sm px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center"
        >
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
            Success!
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-2"
          >
            <X size={20} />
          </button>

          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          
          <p className="text-gray-500 mb-6 leading-relaxed">
            Thank you for choosing Lumio POS. Your payment has been successfully processed.
          </p>

          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-4 flex items-start text-left mb-8">
            <Mail className="text-brand-blue mt-1 mr-3 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-brand-dark text-sm mb-1">Check Your Email</h4>
              <p className="text-xs text-brand-gray">
                We've sent an email with your Order Summary, Invoice, and your <strong>Software License Key</strong>. Please check your inbox (and spam folder) to proceed with the software activation.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="w-full py-4 px-6 rounded-xl font-bold text-white bg-brand-blue hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
          >
            Okay, I understand
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
