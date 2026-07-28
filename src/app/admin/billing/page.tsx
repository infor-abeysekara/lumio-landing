"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";

export default function BillingPage() {
  const [softwarePrice, setSoftwarePrice] = useState("65000");
  const [saving, setSaving] = useState(false);

  // Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<"client" | "server">("client");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings?.software_price) {
          setSoftwarePrice(data.settings.software_price);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "software_price", value: softwarePrice })
      });
      if (res.ok) alert("Price updated successfully!");
      else alert("Failed to update price.");
    } catch (err) {
      alert("Error updating price.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadProgress(0);
      setUploadMessage("");
    }
  };

  const uploadFile = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", selectedType);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/software/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        setUploadMessage("Software uploaded successfully!");
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('software-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const res = JSON.parse(xhr.responseText);
        setUploadMessage(res.error || "Upload failed.");
      }
      setIsUploading(false);
    };

    xhr.onerror = () => {
      setUploadMessage("An error occurred during the upload.");
      setIsUploading(false);
    };

    xhr.send(formData);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Software & Billing</h1>
      <div className="grid lg:grid-cols-2 gap-8 mb-8 items-start">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-5 text-gray-800">Set Main Software Price</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Lumio POS Main License Price (LKR)</label>
            <input 
              type="number" 
              value={softwarePrice}
              onChange={(e) => setSoftwarePrice(e.target.value)}
              className="w-full border border-gray-200 focus:border-brand-blue p-3 rounded-xl outline-none"
              required 
            />
          </div>
          <button disabled={saving} type="submit" className="w-full bg-brand-blue hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={20}/> : "Save Price"}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Upload Software Installers</h2>
          <p className="text-sm text-gray-500 mb-6">
            Upload the compiled .exe setups here. Customers will be able to download them from the Download page.
          </p>

          <div className="flex gap-4 mb-6">
            <label className={`flex-1 flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${selectedType === 'client' ? 'border-brand-blue bg-blue-50 ring-2 ring-brand-blue/20' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="softwareType" value="client" checked={selectedType === 'client'} onChange={() => setSelectedType('client')} className="sr-only" />
              <span className="font-bold text-gray-800">Client Setup</span>
              <span className="text-xs text-gray-500 mt-1">Normal EXE for secondary PCs</span>
            </label>

            <label className={`flex-1 flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${selectedType === 'server' ? 'border-brand-blue bg-blue-50 ring-2 ring-brand-blue/20' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="softwareType" value="server" checked={selectedType === 'server'} onChange={() => setSelectedType('server')} className="sr-only" />
              <span className="font-bold text-gray-800">Server Setup</span>
              <span className="text-xs text-gray-500 mt-1">Full EXE with WAMP database</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-3">Select Software Installer File</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-brand-blue/50 transition-colors bg-gray-50/50">
                <input 
                  id="software-upload"
                  type="file" 
                  accept=".exe,application/x-msdownload,.zip,application/zip"
                  onChange={handleFileSelect}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-blue-600 transition-colors cursor-pointer"
                />
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                <div 
                  className="bg-brand-blue h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {uploadMessage && (
              <p className={`text-sm font-medium ${uploadMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {uploadMessage}
              </p>
            )}

            <button 
              onClick={uploadFile} 
              disabled={!selectedFile || isUploading} 
              className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-md"
            >
              {isUploading ? <Loader2 className="animate-spin" size={20}/> : <Upload size={20} />}
              {isUploading ? `Uploading... ${uploadProgress}%` : "Upload Software"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
