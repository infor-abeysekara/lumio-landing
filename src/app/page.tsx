import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import BentoFeatures from "@/components/BentoFeatures";
import StickyFeatures from "@/components/StickyFeatures";
import FeatureGridFAQ from "@/components/FeatureGridFAQ";
import Pricing from "@/components/Pricing";
import Contact from '@/components/Contact';
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustedBy />
      <BentoFeatures />
      <StickyFeatures />
      <FeatureGridFAQ />
      <Pricing />
      
      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glow-orb opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-3xl p-12 md:p-20 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-dark mb-6">Stop running on guesswork.</h2>
            <p className="text-xl text-brand-gray mb-10 max-w-2xl mx-auto">
              Join hundreds of retailers who have already upgraded their business with Lumio POS.
            </p>
            <a 
              href="http://localhost/Lumio POS Publish/login.php" 
              className="bg-brand-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 inline-block mb-4"
            >
              Start Your 30-Day Free Trial
            </a>
            <p className="text-sm text-brand-gray font-medium">No credit card required. Setup takes just 5 minutes.</p>
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  );
}
