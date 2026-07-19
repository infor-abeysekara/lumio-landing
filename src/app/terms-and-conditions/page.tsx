import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions - Lumio POS",
  description: "Terms and Conditions for Lumio POS by Lumnix Solutions.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="relative z-50 h-24">
        <Navbar />
      </div>

      <main className="flex-1 container mx-auto px-6 max-w-4xl py-16">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
            <p><strong>Last Updated: July 2026</strong></p>
            
            <p>
              These Terms and Conditions govern your use of the <strong>Lumio POS</strong> software and website, 
              provided by <strong>Lumnix Solutions</strong>. By accessing or using our services, you agree to be bound by these terms.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. License and Access</h3>
            <p>
              Subject to your compliance with these Terms and your payment of any applicable fees, Lumnix Solutions grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and make personal and commercial use of the Lumio POS software.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. User Accounts</h3>
            <p>
              If you use any Lumio POS service, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account or password.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Software Updates and Maintenance</h3>
            <p>
              We continually update Lumio POS to provide the best possible experience. We may automatically update the software on your devices. You agree to receive these updates and understand that certain features may be modified or removed over time.
            </p>

            <hr className="my-8 border-gray-200" />
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <p>
              If you have any questions regarding these Terms & Conditions, please contact us:
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
