"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuoteItem {
  name: string;
  description: string;
  price: string;
  qty: number;
}

export default function NewQuotation() {
  const [clientName, setClientName] = useState("");
  const [clientAttention, setClientAttention] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [saving, setSaving] = useState(false);
  
  // Available products for dropdown
  const [products, setProducts] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('/api/products?all=true'); // get all including pending
      if (res.ok) setProducts(await res.json());
    }
    fetchProducts();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { name: "", description: "", price: "0", qty: 1 }]);
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    
    // Auto-fill if product is selected
    if (field === 'name') {
      const selectedProduct = products.find(p => p.name === value);
      if (selectedProduct) {
        newItems[index].name = selectedProduct.name;
        newItems[index].description = selectedProduct.description || "";
        newItems[index].price = selectedProduct.price;
        setItems(newItems);
        return;
      }
    }
    
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
  const vat = 0; // Keeping 0 for now, can be modified
  const total = subtotal + vat;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert("Add at least one item.");
    
    setSaving(true);
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          client_attention: clientAttention,
          client_phone: clientPhone,
          client_email: clientEmail,
          items,
          subtotal,
          vat,
          total
        })
      });
      if (res.ok) {
        const data = await res.json();
        router.push('/admin/quotations');
        window.open(`/print/quotation/${data.id}`, '_blank');
      }
    } catch (err) {
      alert("Failed to save quotation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Create Quotation</h1>
      
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Client Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border col-span-1 h-fit">
            <h2 className="text-xl font-bold mb-4">Client Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Company/Client Name</label>
                <input required value={clientName} onChange={e => setClientName(e.target.value)} type="text" className="w-full border p-2 rounded-lg outline-none focus:border-brand-blue" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Attention To (Name)</label>
                <input required value={clientAttention} onChange={e => setClientAttention(e.target.value)} type="text" className="w-full border p-2 rounded-lg outline-none focus:border-brand-blue" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Phone Number</label>
                <input required value={clientPhone} onChange={e => setClientPhone(e.target.value)} type="text" className="w-full border p-2 rounded-lg outline-none focus:border-brand-blue" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Email Address</label>
                <input required value={clientEmail} onChange={e => setClientEmail(e.target.value)} type="email" className="w-full border p-2 rounded-lg outline-none focus:border-brand-blue" />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Line Items</h2>
              <button type="button" onClick={handleAddItem} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-colors">
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start border-b pb-4">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Using datalist for autocomplete */}
                      <div>
                        <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Item Name</label>
                        <input 
                          list="products" 
                          required 
                          value={item.name} 
                          onChange={e => handleItemChange(index, 'name', e.target.value)} 
                          className="w-full border p-2 rounded-lg outline-none focus:border-brand-blue text-sm font-bold" 
                          placeholder="Type or select product..." 
                        />
                        <datalist id="products">
                          <option value="Lumio POS Main License" />
                          <option value="Cloud Dashboard Add-on" />
                          {products.map(p => <option key={p.id} value={p.name} />)}
                        </datalist>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-20">
                          <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Qty</label>
                          <input required type="number" min="1" value={item.qty} onChange={e => handleItemChange(index, 'qty', parseInt(e.target.value))} className="w-full border p-2 rounded-lg outline-none focus:border-brand-blue text-sm text-center" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Unit Price</label>
                          <input required type="number" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} className="w-full border p-2 rounded-lg outline-none focus:border-brand-blue text-sm text-right" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Description (Optional)</label>
                      <input value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-full border p-2 rounded-lg outline-none focus:border-brand-blue text-sm" placeholder="Additional details..." />
                    </div>
                  </div>
                  <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5">
                    <Trash size={18} />
                  </button>
                </div>
              ))}
              
              {items.length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl">
                  Click "Add Item" to start building the quote.
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-8 border-t pt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-black text-brand-dark pt-2 border-t">
                    <span>Total:</span>
                    <span>Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button disabled={saving || items.length === 0} type="submit" className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={20} /> : "Save & Generate Quotation"}
          </button>
        </div>
      </form>
    </div>
  );
}
