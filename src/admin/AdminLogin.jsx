import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const success = await login(email.trim(), password.trim());
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0002] flex items-center justify-center px-4" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(44,1,7,0.6) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(184,137,58,0.08) 0%, transparent 50%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/Images/Logo.png" alt="Kasa Saffron" className="w-20 mx-auto mb-4 drop-shadow-lg" onError={e => { e.target.style.display='none'; }} />
          <h1 className="text-2xl font-serif text-white tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
            Admin Portal
          </h1>
          <p className="text-[#E6C587]/50 text-xs mt-1 tracking-widest uppercase">Kasa Saffron Management</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a0005]/80 border border-[#E6C587]/15 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          <h2 className="text-lg font-serif text-[#E6C587] mb-6">Sign In</h2>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#E6C587]/60 font-bold tracking-widest uppercase mb-2">Email</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E6C587]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#0d0002]/60 border border-[#E6C587]/20 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E6C587]/60 focus:ring-1 focus:ring-[#E6C587]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#E6C587]/60 font-bold tracking-widest uppercase mb-2">Password</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E6C587]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#0d0002]/60 border border-[#E6C587]/20 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E6C587]/60 focus:ring-1 focus:ring-[#E6C587]/20 transition-all"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E6C587]/30 hover:text-[#E6C587]/70 transition-colors">
                  {showPass ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#B8893A] to-[#E6C587] text-[#0d0002] font-bold rounded-xl tracking-widest text-sm uppercase transition-all hover:shadow-[0_0_20px_rgba(230,197,135,0.3)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#E6C587]/20 text-xs mt-6 tracking-wider">
          Kasa Saffron Admin Portal · Protected Access
        </p>
      </div>
    </div>
  );
}
