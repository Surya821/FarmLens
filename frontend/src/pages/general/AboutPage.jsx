import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { Target, Cpu, Users, ShieldCheck, Mail, Phone, MapPin, ArrowRight, X, Send } from 'lucide-react';

function AboutPage({ isDark, language }) {
  const navigate = useNavigate();
  const t = translations[language];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const reasons = [
    { title: t.reason1Title, desc: t.reason1Desc, icon: <Cpu className="text-green-500" size={24} /> },
    { title: t.reason2Title, desc: t.reason2Desc, icon: <Target className="text-blue-500" size={24} /> },
    { title: t.reason3Title, desc: t.reason3Desc, icon: <ShieldCheck className="text-purple-500" size={24} /> },
  ];

  const team = [
    { name: "Surya", role: "Full Stack Developer", initial: "SS" },
    { name: "Garv", role: "Chief Veterinarian", initial: "GS" },
    { name: "Dev", role: "Product Designer", initial: "DS" },
    { name: "Pankaj", role: "AI Research Lead", initial: "PS" },
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, content }),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
          setEmail('');
          setContent('');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pb-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
            <i className="fa-solid fa-arrow-left text-xs"></i>
          </div>
          <span className="text-sm uppercase tracking-widest">{language === 'en' ? 'Back' : 'पीछे'}</span>
        </button>

        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="hero-badge mb-6">
            <Target size={14} className="mr-2" />
            {t.aboutTitle}
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[var(--accent)] to-green-400 bg-clip-text text-transparent leading-tight">
            {t.aboutSubtitle}
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed">
            {t.missionDesc}
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Target size={24} />
              </div>
              <h2 className="text-3xl font-black">{t.ourMission}</h2>
            </div>
            <p className="text-[var(--muted)] text-lg font-medium leading-relaxed">
              {t.missionVisionDesc}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Cpu size={24} />
              </div>
              <h2 className="text-3xl font-black">{t.ourTech}</h2>
            </div>
            <p className="text-[var(--muted)] text-lg font-medium leading-relaxed">
              {t.techDesc}
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[var(--accent)] to-green-600 opacity-10 blur-3xl absolute inset-0 -z-10 animate-pulse"></div>
            <div className="bg-[var(--card)] border border-[var(--border)] p-10 rounded-3xl shadow-2xl space-y-8 transform hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-4xl text-white shadow-lg">
                  🐄
                </div>
                <div>
                  <h4 className="text-2xl font-bold">58+ Breeds</h4>
                  <p className="text-[var(--muted)] font-medium">Globally Verified</p>
                </div>
              </div>
              <div className="h-[1px] bg-[var(--border)] w-full"></div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-black text-[var(--accent)] mb-1">98%</div>
                  <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-blue-500 mb-1">93+</div>
                  <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Symptom Nodes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">{t.whyChooseUs}</h2>
            <div className="w-24 h-1.5 bg-[var(--accent)] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 group shadow-lg hover:shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
                <p className="text-[var(--muted)] font-medium leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <Users className="text-[var(--accent)] mx-auto mb-4" size={40} />
            <h2 className="text-4xl font-black mb-4">{t.meetTeam}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-2xl font-black text-white shadow-xl group-hover:rotate-6 transition-transform">
                  {member.initial}
                </div>
                <h4 className="font-bold text-lg">{member.name}</h4>
                <p className="text-sm text-[var(--muted)] font-medium uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-5 blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-5 blur-[100px] -ml-32 -mb-32"></div>
          
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <h2 className="text-4xl font-black">{t.contactUs}</h2>
            <p className="text-[var(--muted)] text-lg font-medium">{t.contactDesc}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                  <Mail size={24} />
                </div>
                <span className="font-bold">Email</span>
                <span className="text-sm text-[var(--muted)]">farmlens@example.com</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
                  <Phone size={24} />
                </div>
                <span className="font-bold">Phone</span>
                <span className="text-sm text-[var(--muted)]">+91 98765 43210</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-2">
                  <MapPin size={24} />
                </div>
                <span className="font-bold">Office</span>
                <span className="text-sm text-[var(--muted)]">Innovation Hub, NDRI</span>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 bg-[var(--accent)] text-white font-bold rounded-2xl shadow-lg hover:scale-[1.05] transition-all flex items-center mx-auto group"
            >
              Send Message <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Box */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-[var(--card)] border border-[var(--border)] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black">Direct Message</h3>
                  <p className="text-[var(--muted)] font-medium">Send a message to our admin team</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:rotate-90 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>

              {success ? (
                <div className="py-12 text-center animate-bounce">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                  </div>
                  <h4 className="text-2xl font-bold">{t.messageSent}</h4>
                  <p className="text-[var(--muted)]">{t.weWillGetBackToYouSoon}</p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-5 py-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none transition-all font-bold text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-2">Message</label>
                    <textarea 
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full h-32 px-5 py-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none transition-all font-bold resize-none text-sm"
                    ></textarea>
                  </div>
                  <button 
                    disabled={sending}
                    type="submit"
                    className="w-full py-5 bg-[var(--accent)] text-white font-black rounded-2xl shadow-xl hover:shadow-green-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {sending ? 'Sending...' : (
                      <>
                        Send Message <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-zoom-in {
          animation: zoomIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AboutPage;
