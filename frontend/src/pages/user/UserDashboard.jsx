import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { translations } from '../../data/translations';

function UserDashboard({ isDark, language }) {
  const [cattleList, setCattleList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { username } = useParams();
  const { user, refreshUser } = useAuth();
  const t = translations[language];

  useEffect(() => {
    refreshUser();
    window.scrollTo(0, 0);
  }, []);

  // Predefined Icons for Tasks
  const ICON_SET = [
    { icon: 'fa-wheat-awn', name: 'Feeding' },
    { icon: 'fa-bucket', name: 'Milking' },
    { icon: 'fa-stethoscope', name: 'Health' },
    { icon: 'fa-clipboard-check', name: 'Audit' },
    { icon: 'fa-shower', name: 'Cleaning' },
    { icon: 'fa-vial', name: 'Test' },
    { icon: 'fa-syringe', name: 'Vaccine' },
    { icon: 'fa-droplet', name: 'Water' },
    { icon: 'fa-seedling', name: 'Pasture' },
    { icon: 'fa-truck-field', name: 'Supply' },
    { icon: 'fa-sun', name: 'Morning' },
    { icon: 'fa-moon', name: 'Night' },
    { icon: 'fa-cow', name: 'Cattle' },
    { icon: 'fa-house-chimney', name: 'Barn' },
    { icon: 'fa-file-lines', name: 'Log' },
  ];

  // Daily Herd Schedule State
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [iconPickerIndex, setIconPickerIndex] = useState(null);
  const [timePickerIndex, setTimePickerIndex] = useState(null);
  const [timePickerView, setTimePickerView] = useState('hours'); // 'hours' or 'minutes'
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(' ');
    if (parts.length !== 2) return 0;
    const [time, period] = parts;
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => parseTime(a.time) - parseTime(b.time));
  };

  useEffect(() => {
    if (user && user.username === username) {
      fetchCattle();
      fetchStats();
      fetchTasks();
    } else if (!user) {
      navigate('/login');
    }
  }, [user, username]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_BASE}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(sortTasks(data));
      }
    } catch (error) { console.error('Error fetching tasks:', error); }
  };

  const toggleTask = async (index) => {
    const task = tasks[index];
    const newStatus = !task.completed;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/tasks/${task._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: newStatus })
      });
      if (response.ok) {
        const updatedTask = await response.json();
        const newTasks = [...tasks];
        newTasks[index] = updatedTask;
        setTasks(newTasks);
      }
    } catch (error) { toast.error("Failed to update task"); }
  };

  const updateTask = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    const newTask = { _id: 'temp', time: '12:00 PM', title: '', desc: '', icon: 'fa-calendar-check', completed: false };
    setTasks([...tasks, newTask]);
    setEditingIndex(tasks.length);
  };

  const saveTask = async (index) => {
    const task = tasks[index];
    if (!task.title?.trim() || !task.time?.trim()) {
      toast.error(t.requiredFields || "Title and Time are required!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const isNew = task._id === 'temp';
      const url = isNew ? `${API_BASE}/api/tasks` : `${API_BASE}/api/tasks/${task._id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        const savedTask = await response.json();
        let newTasks = [...tasks];
        newTasks[index] = savedTask;
        setTasks(sortTasks(newTasks));
        setEditingIndex(null);
        toast.success(isNew ? "Task created!" : "Task updated!");
      }
    } catch (error) { toast.error("Failed to save task"); }
  };

  const deleteTask = async (index) => {
    const task = tasks[index];
    if (task._id === 'temp') {
      setTasks(tasks.filter((_, i) => i !== index));
      setEditingIndex(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setTasks(tasks.filter((_, i) => i !== index));
        if (editingIndex === index) setEditingIndex(null);
        toast.success("Task deleted");
      }
    } catch (error) { toast.error("Failed to delete task"); }
  };

  const fetchCattle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const response = await fetch(`${API_BASE}/api/cattle/my-cattle`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setCattleList(Array.isArray(data) ? data : []);
      }
    } catch (error) { toast.error(t.networkError); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_BASE}/api/cattle/stats`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) { }
  };

  const recentCattle = [...cattleList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--muted)] font-black uppercase tracking-widest text-xs animate-pulse">Initializing Farm Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f8faf7]'}`}>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Simple Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
            {t.greeting || 'Hello'}, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)] mt-1">
            {user?.membership || 'Free'}
          </p>
        </div>

        {/* Quick Insights Row - updated to grid-cols-2 for 2*2 on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: t.totalCattle, val: stats.totalCattle || cattleList.length, icon: 'fa-cow', color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: t.activeHealth, val: stats.healthyCount || '---', icon: 'fa-heart-pulse', color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: t.pendingReports, val: stats.pendingCount || '02', icon: 'fa-clipboard-list', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: t.expertStatus, val: 'Active', icon: 'fa-user-doctor', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((s, i) => (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-3xl shadow-lg group hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center text-lg`}>
                  <i className={`fa-solid ${s.icon}`}></i>
                </div>
              </div>
              <div className="text-2xl font-black text-[var(--text)] mb-1">{s.val}</div>
              <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest opacity-60 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Actions Area */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <span className="w-2 h-8 bg-[var(--accent)] rounded-full"></span>
                  {t.quickActions || 'Quick Diagnostics'}
                </h3>
                <button
                  onClick={() => navigate(`/services`)}
                  className="text-xs font-black uppercase tracking-widest text-[var(--accent)] hover:underline"
                >
                  {t.viewAll}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => navigate('/predict')}
                  className="group relative p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-green-700 text-white overflow-hidden shadow-2xl shadow-green-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                  <div className="relative z-10 flex items-center gap-6 text-left">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg">
                      <i className="fa-solid fa-cow"></i>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-1">{t.predictBreed || 'Predict Breed'}</h4>
                      <p className="text-sm font-medium opacity-80 leading-tight hidden md:block">{t.recognizeDesc || 'Instantly identify cattle varieties with AI vision.'}</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/skin-disease')}
                  className="group relative p-8 rounded-[2.5rem] bg-gradient-to-br from-red-500 to-orange-600 text-white overflow-hidden shadow-2xl shadow-red-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                  <div className="relative z-10 flex items-center gap-6 text-left">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg">
                      <i className="fa-solid fa-microscope"></i>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-1">{t.identifySkinDisease || 'Identify Skin Disease'}</h4>
                      <p className="text-sm font-medium opacity-80 leading-tight hidden md:block">{t.skinAnalysisDesc || 'Instantly detect infections from skin photos.'}</p>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => navigate('/services')}
                className="w-full py-6 rounded-[2rem] bg-[var(--surface)] border-2 border-dashed border-[var(--border)] group hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all flex items-center justify-between gap-4"
              >
                <div className="max-sm:hidden ml-5 w-12 h-12 rounded-xl bg-[var(--card)] flex items-center justify-center text-[var(--accent)] shadow-sm group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <div className="text-left max-sm:pl-8">
                  <div className="text-sm font-black uppercase tracking-widest text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{t.exploreAllServices || 'Explore All Services'}</div>
                  <div className="text-[10px] font-bold text-[var(--muted)]">{t.aiServicesRevolutionize}</div>
                </div>
                <i className="fa-solid fa-arrow-right mr-7 text-[var(--muted)] max-sm:mr-3 group-hover:text-[var(--accent)] group-hover:translate-x-2 transition-all"></i>
              </button>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8 gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black">{t.upcomingTasks || 'Daily Herd Schedule'}</h3>
                  <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-[10px] font-black uppercase tracking-widest text-center">{tasks.length} Tasks</span>
                </div>
                <button
                  onClick={addTask}
                  className="px-6 py-2 bg-[var(--accent)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <div className="max-sm:hidden"><i className="fa-solid fa-plus mr-2"></i> {t.addTask || 'Add Task'}</div>
                  <div className="sm:hidden"><i className="fa-solid fa-plus"></i></div>
                </button>
              </div>

              <div className="space-y-6">
                {tasks.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-[var(--border)] rounded-[2.5rem] text-center text-[var(--muted)]">
                    <i className="fa-solid fa-calendar-day text-4xl mb-4 opacity-20"></i>
                    <p className="font-bold uppercase tracking-widest text-xs">No tasks scheduled for today</p>
                  </div>
                ) : (
                  tasks.map((task, i) => (
                    <div key={i} className={`flex gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-[2rem] hover:border-[var(--accent)]/30 transition-all group relative ${task.completed && editingIndex !== i ? 'opacity-50 grayscale' : ''}`}>
                      {/* Left: Icons group */}
                      <div className="flex flex-col items-center gap-3 shrink-0">
                        {/* Completion Check */}
                        <div
                          onClick={() => toggleTask(i)}
                          className={`w-8 h-8 rounded-full border-2 border-[var(--border)] flex items-center justify-center cursor-pointer transition-all shrink-0 ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'hover:border-green-500'}`}
                        >
                          {task.completed && <i className="fa-solid fa-check text-xs"></i>}
                        </div>

                        {/* Icon Picker (only when editing) */}
                        <div className="relative">
                          <div
                            onClick={() => editingIndex === i && setIconPickerIndex(iconPickerIndex === i ? null : i)}
                            className={`w-12 h-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xl text-[var(--accent)] shrink-0 cursor-pointer hover:scale-105 transition-all ${editingIndex !== i ? 'cursor-default' : ''}`}
                          >
                            <i className={`fa-solid ${task.icon}`}></i>
                          </div>
                          {iconPickerIndex === i && editingIndex === i && (
                            <div className="absolute top-full left-0 z-50 mt-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl grid grid-cols-5 gap-2 w-[240px] max-w-[calc(100vw-40px)] animate-in slide-in-from-top-2 duration-200">
                              {ICON_SET.map(ico => (
                                <button
                                  key={ico.icon}
                                  onClick={() => { updateTask(i, 'icon', ico.icon); setIconPickerIndex(null); }}
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${task.icon === ico.icon ? 'bg-[var(--accent)] text-white' : 'hover:bg-[var(--surface)] text-[var(--muted)]'}`}
                                  title={ico.name}
                                >
                                  <i className={`fa-solid ${ico.icon}`}></i>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 space-y-3">
                        {editingIndex === i ? (
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex gap-2">
                              {/* Custom Clock Trigger */}
                              <div className="relative w-1/3">
                                <button
                                  onClick={() => { setTimePickerIndex(timePickerIndex === i ? null : i); setIconPickerIndex(null); }}
                                  className="w-full max-sm:px-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none hover:border-[var(--accent)] font-bold text-sm text-left flex items-center justify-between"
                                >
                                  {task.time || '12:00 PM'}
                                  <div className="max-sm:hidden">
                                    <i className="fa-solid fa-clock opacity-30 text-xs"></i>
                                  </div>
                                </button>

                                {timePickerIndex === i && (
                                  <div className="absolute top-full left-0 z-[60] mt-2 p-4 sm:p-6 bg-[var(--card)] border border-[var(--border)] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-[280px] sm:w-80 max-w-[calc(100vw-40px)] animate-in zoom-in-95 duration-200">
                                    <div className="flex flex-col gap-6">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => setTimePickerView('hours')}
                                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all ${timePickerView === 'hours' ? 'bg-[var(--accent)]/10 text-[var(--accent)] underline' : 'text-[var(--muted)]'}`}
                                          >HH</button>
                                          <button
                                            onClick={() => setTimePickerView('minutes')}
                                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg transition-all ${timePickerView === 'minutes' ? 'bg-[var(--accent)]/10 text-[var(--accent)] underline' : 'text-[var(--muted)]'}`}
                                          >MM</button>
                                        </div>
                                        <div className="flex bg-[var(--surface)] rounded-lg p-1">
                                          {['AM', 'PM'].map(p => (
                                            <button
                                              key={p}
                                              onClick={() => {
                                                const [t, oldP] = (task.time || '12:00 AM').split(' ');
                                                updateTask(i, 'time', `${t || '12:00'} ${p}`);
                                              }}
                                              className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${task.time?.includes(p) ? 'bg-[var(--accent)] text-white' : 'text-[var(--muted)]'}`}
                                            >
                                              {p}
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="relative w-60 h-60 mx-auto bg-[var(--surface)] rounded-full border border-[var(--border)] flex items-center justify-center shadow-inner">
                                        {timePickerView === 'hours' ? (
                                          [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, idx) => {
                                            const angle = (idx * 30) - 90;
                                            const x = Math.cos(angle * (Math.PI / 180)) * 90;
                                            const y = Math.sin(angle * (Math.PI / 180)) * 90;
                                            const isSelected = task.time?.split(':')[0] === String(h);

                                            return (
                                              <button
                                                key={h}
                                                onClick={() => {
                                                  const parts = (task.time || '12:00 AM').split(' ');
                                                  const mins = parts[0]?.split(':')[1] || '00';
                                                  const p = parts[1] || 'AM';
                                                  updateTask(i, 'time', `${h}:${mins} ${p}`);
                                                  setTimePickerView('minutes');
                                                }}
                                                style={{ transform: `translate(${x}px, ${y}px)` }}
                                                className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${isSelected ? 'bg-[var(--accent)] text-white shadow-lg scale-125' : 'hover:bg-[var(--accent)]/20 text-[var(--muted)]'}`}
                                              >
                                                {h}
                                              </button>
                                            );
                                          })
                                        ) : (
                                          [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m, idx) => {
                                            const angle = (idx * 30) - 90;
                                            const x = Math.cos(angle * (Math.PI / 180)) * 90;
                                            const y = Math.sin(angle * (Math.PI / 180)) * 90;
                                            const formattedMin = m < 10 ? `0${m}` : String(m);
                                            const isSelected = task.time?.split(':')[1]?.split(' ')[0] === formattedMin;

                                            return (
                                              <button
                                                key={m}
                                                onClick={() => {
                                                  const parts = (task.time || '12:00 AM').split(' ');
                                                  const hour = parts[0]?.split(':')[0] || '12';
                                                  const p = parts[1] || 'AM';
                                                  updateTask(i, 'time', `${hour}:${formattedMin} ${p}`);
                                                  setTimePickerIndex(null);
                                                  setTimePickerView('hours');
                                                }}
                                                style={{ transform: `translate(${x}px, ${y}px)` }}
                                                className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${isSelected ? 'bg-[var(--accent)] text-white shadow-lg scale-125' : 'hover:bg-[var(--accent)]/20 text-[var(--muted)]'}`}
                                              >
                                                {formattedMin}
                                              </button>
                                            );
                                          })
                                        )}
                                        <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full shadow-lg"></div>
                                      </div>

                                      <div className="text-center">
                                        <p className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">
                                          {timePickerView === 'hours' ? 'Hour' : 'Min'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <input
                                value={task.title}
                                autoFocus
                                onChange={e => updateTask(i, 'title', e.target.value)}
                                placeholder="Task Title"
                                className="w-full sm:flex-1 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] font-bold text-sm"
                              />
                            </div>
                            <textarea
                              value={task.desc}
                              onChange={e => updateTask(i, 'desc', e.target.value)}
                              placeholder="Add details..."
                              rows={1}
                              className="w-full px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] font-medium text-xs resize-none"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-md self-start mb-0.5">
                              {task.time}
                            </span>
                            <h4 className={`font-black text-lg group-hover:text-[var(--accent)] transition-colors ${task.completed ? 'line-through text-[var(--muted)]' : ''}`}>
                              {task.title}
                            </h4>
                            {task.desc && (
                              <p className={`text-sm font-medium line-clamp-2 ${task.completed ? 'text-[var(--muted)]/50' : 'text-[var(--muted)]'}`}>
                                {task.desc}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 self-center">
                        {editingIndex === i ? (
                          <button
                            onClick={() => saveTask(i)}
                            className="w-8 h-8 rounded-xl bg-green-500 text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                          >
                            <i className="fa-solid fa-check text-xs"></i>
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingIndex(i)}
                            className="w-8 h-8 rounded-xl bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-all md:opacity-0 md:group-hover:opacity-100"
                          >
                            <i className="fa-solid fa-pen text-xs"></i>
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(i)}
                          className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / Recent Items */}
          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black">{t.yourCattle || 'My Gallery'}</h3>
                <button
                  onClick={() => navigate(`/${username}/allcattles`)}
                  className="text-xs font-black uppercase tracking-widest text-[var(--accent)] hover:underline"
                >
                  {t.viewAll}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {recentCattle.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => navigate(`/${username}/cattleinfo/${c._id}`)}
                    className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:scale-[1.03] active:scale-95 transition-all cursor-pointer group flex items-center gap-4"
                  >
                    <img src={c.image || '/default-cattle.jpg'} className="w-16 h-16 rounded-xl object-cover shadow-lg" alt={c.name} />
                    <div className="flex-1">
                      <h4 className="font-black truncate group-hover:text-[var(--accent)] transition-colors">{c.name}</h4>
                      <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] opacity-60">{c.breed}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center text-xs text-[var(--muted)]">
                      <i className="fa-solid fa-angle-right"></i>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => navigate(`/${username}/addcattle`)}
                  className="p-6 border-2 border-dashed border-[var(--border)] rounded-[2rem] flex flex-col items-center justify-center gap-3 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all group"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center text-xl group-hover:rotate-90 transition-transform">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">{t.addNewCattle || 'Add Entry'}</span>
                </button>
              </div>
            </section>

            <section className="bg-gradient-to-br from-[var(--card)] to-[var(--surface)] p-8 rounded-[2.5rem] border border-[var(--border)] relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-crown text-yellow-500"></i> {t.upgradePrompt || 'Go Pro!'}
                </h4>
                <p className="text-sm font-medium text-[var(--muted)] leading-relaxed mb-6">
                  {t.upgradeDesc || 'Unlock advanced health analytics and direct veterinary support.'}
                </p>
                <button onClick={() => navigate(`/${username}/membership`)} className="w-full py-4 bg-[var(--text)] text-[var(--bg)] rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:-translate-y-1 transition-all">
                  {t.getPremium || 'Join Membership'}
                </button>
              </div>
              <i className="fa-solid fa-shield-cat absolute -bottom-10 -right-10 text-9xl text-[var(--accent)]/5 -rotate-12"></i>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;