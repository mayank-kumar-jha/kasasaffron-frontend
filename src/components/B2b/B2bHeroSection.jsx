import React, { useRef, useLayoutEffect } from 'react';
import { motion, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import cataloguePdf from '../../assets/Kasa Saffron S.L Catalgog (1).pdf';

// Staggered delays from Framer's transition5–transition13
const HERO_IMG_DELAYS = [0.3, 0.0, 0.2, 0.4, 0.1, 0.8, 0.5, 0.7, 0.6];
const HERO_IMG_EASE = [0.43, 0.01, 0.17, 1];
const HERO_IMG_INIT = { opacity: 0, scale: 0.6 };

// 16 image slots (4 cols × 2 rows × 2 stacked per slot)
// We only have 5 source images — cycle through them
const HERO_SRCS = [
  '/assets/b2b-hero/hero6.jpg',
  '/assets/b2b-hero/hero7.jpg',
  '/assets/b2b-hero/hero8.jpg',
  '/assets/b2b-hero/hero4.jpg',
  '/assets/b2b-hero/hero5.jpg',
];

// Word-by-word animated span — spring blur reveal
function BlurWord({ word, delay }) {
  return (
    <motion.span
      style={{ display: 'inline-block', marginRight: '0.25em' }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4, delay }}
    >
      {word}
    </motion.span>
  );
}

export default function B2bHeroSection({ t, scrollYProgress }) {
  const heroGridRef = useRef(null);

  const titleLine1 = t('b2b.heroTitle1');
  const titleLine2 = t('b2b.heroTitle2');
  const desc = t('b2b.heroDesc');

  // Split titles into words for staggered reveal
  const words1 = titleLine1.split(' ');
  const words2 = titleLine2.split(' ');
  // Description words (start after title words finish)
  const titleWordCount = words1.length + words2.length;
  const descWords = desc.split(' ');

  // Parallax speeds per column (px when scrollYProgress goes 0→0.25)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const colParallax = isMobile ? [-15, -10, -15, -20] : [-50, -30, -45, -60]; // top row per column
  const colParallaxBot = isMobile ? [-10, -15, -10, -15] : [-25, -45, -35, -55]; // bottom row per column

  // Vertical offsets to stagger column start positions (bento feel)
  const colOffsetTop = ['pt-0', 'pt-10', 'pt-0', 'pt-8'];
  const colOffsetBot = ['pt-4', 'pt-0', 'pt-6', 'pt-2'];

  // Build 4×2 grid — top row images (indices 0–3 from HERO_SRCS cycling)
  const topRow = [0, 1, 2, 3].map(c => HERO_SRCS[c % HERO_SRCS.length]);
  const botRow = [4, 2, 0, 3].map(c => HERO_SRCS[c % HERO_SRCS.length]);

  // Text delay: start after GSAP animation finishes
  const TEXT_DELAY_BASE = 1.2;

  const topColYs = colParallax.map(to => useTransform(scrollYProgress, [0, 0.25], [0, to]));   // eslint-disable-line
  const botColYs = colParallaxBot.map(to => useTransform(scrollYProgress, [0, 0.25], [0, to])); // eslint-disable-line

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const gridCards = gsap.utils.toArray('.hero-grid-card');

      // Initially hide grid cards
      gsap.set(gridCards, { opacity: 0 });

      // Grid cards fly out from center
      const windowCenterX = window.innerWidth / 2;
      const windowCenterY = window.innerHeight / 2;

      gridCards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        // Distance from card center to window center
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const startX = windowCenterX - cardCenterX;
        const startY = windowCenterY - cardCenterY;

        tl.fromTo(card,
          { x: startX, y: startY, scale: 0.2, opacity: 0, rotation: (i % 2 === 0 ? -15 : 15) },
          { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.2)' },
          0 // Start immediately
        );
      });

    }, heroGridRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="b2b-hero-wrapper relative flex flex-col items-center justify-center overflow-hidden bg-[#f6e5dd] -mt-[80px] pt-[120px] md:-mt-[755px] md:pt-[calc(680px+4rem)] pb-16"
    >
      {/* ── DECORATIVE LEFT SWIRL ── */}
      <div className="absolute left-0 top-[65%] opacity-50 pointer-events-none hidden md:block z-0">
        <svg width="550" height="250" viewBox="0 0 550 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-20,100 C150,20 200,220 350,200 C450,180 500,50 600,80" stroke="#BD561A" strokeWidth="2" strokeDasharray="5 8" strokeLinecap="round" />
        </svg>
      </div>

      {/* ── DECORATIVE RIGHT SWIRL ── */}
      <div className="absolute right-[-5%] top-[60%] opacity-30 pointer-events-none hidden md:block z-0">
        <svg width="600" height="200" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
          <path d="M-50,100 C150,-50 400,250 650,50" stroke="#BD561A" strokeWidth="1.5" strokeDasharray="5 7" strokeLinecap="round" />
        </svg>
      </div>

      {/* ── UNIFIED IMAGE GRID with full vertical mask ── */}
      <div
        ref={heroGridRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10"
        style={{
          // Full vertical mask: fade top AND bottom, solid in middle
          mask: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, black 25%, black 75%, rgba(0,0,0,0) 100%)',
          WebkitMask: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, black 25%, black 75%, rgba(0,0,0,0) 100%)',
        }}
      >
        {/* TOP ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-10">
          {topRow.map((src, c) => (
            <motion.div
              key={`top-${c}`}
              className={`flex flex-col ${c < 2 ? colOffsetTop[c] : `hidden md:flex ${colOffsetTop[c]}`}`}
              style={{ y: topColYs[c], willChange: 'transform' }}
            >
              <div className="hero-grid-card" style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0px 0.6px 0.6px -1.25px rgba(0,0,0,.18), 0px 2.3px 2.3px -2.5px rgba(0,0,0,.16), 0px 10px 10px -3.75px rgba(0,0,0,.06)' }}>
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full object-cover aspect-[4/3] border border-[#E6C587]/20"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CENTER TEXT */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-2xl mx-auto my-6 md:my-10">
          {/* Title — word-by-word blur+scale spring */}
          <h1
            className="text-[1.5rem] md:text-[2.2rem] lg:text-[2.8rem] font-medium text-[#720303] leading-[1.15] mb-3"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {words1.map((w, i) => (
              <BlurWord key={`w1-${i}`} word={w} delay={TEXT_DELAY_BASE + i * 0.15} />
            ))}
            <br />
            {words2.map((w, i) => (
              <BlurWord key={`w2-${i}`} word={w} delay={TEXT_DELAY_BASE + (words1.length + i) * 0.15} />
            ))}
          </h1>

          {/* Description — word-by-word blur+scale spring */}
          <p className="text-sm md:text-[0.9rem] text-[#514944] leading-relaxed max-w-lg font-sans font-light mb-6">
            {descWords.map((w, i) => (
              <BlurWord key={`d-${i}`} word={w} delay={TEXT_DELAY_BASE + (titleWordCount + i) * 0.08} />
            ))}
          </p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.6, delay: TEXT_DELAY_BASE + titleWordCount * 0.15 + 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#inquiry"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', '#inquiry');
              }}
              className="group inline-flex items-center gap-2.5 px-7 py-3 bg-[#720303] md:hover:bg-[#520212] text-white text-[10px] font-bold tracking-[0.18em] uppercase rounded-full transition-all duration-500 md:hover:shadow-[0_8px_30px_rgba(114,3,3,0.3)] md:hover:-translate-y-[2px]"
            >
              {t('b2b.heroBtn1')}
              <svg className="w-3.5 h-3.5 md:group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </a>
            <a
              href={cataloguePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3 border border-[#BD561A]/40 text-[#720303] text-[10px] font-bold tracking-[0.18em] uppercase rounded-full hover:border-[#BD561A] hover:bg-[#BD561A]/5 transition-all duration-400"
            >
              {t('b2b.heroBtn2')}
            </a>
          </motion.div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-6 md:mt-10">
          {botRow.map((src, c) => (
            <motion.div
              key={`bot-${c}`}
              className={`flex flex-col ${c < 2 ? colOffsetBot[c] : `hidden md:flex ${colOffsetBot[c]}`}`}
              style={{ y: botColYs[c], willChange: 'transform' }}
            >
              <div className="hero-grid-card" style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0px 0.6px 0.6px -1.25px rgba(0,0,0,.18), 0px 2.3px 2.3px -2.5px rgba(0,0,0,.16), 0px 10px 10px -3.75px rgba(0,0,0,.06)' }}>
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover aspect-[4/3] border border-[#E6C587]/20"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
