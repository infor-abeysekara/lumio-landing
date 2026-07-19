"use client";

import { Suspense, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Info, Loader2, Home, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch products and categories
    Promise.all([
      fetch('/api/products').then(res => res.json()).catch(() => []),
      fetch('/api/categories').then(res => res.json()).catch(() => [])
    ]).then(([productsData, categoriesData]) => {
      if (Array.isArray(productsData)) setProducts(productsData);
      if (Array.isArray(categoriesData)) setCategories(categoriesData);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  // Update active category if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Absolute Navbar for this page */}
      <div className="relative z-50 h-24">
        <Navbar />
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl pt-10 flex-1 pb-20">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs font-bold text-brand-blue uppercase tracking-wider mb-10 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-blue-700 flex items-center gap-1"><Home size={14}/> Home</Link>
          <ChevronRight size={14} className="mx-2 text-gray-300" />
          <span className="text-brand-dark">Shop</span>
          {activeCategory !== 'All' && (
            <>
              <ChevronRight size={14} className="mx-2 text-gray-300" />
              <span className="text-gray-400">{activeCategory}</span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-blue font-bold tracking-widest uppercase text-sm mb-2 block">Premium Hardware</span>
          <h1 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight mb-4">
            Accessories Shop
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            High-quality POS hardware and accessories to complete your setup. Fully compatible with Lumio POS.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeCategory === 'All' 
                  ? 'bg-brand-blue text-white shadow-md shadow-blue-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue/50 hover:text-brand-blue'
              }`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat.name 
                    ? 'bg-brand-blue text-white shadow-md shadow-blue-500/20' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue/50 hover:text-brand-blue'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-72 bg-white border border-gray-200 rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all"
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-blue mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
            <ShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-brand-dark mb-2">No products found</h3>
            <p className="text-gray-500">We couldn't find any products matching your search criteria.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-6 text-brand-blue font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl p-5 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full border border-gray-100"
              >
                <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-6 cursor-pointer" onClick={() => window.location.href=`/shop/${product.id}`}>
                  <div className="absolute top-3 left-3 bg-green-50 border border-green-100 text-[10px] font-black text-green-600 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10 flex items-center gap-1">
                    <CheckCircle size={12}/> In Stock
                  </div>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-sm mix-blend-multiply" />
                  ) : (
                    <div className="text-gray-300 font-medium text-sm">No Image</div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2 opacity-80">
                    {product.category}
                  </span>
                  <Link href={`/shop/${product.id}`} className="font-bold text-brand-dark text-lg leading-tight mb-2 line-clamp-2 hover:text-brand-blue transition-colors">
                    {product.name}
                  </Link>
                  <p className="font-black text-2xl text-brand-dark tracking-tight mb-6 mt-auto">
                    <span className="text-sm text-gray-400 font-bold mr-1">Rs.</span>
                    {Number(product.price).toLocaleString()}
                  </p>
                  
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/shop/${product.id}`} className="flex-[0.4] py-3 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-brand-dark transition-all flex items-center justify-center gap-1 border border-gray-200">
                      <Info size={16} /> Details
                    </Link>
                    <button 
                      onClick={() => addToCart({
                        id: `hw-${product.id}`,
                        name: product.name,
                        price: Number(product.price),
                        quantity: 1,
                        type: 'hardware',
                        image: product.image_url
                      })}
                      className="flex-1 bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-brand-blue transition-colors shadow-md hover:shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-blue" size={48} />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
