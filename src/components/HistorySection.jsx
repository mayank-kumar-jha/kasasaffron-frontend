import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

/* ── SVG Icons ── */
const LeafIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 28C16 28 6 22 6 12C6 7 10 4 16 4C22 4 26 7 26 12C26 22 16 28 16 28Z" />
    <path d="M16 4 L16 28" />
    <path d="M16 14 C14 11 10 10 8 11" />
    <path d="M16 18 C18 15 22 14 24 15" />
  </svg>
);

const ChefHatIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="20" width="16" height="5" rx="1" />
    <path d="M10 20C10 20 10 16 7 13C5 11 5 7 9 6C11 5 13 6 14 8C14.5 5 16 4 18 5C21 6 22 9 20 12C19 14 22 16 22 20" />
    <line x1="11" y1="20" x2="11" y2="25" />
    <line x1="16" y1="20" x2="16" y2="25" />
    <line x1="21" y1="20" x2="21" y2="25" />
  </svg>
);

const RibbonIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="12" r="7" />
    <path d="M12 18 L9 28 L16 24 L23 28 L20 18" />
  </svg>
);

const HeartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 27C16 27 4 20 4 12C4 8 7 5 11 5C13.5 5 15.5 6.5 16 8C16.5 6.5 18.5 5 21 5C25 5 28 8 28 12C28 20 16 27 16 27Z" />
    <path d="M12 12 C12 10 14 9 16 11" />
  </svg>
);

const CroqueIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="14" cy="16" rx="8" ry="5" />
    <path d="M6 16 Q6 10 14 10 Q22 10 22 16" />
    <path d="M9 13 Q12 8 14 8 Q16 8 19 13" />
    <path d="M8 16 Q7 20 9 22 Q14 25 19 22 Q21 20 20 16" />
  </svg>
);

const ClocheIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#B8893A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18 Q5 9 14 9 Q23 9 23 18" />
    <line x1="4" y1="18" x2="24" y2="18" />
    <line x1="4" y1="21" x2="24" y2="21" />
    <line x1="14" y1="9" x2="14" y2="6" />
    <circle cx="14" cy="5.5" r="1.5" />
  </svg>
);

const StampBadge = () => (
  <div className="who-stamp-badge">
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      <defs>
        <path id="topArc" d="M 12,40 a 28,28 0 0,1 56,0" />
        <path id="botArc" d="M 68,40 a 28,28 0 0,1 -56,0" />
      </defs>
      <circle cx="40" cy="40" r="31" fill="none" stroke="#B8893A" strokeWidth="0.8" strokeDasharray="2 3" />
      <text fill="#B8893A" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="7" letterSpacing="2.5">
        <textPath href="#topArc" startOffset="8%">ARTISANAL KITCHEN •</textPath>
      </text>
      <text fill="#B8893A" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="7" letterSpacing="2.5">
        <textPath href="#botArc" startOffset="8%">PREMIUM QUALITY •</textPath>
      </text>
      <text x="40" y="47" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontWeight="700" fontSize="28" fill="#4A0E1A">K</text>
    </svg>
  </div>
);

const HistorySection = memo(({ backRef, backContentCallback, isMobileView }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { aboutData } = useAdmin();

  const statsItems = [
    { icon: <LeafIcon />, label: 'SELECTED\nINGREDIENTS' },
    { icon: <ChefHatIcon />, label: 'ARTISANAL\nMETHOD' },
    { icon: <RibbonIcon />, label: 'PREMIUM\nQUALITY' },
    { icon: <HeartIcon />, label: 'PASSION FOR\nDETAIL' },
  ];

  return (
    <section
      ref={isMobileView ? null : backRef}
      className={isMobileView ? "relative w-full pb-20 pt-16 z-10 mt-16 scene-back-mobile" : "scene-back"}
      style={isMobileView ? {} : { visibility: 'hidden' }}
      aria-hidden={isMobileView ? undefined : "true"}
    >
      <div
        className={isMobileView ? "w-full flex flex-col" : "back-content-scroller"}
        ref={isMobileView ? null : backContentCallback}
        style={isMobileView ? {} : { width: '100%', display: 'flex', flexDirection: 'column', willChange: 'transform' }}
      >

        {/* ── DECORATIVE SIDE LINES WITH VERTICAL MARQUEE ── */}
        <div className="who-side-line who-line-left" aria-hidden="true">
          <div className="who-side-marquee-container">
            <div className="who-side-marquee-track">
              <span>SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;COCINA ARTESANAL&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;GOURMET CROQUETTES&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              <span>SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;COCINA ARTESANAL&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;GOURMET CROQUETTES&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            </div>
          </div>
        </div>
        <div className="who-side-line who-line-right" aria-hidden="true">
          <div className="who-side-marquee-container">
            <div className="who-side-marquee-track">
              <span>SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;COCINA ARTESANAL&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;GOURMET CROQUETTES&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              <span>SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;CROQUETTES amb amor&nbsp;&nbsp;·&nbsp;&nbsp;COCINA ARTESANAL&nbsp;&nbsp;·&nbsp;&nbsp;KASA SAFFRON&nbsp;&nbsp;·&nbsp;&nbsp;GOURMET CROQUETTES&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            </div>
          </div>
        </div>

        {/* ── SECTION CONTENT ── */}
        <div className="who-section-wrap">

          {/* Watermark botanical leaf */}
          <div className="who-watermark" aria-hidden="true">
            <svg viewBox="0 0 300 400" width="100%" height="100%" fill="none" opacity="1">
              <path d="M150 380 C150 380 60 300 60 180 C60 100 100 60 150 60 C200 60 240 100 240 180 C240 300 150 380 150 380Z"
                fill="#E8D5C0" />
              <path d="M150 60 L150 380" stroke="#D4BFA0" strokeWidth="1.5" />
              <path d="M150 160 C130 140 100 138 85 145" stroke="#D4BFA0" strokeWidth="1.2" fill="none" />
              <path d="M150 200 C170 180 200 178 215 185" stroke="#D4BFA0" strokeWidth="1.2" fill="none" />
              <path d="M150 240 C132 222 108 220 95 227" stroke="#D4BFA0" strokeWidth="1.2" fill="none" />
              <path d="M150 280 C166 262 188 260 200 267" stroke="#D4BFA0" strokeWidth="1.2" fill="none" />
            </svg>
          </div>

          {/* Centered heading block */}
          <div className="who-heading-block">
            <h1 className="who-main-title">{t('history.title')}</h1>
            <div className="who-divider">
              <span className="who-divider-line" />
              <span className="who-divider-diamond">◇</span>
              <span className="who-divider-line" />
            </div>
            <h2 className="who-script-subtitle">{t('history.subtitle')}</h2>
          </div>

          {/* Two-column layout */}
          <div className="who-two-col">

            {/* ── LEFT: Arch image ── */}
            <div className="who-image-col">
              <div className="who-arch-frame-outer">
                <div className="who-arch-frame-inner">
                  <img
                    src={(typeof aboutData?.chefImage === 'object' ? aboutData?.chefImage?.en : aboutData?.chefImage) || "/Images/history_chef.jpg"}
                    alt="Kasa Saffron artisanal kitchen"
                    loading="lazy"
                    className="who-arch-img"
                    onError={e => {
                      e.target.src = '/assets/b2b-hero/hero2.jpg';
                    }}
                  />
                </div>
              </div>
              <StampBadge />
            </div>

            {/* ── RIGHT: Text + Cards ── */}
            <div className="who-text-col">
              <p className="who-intro-text">{aboutData?.intro1?.[lang] || t('history.intro1') || aboutData?.intro1?.en}</p>

              {/* Card 1 */}
              <div className="who-card">
                <div className="who-card-icon-wrap">
                  <CroqueIcon />
                </div>
                <div className="who-card-body">
                  <h3 className="who-card-title">{aboutData?.feat1Title?.[lang] || t('history.feat1Title') || aboutData?.feat1Title?.en}</h3>
                  <p className="who-card-desc">{aboutData?.feat1Desc?.[lang] || t('history.feat1Desc') || aboutData?.feat1Desc?.en}</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="who-card">
                <div className="who-card-icon-wrap">
                  <ClocheIcon />
                </div>
                <div className="who-card-body">
                  <h3 className="who-card-title">{aboutData?.feat2Title?.[lang] || t('history.feat2Title') || aboutData?.feat2Title?.en}</h3>
                  <p className="who-card-desc">{aboutData?.feat2Desc?.[lang] || t('history.feat2Desc') || aboutData?.feat2Desc?.en}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM STATS BAR ── */}
          <div className="who-stats-bar">
            {statsItems.map((item, i) => (
              <div key={i} className="who-stat-item">
                <div className="who-stat-icon">{item.icon}</div>
                <span className="who-stat-label">{item.label}</span>
              </div>
            ))}
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="who-action-buttons">
            <Link to="/flavours" className="who-btn who-btn-primary">
              <span className="who-btn-text">Our Flavours</span>
              <span className="who-btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
              <div className="who-btn-glow"></div>
            </Link>
            <Link to="/b2b" className="who-btn who-btn-secondary">
              <span className="who-btn-text">Become Our Partner</span>
              <span className="who-btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
              <div className="who-btn-glow"></div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
});

HistorySection.displayName = 'HistorySection';
export default HistorySection;
