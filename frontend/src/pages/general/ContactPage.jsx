import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, ArrowRight, MessageCircle, Github, Twitter, Linkedin, Globe, MapPin, Phone, Clock } from 'lucide-react';

function ContactPage({ isDark, language }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, content }),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setEmail('');
          setContent('');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`min-h-screen pb-20 px-4 sm:pt-12 ${isDark ? 'bg-[#0a0f0d]' : 'bg-[#f0faf5]'}`}>
      <div className="max-w-6xl mx-auto">
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

        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-24 animate-fade-in">
          <div className="hero-badge mb-6 inline-flex mx-auto">
            <Mail size={14} className="mr-2" />
            {language === 'en' ? 'Get In Touch' : 'संपर्क करें'}
          </div>
          <h1 className="text-4xl sm:text-7xl font-black mb-6 bg-gradient-to-r from-[var(--accent)] to-green-400 bg-clip-text text-transparent leading-tight">
            {language === 'en' ? "Let's Start a Conversation" : 'आइये बातचीत शुरू करें'}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'Have questions about FarmLens? We are here to help you grow your farm with AI-driven insights.' 
              : 'क्या आपके पास FarmLens के बारे में प्रश्न हैं? हम AI-आधारित अंतर्दृष्टि के साथ आपके खेत को विकसित करने में मदद करने के लिए यहां हैं।'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black mb-8">{language === 'en' ? 'Contact Information' : 'संपर्क जानकारी'}</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6 group cursor-pointer p-4 rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all shadow-lg shadow-green-500/10">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-1">Email Us</p>
                    <p className="text-xl font-bold">support@farmlens.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer p-4 rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg shadow-blue-500/10">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-1">Our Office</p>
                    <p className="text-xl font-bold">Digital Valley, Agriculture Hub</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer p-4 rounded-3xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-lg shadow-purple-500/10">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-1">Call Us</p>
                    <p className="text-xl font-bold">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 pt-10 border-t border-[var(--border)]">
              <h3 className="text-xl font-black mb-6">{language === 'en' ? 'Follow Our Journey' : 'हमारी यात्रा का अनुसरण करें'}</h3>
              <div className="flex gap-4">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-green-400 rounded-[3rem] blur-2xl opacity-10"></div>
            <div className="relative bg-[var(--card)] border border-[var(--border)] p-8 sm:p-12 rounded-[3rem] shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-green-500/10 transition-all"></div>
              
              {success ? (
                <div className="py-20 text-center animate-zoom-in">
                  <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12">
                    <Send size={40} />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Message Sent!</h3>
                  <p className="text-[var(--muted)] font-medium text-lg leading-relaxed">
                    Thank you for reaching out. Our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-8 relative z-10">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] ml-1">Email Address</label>
                    <div className="relative group/input">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within/input:text-[var(--accent)] transition-colors">
                        <Mail size={20} />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-16 pr-8 py-5 bg-[var(--surface)] border border-[var(--border)] rounded-[1.5rem] focus:border-[var(--accent)] outline-none transition-all font-bold text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] ml-1">Your Message</label>
                    <textarea 
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="How can we help you grow?"
                      className="w-full h-48 px-8 py-6 bg-[var(--surface)] border border-[var(--border)] rounded-[1.5rem] focus:border-[var(--accent)] outline-none transition-all font-bold resize-none text-base"
                    ></textarea>
                  </div>

                  <button 
                    disabled={sending}
                    type="submit"
                    className="w-full py-6 bg-[var(--accent)] text-white font-black rounded-[1.5rem] shadow-2xl shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group/btn"
                  >
                    {sending ? (
                      <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-lg">Send Message</span>
                        <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-zoom-in {
          animation: zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default ContactPage;
