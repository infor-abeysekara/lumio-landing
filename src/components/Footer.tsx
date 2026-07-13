export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/Logo.png" alt="Lumio POS Logo" className="h-8 w-auto" />
            </div>
            <p className="text-gray-400 max-w-sm text-sm">
              The next-generation Point of Sale system built for speed, accuracy, and true business growth. Stop running on guesswork.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-brand-blue transition-colors">Features</a></li>
              <li><a href="#analytics" className="hover:text-brand-blue transition-colors">Analytics</a></li>
              <li><a href="#pricing" className="hover:text-brand-blue transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Support</li>
              <li>Sales</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-dark/50 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Lumio POS. All rights reserved.</p>
          <p className="mt-4 md:mt-0 font-medium">Developed by <span className="text-brand-blue-light">Lumnix Solutions</span></p>
        </div>
      </div>
    </footer>
  );
}
