"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const { items, setIsCartOpen } = useCart();
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-brand-blue text-white p-4 rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center group"
        >
          <ShoppingCart size={24} />
          
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {itemCount}
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
