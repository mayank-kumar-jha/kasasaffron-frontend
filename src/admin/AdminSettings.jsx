import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function AdminSettings() {
  const { adminEmail, adminPassword, updateCredentials } = useAdmin();
  const [email, setEmail] = useState(adminEmail);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (currentPass !== adminPassword) {
      setError('Current password is incorrect.');
      return;
    }
    if (!email) {
      setError('Email cannot be empty.');
      return;
    }
    if (newPass && newPass.length < 4) {
      setError('New password must be at least 4 characters.');
      return;
    }
    if (newPass && newPass !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const { adminUpdateCredentials } = await import('../api/admin.service.js');
      await adminUpdateCredentials({ currentPassword: currentPass, newEmail: email, newPassword: newPass || adminPassword });
      
      updateCredentials(email, newPass || adminPassword);
      setSuccess('Credentials updated successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update credentials:', err);
      setError('Failed to update credentials on server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0a0001]">
      <div className="mb-8">
        <p className="text-[#E6C587]/50 text-[10px] font-bold tracking-widest uppercase mb-1">Admin</p>
        <h1 className="text-2xl font-serif text-white" style={{ fontFamily: "'Cinzel', serif" }}>Settings</h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-8">
          <h2 className="text-white font-serif text-lg mb-6 pb-4 border-b border-[#E6C587]/10">Change Credentials</h2>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 bg-green-900/30 border border-green-500/30 rounded-xl text-green-300 text-sm">✓ {success}</div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0d0002] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20"
              />
            </div>

            <div className="pt-2 border-t border-[#E6C587]/10">
              <p className="text-[#E6C587]/40 text-[10px] uppercase tracking-widest font-bold mb-4">Change Password</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPass}
                      onChange={e => setCurrentPass(e.target.value)}
                      required
                      placeholder="Enter current password"
                      className="w-full pl-4 pr-10 py-3 bg-[#0d0002] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20"
                    />
                    <button type="button" onClick={() => setShowCurrent(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E6C587]/30 hover:text-[#E6C587]/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showCurrent ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} /></svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">New Password (leave blank to keep current)</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="New password..."
                      className="w-full pl-4 pr-10 py-3 bg-[#0d0002] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20"
                    />
                    <button type="button" onClick={() => setShowNew(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E6C587]/30 hover:text-[#E6C587]/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showNew ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} /></svg>
                    </button>
                  </div>
                </div>
                {newPass && (
                  <div>
                    <label className="block text-[10px] text-[#E6C587]/50 font-bold tracking-widest uppercase mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
                      placeholder="Repeat new password..."
                      className="w-full px-4 py-3 bg-[#0d0002] border border-[#E6C587]/15 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/40 placeholder-white/20"
                    />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-[#B8893A] to-[#E6C587] text-[#0d0002] font-bold text-sm tracking-widest uppercase rounded-xl hover:shadow-[0_0_20px_rgba(230,197,135,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              {loading ? 'Saving...' : 'Update Credentials'}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6">
          <h3 className="text-white/50 text-xs font-bold tracking-widest uppercase mb-3">Current Credentials</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/30">Email</span>
              <span className="text-[#E6C587]/70 font-mono">{adminEmail}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/30">Password</span>
              <span className="text-[#E6C587]/70 font-mono">{'•'.repeat(adminPassword.length)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
