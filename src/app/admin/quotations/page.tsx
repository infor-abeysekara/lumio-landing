"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Printer, Eye } from "lucide-react";
import Link from "next/link";

export default function QuotationsList() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch('/api/quotations');
        if (res.ok) setQuotes(await res.json());
      } catch (e) {} finally {
        setLoading(false);
      }
    }
    fetchQuotes();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Quotations</h1>
        <Link 
          href="/admin/quotations/new"
          className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm shadow-brand-blue/30"
        >
          <Plus size={20} /> Create Manual Quote
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-brand-blue" size={32} /></div>
        ) : quotes.length === 0 ? (
          <div className="py-20 text-center text-gray-500">No quotations found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">Quote Number</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">Date</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm">Client Name</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-right">Total (LKR)</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-center">Status</th>
                <th className="px-6 py-4 font-bold text-gray-600 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.map(q => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-brand-dark">{q.quote_number}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(q.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">{q.client_name}</td>
                  <td className="px-6 py-4 text-right font-bold text-brand-blue">
                    {Number(q.total).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <a 
                      href={`/print/quotation/${q.id}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                      title="View & Print"
                    >
                      <Printer size={20} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
