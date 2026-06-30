import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ImageUploader from './ImageUploader';

const LANGS = ['en', 'es', 'cat'];
const LANG_LABELS = { en: 'EN', es: 'ES', cat: 'CAT' };

const EMPTY_IMG = { id: null, name: { en: '', es: '', cat: '' }, tagline: { en: '', es: '', cat: '' }, image: '' };

function ImgForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const setLangField = (key, value) => setForm(f => ({ ...f, [key]: { ...f[key], [lang]: value } }));

  const handleSaveClick = async () => {
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="bg-[#0d0002] border border-[#E6C587]/20 rounded-2xl p-6 space-y-4 mb-4">
      <div className="flex gap-2 pb-4 border-b border-[#E6C587]/10">
        {LANGS.map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${lang === l ? 'bg-[#E6C587]/20 text-[#E6C587] border border-[#E6C587]/40' : 'text-white/30 hover:text-white/60'}`}>{LANG_LABELS[l]}</button>
        ))}
      </div>
      
      <div className="mb-4">
        <ImageUploader 
          label="Gallery Image" 
          value={form.image} 
          onChange={(val) => setField('image', val)} 
          placeholder="Drag & drop gallery image here" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Name ({LANG_LABELS[lang]})</label>
          <input value={form.name[lang]} onChange={e => setLangField('name', e.target.value)} placeholder="Image name..." className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Tagline ({LANG_LABELS[lang]})</label>
          <input value={form.tagline[lang]} onChange={e => setLangField('tagline', e.target.value)} placeholder="Short tagline..." className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={handleSaveClick} disabled={loading} className="px-6 py-2.5 bg-[#E6C587] text-[#0d0002] font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
          {loading ? 'Saving...' : 'Save Image'}
        </button>
        <button onClick={onCancel} disabled={loading} className="px-6 py-2.5 border border-[#E6C587]/20 text-white/50 font-bold text-xs tracking-widest uppercase rounded-xl hover:text-white/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed">Cancel</button>
      </div>
    </div>
  );
}

export default function GalleryEditor() {
  const { galleryImages, updateGallery } = useAdmin();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleSave = async (form) => {
    try {
      const { adminAddGalleryImage, adminUpdateGalleryImage } = await import('../api/admin.service.js');
      if (form.id) {
        // Update existing gallery image via API
        const updated = await adminUpdateGalleryImage(form.id, form);
        updateGallery(galleryImages.map(g => g.id === form.id ? updated.data : g));
      } else {
        const created = await adminAddGalleryImage(form);
        updateGallery([...galleryImages, created.data]);
      }
      setEditing(null);
      setAdding(false);
    } catch (error) {
      console.error('Failed to save gallery image:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this image?')) {
      try {
        setDeletingId(id);
        const { adminDeleteGalleryImage } = await import('../api/admin.service.js');
        await adminDeleteGalleryImage(id);
        updateGallery(galleryImages.filter(g => g.id !== id));
      } catch (error) {
        console.error('Failed to delete gallery image:', error);
        alert('Failed to delete image.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0a0001]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#E6C587]/50 text-[10px] font-bold tracking-widest uppercase mb-1">Content</p>
          <h1 className="text-2xl font-serif text-white" style={{ fontFamily: "'Cinzel', serif" }}>Gallery</h1>
        </div>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#E6C587] text-[#0d0002] font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Image
          </button>
        )}
      </div>

      {adding && <ImgForm initial={EMPTY_IMG} onSave={handleSave} onCancel={() => setAdding(false)} />}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(galleryImages || []).map(img => (
          <div key={img.id}>
            {editing === img.id ? null : (
              <div className="relative group rounded-2xl overflow-hidden bg-[#130004] border border-[#E6C587]/10">
                <img src={img.image} alt={img.name?.en} className="w-full h-40 object-cover opacity-70 group-hover:opacity-90 transition-opacity" onError={e => { e.target.style.display='none'; }} />
                <div className="p-3">
                  <p className="text-white text-xs font-bold truncate">{img.name?.en}</p>
                  <p className="text-[#E6C587]/40 text-[10px] truncate">{img.tagline?.en}</p>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => setEditing(img.id)} disabled={deletingId === img.id} className="px-3 py-1.5 bg-[#E6C587] text-[#0d0002] text-xs font-bold rounded-lg disabled:opacity-50">Edit</button>
                  <button onClick={() => handleDelete(img.id)} disabled={deletingId === img.id} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-1">
                    {deletingId === img.id && <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                    {deletingId === img.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
            {editing === img.id && <ImgForm initial={img} onSave={handleSave} onCancel={() => setEditing(null)} />}
          </div>
        ))}
      </div>
      {galleryImages.length === 0 && !adding && (
        <div className="text-center py-16 text-white/20 text-sm">No gallery images. Click "Add Image" to start.</div>
      )}
    </div>
  );
}
