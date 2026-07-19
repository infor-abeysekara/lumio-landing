"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingCart, Minus, Plus, Trash2, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CheckoutModal from "./CheckoutModal";
import { useState } from "react";

export default function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmount } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<'checkout' | 'quotation'>('checkout');

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[60]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-full md:w-[420px] bg-[#F8FAFC] shadow-[0_0_60px_rgba(0,0,0,0.1)] z-[70] flex flex-col border-l border-white/50"
            >
              <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <ShoppingCart size={18} className="text-brand-blue" />
                  </div>
                  <h2 className="text-xl font-black text-brand-dark tracking-tight">Your Cart</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all hover:rotate-90 bg-gray-50"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <ShoppingCart size={40} className="opacity-20" />
                    </div>
                    <p className="font-medium text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-white border border-white rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative group transform hover:-translate-y-1">
                        {item.image && (
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-100/50 p-2 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm hover:scale-110 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-brand-dark text-[15px] leading-tight mb-1.5 pr-8">{item.name}</h4>
                              <div className="text-brand-blue font-black text-[15px] mb-3">Rs. {item.price.toLocaleString()}</div>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                              title="Remove Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto">
                            {item.type === 'software' || item.type === 'addon' ? (
                              <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-50/50 text-brand-blue px-3 py-1.5 rounded-lg border border-blue-100/50">
                                1x License
                              </span>
                            ) : (
                              <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white text-gray-500 hover:text-brand-blue rounded-lg shadow-sm transition-all border border-gray-100"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold w-8 text-center text-brand-dark">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white text-gray-500 hover:text-brand-blue rounded-lg shadow-sm transition-all border border-gray-100"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 bg-white border-t border-gray-100 z-10 relative shadow-[0_-20px_40px_rgba(0,0,0,0.02)] rounded-t-3xl">
                  <div className="flex justify-between items-end mb-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium mb-1">Total Amount</span>
                      <span className="text-xs text-gray-400">Including VAT</span>
                    </div>
                    <span className="text-3xl font-black text-brand-dark tracking-tight">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { setCheckoutMode('checkout'); setIsCheckoutOpen(true); }}
                      className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold hover:bg-brand-blue hover:shadow-xl hover:shadow-brand-blue/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} /> Proceed to Checkout
                    </button>
                    <button 
                      onClick={() => { setCheckoutMode('quotation'); setIsCheckoutOpen(true); }}
                      className="w-full bg-[#F8FAFC] text-gray-600 border border-gray-200 py-4 rounded-2xl font-bold hover:bg-blue-50 hover:text-brand-blue hover:border-blue-200 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FileText size={18} /> Request Quotation
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} mode={checkoutMode} />
    </>
  );
}
