"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShoppingCart, MessageCircle, ChevronRight, Home, 
  Truck, ShieldCheck, Headphones, RotateCcw, Loader2,
  Minus, Plus, Info, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

import Navbar from "@/components/Navbar";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch product details
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push('/');
        } else {
          setProduct(data);
          // Fetch related products
          fetch('/api/products')
            .then(r => r.json())
            .then(all => {
              if (Array.isArray(all)) {
                // Filter by same category, exclude current, and take random 4
                let related = all.filter(p => p.id !== data.id && p.category === data.category);
                if (related.length === 0) related = all.filter(p => p.id !== data.id); // fallback to any
                setRelatedProducts(related.sort(() => 0.5 - Math.random()).slice(0, 4));
              }
            });
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20">
        <Loader2 className="animate-spin text-brand-blue mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) return null;

  // Fallbacks for missing database data if not yet updated
  const specs = product.specifications || `Product: ${product.name}\nCategory: ${product.category}\nSKU: ${product.sku}\nPrice: Rs. ${product.price}\nAvailability: In Stock\nCondition: Brand New\nWarranty: Manufacturer warranty applies`;
  
  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello POSLK, I would like to order: \n*${product.name}* \nSKU: ${product.sku}\nQuantity: ${quantity}\nTotal: Rs. ${(Number(product.price) * quantity).toLocaleString()}\nPlease let me know the delivery process.`);
    window.open(`https://wa.me/94703101272?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="relative z-50 h-24">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-xs font-bold text-brand-blue uppercase tracking-wider mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-blue-700 flex items-center gap-1"><Home size={14}/> Home</Link>
          <ChevronRight size={14} className="mx-2 text-gray-300" />
          <Link href="/shop" className="hover:text-blue-700">Shop</Link>
          <ChevronRight size={14} className="mx-2 text-gray-300" />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-700">{product.category}</Link>
          <ChevronRight size={14} className="mx-2 text-gray-300" />
          <span className="text-brand-dark">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100 p-6 md:p-10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Image Box */}
            <div className="bg-gray-50/80 rounded-3xl p-8 flex items-center justify-center aspect-square border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-blue/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              {product.image_url ? (
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="text-gray-300 font-medium text-xl">No Image Available</div>
              )}
            </div>

            {/* Product Details Box */}
            <div className="flex flex-col">
              <span className="inline-block bg-blue-50 text-brand-blue text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-4">
                {product.category}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-black text-brand-dark leading-tight mb-4 uppercase tracking-tight">
                {product.name}
              </h1>
              
              <p className="text-3xl font-black text-brand-blue mb-6">
                <span className="text-xl text-gray-400 mr-1">Rs.</span>
                {Number(product.price).toLocaleString()}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full">
                  <CheckCircle size={14} /> In Stock — {product.stock_quantity || 50} units available
                </div>
              </div>

              <div className="text-sm font-medium text-gray-400 mb-6 flex items-center gap-2">
                SKU: <span className="text-gray-700">{product.sku}</span>
              </div>

              <p className="text-gray-500 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-6 mb-8">
                <span className="text-sm font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 h-12 w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-brand-dark hover:bg-gray-100 rounded-l-xl transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    readOnly
                    className="w-10 text-center font-bold text-brand-dark bg-transparent outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-brand-dark hover:bg-gray-100 rounded-r-xl transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={() => {
                    addToCart({
                      id: `hw-${product.id}`,
                      name: product.name,
                      price: Number(product.price),
                      quantity: quantity,
                      type: 'hardware',
                      image: product.image_url
                    });
                  }}
                  className="flex-1 bg-gradient-to-r from-brand-blue to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:-translate-y-1 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button 
                  onClick={handleWhatsApp}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-500/30 hover:-translate-y-1 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> Order via WhatsApp
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  <div className="p-2 bg-white rounded-lg text-brand-blue shadow-sm"><Truck size={16}/></div>
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">Island-wide delivery</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  <div className="p-2 bg-white rounded-lg text-brand-blue shadow-sm"><ShieldCheck size={16}/></div>
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">Genuine products</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  <div className="p-2 bg-white rounded-lg text-brand-blue shadow-sm"><Headphones size={16}/></div>
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">24/7 tech support</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                  <div className="p-2 bg-white rounded-lg text-brand-blue shadow-sm"><RotateCcw size={16}/></div>
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">7-day return policy</span>
                </div>
              </div>

            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-8 border-b border-gray-100 mb-8 overflow-x-auto whitespace-nowrap">
              {['Description', 'Specifications', 'Shipping & Returns'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="min-h-[200px]">
              {activeTab === 'Description' && (
                <div className="prose prose-blue max-w-none text-gray-600">
                  <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
                </div>
              )}
              {activeTab === 'Specifications' && (
                <div className="prose prose-blue max-w-none text-gray-600">
                  <ul className="space-y-4 list-none pl-0">
                    {specs.split('\n').filter(Boolean).map((spec: string, idx: number) => {
                      const [key, ...rest] = spec.split(':');
                      return (
                        <li key={idx} className="flex flex-col sm:flex-row gap-2 border-b border-gray-50 pb-2">
                          <strong className="text-brand-dark min-w-[150px]">{key}:</strong>
                          <span className="text-gray-600">{rest.join(':')}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {activeTab === 'Shipping & Returns' && (
                <div className="prose prose-blue max-w-none text-gray-600">
                  <ul className="space-y-4 list-none pl-0">
                    {(product.shipping_returns || '').split('\n').filter(Boolean).map((spec: string, idx: number) => {
                      const [key, ...rest] = spec.split(':');
                      return (
                        <li key={idx} className="flex flex-col sm:flex-row gap-2 border-b border-gray-50 pb-2">
                          <strong className="text-brand-dark min-w-[150px]">{key}:</strong>
                          <span className="text-gray-600">{rest.join(':')}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                <ShoppingCart size={20} />
              </div>
              <h2 className="text-2xl font-black text-brand-dark tracking-tight">You May Also Like</h2>
            </div>
            
            {/* Carousel implementation using overflow-x-auto snap */}
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {relatedProducts.map((p, i) => (
                <div key={p.id} className="min-w-[280px] w-[280px] md:min-w-[300px] md:w-[300px] snap-start flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[2rem] p-5 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full border border-gray-100 relative overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/shop/${p.id}`)}
                  >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-50 flex items-center justify-center p-6">
                      <div className="absolute top-3 left-3 bg-green-50 border border-green-100 text-[10px] font-black text-green-600 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10">
                        In Stock
                      </div>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-sm" />
                      ) : (
                        <div className="text-gray-300 font-medium">No Image</div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col relative z-10 pointer-events-none">
                      <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2 opacity-80">
                        {p.category}
                      </span>
                      <h3 className="font-bold text-brand-dark text-lg leading-tight mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                        {p.name}
                      </h3>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="font-black text-xl text-brand-dark tracking-tight">
                          <span className="text-xs text-gray-400 font-bold mr-1">Rs.</span>
                          {Number(p.price).toLocaleString()}
                        </span>
                        <div className="text-brand-blue border border-brand-blue/20 rounded-full p-2 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
            {/* Custom CSS to hide scrollbar but allow scrolling */}
            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                  display: none;
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
