import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle, Trash2, Search, AlertTriangle } from 'lucide-react';
import AdminNavbar from './AdminNavbar';

function AdminMessages({ isDark, setIsDark, language }) {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin');
      return;
    }
    fetchMessages();
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/messages`);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/messages/${id}/read`, { 
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed');
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.error('Failed to mark read:', error);
      alert('Failed to mark message as read. Make sure backend is running.');
    }
  };

  const markAllAsRead = async () => {
    if (bulkLoading) return;
    setBulkLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/messages/read-all`, { method: 'POST' });
      if (res.ok) {
        setMessages(prev => prev.map(m => ({ ...m, status: 'read' })));
      }
    } catch (error) {
      console.error('Bulk read error:', error);
    } finally {
      setBulkLoading(false);
    }
  };

  const deleteReadMessages = async () => {
    if (bulkLoading) return;
    setBulkLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/messages/delete-read`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.status !== 'read'));
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
    } finally {
      setBulkLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/messages/${id}`, { 
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed');
      setMessages(prev => prev.filter(m => m._id !== id));
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message. Make sure backend is running.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMessages = messages.filter(m =>
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.content?.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const readCount = messages.filter(m => m.status === 'read').length;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      <AdminNavbar isDark={isDark} setIsDark={setIsDark} />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className={`w-full max-w-md mx-4 p-8 rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#111a14] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-center mb-2">Delete Message?</h3>
            <p className="text-[var(--muted)] font-medium text-center mb-8">This action cannot be undone. The message will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl font-black hover:scale-[1.02] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMessage(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {deletingId === confirmDelete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-2 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1 sm:mb-2">User Messages</h1>
            <p className="text-[var(--muted)] font-medium text-sm sm:text-base">
              {unreadCount > 0
                ? <span className="text-green-500 font-black">{unreadCount} unread</span>
                : 'All caught up'} · {messages.length} total
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              disabled={bulkLoading || unreadCount === 0}
              className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
            >
              Mark All Read
            </button>
            <button
              onClick={deleteReadMessages}
              disabled={bulkLoading || readCount === 0}
              className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
            >
              Delete Read
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 sm:mb-8 group">
          <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center text-[var(--muted)] group-focus-within:text-green-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by email or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-[var(--card)] border-2 border-[var(--border)] rounded-[2rem] outline-none focus:border-green-500 transition-all font-bold shadow-xl shadow-green-500/5"
          />
        </div>

        {/* Messages */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-5">
            {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`p-5 sm:p-8 bg-[var(--card)] border-2 rounded-2xl sm:rounded-[2.5rem] transition-all ${
                  msg.status === 'unread'
                    ? 'border-green-500/30 shadow-lg shadow-green-500/5'
                    : 'border-[var(--border)]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
                  <div className="flex gap-4 sm:gap-5 flex-1">
                    {/* Avatar */}
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center text-lg sm:text-xl font-black ${
                      msg.status === 'unread'
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/20'
                        : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]'
                    }`}>
                      {msg.email?.[0]?.toUpperCase() || '?'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-lg truncate">{msg.email}</h4>
                        {msg.status === 'unread' && (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider rounded-md border border-red-500/20">
                            Unread
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <p className="text-[14px] leading-relaxed font-bold text-[var(--text)] whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-[var(--muted)] uppercase tracking-widest opacity-60">
                         <Clock size={12} /> {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-14 sm:ml-0 md:flex-col lg:flex-row">
                    {msg.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(msg._id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-green-500 text-white text-xs sm:text-sm font-black rounded-xl sm:rounded-2xl shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
                      >
                        <CheckCircle size={16} /> Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDelete(msg._id)}
                      className="p-2.5 sm:p-3 bg-red-500/10 text-red-500 rounded-xl sm:rounded-2xl hover:bg-red-500 hover:text-white hover:scale-105 active:scale-95 transition-all"
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-24 text-center">
                <div className="w-24 h-24 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  📭
                </div>
                <h3 className="text-2xl font-black mb-2">No Messages Found</h3>
                <p className="text-[var(--muted)] font-medium">When users send messages, they will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;
