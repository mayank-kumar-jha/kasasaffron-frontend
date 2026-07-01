import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { login, register, forgotPassword, resetPassword } from './api/auth.service.js';

export default function Signup() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (viewMode === 'login') {
        await login({ email, password });
        navigate('/');
      } else if (viewMode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await register({ name, email, phone, password });
        // Auto-login after register
        await login({ email, password });
        navigate('/');
      } else if (viewMode === 'forgot') {
        await forgotPassword({ email });
        setViewMode('reset');
      } else if (viewMode === 'reset') {
        await resetPassword({ email, otp, password });
        setViewMode('login');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for page load
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.8 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const leftSideVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Form slide animation variants
  const formVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 50 : -50,
      y: 0
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 50 : -50,
      transition: { duration: 0.4, ease: "easeInOut" }
    })
  };

  return (
    <div className="min-h-screen w-full relative flex font-nexa bg-gradient-to-br from-[#fdfaf5] via-[#f8eedf] to-[#f4e4cf] overflow-hidden">

      {/* Background SVG Elements */}
      <motion.svg
        initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
        animate={{ opacity: 0.08, rotate: 0, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] pointer-events-none text-saffron"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="currentColor" d="M45.7,-76.4C58.9,-69.3,69.5,-55.9,78.2,-41.4C86.9,-26.9,93.6,-11.3,92.6,3.8C91.5,18.8,82.8,33.3,71.5,44.7C60.2,56.1,46.3,64.5,31.7,71.2C17,77.8,1.6,82.7,-13.4,81.1C-28.5,79.5,-43.3,71.5,-55.4,60.6C-67.5,49.7,-77,35.9,-83.4,20.4C-89.8,4.9,-93.2,-12.3,-88.2,-27.4C-83.3,-42.6,-69.9,-55.7,-54.6,-62.4C-39.3,-69.1,-22.1,-69.4,-5,-66.5C12.1,-63.6,24.2,-57.4,32.5,-83.9Z" transform="translate(100 100)" />
      </motion.svg>

      <motion.svg
        initial={{ opacity: 0, rotate: 10, scale: 0.9 }}
        animate={{ opacity: 0.06, rotate: -5, scale: 1.05 }}
        transition={{ duration: 4, delay: 0.5, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-[-10%] left-[10%] w-[550px] h-[550px] pointer-events-none text-saffron-dark"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="currentColor" d="M39.9,-65.7C52.4,-58.3,63.7,-48.1,72.4,-35.6C81.1,-23.1,87.1,-8.3,86.2,6.1C85.3,20.5,77.5,34.5,67,45.4C56.6,56.2,43.4,63.9,29.3,69.5C15.1,75.1,0,78.6,-14.2,76.5C-28.4,74.4,-41.8,66.6,-53.4,55.9C-65.1,45.1,-75.1,31.5,-80.6,15.8C-86.2,0.1,-87.3,-17.8,-80.9,-33.1C-74.6,-48.4,-60.8,-61,-45.5,-68.2C-30.2,-75.4,-13.3,-77.1,1.9,-80.1C17.1,-83.1,34.2,-87.3,39.9,-65.7Z" transform="translate(100 100)" />
      </motion.svg>

      {/* Left Column - Red Ribbon area */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={leftSideVariants}
        className="hidden lg:flex w-5/12 xl:w-1/3 relative items-center justify-center h-full min-h-screen left-[80px]"
      >
        {/* The Red Ribbon Stripe */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[160px] xl:w-[200px] bg-gradient-to-b from-saffron to-saffron-dark z-0 flex items-end shadow-2xl">
          <div className="w-full h-[40%] bg-gradient-to-t from-black/30 to-transparent opacity-60 mix-blend-overlay"></div>
        </div>

        {/* Logo at the top (Moved outside Content Wrapper to ensure it positions at the top of the screen) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-[28px] xl:top-[60px] z-20"
        >
          <img src="/Images/Logo.png" alt="Kasa Saffron" className="w-24 xl:w-32 drop-shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer" />
        </motion.div>

        {/* Content Wrapper inside the ribbon area */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">

          {/* Croquettes Plates */}
          <div className="relative mt-20 flex items-center justify-center">

            {/* Main Plate */}
            <motion.img
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 50, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              src="/Images/Croquettes_Dipping.png"
              alt="Croquettes with dipping sauce"
              className="w-[350px] xl:w-[450px] object-contain drop-shadow-2xl z-10 relative cursor-pointer"
            />

            {/* Saffron threads accent removed */}
          </div>

        </div>
      </motion.div>

      {/* Right Column - Forms with AnimatePresence */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-20 z-10 relative min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[390px] relative lg:left-[45px] lg:top-[40px] overflow-hidden py-4 px-2"
        >
          <AnimatePresence mode="wait" custom={viewMode === 'login' ? -1 : 1}>
            {viewMode === 'login' ? (
              // LOGIN FORM
              <motion.div
                key="login-form"
                custom={-1}
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <h2 className="text-3xl md:text-4xl font-cinzel text-saffron text-center mb-10 tracking-wide font-bold">
                  WELCOME BACK!
                </h2>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium shadow-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email Address"
                      className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Password"
                      className="w-full pl-10.5 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-saffron focus:outline-none transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end pt-1">
                    <button type="button" onClick={() => { setViewMode('forgot'); setError(''); }} className="text-[13px] text-saffron hover:text-saffron-dark hover:underline font-medium transition-colors">
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-[85%] mx-auto flex items-center justify-center gap-2 bg-saffron text-white py-3.5 rounded-[20px] hover:bg-saffron-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="flex items-center my-8 w-full sm:w-[85%] mx-auto">
                  <div className="flex-1 border-t border-[#d8c3af]"></div>
                  <span className="px-4 text-[#a38f7e] text-xs font-bold tracking-widest">{t("auth.or")}</span>
                  <div className="flex-1 border-t border-[#d8c3af]"></div>
                </div>

                {/* Social Login */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-[90%] mx-auto">
                  <button type="button" onClick={() => window.location.href = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/auth/google` : '/api/v1/auth/google'} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e5d5c5] rounded-full hover:bg-white transition-all duration-300 bg-white/50 text-gray-600 font-medium text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                    Google
                  </button>
                </div>

                {/* Switch to Signup Link */}
                <p className="text-center mt-10 text-[13px] text-gray-600 font-medium">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setViewMode('signup'); setError(''); }}
                    className="text-saffron hover:text-saffron-dark hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </motion.div>
            ) : viewMode === 'signup' ? (
              // SIGNUP FORM
              <motion.div
                key="signup-form"
                custom={1}
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <h2 className="text-3xl md:text-4xl font-cinzel text-saffron text-center mb-10 tracking-wide font-bold">
                  CREATE AN ACCOUNT
                </h2>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium shadow-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      placeholder="Full Name"
                      className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number (Optional)"
                      className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email Address"
                      className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Password"
                      className="w-full pl-10.5 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-saffron focus:outline-none transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 pl-2">Password must be at least 8 characters long.</p>

                  {/* Confirm Password Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Confirm Password"
                      className="w-full pl-10.5 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-saffron focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Submit Signup Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-[85%] mx-auto flex items-center justify-center gap-2 bg-saffron text-white py-3.5 rounded-[20px] hover:bg-saffron-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Signing up...
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="flex items-center my-8 w-full sm:w-[85%] mx-auto">
                  <div className="flex-1 border-t border-[#d8c3af]"></div>
                  <span className="px-4 text-[#a38f7e] text-xs font-bold tracking-widest">{t("auth.or")}</span>
                  <div className="flex-1 border-t border-[#d8c3af]"></div>
                </div>

                {/* Social Signup */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-[90%] mx-auto">
                  <button type="button" onClick={() => window.location.href = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/auth/google` : '/api/v1/auth/google'} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e5d5c5] rounded-full hover:bg-white transition-all duration-300 bg-white/50 text-gray-600 font-medium text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                    Google
                  </button>
                </div>

                {/* Switch to Login Link */}
                <p className="text-center mt-10 text-[13px] text-gray-600 font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setViewMode('login'); setError(''); }}
                    className="text-saffron hover:text-saffron-dark hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </motion.div>
            ) : viewMode === 'forgot' ? (
              // FORGOT PASSWORD FORM
              <motion.div
                key="forgot-form"
                custom={1}
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <h2 className="text-3xl md:text-4xl font-cinzel text-saffron text-center mb-10 tracking-wide font-bold">
                  RESET PASSWORD
                </h2>
                
                <p className="text-center text-sm text-gray-600 mb-6 font-medium">
                  Enter your email address and we'll send you a 6-digit verification code.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium shadow-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email Address"
                      className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-[85%] mx-auto flex items-center justify-center gap-2 bg-saffron text-white py-3.5 rounded-[20px] hover:bg-saffron-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Code'
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-center mt-10 text-[13px] text-gray-600 font-medium">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => { setViewMode('login'); setError(''); }}
                    className="text-saffron hover:text-saffron-dark hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </motion.div>
            ) : (
              // RESET PASSWORD FORM
              <motion.div
                key="reset-form"
                custom={1}
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <h2 className="text-3xl md:text-4xl font-cinzel text-saffron text-center mb-10 tracking-wide font-bold">
                  NEW PASSWORD
                </h2>
                
                <p className="text-center text-sm text-gray-600 mb-6 font-medium">
                  Enter the 6-digit code sent to your email and your new password.
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm text-center font-medium shadow-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* OTP Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      placeholder="6-Digit Code"
                      className="w-full pl-10.5 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px] tracking-widest font-mono text-center"
                    />
                  </div>

                  {/* New Password Field */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-saffron transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="New Password"
                      className="w-full pl-10.5 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron bg-white/70 shadow-sm transition-all text-gray-700 placeholder-gray-400 hover:border-gray-300 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-saffron focus:outline-none transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-[85%] mx-auto flex items-center justify-center gap-2 bg-saffron text-white py-3.5 rounded-[20px] hover:bg-saffron-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Resetting...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-center mt-10 text-[13px] text-gray-600 font-medium">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => { setViewMode('login'); setError(''); }}
                    className="text-saffron hover:text-saffron-dark hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
