"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PrintQuotation() {
  const { id } = useParams();
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    async function fetchQuote() {
      // In a real app, we would have a specific GET /api/quotations/[id] route.
      // For this MVP, we fetch all and filter (or we could just pass data).
      // Let's assume we create a quick API for GET /api/quotations/[id].
      const res = await fetch(`/api/quotations/${id}`);
      if (res.ok) {
        setQuote(await res.json());
        setTimeout(() => window.print(), 500); // trigger print after render
      }
    }
    fetchQuote();
  }, [id]);

  if (!quote) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-blue" /></div>;
  }

  // Parse items
  let items = [];
  try {
    items = typeof quote.items === 'string' ? JSON.parse(quote.items) : quote.items;
  } catch(e) {}

  return (
    <div className="bg-white text-black min-h-screen w-full p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-brand-blue pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tighter">
            LUMIO<span className="text-brand-blue">POS</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">Lumnix Solutions</p>
          <p className="text-sm text-gray-400 mt-2">
            No. 123, Tech Park, Colombo 03.<br />
            Tel: +94 77 123 4567<br />
            Email: sales@lumiopos.com<br />
            Web: www.lumiopos.com
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-widest mb-2">Quotation</h2>
          <table className="text-sm border-collapse border border-gray-300 ml-auto">
            <tbody>
              <tr>
                <td className="border border-gray-300 bg-gray-100 font-bold px-3 py-1">Date</td>
                <td className="border border-gray-300 px-3 py-1">{new Date(quote.created_at).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 bg-gray-100 font-bold px-3 py-1">Quote #</td>
                <td className="border border-gray-300 px-3 py-1">{quote.quote_number}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8 flex gap-12">
        <div className="flex-1">
          <h3 className="bg-gray-800 text-white font-bold px-3 py-1 mb-2 inline-block">Quotation For:</h3>
          <p className="font-bold text-lg">{quote.client_name}</p>
          <p>Attn: <span className="font-medium">{quote.client_attention}</span></p>
          <p>Tel: {quote.client_phone}</p>
          <p>Email: {quote.client_email}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-brand-blue text-white">
            <th className="border border-gray-300 px-4 py-2 text-left w-12">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
            <th className="border border-gray-300 px-4 py-2 text-center w-24">Qty</th>
            <th className="border border-gray-300 px-4 py-2 text-right w-36">Unit Price</th>
            <th className="border border-gray-300 px-4 py-2 text-right w-36">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, idx: number) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="border border-gray-300 px-4 py-3 text-center">{idx + 1}</td>
              <td className="border border-gray-300 px-4 py-3">
                <span className="font-bold">{item.name}</span>
                {item.description && <div className="text-sm text-gray-500 mt-1">{item.description}</div>}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center">{item.qty || 1}</td>
              <td className="border border-gray-300 px-4 py-3 text-right">{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="border border-gray-300 px-4 py-3 text-right">{(Number(item.price) * (item.qty || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-16">
        <table className="w-64 border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="border border-gray-300 bg-gray-100 font-bold px-4 py-2 text-right">Subtotal</td>
              <td className="border border-gray-300 px-4 py-2 text-right">{Number(quote.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            {Number(quote.vat) > 0 && (
              <tr>
                <td className="border border-gray-300 bg-gray-100 font-bold px-4 py-2 text-right">VAT</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{Number(quote.vat).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            )}
            <tr className="bg-gray-800 text-white">
              <td className="border border-gray-800 font-bold px-4 py-3 text-right text-lg">Total (LKR)</td>
              <td className="border border-gray-800 font-bold px-4 py-3 text-right text-lg">{Number(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer / Terms */}
      <div className="text-sm text-gray-500 border-t pt-4">
        <h4 className="font-bold text-gray-800 mb-2">Terms & Conditions:</h4>
        <ul className="list-disc pl-4 space-y-1">
          <li>This quotation is valid for 14 days from the date of issue.</li>
          <li>Hardware items carry a 1-year standard warranty.</li>
          <li>Full payment is required upon delivery and installation.</li>
        </ul>
        
        <div className="mt-16 flex justify-between px-12">
          <div className="text-center border-t border-gray-400 w-48 pt-2">
            Prepared By
          </div>
          <div className="text-center border-t border-gray-400 w-48 pt-2">
            Customer Signature
          </div>
        </div>
      </div>
      
      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          /* Hide everything else if this was embedded, but it's its own page */
          @page { margin: 10mm; size: A4; }
        }
      `}} />
    </div>
  );
}
