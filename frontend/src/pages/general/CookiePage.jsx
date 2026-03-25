import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';

function CookiePage({ isDark, language }) {
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen pb-20 pt-10 transition-colors duration-300 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f9faf8]'}`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
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

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
              {language === 'en' ? 'Cookie Policy' : 'कुकी नीति'}
            </h1>

            <div className="space-y-8 text-[var(--muted)] font-medium leading-relaxed">
              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? 'What are Cookies?' : 'कुकीज़ क्या हैं?'}</h2>
                <p>
                  {language === 'en' 
                    ? 'Cookies are small text files stored on your device that help us provide a better user experience by remembering your preferences and login status.'
                    : 'कुकीज़ आपके डिवाइस पर संग्रहीत छोटी टेक्स्ट फाइलें हैं जो आपकी प्राथमिकताओं और लॉगिन स्थिति को याद रखकर बेहतर उपयोगकर्ता अनुभव प्रदान करने में हमारी सहायता करती हैं।'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? 'How We Use Them' : 'हम उनका उपयोग कैसे करते हैं'}</h2>
                <p>
                  {language === 'en'
                    ? 'We use essential cookies for core functionality, such as security and account management. We also use analytical cookies to understand how users interact with our site.'
                    : 'हम कोर कार्यक्षमता, जैसे सुरक्षा और खाता प्रबंधन के लिए आवश्यक कुकीज़ का उपयोग करते हैं। हम यह समझने के लिए विश्लेषणात्मक कुकीज़ का भी उपयोग करते हैं कि उपयोगकर्ता हमारी साइट के साथ कैसे इंटरैक्ट करते हैं।'}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-black text-[var(--text)] mb-4">{language === 'en' ? 'Managing Cookies' : 'कुकीज़ का प्रबंधन'}</h2>
                <p>
                  {language === 'en'
                    ? 'Most web browsers allow you to control cookies through their settings. However, disabling certain cookies may affect the performance and features of our platform.'
                    : 'अधिकांश वेब ब्राउज़र आपको उनकी सेटिंग्स के माध्यम से कुकीज़ को नियंत्रित करने की अनुमति देते हैं। हालांकि, कुछ कुकीज़ को अक्षम करने से हमारे प्लेटफॉर्म के प्रदर्शन और सुविधाओं पर असर पड़ सकता है।'}
                </p>
              </section>

              <section className="pt-8 border-t border-[var(--border)]">
                <p className="text-xs">
                  {language === 'en' 
                    ? 'By using FarmLens, you consent to our use of cookies as described in this policy.'
                    : 'FarmLens का उपयोग करके, आप इस नीति में वर्णित कुकीज़ के हमारे उपयोग के लिए सहमति देते हैं।'}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookiePage;
