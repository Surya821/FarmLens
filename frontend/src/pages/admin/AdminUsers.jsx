import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Mail, Calendar, Trash2, AlertTriangle, Filter, ArrowUpDown, ChevronUp, ChevronDown, Shield } from 'lucide-react';
import AdminNavbar from './AdminNavbar';

function AdminUsers({ isDark, setIsDark }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt'); // 'username', 'cattleCount', 'serviceUsage', 'createdAt'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter(u => u._id !== id));
        setConfirmDelete(null);
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Network error while deleting user');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredUsers = users
    .filter(u => {
      const matchesSearch = (
        u.username?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase())
      );
      const matchesMembership = membershipFilter === 'All' || u.membership === membershipFilter;
      return matchesSearch && matchesMembership;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'username') {
        valA = valA?.toLowerCase() || '';
        valB = valB?.toLowerCase() || '';
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      <AdminNavbar isDark={isDark} setIsDark={setIsDark} />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className={`w-full max-w-sm sm:max-w-md mx-auto p-6 sm:p-8 rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#111a14] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-center mb-2">Delete User?</h3>
            <p className="text-[var(--muted)] font-medium text-center text-sm sm:text-base mb-8">This action cannot be undone. All associated cattle and data will be permanently removed.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="w-full sm:flex-1 py-3 sm:py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl font-black hover:scale-[1.02] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="w-full sm:flex-1 py-3 sm:py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {deletingId === confirmDelete ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">User Registry</h1>
          <p className="text-[var(--muted)] font-medium text-sm sm:text-base">Detailed overview of system participants · {users.length} total</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-8 border-b border-[var(--border)] space-y-4">
             <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center text-[var(--muted)] group-focus-within:text-green-500 transition-colors">
                    <Search size={20} />
                  </div>
                  <input 
                    type="text"
                    placeholder="Filter by username, email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 sm:pl-16 pr-4 sm:pr-8 py-3.5 sm:py-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl sm:rounded-2xl outline-none focus:border-green-500 transition-all font-bold text-sm"
                  />
                </div>

                {/* Membership Filter */}
                <div className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl sm:rounded-2xl px-4 py-2 overflow-x-auto no-scrollbar">
                   <Filter size={16} className="text-[var(--muted)] shrink-0" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] whitespace-nowrap">Plan:</span>
                   <div className="flex gap-1">
                      {['All', 'Free', 'Pro', 'Enterprise'].map((plan) => (
                        <button
                          key={plan}
                          onClick={() => setMembershipFilter(plan)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${membershipFilter === plan ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-[var(--muted)] hover:bg-[var(--accent)]/5 hover:text-[var(--accent)]'}`}
                        >
                          {plan}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-4 py-2 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] whitespace-nowrap">Sort By:</span>
                {[
                  { field: 'username', label: 'Identity' },
                  { field: 'cattleCount', label: 'Livestock' },
                  { field: 'serviceUsage', label: 'Usage' },
                  { field: 'createdAt', label: 'Join Date' }
                ].map((s) => (
                  <button
                    key={s.field}
                    onClick={() => toggleSort(s.field)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl whitespace-nowrap transition-all ${sortBy === s.field ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)] shadow-sm' : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]'}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                    {sortBy === s.field ? (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : <ArrowUpDown size={12} className="opacity-30" />}
                  </button>
                ))}
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[var(--surface)] text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-6 sm:px-10 py-4 sm:py-6">User Identity</th>
                  <th className="px-6 sm:px-10 py-4 sm:py-6">Plan Info</th>
                  <th className="px-6 sm:px-10 py-4 sm:py-6 text-center">Livestock (Cattle)</th>
                  <th className="px-6 sm:px-10 py-4 sm:py-6 text-center">Srv. Usage</th>
                  <th className="px-6 sm:px-10 py-4 sm:py-6">Joined Date</th>
                  <th className="px-6 sm:px-10 py-4 sm:py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[var(--surface)] transition-colors group">
                    <td className="px-6 sm:px-10 py-6 sm:py-8">
                       <div className="flex items-center gap-3 sm:gap-4">
                         <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg">
                           {user.username?.[0]?.toUpperCase()}
                         </div>
                         <div>
                           <div className="font-black text-lg sm:text-xl mb-0.5 sm:mb-1">{user.username}</div>
                           <div className="text-xs sm:text-sm font-bold text-[var(--muted)] flex items-center gap-1.5 sm:gap-2">
                             <Mail size={14} /> {user.email}
                           </div>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8">
                      <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${user.membership === 'Enterprise' ? 'bg-purple-500/10 text-purple-500' : user.membership === 'Pro' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.membership === 'Enterprise' ? 'bg-purple-500' : user.membership === 'Pro' ? 'bg-blue-500' : 'bg-green-500'}`}></div> {user.membership}
                      </div>
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8 text-center text-2xl sm:text-4xl font-black tabular-nums text-[var(--text)]">
                       {user.cattleCount}
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8 text-center">
                       <div className="text-xl sm:text-2xl font-black text-green-500 tabular-nums">{user.serviceUsage}</div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] whitespace-nowrap">Consultations</div>
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8">
                       <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-[var(--muted)] whitespace-nowrap">
                         <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-6 sm:px-10 py-6 sm:py-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => setConfirmDelete(user._id)}
                           className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                           title="Delete User"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="py-16 sm:py-24 text-center px-4">
              <Users className="mx-auto mb-4 sm:mb-6 text-[var(--muted)]" size={48} />
              <h3 className="text-xl sm:text-2xl font-black">No matching users</h3>
              <p className="text-[var(--muted)] font-medium text-sm sm:text-base">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
