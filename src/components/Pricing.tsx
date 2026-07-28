"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Pricing() {
  const { addToCart } = useCart();
  const [softwarePrice, setSoftwarePrice] = useState(65000);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.software_price) {
          setSoftwarePrice(Number(data.settings.software_price));
        }
      })
      .catch(console.error);
  }, []);

  const handleBuyNow = () => {
    // Add the main software license
    addToCart({
      id: "lumio-ent-001",
      name: "Lumio POS Enterprise License",
      price: softwarePrice,
      quantity: 1,
      type: "software",
    });

    // Auto-add the Cloud Dashboard as an addon
    addToCart({
      id: "lumio-cloud-001",
      name: "Cloud Dashboard (1 Year)",
      price: 6000,
      quantity: 1,
      type: "addon",
    });
  };

  const plans = [
    {
      name: "30-Day Free Trial",
      desc: "Test drive Lumio POS in your store with full access.",
      price: "Free",
      subtext: "No credit card required",
      features: [
        { text: "1 POS Terminal", included: true },
        { text: "Unlimited Products", included: true },
        { text: "Standard Reporting", included: true },
        { text: "Local Database Storage", included: true },
        { text: "Cloud Backup", included: false },
        { text: "Basic Email Support", included: true }
      ],
      isPopular: false,
      buttonText: "Start Trial"
    },
    {
      name: "Lumio POS Enterprise",
      desc: "Complete POS solution with all premium features.",
      price: `Rs. ${softwarePrice.toLocaleString()}`,
      subtext: "One-time payment",
      features: [
        { text: "Full POS System Access", included: true },
        { text: "Unlimited Products & Sales", included: true },
        { text: "Real-time Cloud Backups", included: true },
        { text: "Advanced User Permissions", included: true },
        { text: "Warranty & GRN Management", included: true }
      ],
      addOn: "Rs. 6,000/yr for Cloud Dashboard",
      isPopular: true,
      buttonText: "Buy Now"
    },
    {
      name: "Customize Your System",
      desc: "Need specific features? We can build them for you.",
      price: "Custom",
      subtext: "Based on requirements",
      features: [
        { text: "Tailor-made POS Features", included: true },
        { text: "Custom Third-party Integrations", included: true },
        { text: "Personalized Receipt Designs", included: true },
        { text: "Special Hardware Support", included: true },
        { text: "Dedicated Support Team", included: true },
        { text: "On-site Setup & Training", included: true }
      ],
      isPopular: false,
      buttonText: "Contact Us"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-brand-gray mb-8">No hidden fees. Every plan comes with a 30-day free trial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${plan.isPopular ? 'border-brand-blue shadow-xl shadow-brand-blue/10 md:-mt-8 md:mb-8' : 'border-gray-100 shadow-sm'}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-sans font-bold text-brand-dark mb-2">{plan.name}</h3>
              <p className="text-brand-gray text-sm mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-8 flex flex-col justify-center min-h-[80px]">
                {plan.price.includes("Rs.") ? (
                  <div className="text-brand-dark">
                    <span className="text-2xl font-bold">Rs. </span>
                    <span className="text-5xl font-bold">{plan.price.replace("Rs. ", "")}</span>
                  </div>
                ) : (
                  <span className="text-5xl font-bold text-brand-dark">{plan.price}</span>
                )}
                <span className="text-brand-gray text-sm mt-1">{plan.subtext}</span>
              </div>
              
              {plan.buttonText === "Buy Now" ? (
                <button 
                  onClick={handleBuyNow}
                  className={`w-full py-3 rounded-full font-medium transition-all duration-300 mb-8 ${plan.isPopular ? 'bg-brand-blue text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30' : 'bg-brand-light text-brand-dark hover:bg-gray-100 border border-gray-200 hover:border-gray-300'}`}
                >
                  Add to Cart
                </button>
              ) : (
                <a href={plan.buttonText === "Contact Us" ? "#contact" : "http://localhost/Lumio POS Publish/login.php"} className={`block text-center w-full py-3 rounded-full font-medium transition-all duration-300 mb-8 ${plan.isPopular ? 'bg-brand-blue text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30' : 'bg-brand-light text-brand-dark hover:bg-gray-100 border border-gray-200 hover:border-gray-300'}`}>
                  {plan.buttonText}
                </a>
              )}
              
              <div className="space-y-4">
                {plan.features.map((feature, j) => (
                  <div key={j} className={`flex items-center gap-3 ${!feature.included ? 'opacity-60' : ''}`}>
                    <div className={`flex-shrink-0 ${feature.included ? 'text-brand-blue' : 'text-gray-400'}`}>
                      {feature.included ? <Check size={18} /> : <X size={18} />}
                    </div>
                    <span className={`text-sm ${feature.included ? 'text-brand-dark' : 'text-gray-500 line-through'}`}>{feature.text}</span>
                  </div>
                ))}

                {plan.addOn && (
                  <div className="pt-2">
                    <hr className="border-gray-100 mb-4" />
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="flex-shrink-0 text-brand-blue">
                        <Plus size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-brand-dark">{plan.addOn}</span>
                        <span className="text-[10px] text-brand-gray font-bold uppercase tracking-wider mt-0.5">Auto-added to Cart</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
