import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { translations } from '../../data/translations';
import { AlertTriangle } from 'lucide-react';

function AllCattlePage({ isDark, language }) {
    const [cattleList, setCattleList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const navigate = useNavigate();
    const { username } = useParams();
    const { user } = useAuth();
    const t = translations[language];
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        if (user && user.username === username) {
            fetchCattle();
        } else if (!user) {
            navigate('/login');
        }
        window.scrollTo(0, 0);
    }, [user, username]);

    const fetchCattle = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            const response = await fetch(`${API_BASE}/api/cattle/my-cattle`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                setCattleList(Array.isArray(data) ? data : []);
            }
        } catch (error) { toast.error(t.fetchFailed); }
        finally { setLoading(false); }
    };

    const deleteCattle = async (id) => {
        setDeletingId(id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/cattle/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success(t.deleteSuccess);
                setConfirmDelete(null);
                fetchCattle();
            }
        } catch (error) { toast.error(t.deleteFailed); }
        finally { setDeletingId(null); }
    };

    const filteredAndSortedCattle = cattleList
        .filter(cattle =>
            cattle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cattle.breed?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[var(--muted)] font-black uppercase tracking-widest text-xs">{t.loadingCattle || 'Loading Herd...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f8faf7]'}`}>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.25rem;
        }
      `}</style>

            <div className="max-w-7xl mx-auto px-6 pt-8">
                {/* Delete Confirmation Modal */}
                {confirmDelete && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
                        <div className={`w-full max-w-sm sm:max-w-md mx-auto p-6 sm:p-8 rounded-[2.5rem] border shadow-2xl ${isDark ? 'bg-[#111a14] border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-center mb-2 text-[var(--text)]">{language === 'en' ? 'Delete Cattle?' : 'मवेशी हटाएं?'}</h3>
                            <p className="text-[var(--muted)] font-medium text-center text-sm sm:text-base mb-8">{t.deleteConfirm}</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="w-full sm:flex-1 py-3 sm:py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl font-black hover:scale-[1.02] transition-all text-[var(--text)]"
                                >
                                    {language === 'en' ? 'Cancel' : 'रद्द करें'}
                                </button>
                                <button
                                    onClick={() => deleteCattle(confirmDelete)}
                                    disabled={deletingId === confirmDelete}
                                    className="w-full sm:flex-1 py-3 sm:py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {deletingId === confirmDelete ? (language === 'en' ? 'Deleting...' : 'हटाया जा रहा है...') : (language === 'en' ? 'Delete' : 'हटाएं')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Navigation / Header */}
                <div className="flex items-center justify-between mb-8 animate-fade-in group">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
                            <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
                        </div>
                        <span className="text-sm uppercase tracking-widest">{t.back || 'Back'}</span>
                    </button>
                    <div className="text-[var(--accent)] font-black text-[10px] uppercase tracking-widest bg-[var(--accent)]/10 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 shadow-sm shadow-green-500/5">
                        <i className="fa-solid fa-cow mr-2"></i> {t.yourCattleCollection || 'Livestock Inventory'}
                    </div>
                </div>

                {/* Hero Section */}
                <div className="text-center mb-10 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
                        {t.cattleCollection}
                    </h1>
                    <p className="text-[var(--muted)] font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                        {t.managingTotal} <span className="text-[var(--accent)] font-black">{cattleList.length}</span> {t.totalCattleLabel}
                    </p>

                    {/* Compact Add Cattle Button - Moved Higher */}
                    <div className="mt-8 flex justify-center">
                      <button
                          onClick={() => navigate(`/${username}/addcattle`)}
                          className="px-6 py-3 bg-[var(--accent)] text-white rounded-2xl hover:scale-105 active:scale-95 transition-all font-black shadow-lg shadow-green-500/20 flex items-center gap-2 text-sm border-b-4 border-green-700 active:border-b-0"
                      >
                          <i className="fa-solid fa-plus text-xs"></i>
                          {t.addCattle}
                      </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="p-3 sm:p-4 rounded-[1.8rem] sm:rounded-[2.5rem] mb-12 flex flex-col lg:flex-row gap-4 sm:gap-6 shadow-2xl bg-[var(--card)] border border-[var(--border)] animate-fade-in delay-1">
                    <div className="relative flex-1 group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-[var(--muted)] opacity-50 text-lg sm:text-xl transition-colors group-focus-within:text-[var(--accent)]"></i>
                        <input
                            type="text"
                            placeholder={t.searchPlaceholderCattle || "Search by name or breed..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-13 sm:pl-16 pr-6 py-3.5 sm:py-4 rounded-2xl transition-all bg-[var(--surface)] border-2 border-transparent focus:border-[var(--accent)] text-[var(--text)] font-bold text-base sm:text-lg outline-none placeholder:text-[var(--muted)]/30 shadow-inner"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group flex-1 sm:flex-initial">
                            <i className="fa-solid fa-arrow-down-wide-short absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-[var(--muted)] opacity-50 z-10 text-sm sm:text-base"></i>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full sm:w-auto pl-13 sm:pl-16 pr-10 sm:pr-12 py-3.5 sm:py-4 rounded-2xl border-2 border-transparent transition-all bg-[var(--surface)] text-[var(--text)] font-black text-xs sm:text-sm cursor-pointer outline-none hover:border-[var(--accent)] shadow-inner appearance-none"
                            >
                                <option value="name">{t.name || 'Sort by Name'}</option>
                                <option value="date">{t.dateAdded || 'Latest Added'}</option>
                            </select>
                        </div>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-3.5 sm:py-4 rounded-2xl bg-red-500/10 text-red-500 font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                            >
                                {language === 'en' ? 'Clear' : 'साफ करें'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Grid */}
                {filteredAndSortedCattle.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in delay-2">
                        {filteredAndSortedCattle.map((cattle, index) => (
                            <div
                                key={cattle._id}
                                className="group relative rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 shadow-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/30 flex flex-col"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={cattle.image || '/default-cattle.jpg'}
                                        alt={cattle.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                    {/* Status Badge */}
                                    <div className="absolute top-6 left-6">
                                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/20 ${cattle.healthStatus === 'Excellent' ? 'bg-green-500/80 text-white' :
                                                cattle.healthStatus === 'Good' ? 'bg-blue-500/80 text-white' :
                                                    cattle.healthStatus === 'Fair' ? 'bg-yellow-500/80 text-white' :
                                                        'bg-red-500/80 text-white'
                                            }`}>
                                            {cattle.healthStatus || 'Good'}
                                        </span>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(cattle._id); }}
                                        className="absolute top-6 right-6 w-10 h-10 bg-red-500 text-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 active:scale-90"
                                    >
                                        <i className="fa-solid fa-trash-can text-sm"></i>
                                    </button>

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-2xl font-black text-white tracking-tight mb-1 group-hover:text-[var(--accent)] transition-colors">
                                            {cattle.name}
                                        </h3>
                                        <p className="text-white/70 text-sm font-medium">
                                            ID: {cattle.cattleId}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6 flex-1 flex flex-col">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)] text-center">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">{t.breed}</div>
                                            <div className="text-sm font-black text-[var(--text)] truncate">{cattle.breed}</div>
                                        </div>
                                        <div className="bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)] text-center">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">{t.age}</div>
                                            <div className="text-sm font-black text-[var(--text)]">{cattle.age} {t.years}</div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-2 px-1">Current Health Records</div>
                                        <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${cattle.disease && cattle.disease !== 'None'
                                                ? 'bg-red-500/5 border-red-500/20 text-red-500'
                                                : 'bg-green-500/5 border-green-500/20 text-green-500'
                                            }`}>
                                            <i className={`fa-solid ${cattle.disease && cattle.disease !== 'None' ? 'fa-triangle-exclamation' : 'fa-circle-check'}`}></i>
                                            <span className="text-xs font-black uppercase tracking-tight truncate">
                                                {cattle.disease && cattle.disease !== 'None' ? cattle.disease : (language === 'en' ? 'Normal Condition' : 'सामान्य स्थिति')}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/${username}/cattleinfo/${cattle._id}`)}
                                        className="w-full py-4 bg-[var(--text)] text-[var(--bg)] rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        {t.viewDetails}
                                        <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover/btn:translate-x-2"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center animate-fade-in delay-2">
                        <div className="w-32 h-32 bg-[var(--card)] border-2 border-dashed border-[var(--border)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner group">
                            <i className="fa-solid fa-cow text-5xl text-[var(--muted)] opacity-20 group-hover:rotate-12 transition-transform"></i>
                        </div>
                        <h3 className="text-3xl font-black text-[var(--text)] mb-3 tracking-tight">
                            {t.noCattleFound || 'Your herd list is empty'}
                        </h3>
                        <p className="text-[var(--muted)] font-medium text-lg mb-12 max-w-md mx-auto">
                            {t.noCattleMatches || 'Ready to start tracking your cattle collection with AI? Add your first registration now.'}
                        </p>
                        <button
                            onClick={() => navigate(`/${username}/addcattle`)}
                            className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto border-b-4 border-green-700 active:border-b-0"
                        >
                            <i className="fa-solid fa-plus-circle"></i>
                            {t.addCattle}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllCattlePage;
