"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Master Your Inventory",
    description: "Never run out of stock again. Our real-time inventory system tracks every single item, alerting you before you hit zero. Manage variants, barcodes, and suppliers all in one place.",
    image: "/images/Inventry.png",
  },
  {
    title: "Supplier Management",
    description: "Easily track and manage all your suppliers in one place. Keep records of contacts, pending payments, and purchase histories to build stronger business relationships.",
    image: "/images/Suppliyer Management.png",
  }
];

export default function StickyFeatures() {
  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col gap-32">
          
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="max-w-3xl text-center mb-10 md:mb-16">
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
                  {feature.title}
                </h3>
                <p className="text-lg md:text-xl text-brand-gray leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              <div className="w-full bg-gray-50 border border-gray-200 rounded-3xl p-3 md:p-6 shadow-2xl hover:shadow-brand-blue/10 transition-shadow duration-500">
                <div className="w-full rounded-2xl bg-white border border-gray-200 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-auto object-cover object-top block"
                  />
                </div>
              </div>
            </motion.div>
          ))}
          
        </div>
      </div>
    </section>
  );
}
