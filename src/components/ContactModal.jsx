import React, { useEffect, useState } from 'react';

import api from '../api/client';

export default function ContactModal({ isOpen, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
      setIsSuccess(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400); // Matches the animation duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contacts', formData);
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 font-sans">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#160003]/80 backdrop-blur-sm transition-opacity duration-400 ease-in-out ${isClosing ? 'opacity-0' : 'opacity-100 animate-fadeIn'}`}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-5xl bg-[#FDF6EE] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-400 ease-out transform ${isClosing ? 'opacity-0 scale-95 translate-y-8' : 'opacity-100 scale-100 translate-y-0 animate-slideUp'}`}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 bg-white/10 md:bg-[#160003]/5 hover:bg-[#160003]/10 backdrop-blur-md rounded-full flex items-center justify-center text-[#160003] transition-all duration-300 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side: Contact Info */}
        <div className="w-full md:w-[40%] bg-[#370611] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background patterns */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E6C587' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif text-[#E6C587] mb-2 font-light tracking-wide">Contact</h2>
            <p className="text-[#FDF6EE]/70 font-light text-sm tracking-widest uppercase mb-12">We are here to help</p>

            <div className="space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E6C587]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#E6C587]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.25-3.95-6.847-6.847l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <div>
                  <h4 className="text-[#E6C587] font-bold text-xs uppercase tracking-widest mb-1">Phone</h4>
                  <p className="text-[#FDF6EE]/90 font-light text-sm">+34 681 819 652</p>
                  <p className="text-[#FDF6EE]/90 font-light text-sm mt-1">+34 681 807 047</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E6C587]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#E6C587]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <div>
                  <h4 className="text-[#E6C587] font-bold text-xs uppercase tracking-widest mb-1">Email</h4>
                  <a href="mailto:kasasaffron@outlook.com" className="text-[#FDF6EE]/90 font-light text-sm hover:text-[#E6C587] transition-colors">kasasaffron@outlook.com</a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E6C587]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#E6C587]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div>
                  <h4 className="text-[#E6C587] font-bold text-xs uppercase tracking-widest mb-1">Address</h4>
                  <p className="text-[#FDF6EE]/90 font-light text-sm">Barcelona, Spain</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E6C587]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#E6C587]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 className="text-[#E6C587] font-bold text-xs uppercase tracking-widest mb-1">Hours</h4>
                  <p className="text-[#FDF6EE]/90 font-light text-sm">Monday - Friday: <span className="font-medium text-white">12:00 - 19:00</span></p>
                  <p className="text-[#FDF6EE]/90 font-light text-sm mt-1">Saturday - Sunday: <span className="font-medium text-white">Closed</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[60%] p-8 md:p-12 relative bg-white flex flex-col justify-center">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-10 animate-fadeIn">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-serif text-[#370611] mb-2 font-bold">Message Sent!</h3>
              <p className="text-[#370611]/70 font-light">Thank you for reaching out. We will contact you within 48 hours.</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl md:text-3xl font-serif text-[#370611] mb-8 font-bold">Send Message</h3>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-[#370611]/70">Name *</label>
                    <input type="text" id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-3 text-sm text-[#370611] bg-[#fdf6ee]/50 border border-[#370611]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E6C587] focus:border-[#E6C587] transition-all" placeholder="E.g. Maria Garcia" />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-[#370611]/70">Email *</label>
                    <input type="email" id="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-3 text-sm text-[#370611] bg-[#fdf6ee]/50 border border-[#370611]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E6C587] focus:border-[#E6C587] transition-all" placeholder="you@example.com" />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-[#370611]/70">Phone</label>
                  <input type="tel" id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 text-sm text-[#370611] bg-[#fdf6ee]/50 border border-[#370611]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E6C587] focus:border-[#E6C587] transition-all" placeholder="+34 600 000 000" />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-[#370611]/70">Mensaje *</label>
                  <textarea id="message" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required rows="4" className="w-full px-4 py-3 text-sm text-[#370611] bg-[#fdf6ee]/50 border border-[#370611]/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#E6C587] focus:border-[#E6C587] transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="relative overflow-hidden group inline-flex items-center justify-center px-8 py-3.5 mt-4 text-sm font-bold text-white uppercase tracking-widest bg-[#370611] rounded-full hover:bg-[#560015] transition-colors shadow-lg disabled:opacity-50">
                  <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <div className="absolute inset-0 h-full w-0 bg-[#BD561A] transition-all duration-400 ease-out group-hover:w-full z-0"></div>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      
      {/* Required CSS Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
