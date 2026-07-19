import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a2332] text-white py-16 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/Logo.png" alt="Lumio POS Logo" className="h-8 w-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your complete POS solution for Sri Lankan shops. We provide modern, efficient, and affordable point of sale systems tailored for businesses of all sizes.
            </p>

          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/#features" className="hover:text-white transition-colors">Exclusive Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Accessories</Link></li>
              <li><Link href="/#analytics" className="hover:text-white transition-colors">POS Comparison</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Installations</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Business Types */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Business Types</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">General Stores</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Supermarkets</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pharmacies</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Fashion Stores</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Electronics Shops</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-gray-400 shrink-0 mt-0.5" />
                <a href="tel:+94703101272" className="hover:text-white transition-colors">+9470 310 1272</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-gray-400 shrink-0 mt-0.5" />
                <a href="mailto:info@lumiopos.store" className="hover:text-white transition-colors">info@lumiopos.store</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Lumnix Solutions<br />
                  No.615, Yaya 01, Wewa Pahala,<br />
                  Sooriyawewa.
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col items-center justify-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Lumio POS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
