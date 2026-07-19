"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";

export default function BillingPage() {
  const [softwarePrice, setSoftwarePrice] = useState("65000");
  const [saving, setSaving] = useState(false);

  // Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      alert("Price updated!");
      setSaving(false);
    }, 500);
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
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border max-w-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Set Main Software Price</h2>
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

      <div className="bg-white p-6 rounded-2xl shadow-sm border max-w-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Upload Software (ZIP)</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Select Software ZIP File</label>
            <input 
              id="software-upload"
              type="file" 
              accept=".zip,application/zip"
              onChange={handleFileSelect}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20 transition-colors"
            />
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

      <div className="bg-white p-8 rounded-2xl shadow-sm border text-center text-gray-500">
        Payment history and Add-on billing will be available when Client Dashboard is built.
      </div>
    </div>
  );
}
