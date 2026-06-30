import { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import MobileHome from './MobileHome';
import HeroSection from './components/HeroSection';
import SEO from './components/SEO';
import { useAdmin } from './context/AdminContext';
import SkeletonPage from './components/SkeletonPage';
import './App.css';
import './horeca.css';

const StoryCards = lazy(() => import('./components/StoryCards'));
const HistorySection = lazy(() => import('./components/HistorySection'));

const SkeletonLoader = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', opacity: 0.5 }}>
        <div style={{ width: '100%', height: '200px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }} />
        <div style={{ width: '80%', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
    </div>
);

const section2Elements = [
    { src: 'Images/LeftSide_Flower.png', top: '80%', left: '8%', scale: 1.0, rotate: 0, appearAt: 0.65, slideInDir: 'left', width: '350px' },
    { src: 'Images/RightSide_Flower.png', top: '35%', left: '92%', scale: 1.2, rotate: -10, appearAt: 0.55, slideInDir: 'right', width: '300px' },
];

export default function Home() {
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
    const { isDataLoading } = useAdmin();

    // ── Refs for static layout ──
    const backContentRef = useRef(null);
    const backContentHeightRef = useRef(0);

    // ── Refs for DOM nodes we animate directly (no re-renders) ──
    const card1PhotoRef = useRef(null);
    const card1InfoRef = useRef(null);
    const card2PhotoRef = useRef(null);
    const card2InfoRef = useRef(null);
    const sceneWrapperRef = useRef(null);
    const frontRef = useRef(null);
    const backRef = useRef(null);
    const bgImgRef = useRef(null);
    const s2El0Ref = useRef(null);
    const s2El1Ref = useRef(null);
    const heroRef = useRef(null);
    const scrollContainerRef = useRef(null);

    // Section 1 and 2 take 3.5 viewport heights each. Section 3 takes exactly its content height.

    // Track refs for hero child elements (set by HeroSection)
    const leftImgRef = useRef(null);
    const rightImgRef = useRef(null);
    const topImgRef = useRef(null);
    const textRef = useRef(null);
    const featuresRef = useRef(null);
    const plateRef = useRef(null);

    // Smooth scroll state
    const currentRatioRef = useRef(0);
    const targetRatioRef = useRef(0);
    const rafRef = useRef(null);
    const lerpFactor = 0.12; // Smoothing — higher = more snappy, lower = dreamier

    const backContentCallback = useCallback((node) => {
        backContentRef.current = node;
        if (node) {
            backContentHeightRef.current = node.scrollHeight;
            const ro = new ResizeObserver(() => {
                backContentHeightRef.current = node.scrollHeight;
                window.dispatchEvent(new Event('resize'));
            });
            ro.observe(node);
        }
    }, []);


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobile || isDataLoading) return; // Skip Locomotive on mobile or while loading

        const locomotiveScroll = new LocomotiveScroll();

        // We will sync scroll height dynamically inside the animate loop
        // to handle lazy loaded components automatically.

        // Raw scroll listener — just captures target, no setState
        const handleScroll = () => {
            targetRatioRef.current = Math.max(window.scrollY, 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Seed initial value
        handleScroll();

        // ── RAF animation loop — writes to DOM directly, bypasses React ──
        const animate = () => {
            // Lerp: smoothly approach the target scroll distance in pixels
            const prev = currentRatioRef.current;
            const target = targetRatioRef.current;
            const next = prev + (target - prev) * lerpFactor;
            currentRatioRef.current = Math.abs(next - target) < 0.1 ? target : next;

            const currentScrollY = currentRatioRef.current;

            // Robustly disable CSS animations once the user starts scrolling,
            // so the lerp smoothly takes over from 0 without jumping or getting stuck.
            if (currentScrollY > 0) {
                if (leftImgRef.current && leftImgRef.current.style.animation !== 'none') leftImgRef.current.style.animation = 'none';
                if (rightImgRef.current && rightImgRef.current.style.animation !== 'none') rightImgRef.current.style.animation = 'none';
                if (topImgRef.current && topImgRef.current.style.animation !== 'none') topImgRef.current.style.animation = 'none';
                if (textRef.current && textRef.current.style.animation !== 'none') textRef.current.style.animation = 'none';
                if (featuresRef.current && featuresRef.current.style.animation !== 'none') featuresRef.current.style.animation = 'none';
                if (plateRef.current && plateRef.current.style.animation !== 'none') plateRef.current.style.animation = 'none';
            }

            // ── Derived ratios using exact pixel scrolling ──
            const sec1Distance = 3.5 * window.innerHeight;
            const sec2Distance = 3.5 * window.innerHeight;

            const section1Ratio = Math.max(Math.min(currentScrollY / sec1Distance, 1.0), 0.0);
            const section2Ratio = Math.max(Math.min((currentScrollY - sec1Distance) / sec2Distance, 1.0), 0.0);

            const phase1Ratio = Math.min(section1Ratio / 0.4, 1);
            const phase2Ratio = Math.max((section1Ratio - 0.4) / 0.6, 0);

            // Hero child styles
            const fadeOpacity = Math.max(1 - phase1Ratio * 1.5, 0);
            const fadeVis = phase1Ratio >= 0.67 ? 'hidden' : '';

            if (leftImgRef.current) {
                leftImgRef.current.style.opacity = fadeOpacity;
                leftImgRef.current.style.visibility = fadeVis;
                leftImgRef.current.style.transform = `translateX(-${phase1Ratio * 150}px)`;
            }
            if (rightImgRef.current) {
                rightImgRef.current.style.opacity = fadeOpacity;
                rightImgRef.current.style.visibility = fadeVis;
                rightImgRef.current.style.transform = `translateX(${phase1Ratio * 150}px)`;
            }
            if (topImgRef.current) {
                topImgRef.current.style.opacity = fadeOpacity;
                topImgRef.current.style.visibility = fadeVis;
                topImgRef.current.style.transform = `translateY(-${phase1Ratio * 100}px)`;
            }
            if (textRef.current) {
                const textOp = Math.max(1 - phase1Ratio * 2, 0);
                textRef.current.style.opacity = textOp;
                textRef.current.style.visibility = phase1Ratio >= 0.5 ? 'hidden' : '';
                textRef.current.style.transform = `scale(${Math.max(1 - phase1Ratio * 0.5, 0.5)})`;
            }
            if (featuresRef.current) {
                const featOp = Math.max(1 - phase1Ratio * 3, 0);
                featuresRef.current.style.opacity = featOp;
                featuresRef.current.style.visibility = phase1Ratio >= 0.34 ? 'hidden' : '';
                featuresRef.current.style.transform = `translateX(calc(-50% + ${phase1Ratio * 2000}px))`;
            }
            if (plateRef.current) {
                const plateY = section1Ratio * -250;
                const plateRot = section1Ratio * 360 * 1.5;
                plateRef.current.style.transform = `translateX(-50%) translateY(${plateY}vh) rotate(${plateRot}deg)`;
            }

            // ── Story Cards: split-half animation ──
            // Each card has a PHOTO half and an INFO half.
            // Photo half slides from the OPPOSITE direction to the info half.
            const cardTimeline = currentScrollY / sec1Distance;
            const card1SlideInRatio = Math.max(Math.min((cardTimeline - 0.60) / 0.20, 1), 0);
            const cardTransitionRatio = Math.max(Math.min((cardTimeline - 0.95) / 0.20, 1), 0);

            // Shared opacity/visibility for card 1 elements
            const c1Op = cardTransitionRatio > 0
                ? Math.max(1 - cardTransitionRatio * 1.5, 0) // Fades out as they slide apart
                : Math.min(card1SlideInRatio * 3, 1); // Fades in quickly as they slide together
            const c1Vis = (cardTransitionRatio >= 0.99 || card1SlideInRatio === 0) ? 'hidden' : '';

            // Card 1 Photo → slides IN from RIGHT (+60vw → 0), exits LEFT (-120vw)
            const c1p_vw = ((1 - card1SlideInRatio) * 60 - cardTransitionRatio * 120).toFixed(3);
            if (card1PhotoRef.current) {
                card1PhotoRef.current.style.transform = `translate3d(calc(-50% + ${c1p_vw}vw), 0, 0)`;
                card1PhotoRef.current.style.opacity = c1Op;
                card1PhotoRef.current.style.visibility = c1Vis;
            }

            // Card 1 Info → slides IN from LEFT (-60vw → 0), exits RIGHT (+120vw)
            const c1i_vw = (-(1 - card1SlideInRatio) * 60 + cardTransitionRatio * 120).toFixed(3);
            if (card1InfoRef.current) {
                card1InfoRef.current.style.transform = `translate3d(calc(-50% + ${c1i_vw}vw), 0, 0)`;
                card1InfoRef.current.style.opacity = c1Op;
                card1InfoRef.current.style.visibility = c1Vis;
            }

            // Shared opacity/visibility for card 2 elements
            // Fades in as it enters the screen (ratio 0.2 -> 0.7)
            const c2Op = Math.max(0, Math.min((cardTransitionRatio - 0.2) * 2, 1));
            const c2Vis = cardTransitionRatio > 0 ? '' : 'hidden';

            // Card 2 Photo → slides IN from RIGHT (+120vw → 0)
            const c2p_vw = ((1 - cardTransitionRatio) * 120).toFixed(3);
            if (card2PhotoRef.current) {
                card2PhotoRef.current.style.transform = `translate3d(calc(-50% + ${c2p_vw}vw), 0, 0)`;
                card2PhotoRef.current.style.opacity = c2Op;
                card2PhotoRef.current.style.visibility = c2Vis;
            }

            // Card 2 Info → slides IN from LEFT (-120vw → 0)
            const c2i_vw = (-(1 - cardTransitionRatio) * 120).toFixed(3);
            if (card2InfoRef.current) {
                card2InfoRef.current.style.transform = `translate3d(calc(-50% + ${c2i_vw}vw), 0, 0)`;
                card2InfoRef.current.style.opacity = c2Op;
                card2InfoRef.current.style.visibility = c2Vis;
            }

            // Background image
            const newBgOpacity = Math.max(Math.min((section1Ratio - 0.65) / 0.15, 1), 0);
            if (bgImgRef.current) {
                bgImgRef.current.style.opacity = (newBgOpacity * 0.4).toFixed(3);
            }

            // Scene 3D wrapper
            const zoomOutRatio = Math.max(Math.min((section2Ratio - 0.30) / 0.12, 1), 0);
            const flipRatio = Math.max(Math.min((section2Ratio - 0.42) / 0.15, 1), 0);
            const zoomInRatio = Math.max(Math.min((section2Ratio - 0.57) / 0.15, 1), 0);

            const baseScale = 1.0;
            const shrinkScale = 0.7;
            const currentScale = baseScale - zoomOutRatio * (baseScale - shrinkScale) + zoomInRatio * (baseScale - shrinkScale);
            const currentRotateY = flipRatio * -180;

            if (sceneWrapperRef.current) {
                sceneWrapperRef.current.style.transform = `scale(${currentScale}) rotateY(${currentRotateY}deg)`;
            }
            if (frontRef.current) {
                const bsv = zoomOutRatio > 0;
                frontRef.current.style.boxShadow = bsv ? `0 20px 50px rgba(0,0,0,${zoomOutRatio * 0.75})` : 'none';
                frontRef.current.style.borderRadius = bsv ? `${zoomOutRatio * 32}px` : '0px';
                frontRef.current.style.visibility = flipRatio > 0.5 ? 'hidden' : 'visible';
                frontRef.current.setAttribute('aria-hidden', flipRatio > 0.5 ? 'true' : 'false');
            }
            if (backRef.current) {
                const bsbv = zoomOutRatio > 0;
                backRef.current.style.boxShadow = bsbv ? `0 20px 50px rgba(0,0,0,${(1 - zoomInRatio) * 0.75})` : 'none';
                backRef.current.style.borderRadius = bsbv ? `${(1 - zoomInRatio) * 32}px` : '0px';
                backRef.current.style.visibility = flipRatio > 0.5 ? 'visible' : 'hidden';
                backRef.current.setAttribute('aria-hidden', flipRatio > 0.5 ? 'false' : 'true');
            }

            // Back content scroll (1:1 speed to seamlessly match the footer's native scroll)
            const maxBackTranslate = Math.max(backContentHeightRef.current - window.innerHeight + 100, 0);
            const sec3Start = sec1Distance + (0.72 * sec2Distance); // Start exactly when 3D flip finishes
            const sec3ScrollDistance = maxBackTranslate;

            // Sync scroll container height dynamically
            const totalHeight = sec3Start + sec3ScrollDistance + window.innerHeight;
            if (scrollContainerRef.current && scrollContainerRef.current.style.height !== `${totalHeight}px`) {
                scrollContainerRef.current.style.height = `${totalHeight}px`;
            }

            const section3Ratio = sec3ScrollDistance > 0
                ? Math.max(Math.min((currentScrollY - sec3Start) / sec3ScrollDistance, 1.0), 0.0)
                : 0;
            const clampedSec3Scroll = section3Ratio * maxBackTranslate;

            if (backContentRef.current) {
                backContentRef.current.style.transform = `translateY(${-clampedSec3Scroll}px)`;
            }

            // Section 2 decorative elements
            section2Elements.forEach((el, i) => {
                const ref = i === 0 ? s2El0Ref : s2El1Ref;
                if (!ref.current) return;
                const progress = Math.max(Math.min((section1Ratio - el.appearAt) / 0.30, 1), 0);
                let tx = 0, ty = 0;
                const offset = 150;
                if (el.slideInDir === 'left') tx = (1 - progress) * -offset;
                if (el.slideInDir === 'right') tx = (1 - progress) * offset;
                ref.current.style.opacity = (progress * 0.7).toFixed(3);
                ref.current.style.visibility = progress === 0 ? 'hidden' : '';
                ref.current.style.transform = `translate(-50%, -50%) scale(${el.scale}) rotate(${el.rotate}deg) translate(${tx}px, ${ty}px)`;
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            locomotiveScroll.destroy();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isMobile, isDataLoading]);

    if (isDataLoading) return <SkeletonPage />;

    if (isMobile) return <MobileHome />;

    return (
        <div ref={scrollContainerRef} className="scroll-container">
            <SEO title="Home" />
            <img
                ref={bgImgRef}
                src="/Images/background_image.jpeg"
                style={{
                    position: 'fixed', top: 0, left: 0,
                    width: '100vw', height: '100vh', objectFit: 'cover',
                    opacity: 0, zIndex: 0, pointerEvents: 'none', transition: 'none',
                    display: isMobile ? 'none' : 'block'
                }}
                alt="Background"
                fetchPriority="high"
                decoding="sync"
            />

            <div className="scene-3d-container">
                <div ref={sceneWrapperRef} className="scene-3d-wrapper">

                    {/* FRONT OF THE CARD */}
                    <div ref={frontRef} className="scene-front">
                        <div className="hero-section">
                            <HeroSection
                                leftGroupRef={leftImgRef}
                                rightGroupRef={rightImgRef}
                                topGroupRef={topImgRef}
                                textRef={textRef}
                                featuresRef={featuresRef}
                                plateRef={plateRef}
                            />

                            {/* Section 2 background elements */}
                            {section2Elements.map((el, idx) => (
                                <img
                                    key={`s2-${idx}`}
                                    ref={idx === 0 ? s2El0Ref : s2El1Ref}
                                    src={el.src}
                                    style={{
                                        position: 'absolute',
                                        top: el.top, left: el.left, width: el.width,
                                        opacity: 0, visibility: 'hidden',
                                        transition: 'none', zIndex: 1, pointerEvents: 'none',
                                        filter: 'drop-shadow(5px 10px 15px rgba(45, 15, 10, 0.3))'
                                    }}
                                    alt=""
                                    aria-hidden="true"
                                />
                            ))}

                            <Suspense fallback={<SkeletonLoader />}>
                                <StoryCards
                                    card1PhotoRef={card1PhotoRef}
                                    card1InfoRef={card1InfoRef}
                                    card2PhotoRef={card2PhotoRef}
                                    card2InfoRef={card2InfoRef}
                                />
                            </Suspense>
                        </div>
                    </div>

                    {/* BACK OF THE CARD */}
                    <Suspense fallback={<SkeletonLoader />}>
                        <HistorySection
                            backRef={backRef}
                            backContentCallback={backContentCallback}
                        />
                    </Suspense>

                </div>
            </div>
        </div>
    );
}
