"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Cpu, MapPin, Phone, User, Mail, Eye, EyeOff } from "lucide-react";
import { useState, FormEvent, useEffect, useRef, useMemo } from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutModal({ isOpen, onClose, mode = 'checkout' }: { isOpen: boolean, onClose: () => void, mode?: 'checkout' | 'quotation' }) {
  const { items, totalAmount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentGatewayEnabled, setPaymentGatewayEnabled] = useState(true);
  
  const [processorId, setProcessorId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buyingFullSet, setBuyingFullSet] = useState(false);
  const [shopName, setShopName] = useState("");
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Modals for errors/conflicts
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  
  const checkoutFormRef = useRef<HTMLFormElement | null>(null);

  const hasSoftware = items.some(item => item.type === 'software');
  const hasHardware = items.some(item => item.type === 'hardware');
  const hasCloudDashboard = items.some(item => item.id === 'lumio-cloud-001' || item.name.toLowerCase().includes('cloud dashboard'));
  
  const generateOrderDescription = () => {
    return items.map(i => `${i.name} (x${i.quantity})`).join(', ');
  };

  useEffect(() => {
    if (isOpen) {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.settings && data.settings.payment_gateway_enabled === 'false') {
            setPaymentGatewayEnabled(false);
          } else {
            setPaymentGatewayEnabled(true);
          }
        })
        .catch(err => console.error("Error fetching settings:", err));
    }
  }, [isOpen]);

  const orderId = useMemo(() => {
    return hasSoftware ? `LUMIO-SW-${Math.floor(Math.random() * 1000000)}` : `LUMIO-HW-${Math.floor(Math.random() * 1000000)}`;
  }, [hasSoftware]);

  const handlePaymentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCheckingOut(true);
    
    if (mode === 'quotation') {
      try {
        // Load jsPDF from CDN
        if (!(window as any).jspdf) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF({ format: 'a4', unit: 'pt' });
        
        // Preload images
        const preloadedImages: Record<string, string> = {};
        
        // Preload logo
        try {
          const res = await fetch('/images/Logo.png');
          const blob = await res.blob();
          const reader = new FileReader();
          preloadedImages['logo'] = await new Promise<string>(r => {
            reader.onloadend = () => r(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch(e) { console.error("Logo load failed", e); }

        await Promise.all(items.map(async (item) => {
          if (item.image) {
            try {
              const res = await fetch(item.image);
              const blob = await res.blob();
              const reader = new FileReader();
              preloadedImages[item.id] = await new Promise<string>(r => {
                reader.onloadend = () => r(reader.result as string);
                reader.readAsDataURL(blob);
              });
            } catch(e) { console.error("Image load failed", e); }
          }
        }));

        let serverQuoteNo = null;
        try {
          const apiRes = await fetch('/api/quotations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_name: name || 'Online Client',
              client_attention: address || '',
              client_phone: phone || '',
              client_email: email || '',
              items: items,
              subtotal: totalAmount,
              vat: 0,
              total: totalAmount
            })
          });
          if (apiRes.ok) {
            const data = await apiRes.json();
            serverQuoteNo = data.quote_number;
          }
        } catch(apiErr) {
          console.error("Failed to save quote to DB", apiErr);
        }

        const quoteNo = serverQuoteNo || `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
        const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const expiryStr = new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        // HEADER
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(43, 84, 212); // Brand Blue
        doc.text("QUOTATION", 550, 50, { align: 'right' });
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(quoteNo, 550, 65, { align: 'right' });
        doc.text(`Quote Date: ${dateStr}`, 550, 78, { align: 'right' });

        // LOGO
        let titleX = 40;
        if (preloadedImages['logo']) {
          try {
            // Draw logo image (x: 40, y: 35, width: 25, height: 25)
            doc.addImage(preloadedImages['logo'], 'PNG', 40, 35, 25, 25);
            titleX = 72; // Shift text right
          } catch (e) {
            console.error("Error drawing logo", e);
          }
        }

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42); // Brand Dark
        doc.text("LUMIO POS", titleX, 55);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "italic");
        doc.text("Empowering Businesses with Next-Gen Tech.", titleX + 2, 68);

        // BOXES
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(40, 100, 240, 100, 5, 5, 'FD');
        doc.roundedRect(310, 100, 245, 100, 5, 5, 'FD');

        // BILL TO BOX
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("BILL TO", 50, 120);
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(name || "Client Name", 50, 138);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        let yBill = 155;
        if (address) { doc.setTextColor(120); doc.text("Address", 50, yBill); doc.setTextColor(50); doc.text(address, 100, yBill); yBill += 14; }
        doc.setTextColor(120); doc.text("Telephone", 50, yBill); doc.setTextColor(50); doc.text(phone || "-", 100, yBill); yBill += 14;
        if (email) { doc.setTextColor(120); doc.text("Email", 50, yBill); doc.setTextColor(50); doc.text(email, 100, yBill); }

        // QUOTE DETAILS BOX
        doc.setFont("helvetica", "bold");
        doc.setTextColor(150, 150, 150);
        doc.text("QUOTE DETAILS", 320, 120);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120);
        doc.text("Quote #", 320, 140); 
        doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42); doc.text(quoteNo, 540, 140, { align: 'right' });
        
        doc.setFont("helvetica", "normal"); doc.setTextColor(120); doc.text("Quote Date", 320, 155); 
        doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42); doc.text(dateStr, 540, 155, { align: 'right' });
        
        doc.setFont("helvetica", "normal"); doc.setTextColor(120); doc.text("Expiry Date", 320, 170); 
        doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42); doc.text(expiryStr, 540, 170, { align: 'right' });
        
        doc.setFont("helvetica", "normal"); doc.setTextColor(120); doc.text("Status", 320, 185); 
        doc.setFont("helvetica", "bold"); doc.setTextColor(15, 23, 42); doc.text("DRAFT", 540, 185, { align: 'right' });

        // TABLE
        const tableBody = items.map(item => [
          item.name, // We'll draw the image next to it
          Number(item.price).toLocaleString(undefined, {minimumFractionDigits: 2}),
          item.quantity.toString(),
          (item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})
        ]);

        (doc as any).autoTable({
          startY: 230,
          head: [['Description', 'Unit Price (LKR)', 'Qty', 'Total (LKR)']],
          body: tableBody,
          theme: 'plain',
          headStyles: { fillColor: [65, 105, 225], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
          bodyStyles: { textColor: [50, 50, 50], fontSize: 9, minCellHeight: 50 },
          columnStyles: {
            0: { cellWidth: 280 },
            1: { halign: 'right' },
            2: { halign: 'center' },
            3: { halign: 'right' }
          },
          didDrawCell: function(data: any) {
            // Draw images in the first column
            if (data.column.index === 0 && data.cell.section === 'body') {
              const item = items[data.row.index];
              const imgSrc = preloadedImages[item.id];
              
              if (imgSrc) {
                try {
                  doc.addImage(imgSrc, 'JPEG', data.cell.x + 5, data.cell.y + 5, 40, 40);
                } catch(e) {}
                
                // Redraw text next to image
                doc.setFont("helvetica", "bold");
                doc.setTextColor(15, 23, 42);
                doc.text(item.name, data.cell.x + 55, data.cell.y + 15, { maxWidth: 220 });
                doc.setFont("helvetica", "normal");
                doc.setTextColor(120, 120, 120);
                doc.setFontSize(8);
                doc.text("Genuine POS product with standard warranty.", data.cell.x + 55, data.cell.y + 28, { maxWidth: 220 });
              } else {
                // If no image, just draw text normally
                doc.setFont("helvetica", "bold");
                doc.setTextColor(15, 23, 42);
                doc.text(item.name, data.cell.x + 5, data.cell.y + 15, { maxWidth: 260 });
              }
            }
            
            // Draw bottom border for each cell
            if (data.cell.section === 'body') {
              doc.setDrawColor(240, 240, 240);
              doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
            }
          },
          willDrawCell: function(data: any) {
            // Hide the default text for column 0 since we draw it manually in didDrawCell
            if (data.column.index === 0 && data.cell.section === 'body') {
              data.cell.text = '';
            }
          }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 20;

        // SUMMARY BOX
        doc.setDrawColor(220, 220, 220);
        doc.roundedRect(330, finalY, 225, 65, 5, 5, 'S');

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal (LKR)", 340, finalY + 18);
        doc.text(totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2}), 545, finalY + 18, { align: 'right' });

        doc.text("VAT (0.00%)", 340, finalY + 33);
        doc.text("0.00", 545, finalY + 33, { align: 'right' });

        doc.setFont("helvetica", "bold");
        doc.setTextColor(43, 84, 212); // Brand Blue
        doc.text("Total (LKR)", 340, finalY + 52);
        doc.setFontSize(12);
        doc.text(totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2}), 545, finalY + 52, { align: 'right' });

        // FOOTER
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150);
        doc.text("This is a system-generated document and does not require a signature.", 297, 800, { align: 'center' });
        doc.setFont("helvetica", "normal");
        doc.text(`Lumio POS Solutions (Pvt) Ltd  •  ${quoteNo}`, 297, 810, { align: 'center' });

        doc.save(`Quotation_${name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
        
        clearCart();
        onClose();
      } catch (err) {
        console.error("PDF generation error:", err);
        alert("Failed to generate PDF quotation. Please try again.");
      } finally {
        setIsCheckingOut(false);
      }
      return;
    }

    const form = e.currentTarget;
    try {
      if (mode === 'checkout') {
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('shop_name', shopName);
        formData.append('nic', nic);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address || 'N/A');
        formData.append('password', password);

        const regRes = await fetch('/api/auth/pre-register', {
          method: 'POST',
          body: formData,
        });

        if (!regRes.ok) {
          let errorMsg = "Failed to save pre-registration. Please check your details.";
          try {
            const data = await regRes.json();
            if (data.error) errorMsg = data.error;
          } catch (e) {}
          
          if (regRes.status === 409) {
             setConflictModalOpen(true);
          } else {
             setErrorModalMessage(errorMsg);
             setErrorModalOpen(true);
             setIsCheckingOut(false);
          }
          return; // Stop here. For conflict, wait for user to click "Proceed".
        }
      }

      await proceedToPayment(form);
    } catch (error) {
      console.error("Error generating hash", error);
      setErrorModalMessage("Payment initialization failed. Please try again.");
      setErrorModalOpen(true);
      setIsCheckingOut(false);
    }
  };

  const proceedToPayment = async (form: HTMLFormElement) => {
    try {
      const res = await fetch('/api/payhere/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          order_id: orderId, 
          amount: totalAmount.toFixed(2),
          currency: "LKR" 
        })
      });
      
      const data = await res.json();
      
      if (data.hash) {
        let hashInput = form.querySelector('input[name="hash"]') as HTMLInputElement;
        if (!hashInput) {
          hashInput = document.createElement('input');
          hashInput.type = 'hidden';
          hashInput.name = 'hash';
          form.appendChild(hashInput);
        }
        hashInput.value = data.hash;

        let merchantInput = form.querySelector('input[name="merchant_id"]') as HTMLInputElement;
        if (merchantInput && data.merchant_id) {
          merchantInput.value = data.merchant_id;
          // Set action URL based on Sandbox or Live (Sandbox IDs start with 1)
          if (data.merchant_id.toString().startsWith('1')) {
            form.action = "https://sandbox.payhere.lk/pay/checkout";
          } else {
            form.action = "https://www.payhere.lk/pay/checkout";
          }
        }

        form.submit();
      } else {
        setErrorModalMessage("Payment initialization failed. Please try again.");
        setErrorModalOpen(true);
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("Error generating hash", error);
      setErrorModalMessage("Payment initialization failed. Please try again.");
      setErrorModalOpen(true);
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-dark/60 backdrop-blur-sm px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-brand-dark">
                {mode === 'quotation' ? 'Request Quotation' : 'Checkout Details'}
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-2"
              >
                <X size={20} />
              </button>
            </div>
            
            {mode === 'checkout' && !paymentGatewayEnabled ? (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏦</span>
                </div>
                <h4 className="text-xl font-bold text-orange-800 mb-2">Online Payments Disabled</h4>
                <p className="text-orange-700 font-medium mb-4">
                  We are currently accepting payments via Bank Transfers only. Our online payment gateway is temporarily disabled while we verify our business registration.
                </p>
                <div className="bg-white rounded-xl p-4 border border-orange-100 text-left mb-6 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Total Amount Due:</p>
                  <p className="text-2xl font-black text-brand-dark mb-4">LKR {totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  
                  <p className="text-sm font-bold text-gray-700">Bank Details:</p>
                  <p className="text-sm text-gray-600">Bank: Commercial Bank</p>
                  <p className="text-sm text-gray-600">Account No: 8009124450</p>
                  <p className="text-sm text-gray-600">Branch: Matara</p>
                </div>
                <p className="text-sm text-orange-600 font-bold mb-4">
                  Please WhatsApp the bank transfer slip to +94 74 255 6665 to process your order.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full py-4 rounded-xl font-bold text-orange-900 bg-orange-200 hover:bg-orange-300 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
            <form ref={checkoutFormRef} onSubmit={handlePaymentSubmit} method={mode === 'checkout' ? "post" : undefined}>
              {/* PayHere Hidden Fields */}
              {mode === 'checkout' && (
                <>
                  <input type="hidden" name="merchant_id" value="" />
                  <input type="hidden" name="return_url" value={`${typeof window !== 'undefined' ? window.location.origin : 'https://lumiopos.store'}?payment=success`} />
                  <input type="hidden" name="cancel_url" value={`${typeof window !== 'undefined' ? window.location.origin : 'https://lumiopos.store'}`} />
                  <input type="hidden" name="notify_url" value={`https://lumiopos.store/api/notify`} />  {/* Notify URL must be accessible from internet, so keep it hardcoded or use env var */}
                  <input type="hidden" name="order_id" value={orderId} />
                  <input type="hidden" name="items" value={generateOrderDescription()} />
                  <input type="hidden" name="currency" value="LKR" />
                  <input type="hidden" name="amount" value={totalAmount.toFixed(2)} />  
                  <input type="hidden" name="city" value="Colombo" />
                  <input type="hidden" name="country" value="Sri Lanka" />
                  {!hasHardware && <input type="hidden" name="address" value="N/A" />}
                  <input type="hidden" name="custom_1" value={`${buyingFullSet ? "PRE-INSTALLED" : processorId}|${email}`} />
                  <input type="hidden" name="custom_2" value={hasCloudDashboard ? "yes" : "no"} />
                </>
              )}

              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User size={18} /></div>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} name="first_name" placeholder="John Doe" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
                    {mode === 'checkout' && <input type="hidden" name="last_name" value="" />}
                  </div>
                </div>

                {mode === 'checkout' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Shop/Business Name</label>
                        <input type="text" required value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="My Shop" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">NIC Number</label>
                        <input type="text" required value={nic} onChange={(e) => setNic(e.target.value)} placeholder="199XXXXXXXXX" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Email Address {mode === 'checkout' && '(For receipts & licenses)'}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} name="email" placeholder="john@example.com" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
                  </div>
                </div>

                {mode === 'checkout' && (
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">Account Password (To login later)</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Phone size={18} /></div>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} name="phone" placeholder="07XXXXXXXX" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
                  </div>
                </div>

                {(hasHardware || mode === 'quotation') && (
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-1">
                      {mode === 'quotation' ? 'Address' : 'Delivery Address (Required for hardware)'}
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-4 flex pointer-events-none text-gray-400"><MapPin size={18} /></div>
                      <textarea required value={address} onChange={(e) => setAddress(e.target.value)} name="address" rows={2} placeholder="123 Main St, Colombo" className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all" />
                    </div>
                  </div>
                )}

                {(hasSoftware && mode === 'checkout') && (
                  <div className="pt-4 border-t">
                    <label className="text-sm font-bold text-brand-dark block mb-1">Processor ID (Required for License)</label>
                    <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                      Find this inside the Lumio POS desktop app under Settings &gt; License.
                    </p>
                    
                    <label className="flex items-start gap-3 p-3 bg-gray-50 border rounded-xl mb-3 cursor-pointer hover:bg-gray-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={buyingFullSet}
                        onChange={(e) => setBuyingFullSet(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                      />
                      <span className="text-sm text-gray-700">
                        I am buying a Full Computer from Lumio POS. Please pre-install the software for me (Processor ID not needed).
                      </span>
                    </label>

                    {!buyingFullSet && (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-blue"><Cpu size={20} /></div>
                        <input 
                          type="text" required={hasSoftware && !buyingFullSet && mode === 'checkout'} value={processorId} onChange={(e) => setProcessorId(e.target.value)} 
                          placeholder="e.g. BFEBFBFF000906EA" 
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all font-mono uppercase bg-blue-50/30"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="button" onClick={onClose}
                  className="flex-1 py-4 rounded-xl font-medium text-brand-dark bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isCheckingOut || (hasSoftware && !processorId && !buyingFullSet && mode === 'checkout')}
                  className="flex-[2] py-4 rounded-xl font-bold text-white bg-brand-blue hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    mode === 'quotation' ? 'Download Quotation PDF' : `Pay Rs. ${totalAmount.toLocaleString()}`
                  )}
                </button>
              </div>
            </form>
            )}
          </motion.div>

          {/* Hidden Printable Area */}
          <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
            <div id="quotation-print-area" className="bg-white p-10 w-[800px] text-gray-800 font-sans" style={{ minHeight: '1056px' }}>
              {/* Header */}
              <div className="flex justify-between items-start border-b-[3px] border-gray-100 pb-6 mb-10">
                <div className="flex flex-col">
                  <h1 className="text-4xl font-black text-brand-dark tracking-tight uppercase">LUMIO POS</h1>
                  <p className="text-sm font-medium text-brand-blue mt-1">Smart Point of Sale Solutions</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-black text-brand-blue uppercase mb-2 tracking-wide">Quotation</h2>
                  <p className="text-gray-600 font-medium">Q-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000)}</p>
                  <p className="text-gray-500 text-sm">Quote Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Details Boxes */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/30">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Bill To</h3>
                  <p className="text-lg font-bold text-brand-dark mb-3">{name || 'Client Name'}</p>
                  <div className="grid grid-cols-[80px_1fr] gap-y-2 text-sm text-gray-600">
                    {address && <><span className="text-gray-400">Address</span><span className="font-medium leading-tight">{address}</span></>}
                    <span className="text-gray-400">Telephone</span><span className="font-medium">{phone || '-'}</span>
                    {email && <><span className="text-gray-400">Email</span><span className="font-medium">{email}</span></>}
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/30">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quote Details</h3>
                  <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm text-gray-600">
                    <span className="text-gray-400">Quote #</span><span className="font-bold text-brand-dark">Q-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000)}</span>
                    <span className="text-gray-400">Quote Date</span><span className="font-medium">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-gray-400">Expiry Date</span><span className="font-medium">{new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-gray-400">Status</span><span className="font-black text-brand-dark tracking-wide">DRAFT</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-blue text-white text-sm">
                      <th className="py-4 px-5 font-bold tracking-wide w-[50%]">Description</th>
                      <th className="py-4 px-5 font-bold tracking-wide text-right w-[15%]">Unit Price (LKR)</th>
                      <th className="py-4 px-5 font-bold tracking-wide text-center w-[15%]">Qty</th>
                      <th className="py-4 px-5 font-bold tracking-wide text-right w-[20%]">Total (LKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="py-5 px-5 flex items-start gap-4">
                          {item.image && (
                            <div className="w-16 h-16 rounded-lg border border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-brand-dark text-[15px] mb-1.5">{item.name}</p>
                            <p className="text-[11px] text-gray-500 leading-relaxed">Genuine POS hardware/software item. Includes standard manufacturer warranty and technical support.</p>
                          </div>
                        </td>
                        <td className="py-5 px-5 text-right font-medium text-gray-700 align-top pt-6">
                          {Number(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </td>
                        <td className="py-5 px-5 text-center font-medium text-gray-700 align-top pt-6">
                          {item.quantity}
                        </td>
                        <td className="py-5 px-5 text-right font-bold text-brand-dark align-top pt-6">
                          {(item.quantity * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-80 border border-gray-200 rounded-xl p-6 bg-gray-50/30">
                  <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
                    <span className="font-medium">Subtotal (LKR)</span>
                    <span className="font-bold">{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <span className="font-medium">VAT (0.00%)</span>
                    <span className="font-bold">0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="font-black text-brand-blue text-lg">Total (LKR)</span>
                    <span className="font-black text-brand-blue text-xl">{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-20 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                <p className="italic mb-1 font-medium">This is a system-generated document and does not require a signature.</p>
                <p>Lumio POS Solutions (Pvt) Ltd • Q-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      <AnimatePresence>
        {errorModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <X size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Notice</h3>
              <p className="text-gray-500 mb-8">{errorModalMessage}</p>
              <button 
                onClick={() => setErrorModalOpen(false)}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-brand-blue hover:bg-blue-700 transition-colors"
              >
                Okay
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Conflict Modal for Returning Customers */}
      <AnimatePresence>
        {conflictModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative"
            >
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                Welcome Back!
              </div>
              <div className="w-16 h-16 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Account Already Exists</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                We noticed that an account with this Email or NIC already exists. 
                <br/><br/>
                You can proceed with this purchase, and it will be linked to your existing account. No need to register again!
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setConflictModalOpen(false); setIsCheckingOut(false); }}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                      setConflictModalOpen(false);
                      setIsCheckingOut(true);
                      if (checkoutFormRef.current) proceedToPayment(checkoutFormRef.current);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-brand-blue hover:bg-blue-700 transition-colors"
                >
                  Proceed to Pay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
