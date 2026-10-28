import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SEO from './components/SEO';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-screen bg-[#140003] text-[#f6e5dd] flex flex-col justify-center items-center px-6 py-24 md:py-32 overflow-hidden">
      <SEO 
        title={t('notFound.pageTitle', '404 - Page Not Found')} 
        description={t('notFound.description', 'The page you are looking for does not exist. Explore Kasa Saffron artisanal croquettes and gourmet flavours.')} 
      />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-gradient-to-br from-[#720303]/30 via-[#BD561A]/15 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[280px] h-[280px] bg-[#E6C587]/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Subtle background grain & gold border lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E6C587]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E6C587]/20 to-transparent" />

      {/* Decorative watermark */}
      <img
        src="/Images/Hibiscus.png"
        alt=""
        loading="lazy"
        className="absolute right-[-8%] top-[15%] w-80 md:w-96 opacity-[0.03] pointer-events-none select-none rotate-45"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Badge */}
        <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E6C587]/30 bg-[#E6C587]/5 backdrop-blur-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E6C587] animate-pulse" />
          <span className="text-[11px] font-sans font-semibold tracking-[0.25em] text-[#E6C587] uppercase">
            {t('notFound.badge', 'ERROR 404')}
          </span>
        </motion.div>

        {/* 404 Large Display */}
        <motion.div {...fadeUp(0.2)} className="relative select-none my-2">
          <span 
            className="text-8xl sm:text-9xl md:text-[11rem] font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-[#E6C587] via-[#f6e5dd] to-[#BD561A]/60 leading-none drop-shadow-[0_10px_35px_rgba(189,86,26,0.25)]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            404
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          {...fadeUp(0.3)}
          className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-[#f6e5dd] uppercase mt-2 mb-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {t('notFound.title', 'A Recipe Lost in the Kitchen')}
        </motion.h1>

        {/* Golden separator */}
        <motion.div {...fadeUp(0.35)} className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#E6C587] to-transparent my-3 opacity-60" />

        {/* Description */}
        <motion.p 
          {...fadeUp(0.4)}
          className="text-sm sm:text-base text-[#f6e5dd]/70 font-light leading-relaxed max-w-lg mb-8"
        >
          {t('notFound.description', "It seems the link you followed has moved or never existed. Don't worry, our handcrafted artisanal croquettes are always fresh and waiting.")}
        </motion.p>

        {/* Primary Call to Action Buttons */}
        <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-10">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#BD561A] to-[#720303] text-[#f6e5dd] font-serif text-xs md:text-sm tracking-widest uppercase hover:brightness-110 shadow-lg hover:shadow-[#BD561A]/30 transition-all duration-300 flex items-center justify-center gap-2 border border-[#E6C587]/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('notFound.backHome', 'Return Home')}</span>
          </Link>

          <Link
            to="/flavours"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#E6C587]/40 text-[#E6C587] font-serif text-xs md:text-sm tracking-widest uppercase hover:bg-[#E6C587]/10 hover:border-[#E6C587] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>{t('notFound.exploreFlavours', 'Explore Flavours')}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>

        {/* Helpful quick links */}
        <motion.div {...fadeUp(0.6)} className="pt-6 border-t border-[#E6C587]/10 w-full">
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#f6e5dd]/40 mb-3">
            {t('footer.explore', 'Explore')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs text-[#E6C587]/80">
            <Link to="/b2b" className="hover:text-[#E6C587] hover:underline underline-offset-4 transition-colors">
              {t('nav.b2bBusiness', 'B2B BUSINESS')}
            </Link>
            <span className="text-[#f6e5dd]/20 select-none">•</span>
            <Link to="/gallery" className="hover:text-[#E6C587] hover:underline underline-offset-4 transition-colors">
              {t('nav.gallery', 'GALLERY')}
            </Link>
            <span className="text-[#f6e5dd]/20 select-none">•</span>
            <Link to="/events" className="hover:text-[#E6C587] hover:underline underline-offset-4 transition-colors">
              {t('nav.whatsNew', "WHAT'S NEW")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

