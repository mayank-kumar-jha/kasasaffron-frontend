import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ImageUploader from './ImageUploader';

const LANGS = ['en', 'es', 'cat'];
const LANG_LABELS = { en: 'EN', es: 'ES', cat: 'CAT' };

function LangField({ label, value, onChange, multiline, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20 resize-none" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 bg-[#130004] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20" />
      )}
    </div>
  );
}

export default function AboutEditor() {
  const { aboutData, updateAbout } = useAdmin();
  const DEFAULT_FORM = {
    intro1: { en: '', es: '', cat: '' },
    intro2: { en: '', es: '', cat: '' },
    feat1Title: { en: '', es: '', cat: '' },
    feat1Desc: { en: '', es: '', cat: '' },
    feat2Title: { en: '', es: '', cat: '' },
    feat2Desc: { en: '', es: '', cat: '' },
    chefImage: '',
    chetnaRole: { en: '', es: '', cat: '' },
    chetnaP1: { en: '', es: '', cat: '' },
    chetnaP2: { en: '', es: '', cat: '' },
    chetnaP3: { en: '', es: '', cat: '' },
    founderImage: '',
    lovieshRole: { en: '', es: '', cat: '' },
    lovieshP1: { en: '', es: '', cat: '' },
    lovieshP2: { en: '', es: '', cat: '' },
    lovieshImage: '',
  };

  const mergeData = (data) => {
    if (!data) return DEFAULT_FORM;
    const merged = { ...DEFAULT_FORM };
    Object.keys(DEFAULT_FORM).forEach(key => {
      if (data[key] !== undefined) {
        if (typeof DEFAULT_FORM[key] === 'object') {
          merged[key] = { ...DEFAULT_FORM[key], ...data[key] };
        } else {
          merged[key] = data[key];
        }
      }
    });
    return merged;
  };

  const [form, setForm] = useState(() => mergeData(aboutData));
  const [lang, setLang] = useState('en');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState('history');

  React.useEffect(() => {
    setForm(mergeData(aboutData));
  }, [aboutData]);

  const setLangField = (key, value) => setForm(f => ({ ...f, [key]: { ...f[key], [lang]: value } }));
  const setField = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    try {
      setLoading(true);
      const { adminUpdateContent } = await import('../api/admin.service.js');
      await adminUpdateContent('about', form);
      updateAbout(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save about data:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { key: 'history', label: 'History / About' },
    { key: 'chetna', label: 'Chetna Story Card' },
    { key: 'loviesh', label: 'Loviesh Story Card' },
  ];

  if (!form) {
    return <div className="min-h-screen bg-[#0a0001] flex items-center justify-center text-[#E6C587]">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0a0001]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#E6C587]/50 text-[10px] font-bold tracking-widest uppercase mb-1">Content</p>
          <h1 className="text-2xl font-serif text-white" style={{ fontFamily: "'Cinzel', serif" }}>About Us</h1>
        </div>
        <button onClick={handleSave} disabled={loading} className={`px-6 py-2.5 font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${saved ? 'bg-green-500 text-white' : 'bg-[#E6C587] text-[#0d0002] hover:bg-white'} disabled:opacity-60 disabled:cursor-not-allowed`}>
          {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
          {saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Lang Tabs */}
      <div className="flex gap-2 mb-6">
        {LANGS.map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${lang === l ? 'bg-[#E6C587]/20 text-[#E6C587] border border-[#E6C587]/40' : 'text-white/30 hover:text-white/60'}`}>{LANG_LABELS[l]}</button>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#E6C587]/10 pb-4">
        {sections.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)} className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${section === s.key ? 'bg-[#E6C587]/15 text-[#E6C587]' : 'text-white/30 hover:text-white/60'}`}>{s.label}</button>
        ))}
      </div>

      <div className="space-y-4">
        {section === 'history' && (
          <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-serif text-lg mb-2">History & What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LangField label={`Intro Paragraph 1 (${LANG_LABELS[lang]})`} value={form.intro1[lang]} onChange={v => setLangField('intro1', v)} multiline placeholder="First intro paragraph..." />
              <LangField label={`Intro Paragraph 2 (${LANG_LABELS[lang]})`} value={form.intro2[lang]} onChange={v => setLangField('intro2', v)} multiline placeholder="Second intro paragraph..." />
              <LangField label={`Feature 1 Title (${LANG_LABELS[lang]})`} value={form.feat1Title[lang]} onChange={v => setLangField('feat1Title', v)} placeholder="OUR ESSENCE" />
              <LangField label={`Feature 1 Description (${LANG_LABELS[lang]})`} value={form.feat1Desc[lang]} onChange={v => setLangField('feat1Desc', v)} multiline placeholder="Feature 1 description..." />
              <LangField label={`Feature 2 Title (${LANG_LABELS[lang]})`} value={form.feat2Title[lang]} onChange={v => setLangField('feat2Title', v)} placeholder="OUR COMMITMENT" />
              <LangField label={`Feature 2 Description (${LANG_LABELS[lang]})`} value={form.feat2Desc[lang]} onChange={v => setLangField('feat2Desc', v)} multiline placeholder="Feature 2 description..." />
            </div>
            <div className="mt-4">
              <ImageUploader 
                label="Chef / History Image" 
                value={form.chefImage} 
                onChange={(val) => setField('chefImage', val)} 
                placeholder="Drag & drop history image here" 
              />
            </div>
          </div>
        )}

        {section === 'chetna' && (
          <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-serif text-lg mb-2">Chetna Bali — Story Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LangField label={`Role (${LANG_LABELS[lang]})`} value={form.chetnaRole[lang]} onChange={v => setLangField('chetnaRole', v)} placeholder="Chef / Director / Founder" />
              <div>
                <ImageUploader 
                  label="Founder Image" 
                  value={form.founderImage} 
                  onChange={(val) => setField('founderImage', val)} 
                  placeholder="Drag & drop founder image here" 
                />
              </div>
              <LangField label={`Paragraph 1 (${LANG_LABELS[lang]})`} value={form.chetnaP1[lang]} onChange={v => setLangField('chetnaP1', v)} multiline />
              <LangField label={`Paragraph 2 (${LANG_LABELS[lang]})`} value={form.chetnaP2[lang]} onChange={v => setLangField('chetnaP2', v)} multiline />
              <LangField label={`Paragraph 3 (${LANG_LABELS[lang]})`} value={form.chetnaP3[lang]} onChange={v => setLangField('chetnaP3', v)} multiline />
            </div>
          </div>
        )}

        {section === 'loviesh' && (
          <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-serif text-lg mb-2">Loviesh Bali — Story Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LangField label={`Role (${LANG_LABELS[lang]})`} value={form.lovieshRole[lang]} onChange={v => setLangField('lovieshRole', v)} placeholder="Executive Chef" />
              <div>
                <ImageUploader 
                  label="Loviesh Image" 
                  value={form.lovieshImage} 
                  onChange={(val) => setField('lovieshImage', val)} 
                  placeholder="Drag & drop chef image here" 
                />
              </div>
              <LangField label={`Paragraph 1 (${LANG_LABELS[lang]})`} value={form.lovieshP1[lang]} onChange={v => setLangField('lovieshP1', v)} multiline />
              <LangField label={`Paragraph 2 (${LANG_LABELS[lang]})`} value={form.lovieshP2[lang]} onChange={v => setLangField('lovieshP2', v)} multiline />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
