import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

import { adminGetProducts, adminGetEvents, adminGetGallery, adminGetContent } from '../api/admin.service.js';
import { login as backendLogin, logout as backendLogout, getCurrentUserLocal, getCurrentUser } from '../api/auth.service.js';

const DEFAULT_ADMIN_EMAIL = 'admin@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'yash91597';

const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { }
}

export const AdminProvider = ({ children }) => {
  const [adminEmail, setAdminEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [adminPassword, setAdminPassword] = useState(DEFAULT_ADMIN_PASSWORD);

  // Start as "checking" — verify the stored token against the server before rendering admin UI
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [events, setEvents] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // On mount: verify the stored token is still valid
  useEffect(() => {
    const verifyAuth = async () => {
      const localUser = getCurrentUserLocal();
      if (!localUser) {
        setAuthChecked(true);
        return;
      }
      try {
        // Verify with server — will throw 401 if token is stale
        const res = await getCurrentUser();
        const user = res?.data;
        if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MANAGER') {
          setIsAdminLoggedIn(true);
        } else {
          // Token valid but not admin — just deny admin access, DO NOT clear user token!
          setIsAdminLoggedIn(false);
        }
      } catch {
        // Stale/invalid token — clear it so user is forced to re-login
        localStorage.removeItem('kasa_access_token');
        localStorage.removeItem('kasa_user');
      } finally {
        setAuthChecked(true);
      }
    };
    verifyAuth();
  }, []);

  // Load All Data from Backend for everyone
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch only critical/fast data to unblock the UI quickly
        const aboutRes = await adminGetContent('about');
        if (aboutRes?.data) {
          const rawData = aboutRes.data;
          const cleanAbout = { ...rawData };
          ['chefImage', 'founderImage', 'lovieshImage'].forEach(key => {
            if (cleanAbout[key] && typeof cleanAbout[key] === 'object' && cleanAbout[key].en) {
              cleanAbout[key] = cleanAbout[key].en;
            }
          });
          setAboutData(cleanAbout);
        }
      } catch (err) {
        console.error("Failed to load about data:", err);
      } finally {
        // Unblock the UI immediately after critical data loads
        setIsDataLoading(false);
      }

      // 2. Fetch heavy data (Products, Events, Gallery) in the background
      try {
        const [prodRes, eventRes, galRes] = await Promise.allSettled([
          adminGetProducts(),
          adminGetEvents(),
          adminGetGallery()
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value?.data?.products) {
          setFlavours(prodRes.value.data.products);
        }
        if (eventRes.status === 'fulfilled' && eventRes.value?.data) {
          setEvents(eventRes.value.data);
        }
        if (galRes.status === 'fulfilled' && galRes.value?.data) {
          setGalleryImages(galRes.value.data);
        }
      } catch (err) {
        console.error("Failed to load heavy admin data:", err);
      }
    };
    fetchData();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await backendLogin({ email, password });
      const user = res.data.user;
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        setIsAdminLoggedIn(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Backend login failed:", err);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await backendLogout();
    } catch (err) {
      console.error(err);
    }
    setIsAdminLoggedIn(false);
  }, []);

  const updateCredentials = useCallback((newEmail, newPassword) => {
    setAdminEmail(newEmail);
    setAdminPassword(newPassword);
    saveToStorage('admin_email', newEmail);
    saveToStorage('admin_password', newPassword);
  }, []);

  const updateEvents = useCallback((newEvents) => { setEvents(newEvents); }, []);
  const updateFlavours = useCallback((newFlavours) => { setFlavours(newFlavours); }, []);
  const updateGallery = useCallback((newGallery) => { setGalleryImages(newGallery); }, []);
  const updateAbout = useCallback((newAbout) => { setAboutData(newAbout); }, []);

  const value = useMemo(() => ({
    isAdminLoggedIn, authChecked, login, logout,
    adminEmail, adminPassword, updateCredentials,
    events, updateEvents,
    flavours, updateFlavours,
    galleryImages, updateGallery,
    aboutData, updateAbout,
    isDataLoading,
  }), [
    isAdminLoggedIn, authChecked, login, logout,
    adminEmail, adminPassword, updateCredentials,
    events, updateEvents, flavours, updateFlavours,
    galleryImages, updateGallery, aboutData, updateAbout,
    isDataLoading
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
