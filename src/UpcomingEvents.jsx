import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from './context/AdminContext';
import { useTranslation } from 'react-i18next';

/* ── Category Tag Color Map ── */
const CATEGORY_COLORS = {
  'new flavour':   { bg: 'rgba(189, 86, 26, 0.15)', border: 'rgba(189, 86, 26, 0.35)', text: '#E8A054' },
  'kitchen':       { bg: 'rgba(230, 197, 135, 0.12)', border: 'rgba(230, 197, 135, 0.3)', text: '#E6C587' },
  'expansion':     { bg: 'rgba(100, 200, 150, 0.12)', border: 'rgba(100, 200, 150, 0.25)', text: '#7ED4A0' },
  'partnership':   { bg: 'rgba(130, 160, 230, 0.12)', border: 'rgba(130, 160, 230, 0.25)', text: '#95B3E8' },
  'milestone':     { bg: 'rgba(200, 130, 200, 0.12)', border: 'rgba(200, 130, 200, 0.25)', text: '#D49FD4' },
};

function getCategoryStyle(category) {
  if (!category) return { bg: 'rgba(230, 197, 135, 0.08)', border: 'rgba(230, 197, 135, 0.2)', text: '#E6C587' };
  const key = category.toLowerCase().trim();
  for (const [k, v] of Object.entries(CATEGORY_COLORS)) {
    if (key.includes(k)) return v;
  }
  return { bg: 'rgba(230, 197, 135, 0.08)', border: 'rgba(230, 197, 135, 0.2)', text: '#E6C587' };
}

/* ── Date Formatter ── */
function formatDate(dateStr) {
  if (!dateStr) return { day: '', month: '', year: '' };
  try {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
      year: d.getFullYear(),
    };
  } catch {
    return { day: '', month: '', year: '' };
  }
}

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/* ── Timeline Dot ── */
const TimelineDot = ({ isFirst }) => (
  <div className="relative flex flex-col items-center">
    <div className={`w-3 h-3 rounded-full border-2 border-[#E6C587] ${isFirst ? 'bg-[#E6C587]' : 'bg-[#140003]'} shadow-[0_0_8px_rgba(230,197,135,0.3)] z-10`} />
  </div>
);

export default function UpcomingEvents() {
  const { events } = useAdmin();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [expandedId, setExpandedId] = useState(null);

  const getTitle = (event) => {
    if (typeof event.title === 'object') return event.title[lang] || event.title.en || '';
    return event.title || '';
  };

  const getDescription = (event) => {
    if (typeof event.description === 'object') return event.description[lang] || event.description.en || '';
    return event.description || '';
  };

  return (
    <div className="min-h-screen bg-[#140003] text-white pt-28 md:pt-36 pb-20 font-sans selection:bg-[#E6C587]/30 selection:text-[#E6C587]">
      {/* Premium background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#E6C587]/[0.03] blur-[150px] rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#4A0E1A]/20 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/3"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(rgba(230,197,135,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(230,197,135,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">

        {/* ═══ Header ═══ */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block px-5 py-1.5 rounded-full border border-[#E6C587]/25 bg-[#E6C587]/[0.04] text-[#E6C587] text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase mb-6 backdrop-blur-md">
            {t('events.badge')}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-5 tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
            {t('events.title1')}<span className="text-[#E6C587] italic font-light">{t('events.title2')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/50 font-light leading-relaxed">
            {t('events.subtitle')}
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#E6C587]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#E6C587]/40" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#E6C587]/30" />
          </div>
        </div>

        {/* ═══ Timeline ═══ */}
        {events.length > 0 ? (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#E6C587]/30 via-[#E6C587]/15 to-transparent hidden md:block" />

            <div className="space-y-8 md:space-y-12">
              {events.map((event, index) => {
                const { day, month, year } = formatDate(event.date);
                const category = event.time; // Repurposed field
                const catStyle = getCategoryStyle(category);
                const title = getTitle(event);
                const description = getDescription(event);
                const isExpanded = expandedId === event.id;
                const shouldTruncate = description.length > 200;

                return (
                  <div key={event.id} className="relative flex gap-0 md:gap-8 group">

                    {/* Timeline marker (desktop) */}
                    <div className="hidden md:flex flex-col items-center pt-6 flex-shrink-0 w-16">
                      <TimelineDot isFirst={index === 0} />
                      {/* Date badge */}
                      {day && (
                        <div className="mt-3 text-center">
                          <div className="text-[#E6C587] text-lg font-bold leading-none" style={{ fontFamily: "'Cinzel', serif" }}>{day}</div>
                          <div className="text-[#E6C587]/50 text-[9px] font-bold tracking-widest mt-0.5">{month}</div>
                          <div className="text-white/20 text-[9px] mt-0.5">{year}</div>
                        </div>
                      )}
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-[#1c0005] border border-[#E6C587]/[0.08] rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#E6C587]/20 hover:bg-[#1a0508]/80 hover:shadow-[0_8px_40px_-12px_rgba(230,197,135,0.08)]">

                      {/* Image + Overlay */}
                      {event.image && (
                        <div className="relative w-full h-48 md:h-56 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#140003] via-[#140003]/40 to-transparent z-10" />
                          <img
                            src={event.image}
                            alt={title}
                            className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                          {/* Category tag over image */}
                          {category && (
                            <div
                              className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border bg-[#140003]"
                              style={{ borderColor: catStyle.border, color: catStyle.text }}
                            >
                              {category}
                            </div>
                          )}
                          {/* Date badge on mobile (inside image) */}
                          {day && (
                            <div className="md:hidden absolute top-4 right-4 z-20 bg-[#140003] border border-[#E6C587]/20 px-3 py-1.5 rounded-lg text-center">
                              <div className="text-[#E6C587] text-sm font-bold leading-none" style={{ fontFamily: "'Cinzel', serif" }}>{month} {day}</div>
                              <div className="text-white/30 text-[9px] mt-0.5">{year}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* No image — show category tag inline */}
                      {!event.image && category && (
                        <div className="px-6 md:px-8 pt-6">
                          <span
                            className="inline-block px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border"
                            style={{ background: catStyle.bg, borderColor: catStyle.border, color: catStyle.text }}
                          >
                            {category}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="px-6 md:px-8 py-5 md:py-6">
                        {/* Mobile date (no image case) */}
                        {!event.image && day && (
                          <div className="md:hidden text-[#E6C587]/40 text-xs mb-2 font-medium">
                            {formatFullDate(event.date)}
                          </div>
                        )}

                        <h2 className="text-xl md:text-2xl font-serif text-white mb-3 leading-snug group-hover:text-[#E6C587]/90 transition-colors duration-300" style={{ fontFamily: "'Cinzel', serif" }}>
                          {title || 'Untitled'}
                        </h2>

                        {/* Location context */}
                        {event.location && (
                          <div className="flex items-center gap-2 text-white/30 text-xs mb-3">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        )}

                        {/* Description */}
                        {description && (
                          <div className="relative">
                            <p className="text-white/55 text-sm leading-relaxed font-light">
                              {shouldTruncate && !isExpanded
                                ? description.slice(0, 200) + '...'
                                : description
                              }
                            </p>
                            {shouldTruncate && (
                              <button 
                                onClick={() => setExpandedId(isExpanded ? null : event.id)}
                                className="mt-3 text-[#E6C587] text-xs font-bold uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1.5"
                              >
                                {isExpanded ? t('events.readLess') : t('events.readMore')}
                                <svg className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}

                        {/* Desktop date at bottom */}
                        <div className="hidden md:flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                          <svg className="w-3.5 h-3.5 text-[#E6C587]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          <span className="text-white/25 text-xs font-light">{formatFullDate(event.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ═══ Empty State ═══ */
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-[#E6C587]/[0.06] border border-[#E6C587]/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-[#E6C587]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <p className="text-white/30 text-lg mb-3 font-light">No announcements yet.</p>
            <p className="text-white/15 text-sm">Stay tuned for exciting news from Kasa Saffron!</p>
          </div>
        )}

        {/* ═══ Bottom CTA ═══ */}
        <div className="mt-20 md:mt-28 text-center pb-12 border-b border-[#E6C587]/[0.06]">
          <p className="text-white/40 mb-6 text-base font-light">Curious about our creations?</p>
          <Link to="/flavours" className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[#E6C587]/30 text-[#E6C587] rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#E6C587]/[0.06] hover:border-[#E6C587]/50 transition-all duration-300">
            <span>Explore Our Flavours</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
