import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdmin } from './context/AdminContext';
import { Link } from 'react-router-dom';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';
/* ── SVG Icons ── */
const LeafIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M16 28C16 28 6 22 6 12C6 7 10 4 16 4C22 4 26 7 26 12C26 22 16 28 16 28Z" />
    <path d="M16 4 L16 28" /><path d="M16 14 C14 11 10 10 8 11" /><path d="M16 18 C18 15 22 14 24 15" />
  </svg>
);
const ChefHatIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <rect x="8" y="20" width="16" height="5" rx="1" />
    <path d="M10 20C10 20 10 16 7 13C5 11 5 7 9 6C11 5 13 6 14 8C14.5 5 16 4 18 5C21 6 22 9 20 12C19 14 22 16 22 20" />
    <line x1="11" y1="20" x2="11" y2="25" /><line x1="16" y1="20" x2="16" y2="25" /><line x1="21" y1="20" x2="21" y2="25" />
  </svg>
);
const RibbonIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <circle cx="16" cy="12" r="7" /><path d="M12 18 L9 28 L16 24 L23 28 L20 18" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M16 27C16 27 4 20 4 12C4 8 7 5 11 5C13.5 5 15.5 6.5 16 8C16.5 6.5 18.5 5 21 5C25 5 28 8 28 12C28 20 16 27 16 27Z" />
    <path d="M12 12 C12 10 14 9 16 11" />
  </svg>
);

/* ── Ornamental Divider ── */
const OrnamentalDivider = () => (
  <div className="mob-ornamental-divider">
    <span className="mob-divider-line" />
    <span className="mob-divider-diamond">◇</span>
    <span className="mob-divider-line" />
  </div>
);

/* ── Person Card Component ── */
const PersonCard = ({ image, name, role, bio, isVisible }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2a1015] to-[#1a0a0d] border border-[#E6C587]/30 p-8 shadow-2xl transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
    {/* Decorative Elements */}
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E6C587] to-transparent opacity-60" />
    <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#E6C587]/10 rounded-full blur-2xl" />
    <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#E6C587]/10 rounded-full blur-2xl" />

    <div className="text-center text-[11px] tracking-[0.25em] text-[#E6C587]/80 uppercase font-semibold mb-6 drop-shadow-sm">WHO WE ARE</div>

    <div className="flex justify-center mb-6 relative z-10">
      <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-br from-[#E6C587] via-[#b68c43] to-[#5a421b] shadow-[0_0_20px_rgba(230,197,135,0.3)]">
        <img src={image} alt={name} className="w-full h-full object-cover rounded-full border-4 border-[#1a0a0d]" loading="lazy" />
      </div>
    </div>

    <h3 className="text-3xl font-serif text-[#E6C587] text-center mb-1 relative z-10 drop-shadow-md">{name}</h3>
    <p className="text-xs text-[#E6C587]/90 text-center uppercase tracking-widest font-medium mb-5 relative z-10">{role}</p>

    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#E6C587]/50 to-transparent mx-auto mb-5" />

    <p className="text-[#E6C587]/80 text-sm text-center leading-relaxed font-light relative z-10 italic">"{bio}"</p>
  </div>
);

const mobileStyles = `
  /* High-Contrast Premium Dark Neomorphism */
  .mob-reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .mob-reveal.mob-revealed {
      opacity: 1;
      transform: translateY(0);
  }
  .mob-features-list .mob-reveal:nth-child(2) { transition-delay: 0.12s; }
  .mob-features-list .mob-reveal:nth-child(3) { transition-delay: 0.24s; }
  .mob-features-list .mob-reveal:nth-child(4) { transition-delay: 0.36s; }

  /* Hero Overrides for Dark Theme */
  .mob-hero-section { background: #220b12 !important; }
  .mob-hero-title { color: #fdfaf6 !important; text-shadow: 0 4px 12px rgba(0,0,0,0.5); }
  .mob-hero-desc { color: rgba(253,250,246,0.8) !important; }
  .mob-hero-subtitle span { color: #E6C587 !important; }
  .mob-hero-script { color: #E6C587 !important; opacity: 0.9; }

  /* Plate Size Control for Mobile Portrait */
  .mob-animated-plate {
      width: calc(100vw - 15px) !important;
  }

  /* Sections */
  .mob-story-section {
      padding: 180px 20px 50px; /* Increased top padding to avoid plate overlap */
      background: #220b12;
      position: relative;
      overflow: hidden;
  }
  /* Decorative background glows */
  .mob-story-section::before {
      content: ''; position: absolute; top: -50px; left: -50px; width: 200px; height: 200px;
      background: radial-gradient(circle, rgba(230,197,135,0.05) 0%, transparent 70%); border-radius: 50%;
  }

  .mob-story-header { text-align: center; margin-bottom: 36px; position: relative; z-index: 2; }
  .mob-story-badge {
      display: inline-block; font-family: 'Montserrat', sans-serif; font-size: 10px;
      font-weight: 800; letter-spacing: 5px; color: #E6C587; text-transform: uppercase; margin-bottom: 12px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
  .mob-story-title {
      font-family: 'Cinzel Decorative', serif; font-size: 32px; font-weight: 600; color: #fdfaf6;
      line-height: 1.15; margin: 0; text-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }
  .mob-story-title-line {
      width: 50px; height: 2px; background: linear-gradient(90deg, transparent, #E6C587, transparent); margin: 16px auto 0;
  }

  /* Dark Neomorphic Cards (Founder Grid Layout) */
  .mob-neu-card {
      background: #220b12;
      border-radius: 24px; padding: 28px 20px;
      box-shadow: 
          9px 9px 18px #13060a,
          -9px -9px 18px #31101a;
      border: 1px solid rgba(255,255,255,0.02);
      position: relative;
      z-index: 2;
      
      display: grid;
      grid-template-columns: 86px 1fr;
      column-gap: 16px;
      align-items: center;
  }

  /* Founders */
  .mob-founder-block { margin-bottom: 30px; }
  .mob-founder-info { display: contents; }
  
  .mob-founder-img-wrap {
      grid-column: 1; grid-row: 1 / 3;
      width: 86px; height: 86px; border-radius: 50%; margin: 0; padding: 4px;
      background: #220b12;
      box-shadow: 
          9px 9px 18px #13060a,
          -9px -9px 18px #31101a;
  }
  .mob-founder-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid #E6C587; }
  
  .mob-founder-name { 
      grid-column: 2; grid-row: 1; align-self: end; text-align: left; 
      font-family: 'Cinzel Decorative', serif; font-size: 24px; font-weight: 700; color: #E6C587; margin: 0 0 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); 
  }
  .mob-founder-role { 
      grid-column: 2; grid-row: 2; align-self: start; text-align: left; 
      font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 3px; color: #fdfaf6; text-transform: uppercase; opacity: 0.9; 
  }
  .mob-founder-line { 
      grid-column: 1 / 3; grid-row: 3; 
      width: 100%; height: 1px; background: linear-gradient(90deg, rgba(230,197,135,0.4), transparent); margin: 20px 0; 
  }
  .mob-founder-quote { 
      grid-column: 1 / 3; grid-row: 4; text-align: left; 
      font-family: 'Cormorant Garamond', serif; font-size: 15px; font-style: italic; line-height: 1.8; color: #fdfaf6; margin: 0; opacity: 0.85; 
  }

  /* Craft */
  .mob-craft-section { background: #220b12; padding-top: 70px; }
  .mob-features-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; position: relative; z-index: 2; }
  .mob-feature-pill {
      display: flex; align-items: flex-start; gap: 18px; 
      background: #220b12;
      border-radius: 20px; padding: 22px 20px;
      box-shadow: 
          7px 7px 14px #13060a,
          -7px -7px 14px #31101a;
      border: 1px solid rgba(255,255,255,0.02);
  }
  .mob-feature-icon {
      width: 48px; height: 48px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      background: #220b12; border-radius: 14px;
      box-shadow: 
          inset 4px 4px 8px #13060a,
          inset -4px -4px 8px #31101a;
  }
  .mob-feature-icon svg { stroke: #E6C587 !important; width: 26px; height: 26px; }
  .mob-feature-text { flex: 1; min-width: 0; }
  .mob-feature-text h3 { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; color: #E6C587; margin: 0 0 6px; letter-spacing: 0.5px; }
  .mob-feature-text p { font-size: 12px; line-height: 1.6; color: rgba(253,250,246,0.75); margin: 0; }

  /* Buttons */
  .mob-neu-cta-group { display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 2; }
  .mob-neu-btn-primary, .mob-neu-btn-secondary, .mob-neu-btn-beige {
      display: block; width: 100%; text-align: center; text-decoration: none; border-radius: 60px;
      font-family: 'Montserrat', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 4px;
      transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer;
  }
  .mob-neu-btn-primary {
      padding: 18px 0; font-weight: 800; color: #E6C587; background: #220b12;
      box-shadow: 
          6px 6px 12px #13060a,
          -6px -6px 12px #31101a;
  }
  .mob-neu-btn-primary:active { 
      transform: scale(0.97); 
      box-shadow: 
          inset 4px 4px 8px #13060a,
          inset -4px -4px 8px #31101a;
  }
  .mob-neu-btn-beige {
      width: 80%; margin: 0 auto;
      padding: 10px 0; font-size: 14px; font-weight: 700; color: #220b12; background: #dcb367ff;
      font-family: 'Cormorant Garamond', serif; letter-spacing: 2px;
      box-shadow: 
          6px 6px 12px #13060a,
          -6px -6px 12px #31101a,
          inset 2px 2px 6px rgba(255, 255, 255, 0.6),
          inset -2px -2px 6px rgba(163, 131, 74, 0.8);
  }
  .mob-neu-btn-beige:active { 
      transform: scale(0.97); 
      box-shadow: 
          inset 4px 4px 8px rgba(163, 131, 74, 0.8),
          inset -4px -4px 8px rgba(255, 255, 255, 0.6);
  }
  .mob-neu-btn-secondary {
      padding: 17px 0; font-weight: 700; color: #E6C587; background: transparent; border: 1px solid rgba(230,197,135,0.4);
      box-shadow: none;
  }
  .mob-neu-btn-secondary:active { transform: scale(0.97); background: rgba(230,197,135,0.1); }

  /* Left column wrapper — portrait: behaves transparently; landscape: becomes left half */
  .mob-hero-left-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (orientation: landscape) and (max-height: 520px) and (pointer: coarse) {
    .mob-hero-left-col {
      flex: 1;
      align-items: flex-start;
      padding-left: 8px;
      padding-top: 10px;
      max-width: 55vw;
      overflow: hidden;
    }
    /* Logo stays inline with text in landscape */
    .mob-hero-logo-wrap {
      margin-top: 0 !important;
    }
    /* Ensure hero-text is left-aligned */
    .mob-hero-text {
      width: 100%;
    }
  }
  /* ═══════════════════════════════════════════════════════════════════
     PHONE LANDSCAPE — Horizontal layout for rotated phones
     (pointer:coarse + orientation:landscape + short height)
     ═══════════════════════════════════════════════════════════════════ */

  @media (orientation: landscape) and (max-height: 520px) and (pointer: coarse) {
    /* Scroll enabled, no snap */
    .mob-snap-container {
      height: 100svh;
      overflow-y: auto;
    }

    /* Hero: switch to a side-by-side layout */
    .mob-hero-section {
      flex-direction: row !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 0 20px !important;
      height: 100svh !important;
      min-height: 100svh;
      gap: 0;
      overflow: hidden;
    }

    /* Left column — logo + text */
    .mob-hero-logo-wrap {
      position: relative;
      z-index: 10;
      margin-top: 0;
      margin-bottom: 8px;
      flex-shrink: 0;
    }
    .mob-hero-logo { width: 56px; }
    .mob-hero-logo-glow { width: 80px; height: 80px; }

    .mob-hero-text {
      flex: 1;
      padding: 0 12px 0 0;
      margin-top: 0 !important;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
      max-width: 55vw;
    }
    .mob-hero-subtitle { justify-content: flex-start; }
    .mob-hero-title    { font-size: clamp(24px, 6vw, 38px); margin: 4px 0 0; }
    .mob-hero-script   { font-size: clamp(22px, 5.5vw, 34px); margin-top: -4px; }
    .mob-hero-desc     { font-size: 10px; max-width: 100%; }

    /* Limit button group width */
    .mob-neu-cta-group { margin-top: 12px !important; width: 100%; }
    .mob-neu-btn-beige { width: 100%; font-size: 11px; padding: 8px 0; }

    /* Right column — plate + deco */
    .mob-hero-deco-wrapper { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

    /* Shrink deco images so they don't overflow */
    .mob-hero-deco-flower-l { top: 15%; left: -12vw; width: 28vw; opacity: 0.4; }
    .mob-hero-deco-flower-r { top: 8%;  right: -12vw; width: 28vw; opacity: 0.4; }
    .mob-hero-deco-cup      { top: 2%;  right: -2vw;  width: 12vw; opacity: 0.35; }
    .mob-hero-deco-leaves   { bottom: 20%; right: -8vw; width: 18vw; opacity: 0.3; }

    /* Plate: smaller and positioned right */
    .mob-animated-plate {
      position: absolute !important;
      right: -5vw;
      left: auto !important;
      top: 50% !important;
      width: 52vw !important;
      max-width: 380px !important;
      transform: translate(0, -50%) !important;
      transition: none !important;
      z-index: 5;
    }

    /* Story sections stacked normally below hero */
    .mob-story-section { padding: 40px 20px 30px; }
    .mob-story-title   { font-size: 22px; }
    .mob-craft-section { padding-top: 40px; }
  }
`;

export default function MobileHome() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { aboutData } = useAdmin();
  const [isContactOpen, setIsContactOpen] = useState(false);


  // Track visibility for fade-ins
  const [visibleSections, setVisibleSections] = useState(new Set([0]));
  const sectionRefs = useRef([]);
  const containerRef = useRef(null);
  const plateRef = useRef(null);
  const setSectionRef = useCallback((el, index) => {
    sectionRefs.current[index] = el;
  }, []);

  // IntersectionObserver for revealing sections (fade-in)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.sectionIndex);
            setVisibleSections((prev) => {
              if (prev.has(idx)) return prev;
              const next = new Set(prev);
              next.add(idx);
              return next;
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // IntersectionObserver for .mob-reveal storytelling elements
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mob-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const revealEls = document.querySelectorAll('.mob-reveal');
    revealEls.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
      {/* ═══════════ FIXED BACKGROUND LAYER ═══════════ */}
      <div className="mob-fixed-bg">
      </div>

      <div ref={containerRef} className="mob-snap-container">

        {/* ═══════════ SECTION 1: HERO ═══════════ */}
        <section
          ref={(el) => setSectionRef(el, 0)}
          data-section-index="0"
          className={`mob-snap-section mob-hero-section ${visibleSections.has(0) ? 'mob-visible' : ''}`}
        >
          {/* Decorative elements - scrolled with section */}
          <div className="mob-hero-deco-wrapper">
            <img src="/Images/LeftSide_Flower.png" className="mob-hero-deco mob-hero-deco-flower-l" alt="" aria-hidden="true" fetchPriority="high" decoding="sync" />
            <img src="/Images/RightSide_Flower.png" className="mob-hero-deco mob-hero-deco-flower-r" alt="" aria-hidden="true" fetchPriority="high" decoding="sync" />
            <img src="/Images/RightSide_SaffronCup.png" className="mob-hero-deco mob-hero-deco-cup" alt="" aria-hidden="true" fetchPriority="high" decoding="sync" />
            <img src="/Images/RightSide_Leaves.png" className="mob-hero-deco mob-hero-deco-leaves" alt="" aria-hidden="true" fetchPriority="high" decoding="sync" />
            <img src="/Images/RightSide_FlowerPetalBottom.png" className="mob-hero-deco" style={{ position: 'absolute', bottom: 'calc(2% + 100px)', left: '5%', width: '30vw', zIndex: 1 }} alt="" aria-hidden="true" fetchPriority="high" decoding="sync" />
          </div>

          {/* Dynamic Plate Wrapper (scrolled with section) */}
          <div
            ref={plateRef}
            className="mob-animated-plate flex items-center justify-center"
            style={{ transform: 'translate(-50%, calc(-50% + 100vh + 10px))' }}
          >
            {/* Plate Image */}
            <img
              src="/Images/Croqetta with plate_.png"
              className="w-full h-auto relative z-10 drop-shadow-xl"
              alt="Croquetas on Plate"
              fetchPriority="high"
              decoding="sync"
            />
          </div>

          {/* Left column: logo + text (wrapped for landscape two-column layout) */}
          <div className="mob-hero-left-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            {/* Logo with golden glow */}
            <div className="mob-hero-logo-wrap">
              <div className="mob-hero-logo-glow" />
              <img src="/Images/Logo.png" alt="Kasa Saffron Logo" className="mob-hero-logo" fetchPriority="high" decoding="sync" />
            </div>

            {/* Titles */}
            <div className="mob-hero-text" style={{ marginTop: '30px' }}>
              <div className="mob-hero-subtitle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 22C12 22 17 18 17 12C17 6 12 2 12 2C12 2 7 6 7 12C7 18 12 22 12 22Z" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22V12" stroke="#B08D57" strokeWidth="1.5" /><path d="M12 12L9 9" stroke="#B08D57" strokeWidth="1.5" /><path d="M12 12L15 9" stroke="#B08D57" strokeWidth="1.5" />
                </svg>
                <span>{t('hero.handcrafted')}<br />{t('hero.pureSaffron')}</span>
              </div>
              <h1 className="mob-hero-title">{t('hero.croquetes')}</h1>
              <h2 className="mob-hero-script">{t('hero.ambAmor')}</h2>
              <p className="mob-hero-desc">
                {t('hero.descLine1')} {t('hero.descLine2')} {t('hero.descLine3')}
              </p>
              <div className="mob-neu-cta-group" style={{ marginTop: '30px' }}>
                <Link to="/flavours" className="mob-neu-btn-beige">Discover Our Flavours</Link>
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════ SECTION 2: OUR STORY ═══════════ */}
        <section className="mob-story-section">
          <div className="mob-story-header">
            <span className="mob-story-badge">Our Story</span>
            <h2 className="mob-story-title">The People Behind<br />the Flavour</h2>
            <div className="mob-story-title-line" />
          </div>

          {/* Founder 1: Chetna */}
          <div className="mob-founder-block mob-reveal">
            <div className="mob-neu-card">
              <div className="mob-founder-img-wrap">
                <img
                  src={(typeof aboutData?.founderImage === 'string' && aboutData.founderImage.trim() !== '' && aboutData.founderImage !== "null") ? aboutData.founderImage : "/Images/founder_pngggg.png"}
                  alt="Chetna Bali"
                  className="mob-founder-img"
                  fetchPriority="high"
                  decoding="sync"
                />
              </div>
              <div className="mob-founder-info">
                <h3 className="mob-founder-name">Chetna Bali</h3>
                <span className="mob-founder-role">{aboutData?.chetnaRole?.[lang] || t('stories.chetnaRole') || aboutData?.chetnaRole?.en}</span>
                <div className="mob-founder-line" />
                <p className="mob-founder-quote">
                  "{aboutData?.chetnaP1?.[lang] || t('stories.chetnaP1') || aboutData?.chetnaP1?.en}"
                </p>
              </div>
            </div>
          </div>

          {/* Founder 2: Loviesh */}
          <div className="mob-founder-block mob-reveal">
            <div className="mob-neu-card">
              <div className="mob-founder-img-wrap">
                <img
                  src={(typeof aboutData?.lovieshImage === 'string' && aboutData.lovieshImage.trim() !== '' && aboutData.lovieshImage !== "null") ? aboutData.lovieshImage : "/Images/gordanramsi png.png"}
                  alt="Loviesh Bali"
                  className="mob-founder-img"
                  fetchPriority="high"
                  decoding="sync"
                />
              </div>
              <div className="mob-founder-info">
                <h3 className="mob-founder-name">Loviesh Bali</h3>
                <span className="mob-founder-role">{aboutData?.lovieshRole?.[lang] || t('stories.lovieshRole') || aboutData?.lovieshRole?.en}</span>
                <div className="mob-founder-line" />
                <p className="mob-founder-quote">
                  "{aboutData?.lovieshP1?.[lang] || t('stories.lovieshP1') || aboutData?.lovieshP1?.en}"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 3: WHAT WE DO ═══════════ */}
        <section className="mob-story-section mob-craft-section">
          <div className="mob-story-header">
            <span className="mob-story-badge">Our Craft</span>
            <h2 className="mob-story-title">What We Do</h2>
            <div className="mob-story-title-line" />
          </div>

          <div className="mob-features-list">
            <div className="mob-feature-pill mob-reveal">
              <div className="mob-feature-icon"><LeafIcon /></div>
              <div className="mob-feature-text">
                <h3>{t('hero.feat1Title')}</h3>
                <p>{t('hero.feat1DescLine1')} {t('hero.feat1DescLine2')}</p>
              </div>
            </div>
            <div className="mob-feature-pill mob-reveal">
              <div className="mob-feature-icon"><ChefHatIcon /></div>
              <div className="mob-feature-text">
                <h3>{t('hero.feat2Title')}</h3>
                <p>{t('hero.feat2DescLine1')} {t('hero.feat2DescLine2')}</p>
              </div>
            </div>
            <div className="mob-feature-pill mob-reveal">
              <div className="mob-feature-icon"><RibbonIcon /></div>
              <div className="mob-feature-text">
                <h3>{t('hero.feat3Title')}</h3>
                <p>{t('hero.feat3DescLine1')} {t('hero.feat3DescLine2')}</p>
              </div>
            </div>
            <div className="mob-feature-pill mob-reveal">
              <div className="mob-feature-icon"><HeartIcon /></div>
              <div className="mob-feature-text">
                <h3>{t('hero.feat4Title')}</h3>
                <p>{t('hero.feat4DescLine1')} {t('hero.feat4DescLine2')}</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mob-neu-cta-group mob-reveal">
            <Link to="/flavours" className="mob-neu-btn-primary">Our Flavours</Link>
            <Link to="/b2b" className="mob-neu-btn-secondary">Partner With Us</Link>
          </div>
        </section>


      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}


