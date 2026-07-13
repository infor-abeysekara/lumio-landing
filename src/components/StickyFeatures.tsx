"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";

const features = [
  {
    title: "Master Your Inventory",
    description: "Never run out of stock again. Our real-time inventory system tracks every single item, alerting you before you hit zero. Manage variants, barcodes, and suppliers all in one place.",
    image: "/images/Dashboard.png",
  },
  {
    title: "Insightful Analytics",
    description: "Stop guessing and start knowing. Access detailed reports on your best-selling items, peak hours, and profit margins. Make data-driven decisions that grow your business.",
    image: "/images/Salse anelize.png",
  },
  {
    title: "Total System Control",
    description: "Built for businesses of all sizes. Easily manage user permissions, customize receipt formats, and configure tax settings. You have the power to adapt the system to your workflow.",
    image: "/images/Systeme contrall panel.png",
  }
];

export default function StickyFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 bg-white relative border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 items-start relative">
          
          {/* Left Side: Scrollable Content */}
          <div className="md:w-1/2 w-full py-10 md:py-[25vh]">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={clsx(
                  "mb-32 md:mb-[50vh] transition-all duration-500",
                  activeIndex === index ? "opacity-100 translate-x-0" : "opacity-30 -translate-x-4"
                )}
                onViewportEnter={() => setActiveIndex(index)}
                viewport={{ margin: "-40% 0px -40% 0px", amount: "some" }}
              >
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-brand-gray leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Mobile Image (Hidden on Desktop) */}
                <div className="mt-8 md:hidden rounded-2xl bg-gray-50 border border-gray-200 shadow-lg overflow-hidden p-2">
                  <div className="w-full h-full rounded-xl bg-white border border-gray-200 overflow-hidden">
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

          {/* Right Side: Sticky Image (Hidden on Mobile) */}
          <div className="md:w-1/2 w-full sticky top-32 h-[400px] md:h-[500px] hidden md:flex items-center justify-center">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.95,
                  y: activeIndex === index ? 0 : 20,
                  zIndex: activeIndex === index ? 10 : 0
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full rounded-2xl bg-gray-50 border border-gray-200 shadow-xl overflow-hidden p-2 md:p-3"
              >
                <div className="w-full h-full rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden flex items-start justify-center">
                   <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-auto object-cover object-top block"
                  />
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
