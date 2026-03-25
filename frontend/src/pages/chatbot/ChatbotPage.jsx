import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../data/translations';

function ChatbotPage({ isDark, language }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]); // This will serve as history until refresh
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const t = translations[language];

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  const welcomeCards = [
    { 
      id: 1, 
      icon: 'fa-user-doctor', 
      title: language === 'en' ? 'Customer Care' : 'ग्राहक सेवा', 
      desc: language === 'en' ? 'Get help with your cattle and FarmLens tools.' : 'अपने मवेशियों और फार्मलेंस टूल के लिए सहायता प्राप्त करें।',
      prompt: 'How do I use the disease prediction tool?'
    },
    { 
      id: 2, 
      icon: 'fa-shield-virus', 
      title: language === 'en' ? 'Diagnostics' : 'निदान', 
      desc: language === 'en' ? 'Ask about common cattle diseases and cures.' : 'सामान्य मवेशी रोगों और उपचारों के बारे में पूछें।',
      prompt: 'What are the signs of Lumpy Skin Disease?'
    },
    { 
      id: 3, 
      icon: 'fa-cow', 
      title: language === 'en' ? 'Breed Info' : 'नस्ल की जानकारी', 
      desc: language === 'en' ? 'Learn about different Indian and exotic breeds.' : 'विभिन्न भारतीय और विदेशी नस्लों के बारे में जानें।',
      prompt: 'Tell me about the Gir cattle breed.'
    },
    { 
      id: 4, 
      icon: 'fa-crown', 
      title: language === 'en' ? 'Membership' : 'सदस्यता', 
      desc: language === 'en' ? 'Understand our Pro and Enterprise plans.' : 'हमारे प्रो और एंटरप्राइज प्लान को समझें।',
      prompt: 'What benefits do I get with Enterprise plan?'
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text) => {
    const userMessage = text || input;
    if (!userMessage.trim()) return;

    const newMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch(`${API_BASE}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: history
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        const botMessage = { role: 'assistant', content: data.message };
        setMessages(prev => [...prev, botMessage]);
        setSuggestions(data.suggestions || []);
        setHistory(prev => [...prev, newMessage, botMessage]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the AI brain. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 transition-colors duration-300 ${isDark ? 'dark bg-[#0a120e]' : 'bg-[#fcfdfc]'}`}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; opacity: 0.2; }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-in">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--accent)] flex items-center gap-3">
              <i className="fa-solid fa-robot"></i> FarmLens AI
            </h1>
            <p className="text-xs font-bold text-[var(--muted)] opacity-60 uppercase tracking-[0.2em] mt-1">Specialized Cattle Assistant</p>
          </div>
          <button onClick={() => navigate(-1)} className="hidden sm:flex w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] items-center justify-center hover:border-[var(--accent)] transition-all">
            <i className="fa-solid fa-arrow-left text-xs"></i>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto chat-scroll flex flex-col gap-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-[var(--accent)] text-3xl">
                   🐾
                </div>
                <h2 className="text-2xl font-black mb-4">{language === 'en' ? 'Namaste! How can I help you today?' : 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?'}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mt-10">
                  {welcomeCards.map(card => (
                    <button 
                      key={card.id} 
                      onClick={() => handleSendMessage(card.prompt)}
                      className="p-5 rounded-[2rem] bg-[var(--surface)] border border-[var(--border)] text-left hover:border-[var(--accent)] hover:shadow-xl transition-all group"
                    >
                      <i className={`fa-solid ${card.icon} text-[var(--accent)] mb-3 text-xl`}></i>
                      <h3 className="font-black text-sm mb-1">{card.title}</h3>
                      <p className="text-[10px] font-medium text-[var(--muted)] leading-relaxed">{card.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl font-medium text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-[var(--accent)] text-white rounded-tr-none' 
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-none flex gap-2">
                  <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[var(--surface)] border-t border-[var(--border)]">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 animate-slide-in">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSendMessage(s)}
                    className="px-4 py-2 bg-white/5 dark:bg-white/5 border border-[var(--border)] rounded-full text-[10px] font-black hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="relative"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'en' ? 'Ask anything about cattle or FarmLens...' : 'मवेशियों या फार्मलेंस के बारे में कुछ भी पूछें...'}
                className="w-full pl-6 pr-16 py-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-sm font-bold focus:border-[var(--accent)] outline-none transition-all shadow-inner"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--accent)] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                <i className="fa-solid fa-paper-plane-top"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;
