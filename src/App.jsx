import React, { useState, useEffect, useLayoutEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AdminProvider, useAdmin } from './context/AdminContext';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll_${window.location.pathname}`, window.scrollY.toString());
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  useLayoutEffect(() => {
    const prevPath = window.location.pathname;
    return () => { sessionStorage.setItem(`scroll_${prevPath}`, window.scrollY.toString()); };
  }, [pathname]);

  useLayoutEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    let targetScroll = 0;
    if (navType === 'POP') {
      const saved = sessionStorage.getItem(`scroll_${pathname}`);
      if (saved) targetScroll = parseInt(saved, 10);
    } else {
      sessionStorage.setItem(`scroll_${pathname}`, '0');
    }
    
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, targetScroll);
    document.documentElement.scrollTo(0, targetScroll);
    document.body.scrollTo(0, targetScroll);
    
    const timer = setTimeout(() => {
      window.scrollTo(0, targetScroll);
      document.documentElement.scrollTo(0, targetScroll);
      document.body.scrollTo(0, targetScroll);
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 60);
    
    return () => clearTimeout(timer);
  }, [pathname, hash, navType]);

  return null;
}

import Preloader from './Preloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';

const Home = React.lazy(() => import('./Home'));
const Flavours = React.lazy(() => import('./Flavours'));
const Gallery = React.lazy(() => import('./Gallery'));
const B2b = React.lazy(() => import('./B2b'));
const Signup = React.lazy(() => import('./Signup'));
const Checkout = React.lazy(() => import('./Checkout'));
const UpcomingEvents = React.lazy(() => import('./UpcomingEvents'));

// Admin pages
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));
const Dashboard = React.lazy(() => import('./admin/Dashboard'));
const EventsEditor = React.lazy(() => import('./admin/EventsEditor'));
const FlavoursEditor = React.lazy(() => import('./admin/FlavoursEditor'));
const GalleryEditor = React.lazy(() => import('./admin/GalleryEditor'));
const AboutEditor = React.lazy(() => import('./admin/AboutEditor'));
const BroadcastEditor = React.lazy(() => import('./admin/BroadcastEditor'));
const AdminSettings = React.lazy(() => import('./admin/AdminSettings'));

const LiveSheets = React.lazy(() => import('./admin/LiveSheets'));

import './index.css';
import './App.css';
import './horeca.css';

import SkeletonPage from './components/SkeletonPage';

const AdminSkeleton = () => (
  <div className="w-full min-h-screen bg-[#0a0001] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#E6C587]/30 border-t-[#E6C587] rounded-full animate-spin"></div>
  </div>
);

function AdminSection() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/sheets" element={<AdminLayout><LiveSheets /></AdminLayout>} />
        <Route path="/admin/events" element={<AdminLayout><EventsEditor /></AdminLayout>} />
        <Route path="/admin/flavours" element={<AdminLayout><FlavoursEditor /></AdminLayout>} />
        <Route path="/admin/gallery" element={<AdminLayout><GalleryEditor /></AdminLayout>} />
        <Route path="/admin/about" element={<AdminLayout><AboutEditor /></AdminLayout>} />
        {/* <Route path="/admin/broadcast" element={<AdminLayout><BroadcastEditor /></AdminLayout>} /> */}
        <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Suspense>
  );
}

function AppContent() {
  const { isDataLoading } = useAdmin();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Check for OAuth tokens in URL
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    
    if (token && user) {
      localStorage.setItem('kasa_access_token', token);
      localStorage.setItem('kasa_user', decodeURIComponent(user));
      window.dispatchEvent(new Event('userStateChange'));
      // Remove query params from URL without reloading
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  if (isAdminPage) {
    return (
      <>
        <ScrollToTop />
        <AdminSection />
      </>
    );
  }



  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<SkeletonPage />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flavours" element={<Flavours />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/b2b" element={<B2b />} />
          <Route path="/auth" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/events" element={<UpcomingEvents />} />
        </Routes>
      </Suspense>
      {!isAuthPage && !isHomePage && <Footer />}
    </>
  );
}

const MAINTENANCE_MODE = true; // Temporary maintenance mode (active everywhere including production)

export default function App() {
  if (MAINTENANCE_MODE) {
    return <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000000', margin: 0, padding: 0, position: 'fixed', top: 0, left: 0, zIndex: 999999 }} />;
  }

  const [loading, setLoading] = useState(typeof window !== 'undefined' ? window.innerWidth > 768 : true);

  return (
    <HelmetProvider>
      <AdminProvider>
        <style>{`
          .pause-animations * {
            animation-play-state: paused !important;
          }
        `}</style>

        {loading && <Preloader onComplete={() => setLoading(false)} />}
        
        <div className={loading ? 'pause-animations' : ''} style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in', minHeight: '100%' }}>
          <Suspense fallback={<SkeletonPage />}>
            <Router>
              <AppContent />
            </Router>
          </Suspense>
        </div>
      </AdminProvider>
    </HelmetProvider>
  );
}
