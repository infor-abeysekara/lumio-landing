"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
}

export default function AccessoriesShop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Categories");

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All Categories", "POS Printers", "Barcode Scanners", "Computers", "Other Accessories"];

  const filteredProducts = activeCategory === "All Categories" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="accessories" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-4">POS Accessories Shop</h2>
          <div className="w-16 h-1 bg-brand-blue mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-brand-gray mb-8 max-w-2xl mx-auto">
            Complete your POS system with premium hardware — scanners, printers, computers & more.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-brand-blue text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-blue mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading amazing accessories...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No accessories found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <motion.div 
                key={product.id} 
                className="bg-gray-50/50 hover:bg-white rounded-[2rem] border border-gray-100 p-5 md:p-6 flex flex-col hover:border-[#00a3ff]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00a3ff]/10 group"
              >
                {/* Subtle background glow effect on hover */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-50 flex items-center justify-center p-6">
                  <div className="absolute top-3 left-3 bg-green-50 border border-green-100 text-[10px] font-black text-green-600 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10">
                    In Stock
                  </div>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-sm" />
                  ) : (
                    <div className="text-gray-300 font-medium">No Image</div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col relative z-10">
                  <span className="text-[11px] font-black text-[#00a3ff] uppercase tracking-widest mb-3 opacity-90">
                    {product.category}
                  </span>
                  <h3 className="font-sans font-bold text-brand-dark text-lg uppercase leading-snug mb-3 line-clamp-2 group-hover:text-[#00a3ff] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mt-auto flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-2xl text-[#00a3ff] tracking-tight">
                        <span className="text-lg font-bold mr-1">Rs.</span>
                        {Number(product.price).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/shop/${product.id}`} className="flex-[0.45] py-3 rounded-xl text-sm font-bold text-[#00a3ff] bg-white hover:bg-[#00a3ff] hover:text-white transition-all flex items-center justify-center gap-1.5 border-2 border-[#00a3ff]">
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
                        className="flex-[0.55] bg-[#00a3ff] text-white font-bold py-3 rounded-xl hover:bg-[#0088cc] transition-colors shadow-lg hover:shadow-xl shadow-[#00a3ff]/20 flex items-center justify-center gap-2 text-sm"
                      >
                        <ShoppingCart size={16} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-brand-dark text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}
