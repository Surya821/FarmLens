import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, Activity, MessageSquare, Database,
  ChevronRight, Plus, CheckCircle, Clock 
} from 'lucide-react';
import AdminNavbar from './AdminNavbar';

function AdminDashboard({ isDark, setIsDark }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCattle: 0,
    totalMessages: 0,
    serviceUsed: 0,
    websiteStats: null
  });
  const [messages, setMessages] = useState([]); // all messages
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, msgRes, userRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/stats`),
          fetch(`${API_BASE}/api/messages`),
          fetch(`${API_BASE}/api/admin/users`)
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData); // store ALL messages to compute unread count
        }
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(userData.slice(0, 5));
        }
      } catch (error) {
        console.error('Admin Dashboard: Backend unreachable:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Compute unread count live from local messages state
  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const recentMessages = messages.slice(0, 5);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/messages/${id}/read`, { method: 'POST' });
      if (res.ok) {
        // Update locally so the stat card and list update immediately
        setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'read' } : m));
      }
    } catch (error) {
      console.error('Failed to mark read:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      <AdminNavbar isDark={isDark} setIsDark={setIsDark} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">

        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">Command Center</h1>
          <p className="text-[var(--muted)] font-medium text-sm sm:text-base">Monitoring Farmlens ecosystem performance</p>
        </div>

        {/* Stats Grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<Users size={22} className="text-blue-500" />}
            color="blue"
          />
          <StatCard 
            title="System Revenue" 
            value={`₹${stats.totalRevenue?.toLocaleString()}`} 
            icon={<span className="text-emerald-500 font-black text-xl">₹</span>}
            color="green"
            trend={stats.monthlyRevenue > 0 ? `+₹${stats.monthlyRevenue} this month` : 'No revenue this month'}
          />
          <StatCard 
            title="API Requests" 
            value={stats.serviceUsed} 
            icon={<Database size={22} className="text-purple-500" />}
            color="purple"
          />
          <StatCard 
            title="Unread Messages" 
            value={unreadCount}
            icon={<MessageSquare size={22} className="text-orange-500" />}
            color="orange"
            highlight={unreadCount > 0}
          />
        </div>

        {/* API Analytics Trend */}
        <div className="mb-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" /> API Performance & Usage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.apiUsageTrend?.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
                  <div>
                    <code className="text-[10px] font-bold text-[var(--accent)] block mb-1 truncate">{item._id}</code>
                    <h4 className="text-2xl font-black">{item.count} <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">calls</span></h4>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-[10px] font-black text-[var(--muted)] uppercase">Avg Latency</span>
                    <span className="text-[10px] font-black text-green-500">{Math.round(item.avgResponseTime || 0)}ms</span>
                  </div>
                </div>
              ))}
              {(!stats.apiUsageTrend || stats.apiUsageTrend.length === 0) && (
                <div className="md:col-span-3 py-10 text-center text-[var(--muted)] font-bold italic">
                  No API usage data logged yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid — 1 col mobile, then lg:3-col split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Recent Messages + Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Messages */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <MessageSquare size={20} className="text-green-500" /> 
                  Recent Messages
                  {unreadCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <Link to="/admin/messages" className="text-xs font-black text-green-500 hover:underline uppercase tracking-widest">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recentMessages.length > 0 ? recentMessages.map((msg) => (
                  <div key={msg._id} className={`p-4 rounded-2xl border transition-all ${msg.status === 'unread' ? 'bg-green-500/5 border-green-500/30' : 'bg-[var(--surface)] border-[var(--border)]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black ${msg.status === 'unread' ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]'}`}>
                          {msg.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm truncate">{msg.email}</h4>
                            {msg.status === 'unread' && (
                              <span className="flex-shrink-0 px-2 py-0.5 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">New</span>
                            )}
                          </div>
                          <p className="text-xs text-[var(--muted)] font-medium flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {new Date(msg.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-[var(--muted)] mt-1 line-clamp-1 italic">"{msg.content}"</p>
                        </div>
                      </div>
                      {msg.status === 'unread' && (
                        <button 
                          onClick={() => markAsRead(msg._id)}
                          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-black rounded-xl shadow-lg shadow-green-500/20 hover:scale-[1.05] active:scale-95 transition-all"
                        >
                          <CheckCircle size={12} /> Read
                        </button>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center text-[var(--muted)] font-medium text-sm">
                    No messages yet.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <Plus size={20} className="text-green-500" /> Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/admin/breeds" className="p-5 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl hover:scale-[1.02] active:scale-[0.99] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-green-500/20">
                    <Database size={20} />
                  </div>
                  <h4 className="font-black mb-0.5">Add Breed Info</h4>
                  <p className="text-xs text-[var(--muted)] font-bold uppercase tracking-wider">Update Global Database</p>
                </Link>
                <Link to="/admin/diseases" className="p-5 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl hover:scale-[1.02] active:scale-[0.99] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white mb-3 shadow-lg shadow-red-500/20">
                    <Activity size={20} />
                  </div>
                  <h4 className="font-black mb-0.5">Add Disease</h4>
                  <p className="text-xs text-[var(--muted)] font-bold uppercase tracking-wider">Medical Database</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Latest Users */}
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black">Latest Users</h3>
                <Link to="/admin/users" className="text-xs font-black text-green-500 uppercase tracking-widest">All</Link>
              </div>
              <div className="space-y-4">
                {users.length > 0 ? users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-black text-xs">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{user.username}</h4>
                        <p className="text-[10px] text-[var(--muted)] font-black uppercase">
                          {user.cattleCount} Cattle
                        </p>
                      </div>
                    </div>
                    <Link to="/admin/users" className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-green-500 hover:border-green-500 transition-all">
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                )) : (
                  <p className="text-sm text-[var(--muted)] font-medium text-center py-4">No users yet</p>
                )}
              </div>
            </div>

            {/* System Stats */}
            <div className={`p-6 rounded-3xl border border-[var(--border)] ${isDark ? 'bg-zinc-900' : 'bg-white shadow-xl'}`}>
              <h3 className="font-black mb-5">System Live Stats</h3>
              <div className="space-y-4">
                <HealthItem 
                  label="Uptime" 
                  status={stats.websiteStats ? `${Math.floor(stats.websiteStats.uptime / 3600)}h ${Math.floor((stats.websiteStats.uptime % 3600) / 60)}m` : '—'} 
                />
                <HealthItem 
                  label="Memory" 
                  status={stats.websiteStats ? `${Math.round(stats.websiteStats.memoryUsage.rss / 1024 / 1024)} MB` : '—'} 
                />
                <HealthItem label="API" status="Operational" />
                <HealthItem label="Database" status="Connected" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, highlight, trend }) {
  const colorMap = {
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10',
    orange: 'bg-orange-500/10'
  };
  return (
    <div className={`bg-[var(--card)] border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all shadow-sm hover:shadow-lg ${highlight ? 'border-orange-500/30' : 'border-[var(--border)]'}`}>
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${colorMap[color] || 'bg-gray-100'} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">
            {trend}
          </span>
        )}
      </div>
      <div className={`text-3xl sm:text-4xl font-black tracking-tight ${highlight ? 'text-orange-500' : ''}`}>{value}</div>
      <p className="text-[10px] sm:text-xs text-[var(--muted)] font-black uppercase tracking-[0.1em] mt-1">{title}</p>
    </div>
  );
}

function HealthItem({ label, status }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-[var(--muted)]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-[var(--text)]">{status}</span>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
    </div>
  );
}

export default AdminDashboard;
