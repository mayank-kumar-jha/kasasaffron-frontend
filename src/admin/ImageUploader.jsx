import React, { useRef, useState } from 'react';
import { adminUploadImage } from '../api/admin.service.js';

export default function ImageUploader({ value, onChange, label = "Image", placeholder = "Drag & drop an image here or click to browse" }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    setIsDragging(false);

    // Try uploading to Cloudinary via backend first
    try {
      const cloudinaryUrl = await adminUploadImage(file);
      if (cloudinaryUrl) {
        onChange(cloudinaryUrl);
        return;
      }
    } catch {
      // Backend not connected yet — fall back to Base64 preview
    }

    // Fallback: convert to Base64 (works locally without backend)
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-[#E6C587] text-sm font-serif mb-2">{label}</label>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-[#BD561A] bg-[#BD561A]/10' : 'border-[#E6C587]/30 bg-[#1a0004] hover:border-[#E6C587]/60'}`}
        style={{ minHeight: '160px' }}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {value ? (
          <div className="relative w-full h-full flex flex-col items-center">
            <div className="relative w-full max-w-[200px] aspect-video rounded-lg overflow-hidden bg-black/50 mb-3">
              <img src={value} alt="Preview" className="w-full h-full object-contain" />
            </div>
            <button 
              type="button" 
              onClick={handleRemove}
              className="px-4 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 text-xs rounded-full transition-colors border border-red-500/30"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg className="w-10 h-10 mx-auto text-[#E6C587]/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-[#E6C587]/70 text-sm font-medium">{placeholder}</p>
            <p className="text-[#E6C587]/40 text-xs mt-1">Supports JPG, PNG, GIF</p>
          </div>
        )}
      </div>

      <div className="mt-3">
        <label className="block text-[#E6C587]/70 text-xs mb-1">Or paste image URL (https://... or /Images/...)</label>
        <input 
          type="text" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL" 
          className="w-full p-2.5 bg-[#1a0004] border border-[#E6C587]/20 rounded-lg text-white focus:outline-none focus:border-[#E6C587]/50 text-sm"
        />
      </div>
    </div>
  );
}
