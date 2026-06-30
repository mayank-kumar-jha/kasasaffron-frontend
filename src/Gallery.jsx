import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from './context/AdminContext';
import SkeletonPage from './components/SkeletonPage';
import SEO from './components/SEO';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeout', delay },
});

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { galleryImages, isDataLoading } = useAdmin();

  if (isDataLoading) return <SkeletonPage />;

  const getGalleryData = () => {
    if (!galleryImages || galleryImages.length === 0) return [];
    return galleryImages.map(img => ({
      name: img.name?.[lang] || img.name?.en || img.name,
      tagline: img.tagline?.[lang] || img.tagline?.en || img.tagline,
      image: img.image
    }));
  };

  const images = getGalleryData();

  return (
    <section className="relative w-full py-16 md:py-20 pt-[120px] overflow-hidden min-h-screen flex flex-col justify-center" style={{ backgroundImage: 'url(/assets/gallery_bg_new.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <SEO title="Gallery" description="See the beautiful creations at Kasa Saffron." />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E6C587]/30 to-transparent" />

      <motion.div {...fadeUp(0)} className="relative flex flex-col items-center text-center px-6 mb-10 z-10 mt-10">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-white uppercase font-sans">
          {t('galleryPage.badge')}
        </span>
        <h2 className="text-xl md:text-3xl lg:text-4xl font-normal leading-tight font-serif uppercase tracking-wide text-[#f6e5dd] mt-3 mb-3 drop-shadow-sm" style={{ fontFamily: "'Cinzel', serif" }}>
          {t('galleryPage.title')}
        </h2>
        <div className="w-24 h-[1px] bg-[#E6C587] my-2 opacity-50"></div>
      </motion.div>

      <div className="relative w-full max-w-6xl mx-auto px-4 h-[500px] md:h-[600px] overflow-hidden">
        {/* Gradient overlays to replace the mask-image which breaks on mobile */}
        <div className="absolute top-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-b from-[#140003]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-[#140003]/80 to-transparent z-20 pointer-events-none" />
        
        <div className="flex gap-3 md:gap-4 h-full relative z-10">
          {/* Column 1 */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-scroll-up flex flex-col gap-3 md:gap-4">
              {[...images, ...images].map((f, i) => (
                <div key={`col1-${i}`} className="rounded-xl overflow-hidden relative group" style={{ height: i % 3 === 0 ? '200px' : i % 3 === 1 ? '260px' : '180px' }}>
                  <img src={f.image} alt={f.name} loading="eager" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs font-bold text-white font-serif">{f.name}</p>
                    <p className="text-[9px] text-white/80 font-sans">{f.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-scroll-down flex flex-col gap-3 md:gap-4">
              {[...images.slice(3), ...images, ...images.slice(0, 3)].map((f, i) => (
                <div key={`col2-${i}`} className="rounded-xl overflow-hidden relative group" style={{ height: i % 3 === 0 ? '240px' : i % 3 === 1 ? '180px' : '220px' }}>
                  <img src={f.image} alt={f.name} loading="eager" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs font-bold text-white font-serif">{f.name}</p>
                    <p className="text-[9px] text-white/80 font-sans">{f.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex-1 overflow-hidden relative hidden sm:block">
            <div className="animate-scroll-up-slow flex flex-col gap-3 md:gap-4">
              {[...images.slice(5), ...images, ...images.slice(0, 5)].map((f, i) => (
                <div key={`col3-${i}`} className="rounded-xl overflow-hidden relative group" style={{ height: i % 3 === 0 ? '180px' : i % 3 === 1 ? '240px' : '200px' }}>
                  <img src={f.image} alt={f.name} loading="eager" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs font-bold text-white font-serif">{f.name}</p>
                    <p className="text-[9px] text-white/80 font-sans">{f.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex-1 overflow-hidden relative hidden lg:block">
            <div className="animate-scroll-down-slow flex flex-col gap-3 md:gap-4">
              {[...images.slice(1), ...images, ...images.slice(0, 1)].map((f, i) => (
                <div key={`col4-${i}`} className="rounded-xl overflow-hidden relative group" style={{ height: i % 3 === 0 ? '220px' : i % 3 === 1 ? '190px' : '250px' }}>
                  <img src={f.image} alt={f.name} loading="eager" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs font-bold text-white font-serif">{f.name}</p>
                    <p className="text-[9px] text-white/80 font-sans">{f.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
