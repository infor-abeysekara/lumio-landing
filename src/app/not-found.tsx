import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="relative z-50 h-24">
        <Navbar />
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-9xl font-black text-gray-200 tracking-tighter mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">Page Not Found</h2>
        <p className="text-brand-gray text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <Link 
          href="/"
          className="bg-brand-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 inline-block"
        >
          Back to Homepage
        </Link>
      </main>

      <Footer />
    </div>
  );
}
