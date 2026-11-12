import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Mapping of language codes to native names for friendly prompt display
const LANGUAGE_NAMES = {
  fr: { name: 'Français (French)', prompt: 'Traduire en Français ?' },
  de: { name: 'Deutsch (German)', prompt: 'Auf Deutsch übersetzen?' },
  it: { name: 'Italiano (Italian)', prompt: 'Tradurre in Italiano?' },
  pt: { name: 'Português (Portuguese)', prompt: 'Traduzir para Português?' },
  nl: { name: 'Nederlands (Dutch)', prompt: 'Vertalen naar het Nederlands?' },
  ru: { name: 'Русский (Russian)', prompt: 'Перевести на русский?' },
  zh: { name: '中文 (Chinese)', prompt: '翻译成中文？' },
  'zh-CN': { name: '简体中文 (Simplified Chinese)', prompt: '翻译成简体中文？' },
  'zh-TW': { name: '繁體中文 (Traditional Chinese)', prompt: '翻譯成繁體中文？' },
  ja: { name: '日本語 (Japanese)', prompt: '日本語に翻訳しますか？' },
  ko: { name: '한국어 (Korean)', prompt: '한국어로 번역하시겠습니까?' },
  ar: { name: 'العربية (Arabic)', prompt: 'هل تريد الترجمة إلى العربية؟' },
  hi: { name: 'हिन्दी (Hindi)', prompt: 'हिंदी में अनुवाद करें?' },
  pl: { name: 'Polski (Polish)', prompt: 'Przetłumaczyć na polski?' },
  sv: { name: 'Svenska (Swedish)', prompt: 'Översätt till svenska?' },
  da: { name: 'Dansk (Danish)', prompt: 'Oversæt til dansk?' },
  fi: { name: 'Suomi (Finnish)', prompt: 'Käännä suomeksi?' },
  el: { name: 'Ελληνικά (Greek)', prompt: 'Μετάφραση στα Ελληνικά;' },
  tr: { name: 'Türkçe (Turkish)', prompt: 'Türkçeye çevirilsin mi?' },
  uk: { name: 'Українська (Ukrainian)', prompt: 'Перекласти українською?' },
  ro: { name: 'Română (Romanian)', prompt: 'Traduceți în Română?' },
  es: { name: 'Español (Spanish)', prompt: '¿Traducir al español?' },
  en: { name: 'English', prompt: 'Translate to English?' },
  ca: { name: 'Català (Catalan)', prompt: 'Traduir al català?' }
};

export default function GoogleTranslator() {
  const { i18n } = useTranslation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [detectedLang, setDetectedLang] = useState(null);
  const [detectedInfo, setDetectedInfo] = useState(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [currentTranslatedLang, setCurrentTranslatedLang] = useState('');
  const scriptLoadedRef = useRef(false);

  // Initialize Google Translate script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Define the global init function required by Google Translate
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,es,ca,fr,de,it,pt,ru,zh-CN,zh-TW,ja,ko,ar,hi,pl,sv,da,fi,el,tr,uk,ro,nl',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      } catch (err) {
        console.warn('Google Translate initialization:', err);
      }
    };

    // Load Google script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }

    // Check if page is currently translated via cookie
    const cookies = document.cookie.split(';');
    const gtCookie = cookies.find(c => c.trim().startsWith('googtrans='));
    if (gtCookie) {
      const parts = gtCookie.split('=')[1]?.split('/');
      const activeCode = parts && parts.length > 2 ? parts[2] : null;
      if (activeCode && activeCode !== 'en' && activeCode !== 'auto') {
        setIsTranslated(true);
        setCurrentTranslatedLang(activeCode);
      }
    }
  }, []);

  // Detect user's browser language and determine if prompt should appear
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissed = sessionStorage.getItem('kasa_gt_prompt_dismissed');
    if (dismissed) return;

    // Get browser language
    const rawLang = navigator.language || navigator.userLanguage || (navigator.languages && navigator.languages[0]) || '';
    const langCode = rawLang.split('-')[0].toLowerCase();
    const siteLang = (i18n.language || 'en').split('-')[0].toLowerCase();

    // Check if the user's browser language is different from current page language
    // and is a recognized language (e.g. French, German, Italian, etc.)
    const isDifferent = langCode && langCode !== siteLang && !(siteLang === 'cat' && langCode === 'ca');

    if (isDifferent && LANGUAGE_NAMES[langCode]) {
      setDetectedLang(langCode);
      setDetectedInfo(LANGUAGE_NAMES[langCode]);
      // Small delay so user sees page smoothly first
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [i18n.language]);

  // Trigger Google Translate to a specific language
  const triggerTranslation = (targetLang) => {
    try {
      // Set the Google Translate cookies on all domain levels
      document.cookie = `googtrans=/auto/${targetLang}; path=/;`;
      document.cookie = `googtrans=/en/${targetLang}; path=/;`;
      if (window.location.hostname) {
        document.cookie = `googtrans=/auto/${targetLang}; path=/; domain=${window.location.hostname};`;
      }

      // Try setting the dropdown value directly if available
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = targetLang;
        select.dispatchEvent(new Event('change'));
      } else {
        // If combo not loaded yet, a gentle reload activates Google Translate with the cookie
        window.location.reload();
      }

      setIsTranslated(true);
      setCurrentTranslatedLang(targetLang);
      setShowPrompt(false);
      setIsWidgetOpen(false);
      sessionStorage.setItem('kasa_gt_prompt_dismissed', 'true');
    } catch (err) {
      console.error('Translation trigger error:', err);
    }
  };

  // Revert back to original
  const revertTranslation = () => {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    if (window.location.hostname) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    }
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = '';
      select.dispatchEvent(new Event('change'));
    }
    setIsTranslated(false);
    setCurrentTranslatedLang('');
    window.location.reload();
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    sessionStorage.setItem('kasa_gt_prompt_dismissed', 'true');
  };

  return (
    <>
      {/* Hidden container for Google Translate Widget DOM element */}
      <div id="google_translate_element" className="notranslate" style={{ display: 'none' }} translate="no" />

      {/* Global CSS overrides to eliminate Google Translate ugly banners and keep luxury aesthetic */}
      <style>{`
        .goog-te-banner-frame.skiptranslate,
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0px !important;
        }
        .goog-te-gadget .goog-te-combo {
          background-color: #140003 !important;
          color: #E6C587 !important;
          border: 1px solid rgba(230, 197, 135, 0.4) !important;
          border-radius: 8px !important;
          padding: 6px 12px !important;
          font-size: 12px !important;
          outline: none !important;
          font-family: inherit !important;
          cursor: pointer !important;
        }
        #goog-gt-tt, .goog-te-balloon-frame {
          display: none !important;
        }
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* ─── 1. Automatic Translation Prompt Banner ─── */}
      {showPrompt && detectedInfo && (
        <aside
          role="region"
          aria-label="Language translation prompt"
          className="fixed bottom-6 left-4 sm:left-6 z-[999] max-w-sm sm:max-w-md w-[calc(100vw-2rem)] rounded-2xl bg-[#1e0207]/95 border border-[#E6C587]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl p-4 sm:p-5 notranslate text-white animate-fadeIn"
          translate="no"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BD561A] to-[#801020] border border-[#E6C587]/40 flex items-center justify-center text-white shrink-0 shadow-md">
              <svg className="w-5 h-5 text-[#E6C587]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-[#E6C587] uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6C587] animate-pulse"></span>
                  Google Translate
                </span>
                <button
                  onClick={dismissPrompt}
                  className="text-white/40 hover:text-white transition-colors p-1"
                  title="Dismiss"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h4 className="text-sm font-serif font-bold text-[#E6C587] mb-1 leading-snug" style={{ fontFamily: "'Cinzel', serif" }}>
                {detectedInfo.prompt}
              </h4>
              <p className="text-xs text-white/70 mb-3.5 leading-relaxed font-sans">
                We detected your browser language is <strong>{detectedInfo.name}</strong>. Would you like to translate Kasa Saffron into your language?
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => triggerTranslation(detectedLang)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B8893A] to-[#E6C587] text-[#140003] text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-[0_0_20px_rgba(230,197,135,0.4)] active:scale-95 transition-all"
                >
                  Translate Now
                </button>
                <button
                  onClick={() => { setShowPrompt(false); setIsWidgetOpen(true); }}
                  className="px-3 py-2 rounded-xl border border-[#E6C587]/30 text-[#E6C587] text-xs font-medium hover:bg-[#E6C587]/10 transition-colors"
                >
                  Other Languages...
                </button>
                <button
                  onClick={dismissPrompt}
                  className="px-2 py-2 text-white/50 hover:text-white text-xs transition-colors"
                >
                  Keep Original
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ─── 2. Floating Globe Translator Quick Toggle (Bottom-Left) ─── */}
      <div className="fixed bottom-6 left-6 z-[990] notranslate" translate="no">
        <div className="relative">
          <button
            onClick={() => setIsWidgetOpen(prev => !prev)}
            aria-label="Toggle language translation"
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full border shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 ${
              isTranslated
                ? 'bg-[#BD561A] border-[#E6C587] text-white shadow-[0_0_20px_rgba(189,86,26,0.5)]'
                : 'bg-[#1e0207]/90 border-[#E6C587]/30 text-[#E6C587] hover:border-[#E6C587] hover:bg-[#2c0107]'
            }`}
            title="Translate website with Google Translate"
          >
            <svg className="w-4 h-4 text-[#E6C587]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[11px] font-bold tracking-wider uppercase hidden sm:inline">
              {isTranslated ? `Translated (${currentTranslatedLang.toUpperCase()})` : 'Translate'}
            </span>
          </button>

          {/* Language Picker Dropdown Menu */}
          {isWidgetOpen && (
            <div className="absolute bottom-12 left-0 w-72 sm:w-80 rounded-2xl bg-[#1a0004]/98 border border-[#E6C587]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl p-4 text-white animate-fadeIn z-[1000]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6C587]/15 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-bold text-[#E6C587] tracking-wider uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                    Select Language
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E6C587]/15 text-[#E6C587] font-mono">
                    Google
                  </span>
                </div>
                <button
                  onClick={() => setIsWidgetOpen(false)}
                  className="text-white/40 hover:text-white p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isTranslated && (
                <div className="mb-3 p-2.5 rounded-xl bg-[#BD561A]/20 border border-[#BD561A]/40 flex items-center justify-between">
                  <span className="text-[11px] text-[#E6C587] font-medium">Currently translated</span>
                  <button
                    onClick={revertTranslation}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-[#140003] border border-[#E6C587]/30 text-[#E6C587] hover:bg-[#E6C587] hover:text-[#140003] font-bold uppercase transition-colors"
                  >
                    Reset Original
                  </button>
                </div>
              )}

              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-2 font-bold">
                Popular Languages:
              </p>

              <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                {Object.entries(LANGUAGE_NAMES).map(([code, info]) => (
                  <button
                    key={code}
                    onClick={() => triggerTranslation(code)}
                    className={`p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                      currentTranslatedLang === code
                        ? 'bg-[#E6C587] text-[#140003] font-bold'
                        : 'bg-white/5 hover:bg-[#E6C587]/15 text-white/80 hover:text-[#E6C587]'
                    }`}
                  >
                    <span className="truncate">{info.name.split(' ')[0]}</span>
                    <span className="text-[9px] opacity-60 uppercase font-mono">{code}</span>
                  </button>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-[#E6C587]/15 flex items-center justify-between text-[10px] text-white/40">
                <span>Powered by Google Translate</span>
                {isTranslated && (
                  <button onClick={revertTranslation} className="text-[#E6C587] hover:underline">
                    Revert to Spanish/English
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

