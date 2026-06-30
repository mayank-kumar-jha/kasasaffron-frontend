import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { adminGetStats } from '../api/admin.service';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line
} from 'recharts';

const BAR_COLORS = ['#E6C587', '#D4A96A', '#C4894A', '#B8893A', '#E6C587', '#D4A96A', '#C4894A', '#B8893A', '#E6C587', '#D4A96A'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a0005] border border-[#E6C587]/20 rounded-xl p-3 shadow-xl">
        <p className="text-[#E6C587] text-xs font-bold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-white/70 text-xs">{p.name}: <span className="text-white font-bold">{p.name === 'revenue' ? `€${p.value}` : p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

const EDIT_TILES = [
  { to: '/admin/events', label: 'Upcoming Events', icon: '📅', desc: 'Add, edit, or remove events' },
  { to: '/admin/flavours', label: 'Flavours', icon: '🍽️', desc: 'Manage croqueta catalogue' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️', desc: 'Update gallery images' },
  { to: '/admin/about', label: 'About Us', icon: '👥', desc: 'Edit team & story cards' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️', desc: 'Change admin credentials' },
];

let cachedStats = null;

export default function Dashboard() {
  const { events } = useAdmin();
  const [showEdit, setShowEdit] = useState(false);
  const [stats, setStats] = useState(cachedStats);
  const [loading, setLoading] = useState(!cachedStats);

  const fetchStats = async (forceRefresh = false) => {
    if (!forceRefresh && cachedStats) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await adminGetStats();
      cachedStats = data?.data;
      setStats(cachedStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="min-h-screen bg-[#0a0001] flex items-center justify-center text-[#E6C587]">Loading stats...</div>;
  }

  const { totalRevenue, totalOrders, pendingOrders, completedOrders, productSales, monthlyData } = stats;

  const topProduct = productSales && productSales.length > 0 && productSales[0].shortName !== 'N/A' ? productSales[0].shortName : 'N/A';

  const statCards = [
    { label: 'Total Orders', value: totalOrders, prefix: '', suffix: ' units', icon: '📦', color: 'from-[#E6C587]/20 to-transparent' },
    { label: 'Total Revenue', value: `€${totalRevenue.toLocaleString()}`, prefix: '', suffix: '', icon: '💰', color: 'from-[#B8893A]/20 to-transparent' },
    { label: 'Top Product', value: topProduct, prefix: '', suffix: '', icon: '🏆', color: 'from-[#4A0E1A]/40 to-transparent' },
    { label: 'Pending Orders', value: pendingOrders, prefix: '', suffix: '', icon: '⏳', color: 'from-[#E6C587]/10 to-transparent' },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen bg-[#0a0001]">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-[#E6C587]/50 text-xs tracking-widest uppercase mb-1">Overview</p>
          <h1 className="text-2xl font-serif text-white" style={{ fontFamily: "'Cinzel', serif" }}>Dashboard</h1>
        </div>
        <button 
          onClick={() => fetchStats(true)}
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

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-5`}>
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-[#E6C587]/50 text-[10px] font-bold tracking-widest uppercase mb-1">{card.label}</p>
            <p className="text-white text-xl font-bold font-serif">{card.value}{card.suffix}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart — Most Sold */}
        <div className="lg:col-span-2 bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#E6C587]/50 text-[10px] font-bold tracking-widest uppercase">By Flavour</p>
              <h2 className="text-white font-serif text-lg">Most Sold Items</h2>
            </div>
            <span className="text-[10px] text-green-400 border border-green-500/20 rounded-full px-3 py-1 bg-green-500/10">Live Data</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={productSales} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6C587" strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="shortName" tick={{ fill: '#E6C587', opacity: 0.4, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#E6C587', opacity: 0.4, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230,197,135,0.04)' }} />
              <Bar dataKey="units" radius={[6, 6, 0, 0]} maxBarSize={40} name="units">
                {productSales?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} fillOpacity={index === 0 ? 1 : 0.65} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart — Monthly */}
        <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#E6C587]/50 text-[10px] font-bold tracking-widest uppercase">Trend</p>
              <h2 className="text-white font-serif text-lg">Monthly Orders</h2>
            </div>
            <span className="text-[10px] text-green-400 border border-green-500/20 rounded-full px-3 py-1 bg-green-500/10">Live Data</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6C587" strokeOpacity={0.05} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#E6C587', opacity: 0.4, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#E6C587', opacity: 0.4, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="orders" stroke="#E6C587" strokeWidth={2} dot={{ fill: '#E6C587', r: 3 }} activeDot={{ r: 5, fill: '#fff' }} name="orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Edit Content Section */}
      <div className="bg-[#130004] border border-[#E6C587]/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[#E6C587]/50 text-[10px] font-bold tracking-widest uppercase">Content Management</p>
            <h2 className="text-white font-serif text-lg">Edit Content</h2>
          </div>
          <button
            onClick={() => setShowEdit(o => !o)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E6C587]/10 hover:bg-[#E6C587]/20 border border-[#E6C587]/20 hover:border-[#E6C587]/40 text-[#E6C587] text-xs font-bold tracking-widest uppercase rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            {showEdit ? 'Hide' : 'Edit'}
          </button>
        </div>

        {showEdit && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {EDIT_TILES.map(tile => (
              <Link key={tile.to} to={tile.to} className="group bg-[#0d0002] hover:bg-[#1a0005] border border-[#E6C587]/10 hover:border-[#E6C587]/30 rounded-xl p-4 transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <div className="text-2xl mb-3">{tile.icon}</div>
                <p className="text-white text-xs font-bold mb-1">{tile.label}</p>
                <p className="text-white/30 text-[10px] leading-relaxed">{tile.desc}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
