import React, { useState, useEffect, useRef } from 'react';
import { adminGetUsers, adminSendBroadcast, adminGetBroadcastHistory } from '../api/admin.service';

export default function BroadcastEditor() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('compose'); // 'compose' or 'history'

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetching(true);
      const res = await adminGetUsers();
      if (res?.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setFetching(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await adminGetBroadcastHistory();
      if (res?.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      setSelectedUsers(users.map(u => u.id));
      setSelectAll(true);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uId => uId !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedUsers, id];
      setSelectedUsers(newSelected);
      if (newSelected.length === users.length) setSelectAll(true);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      setMessage({ type: 'error', text: 'Subject and body are required.' });
      return;
    }
    if (selectedUsers.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one user.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('body', body);
      
      const payloadUsers = selectAll && selectedUsers.length === users.length ? 'ALL' : JSON.stringify(selectedUsers);
      formData.append('userIds', payloadUsers);

      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const res = await adminSendBroadcast(formData);
      setMessage({ type: 'success', text: `Broadcast started for ${res.data.count} users!` });
      
      // Reset form
      setSubject('');
      setBody('');
      setAttachments([]);
      setSelectedUsers([]);
      setSelectAll(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send broadcast.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0a0001]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#E6C587]/50 text-[10px] font-bold tracking-widest uppercase mb-1">Mass Mailing</p>
          <h1 className="text-2xl font-serif text-white" style={{ fontFamily: "'Cinzel', serif" }}>Broadcast Hub</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => { setView('compose'); setMessage(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${view === 'compose' ? 'bg-[#E6C587] text-[#0d0002]' : 'border border-[#E6C587]/30 text-[#E6C587] hover:bg-[#E6C587]/10'}`}
          >
            Compose
          </button>
          <button 
            onClick={() => { setView('history'); fetchHistory(); setMessage(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${view === 'history' ? 'bg-[#E6C587] text-[#0d0002]' : 'border border-[#E6C587]/30 text-[#E6C587] hover:bg-[#E6C587]/10'}`}
          >
            History & Logs
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm border ${message.type === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-200' : 'bg-red-900/20 border-red-500/30 text-red-200'}`}>
          {message.text}
        </div>
      )}

      {view === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Selection Panel */}
          <div className="lg:col-span-1 bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6 flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-serif text-lg">Recipients ({selectedUsers.length})</h2>
              <button onClick={handleSelectAll} className="text-xs text-[#E6C587] hover:underline">
                {selectAll ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {fetching ? (
                <div className="text-[#E6C587]/50 text-center py-10">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-[#E6C587]/50 text-center py-10">No users found.</div>
              ) : (
                users.map(user => (
                  <label key={user.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#E6C587]/10 hover:bg-[#E6C587]/5 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 rounded bg-[#0a0001] border-[#E6C587]/30 text-[#BD561A] focus:ring-[#BD561A] focus:ring-offset-[#0a0001]"
                    />
                    <div className="overflow-hidden">
                      <div className="text-sm text-white truncate">{user.name}</div>
                      <div className="text-xs text-[#E6C587]/60 truncate">{user.email}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Composer Panel */}
          <div className="lg:col-span-2 bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6">
            <h2 className="text-white font-serif text-lg mb-4">Compose Email</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#E6C587]/70 text-xs font-bold tracking-widest uppercase mb-2">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Exciting News from Kasa Saffron!" 
                  className="w-full px-4 py-3 bg-[#0a0001] border border-[#E6C587]/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-[#E6C587]/70 text-xs font-bold tracking-widest uppercase mb-2">Email Body (Supports HTML)</label>
                <textarea 
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="<h2>Hello!</h2><p>Write your custom ad or newsletter here...</p>" 
                  rows={10}
                  className="w-full px-4 py-3 bg-[#0a0001] border border-[#E6C587]/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#E6C587]/50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[#E6C587]/70 text-xs font-bold tracking-widest uppercase mb-2">Attachments (Optional)</label>
                <input 
                  type="file" 
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-[#E6C587]/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#E6C587]/10 file:text-[#E6C587] hover:file:bg-[#E6C587]/20 cursor-pointer"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading || selectedUsers.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-[#BD561A] to-[#720303] text-white text-xs font-bold tracking-widest uppercase rounded-xl hover:shadow-[0_0_15px_rgba(189,86,26,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === 'history' && (
        <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6">
          <h2 className="text-white font-serif text-lg mb-6">Campaign History</h2>
          
          {history.length === 0 ? (
            <div className="text-[#E6C587]/50 text-center py-10">No past campaigns found.</div>
          ) : (
            <div className="space-y-6">
              {history.map(campaign => (
                <div key={campaign.id} className="border border-[#E6C587]/20 rounded-xl p-5 bg-[#0a0001]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{campaign.subject}</h3>
                      <p className="text-[#E6C587]/60 text-xs">{new Date(campaign.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg px-4 py-2">
                        <span className="block text-green-400 font-bold text-lg">{campaign.sentCount}</span>
                        <span className="text-[10px] text-green-400/70 uppercase">Sent</span>
                      </div>
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2">
                        <span className="block text-red-400 font-bold text-lg">{campaign.failedCount}</span>
                        <span className="text-[10px] text-red-400/70 uppercase">Failed</span>
                      </div>
                    </div>
                  </div>
                  
                  {campaign.failedCount > 0 && (
                    <div className="mt-4">
                      <h4 className="text-red-400 text-xs font-bold uppercase mb-2">Failed Deliveries</h4>
                      <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                        {campaign.logs.filter(l => l.status === 'FAILED').map((log, idx) => (
                          <div key={idx} className="bg-red-900/10 border border-red-500/20 rounded-lg p-3 text-xs flex justify-between">
                            <span className="text-white">{log.user?.name || 'Unknown'} ({log.user?.email || 'N/A'})</span>
                            <span className="text-red-300 ml-4 truncate max-w-xs">{log.errorMsg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
