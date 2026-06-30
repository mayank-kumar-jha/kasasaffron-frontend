import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    // Phase 1: Logo + "Kasa Saffron" fully shown  (0 → 2.0s)
    const t1 = setTimeout(() => setPhase(2), 2000);
    // Phase 2: Logo fades, text collapses to "KS" and scales up (2.0 → 3.6s)
    const t2 = setTimeout(() => setPhase(3), 3600);
    // Phase 3: Entire screen fades out               (3.6 → 4.6s)
    const t3 = setTimeout(() => onComplete(), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0e0003' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 3 ? 0 : 1 }}
      transition={{ duration: 1.0, ease: 'easeInOut' }}
    >
      {/* ── Grain overlay ── */}
      <div className="absolute inset-0 bg-grain z-0 opacity-40 pointer-events-none" />

      {/* ── Warm radial ambient glow ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="w-[560px] h-[560px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(189,86,26,0.18) 0%, rgba(114,3,3,0.12) 45%, transparent 72%)',
            filter: 'blur(55px)',
          }}
        />
      </div>

      {/* ── Floating saffron particles ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[
          { top: '22%', left: '20%', w: 5, dur: 4.2, dx: 10, dy: -18, color: '#E6C587' },
          { top: '70%', left: '65%', w: 7, dur: 5.1, dx: -12, dy: -26, color: '#BD561A' },
          { top: '50%', right: '20%', w: 4, dur: 4.8, dx: -14, dy: 16, color: '#E6C587' },
          { top: '35%', right: '35%', w: 5, dur: 3.6, dx: 8, dy: -14, color: '#BD561A' },
          { top: '80%', left: '30%', w: 4, dur: 5.5, dx: 10, dy: -20, color: '#E6C587' },
        ].map((p, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, p.dy, 0], x: [0, p.dx, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              width: p.w,
              height: p.w,
              backgroundColor: p.color,
              opacity: 0.35,
              filter: 'blur(1.5px)',
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center">

        {/*
          LOGO WRAPPER — fixed height so when the logo fades out,
          the text block below stays perfectly still (no upward jump).
        */}
        <div className="h-32 md:h-40 flex items-center justify-center mb-2">
          <AnimatePresence>
            {phase === 1 && (
              <motion.img
                key="logo"
                src="/Images/Logo.png"
                alt="Kasa Saffron"
                initial={{ opacity: 0, y: -14, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 1.04 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-24 md:h-32 object-contain select-none"
              />
            )}
          </AnimatePresence>
        </div>

        {/* ── Brand name ── */}
        <motion.div
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={
            phase === 1
              ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
              : phase === 2
                ? { opacity: 1, y: 0, scale: 1.38, filter: 'blur(0px)' }
                : { opacity: 0, y: 0, scale: 28, filter: 'blur(10px)' }
          }
          transition={{
            duration: phase === 3 ? 1.05 : 1.15,
            ease: phase === 3 ? [0.76, 0, 0.24, 1] : [0.22, 1, 0.36, 1],
          }}
          className="relative flex items-center overflow-visible"
          style={{ gap: 0 }}
        >
          {/* ── K ── */}
          <span
            className="text-[42px] md:text-[64px] font-bold tracking-wider leading-none flex-shrink-0 select-none"
            style={{ fontFamily: "'Cinzel', serif", color: '#E6C587' }}
          >
            K
          </span>

          {/* ── "asa " squeezes into K on phase 2 ── */}
          <AnimatePresence initial={false}>
            {phase === 1 && (
              <motion.span
                key="asa"
                initial={{ opacity: 1, width: '162px', x: 0 }}
                exit={{ opacity: 0, width: '0px', x: -6 }}
                transition={{
                  width: { duration: 0.95, ease: [0.4, 0, 0.1, 1] },
                  opacity: { duration: 0.55, ease: 'easeIn' },
                  x: { duration: 0.95, ease: [0.4, 0, 0.1, 1] },
                }}
                className="overflow-hidden whitespace-pre leading-none select-none flex-shrink-0"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'baseline',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(42px, 6vw, 64px)',
                  fontWeight: 700,
                  color: '#E6C587',
                }}
              >
                asa{'\u00a0'}
              </motion.span>
            )}
          </AnimatePresence>

          {/* ── S ── */}
          <span
            className="text-[42px] md:text-[64px] font-bold tracking-wider leading-none flex-shrink-0 select-none"
            style={{ fontFamily: "'Cinzel', serif", color: '#BD561A' }}
          >
            S
          </span>

          {/* ── "affron" squeezes into S on phase 2 ── */}
          <AnimatePresence initial={false}>
            {phase === 1 && (
              <motion.span
                key="affron"
                initial={{ opacity: 1, width: '240px', x: 0 }}
                exit={{ opacity: 0, width: '0px', x: -6 }}
                transition={{
                  width: { duration: 0.95, ease: [0.4, 0, 0.1, 1] },
                  opacity: { duration: 0.55, ease: 'easeIn', delay: 0.08 },
                  x: { duration: 0.95, ease: [0.4, 0, 0.1, 1] },
                }}
                className="overflow-hidden whitespace-pre leading-none select-none flex-shrink-0"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'baseline',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(42px, 6vw, 64px)',
                  fontWeight: 700,
                  color: '#BD561A',
                }}
              >
                affron
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Tagline ── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={
            phase === 1
              ? { opacity: 0.7, y: 0 }
              : { opacity: 0, y: -6 }
          }
          transition={{ duration: 0.85, delay: phase === 1 ? 0.75 : 0.0, ease: 'easeOut' }}
          className="mt-5 text-[9px] md:text-[11px] tracking-[0.38em] uppercase select-none"
          style={{ fontFamily: "'Inter', sans-serif", color: '#ffffffff' }}
        >
          Authentic Spanish Croquetas
        </motion.p>

        {/* ── Thin gold progress bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 1 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-7 rounded-full overflow-hidden"
          style={{ width: '120px', height: '1px', backgroundColor: 'rgba(230,197,135,0.12)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#E6C587' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          />
        </motion.div>

      </div>

      {/* ── Thin gold bottom border line ── */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px]"
        style={{ backgroundColor: '#E6C587' }}
        initial={{ width: '0%', opacity: 0 }}
        animate={
          phase === 1
            ? { width: '100%', opacity: 0.2 }
            : { width: '100%', opacity: 0 }
        }
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
