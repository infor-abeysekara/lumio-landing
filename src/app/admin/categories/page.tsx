"use client";

import { useState, useEffect } from "react";
import { Plus, Trash, Loader2 } from "lucide-react";

import ConfirmModal from "@/components/ui/ConfirmModal";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState("");

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

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    
    setAdding(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCat })
      });
      if (res.ok) {
        setNewCat("");
        fetchCategories();
      } else {
        alert("Failed to add category. It might already exist.");
      }
    } catch (error) {
      alert("Error adding category");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (id: number) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Category",
      message: "Are you sure you want to delete this category? Products using this category might lose their grouping.",
      variant: 'danger',
      onConfirm: async () => {
        closeConfirm();
        try {
          await fetch(`/api/categories/${id}`, { method: 'DELETE' });
          fetchCategories();
        } catch (err) {
          alert("Failed to delete");
        }
      }
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Manage Categories</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus size={20}/> Add Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Category Name</label>
              <input 
                required 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                type="text" 
                className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none" 
                placeholder="e.g. Cables"
              />
            </div>
            
            <button disabled={adding} type="submit" className="w-full bg-brand-blue hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              {adding ? <Loader2 className="animate-spin" size={20}/> : 'Add Category'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
              Current Categories
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{categories.length} Items</span>
            </h2>
            
            {loading ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-brand-blue" size={32} /></div> : (
              <div className="space-y-3">
                {categories.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-xl">No categories found.</div>
                ) : categories.map(cat => (
                  <div key={cat.id} className="border p-4 rounded-xl flex gap-6 items-center justify-between bg-white hover:shadow-sm transition-all">
                    <span className="font-bold text-brand-dark">{cat.name}</span>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                      title="Delete Category"
                    >
                      <Trash size={18} />
                    </button>
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
        confirmText="Yes, Delete"
      />
    </div>
  );
}
