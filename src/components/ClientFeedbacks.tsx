"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface Feedback {
  id: number;
  reviewer_name: string;
  shop_name: string;
  rating: number;
  feedback_text: string;
}

export default function ClientFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const res = await fetch("/api/feedbacks");
        const data = await res.json();
        if (data.success) {
          setFeedbacks(data.feedbacks);
        }
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [feedbacks.length]);

  if (loading || feedbacks.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h3 className="text-sm font-bold tracking-widest text-brand-gray uppercase mb-12">
          Trusted By Top Local Retailers Across The Country
        </h3>
        
        <div className="relative h-[400px] md:h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute w-full px-4"
            >
              <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-2xl p-8 md:p-10 max-w-3xl mx-auto flex flex-col items-center">
                
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 bg-[#008f4c] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-md shadow-[#008f4c]/30">
                  {feedbacks[currentIndex].shop_name.substring(0, 2).toUpperCase()}
                </div>

                {/* Feedback Text */}
                <p className="text-lg md:text-xl text-gray-600 italic mb-8 leading-relaxed font-medium">
                  "{feedbacks[currentIndex].feedback_text}"
                </p>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={i < feedbacks[currentIndex].rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                    />
                  ))}
                </div>

                {/* Reviewer Details */}
                <h4 className="text-xl font-bold text-gray-900">
                  {feedbacks[currentIndex].reviewer_name}
                </h4>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  {feedbacks[currentIndex].shop_name}
                </p>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        {feedbacks.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {feedbacks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-brand-blue w-8" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
