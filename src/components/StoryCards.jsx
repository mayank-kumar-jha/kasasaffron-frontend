import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '../context/AdminContext';

/* Initial style — hidden, no transition (JS RAF handles everything) */
const HALF_INIT = {
    opacity: 0,
    visibility: 'hidden',
    transition: 'none',
};

const StoryCards = memo(({ card1PhotoRef, card1InfoRef, card2PhotoRef, card2InfoRef }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language || 'en';
    const { aboutData } = useAdmin();

    const founderImg = (typeof aboutData?.founderImage === 'string'
        && aboutData.founderImage.trim() !== ''
        && aboutData.founderImage !== 'null')
        ? aboutData.founderImage
        : '/Images/founder_pngggg.png';

    const lovieshImg = (typeof aboutData?.lovieshImage === 'string'
        && aboutData.lovieshImage.trim() !== ''
        && aboutData.lovieshImage !== 'null')
        ? aboutData.lovieshImage
        : '/Images/gordanramsi png.png';

    return (
        <>
            {/* ═══════════════════════════════════════
                CARD 1 — PHOTO HALF (slides from LEFT)
                Kitchen BG + Chetna PNG
            ═══════════════════════════════════════ */}
            <div ref={card1PhotoRef} className="sc-photo-half" style={HALF_INIT}>
                {/* Kitchen background image 1 */}
                <div className="sc-bg-layer">
                    <img
                        src="/Images/about_bg_1.jpg"
                        alt=""
                        aria-hidden="true"
                        className="sc-bg-img"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="sc-bg-gradient" />
                </div>



                {/* Person PNG floating at bottom */}
                <div className="sc-png-layer">
                    <img
                        src={founderImg}
                        alt="Chetna Bali - Founder & Chef"
                        className="sc-person-png"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════
                CARD 1 — INFO HALF (slides from RIGHT)
                Name · Role · Bio · Signature
            ═══════════════════════════════════════ */}
            <div ref={card1InfoRef} className="sc-info-half" style={HALF_INIT}>
                <div className="sc-info-inner">
                    <div className="sc-info-left">

                        <div className="sc-info-divider" />
                        <div className="sc-info-role">
                            {aboutData?.chetnaRole?.[lang] || t('stories.chetnaRole') || aboutData?.chetnaRole?.en || 'Chef / Director / Founder'}
                        </div>
                        <p className="sc-info-bio">
                            {aboutData?.chetnaP1?.[lang] || t('stories.chetnaP1') || aboutData?.chetnaP1?.en}
                        </p>
                        <p className="sc-info-bio">
                            {aboutData?.chetnaP2?.[lang] || t('stories.chetnaP2') || aboutData?.chetnaP2?.en}
                        </p>
                        <p className="sc-info-bio">
                            {aboutData?.chetnaP3?.[lang] || t('stories.chetnaP3') || aboutData?.chetnaP3?.en}
                        </p>
                    </div>
                    <div className="sc-info-right">
                        <div className="sc-signature-name">Chetna Bali</div>
                        <div className="sc-info-divider sc-info-divider--center" />
                        <div className="sc-signature-label">FOUNDER</div>
                        <div className="sc-signature-brand">KASA SAFFRON</div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════
                CARD 2 — PHOTO HALF (slides from RIGHT)
                Kitchen BG + Loviesh PNG
            ═══════════════════════════════════════ */}
            <div ref={card2PhotoRef} className="sc-photo-half" style={HALF_INIT}>
                <div className="sc-bg-layer">
                    <img
                        src="/Images/about_bg_2.jpg"
                        alt=""
                        aria-hidden="true"
                        className="sc-bg-img"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="sc-bg-gradient" />
                </div>



                <div className="sc-png-layer">
                    <img
                        src={lovieshImg}
                        alt="Loviesh Bali - Executive Chef"
                        className="sc-person-png"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════
                CARD 2 — INFO HALF (slides from LEFT)
                Name · Role · Bio · Signature
            ═══════════════════════════════════════ */}
            <div ref={card2InfoRef} className="sc-info-half" style={HALF_INIT}>
                <div className="sc-info-inner">
                    <div className="sc-info-left">

                        <div className="sc-info-divider" />
                        <div className="sc-info-role">
                            {aboutData?.lovieshRole?.[lang] || t('stories.lovieshRole') || aboutData?.lovieshRole?.en || 'Executive Chef'}
                        </div>
                        <p className="sc-info-bio">
                            {aboutData?.lovieshP1?.[lang] || t('stories.lovieshP1') || aboutData?.lovieshP1?.en}
                        </p>
                        <p className="sc-info-bio">
                            {aboutData?.lovieshP2?.[lang] || t('stories.lovieshP2') || aboutData?.lovieshP2?.en}
                        </p>
                    </div>
                    <div className="sc-info-right">
                        <div className="sc-signature-name">Loviesh Bali</div>
                        <div className="sc-info-divider sc-info-divider--center" />
                        <div className="sc-signature-label">EXECUTIVE CHEF</div>
                        <div className="sc-signature-brand">KASA SAFFRON</div>
                    </div>
                </div>
            </div>
        </>
    );
});

StoryCards.displayName = 'StoryCards';
export default StoryCards;
