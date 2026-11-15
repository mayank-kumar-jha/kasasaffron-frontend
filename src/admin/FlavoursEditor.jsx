import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ImageUploader from './ImageUploader';

const LANGS = ['en', 'es', 'cat'];
const LANG_LABELS = { en: 'EN', es: 'ES', cat: 'CAT' };

const EMPTY_FLAVOUR = {
  id: null,
  name: { en: '', es: '', cat: '' },
  tagline: { en: '', es: '', cat: '' },
  description: { en: '', es: '', cat: '' },
  notes: { en: '', es: '', cat: '' },
  ingredients: { en: '', es: '', cat: '' },
  spanishName: '',
  image: '',
  price500g: 12,
  price1kg: 20,
};

function FlavourForm({ initial, onSave, onCancel }) {
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
    <div className="bg-[#0d0002] border border-[#E6C587]/20 rounded-2xl p-6 space-y-5">
      <div className="flex gap-2 pb-4 border-b border-[#E6C587]/10">
        {LANGS.map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${lang === l ? 'bg-[#E6C587]/20 text-[#E6C587] border border-[#E6C587]/40' : 'text-white/30 hover:text-white/60'}`}>{LANG_LABELS[l]}</button>
        ))}
        <span className="ml-auto text-[10px] text-white/20 self-center">Editing: {LANG_LABELS[lang]}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <ImageUploader 
            label="Flavour Image" 
            value={form.image} 
            onChange={(val) => setField('image', val)} 
            placeholder="Drag & drop flavour image here" 
          />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Name ({LANG_LABELS[lang]})</label>
          <input value={form.name[lang]} onChange={e => setLangField('name', e.target.value)} placeholder="Flavour name..." className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Tagline ({LANG_LABELS[lang]})</label>
          <input value={form.tagline[lang]} onChange={e => setLangField('tagline', e.target.value)} placeholder="Short tagline..." className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Spanish Name</label>
          <input value={form.spanishName} onChange={e => setField('spanishName', e.target.value)} placeholder="Croquetas de..." className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Price 500g (€)</label>
          <input type="number" value={form.price500g} onChange={e => setField('price500g', Number(e.target.value))} className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40" />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Price 1kg (€)</label>
          <input type="number" value={form.price1kg} onChange={e => setField('price1kg', Number(e.target.value))} className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Description ({LANG_LABELS[lang]})</label>
          <textarea value={form.description[lang]} onChange={e => setLangField('description', e.target.value)} rows={3} placeholder="Detailed description..." className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20 resize-none" />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Notes ({LANG_LABELS[lang]})</label>
          <input value={form.notes?.[lang] || ''} onChange={e => setLangField('notes', e.target.value)} placeholder="Savory · Umami · Rich" className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Ingredients (Key) ({LANG_LABELS[lang]})</label>
          <input value={form.ingredients?.[lang] || ''} onChange={e => setLangField('ingredients', e.target.value)} placeholder="Iberian ham, whole milk..." className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
      </div>

      {form.image && <img src={form.image} alt="preview" className="h-28 w-full object-cover rounded-xl opacity-70" onError={e => { e.target.style.display='none'; }} />}

      <div className="flex gap-3 pt-2">
        <button onClick={handleSaveClick} disabled={loading} className="px-6 py-2.5 bg-[#E6C587] text-[#0d0002] font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
          {loading ? 'Saving...' : 'Save Flavour'}
        </button>
        <button onClick={onCancel} disabled={loading} className="px-6 py-2.5 border border-[#E6C587]/20 text-white/50 font-bold text-xs tracking-widest uppercase rounded-xl hover:text-white/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed">Cancel</button>
      </div>
    </div>
  );
}

export default function FlavoursEditor() {
  const { flavours, updateFlavours } = useAdmin();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleSave = async (form) => {
    try {
      const { adminCreateProduct, adminUpdateProduct } = await import('../api/admin.service.js');
      if (form.id) {
        const updated = await adminUpdateProduct(form.id, form);
        updateFlavours(flavours.map(f => f.id === form.id ? updated.data : f));
      } else {
        const created = await adminCreateProduct(form);
        updateFlavours([...flavours, created.data]);
      }
      setEditing(null);
      setAdding(false);
    } catch (error) {
      console.error('Failed to save flavour:', error);
      alert('Failed to save flavour. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this flavour?')) {
      try {
        setDeletingId(id);
        const { adminDeleteProduct } = await import('../api/admin.service.js');
        await adminDeleteProduct(id);
        updateFlavours(flavours.filter(f => f.id !== id));
      } catch (error) {
        console.error('Failed to delete flavour:', error);
        alert('Failed to delete flavour.');
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
          <h1 className="text-2xl font-serif text-white" style={{ fontFamily: "'Cinzel', serif" }}>Flavours</h1>
        </div>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#E6C587] text-[#0d0002] font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Flavour
          </button>
        )}
      </div>

      {adding && <div className="mb-6"><FlavourForm initial={EMPTY_FLAVOUR} onSave={handleSave} onCancel={() => setAdding(false)} /></div>}

      <div className="space-y-3">
        {(flavours || []).map(flavour => (
          <div key={flavour.id}>
            {editing === flavour.id ? (
              <FlavourForm initial={flavour} onSave={handleSave} onCancel={() => setEditing(null)} />
            ) : (
              <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-4 flex items-center gap-4">
                <img src={flavour.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0 opacity-80" onError={e => { e.target.style.display='none'; }} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm truncate">{flavour.name?.en}</h3>
                  <p className="text-[#E6C587]/40 text-xs italic">{flavour.spanishName}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[#E6C587]/60 text-[10px]">500g: €{flavour.price500g}</span>
                    <span className="text-[#E6C587]/60 text-[10px]">1kg: €{flavour.price1kg}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditing(flavour.id)} disabled={deletingId === flavour.id} className="px-4 py-2 bg-[#E6C587]/10 hover:bg-[#E6C587]/20 border border-[#E6C587]/20 text-[#E6C587] text-xs font-bold tracking-widest uppercase rounded-xl transition-all disabled:opacity-50">Edit</button>
                  <button onClick={() => handleDelete(flavour.id)} disabled={deletingId === flavour.id} className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercase rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {deletingId === flavour.id && <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                    {deletingId === flavour.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
