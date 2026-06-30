import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useAdmin } from './context/AdminContext';
import { getCurrentUserLocal } from './api/auth.service';
import SkeletonPage from './components/SkeletonPage';
import SEO from './components/SEO';

/* ─── Static fallback data ─── */
const FLAVOURS = [
  { id: 1, name: "Classic Jamón Ibérico", tagline: "The Soul of Spain", description: "Traditional Spanish croqueta filled with rich, savory Iberian cured ham in a creamy, melt-in-your-mouth bechamel sauce.", image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/b673c1e0-5ef3-46e8-b80c-761dcb98a422.jpg", spanishName: "Croquetas de Jamón Ibérico" },
  { id: 2, name: "Earthy Boletus Mushrooms", tagline: "Wild & Velvety", description: "Sautéed wild porcini mushrooms blended into a smooth cream — a vegetarian specialty rich in deep forest aroma.", image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/05d19617-71ac-4d56-b725-7a97d472753a.jpg", spanishName: "Croquetas de Ceps" },
  { id: 3, name: "Traditional Cod (Bacalao)", tagline: "A Coastal Heritage", description: "A coastal tapas classic featuring finely flaked salted cod, garlic, and fresh parsley, fried to crisp golden perfection.", image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/aae40670-49c9-4429-a7ef-6b03d30f607d.jpg", spanishName: "Croquetas de Bacalao" },
  { id: 4, name: "Signature Chicken & Saffron", tagline: "Infused with Elegance", description: "Our house specialty: tender slow-roasted chicken breast infused with the delicate aroma of premium hand-picked saffron threads.", image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/e498b324-4ad5-4846-ab19-090e600c327d.jpg", spanishName: "Croquetas de Pollo Rustido" },
  { id: 5, name: "Creamy Cabrales Blue Cheese", tagline: "Bold & Indulgent", description: "A daring bite featuring Spanish blue cheese, beautifully balanced with sweet caramelized onions for a sweet-savory harmony.", image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/c524ba36-7841-4226-9dec-5f968db77dbe.jpg", spanishName: "Croquetas de Queso Azul" },
  { id: 6, name: "Spinach & Roasted Pine Nuts", tagline: "Clean & Crispy", description: "Fresh spinach leaves and toasted Spanish pine nuts folded into our light bechamel, offering a clean, nutty finish.", image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/d943190d-131f-4f4d-b77c-52fee772d387.png", spanishName: "Croquetas de Espinaca" },
  { id: 7, name: "Slow-Cooked oxtail (Rabo de Toro)", tagline: "Rich & Deep", description: "Melt-in-your-mouth shredded oxtail beef braised in Spanish red wine, encased in an ultra-crispy breadcrumb crust.", image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/68a46dec-c542-41ba-a695-31b8e3934df3.jpeg", spanishName: "Croquetas de Cocido" },
  { id: 8, name: "Garlic Shrimp (Gambas al Ajillo)", tagline: "Zesty Tapas Sensation", description: "Plump prawns sautéed in garlic-infused olive oil with a touch of red pepper flakes, bringing hot tapas direct to you.", image: "https://kasasaffron.com/api/files/kasa-saffron/uploads/9c49d2af-323a-454b-82f1-9301da2b74a7.jpg", spanishName: "Croquetas de Rape y Gambas" }
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeout', delay },
});

/* ══════════════════════════════════════════════════════════════
   MOBILE CARD — Fully optimized: CSS transforms only, no Framer Motion
   Large image display, beautiful PNGs, swipe-friendly
══════════════════════════════════════════════════════════════ */
const MobileCard = React.memo(function MobileCard({ flavour, index, isActive, diff, lang, t, onClick }) {
  const name = flavour.name?.[lang] || t(`flavoursPage.items.${index}.name`) || flavour.name?.en || flavour.name;
  const tagline = flavour.tagline?.[lang] || t(`flavoursPage.items.${index}.tagline`) || flavour.tagline?.en || flavour.tagline;
  const description = flavour.description?.[lang] || t(`flavoursPage.items.${index}.description`) || flavour.description?.en || flavour.description;
  const absDiff = Math.abs(diff);

  const offsetPct = diff * 90;
  const scale = isActive ? 1 : 0.80;
  const opacity = isActive ? 1 : absDiff === 1 ? 0.4 : 0;
  const zIdx = isActive ? 10 : absDiff === 1 ? 5 : 0;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        transform: `translateX(${offsetPct}%) scale(${scale})`,
        opacity,
        zIndex: zIdx,
        transition: 'transform 0.38s cubic-bezier(.4,0,.2,1), opacity 0.35s ease',
        width: '210px',
        willChange: 'transform, opacity',
      }}
      className="cursor-pointer"
    >
      <div
        className={`relative rounded-2xl overflow-hidden shadow-2xl border ${isActive ? 'border-[#E6C587]/60 shadow-[0_8px_30px_rgba(44,1,7,0.35)]' : 'border-[#E6C587]/15'}`}
        style={{ background: 'linear-gradient(160deg,#2c0107 55%,#1a0003)' }}
      >
        {/* Corner ornaments */}
        <svg viewBox="0 0 40 40" fill="none" className="absolute top-0 left-0 w-8 h-8 text-[#E6C587] opacity-25 pointer-events-none z-10">
          <path d="M2 36 L2 5 Q2 2 5 2 L36 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
        </svg>
        <svg viewBox="0 0 40 40" fill="none" className="absolute bottom-0 right-0 w-8 h-8 text-[#E6C587] opacity-25 pointer-events-none rotate-180 z-10">
          <path d="M2 36 L2 5 Q2 2 5 2 L36 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
        </svg>

        {/* Tagline header */}
        <div className="px-3 pt-3 pb-2 border-b border-[#E6C587]/10 flex items-center justify-between relative z-10">
          <span className="text-[7px] tracking-[0.2em] font-bold text-[#E6C587]/70 uppercase">{tagline}</span>
          <svg className="w-3.5 h-3.5 text-[#E6C587] opacity-60 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <path d="M10 18 L10 6"/><path d="M10 6 C8 4 5 1.5 4 1"/><path d="M10 6 C12 4 15 1.5 16 1"/>
            <circle cx="10" cy="6" r="1.2" fill="currentColor" opacity="0.8"/>
          </svg>
        </div>

        {/* Full image — large & beautiful */}
        <div className="relative w-full overflow-hidden" style={{ height: '155px' }}>
          <img
            src={flavour.image}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          {/* Flower watermark */}
          <img src="/Images/FLOWER.png" alt="" className="absolute -bottom-2 -right-3 w-14 h-14 object-contain opacity-[0.07] pointer-events-none select-none" aria-hidden="true"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2c0107]/85 via-[#2c0107]/5 to-transparent pointer-events-none"/>
        </div>

        {/* Name & details */}
        <div className="px-3 pb-3 pt-1 text-center relative z-10">
          {/* Diamond divider */}
          <div className="flex items-center justify-center gap-2 mb-2 mt-1">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E6C587]/40"/>
            <svg viewBox="0 0 10 10" className="w-1.5 h-1.5 text-[#E6C587] opacity-60" fill="currentColor"><polygon points="5,0 10,5 5,10 0,5"/></svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E6C587]/40"/>
          </div>
          <p className="text-[8px] font-serif italic text-[#E6C587]/80 tracking-wider mb-0.5">{flavour.spanishName}</p>
          <h3 className="text-[11px] font-bold text-white font-serif leading-snug tracking-wide">{name}</h3>
          <p className="text-[6px] text-[#E6C587]/30 font-bold tracking-widest uppercase mt-1.5">Kasa Saffron · #{flavour.id}</p>
        </div>
      </div>
    </div>
  );
});

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Flavours() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { addToCart } = useCart();
  const { flavours, isDataLoading } = useAdmin();
  const displayFlavours = flavours && flavours.length > 0 ? flavours : FLAVOURS;

  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null);
  const [selectedSize, setSelectedSize] = useState('1kg');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const navigate = useNavigate();

  // Touch swipe state for mobile
  const touchStartX = useRef(null);

  useEffect(() => {
    let raf;
    const handleResize = () => { raf = requestAnimationFrame(() => setWindowWidth(window.innerWidth)); };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(raf); };
  }, []);

  // Override body background on mobile so no beige gap appears when content overflows viewport
  useEffect(() => {
    if (windowWidth >= 768) return; // desktop: do nothing
    const prevBg = document.body.style.background;
    document.body.style.background = '#140003';
    document.documentElement.style.background = '#140003';
    return () => {
      document.body.style.background = prevBg;
      document.documentElement.style.background = '';
    };
  }, [windowWidth]);


  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? displayFlavours.length - 1 : prev - 1));
  }, [displayFlavours.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === displayFlavours.length - 1 ? 0 : prev + 1));
  }, [displayFlavours.length]);

  useEffect(() => {
    if (isCarouselHovered || expandedCard || displayFlavours.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === displayFlavours.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [isCarouselHovered, expandedCard, displayFlavours.length]);

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      setExpandedCard(displayFlavours[index]);
      setFlippedCard(null);
      setSelectedQuantity(1);
      setSelectedSize('1kg');
    } else {
      setActiveIndex(index);
      setFlippedCard(null);
    }
  };

  // Desktop drag handler
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) handleNext();
    else if (info.offset.x > swipeThreshold) handlePrev();
  };

  // Mobile native touch swipe
  const onTouchStart = useCallback((e) => { touchStartX.current = e.touches[0].clientX; }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 45) { delta > 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  }, [handleNext, handlePrev]);

  const getDiff = (index) => {
    const n = displayFlavours.length;
    let diff = ((index - activeIndex) % n + n) % n;
    if (diff > n / 2) diff -= n;
    return diff;
  };

  // ── DESKTOP card styles (original) ──
  const getCardStyles = (index) => {
    const diff = getDiff(index);
    const absDiff = Math.abs(diff);
    if (diff === 0) return { x: 0, scale: 1.05, opacity: 1, zIndex: 10, rotateY: 0, pointerEvents: 'auto' };
    if (isTablet) {
      if (absDiff > 2) return { x: diff > 0 ? diff * 150 : diff * 150, scale: 0.6, opacity: 0, zIndex: 0, rotateY: diff > 0 ? -25 : 25, pointerEvents: 'none' };
      return { x: diff * 140, scale: 1 - absDiff * 0.1, opacity: absDiff === 1 ? 0.65 : 0.35, zIndex: 10 - absDiff, rotateY: diff > 0 ? -18 : 18, pointerEvents: 'auto' };
    }
    // Desktop
    if (absDiff > 2) return { x: diff * 200, scale: 0.65, opacity: 0, zIndex: 0, rotateY: diff > 0 ? -25 : 25, pointerEvents: 'none' };
    return { x: diff * 210, scale: 1 - absDiff * 0.09, opacity: absDiff === 1 ? 0.7 : 0.35, zIndex: 10 - absDiff, rotateY: diff > 0 ? -18 : 18, pointerEvents: 'auto' };
  };

  return (
    <>
      <SEO title="Our Flavours" description="Explore our handcrafted gourmet saffron croquettes." />
      {/* Fixed Background — deep maroon on mobile, cream on desktop */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Mobile: deep maroon gradient matching home page */}
        <div className="block md:hidden w-full h-full" style={{ background: 'linear-gradient(160deg, #140003 0%, #1a0008 40%, #0d0002 100%)' }}>
          {/* Subtle radial glow like home page */}
          <div className="absolute top-0 left-0 w-[70vw] h-[70vw] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #4A0E1A 0%, transparent 70%)', transform: 'translate(-20%, -20%)' }}/>
          <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #BD561A 0%, transparent 70%)', transform: 'translate(20%, 20%)' }}/>
        </div>
        {/* Desktop: original cream/image background */}
        <div className="hidden md:block w-full h-full bg-[#f0ddd2]">
          <img src="/assets/Casasoul-bg.jpg" alt="" className="w-full h-full object-cover object-center" />
        </div>
      </div>

      <section className="flavours-content-wrapper relative z-10 w-full h-auto min-h-screen flex flex-col py-6 lg:py-8 pt-[120px] overflow-x-hidden">

        {/* Header */}
        <motion.div {...fadeUp(0.2)} className="relative flex flex-col items-center text-center px-6 pt-4 md:pt-8 mt-[20px] z-10">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-normal leading-tight font-serif uppercase tracking-wide text-[#E6C587] md:text-[#720303] mt-3 mb-3 drop-shadow-sm" style={{ fontFamily: "'Cinzel', serif" }}>
            {t('flavoursPage.title')}
          </h2>
          <div className="w-24 h-[1px] bg-[#E6C587] md:bg-[#BD561A] my-4 opacity-50"></div>
        </motion.div>

        {/* Carousel Area */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center mt-2 overflow-visible">
          <div className="relative w-full flex items-center justify-center overflow-visible -mt-5">

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-0 md:left-4 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#BD561A]/30 bg-[#f6e5dd]/95 hover:bg-[#BD561A] text-[#BD561A] hover:text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 hover:-translate-x-[2px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>

            {/* ══ MOBILE carousel stage ══ */}
            {isMobile ? (
              <div
                className="relative w-full flex items-center justify-center select-none overflow-hidden"
                style={{ height: '310px' }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {displayFlavours.map((flavour, index) => {
                  const diff = getDiff(index);
                  return (
                    <MobileCard
                      key={flavour.id}
                      flavour={flavour}
                      index={index}
                      isActive={diff === 0}
                      diff={diff}
                      lang={lang}
                      t={t}
                      onClick={() => handleCardClick(index)}
                    />
                  );
                })}
              </div>
            ) : (
              /* ══ DESKTOP carousel stage — ORIGINAL UNCHANGED ══ */
              <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-visible select-none" style={{ perspective: '1400px' }}>
                {displayFlavours.map((flavour, index) => {
                  const styles = getCardStyles(index);
                  const diff = getDiff(index);
                  const isActive = diff === 0;
                  const isFlipped = flippedCard === index;

                  return (
                    <motion.div
                      key={flavour.id}
                      style={{
                        position: 'absolute',
                        width: isTablet ? '200px' : '230px',
                        height: '290px',
                        zIndex: styles.zIndex,
                        pointerEvents: styles.pointerEvents,
                      }}
                      animate={{
                        x: styles.x,
                        scale: styles.scale,
                        opacity: styles.opacity,
                        rotateY: styles.rotateY,
                        filter: isActive ? 'brightness(1)' : 'blur(0.5px) brightness(0.6)',
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 1 }}
                      drag={isActive ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.3}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleCardClick(index)}
                      onMouseEnter={() => { if (isActive) { setIsCarouselHovered(true); setFlippedCard(index); } }}
                      onMouseLeave={() => { setIsCarouselHovered(false); setFlippedCard(null); }}
                      className={`border rounded-2xl shadow-2xl cursor-pointer relative ${isActive ? 'border-[#E6C587] shadow-[0_0_40px_rgba(230,197,135,0.2)]' : 'border-[#E6C587]/15'}`}
                    >
                      <div className={`flip-card-inner rounded-2xl h-full w-full${isFlipped ? ' is-flipped' : ''}`}>
                        {/* FRONT FACE */}
                        <div className="flip-face rounded-2xl bg-[#2c0107] p-3 md:p-4 flex flex-col justify-between h-full w-full absolute top-0 left-0 overflow-hidden">

                          {/* TOP-LEFT corner ornament */}
                          <svg className="absolute top-0 left-0 w-10 h-10 text-[#E6C587] opacity-20 pointer-events-none" viewBox="0 0 40 40" fill="none">
                            <path d="M2 38 L2 6 Q2 2 6 2 L38 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
                            <path d="M8 2 L8 8 M2 8 L8 8" stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
                          </svg>

                          {/* BOTTOM-RIGHT corner ornament */}
                          <svg className="absolute bottom-0 right-0 w-10 h-10 text-[#E6C587] opacity-20 pointer-events-none rotate-180" viewBox="0 0 40 40" fill="none">
                            <path d="M2 38 L2 6 Q2 2 6 2 L38 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
                            <path d="M8 2 L8 8 M2 8 L8 8" stroke="currentColor" strokeWidth="0.7" opacity="0.6"/>
                          </svg>

                          {/* TOP-RIGHT tiny diamond */}
                          <svg className="absolute top-2.5 right-2.5 w-3 h-3 text-[#E6C587] opacity-25 pointer-events-none" viewBox="0 0 12 12" fill="none">
                            <rect x="2" y="2" width="8" height="8" rx="0.5" transform="rotate(45 6 6)" stroke="currentColor" strokeWidth="0.8"/>
                            <rect x="4" y="4" width="4" height="4" rx="0.2" transform="rotate(45 6 6)" fill="currentColor" opacity="0.4"/>
                          </svg>

                          {/* BOTTOM-LEFT tiny diamond */}
                          <svg className="absolute bottom-2.5 left-2.5 w-3 h-3 text-[#E6C587] opacity-25 pointer-events-none" viewBox="0 0 12 12" fill="none">
                            <rect x="2" y="2" width="8" height="8" rx="0.5" transform="rotate(45 6 6)" stroke="currentColor" strokeWidth="0.8"/>
                            <rect x="4" y="4" width="4" height="4" rx="0.2" transform="rotate(45 6 6)" fill="currentColor" opacity="0.4"/>
                          </svg>

                          <div className="flex justify-between items-center mb-2 border-b border-[#E6C587]/10 pb-1.5 relative z-10">
                            <span className="text-[7px] md:text-[8px] tracking-[0.25em] font-extrabold text-[#E6C587]/70 uppercase font-sans">{flavour.tagline?.[lang] || t(`flavoursPage.items.${index}.tagline`) || flavour.tagline?.en}</span>
                            {/* Premium saffron stamen SVG */}
                            <svg className="w-3.5 h-3.5 text-[#E6C587] opacity-60" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                              <path d="M10 18 L10 6"/>
                              <path d="M10 6 C10 6 7 3 5 1"/>
                              <path d="M10 6 C10 6 13 3 15 1"/>
                              <path d="M10 9 C10 9 6 7 4 7"/>
                              <path d="M10 9 C10 9 14 7 16 7"/>
                              <circle cx="10" cy="6" r="1.2" fill="currentColor" opacity="0.7"/>
                            </svg>
                          </div>

                          <div className="flex-1 flex items-center justify-center my-1 relative z-10">
                            <div className="relative inline-flex items-center justify-center">
                              {/* Spinning dashed orbit ring */}
                              <motion.svg
                                className="absolute text-[#E6C587] opacity-20 pointer-events-none"
                                style={{ width: isTablet ? 116 : 132, height: isTablet ? 116 : 132 }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
                                viewBox="0 0 100 100" fill="none"
                              >
                                <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 6"/>
                              </motion.svg>

                              {/* Compass diamond dots */}
                              <svg className="absolute text-[#E6C587] opacity-50 pointer-events-none w-2 h-2" style={{ top: '-3px', left: '50%', transform: 'translateX(-50%)' }} viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor"/></svg>
                              <svg className="absolute text-[#E6C587] opacity-50 pointer-events-none w-2 h-2" style={{ bottom: '-3px', left: '50%', transform: 'translateX(-50%)' }} viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor"/></svg>
                              <svg className="absolute text-[#E6C587] opacity-50 pointer-events-none w-2 h-2" style={{ right: '-3px', top: '50%', transform: 'translateY(-50%)' }} viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor"/></svg>
                              <svg className="absolute text-[#E6C587] opacity-50 pointer-events-none w-2 h-2" style={{ left: '-3px', top: '50%', transform: 'translateY(-50%)' }} viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" transform="rotate(45 4 4)" fill="currentColor"/></svg>

                              <div className="relative p-1 rounded-full border border-[#E6C587]/25 bg-[#2c0107]">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-[#E6C587] shadow-md bg-[#1c0004]">
                                  <img src={flavour.image} alt={flavour.name} loading="lazy" className="w-full h-full object-cover select-none" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-center relative z-10">
                            {/* Ornamental divider */}
                            <div className="flex items-center justify-center gap-1.5 mb-1.5">
                              <svg className="w-6 h-[6px] text-[#E6C587] opacity-40" viewBox="0 0 24 6" fill="none">
                                <path d="M0 3 L8 3" stroke="currentColor" strokeWidth="0.8"/>
                                <polygon points="10,1 14,3 10,5" fill="currentColor" opacity="0.6"/>
                                <path d="M16 3 L24 3" stroke="currentColor" strokeWidth="0.8"/>
                              </svg>
                              <div className="w-1 h-1 rotate-45 border border-[#E6C587]/50 bg-[#E6C587]/20"/>
                              <svg className="w-6 h-[6px] text-[#E6C587] opacity-40 rotate-180" viewBox="0 0 24 6" fill="none">
                                <path d="M0 3 L8 3" stroke="currentColor" strokeWidth="0.8"/>
                                <polygon points="10,1 14,3 10,5" fill="currentColor" opacity="0.6"/>
                                <path d="M16 3 L24 3" stroke="currentColor" strokeWidth="0.8"/>
                              </svg>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-serif italic text-[#E6C587]/90 tracking-wide font-light block mb-1">{flavour.spanishName || t(`flavoursPage.items.${index}.spanishName`)}</span>
                            <h3 className="text-sm sm:text-base font-bold text-white font-serif tracking-wide text-center leading-tight">{flavour.name?.[lang] || t(`flavoursPage.items.${index}.name`) || flavour.name?.en}</h3>
                          </div>

                          <div className="mt-1.5 flex justify-between items-center text-[6px] font-bold tracking-widest text-[#E6C587]/30 font-sans uppercase relative z-10">
                            <span>Kasa Saffron</span>
                            <svg className="w-5 h-3 text-[#E6C587] opacity-20" viewBox="0 0 20 10" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round">
                              <path d="M1 5 C3 2 5 2 7 5 C5 8 3 8 1 5Z"/>
                              <path d="M13 5 C15 2 17 2 19 5 C17 8 15 8 13 5Z"/>
                              <path d="M7 5 L13 5"/>
                              <circle cx="10" cy="5" r="0.8" fill="currentColor"/>
                            </svg>
                            <span>#{flavour.id}</span>
                          </div>
                        </div>

                        {/* BACK FACE */}
                        <div className="flip-face flip-face-back rounded-2xl bg-[#140003] flex flex-col overflow-hidden h-full w-full absolute top-0 left-0">
                          <div className="w-full h-[50%] relative shrink-0">
                            <img src={flavour.image} alt={flavour.name} loading="lazy" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#140003] opacity-90" />
                          </div>
                          <div className="flex-1 p-3 flex flex-col items-center justify-center text-center border-t border-[#E6C587]/15">
                            <h3 className="text-xs sm:text-sm font-bold text-[#E6C587] font-serif tracking-wide mb-1.5">{flavour.name?.[lang] || t(`flavoursPage.items.${index}.name`) || flavour.name?.en}</h3>
                            <p className="text-[9px] sm:text-[10px] text-[#f6e5dd]/85 font-sans leading-relaxed line-clamp-4">{flavour.description?.[lang] || t(`flavoursPage.items.${index}.description`) || flavour.description?.en}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-0 md:right-4 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#BD561A]/30 bg-[#f6e5dd]/95 hover:bg-[#BD561A] text-[#BD561A] hover:text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 hover:translate-x-[2px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>

          {/* ── MOBILE ONLY: dot indicators + active name + CTA ── */}
          {isMobile && (
            <div className="flex flex-col items-center mt-4 px-4 w-full">
              {/* Dots */}
              <div className="flex gap-1.5 mb-5">
                {displayFlavours.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    style={{
                      width: i === activeIndex ? '20px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: i === activeIndex ? '#E6C587' : 'rgba(230,197,135,0.25)',
                      transition: 'all 0.3s ease',
                    }}
                    aria-label={`Flavour ${i + 1}`}
                  />
                ))}
              </div>

              {/* Active flavour info */}
              {displayFlavours[activeIndex] && (
                <div className="text-center w-full max-w-xs">
                  <p className="text-[9px] tracking-[0.35em] text-[#E6C587]/60 font-bold uppercase mb-1">
                    {displayFlavours[activeIndex].spanishName}
                  </p>
                  <h2 className="text-lg font-serif text-[#E6C587] tracking-wide leading-snug mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                    {displayFlavours[activeIndex].name?.[lang] || t(`flavoursPage.items.${activeIndex}.name`) || displayFlavours[activeIndex].name?.en || displayFlavours[activeIndex].name}
                  </h2>
                  <p className="text-[11px] text-white/50 font-sans leading-relaxed mb-4 line-clamp-2">
                    {displayFlavours[activeIndex].description?.[lang] || t(`flavoursPage.items.${activeIndex}.description`) || displayFlavours[activeIndex].description?.en || displayFlavours[activeIndex].description}
                  </p>
                  <button
                    onClick={() => { setExpandedCard(displayFlavours[activeIndex]); setSelectedQuantity(1); setSelectedSize('1kg'); }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#E6C587]/40 bg-[#E6C587]/10 text-[#E6C587] text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#E6C587]/20 transition-colors active:scale-95 backdrop-blur-sm"
                  >
                    {t('flavoursPage.addToOrder', 'Add to Order')}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ── Expanded Card Modal (shared desktop + mobile) ── */}
      <AnimatePresence>
        {expandedCard && (
          <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-8">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#140003]/60 backdrop-blur-md cursor-pointer" 
              onClick={() => setExpandedCard(null)} 
            />

            {isMobile ? (
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative z-10 w-full h-[88vh] overflow-hidden bg-[#0a0001] rounded-t-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-[#E6C587]/20 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag Handle */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-[#E6C587]/30 rounded-full z-50 pointer-events-none" />
                
                {/* Close Button */}
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-[#130004]/80 backdrop-blur-md border border-[#E6C587]/20 text-[#E6C587] hover:bg-[#E6C587] hover:text-[#130004]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Image Header */}
                <div className="w-full h-[32vh] shrink-0 relative">
                  <motion.div layoutId={`flavour-image-${expandedCard.id}`} className="absolute inset-0">
                    <img src={expandedCard.image} alt={expandedCard.name} loading="lazy" className="w-full h-full object-cover" />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0001] via-[#0a0001]/40 to-transparent pointer-events-none" />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 pt-2 pb-32">
                  <span className="inline-block text-[9px] font-bold tracking-[0.25em] text-[#E6C587]/70 uppercase mb-3">
                    {expandedCard.tagline?.[lang] || t(`flavoursPage.items.${expandedCard.id - 1}.tagline`) || expandedCard.tagline?.en}
                  </span>
                  <h3 className="text-3xl font-serif text-[#E6C587] mb-3 leading-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                    {expandedCard.name?.[lang] || t(`flavoursPage.items.${expandedCard.id - 1}.name`) || expandedCard.name?.en}
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed font-light">
                    {expandedCard.description?.[lang] || t(`flavoursPage.items.${expandedCard.id - 1}.description`) || expandedCard.description?.en}
                  </p>

                  {/* Size Selector */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-[#E6C587]/50 uppercase tracking-[0.2em] mb-3">Select Size</p>
                    <div className="flex gap-3">
                      <button onClick={() => setSelectedSize('500g')} className={`flex-1 py-3 px-3 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all duration-300 ${selectedSize === '500g' ? 'border-[#E6C587] bg-[#E6C587] text-[#140003] shadow-[0_0_15px_rgba(230,197,135,0.4)]' : 'border-[#E6C587]/20 bg-[#130004] text-[#E6C587]/60'}`}>500g</button>
                      <button onClick={() => setSelectedSize('1kg')} className={`flex-1 py-3 px-3 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all duration-300 ${selectedSize === '1kg' ? 'border-[#E6C587] bg-[#E6C587] text-[#140003] shadow-[0_0_15px_rgba(230,197,135,0.4)]' : 'border-[#E6C587]/20 bg-[#130004] text-[#E6C587]/60'}`}>1kg</button>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-[#E6C587]/50 uppercase tracking-[0.2em] mb-3">Quantity</p>
                    <div className="flex items-center w-fit bg-[#130004] border border-[#E6C587]/20 rounded-xl overflow-hidden shadow-sm">
                      <button onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))} className="w-12 h-10 flex items-center justify-center text-[#E6C587] hover:bg-[#E6C587]/10 transition-colors text-xl font-light disabled:opacity-30 disabled:hover:bg-transparent" disabled={selectedQuantity <= 1}>−</button>
                      <span className="w-12 h-10 flex items-center justify-center text-white font-bold text-sm bg-black/20">{selectedQuantity}</span>
                      <button onClick={() => setSelectedQuantity(q => Math.min(99, q + 1))} className="w-12 h-10 flex items-center justify-center text-[#E6C587] hover:bg-[#E6C587]/10 transition-colors text-xl font-light">+</button>
                    </div>
                  </div>
                </div>

                {/* Sticky Mobile Footer */}
                <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0a0001] via-[#0a0001] to-[#0a0001]/0 pb-6 border-t border-[#E6C587]/10 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-[#E6C587]/50 uppercase tracking-[0.2em] mb-1">Total Price</span>
                      <span className="text-2xl font-serif text-[#E6C587] leading-none drop-shadow-sm">
                        €{((selectedSize === '500g' ? expandedCard.price500g || 12 : expandedCard.price1kg || 20) * selectedQuantity).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart({ id: expandedCard.id, name: expandedCard.name?.[lang] || expandedCard.name?.en || expandedCard.name, image: expandedCard.image, size: selectedSize, price: selectedSize === '500g' ? expandedCard.price500g || 12 : expandedCard.price1kg || 20, quantity: selectedQuantity });
                        setExpandedCard(null);
                      }}
                      className="flex-1 max-w-[200px] py-3.5 bg-[#E6C587] text-[#140003] text-xs font-bold tracking-widest uppercase rounded-full shadow-[0_4px_15px_rgba(230,197,135,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      Add to Cart
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 30, scale: 0.95, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 30, scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative z-10 w-full md:max-w-5xl md:h-[650px] overflow-hidden bg-[#fdfbf7] md:rounded-[2rem] md:shadow-[0_30px_60px_-15px_rgba(20,0,3,0.5)] border border-[#2c0107]/10 flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[#f6e5dd]/90 backdrop-blur-md shadow-sm border border-[#2c0107]/10 text-[#2c0107] hover:bg-[#2c0107] hover:text-[#E6C587] hover:shadow-md transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Image Section */}
                <div className="w-full md:w-[45%] h-full relative p-6 pr-0 shrink-0">
                  <div className="w-full h-full relative rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgba(44,1,7,0.15)] border border-[#E6C587]/40">
                    <motion.div layoutId={`flavour-image-${expandedCard.id}`} className="absolute inset-0">
                      <img src={expandedCard.image} alt={expandedCard.name} loading="lazy" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#140003]/30 via-transparent to-transparent pointer-events-none"></div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-[55%] p-12 flex flex-col bg-[#fdfbf7] overflow-y-auto">
                  <div className="mt-auto mb-auto">
                    <span className="inline-block text-xs font-bold tracking-[0.25em] text-[#BD561A] bg-[#BD561A]/10 px-3 py-1 rounded-full uppercase mb-4">
                      {expandedCard.tagline?.[lang] || t(`flavoursPage.items.${expandedCard.id - 1}.tagline`) || expandedCard.tagline?.en}
                    </span>
                    <h3 className="text-5xl font-serif text-[#140003] mb-5 leading-[1.1]">
                      {expandedCard.name?.[lang] || t(`flavoursPage.items.${expandedCard.id - 1}.name`) || expandedCard.name?.en}
                    </h3>
                    <div className="w-16 h-[2px] bg-[#E6C587] mb-6"></div>
                    <p className="text-[#2c0107]/70 text-base mb-8 leading-relaxed font-sans font-medium">
                      {expandedCard.description?.[lang] || t(`flavoursPage.items.${expandedCard.id - 1}.description`) || expandedCard.description?.en}
                    </p>

                    {/* Size Selector */}
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-[#2c0107]/50 uppercase tracking-[0.2em] mb-3">Select Size</p>
                      <div className="flex gap-4">
                        <button onClick={() => setSelectedSize('500g')} className={`flex-1 py-3.5 px-4 rounded-xl border text-sm font-bold tracking-wide transition-all duration-300 ${selectedSize === '500g' ? 'border-[#2c0107] bg-[#2c0107] text-[#E6C587] shadow-[0_8px_20px_rgba(44,1,7,0.2)] transform scale-[1.02]' : 'border-[#2c0107]/15 bg-white text-[#2c0107]/70 hover:border-[#2c0107]/40 hover:bg-[#f6e5dd]'}`}>500g</button>
                        <button onClick={() => setSelectedSize('1kg')} className={`flex-1 py-3.5 px-4 rounded-xl border text-sm font-bold tracking-wide transition-all duration-300 ${selectedSize === '1kg' ? 'border-[#2c0107] bg-[#2c0107] text-[#E6C587] shadow-[0_8px_20px_rgba(44,1,7,0.2)] transform scale-[1.02]' : 'border-[#2c0107]/15 bg-white text-[#2c0107]/70 hover:border-[#2c0107]/40 hover:bg-[#f6e5dd]'}`}>1kg</button>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-10">
                      <p className="text-[10px] font-bold text-[#2c0107]/50 uppercase tracking-[0.2em] mb-3">Quantity</p>
                      <div className="flex items-center w-fit bg-white border border-[#2c0107]/15 rounded-xl overflow-hidden shadow-sm">
                        <button onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))} className="w-14 h-12 flex items-center justify-center text-[#2c0107] hover:bg-[#f6e5dd] transition-colors text-2xl font-light disabled:opacity-30 disabled:hover:bg-white" disabled={selectedQuantity <= 1}>−</button>
                        <span className="w-14 h-12 flex items-center justify-center text-[#140003] font-bold text-base bg-gray-50/50">{selectedQuantity}</span>
                        <button onClick={() => setSelectedQuantity(q => Math.min(99, q + 1))} className="w-14 h-12 flex items-center justify-center text-[#2c0107] hover:bg-[#f6e5dd] transition-colors text-2xl font-light">+</button>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between gap-6 pt-6 border-t border-[#2c0107]/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#2c0107]/50 uppercase tracking-[0.2em] mb-1">Total Price</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-serif text-[#140003] leading-none">
                            €{((selectedSize === '500g' ? expandedCard.price500g || 12 : expandedCard.price1kg || 20) * selectedQuantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          addToCart({ id: expandedCard.id, name: expandedCard.name?.[lang] || expandedCard.name?.en || expandedCard.name, image: expandedCard.image, size: selectedSize, price: selectedSize === '500g' ? expandedCard.price500g || 12 : expandedCard.price1kg || 20, quantity: selectedQuantity });
                          setExpandedCard(null);
                        }}
                        className="group relative px-8 py-5 bg-[#2c0107] text-[#E6C587] text-sm font-bold tracking-[0.15em] uppercase rounded-xl overflow-hidden shadow-[0_10px_25px_rgba(44,1,7,0.3)] hover:shadow-[0_15px_35px_rgba(44,1,7,0.4)] transition-all duration-300 hover:-translate-y-1 w-auto text-center"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          Add to Cart
                          <svg className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#4a020d] to-[#140003] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
