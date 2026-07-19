"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Loader2, CheckCircle, XCircle } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  is_approved: boolean;
}

export default function AccessoriesManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?all=true');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      if (Array.isArray(catData)) setCategories(catData);
      
      // We can get the role from an API or just check if they are Super Admin via an API endpoint.
      // For now we'll fetch the role from a quick auth check endpoint
      const roleRes = await fetch('/api/auth/me');
      if (roleRes.ok) {
        const roleData = await roleRes.json();
        setRole(roleData.role);
      }
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdding(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newProduct = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData // Send FormData directly
      });
      if (res.ok) {
        form.reset();
        fetchProducts();
        alert(role === 'SUPER_ADMIN' ? "Product published!" : "Product submitted for approval!");
      }
    } catch (error) {
      alert("Error adding product");
    } finally {
      setAdding(false);
    }
  };

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false, title: "", message: "", variant: 'danger', onConfirm: () => {}
  });

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  const handleApprove = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Approve Product",
      message: "Are you sure you want to approve this product for the live site?",
      variant: 'success',
      onConfirm: async () => {
        closeConfirm();
        try {
          await fetch(`/api/products/${id}/approve`, { method: 'POST' });
          fetchProducts();
        } catch (err) {
          alert("Failed to approve");
        }
      }
    });
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      variant: 'danger',
      onConfirm: async () => {
        closeConfirm();
        try {
          await fetch(`/api/products/${id}`, { method: 'DELETE' });
          fetchProducts();
        } catch (err) {
          alert("Failed to delete");
        }
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Accessories Manager</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus size={20}/> Add New Accessory</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Product Name</label>
              <input required name="name" type="text" className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none" placeholder="e.g. THERMAL PAPER ROLL"/>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Description</label>
              <textarea required name="description" className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none" rows={3}></textarea>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Price (LKR)</label>
              <input required name="price" type="number" className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none" placeholder="e.g. 1500"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">SKU</label>
                <input name="sku" type="text" className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none" placeholder="e.g. POS-AC-001"/>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Stock Quantity</label>
                <input name="stock_quantity" type="number" defaultValue={50} className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none"/>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Category</label>
              <select required name="category" className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none bg-white">
                {categories.length > 0 ? categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                )) : (
                  <option value="Uncategorized">Uncategorized</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Specifications (One per line)</label>
              <textarea name="specifications" className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none" rows={3} placeholder="Size: 80mm width&#10;Type: Direct thermal"></textarea>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Shipping & Returns (One per line)</label>
              <textarea name="shipping_returns" className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none" rows={3} placeholder="Delivery: Island-wide&#10;Returns: 7-day policy"></textarea>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Product Image</label>
              <input required name="image_file" type="file" accept="image/*" className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none bg-white"/>
            </div>
            <button disabled={adding} type="submit" className="w-full bg-brand-blue hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              {adding ? <Loader2 className="animate-spin" size={20}/> : (role === 'SUPER_ADMIN' ? 'Publish Product' : 'Submit for Approval')}
            </button>
            {role !== 'SUPER_ADMIN' && (
              <p className="text-xs text-orange-500 text-center font-medium mt-2">
                Products require Super Admin approval before going live.
              </p>
            )}
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
              Manage Accessories
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{products.length} Items</span>
            </h2>
            
            {loading ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-brand-blue" size={32} /></div> : (
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-xl">No accessories found.</div>
                ) : products.map(p => (
                  <div key={p.id} className={`border p-4 rounded-xl flex gap-6 items-center transition-all ${!p.is_approved ? 'bg-orange-50/30 border-orange-200' : 'bg-white hover:shadow-md'}`}>
                    <div className="w-24 h-24 flex-shrink-0 bg-white rounded-lg border p-2 flex items-center justify-center">
                      <img src={p.image_url} alt={p.name} className="max-w-full max-h-full object-contain"/>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg text-brand-dark">{p.name}</h4>
                        {p.is_approved ? (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            <CheckCircle size={12} /> Live
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                            <Loader2 size={12} className="animate-spin" /> Pending Approval
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{p.category}</span>
                      <p className="font-bold text-brand-blue mt-2 text-xl">Rs. {Number(p.price).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {role === 'SUPER_ADMIN' && !p.is_approved && (
                        <button 
                          onClick={() => handleApprove(p.id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 flex justify-center"
                        title="Delete Product"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
        onCancel={closeConfirm}
        confirmText={confirmState.variant === 'danger' ? "Yes, Delete" : "Yes, Approve"}
      />
    </div>
  );
}
