import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy - Lumio POS",
  description: "Privacy Policy for Lumio POS by Lumnix Solutions.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="relative z-50 h-24">
        <Navbar />
      </div>

      <main className="flex-1 container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p><strong>Last Updated: July 2026</strong></p>
            
            <p>
              Welcome to <strong>Lumio POS</strong>, a product developed and maintained by <strong>Lumnix Solutions</strong>. 
              We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you 
              as to how we look after your personal data when you visit our website or use our software, and tell you about 
              your privacy rights and how the law protects you.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h3>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you, including Identity Data (first name, last name), 
              Contact Data (email address, telephone numbers), and Transaction Data (details about payments to and from you).
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Data</h3>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to register you as a new customer, 
              process and deliver your order, manage our relationship with you, and improve our software and services.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h3>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
            </p>

            <hr className="my-8 border-gray-200" />
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Company:</strong> Lumnix Solutions (Lumio POS)</li>
              <li><strong>Email:</strong> <a href="mailto:info@lumiopos.store" className="text-brand-blue hover:underline">info@lumiopos.store</a></li>
              <li><strong>Phone:</strong> <a href="tel:+94703101272" className="text-brand-blue hover:underline">+9470 310 1272</a></li>
              <li><strong>Address:</strong> No.615, Yaya 01, Wewa Pahala, Sooriyawewa.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
