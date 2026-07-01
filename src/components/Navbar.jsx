import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { getCurrentUserLocal, logout } from '../api/auth.service';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const { cartTotalItems } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);

    const [user, setUser] = useState(getCurrentUserLocal());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleAuthChange = () => {
            setUser(getCurrentUserLocal());
        };
        window.addEventListener('userStateChange', handleAuthChange);
        return () => window.removeEventListener('userStateChange', handleAuthChange);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const handleChangeAccount = () => {
        setIsDropdownOpen(false);
        navigate('/auth');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    // ── MOBILE NAVBAR ──
    if (isMobile) {
        return (
            <>
                <header className="mob-navbar-top">
                    {/* Left: Menu Circle */}
                    <button
                        className="mob-menu-circle"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <span /><span /><span />
                    </button>

                    {/* Center: Language Capsule */}
                    <div className="mob-lang-capsule">
                        <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'active' : ''}>ES</button>
                        <span className="mob-lang-sep">|</span>
                        <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
                        <span className="mob-lang-sep">|</span>
                        <button onClick={() => changeLanguage('cat')} className={i18n.language === 'cat' ? 'active' : ''}>CAT</button>
                    </div>

                    {/* Right: Profile / Sign-in */}
                    {user ? (
                        <Link to="/auth" className="mob-profile-btn">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Profile" className="mob-profile-btn-avatar" />
                            ) : (
                                <div className="mob-profile-btn-initial">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </Link>
                    ) : (
                        <Link to="/auth" className="mob-profile-btn">
                            <div className="mob-profile-btn-signin">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                        </Link>
                    )}
                </header>

                {/* Sticky WhatsApp Icon */}
                <a 
                    href="https://wa.me/34681819652" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="fixed bottom-[85px] right-[29px] z-[110] flex items-center justify-center w-[40px] h-[40px] bg-[#25D366] rounded-full shadow-[0_4px_15px_rgba(37,211,102,0.4)] text-white hover:scale-110 transition-all duration-300 pointer-events-auto"
                    aria-label="Chat on WhatsApp"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>

                {/* Fixed Cart Icon */}
                <Link to="/checkout" className="fixed bottom-6 right-6 z-[110] flex items-center justify-center w-[50px] h-[50px] bg-[#370611] rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.4)] text-[#E6C587] hover:text-white hover:bg-[#560015] transition-all duration-300 border border-[#E6C587]/30 group pointer-events-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    {cartTotalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#BD561A] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-[#370611]">
                            {cartTotalItems}
                        </span>
                    )}
                </Link>

                {/* Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-[120] backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`fixed top-0 right-0 h-full w-[60%] sm:w-[50%] bg-gradient-to-b from-[#2a1015] to-[#1a0a0d] z-[130] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl border-l border-[#E6C587]/20 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Header with Close Button */}
                    <div className="flex justify-end p-5 border-b border-[#E6C587]/10">
                        <button
                            className="text-[#E6C587]/70 hover:text-[#E6C587] hover:rotate-90 transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links (Top) */}
                    <div className="flex flex-col flex-1 py-8 px-6 gap-6 text-[#E6C587] text-lg font-serif overflow-y-auto">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all">{t('nav.home')}</Link>
                        <Link to="/flavours" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all">{t('nav.ourFlavours')}</Link>
                        <Link to="/b2b" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all">{t('nav.b2bBusiness')}</Link>
                        <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all">{t('nav.gallery')}</Link>
                        <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:translate-x-2 transition-all">{t('nav.whatsNew', "WHAT'S NEW")}</Link>
                    </div>

                    {/* Sign In / Profile (Bottom) */}
                    <div className="p-6 border-t border-[#E6C587]/10 bg-[#1a0a0d]/50">
                        {user ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-4 w-full">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full border-2 border-[#E6C587] shadow-[0_0_15px_rgba(230,197,135,0.2)]" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E6C587] to-[#b68c43] text-[#140003] flex items-center justify-center font-bold text-xl uppercase border-2 border-[#E6C587]">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <span className="text-[#E6C587] font-medium truncate text-lg">{user.name}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-medium hover:bg-red-500/10 hover:border-red-500/50 transition-all mt-2"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full py-4 text-center bg-gradient-to-r from-[#E6C587] to-[#b68c43] text-[#140003] font-bold tracking-wide rounded-xl hover:shadow-[0_0_20px_rgba(230,197,135,0.4)] transition-all transform hover:-translate-y-1"
                            >
                                Sign In / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // ── DESKTOP NAVBAR (unchanged) ──
    return (
        <header className="fixed bottom-0 md:bottom-auto md:top-0 left-0 w-full z-[100] bg-[#faecdf]/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-[#4A0E1B]/10 md:border-none pointer-events-none px-4 md:px-12 py-3 md:py-6 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-none">
            {/* Empty left spacer on desktop to balance the right side for perfect centering */}
            <div className="hidden md:flex flex-1 pointer-events-none"></div>

            {/* Centered Nav Links */}
            <div className="hidden md:flex flex-none justify-center pointer-events-auto">
                <nav className="main-nav flex gap-6 lg:gap-12" aria-label="Main Navigation">
                    <Link to="/">{t('nav.home')}</Link>
                    <Link to="/flavours">{t('nav.ourFlavours')}</Link>
                    <Link to="/b2b">{t('nav.b2bBusiness')}</Link>
                    <Link to="/gallery">{t('nav.gallery')}</Link>
                    <Link to="/events">{t('nav.whatsNew', "WHAT'S NEW")}</Link>
                </nav>
            </div>

            {/* Right side actions */}
            <div className="flex-1 flex justify-end items-center gap-4 pointer-events-auto">
                {user ? (
                    <div className="relative hidden sm:block" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-[#1a0a0d]/80 hover:bg-[#2a1015] border border-[#E6C587]/30 px-3 py-1.5 rounded-full transition-all duration-300 shadow-md"
                        >
                            {user.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-[#E6C587]/50" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[#E6C587] text-[#140003] flex items-center justify-center font-bold text-sm uppercase">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                            )}
                            <svg className={`w-4 h-4 text-[#E6C587] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#1a0a0d] border border-[#E6C587]/20 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50 py-1">
                                <button
                                    onClick={handleChangeAccount}
                                    className="w-full text-left px-4 py-2.5 text-sm text-[#E6C587]/80 hover:text-[#E6C587] hover:bg-[#E6C587]/10 transition-colors"
                                >
                                    Change account
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/auth" className="auth-btn hidden sm:block">{t("navAuth.signInUp")}</Link>
                )}

                <div className="lang-switcher">
                    <div className="lang-options">
                        <button onClick={() => changeLanguage('es')} className={i18n.language === 'es' ? 'active' : ''}>ES</button>
                        <span className="separator">|</span>
                        <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>EN</button>
                        <span className="separator">|</span>
                        <button onClick={() => changeLanguage('cat')} className={i18n.language === 'cat' ? 'active' : ''}>CAT</button>
                    </div>
                </div>
            </div>

            {/* Fixed WhatsApp Icon at Bottom Right - Always visible */}
            <a 
                href="https://wa.me/34681819652" 
                target="_blank" 
                rel="noopener noreferrer"
                className="fixed bottom-[85px] right-[29px] sm:bottom-[105px] sm:right-[38px] z-[110] flex items-center justify-center w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] bg-[#25D366] rounded-full shadow-[0_4px_15px_rgba(37,211,102,0.4)] text-white hover:scale-110 transition-all duration-300 pointer-events-auto"
                aria-label="Chat on WhatsApp"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>

            {/* Fixed Cart Icon at Bottom Right - Always visible */}
            <Link to="/checkout" className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[110] flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-[#370611] rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.4)] text-[#E6C587] hover:text-white hover:bg-[#560015] transition-all duration-300 border border-[#E6C587]/30 group pointer-events-auto hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {cartTotalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#BD561A] text-white text-[11px] sm:text-[13px] font-bold w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-[#370611]">
                        {cartTotalItems}
                    </span>
                )}
            </Link>
        </header>
    );
}
