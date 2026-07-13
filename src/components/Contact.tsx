"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "b6852417-92f0-4d33-95c3-ebf175d5c002");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        form.reset();
        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-brand-light relative">
      <div className="container mx-auto px-6 max-w-6xl">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">Get in Touch</h2>
          <p className="text-lg text-brand-gray max-w-2xl mx-auto">
            Have questions about Lumio POS or need a custom solution? Reach out to us and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Left Column: Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <h3 className="text-2xl font-sans font-bold text-brand-dark mb-6">Contact Information</h3>
              <p className="text-brand-gray mb-8">
                We are always open to discuss your retail needs. Let's make your business run faster and smarter.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue flex-shrink-0 mt-1">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Business Address</h4>
                  <p className="text-brand-dark font-medium text-lg leading-relaxed">
                    Lumnix Solutions<br />
                    No.615, Yaya 01, Wewa Pahala,<br />
                    Sooriyawewa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue flex-shrink-0 mt-1">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</h4>
                  <a href="tel:+94703101272" className="text-brand-dark font-medium text-lg hover:text-brand-blue transition-colors">
                    +9470 310 1272
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue flex-shrink-0 mt-1">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</h4>
                  <a href="mailto:info@lumiopos.store" className="text-brand-dark font-medium text-lg hover:text-brand-blue transition-colors">
                    info@lumiopos.store
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl shadow-brand-blue/5 relative overflow-hidden"
          >
            <h3 className="text-2xl font-sans font-bold text-brand-dark mb-6">Send us a Message</h3>

            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
              >
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-green-800">Message sent successfully!</h4>
                  <p className="text-sm text-green-700 mt-1">Thank you for reaching out to us. We will get back to you shortly.</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-2">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-2">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                    placeholder="07X XXX XXXX"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-dark mb-2">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all resize-none"
                  placeholder="How can we help you?"
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-brand-blue text-white py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span>Sending...</span>
                    <Loader2 size={18} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
