import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { translations } from '../data/translations';
import logo from '../assets/farmlens-logo (1).png'

function ChatbotWidget({ isOpen, onClose, isDark, language }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);
  const widgetRef = useRef(null); // Ref for click-outside detection
  const navigate = useNavigate();
  const { user } = useAuth();
  const t = translations[language];

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  const welcomeCards = [
    { 
      id: 1, 
      icon: 'fa-envelope-open-text', 
      title: language === 'en' ? 'Support' : 'सहायता', 
      prompt: 'How do I contact support or reach the Contact Us page?'
    },
    { 
      id: 2, 
      icon: 'fa-microscope', 
      title: language === 'en' ? 'Condition' : 'स्थिति', 
      prompt: 'What are the symptoms of Foot and Mouth Disease?'
    },
    { 
      id: 3, 
      icon: 'fa-cow', 
      title: language === 'en' ? 'Top Breeds' : 'शीर्ष नस्लें', 
      prompt: 'Which are the best dairy cattle breeds in India?'
    },
    { 
      id: 4, 
      icon: 'fa-gem', 
      title: language === 'en' ? 'Plans' : 'योजनाएं', 
      prompt: 'What is the difference between Free and Pro plans?'
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && widgetRef.current && !widgetRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the AI brain.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content) => {
    // Cleaner that removes AI formatting like backticks or bold symbols
    const cleanedText = content.replace(/[`*]/g, '');
    
    // Regex splits by [[...|...]] OR [...|...]
    const parts = cleanedText.split(/(\[\[?.*?\|.*?\]?\])/g);
    
    return parts.map((part, index) => {
      // Catch [[Text|Path]] or [Text|Path]
      const match = part.match(/^\[{1,2}\s*(.*?)\s*\|\s*(.*?)\s*\]{1,2}$/);
      
      if (match) {
        const text = match[1].trim();
        const path = match[2].trim();
        
        return (
          <Link
            key={index}
            to={path}
            onClick={(e) => {
              if (onClose && window.innerWidth < 1024) onClose();
            }}
            className="inline-flex items-center gap-1 font-black text-[var(--accent)] hover:opacity-70 transition-all underline decoration-[2px] underline-offset-4 cursor-pointer"
          >
            {text}
            <i className="fa-solid fa-arrow-up-right-from-square text-[8px] no-underline"></i>
          </Link>
        );
      }
      
      // Return regular text if no match
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      <style>{`
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; }
        .cubic-bezier-transition { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      {/* Main Container */}
      <div 
        ref={widgetRef}
        className={`fixed bottom-8 right-4 sm:right-8 z-[1000] w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[80vh] bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col cubic-bezier-transition ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
            : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-5 bg-[var(--accent)] text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img src={logo} alt="FarmLens" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight">FarmLens AI</h3>
              <div className="flex items-center gap-1.5 opacity-80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-widest">{t.online || 'Online'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center">
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto chat-scroll flex flex-col gap-4 bg-[var(--surface)]" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-transparent rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-sm overflow-hidden">
                 <img src={logo} alt="FarmLens" className="w-10 h-10 object-contain" />
              </div>
              <h4 className="text-lg font-black mb-6">{language === 'en' ? 'Welcome! Search anything.' : 'नमस्ते! कुछ भी खोजें।'}</h4>
              <div className="grid grid-cols-2 gap-3">
                {welcomeCards.map(card => (
                  <button 
                    key={card.id} 
                    onClick={() => handleSendMessage(card.prompt)}
                    className="p-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-left hover:border-[var(--accent)] transition-all group"
                  >
                    <i className={`fa-solid ${card.icon} text-[var(--accent)] mb-2 text-sm`}></i>
                    <h5 className="font-black text-[10px] uppercase tracking-wider">{card.title}</h5>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl font-medium text-[13px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-[var(--accent)] text-white rounded-tr-none' 
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text)] rounded-tl-none'
                }`}>
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-2xl rounded-tl-none flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Input */}
        <div className="p-5 bg-[var(--card)] border-t border-[var(--border)]">
          {suggestions.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-scroll [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] chat-scroll pb-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSendMessage(s)}
                  className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[9px] font-black hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all whitespace-nowrap shadow-sm"
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
              placeholder={language === 'en' ? 'Ask anything...' : 'कुछ भी पूछें...'}
              className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[13px] font-bold focus:border-[var(--accent)] outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--accent)] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatbotWidget;
