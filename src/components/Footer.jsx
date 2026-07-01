import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

export default function Footer() {
  const { t } = useTranslation();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <footer className="relative bg-[#1a0104] text-[#f6e5dd]/80 pt-16 pb-8 border-t border-[#E6C587]/10 overflow-hidden font-nexa">
      {/* Subtle background overlay patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E6C587' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      
      {/* Faded background flower watermark */}
      <img src="/Images/FLOWER.png" alt="" loading="lazy" className="absolute right-[-5%] bottom-[-10%] w-72 opacity-[0.03] pointer-events-none select-none" />
      <img src="/Images/Hibiscus.png" alt="" loading="lazy" className="absolute left-[-5%] top-[-10%] w-72 opacity-[0.03] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-14 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 mb-12">
          
          {/* Column 1 - Brand Info */}
          <div className="space-y-5">
            <img src="/Images/Logo.png" alt="Kasa Saffron Logo" loading="lazy" className="w-20 lg:w-24 drop-shadow-md opacity-90" />
            <p className="text-xs leading-relaxed text-[#f6e5dd]/50 font-light">
              Crafting premium, Spanish croquetas infused with the elegance of hand-picked saffron threads. Bringing culinary heritage to professional kitchens and gourmet retailers.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a href="https://www.instagram.com/kasa_saffron_croqueteria/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#E6C587]/20 flex items-center justify-center text-[#E6C587]/70 hover:text-[#E6C587] hover:border-[#E6C587]/60 hover:bg-[#E6C587]/5 transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.01 3.71.054 1.14.052 1.762.24 2.173.4.55.213.958.468 1.37.88.413.41.668.82.88 1.37.162.41.35 1.032.4 2.17.044.927.052 1.285.052 3.71s-.008 2.783-.052 3.71c-.05 1.14-.24 1.762-.4 2.173-.213.55-.468.958-.88 1.37-.41.413-.82.668-1.37.88-.41.162-1.033.35-2.17.4-.927.044-1.285.052-3.71.052s-2.784-.008-3.71-.052c-1.14-.05-1.762-.24-2.173-.4-.55-.213-.958-.468-1.37-.88-.413-.41-.668-.82-.88-1.37-.162-.41-.35-1.033-.4-2.17C2.01 14.814 2 14.456 2 12s.01-2.784.054-3.71c.052-1.14.24-1.762.4-2.173.213-.55.468-.958.88-1.37.41-.413.82-.668 1.37-.88.41-.162 1.032-.35 2.17-.4.927-.044 1.285-.052 3.71-.052zm0-2C9.87 0 9.51.01 8.56.054c-1.137.054-1.915.234-2.595.498-.7.27-1.3.64-1.9 1.24-.6.6-1.124 1.2-1.354 1.9-.26.68-.44 1.46-.49 2.59C2.18 8.55 2.17 8.87 2.17 12s.01 3.51.054 4.44c.054 1.14.234 1.91.498 2.59.27.7.64 1.3 1.24 1.9.6.6 1.2 1.124 1.9 1.354.68.26 1.46.44 2.59.49.95.04 1.27.05 4.44.05s3.51-.01 4.44-.054c1.14-.054 1.91-.234 2.59-.498.7-.27 1.3-.64 1.9-1.24.6-.6 1.124-1.2 1.354-1.9.26-.68.44-1.46.49-2.59.04-.95.05-1.27.05-4.44s-.01-3.51-.054-4.44c-.054-1.137-.234-1.915-.498-2.595-.27-.7-.64-1.3-1.24-1.9-.6-.6-1.2-1.124-1.9-1.354-.68-.26-1.46-.44-2.59-.49C15.45.01 15.13 0 12 0z"/>
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4 lg:pl-10">
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#E6C587] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <Link to="/" className="hover:text-[#E6C587] transition-colors duration-300">{t("nav.home")}</Link>
              </li>
              <li>
                <Link to="/flavours" className="hover:text-[#E6C587] transition-colors duration-300">{t("nav.ourFlavours")}</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#E6C587] transition-colors duration-300">{t("nav.gallery")}</Link>
              </li>
              <li>
                <Link to="/b2b" className="hover:text-[#E6C587] transition-colors duration-300">{t("nav.b2bBusiness")}</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Info / Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#E6C587] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              Kitchen & Contact
            </h4>
            <ul className="space-y-3.5 text-xs font-light">
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#E6C587]/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Carrer de Mallorca, Barcelona, Spain</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-[#E6C587]/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:kasasaffron@outlook.com" className="hover:text-[#E6C587] transition-colors">kasasaffron@outlook.com</a>
              </li>
              <li className="pt-2">
                <button onClick={() => setIsContactOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 mt-1 rounded-full border border-[#E6C587]/40 text-[#E6C587] hover:bg-[#E6C587] hover:text-[#1a0104] transition-all duration-300 text-[10px] font-bold uppercase tracking-widest">
                  <span>{t("footer.contact")}</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </li>
            </ul>
          </div>



        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#E6C587]/10 my-6" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#f6e5dd]/40 font-light">
          <p>© {new Date().getFullYear()} KASA SAFFRON. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#E6C587] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#E6C587] transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
    
    <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
