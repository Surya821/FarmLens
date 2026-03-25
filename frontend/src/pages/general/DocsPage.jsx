import React, { useState } from 'react';
import {
  Book,
  Terminal,
  Cpu,
  ShieldCheck,
  HelpCircle,
  Rocket,
  Layers,
  ChevronRight,
  Copy,
  CheckCircle,
  ArrowRight,
  Database,
  Cloud,
  Zap,
  Globe,
  Microscope,
  Stethoscope,
  Camera,
  X,
  Send
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { translations } from '../../data/translations';

const DocsPage = ({ isDark, language }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState('user'); // 'user', 'services', 'api'

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['user', 'services', 'api'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
        body: JSON.stringify({ email, content: message }),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
          setEmail('');
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === id
          ? 'bg-[var(--accent)] text-white shadow-lg shadow-green-500/20'
          : 'text-[var(--muted)] hover:bg-[var(--accent)]/5 hover:text-[var(--accent)]'
        }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {activeTab === id && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  return (
    <div className={`min-h-screen pt-12 pb-16 px-4 md:px-8 ${isDark ? 'dark bg-[#0f1714]' : 'bg-[#f8faf7]'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-8 hidden sm:flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] font-bold transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
              <i className="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
            </div>
            <span className="text-sm uppercase tracking-widest">{t.back || 'Back'}</span>
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] sm:text-xs font-black uppercase tracking-widest">
            <Book size={14} />
            {t.knowledgeBase}
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-16 animate-fade-in">
          
          <h1 className="text-5xl md:text-7xl font-black text-[var(--text)] tracking-tight mb-6">
            {t.everythingYouNeed} <br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-emerald-500 bg-clip-text text-transparent">{t.toMasterFarmLens}</span>
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto font-medium">
            {t.stepByStepGuides}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Side Navigation */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <NavItem id="user" icon={Rocket} label={t.userJourney} />
            <NavItem id="services" icon={Cpu} label={t.coreServices} />
            <NavItem id="api" icon={Terminal} label={t.developerApi} />
            <div className="mt-8 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
              <h4 className="font-black text-sm mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-[var(--accent)]" />
                {t.needHelp}
              </h4>
              <p className="text-xs text-[var(--muted)] font-medium leading-relaxed mb-4">
                {t.cantFindWhatYoureLookingFor}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-black text-[var(--accent)] hover:underline uppercase tracking-widest">
                {t.contactSupport}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-8 md:p-12 shadow-2xl min-h-[600px] animate-fade-up">

              {/* User Journey Tab */}
              {activeTab === 'user' && (
                <div className="space-y-12 animate-fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-black flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-base">1</div>
                        {t.quickStartGuide}
                      </h2>
                      {/* <button 
                        onClick={() => setActiveTab('api')}
                        className="px-5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-black text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm flex items-center gap-2 group"
                      >
                        {t.apiDocumentation} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button> */}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
                        <h4 className="font-extrabold text-lg mb-2">{t.createAnAccount}</h4>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">{t.signUpWithEmail}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                        <h4 className="font-extrabold text-lg mb-2">{t.setupYourProfile}</h4>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">{t.addYourFarmName}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-base">2</div>
                      {t.inventoryManagement}
                    </h2>
                    <div className="space-y-4">
                      {[
                        { title: t.addLivestock, desc: t.addLivestockDesc },
                        { title: t.trackHistory, desc: t.trackHistoryDesc },
                        { title: t.editRecords, desc: t.editRecordsDesc }
                      ].map((step, i) => (
                        <div key={i} className="flex gap-4 p-4 hover:bg-[var(--accent)]/5 rounded-2xl transition-all group">
                          <CheckCircle className="text-[var(--accent)] shrink-0 mt-1" size={20} />
                          <div>
                            <h4 className="font-bold text-[var(--text)]">{step.title}</h4>
                            <p className="text-sm text-[var(--muted)] font-medium">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Core Services Tab */}
              {activeTab === 'services' && (
                <div className="space-y-12 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-[2.5rem] bg-green-500/5 border border-green-500/10 text-center">
                      <div className="w-16 h-16 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-600">
                        <Camera size={32} />
                      </div>
                      <h3 className="font-black text-xl mb-3">{t.breedRecognition}</h3>
                      <p className="text-xs text-[var(--muted)] font-bold leading-relaxed">{t.breedRecognitionDesc}</p>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 text-center">
                      <div className="w-16 h-16 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600">
                        <Microscope size={32} />
                      </div>
                      <h3 className="font-black text-xl mb-3">{t.skinDiagnostic}</h3>
                      <p className="text-xs text-[var(--muted)] font-bold leading-relaxed">{t.lumpySkinDetection}</p>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 text-center">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <Stethoscope size={32} />
                      </div>
                      <h3 className="font-black text-xl mb-3">{t.symptomAi}</h3>
                      <p className="text-xs text-[var(--muted)] font-bold leading-relaxed">{t.symptomAiDesc}</p>
                    </div>
                  </div>

                  <div className="p-10 rounded-[3rem] bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 blur-3xl rounded-full"></div>
                    <h3 className="text-2xl font-black mb-6">{t.scientificAccuracy}</h3>
                    <p className="text-[var(--muted)] font-medium leading-relaxed mb-8">
                      {t.scientificAccuracyDesc}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">TensorFlow 2.x</div>
                      <div className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">Computer Vision</div>
                      <div className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">NLP Diagnosis</div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Tab */}
              {activeTab === 'api' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black tracking-tight">{t.endpointReference}</h3>

                    <div className="space-y-4">
                      {/* Breed Recognition */}
                      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] group">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg uppercase">POST</span>
                          <code className="text-sm font-bold text-[var(--accent)]">/api/v1/predict/breed</code>
                        </div>
                        <p className="text-sm text-[var(--muted)] font-medium mb-4">{t.identifyCattleBreedUsingImage}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Request Field</span>
                            <pre className="p-3 bg-[var(--card)] rounded-xl text-[10px] font-mono border border-[var(--border)]">
                              file: [Image File]
                            </pre>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">JSON Response</span>
                            <pre className="p-3 bg-[var(--card)] rounded-xl text-[10px] font-mono border border-[var(--border)] overflow-hidden">
{`{
  "status": "success",
  "filename": "cattle.jpg",
  "predicted_class": "Guernsey",
  "confidence": 0.705
}`}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Skin Disease */}
                      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] group">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg uppercase">POST</span>
                          <code className="text-sm font-bold text-[var(--accent)]">/api/v1/predict/skin</code>
                        </div>
                        <p className="text-sm text-[var(--muted)] font-medium mb-4">{t.analyzeSkinPatches}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Request Field</span>
                            <pre className="p-3 bg-[var(--card)] rounded-xl text-[10px] font-mono border border-[var(--border)]">
                              file: [Image File]
                            </pre>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">JSON Response</span>
                            <pre className="overflow-scroll [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] p-3 bg-[var(--card)] rounded-xl text-[10px] font-mono border border-[var(--border)]">
{`{
  "status": "success",
  "filename": "filename.png",
  "predicted_disease": "Foot and Mouth Disease (FMD)",
  "confidence": 0.7604,
  "all_predictions": {
    "Foot and Mouth Disease (FMD)": 0.7604,
    "Healthy": 0.055,
    "Lumpy Skin Disease (LSD)": 0.184
  }
}`}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Symptom Logic */}
                      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] group">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg uppercase">POST</span>
                          <code className="text-sm font-bold text-[var(--accent)]">/api/v1/predict/symptoms</code>
                        </div>
                        <p className="text-sm text-[var(--muted)] font-medium mb-4">{t.passAnArrayOfSymptoms}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">JSON Request</span>
                            <pre className="overflow-scroll [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] p-3 bg-[var(--card)] rounded-xl text-[10px] font-mono border border-[var(--border)]">
{`{
  "symptoms": ["nasel_discharges", "lameness", "weight_loss"]
}`}
                            </pre>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">JSON Response</span>
                            <pre className="overflow-scroll [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] p-3 bg-[var(--card)] rounded-xl text-[10px] font-mono border border-[var(--border)]">
{`{
  "status": "success",
  "input_symptoms": ["nasel_discharges", "lameness", "weight_loss"],
  "predicted_disease": "infectious_bovine_rhinotracheitis",
  "total_symptoms_checked": 92
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-[var(--border)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-black flex items-center gap-2">
                          <Camera size={16} className="text-green-500" />
                          41 Cattle Breeds
                        </h4>
                        <p className="text-[10px] text-[var(--muted)] font-bold leading-relaxed">
                          Including Alambadi, Amritmahal, Ayrshire, Banni, Gir, Guernsey, Holstein Friesian, Jersey, Sahiwal, and more.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-black flex items-center gap-2">
                          <Microscope size={16} className="text-red-500" />
                          Skin Conditions
                        </h4>
                        <p className="text-[10px] text-[var(--muted)] font-bold leading-relaxed">
                          Lumpy Skin Disease (LSD), Foot and Mouth Disease (FMD), and Healthy Scan signatures.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-black flex items-center gap-2">
                          <Stethoscope size={16} className="text-blue-500" />
                          26 Diagnosis Paths
                        </h4>
                        <p className="text-[10px] text-[var(--muted)] font-bold leading-relaxed">
                          Mastitis, Blackleg, Bloat, Coccidiosis, Foot Rot, IBR, and 90+ recognized physical symptoms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 flex flex-col md:flex-row items-center gap-8 justify-between p-8 rounded-[3rem] bg-[var(--accent)]/5 border border-[var(--accent)]/10">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black mb-2">{t.stillHaveQuestions}</h3>
                <p className="text-[var(--muted)] font-medium">{t.ourHelpCenterIsUpdated}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/services')}
                  className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  {t.exploreServices}
                </button>
              </div>
            </div>
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
                  <h3 className="text-2xl font-black tracking-tight">{t.contactSupport}</h3>
                  <p className="text-[var(--muted)] text-sm font-medium">{t.weWillGetBackToYourInquiry}</p>
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
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-[var(--muted)] mb-2">{t.yourEmail}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'en' ? "Enter your email" : "अपना ईमेल दर्ज करें"}
                      className="w-full px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none transition-all font-bold shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-[var(--muted)] mb-2">{t.message}</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={language === 'en' ? "How can we help you?" : "हम आपकी कैसे मदद कर सकते हैं?"}
                      className="w-full h-40 px-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:border-[var(--accent)] outline-none transition-all font-bold resize-none shadow-sm"
                    ></textarea>
                  </div>
                  <button
                    disabled={sending}
                    type="submit"
                    className="w-full py-5 bg-[var(--accent)] text-white font-black rounded-2xl shadow-xl hover:shadow-green-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {sending ? t.processing : (
                      <>
                        {t.sendSupportTicket} <Send size={18} />
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
};

export default DocsPage;
