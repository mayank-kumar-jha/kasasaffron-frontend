import React, { useState, useEffect } from 'react';
import { adminGetAllOrders, adminGetB2BLeads, adminUpdateB2BLeadStatus, adminGetContacts, adminUpdateContactStatus } from '../api/admin.service';

// Module-level cache to prevent refetching when navigating between pages
// Removed cachedOrders to ensure fresh B2C orders are always loaded
let cachedLeads = null;
let cachedContacts = null;

export default function LiveSheets() {
  const [activeTab, setActiveTab] = useState('b2c');
  const [b2cOrders, setB2cOrders] = useState([]);
  const [b2bLeads, setB2bLeads] = useState(cachedLeads || []);
  const [contacts, setContacts] = useState(cachedContacts || []);
  const [loading, setLoading] = useState(true);
  
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resOrders, resLeads, resContacts] = await Promise.all([
        adminGetAllOrders(),
        adminGetB2BLeads(),
        adminGetContacts()
      ]);
      
      cachedLeads = resLeads?.data || [];
      cachedContacts = resContacts?.data || [];
      
      setB2cOrders(resOrders?.data || []);
      setB2bLeads(cachedLeads);
      setContacts(cachedContacts);
    } catch (err) {
      console.error('Failed to fetch sheet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleB2BStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'CONVERTED' ? 'NEW' : 'CONVERTED';
    try {
      await adminUpdateB2BLeadStatus(id, newStatus);
      setB2bLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleContactStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'RESOLVED' ? 'NEW' : 'RESOLVED';
    try {
      await adminUpdateContactStatus(id, newStatus);
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0a0001]">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-[#E6C587]/50 text-xs tracking-widest uppercase mb-1">Database</p>
          <h1 className="text-2xl font-serif text-white" style={{ fontFamily: "'Cinzel', serif" }}>Live Sheets</h1>
        </div>
        <button 
          onClick={() => fetchAllData(true)}
          disabled={loading}
          className="bg-[#E6C587]/10 hover:bg-[#E6C587]/20 text-[#E6C587] px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          )}
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-[#E6C587]/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('b2c')}
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === 'b2c' ? 'bg-[#E6C587]/15 text-[#E6C587]' : 'text-white/30 hover:text-white/60'}`}
        >
          B2C Orders
        </button>
        <button
          onClick={() => setActiveTab('b2b')}
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === 'b2b' ? 'bg-[#E6C587]/15 text-[#E6C587]' : 'text-white/30 hover:text-white/60'}`}
        >
          B2B Inquiries
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === 'contact' ? 'bg-[#E6C587]/15 text-[#E6C587]' : 'text-white/30 hover:text-white/60'}`}
        >
          Contact Forms
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-[#E6C587]">Loading data...</div>
        ) : activeTab === 'b2c' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E6C587]/5 border-b border-[#E6C587]/10 text-[#E6C587] text-[10px] uppercase tracking-widest">
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Revenue</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {b2cOrders.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-white/50">No orders found.</td></tr>
                ) : b2cOrders.map(order => (
                  <tr key={order.id} className="border-b border-[#E6C587]/5 hover:bg-[#E6C587]/5 transition-colors text-white/80 text-sm">
                    <td className="p-4">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="p-4">{order.user?.name || 'Guest'}</td>
                    <td className="p-4">{order.user?.email || 'N/A'}</td>
                    <td className="p-4 font-bold">€{order.totalAmount?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${order.status === 'PAID' || order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'b2b' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E6C587]/5 border-b border-[#E6C587]/10 text-[#E6C587] text-[10px] uppercase tracking-widest">
                  <th className="p-4">Date</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Volume</th>
                  <th className="p-4 text-center">Done?</th>
                </tr>
              </thead>
              <tbody>
                {b2bLeads.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-white/50">No inquiries found.</td></tr>
                ) : b2bLeads.map(lead => (
                  <tr key={lead.id} className="border-b border-[#E6C587]/5 hover:bg-[#E6C587]/5 transition-colors text-white/80 text-sm">
                    <td className="p-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold">{lead.companyName}</td>
                    <td className="p-4">
                      {lead.contactPerson}<br/>
                      <span className="text-xs opacity-60">{lead.email}</span>
                    </td>
                    <td className="p-4">{lead.estimatedVolume}</td>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={lead.status === 'CONVERTED'} 
                        onChange={() => handleB2BStatusChange(lead.id, lead.status)}
                        className="w-4 h-4 cursor-pointer accent-[#E6C587]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E6C587]/5 border-b border-[#E6C587]/10 text-[#E6C587] text-[10px] uppercase tracking-widest">
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 max-w-xs">Message</th>
                  <th className="p-4 text-center">Done?</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-white/50">No contact forms found.</td></tr>
                ) : contacts.map(contact => (
                  <tr key={contact.id} className="border-b border-[#E6C587]/5 hover:bg-[#E6C587]/5 transition-colors text-white/80 text-sm">
                    <td className="p-4 whitespace-nowrap">{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold">{contact.name}</td>
                    <td className="p-4">
                      <a href={`mailto:${contact.email}`} className="hover:text-[#E6C587]">{contact.email}</a>
                    </td>
                    <td className="p-4 max-w-xs truncate" title={contact.message}>{contact.message}</td>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={contact.status === 'RESOLVED'} 
                        onChange={() => handleContactStatusChange(contact.id, contact.status)}
                        className="w-4 h-4 cursor-pointer accent-[#E6C587]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
