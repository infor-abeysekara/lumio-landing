"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      desc: "Perfect for single retail stores starting out.",
      priceMonthly: "2,900",
      priceAnnual: "29,000",
      features: [
        "1 POS Terminal",
        "Unlimited Products",
        "Basic Sales Reporting",
        "Thermal Receipt Printing",
        "Email Support"
      ],
      isPopular: false
    },
    {
      name: "Professional",
      desc: "For growing businesses needing more power.",
      priceMonthly: "4,900",
      priceAnnual: "49,000",
      features: [
        "Up to 3 POS Terminals",
        "Advanced Analytics & Trends",
        "Cloud Sync & Backup",
        "Warranty Claiming System",
        "Priority Support",
        "Custom A4 Invoices"
      ],
      isPopular: true
    },
    {
      name: "Enterprise",
      desc: "Complete solution for large retail stores.",
      priceMonthly: "9,900",
      priceAnnual: "99,000",
      features: [
        "Unlimited POS Terminals",
        "Advanced User Permissions",
        "Custom Feature Development",
        "Dedicated Account Manager",
        "On-site Setup & Training",
        "24/7 Phone Support"
      ],
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-brand-gray mb-8">No hidden fees. Choose the plan that fits your business.</p>
          
          <div className="inline-flex items-center bg-brand-light p-1 rounded-full border border-gray-200">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-gray hover:text-brand-dark'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isAnnual ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-gray hover:text-brand-dark'}`}
            >
              Annually <span className="ml-1 text-xs text-green-600 font-bold">Save 16%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 border ${plan.isPopular ? 'border-brand-blue shadow-xl shadow-brand-blue/10 md:-mt-8 md:mb-8' : 'border-gray-100 shadow-sm'}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-serif font-semibold text-brand-dark mb-2">{plan.name}</h3>
              <p className="text-brand-gray text-sm mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-brand-dark">Rs. {isAnnual ? plan.priceAnnual : plan.priceMonthly}</span>
                <span className="text-brand-gray">/{isAnnual ? 'yr' : 'mo'}</span>
              </div>
              
              <button className={`w-full py-3 rounded-full font-medium transition-colors mb-8 ${plan.isPopular ? 'bg-brand-blue text-white hover:bg-blue-700' : 'bg-brand-light text-brand-dark hover:bg-gray-200 border border-gray-200'}`}>
                Get Started
              </button>
              
              <div className="space-y-4">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="mt-0.5 text-brand-blue">
                      <Check size={18} />
                    </div>
                    <span className="text-brand-dark text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
