"use client";

import { motion } from "framer-motion";

export default function TrustedBy() {
  const brands = [
    "Samantha Supper City",
    "Piyal Grocery",
    "Nayana Pharmacy",
    "Star Hardware",
    "Saman Textiles"
  ];

  return (
    <section className="py-12 border-b border-gray-100 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <p className="text-center text-sm font-medium text-brand-gray uppercase tracking-wider mb-8">
          Trusted by top local retailers across the country
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
          {brands.map((brand, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-xl md:text-2xl font-serif font-bold text-gray-400 hover:text-brand-dark transition-colors cursor-default"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
