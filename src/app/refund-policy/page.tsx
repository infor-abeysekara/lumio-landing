import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Refund Policy - Lumio POS",
  description: "Refund and Cancellation Policy for Lumio POS by Lumnix Solutions.",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="relative z-50 h-24">
        <Navbar />
      </div>

      <main className="flex-1 container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">Refund Policy</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p><strong>Last Updated: July 2026</strong></p>
            
            <p>
              Thank you for choosing <strong>Lumio POS</strong>, developed by <strong>Lumnix Solutions</strong>. 
              We want to ensure that our customers have a rewarding experience while they are evaluating, evaluating, and purchasing our digital products and software subscriptions.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Digital Products and SaaS Subscriptions</h3>
            <p>
              As Lumio POS is primarily a digital product and a Software-as-a-Service (SaaS), we issue refunds for digital products within <strong>14 days</strong> of the original purchase of the product.
            </p>
            <p>
              We recommend contacting us for assistance if you experience any issues receiving or downloading our products, or if you face any technical difficulties during your initial setup.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Hardware and Accessories</h3>
            <p>
              For physical hardware and accessories purchased through our platform, you have <strong>14 days</strong> to return an item from the date you received it. 
              To be eligible for a return, your hardware must be unused, in the same condition that you received it, and in the original packaging.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. How to Request a Refund</h3>
            <p>
              To request a refund within the 14-day period, please contact our support team with your order number, account details, and the reason for the refund request. 
              Approved refunds will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days depending on your card issuer's policies.
            </p>

            <hr className="my-8 border-gray-200" />
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <p>
              If you have any questions about our Returns and Refunds Policy, please contact us:
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
