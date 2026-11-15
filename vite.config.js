import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://kasa-saffron-backend.vercel.app',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // Keep the framework and routing code in focused, cacheable chunks.
          if (/\/node_modules\/(react|react-dom|scheduler|react-is|react-helmet-async)\//.test(id)) {
            return 'vendor-react';
          }
          if (/\/node_modules\/(react-router|react-router-dom|@remix-run\/router)\//.test(id)) {
            return 'vendor-router';
          }
          if (/\/node_modules\/(i18next|react-i18next|i18next-browser-languagedetector|i18next-http-backend)\//.test(id)) {
            return 'vendor-i18n';
          }
          if (id.includes('/node_modules/recharts/') || id.includes('/node_modules/d3-')) {
            return 'vendor-recharts';
          }
          if (id.includes('/node_modules/framer-motion/')) {
            return 'vendor-framer-motion';
          }
          if (id.includes('/node_modules/gsap/')) {
            return 'vendor-gsap';
          }
          if (id.includes('/node_modules/locomotive-scroll/')) {
            return 'vendor-locomotive';
          }
          return 'vendor-core';
        }
      }
    }
  }
})
