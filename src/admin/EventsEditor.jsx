import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ImageUploader from './ImageUploader';

const LANGS = ['en', 'es', 'cat'];
const LANG_LABELS = { en: 'EN', es: 'ES', cat: 'CAT' };

const CATEGORY_SUGGESTIONS = [
  'New Flavour',
  'Kitchen Opening',
  'Partnership',
  'Expansion',
  'Milestone',
  'Product Launch',
  'Award',
];

const EMPTY_EVENT = {
  id: null,
  title: { en: '', es: '', cat: '' },
  date: '',
  time: '',       // Repurposed as "category"
  location: '',
  description: { en: '', es: '', cat: '' },
  image: '',
};

function AnnouncementForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const setLangField = (key, value) => setForm(f => ({ ...f, [key]: { ...f[key], [lang]: value } }));

  const handleSaveClick = async () => {
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="bg-[#0d0002] border border-[#E6C587]/20 rounded-2xl p-6 space-y-5">
      {/* Lang Tabs */}
      <div className="flex gap-2 pb-4 border-b border-[#E6C587]/10">
        {LANGS.map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${lang === l ? 'bg-[#E6C587]/20 text-[#E6C587] border border-[#E6C587]/40' : 'text-white/30 hover:text-white/60'}`}>{LANG_LABELS[l]}</button>
        ))}
        <span className="ml-auto text-[10px] text-white/20 self-center">Editing: {LANG_LABELS[lang]}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <ImageUploader 
            label="Cover Image" 
            value={form.image} 
            onChange={(val) => setField('image', val)} 
            placeholder="Drag & drop a cover image for this announcement" 
          />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Headline ({LANG_LABELS[lang]})</label>
          <input value={form.title[lang]} onChange={e => setLangField('title', e.target.value)} placeholder="e.g. Launching Our New Truffle Saffron Croqueta" className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Date</label>
          <input type="date" value={form.date} onChange={e => setField('date', e.target.value)} className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40" />
        </div>
        <div className="relative">
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Category</label>
          <input 
            value={form.time} 
            onChange={e => setField('time', e.target.value)} 
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="e.g. New Flavour, Kitchen Opening" 
            className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" 
          />
          {/* Category Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute z-20 top-full mt-1 left-0 w-full bg-[#1a0508] border border-[#E6C587]/20 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden py-1">
              {CATEGORY_SUGGESTIONS.map(cat => (
                <button
                  key={cat}
                  onMouseDown={() => {
                    setField('time', cat);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-white/60 hover:text-[#E6C587] hover:bg-[#E6C587]/[0.06] transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Location / Context <span className="text-white/15 normal-case tracking-normal">(optional)</span></label>
          <input value={form.location} onChange={e => setField('location', e.target.value)} placeholder="e.g. Barcelona Central Kitchen" className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Announcement Body ({LANG_LABELS[lang]})</label>
          <textarea value={form.description[lang]} onChange={e => setLangField('description', e.target.value)} rows={4} placeholder="Share the details of this announcement..." className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20 resize-none" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSaveClick} disabled={loading} className="px-6 py-2.5 bg-[#E6C587] text-[#0d0002] font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
          {loading ? 'Saving...' : 'Save Announcement'}
        </button>
        <button onClick={onCancel} disabled={loading} className="px-6 py-2.5 border border-[#E6C587]/20 text-white/50 font-bold text-xs tracking-widest uppercase rounded-xl hover:text-white/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed">Cancel</button>
      </div>
    </div>
  );
}

export default function EventsEditor() {
  const { events, updateEvents } = useAdmin();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleSave = async (form) => {
    try {
      const { adminCreateEvent, adminUpdateEvent } = await import('../api/admin.service.js');
      if (form.id) {
        const updated = await adminUpdateEvent(form.id, form);
        updateEvents(events.map(e => e.id === form.id ? updated.data : e));
      } else {
        const created = await adminCreateEvent(form);
        updateEvents([...events, created.data]);
      }
      setEditing(null);
      setAdding(false);
    } catch (error) {
      console.error('Failed to save announcement:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        setDeletingId(id);
        const { adminDeleteEvent } = await import('../api/admin.service.js');
        await adminDeleteEvent(id);
        updateEvents(events.filter(e => e.id !== id));
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Failed to delete.');
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
          <h1 className="text-2xl font-serif text-white" style={{ fontFamily: "'Cinzel', serif" }}>News & Announcements</h1>
        </div>
        {!adding && !editing && (
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#E6C587] text-[#0d0002] font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Announcement
          </button>
        )}
      </div>

      {adding && <div className="mb-6"><AnnouncementForm initial={EMPTY_EVENT} onSave={handleSave} onCancel={() => setAdding(false)} /></div>}

      <div className="space-y-4">
        {(events || []).map(event => (
          <div key={event.id}>
            {editing === event.id ? (
              <AnnouncementForm initial={event} onSave={handleSave} onCancel={() => setEditing(null)} />
            ) : (
              <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-5 flex items-center gap-5">
                {event.image && <img src={event.image} alt="" className="w-20 h-16 object-cover rounded-xl flex-shrink-0 opacity-80" onError={e => { e.target.style.display='none'; }} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold text-sm truncate">{event.title?.en || 'Untitled'}</h3>
                    {event.time && (
                      <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-[#E6C587]/10 border border-[#E6C587]/20 text-[#E6C587] text-[9px] font-bold tracking-widest uppercase">
                        {event.time}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 text-[#E6C587]/40 text-xs">
                    <span>{event.date}</span>
                    {event.location && <span className="truncate">{event.location}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditing(event.id)} disabled={deletingId === event.id} className="px-4 py-2 bg-[#E6C587]/10 hover:bg-[#E6C587]/20 border border-[#E6C587]/20 text-[#E6C587] text-xs font-bold tracking-widest uppercase rounded-xl transition-all disabled:opacity-50">Edit</button>
                  <button onClick={() => handleDelete(event.id)} disabled={deletingId === event.id} className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercase rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {deletingId === event.id && <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                    {deletingId === event.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {events.length === 0 && !adding && (
          <div className="text-center py-16 text-white/20 text-sm">No announcements yet. Click "Add Announcement" to create one.</div>
        )}
      </div>
    </div>
  );
}
