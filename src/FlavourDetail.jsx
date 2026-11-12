import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useCart } from './context/CartContext';
import {
  FLAVOURS,
  PREP_DATA,
  getFlavourBySlug,
  getFlavourSlug,
  getAllergenData,
  getIngredientsData,
  getAllergenKey,
  getAllergenSubtitle,
  ALLERGEN_SUBTITLES
} from './data/flavoursData';

// SVG Allergen Icons
const AllergenIcon = ({ type }) => {
  switch (type) {
    case 'gluten':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M12 2C8 5 6 8 6 12s2 7 6 10c4-3 6-6 6-10S16 5 12 2z"/>
          <path d="M12 2v20M9 7l3-2 3 2M9 12l3-2 3 2M9 17l3-2 3 2"/>
        </svg>
      );
    case 'milk':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M8 3h8l1 4H7L8 3z"/><path d="M7 7l-2 13h14L17 7"/>
          <circle cx="12" cy="14" r="2"/>
        </svg>
      );
    case 'fish':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M22 12C18 6 10 4 4 8l4 4-4 4c6 4 14 2 18-4z"/><circle cx="18" cy="10" r="1" fill="currentColor"/>
        </svg>
      );
    case 'crustaceans':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M12 8c-2 0-4 1.5-4 4s2 4 4 4 4-1.5 4-4-2-4-4-4z"/>
          <path d="M8 8L5 5M16 8l3-3M8 16l-3 3M16 16l3 3M12 8V4M12 20v-4M4 12H2M22 12h-2"/>
        </svg>
      );
    case 'sulphites':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      );
    case 'soy':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M12 3c-4.5 0-7 4-7 8 0 5 4 10 7 10s7-5 7-10c0-4-2.5-8-7-8z"/>
          <path d="M12 7v10"/>
        </svg>
      );
    case 'mustard':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <circle cx="12" cy="12" r="8"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
      );
    case 'celery':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M12 22V8M8 12c0-3 4-5 4-5s4 2 4 5M6 16c0-2 3-3.5 3-3.5M18 16c0-2-3-3.5-3-3.5"/>
        </svg>
      );
    case 'molluscs':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M12 3a9 9 0 00-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9zm0 4a5 5 0 015 5c0 2.76-2.24 5-5 5s-5-2.24-5-5a5 5 0 015-5z"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
        </svg>
      );
  }
};

export default function FlavourDetail() {
  const { slug, lang: routeLang } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState('1kg');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients' | 'prep' | 'pairing'

  // Lookup flavour by slug
  const result = useMemo(() => getFlavourBySlug(slug), [slug]);
  const flavour = result?.flavour;

  // Active language is driven directly by i18n
  const currentLang = (i18n.language || 'en').split('-')[0];
  const dbLang = currentLang === 'cat' ? 'ca' : (currentLang === 'ca' ? 'ca' : (currentLang === 'es' ? 'es' : 'en'));

  // On initial mount ONLY: if visitor arrived via a language-specific URL slug, sync i18n once
  const initialMountDone = useRef(false);
  useEffect(() => {
    if (!initialMountDone.current) {
      initialMountDone.current = true;
      if (result?.matchedLang && result.matchedLang !== i18n.language) {
        i18n.changeLanguage(result.matchedLang);
      }
    }
  }, [result]);

  // When i18n language changes, smoothly update the browser URL to the localized slug for SEO & sharing
  useEffect(() => {
    if (!flavour) return;
    const targetSlug = getFlavourSlug(flavour, currentLang);
    if (targetSlug && window.location.pathname !== `/flavours/${targetSlug}`) {
      window.history.replaceState(null, '', `/flavours/${targetSlug}`);
    }
  }, [currentLang, flavour]);

  // If flavour not found
  if (!flavour) {
    return (
      <div className="min-h-screen bg-[#140003] text-[#E6C587] flex flex-col items-center justify-center p-6 text-center pt-32">
        <h2 className="text-3xl font-serif mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
          {t('notFound.title', 'Flavour Not Found')}
        </h2>
        <p className="text-white/60 mb-8 max-w-md text-sm font-sans">
          {t('notFound.desc', 'The gourmet flavour you are looking for does not exist or has been updated.')}
        </p>
        <Link
          to="/flavours"
          className="px-8 py-3 rounded-full border border-[#E6C587] bg-[#E6C587] text-[#140003] font-bold text-xs uppercase tracking-widest hover:bg-transparent hover:text-[#E6C587] transition-all"
        >
          {t('nav.ourFlavours', 'View All Flavours')}
        </Link>
      </div>
    );
  }

  // Localized texts
  const flavourName = flavour.name[dbLang] || flavour.name.en || flavour.spanishName;
  const flavourTagline = flavour.tagline[dbLang] || flavour.tagline.en;
  const flavourDesc = flavour.description[dbLang] || flavour.description.en;
  const flavourLongDesc = flavour.longDescription[dbLang] || flavour.longDescription.en;
  const pairingText = flavour.pairing[dbLang] || flavour.pairing.en;

  const price = selectedSize === '500g' ? flavour.price500g : flavour.price1kg;
  const pieces = selectedSize === '500g' ? '15 pcs' : '30 pcs';

  // Allergens & Ingredients
  const ae = getAllergenData(flavour);
  const containsList = ae ? (ae.contains[dbLang] || ae.contains.en || []) : [];
  const tracesList = ae ? (ae.traces[dbLang] || ae.traces.en || []) : [];

  const ingData = getIngredientsData(flavour);
  const ingHtml = ingData ? (ingData.ingredients[dbLang] || ingData.ingredients.en || '') : '';

  const prepText = PREP_DATA.prep[dbLang] || PREP_DATA.prep.en;
  const consText = PREP_DATA.cons[dbLang] || PREP_DATA.cons.en;
  const qtyObj = PREP_DATA.qty[selectedSize] || PREP_DATA.qty['1kg'];
  const qtyText = qtyObj[dbLang] || qtyObj.en;

  // Other flavours for navigation
  const otherFlavours = FLAVOURS.filter(f => f.id !== flavour.id);

  // SEO strings
  const seoTitle = `${flavourName} | Handcrafted Gourmet Croquettes | Kasa Saffron`;
  const seoDesc = flavour.seo?.description?.[dbLang] || flavourDesc;
  const seoKeywords = flavour.seo?.keywords?.[dbLang] || `${flavourName}, croquettes, tapas, barcelona`;
  const canonicalUrl = `https://www.kasasaffron.com/flavours/${getFlavourSlug(flavour, dbLang)}`;
  const fullImageUrl = `https://www.kasasaffron.com${flavour.image}`;

  // Structured Data (JSON-LD)
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": flavourName,
    "image": [fullImageUrl],
    "description": flavourDesc,
    "sku": `KS-CROQ-${flavour.id}-${selectedSize}`,
    "brand": {
      "@type": "Brand",
      "name": "Kasa Saffron"
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "EUR",
      "price": price.toFixed(2),
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Kasa Saffron S.L."
      }
    },
    "category": "Food & Beverage > Prepared Meals > Tapas & Croquettes"
  };

  const handleAddToCart = () => {
    addToCart({
      id: flavour.id,
      name: flavourName,
      image: flavour.image,
      size: selectedSize,
      price,
      quantity: selectedQuantity
    });
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Hreflang alternates */}
        <link rel="alternate" hrefLang="en" href={`https://www.kasasaffron.com/flavours/${flavour.slugs.en}`} />
        <link rel="alternate" hrefLang="es" href={`https://www.kasasaffron.com/flavours/${flavour.slugs.es}`} />
        <link rel="alternate" hrefLang="ca" href={`https://www.kasasaffron.com/flavours/${flavour.slugs.ca}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://www.kasasaffron.com/flavours/${flavour.slugs.en}`} />

        {/* OpenGraph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content={fullImageUrl} />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="w-full h-full"
          style={{ background: 'linear-gradient(160deg, #140003 0%, #1e0008 35%, #0f0003 100%)' }}
        >
          <div
            className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #BD561A 0%, transparent 70%)', transform: 'translate(20%, -20%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-[70vw] h-[70vw] rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #4A0E1A 0%, transparent 70%)', transform: 'translate(-20%, 20%)' }}
          />
        </div>
      </div>

      <main className="relative z-10 w-full min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        
        {/* Breadcrumb Navigation for SEO & UX */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#E6C587]/60 tracking-wider uppercase font-medium">
          <Link to="/" className="hover:text-[#E6C587] transition-colors">{t('nav.home', 'Home')}</Link>
          <span className="opacity-40">/</span>
          <Link to="/flavours" className="hover:text-[#E6C587] transition-colors">{t('nav.ourFlavours', 'Our Flavours')}</Link>
          <span className="opacity-40">/</span>
          <span className="text-[#E6C587] font-semibold truncate max-w-[200px] sm:max-w-none">{flavourName}</span>
        </nav>

        {/* Main Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Showcase & Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col gap-5"
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#E6C587]/25 shadow-[0_16px_50px_rgba(0,0,0,0.7)] group bg-[#1a0004]">
              {/* Image */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/11] relative overflow-hidden">
                <img
                  src={flavour.image}
                  alt={flavourName}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                  fetchpriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140003] via-transparent to-black/20" />
              </div>

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#E6C587]/40 text-[#E6C587] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E6C587] animate-pulse"></span>
                  {t('flavoursPage.handcrafted', 'Handcrafted Gourmet')}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#BD561A]/80 backdrop-blur-md border border-[#BD561A] text-white text-[10px] font-bold tracking-widest uppercase shadow-lg">
                  Barcelona, ES
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/70 text-xs font-serif italic">
                  {flavour.spanishName}
                </span>
                <span className="text-[11px] text-[#E6C587]/90 font-mono font-bold tracking-wider">
                  Net Wt: 500g / 1kg
                </span>
              </div>
            </div>

            {/* Sommelier & Beverage Pairing Highlight */}
            {pairingText && (
              <div className="p-5 rounded-2xl bg-[#1e0207]/80 border border-[#E6C587]/20 backdrop-blur-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E6C587]/10 border border-[#E6C587]/30 flex items-center justify-center text-[#E6C587] shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 009-9V7a2 2 0 00-2-2h-3l-2-2h-4l-2 2H5a2 2 0 00-2 2v5a9 9 0 009 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#E6C587] uppercase tracking-wider mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                    {t('flavourDetail.sommelier', 'Sommelier Pairing & Culinary Harmony')}
                  </h3>
                  <p className="text-xs text-[#f6e5dd]/80 leading-relaxed font-sans">
                    {pairingText}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column: Details, Allergens, Size, Pricing & Ordering */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            {/* Title & Tagline */}
            <div className="border-b border-[#E6C587]/15 pb-6">
              <span className="text-[11px] tracking-[0.25em] text-[#BD561A] font-extrabold uppercase block mb-1.5">
                {flavourTagline}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E6C587] leading-tight mb-3 drop-shadow-md" style={{ fontFamily: "'Cinzel', serif" }}>
                {flavourName}
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans mb-3">
                {flavourDesc}
              </p>
              <p className="text-xs sm:text-sm text-[#f6e5dd]/60 leading-relaxed font-sans italic border-l-2 border-[#E6C587]/40 pl-3">
                {flavourLongDesc}
              </p>
            </div>

            {/* Size Selector with Exact Piece Counts */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#E6C587]/70 uppercase tracking-widest">
                  {t('flavourDetail.selectSize', 'Select Package Size')}
                </span>
                <span className="text-[11px] text-[#E6C587] font-semibold">
                  {selectedSize === '500g' ? '15 pieces (500 g)' : '30 pieces (1 kg)'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: '500g', label: '500g Pack', pcs: '15 units', price: flavour.price500g },
                  { key: '1kg', label: '1kg Pack', pcs: '30 units', price: flavour.price1kg }
                ].map(s => {
                  const isSelected = selectedSize === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSelectedSize(s.key)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden ${
                        isSelected
                          ? 'border-[#E6C587] bg-gradient-to-r from-[#2c0107] to-[#3a010a] shadow-[0_0_20px_rgba(230,197,135,0.2)]'
                          : 'border-[#E6C587]/20 bg-black/20 hover:border-[#E6C587]/40 text-white/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold uppercase tracking-wider ${isSelected ? 'text-[#E6C587]' : 'text-white'}`}>
                          {s.label}
                        </span>
                        <span className={`text-sm font-serif font-bold ${isSelected ? 'text-[#E6C587]' : 'text-white/80'}`}>
                          €{s.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50">{s.pcs} · Frozen Gastronomy</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Live Price Bar */}
            <div className="p-4 rounded-2xl bg-[#1e0207]/90 border border-[#E6C587]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#E6C587]/60 uppercase tracking-widest">
                  {t('flavourDetail.qty', 'Quantity')}:
                </span>
                <div className="flex items-center bg-[#140003] border border-[#E6C587]/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}
                    disabled={selectedQuantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-[#E6C587] text-lg font-light hover:bg-[#E6C587]/15 disabled:opacity-30 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 h-9 flex items-center justify-center text-white font-bold text-sm bg-black/30 border-x border-[#E6C587]/20">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() => setSelectedQuantity(q => Math.min(99, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-[#E6C587] text-lg font-light hover:bg-[#E6C587]/15 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block text-right">
                  {t('flavourDetail.subtotal', 'Total Price')}
                </span>
                <span className="text-2xl sm:text-3xl font-serif text-[#E6C587] font-semibold leading-none">
                  €{(price * selectedQuantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Instant Checkout */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#B8893A] via-[#E6C587] to-[#B8893A] text-[#140003] font-bold text-xs uppercase tracking-[0.2em] shadow-[0_8px_30px_rgba(230,197,135,0.3)] hover:shadow-[0_12px_40px_rgba(230,197,135,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{t('flavourDetail.addToCart', 'Add to Order')}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <Link
                to="/checkout"
                onClick={handleAddToCart}
                className="py-4 px-6 rounded-xl border border-[#E6C587]/50 bg-[#140003] text-[#E6C587] font-bold text-xs uppercase tracking-[0.18em] hover:bg-[#E6C587]/10 transition-colors flex items-center justify-center text-center"
              >
                {t('flavourDetail.checkoutNow', 'Order & Checkout')}
              </Link>
            </div>

            {/* Informational Tabs: Allergens / Ingredients / Preparation */}
            <div className="rounded-2xl border border-[#E6C587]/20 bg-[#160004]/80 overflow-hidden mt-2">
              <div className="flex border-b border-[#E6C587]/15">
                {[
                  { id: 'ingredients', label: t('flavourDetail.ingredientsTab', 'Ingredients & Allergens') },
                  { id: 'prep', label: t('flavourDetail.prepTab', 'Preparation & Storage') },
                  { id: 'allFlavours', label: t('flavourDetail.specsTab', 'Packaging Specs') },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-2 sm:px-4 text-[10.5px] font-bold uppercase tracking-wider transition-colors text-center ${
                      activeTab === tab.id
                        ? 'bg-[#E6C587]/15 text-[#E6C587] border-b-2 border-[#E6C587]'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === 'ingredients' && (
                  <div className="space-y-4">
                    {/* ASPB Allergen Badges */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <svg className="w-4 h-4 text-[#E6C587]" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 110 1.5A.75.75 0 018 4zm0 3.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V8a.75.75 0 01.75-.75z"/>
                        </svg>
                        <span className="text-[10px] font-extrabold tracking-widest text-[#E6C587] uppercase">
                          {t('flavourDetail.allergensTitle', 'Certified Allergen Breakdown (ASPB)')}
                        </span>
                      </div>

                      {/* Contains */}
                      {containsList.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[9px] font-bold text-[#E6C587]/60 uppercase tracking-widest block mb-1.5">
                            {t('flavourDetail.contains', 'Contains')}:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {containsList.map((item, i) => {
                              const key = getAllergenKey(item);
                              return (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E6C587]/30 bg-[#E6C587]/10">
                                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#E6C587]/20 text-[#E6C587] shrink-0">
                                    <AllergenIcon type={key} />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-bold text-[#E6C587]">{item}</p>
                                    <p className="text-[8px] text-[#E6C587]/60 font-medium">{getAllergenSubtitle(key, dbLang)}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Traces */}
                      {tracesList.length > 0 && (
                        <div className="pt-2 border-t border-[#E6C587]/10">
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">
                            {t('flavourDetail.mayContain', 'May contain traces of')}:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {tracesList.map((item, i) => (
                              <span key={i} className="text-[9px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Full Ingredients List */}
                    {ingHtml && (
                      <div className="pt-3 border-t border-[#E6C587]/10">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9.5px] font-bold text-[#E6C587] uppercase tracking-widest">
                            {t('flavourDetail.ingredientsLabel', 'Certified Ingredients List')}
                          </span>
                          <span className="text-[8px] text-[#E6C587]/60 italic">
                            * {t('flavourDetail.boldNotice', 'Allergens highlighted in bold')}
                          </span>
                        </div>
                        <p
                          className="text-xs text-[#f6e5dd]/80 leading-relaxed font-sans [&>strong]:text-[#E6C587] [&>strong]:font-bold"
                          dangerouslySetInnerHTML={{ __html: ingHtml }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'prep' && (
                  <div className="space-y-3.5 text-xs text-[#f6e5dd]/80 leading-relaxed font-sans">
                    <div>
                      <h4 className="text-[10px] font-bold text-[#E6C587] uppercase tracking-widest mb-1">
                        🍳 {t('flavourDetail.cookingInst', 'Frying Instructions')}
                      </h4>
                      <p>{prepText}</p>
                    </div>
                    <div className="pt-2 border-t border-[#E6C587]/10">
                      <h4 className="text-[10px] font-bold text-[#E6C587] uppercase tracking-widest mb-1">
                        ❄️ {t('flavourDetail.storageInst', 'Storage & Shelf Life')}
                      </h4>
                      <p>{consText}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'allFlavours' && (
                  <div className="space-y-3 text-xs text-[#f6e5dd]/80 font-sans">
                    <div className="flex justify-between py-1 border-b border-[#E6C587]/10">
                      <span className="text-white/50">{t('flavourDetail.netQty', 'Net Quantity')}:</span>
                      <span className="font-semibold text-[#E6C587]">{qtyText}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E6C587]/10">
                      <span className="text-white/50">Pieces per pack:</span>
                      <span className="font-semibold text-[#E6C587]">15 pcs (500g) / 30 pcs (1kg)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E6C587]/10">
                      <span className="text-white/50">Culinary Category:</span>
                      <span className="font-semibold text-[#E6C587]">Artisan Gourmet Croqueteria</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-white/50">Producer:</span>
                      <span className="font-semibold text-[#E6C587]">Kasa Saffron S.L., Barcelona</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </motion.div>

        </div>

        {/* ─── Explore Other Gourmet Flavours Section ─── */}
        <section className="mt-20 pt-12 border-t border-[#E6C587]/20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#BD561A] font-bold uppercase block mb-1">
                {t('flavourDetail.catalogue', 'Complete Collection')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#E6C587]" style={{ fontFamily: "'Cinzel', serif" }}>
                {t('flavourDetail.exploreMore', 'Explore Other Handcrafted Flavours')}
              </h2>
            </div>
            <Link
              to="/flavours"
              className="text-xs font-bold text-[#E6C587] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>{t('flavourDetail.viewAll', 'View All 8 Flavours')}</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {otherFlavours.map(other => {
              const otherName = other.name[dbLang] || other.name.en || other.spanishName;
              const otherTagline = other.tagline[dbLang] || other.tagline.en;
              const otherSlug = getFlavourSlug(other, dbLang);

              return (
                <Link
                  key={other.id}
                  to={`/flavours/${otherSlug}`}
                  className="group rounded-2xl bg-[#1a0004]/90 border border-[#E6C587]/20 overflow-hidden hover:border-[#E6C587]/60 hover:shadow-[0_8px_30px_rgba(230,197,135,0.2)] transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                    <img
                      src={other.image}
                      alt={otherName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0004] via-transparent to-transparent" />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[#E6C587] text-[9px] font-bold font-mono">
                      €{other.price1kg.toFixed(2)}/kg
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[8px] tracking-[0.2em] text-[#BD561A] uppercase font-bold mb-1">
                        {otherTagline}
                      </p>
                      <h3 className="text-base font-serif text-[#E6C587] leading-tight group-hover:text-white transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                        {otherName}
                      </h3>
                    </div>
                    <div className="pt-3 mt-3 border-t border-[#E6C587]/10 flex items-center justify-between text-[10px] text-[#E6C587]/70 font-semibold tracking-wider uppercase">
                      <span>{t('flavourDetail.viewRecipe', 'View Details')}</span>
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </main>
    </>
  );
}

