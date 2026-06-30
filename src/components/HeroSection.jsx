import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Each image group gets a positioned wrapper so opacity/transform can be applied to the group.
// The wrapper is position:absolute;inset:0 — same bounding box as .hero-section.
// Children still position relative to this wrapper, matching original layout.
const HeroSection = memo(({ leftGroupRef, rightGroupRef, topGroupRef, textRef, featuresRef, plateRef }) => {
    const { t } = useTranslation();
    const groupStyle = {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
    };

    return (
        <>
            {/* Top images group */}
            <div ref={topGroupRef} style={groupStyle}>
                <img src="/Images/Logo Banner.png" alt="Kasa Saffron Logo" className="abs-img logo-banner" fetchPriority="high" decoding="sync" />
            </div>

            {/* Left images group */}
            <div ref={leftGroupRef} style={groupStyle}>
                <img src="/Images/LeftSide_Flower.png" alt="" aria-hidden="true" className="abs-img left-flower" />
                <img src="/Images/LeftSide_Cloth.png" alt="" aria-hidden="true" className="abs-img left-cloth" />
            </div>

            {/* Right images group */}
            <div ref={rightGroupRef} style={groupStyle}>
                <img src="/Images/RightSide_Flower.png" alt="" aria-hidden="true" className="abs-img right-flower" />
                <img src="/Images/RightSide_SaffronCup.png" alt="Saffron Cup" className="abs-img right-cup" />
                <img src="/Images/RightSide_FlowerPetalsTop.png" alt="" aria-hidden="true" className="abs-img right-petals-top" />
                <img src="/Images/RightSide_Leaves.png" alt="" aria-hidden="true" className="abs-img right-leaves" />
                <img src="/Images/RightSide_Spoon.png" alt="Spoon with Saffron" className="abs-img right-spoon" />
            </div>

            {/* Hero text */}
            <main ref={textRef} className="hero-content" style={{ willChange: 'transform, opacity' }}>
                <div className="subtitle-container">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-saffron" aria-hidden="true">
                        <path d="M12 22C12 22 17 18 17 12C17 6 12 2 12 2C12 2 7 6 7 12C7 18 12 22 12 22Z" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 22V12" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 12L9 9" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 12L15 9" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="subtitle">
                        {t('hero.handcrafted')}<br />{t('hero.pureSaffron')}
                    </div>
                    <div className="line-decor" aria-hidden="true"></div>
                </div>

                <h1 className="main-title">{t('hero.croquetes')}</h1>
                <div className="script-title-wrapper">
                    <h2 className="script-title">{t('hero.ambAmor')}</h2>
                    <svg className="heart-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="#B08D57" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div className="tiny-heart" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#B08D57" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
                    </svg>
                </div>

                <p className="description">
                    {t('hero.descLine1')}<br />
                    {t('hero.descLine2')}<br />
                    {t('hero.descLine3')}
                </p>
            </main>

            {/* Features */}
            <section ref={featuresRef} className="features-section" aria-label="Key Features" style={{ willChange: 'transform, opacity' }}>
                <article className="feature-item">
                    <div className="feature-icon" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path>
                        </svg>
                    </div>
                    <div className="feature-text">
                        <strong>{t('hero.feat1Title')}</strong>
                        <p>{t('hero.feat1DescLine1')}<br />{t('hero.feat1DescLine2')}</p>
                    </div>
                </article>
                <div className="feature-divider" aria-hidden="true"></div>
                <article className="feature-item">
                    <div className="feature-icon" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <div className="feature-text">
                        <strong>{t('hero.feat2Title')}</strong>
                        <p>{t('hero.feat2DescLine1')}<br />{t('hero.feat2DescLine2')}</p>
                    </div>
                </article>
                <div className="feature-divider" aria-hidden="true"></div>
                <article className="feature-item">
                    <div className="feature-icon" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                            <path d="M2 22l7-7"></path>
                        </svg>
                    </div>
                    <div className="feature-text">
                        <strong>{t('hero.feat3Title')}</strong>
                        <p>{t('hero.feat3DescLine1')}<br />{t('hero.feat3DescLine2')}</p>
                    </div>
                </article>
                <div className="feature-divider" aria-hidden="true"></div>
                <article className="feature-item">
                    <div className="feature-icon" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B08D57" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>
                    <div className="feature-text">
                        <strong>{t('hero.feat4Title')}</strong>
                        <p>{t('hero.feat4DescLine1')}<br />{t('hero.feat4DescLine2')}</p>
                    </div>
                </article>
            </section>

            {/* Plate — translateX(-50%) is in CSS, we only add Y and rotation on top */}
            <img
                ref={plateRef}
                src="/Images/Croqetta with plate_.png"
                alt="Croquetas on Plate"
                className="abs-img croquetas-plate"
                fetchPriority="high"
                decoding="sync"
                style={{ willChange: 'transform' }}
            />
        </>
    );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
