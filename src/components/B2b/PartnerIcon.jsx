import React from 'react';

export default function PartnerIcon({ type }) {
  const icons = {
    restaurant: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 8v4M6 8v3a2 2 0 002 2h0a2 2 0 002-2V8M8 13v3M16 8v8M14 8h3v3a1.5 1.5 0 01-3 0V8z" />
      </svg>
    ),
    hotel: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    cafe: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 7.5H21a2 2 0 012 2v3a2 2 0 01-2 2h-2.5M3 10.5V17a3 3 0 003 3h9a3 3 0 003-3v-6.5M3 10.5h15m-15 0V7a3 3 0 013-3h9a3 3 0 013 3v3.5" />
      </svg>
    ),
    catering: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17h16M12 5v3m-8 9a8 8 0 0116 0M12 4.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
      </svg>
    ),
    retail: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    distributor: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  };
  return icons[type] || null;
}
