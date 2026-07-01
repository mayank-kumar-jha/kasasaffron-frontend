import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import SEO from './components/SEO';
import api from './api/client.js';
import { getCurrentUserLocal } from './api/auth.service';

gsap.registerPlugin(ScrollTrigger);

import { FLAVOURS, BENEFITS, PARTNERS, STATS, PROCESS } from './data/b2bData';
import AnimatedNumber from './components/B2b/AnimatedNumber';
import BenefitIcon from './components/B2b/BenefitIcon';
import PartnerIcon from './components/B2b/PartnerIcon';
import B2bHeroSection from './components/B2b/B2bHeroSection';
import { useAdmin } from './context/AdminContext';
import SkeletonPage from './components/SkeletonPage';

/* ════════════════════════════════════════════════════════════════
   MAIN B2B PAGE
   ════════════════════════════════════════════════════════════════ */
export default function B2b() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const adminContext = useAdmin() || {};
  const { isDataLoading } = adminContext;
  const adminFlavours = adminContext.flavours || [];

  const displayFlavours = adminFlavours && adminFlavours.length > 0 ? adminFlavours : FLAVOURS;

  const flavours = displayFlavours.map((f, i) => {
    const transName = t(`flavoursPage.items.${i}.name`);
    const transTagline = t(`flavoursPage.items.${i}.tagline`);
    const transDesc = t(`flavoursPage.items.${i}.description`);

    // Safely extract string values in case backend returned multilingual objects
    const fName = typeof f.name === 'object' && f.name !== null ? (f.name.en || f.name.es || '') : f.name;
    const fTagline = typeof f.tagline === 'object' && f.tagline !== null ? (f.tagline.en || f.tagline.es || '') : f.tagline;
    const fDesc = typeof f.description === 'object' && f.description !== null ? (f.description.en || f.description.es || '') : f.description;
    const fNotes = typeof f.notes === 'object' && f.notes !== null ? (f.notes.en || f.notes.es || '') : f.notes;
    const fIngredients = typeof f.ingredients === 'object' && f.ingredients !== null ? (f.ingredients.en || f.ingredients.es || '') : f.ingredients;

    // Fallback to static b2bData if backend doesn't provide these
    const staticFlavour = FLAVOURS.find(sf => {
      const sfNameEn = typeof sf.name === 'object' && sf.name !== null ? sf.name.en : sf.name;
      const fNameEn = typeof f.name === 'object' && f.name !== null ? f.name.en : f.name;
      return sfNameEn === fNameEn;
    }) || {};

    return {
      ...f,
      name: (transName && transName !== `flavoursPage.items.${i}.name`) ? transName : fName,
      tagline: (transTagline && transTagline !== `flavoursPage.items.${i}.tagline`) ? transTagline : fTagline,
      description: (transDesc && transDesc !== `flavoursPage.items.${i}.description`) ? transDesc : fDesc,
      notes: fNotes || staticFlavour.notes,
      ingredients: fIngredients || staticFlavour.ingredients,
    };
  });

  const benefits = BENEFITS.map((b, i) => ({
    ...b,
    title: t(`b2b.benefits.${i}.title`),
    desc: t(`b2b.benefits.${i}.desc`),
  }));

  const partners = PARTNERS.map((p, i) => ({
    ...p,
    title: t(`b2b.partners.${i}.title`),
    desc: t(`b2b.partners.${i}.desc`),
  }));

  const stats = STATS.map((s, i) => {
    let num = s.number;
    if (i === 2) {
      num = displayFlavours.length;
    }
    return {
      ...s,
      number: num,
      label: t(`b2b.stats.${i}.label`),
    };
  });

  const processItems = PROCESS.map((p, i) => ({
    ...p,
    title: t(`b2b.process.${i}.title`),
    desc: t(`b2b.process.${i}.desc`),
  }));
  const pageRef = useRef(null);
  const catalogueRef = useRef(null);
  const timelineRef = useRef(null);
  /* ── Form State ── */
  const [formData, setFormData] = useState({
    companyName: '', contactPerson: '', phone: '', email: '',
    businessType: '', estimatedVolume: '', notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';

    if (name === 'phone') {
      const digitsOnly = value.replace(/[^0-9]/g, '');
      if (value !== digitsOnly && value.replace('+', '') !== digitsOnly) {
        error = 'Phone number must contain digits only.';
      } else if (digitsOnly.length > 10) {
        error = 'Phone number cannot exceed 10 digits.';
      }
      newValue = digitsOnly.slice(0, 10);
    }

    setFormErrors(prev => ({ ...prev, [name]: error }));
    setFormData({ ...formData, [name]: newValue });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!getCurrentUserLocal()) {
      navigate('/auth');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await api.post('/b2b', formData);
      setStatus({ type: 'success', message: 'Your inquiry has been received. We\'ll respond within 24 hours.' });
      setFormData({ companyName: '', contactPerson: '', phone: '', email: '', businessType: '', estimatedVolume: '', notes: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Scroll Progress ── */
  const { scrollYProgress } = useScroll();
  const flower1Y = useTransform(scrollYProgress, [0.7, 1], [0, -35]);
  const flower2Y = useTransform(scrollYProgress, [0.7, 1], [0, 25]);

  /* ── GSAP ANIMATIONS ── */
  useLayoutEffect(() => {
    if (!pageRef.current) return;
    
    const ctx = gsap.context(() => {
      // 2. Horizontal Catalogue Scroll (REMOVED: Now using manual button slider)

      // 3. Timeline Draw
      if (timelineRef.current) {
        const line = timelineRef.current.querySelector('.timeline-line-fill');
        const nodes = timelineRef.current.querySelectorAll('.timeline-node');

        if (line) {
          gsap.fromTo(line, { scaleY: 0 }, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 1,
            }
          });
        }

        nodes.forEach((node, i) => {
          gsap.fromTo(node, { scale: 0, opacity: 0 }, {
            scale: 1, opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: node,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            }
          });
        });
      }

      // 4. Testimonial Section Floating Cards Trigger
      const testimonialSection = pageRef.current.querySelector('.testimonial-section');
      if (testimonialSection) {
        const floatingCards = testimonialSection.querySelectorAll('.testimonial-float-card');

        // Ensure cards start invisible before GSAP takes control
        gsap.set(floatingCards, { opacity: 0, scale: 0.1 });

        floatingCards.forEach((card) => {
          const finalRot = parseFloat(card.dataset.rot || 0);

          ScrollTrigger.create({
            trigger: testimonialSection,
            start: 'top 65%',
            once: true,
            onEnter: () => {
              const parent = testimonialSection;
              const parentCenterX = parent.offsetWidth / 2;
              const parentCenterY = parent.offsetHeight / 2;
              const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
              const cardCenterY = card.offsetTop + card.offsetHeight / 2;

              gsap.fromTo(card,
                {
                  x: parentCenterX - cardCenterX,
                  y: parentCenterY - cardCenterY,
                  scale: 0.1,
                  opacity: 0,
                  rotation: finalRot > 0 ? 35 : -35
                },
                {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  rotation: finalRot,
                  duration: 1.4,
                  ease: 'back.out(1.1)',
                }
              );
            }
          });
        });
      }
    }, pageRef);

    // Watch for layout changes, debounce and ignore height-only shifts (mobile address bar)
    let lastWidth = window.innerWidth;
    let resizeTimer;
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width !== lastWidth) {
          lastWidth = entry.contentRect.width;
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 300);
        }
      }
    });
    if (pageRef.current) {
      ro.observe(pageRef.current);
    }

    return () => {
      clearTimeout(resizeTimer);
      ro.disconnect();
      ctx.revert();
    };
  }, [i18n.language, isDataLoading]);

  if (isDataLoading) return <SkeletonPage />;

  return (
    <div ref={pageRef} className="relative w-full bg-[#f6e5dd] overflow-hidden">
      <SEO title="B2B Partnership" description="Partner with Kasa Saffron for wholesale and catering." />
      {/* ── Grain Texture Overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-[2] bg-grain opacity-[0.035]" />


      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO (Framer-style bento grid)
         ════════════════════════════════════════════════════════════ */}
      {/* Hero rendered via inner component so hooks are stable */}
      <B2bHeroSection t={t} scrollYProgress={scrollYProgress} />


      {/* ── MINIMAL BLENDING SVG DIVIDER ── */}
      <div className="relative z-20 w-full flex justify-center -mt-[62px] -mb-4 select-none pointer-events-none">
        <svg className="w-full max-w-7xl h-16 text-[#BD561A]/25" viewBox="0 0 1200 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Solid straight horizontal divider line */}
          <path
            d="M0 32 L1200 32"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          {/* Centered blending background circle */}
          <circle cx="600" cy="32" r="22" fill="#f6e5dd" />
          {/* Gourmet Heart */}
          <g transform="translate(588, 20)">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#BD561A"
              className="opacity-90"
            />
          </g>
        </svg>
      </div>


      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — WHOLESALE BENEFITS
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-10 md:py-14 -mt-[55px]">
        {/* Decorative Swirls */}
        <div className="absolute left-0 top-[15%] opacity-65 pointer-events-none hidden md:block z-0">
          <svg width="450" height="300" viewBox="0 0 450 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-10,50 C120,80 180,20 280,120 C380,220 320,280 460,250" stroke="#BD561A" strokeWidth="1.5" strokeDasharray="6 8" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute right-0 bottom-[10%] opacity-55 pointer-events-none hidden md:block z-0">
          <svg width="500" height="250" viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleY(-1)' }}>
            <path d="M-20,180 C100,220 250,50 380,120 C460,160 490,60 520,40" stroke="#BD561A" strokeWidth="1.8" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-14">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-10"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#6E8F55] uppercase font-sans">{t('b2b.sec2Badge')}</span>
            <h2 className="text-xl md:text-3xl font-normal text-[#720303] mt-2.5" style={{ fontFamily: "'Cinzel', serif" }}>
              {t('b2b.sec2Title')}
            </h2>
            <div className="w-16 h-[1px] bg-[#BD561A]/40 mx-auto mt-3" />
          </motion.div>

          {/* Benefits List */}
          <div className="flex flex-col gap-2.5 md:gap-3 max-w-4xl mx-auto w-full">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`group relative bg-[#fdf6ee] border border-[#BD561A]/15 rounded-2xl p-3 md:p-3.5 hover:bg-[#fdf6ee] hover:border-[#BD561A]/40 hover:shadow-[0_15px_35px_rgba(114,3,3,0.05)] hover:-translate-y-0.5 transition-all duration-500 overflow-hidden w-full md:w-[75%] lg:w-[65%] ${i % 2 === 0 ? 'self-end' : 'self-start'} before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-gradient-to-b before:from-[#BD561A] before:to-[#720303] before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500`}
              >
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#BD561A]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Botanical Outline Watermark */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-105 transition-all duration-700 pointer-events-none text-[#BD561A]">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="0.8">
                    <path d="M50,0 C65,20 75,45 75,70 C75,85 65,95 50,95 C35,95 25,85 25,70 C25,45 35,20 50,0 Z M50,15 C42,30 35,50 35,70 C35,80 42,87 50,87 C58,87 65,80 65,70 C65,50 58,30 50,15 Z" />
                  </svg>
                </div>

                <div className="flex items-center gap-3 md:gap-3.5 relative z-10">
                  {/* Icon wrapper */}
                  <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-xl border border-[#BD561A]/20 bg-gradient-to-br from-[#fdf6ee] to-[#f5ece3] flex items-center justify-center text-[#720303] shadow-sm group-hover:from-[#720303] group-hover:to-[#BD561A] group-hover:text-white group-hover:border-[#720303] group-hover:rotate-6 transition-all duration-500">
                    <BenefitIcon type={benefit.icon} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm md:text-base font-bold italic text-[#720303] mb-0.5 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {benefit.title}
                    </h3>
                    <p className="text-[10.5px] md:text-[12px] text-[#63554e] leading-relaxed font-sans font-light">
                      {benefit.desc}
                    </p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 opacity-20 group-hover:opacity-80 transition-all duration-500 pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full stroke-[#BD561A]" strokeWidth="1.2">
                    <path d="M6 18 V6 H18" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — TESTIMONIAL (FROM OUR PARTNERS)
         ════════════════════════════════════════════════════════════ */}
      <section className="testimonial-section relative z-10 py-24 md:py-36 overflow-visible">
        {/* Burgundy background */}
        <div className="absolute inset-0 bg-[#2c0107]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E6C587' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="max-w-4xl mx-auto px-6 md:px-14 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#E6C587]/50 uppercase font-sans block mb-8">{t('b2b.sec6Badge')}</span>

            {/* Large editorial quote */}
            <div className="relative">
              <span className="absolute -top-8 -left-2 text-7xl md:text-8xl text-[#E6C587]/10 leading-none select-none" style={{ fontFamily: "'Cinzel', serif" }}>"</span>
              <p className="text-lg md:text-2xl lg:text-[1.7rem] text-[#f6e5dd] leading-relaxed font-light italic" style={{ fontFamily: "'Cinzel', serif" }}>
                {t('b2b.sec6Quote')}
              </p>
            </div>

            <div className="mt-8">
              <div className="w-12 h-[1px] bg-[#E6C587]/40 mx-auto mb-4" />
              <span className="text-xl text-[#E6C587]" style={{ fontFamily: "'Alex Brush', cursive" }}>{t('b2b.sec6Author')}</span>
              <p className="text-[10px] tracking-[0.2em] text-[#f6e5dd]/40 uppercase font-sans font-bold mt-1">{t('b2b.sec6AuthorRole')}</p>
            </div>
          </motion.div>
        </div>

        {/* Floating photo cards that fly out on ScrollTrigger */}
        <div
          className="testimonial-float-card hidden md:block absolute left-[3%] lg:left-[5%] top-[12%] w-28 h-36 lg:w-36 lg:h-44 bg-white p-2 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-[#E6C587]/30 z-20 cursor-pointer"
          data-rot="-12"
          style={{ opacity: 0 }}
        >
          <div className="w-full h-[80%] rounded-xl overflow-hidden bg-[#e8d5c0] border border-gray-50">
            <img src="/assets/b2b-hero/hero1.jpg" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-[20%] flex items-center justify-center">
            <span className="text-[7px] font-bold tracking-widest text-[#BD561A]/70 font-sans uppercase">KASA SAFFRON</span>
          </div>
        </div>

        <div
          className="testimonial-float-card hidden md:block absolute left-[6%] lg:left-[8%] bottom-[8%] w-28 h-36 lg:w-36 lg:h-44 bg-white p-2 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-[#E6C587]/30 z-20 cursor-pointer"
          data-rot="8"
          style={{ opacity: 0 }}
        >
          <div className="w-full h-[80%] rounded-xl overflow-hidden bg-[#e8d5c0] border border-gray-50">
            <img src="/assets/b2b-hero/hero2.jpg" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-[20%] flex items-center justify-center">
            <span className="text-[7px] font-bold tracking-widest text-[#BD561A]/70 font-sans uppercase">KASA SAFFRON</span>
          </div>
        </div>

        <div
          className="testimonial-float-card hidden md:block absolute right-[3%] lg:right-[5%] top-[18%] w-28 h-36 lg:w-36 lg:h-44 bg-white p-2 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-[#E6C587]/30 z-20 cursor-pointer"
          data-rot="10"
          style={{ opacity: 0 }}
        >
          <div className="w-full h-[80%] rounded-xl overflow-hidden bg-[#e8d5c0] border border-gray-50">
            <img src="/assets/b2b-hero/hero3.jpg" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-[20%] flex items-center justify-center">
            <span className="text-[7px] font-bold tracking-widest text-[#BD561A]/70 font-sans uppercase">KASA SAFFRON</span>
          </div>
        </div>

        <div
          className="testimonial-float-card hidden md:block absolute right-[6%] lg:right-[8%] bottom-[5%] w-28 h-36 lg:w-36 lg:h-44 bg-white p-2 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-[#E6C587]/30 z-20 cursor-pointer"
          data-rot="-6"
          style={{ opacity: 0 }}
        >
          <div className="w-full h-[80%] rounded-xl overflow-hidden bg-[#e8d5c0] border border-gray-50">
            <img src="/assets/b2b-hero/hero4.jpg" alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-[20%] flex items-center justify-center">
            <span className="text-[7px] font-bold tracking-widest text-[#BD561A]/70 font-sans uppercase">KASA SAFFRON</span>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════
          SECTION 5 — PARTNER TYPES
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-12 pb-[83px] md:pt-20 md:pb-[120px] overflow-hidden" style={{ marginTop: '-10px' }}>

        {/* Vertical Side Text (Laptop Only - Looping) */}
        <div className="hidden lg:block absolute left-4 top-0 bottom-0 w-[60px] opacity-40 pointer-events-none select-none">
          <div className="who-side-marquee-container">
            <div className="who-side-marquee-track" style={{ animation: 'whoSideMarqueeDown 35s linear infinite', fontSize: '20px' }}>
              SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;
              SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;
              SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;
              SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute right-4 top-0 bottom-0 w-[60px] opacity-40 pointer-events-none select-none">
          <div className="who-side-marquee-container">
            <div className="who-side-marquee-track" style={{ animation: 'whoSideMarqueeUp 35s linear infinite', fontSize: '20px' }}>
              SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;
              SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;
              SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;
              SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-14">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#6E8F55] uppercase font-sans">{t('b2b.sec5Badge')}</span>
            <h2 className="text-2xl md:text-3xl font-normal text-[#720303] mt-2" style={{ fontFamily: "'Cinzel', serif" }}>
              {t('b2b.sec5Title')}
            </h2>
            <div className="w-16 h-[1px] bg-[#BD561A]/40 mx-auto mt-3" />
          </motion.div>

          {/* ── Parent Card: KASA SAFFRON ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mb-4"
          >
            <div className="relative w-full max-w-md bg-gradient-to-br from-[#2c0107] via-[#1c0005] to-[#0e0003] border border-[#E6C587]/30 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(230,197,135,0.15)] text-center overflow-hidden">
              {/* Subtle radial glow */}
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(230,197,135,0.07),transparent_65%)] pointer-events-none" />
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#E6C587] to-transparent rounded-full" />

              <div className="relative z-10 flex flex-col items-center gap-3">
                {/* Logo Image */}
                <img src="/Images/Logo.png" alt="Kasa Saffron Logo" className="w-[46px] h-[46px] object-contain drop-shadow-md" />

                <div>
                  <p className="font-mono text-[8px] tracking-[0.3em] text-[#BD561A] uppercase mb-1">B2B Distribution Hub</p>
                  <h3 className="text-xl md:text-2xl font-bold text-[#E6C587] tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
                    KASA SAFFRON
                  </h3>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-[#E6C587]/10 w-full justify-center font-mono text-[9px] tracking-wider text-[#E6C587]/50">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#6E8F55] inline-block" />6 Active Sectors</span>
                  <span className="w-[1px] h-3 bg-[#E6C587]/15" />
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#BD561A] inline-block" />BCN Distribution</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── SVG Branch Connector Tree ── */}
          <motion.div
            className="relative w-full mb-2 hidden lg:block"
            style={{ height: 72 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox="0 0 900 72"
              preserveAspectRatio="none"
            >
              {/* Ghost background paths */}
              <path d="M450 0 L450 36 L150 36 L150 72" fill="none" stroke="#E6C587" strokeWidth="1" opacity="0.08" />
              <path d="M450 0 L450 72" fill="none" stroke="#E6C587" strokeWidth="1" opacity="0.08" />
              <path d="M450 0 L450 36 L750 36 L750 72" fill="none" stroke="#E6C587" strokeWidth="1" opacity="0.08" />

              {/* Animated glowing paths — left branch */}
              <motion.path
                d="M450 0 L450 36 L150 36 L150 72"
                fill="none"
                stroke="#BD561A"
                strokeWidth="1.5"
                filter="drop-shadow(0 0 4px #BD561A88)"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: "easeInOut", delay: 0.1 } }
                }}
              />
              {/* Animated glowing paths — center branch */}
              <motion.path
                d="M450 0 L450 72"
                fill="none"
                stroke="#BD561A"
                strokeWidth="1.5"
                filter="drop-shadow(0 0 4px #BD561A88)"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.7, ease: "easeInOut", delay: 0.0 } }
                }}
              />
              {/* Animated glowing paths — right branch */}
              <motion.path
                d="M450 0 L450 36 L750 36 L750 72"
                fill="none"
                stroke="#BD561A"
                strokeWidth="1.5"
                filter="drop-shadow(0 0 4px #BD561A88)"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: "easeInOut", delay: 0.1 } }
                }}
              />

              {/* Terminal dots at card tops */}
              {[150, 450, 750].map((x, i) => (
                <motion.circle
                  key={x}
                  cx={x} cy={72} r={3}
                  fill="#BD561A"
                  filter="drop-shadow(0 0 5px #BD561A)"
                  variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: { scale: 1, opacity: 1, transition: { duration: 0.3, delay: 0.9 + i * 0.06 } }
                  }}
                />
              ))}

              {/* Origin dot */}
              <motion.circle
                cx={450} cy={0} r={3}
                fill="#E6C587"
                filter="drop-shadow(0 0 5px #E6C58788)"
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  visible: { scale: 1, opacity: 1, transition: { duration: 0.3, delay: 0.0 } }
                }}
              />
            </svg>
          </motion.div>

          {/* Mobile: simple vertical line */}
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="w-[1px] h-8 bg-gradient-to-b from-[#E6C587]/50 to-[#BD561A]/20" />
          </div>

          {/* ── Child Cards: 3-column horizontal grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group relative bg-[#fdf6ee] border border-[#D4A96A]/20 rounded-2xl p-5 hover:border-[#BD561A]/40 hover:shadow-[0_12px_35px_rgba(189,86,26,0.12)] transition-all duration-500 overflow-hidden"
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-[#BD561A]/60 via-[#E6C587]/80 to-[#BD561A]/20 group-hover:from-[#BD561A] group-hover:via-[#E6C587] group-hover:to-[#BD561A]/40 transition-all duration-500" />

                {/* Top-right number badge */}
                <div className="absolute top-4 right-4 font-mono text-[9px] font-bold text-[#BD561A]/30 group-hover:text-[#BD561A]/60 transition-colors duration-300">
                  {`0${i + 1}`}
                </div>

                {/* Icon + Title row */}
                <div className="flex items-start gap-3 pl-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#BD561A]/10 to-[#E6C587]/15 border border-[#BD561A]/15 flex items-center justify-center text-[#BD561A] group-hover:bg-[#BD561A]/15 group-hover:border-[#BD561A]/35 group-hover:scale-105 transition-all duration-400 shrink-0 mt-0.5">
                    <PartnerIcon type={partner.icon} />
                  </div>
                  <h3
                    className="text-[17px] leading-snug text-[#720303] group-hover:text-[#520212] transition-colors duration-300"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 600 }}
                  >
                    {partner.title}
                  </h3>
                </div>

                {/* Thin decorative divider */}
                <div className="pl-3 mb-3">
                  <div className="h-[1px] w-10 bg-gradient-to-r from-[#BD561A]/50 to-transparent group-hover:w-16 transition-all duration-500" />
                </div>

                {/* Description */}
                <p className="pl-3 text-[11.5px] text-[#6b4f3a]/70 leading-relaxed font-sans group-hover:text-[#6b4f3a] transition-colors duration-300">
                  {partner.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════
          SECTION 4 — PRODUCT CATALOGUE (Manual Slider)
         ════════════════════════════════════════════════════════════ */}
      <section id="catalogue" className="relative z-10 py-12 md:py-16 -mt-[50px] overflow-hidden">
        {/* Burgundy background pattern */}
        <div className="absolute inset-0 bg-[#2c0107]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E6C587' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#E6C587]/60 uppercase font-sans">{t('b2b.sec4Badge')}</span>
            <h2 className="text-2xl md:text-3xl font-normal text-[#E6C587] mt-2" style={{ fontFamily: "'Cinzel', serif" }}>
              {t('b2b.sec4Title')}
            </h2>
            <div className="w-16 h-[1px] bg-[#E6C587]/30 mx-auto mt-3" />
            <p className="text-xs text-[#f6e5dd]/70 mt-3 max-w-lg mx-auto font-sans font-light">
              {t('b2b.sec4Desc')}
            </p>
          </motion.div>
        </div>

        {/* Horizontal scroll track */}
        <div className="relative w-full overflow-hidden z-10">
          <div
            id="catalogue-slider"
            className="catalogue-track flex gap-5 md:gap-6 pl-6 md:pl-14 pr-6 md:pr-14 overflow-x-auto snap-x snap-mandatory pb-6 pt-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <style>{`#catalogue-slider::-webkit-scrollbar { display: none; }`}</style>
            {flavours.map((flavour, i) => (
              <div
                key={flavour.id}
                className="flex-none w-[240px] md:w-[280px] group snap-start"
              >
                <div className="relative bg-[#1c0005] border border-[#E6C587]/15 rounded-2xl overflow-hidden hover:border-[#E6C587]/45 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-[160px] md:h-[180px] overflow-hidden">
                    <img
                      src={flavour.image}
                      alt={flavour.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c0005]/80 via-transparent to-transparent" />
                    {/* Number badge */}
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full border border-[#E6C587]/30 bg-[#2c0107]/80 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-[9px] font-bold text-[#E6C587] font-sans">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    {/* Tagline */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[8px] font-bold tracking-[0.2em] text-[#E6C587]/90 uppercase font-sans">{flavour.tagline}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <h3 className="text-sm md:text-base font-bold text-[#E6C587] mb-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
                      {flavour.name}
                    </h3>
                    <p className="text-[10.5px] md:text-[11.5px] text-[#f6e5dd]/80 leading-relaxed font-sans font-light mb-3 line-clamp-3">
                      {flavour.description}
                    </p>

                    {/* Flavor notes */}
                    <div className="flex items-center gap-2 mb-2 min-h-[14px]">
                      <span className="text-[7.5px] font-bold tracking-[0.15em] text-[#BD561A] uppercase font-sans">Notes:</span>
                      <span className="text-[9.5px] text-[#f6e5dd]/90 font-sans italic">{flavour.notes || '—'}</span>
                    </div>
                    {/* Divider */}
                    <div className="w-full h-[1px] bg-[#E6C587]/15 mb-2.5" />
                    {/* Ingredients */}
                    <div className="flex items-start gap-2 min-h-[14px]">
                      <span className="text-[7.5px] font-bold tracking-[0.15em] text-[#BD561A] uppercase mt-0.5 shrink-0">Key:</span>
                      <span className="text-[9.5px] text-[#f6e5dd]/70 font-sans">{flavour.ingredients || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-14 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-[#E6C587]/30" />
            <span className="text-[8px] font-bold tracking-[0.25em] text-[#E6C587]/40 uppercase font-sans">Explore Flavours</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const slider = document.getElementById('catalogue-slider');
                if (slider) slider.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="w-8 h-8 rounded-full border border-[#E6C587]/30 flex items-center justify-center text-[#E6C587] hover:bg-[#E6C587]/10 transition-colors"
              aria-label="Previous flavours"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button
              onClick={() => {
                const slider = document.getElementById('catalogue-slider');
                if (slider) slider.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="w-8 h-8 rounded-full border border-[#E6C587]/30 flex items-center justify-center text-[#E6C587] hover:bg-[#E6C587]/10 transition-colors"
              aria-label="Next flavours"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
      </section>




      {/* ════════════════════════════════════════════════════════════
          SECTION 7 — PROCESS TIMELINE
         ════════════════════════════════════════════════════════════ */}
      <section ref={timelineRef} className="relative z-10 py-10 md:py-14 -mt-[25px]">
        {/* Decorative Swirls */}
        <div className="absolute left-[-2%] top-[10%] opacity-55 pointer-events-none hidden md:block z-0">
          <svg width="400" height="280" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-10,30 C80,110 150,10 220,130 C290,250 350,180 410,220" stroke="#BD561A" strokeWidth="1.2" strokeDasharray="5 7" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute right-[-2%] top-[40%] opacity-60 pointer-events-none hidden md:block z-0">
          <svg width="450" height="300" viewBox="0 0 450 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
            <path d="M-20,40 C120,140 180,-20 280,100 C380,220 310,260 470,240" stroke="#BD561A" strokeWidth="1.5" strokeDasharray="6 6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="absolute left-[-4%] bottom-[5%] opacity-50 pointer-events-none hidden md:block z-0">
          <svg width="500" height="220" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-10,180 C110,120 220,240 320,130 C420,20 450,100 510,60" stroke="#BD561A" strokeWidth="1.4" strokeDasharray="4 8" strokeLinecap="round" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-14">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 md:mb-8"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#6E8F55] uppercase font-sans">{t('b2b.sec7Badge')}</span>
            <h2 className="text-xl md:text-3xl font-normal text-[#720303] mt-2.5" style={{ fontFamily: "'Cinzel', serif" }}>
              {t('b2b.sec7Title')}
            </h2>
            <div className="w-16 h-[1px] bg-[#BD561A]/40 mx-auto mt-3" />
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line track */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-[#E6C587]/15" />
            {/* Animated fill */}
            <div className="timeline-line-fill absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-[#BD561A]/40 origin-top" />

            <div className="relative z-10 space-y-6 md:space-y-8 py-4 md:py-6">
              {processItems.map((step, i) => (
                <div key={step.step} className={`relative flex items-start gap-8 md:gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Node */}
                  <div className="timeline-node absolute left-6 md:left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#BD561A] border-2 border-[#f6e5dd] shadow-[0_0_0_4px_rgba(189,86,26,0.1)] z-10" />

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`ml-14 md:ml-0 md:w-[calc(50%-40px)] ${i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8 md:ml-auto'}`}
                  >
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#BD561A]/40 uppercase font-sans">Step {step.step}</span>

                    <div className={`flex items-center gap-2 mt-0.5 mb-1.5 ${i % 2 === 0 ? 'md:flex-row-reverse md:justify-start' : 'md:flex-row md:justify-start'}`}>
                      {step.step === '01' && (
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#BD561A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      )}
                      {step.step === '02' && (
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#BD561A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                      {step.step === '03' && (
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#BD561A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      )}
                      {step.step === '04' && (
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#BD561A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {step.step === '05' && (
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#BD561A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                      )}
                      <h3 className="text-sm md:text-base font-bold text-[#720303]" style={{ fontFamily: "'Cinzel', serif", margin: 0 }}>
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-[11px] md:text-[12px] text-[#514944] leading-relaxed font-sans font-light">
                      {step.desc}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════
          SECTION 8 — WHOLESALE INQUIRY FORM
         ════════════════════════════════════════════════════════════ */}
      <section id="inquiry" className="relative z-10 py-14 md:py-20 overflow-hidden">
        {/* Background & Cinematic Glows */}
        <div className="absolute inset-0 bg-[#160003]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url(/assets/About us box.png)", backgroundSize: 'cover', backgroundPosition: 'center' }} />

        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#E6C587]/4 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#BD561A]/8 blur-[110px] pointer-events-none" />

        {/* Fine gold borders at sections' interface */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E6C587]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E6C587]/20 to-transparent" />

        {/* Floating decorative flowers */}
        <motion.img
          src="/assets/FLOWER.png"
          alt=""
          className="absolute top-[12%] right-[-5%] w-40 opacity-[0.05] pointer-events-none select-none filter drop-shadow-[0_0_20px_rgba(189,86,26,0.15)]"
          style={{ y: flower1Y }}
        />
        <motion.img
          src="/Images/Hibiscus.png"
          alt=""
          className="absolute bottom-[8%] left-[-7%] w-44 opacity-[0.04] pointer-events-none select-none rotate-45"
          style={{ y: flower2Y }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-14">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">

            {/* Left — Copy */}
            <div className="flex-1 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[10px] font-bold tracking-[0.4em] text-[#E6C587]/70 uppercase font-sans block mb-2.5 animate-pulse">{t('b2b.sec8Badge')}</span>
                <h2 className="text-2xl md:text-[2.2rem] font-normal text-white leading-tight mb-1 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                  {t('b2b.sec8Title')}
                </h2>
                <p className="text-xl md:text-2xl text-[#BD561A] mb-5 font-medium italic" style={{ fontFamily: "'Alex Brush', cursive" }}>
                  {t('b2b.sec8Subtitle')}
                </p>
                <div className="w-16 h-[1px] bg-gradient-to-r from-[#E6C587] to-transparent mb-5" />
                <p className="text-[12.5px] text-[#f6e5dd]/75 leading-relaxed font-sans font-light mb-6">
                  {t('b2b.sec8Desc')}
                </p>

                {/* Styled value cards instead of basic bullet points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {t('b2b.bullets', { returnObjects: true }).map((point, i) => (
                    <div key={i} className="group flex items-start gap-3 bg-[#fdf6ee]/[0.02] border border-[#E6C587]/10 p-2.5 md:p-3 rounded-xl hover:bg-[#fdf6ee]/[0.05] hover:border-[#E6C587]/25 transition-all duration-300 hover:-translate-y-[1px] shadow-sm">
                      <span className="text-[#E6C587] text-[10px] mt-0.5 select-none transition-transform duration-300 group-hover:scale-125">✦</span>
                      <span className="text-[11px] text-[#f6e5dd]/80 font-sans tracking-wide leading-snug">{point}</span>
                    </div>
                  ))}
                </div>

                {/* WhatsApp */}
                <div className="border-t border-[#E6C587]/10 pt-5">
                  <p className="text-[10px] text-[#f6e5dd]/40 tracking-wider font-sans mb-2.5 uppercase">{t('b2b.whatsappText')}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href="https://wa.me/34681819652" className="group flex items-center gap-2.5 bg-white/[0.02] border border-[#E6C587]/10 rounded-full py-2 px-4 text-[#E6C587]/80 hover:text-[#E6C587] hover:bg-white/[0.05] hover:border-[#E6C587]/30 text-[11px] font-sans transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-[#6E8F55] transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      <span>+34 681 819 652</span>
                    </a>
                    <a href="https://wa.me/34681807047" className="group flex items-center gap-2.5 bg-white/[0.02] border border-[#E6C587]/10 rounded-full py-2 px-4 text-[#E6C587]/80 hover:text-[#E6C587] hover:bg-white/[0.05] hover:border-[#E6C587]/30 text-[11px] font-sans transition-all duration-300">
                      <svg className="w-3.5 h-3.5 text-[#6E8F55] transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      <span>+34 681 807 047</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Desktop Center Divider */}
            <div className="hidden lg:block w-[1px] self-stretch bg-gradient-to-b from-transparent via-[#E6C587]/15 to-transparent mx-1" />

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-lg lg:max-w-[48%] shadow-inner"
            >
              <div className="relative bg-[#1c0005]/80 backdrop-blur-xl border border-[#E6C587]/20 rounded-3xl p-5 md:p-6.5 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(230,197,135,0.05)] overflow-hidden">
                {/* Ambient lights inside card */}
                <div className="absolute top-[-20%] right-[-20%] w-36 h-36 rounded-full bg-[#E6C587]/5 blur-2xl pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-20%] w-36 h-36 rounded-full bg-[#BD561A]/8 blur-2xl pointer-events-none" />

                {/* Corner accents */}
                <svg className="absolute top-3 left-3 w-4.5 h-4.5 pointer-events-none" viewBox="0 0 32 32" fill="none"><path d="M4 28 V4 H28" stroke="#E6C587" strokeWidth="0.75" opacity="0.35" /></svg>
                <svg className="absolute bottom-3 right-3 w-4.5 h-4.5 pointer-events-none rotate-180" viewBox="0 0 32 32" fill="none"><path d="M4 28 V4 H28" stroke="#E6C587" strokeWidth="0.75" opacity="0.35" /></svg>

                {/* Form header ornament */}
                <div className="flex flex-col items-center mb-5">
                  <span className="text-[8px] font-bold tracking-[0.4em] text-[#BD561A] uppercase font-mono mb-1">Direct Inquiry Route</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E6C587]/40" />
                    <span className="text-[#E6C587] text-[8px]">✦</span>
                    <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E6C587]/40" />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  {status && (
                    <div className={`p-3 rounded-xl text-center text-[11px] font-sans ${status.type === 'success' ? 'bg-[#6E8F55]/20 text-[#96c476] border border-[#6E8F55]/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {status.message}
                    </div>
                  )}

                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold tracking-[0.25em] text-[#E6C587]/60 uppercase font-sans">{t('b2b.formLabels.company')}</label>
                      <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder={t('b2b.formPlaceholders.company')}
                        onFocus={() => setFocusedField('companyName')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-[#2c0107]/45 border border-[#E6C587]/15 rounded-xl px-3.5 py-2.5 text-[11px] text-[#f6e5dd] placeholder-[#f6e5dd]/25 focus:outline-none focus:border-[#E6C587] focus:ring-1 focus:ring-[#E6C587]/30 focus:bg-[#2c0107]/75 hover:border-[#E6C587]/35 hover:bg-[#2c0107]/50 transition-all duration-300 shadow-inner font-sans" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold tracking-[0.25em] text-[#E6C587]/60 uppercase font-sans">{t('b2b.formLabels.contactPerson')}</label>
                      <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required placeholder={t('b2b.formPlaceholders.contactPerson')}
                        onFocus={() => setFocusedField('contactPerson')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-[#2c0107]/45 border border-[#E6C587]/15 rounded-xl px-3.5 py-2.5 text-[11px] text-[#f6e5dd] placeholder-[#f6e5dd]/25 focus:outline-none focus:border-[#E6C587] focus:ring-1 focus:ring-[#E6C587]/30 focus:bg-[#2c0107]/75 hover:border-[#E6C587]/35 hover:bg-[#2c0107]/50 transition-all duration-300 shadow-inner font-sans" />
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 relative">
                      <label className="text-[9px] font-bold tracking-[0.25em] text-[#E6C587]/60 uppercase font-sans">{t('b2b.formLabels.phone')}</label>
                      <input type="tel" inputMode="numeric" name="phone" value={formData.phone} onChange={handleChange} required placeholder={t('b2b.formPlaceholders.phone')}
                        onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                        className={`w-full bg-[#2c0107]/45 border rounded-xl px-3.5 py-2.5 text-[11px] text-[#f6e5dd] placeholder-[#f6e5dd]/25 focus:outline-none focus:ring-1 focus:bg-[#2c0107]/75 transition-all duration-300 shadow-inner font-sans ${
                          formErrors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : 'border-[#E6C587]/15 focus:border-[#E6C587] focus:ring-[#E6C587]/30 hover:border-[#E6C587]/35 hover:bg-[#2c0107]/50'
                        }`} />
                      {formErrors.phone && (
                        <p className="text-[9px] text-red-400 mt-0.5 absolute -bottom-3.5 left-0">{formErrors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-[9px] font-bold tracking-[0.25em] text-[#E6C587]/60 uppercase font-sans">{t('b2b.formLabels.email')}</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder={t('b2b.formPlaceholders.email')}
                        onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-[#2c0107]/45 border border-[#E6C587]/15 rounded-xl px-3.5 py-2.5 text-[11px] text-[#f6e5dd] placeholder-[#f6e5dd]/25 focus:outline-none focus:border-[#E6C587] focus:ring-1 focus:ring-[#E6C587]/30 focus:bg-[#2c0107]/75 hover:border-[#E6C587]/35 hover:bg-[#2c0107]/50 transition-all duration-300 shadow-inner font-sans" />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold tracking-[0.25em] text-[#E6C587]/60 uppercase font-sans">{t('b2b.formLabels.businessType')}</label>
                      <div className="relative">
                        <select name="businessType" value={formData.businessType} onChange={handleChange} required
                          className="w-full bg-[#2c0107]/45 border border-[#E6C587]/15 rounded-xl px-3.5 py-2.5 text-[11px] text-[#f6e5dd] placeholder-[#f6e5dd]/25 focus:outline-none focus:border-[#E6C587] focus:ring-1 focus:ring-[#E6C587]/30 focus:bg-[#2c0107]/75 hover:border-[#E6C587]/35 hover:bg-[#2c0107]/50 transition-all duration-300 shadow-inner font-sans appearance-none cursor-pointer">
                          <option value="" disabled className="bg-[#160003] text-[#f6e5dd]/40">{t('b2b.formPlaceholders.selectType')}</option>
                          <option value="restaurant" className="bg-[#160003] text-[#f6e5dd]">Restaurant / Hotel</option>
                          <option value="catering" className="bg-[#160003] text-[#f6e5dd]">Catering</option>
                          <option value="supermarket" className="bg-[#160003] text-[#f6e5dd]">Supermarket / Retail</option>
                          <option value="cafe" className="bg-[#160003] text-[#f6e5dd]">Café / Bar</option>
                          <option value="distributor" className="bg-[#160003] text-[#f6e5dd]">Distributor</option>
                          <option value="other" className="bg-[#160003] text-[#f6e5dd]">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#E6C587]/60">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-[9px] font-bold tracking-[0.25em] text-[#E6C587]/60 uppercase font-sans">{t('b2b.formLabels.estimatedVolume')}</label>
                      <input type="text" name="estimatedVolume" value={formData.estimatedVolume} onChange={handleChange} required placeholder={t('b2b.formPlaceholders.estimatedVolume')}
                        onFocus={() => setFocusedField('estimatedVolume')} onBlur={() => setFocusedField(null)}
                        className="w-full bg-[#2c0107]/45 border border-[#E6C587]/15 rounded-xl px-3.5 py-2.5 text-[11px] text-[#f6e5dd] placeholder-[#f6e5dd]/25 focus:outline-none focus:border-[#E6C587] focus:ring-1 focus:ring-[#E6C587]/30 focus:bg-[#2c0107]/75 hover:border-[#E6C587]/35 hover:bg-[#2c0107]/50 transition-all duration-300 shadow-inner font-sans" />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1 relative pt-1">
                    <label className="text-[9px] font-bold tracking-[0.25em] text-[#E6C587]/60 uppercase font-sans">{t('b2b.formLabels.notes')}</label>
                    <textarea
                      rows="3" name="notes" value={formData.notes} onChange={handleChange}
                      placeholder={t('b2b.formPlaceholders.notes')}
                      onFocus={() => setFocusedField('notes')} onBlur={() => setFocusedField(null)}
                      className="w-full bg-[#2c0107]/45 border border-[#E6C587]/15 rounded-xl px-3.5 py-2.5 text-[11px] text-[#f6e5dd] placeholder-[#f6e5dd]/25 focus:outline-none focus:border-[#E6C587] focus:ring-1 focus:ring-[#E6C587]/30 focus:bg-[#2c0107]/75 hover:border-[#E6C587]/35 hover:bg-[#2c0107]/50 transition-all duration-300 shadow-inner font-sans resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || Object.values(formErrors).some(err => err)}
                      className="group w-full py-3 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase text-[#160003] transition-all duration-500 hover:-translate-y-[2px] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #E6C587 0%, #BD561A 100%)',
                      boxShadow: '0 8px 30px rgba(189,86,26,0.35)',
                      fontFamily: "'Cinzel', serif"
                    }}
                  >
                    {loading && (
                      <svg className="animate-spin w-4 h-4 text-[#160003]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    )}
                    <span>{loading ? t('b2b.formSubmitLoading') : t('b2b.formSubmit')}</span>
                    {!loading && (
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 stroke-[#160003]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    )}
                  </button>
                  </div>

                  {/* Privacy */}
                  <p className="text-center text-[9px] text-[#E6C587]/30 font-sans tracking-wide">
                    {t('b2b.privacy')}
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
