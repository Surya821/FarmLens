import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import UsageLimitModal from './components/UsageLimitModal';

// Pages - Auth
import AuthPage from './pages/auth/AuthPage';

// Pages - Breeds
import BreedsPage from './pages/breeds/BreedsPage';
import BreedInfoPage from './pages/breeds/BreedInfoPage';

// Pages - Cattle
import AddCattlePage from './pages/cattle/AddCattlePage';
import AllCattlePage from './pages/cattle/AllCattlePage';
import CattleInfoPage from './pages/cattle/CattleInfoPage';

// Pages - Disease
import DiseasesPage from './pages/disease/DiseasesPage';
import DiseaseInfoPage from './pages/disease/DiseaseInfoPage';
import DiseasePredictPage from './pages/disease/DiseasePredictPage';
import PrescriptionPage from './pages/disease/PrescriptionPage';
import SkinDiseasePage from './pages/disease/SkinDiseasePage';

// Pages - User
import UserDashboard from './pages/user/UserDashboard';
import ProfilePage from './pages/user/ProfilePage';
import SettingsPage from './pages/user/SettingsPage';
import DeveloperPage from './pages/user/DeveloperPage';
import MembershipPage from './pages/user/MembershipPage';

// Pages - General
import HomePage from './pages/general/HomePage';
import ServicesPage from './pages/general/ServicesPage';
import PredictPage from './pages/general/PredictPage';
import DocsPage from './pages/general/DocsPage';
import AboutPage from './pages/general/AboutPage';
import TermsPage from './pages/general/TermsPage';
import PrivacyPage from './pages/general/PrivacyPage';
import CookiePage from './pages/general/CookiePage';
import PaymentSuccess from './pages/general/PaymentSuccess';
import ChatbotWidget from './components/ChatbotWidget.jsx';
import ContactPage from './pages/general/ContactPage'; // Added ContactPage import

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMessages from './pages/admin/AdminMessages';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBreeds from './pages/admin/AdminBreeds';
import AdminManageBreeds from './pages/admin/AdminManageBreeds';
import AdminDiseases from './pages/admin/AdminDiseases';
import AdminManageDiseases from './pages/admin/AdminManageDiseases';


function App() {
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [language, setLanguage] = useState('en');
  const [prediction, setPrediction] = useState(null);
  const [diseasePrediction, setDiseasePrediction] = useState(null);
  const [skinPrediction, setSkinPrediction] = useState(null);
  const [globalImage, setGlobalImage] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppContent 
              language={language} setLanguage={setLanguage}
              selectedBreed={selectedBreed} setSelectedBreed={setSelectedBreed}
              prediction={prediction} setPrediction={setPrediction}
              diseasePrediction={diseasePrediction} setDiseasePrediction={setDiseasePrediction}
              skinPrediction={skinPrediction} setSkinPrediction={setSkinPrediction}
              globalImage={globalImage} setGlobalImage={setGlobalImage}
              isChatbotOpen={isChatbotOpen} setIsChatbotOpen={setIsChatbotOpen}
            />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

function AppContent({ 
  language, setLanguage, 
  selectedBreed, setSelectedBreed, prediction, setPrediction,
  diseasePrediction, setDiseasePrediction,
  skinPrediction, setSkinPrediction,
  globalImage, setGlobalImage,
  isChatbotOpen, setIsChatbotOpen
}) {
  const { isDark, setIsDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, showLimitModal, triggerLimitModal } = useAuth(); // Get logout and user from AuthContext
  const isAdminPath = location.pathname.startsWith('/admin');

  // Scroll to top on route change or reload
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Logic to clear user session when navigating between admin/user paths
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (isAdminPath && user) {
      // If on admin path but logged in as regular user, clear user session
      logout();
      toast.info('Regular user session cleared for Admin access');
    } else if (!isAdminPath && isAdmin) {
      // If on regular path but logged in as admin, clear admin session
      localStorage.removeItem('isAdmin');
      toast.info('Admin session cleared for User access');
    }
  }, [isAdminPath, user, logout]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {!isAdminPath && (
        <Header
          isDark={isDark}
          setIsDark={setIsDark}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      <main className={!isAdminPath ? "pt-[0px]" : ""}>
        <Routes>
          <Route path="/" element={<GuestRoute><HomePage isDark={isDark} language={language} setSelectedBreed={setSelectedBreed} /></GuestRoute>} />
          <Route path="/breeds" element={<BreedsPage isDark={isDark} language={language} setSelectedBreed={setSelectedBreed} />} />
          <Route path="/predict" element={<ProtectedRoute language={language}><PredictPage isDark={isDark} language={language} setSelectedBreed={setSelectedBreed} prediction={prediction} setPrediction={setPrediction} setGlobalImage={setGlobalImage} /></ProtectedRoute>} />
          <Route path="/disease" element={<ProtectedRoute language={language}><DiseasePredictPage isDark={isDark} language={language} diseasePrediction={diseasePrediction} setDiseasePrediction={setDiseasePrediction} /></ProtectedRoute>} />
          <Route path="/services" element={<ServicesPage isDark={isDark} language={language} />} />
          <Route path="/skin-disease" element={<ProtectedRoute language={language}><SkinDiseasePage isDark={isDark} language={language} skinPrediction={skinPrediction} setSkinPrediction={setSkinPrediction} setGlobalImage={setGlobalImage} /></ProtectedRoute>} />
          <Route path="/prescription" element={<PrescriptionPage isDark={isDark} language={language} />} />
          <Route path="/membership" element={<MembershipPage isDark={isDark} language={language} />} />
          <Route path="/:username/membership" element={<MembershipPage isDark={isDark} language={language} />} />
          <Route path="/breed/:breedName" element={<BreedInfoPage isDark={isDark} language={language} selectedBreed={selectedBreed} prediction={prediction} />} />
          <Route path="/about" element={<AboutPage isDark={isDark} language={language} />} />
          <Route path="/terms" element={<TermsPage isDark={isDark} language={language} />} />
          <Route path="/privacy" element={<PrivacyPage isDark={isDark} language={language} />} />
          <Route path="/cookies" element={<CookiePage isDark={isDark} language={language} />} />
          <Route path="/diseases" element={<DiseasesPage isDark={isDark} language={language} />} />
          <Route path="/disease-info/:diseaseId" element={<DiseaseInfoPage isDark={isDark} language={language} />} />
          <Route path="/docs" element={<DocsPage isDark={isDark} language={language} />} />
          <Route path="/payment-success" element={<ProtectedRoute language={language}><PaymentSuccess isDark={isDark} language={language} /></ProtectedRoute>} />
          <Route path="/login" element={<AuthPage isDark={isDark} language={language} />} />
          <Route path="/register" element={<AuthPage isDark={isDark} language={language} />} />
          <Route path="/contact" element={<ContactPage isDark={isDark} language={language} />} /> {/* Added ContactPage route */}
          
          {/* User Routes */}
          <Route path="/:username" element={<ProtectedRoute language={language}><UserDashboard isDark={isDark} language={language} /></ProtectedRoute>} />
          <Route path="/:username/addcattle" element={<ProtectedRoute language={language}><AddCattlePage isDark={isDark} language={language} prediction={prediction} diseasePrediction={diseasePrediction} skinPrediction={skinPrediction} globalImage={globalImage} /></ProtectedRoute>} />
          <Route path="/:username/cattleinfo/:cattleId" element={<ProtectedRoute language={language}><CattleInfoPage isDark={isDark} language={language} /></ProtectedRoute>} />
          <Route path="/:username/profile" element={<ProtectedRoute language={language}><ProfilePage isDark={isDark} language={language} /></ProtectedRoute>} />
          <Route path="/:username/allcattles" element={<ProtectedRoute language={language}><AllCattlePage isDark={isDark} language={language} /></ProtectedRoute>} />
          <Route path="/:username/developer" element={<ProtectedRoute language={language}><DeveloperPage isDark={isDark} language={language} /></ProtectedRoute>} />
          <Route path="/:username/settings" element={<ProtectedRoute language={language}><SettingsPage isDark={isDark} language={language} setLanguage={setLanguage} /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin isDark={isDark} language={language} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard isDark={isDark} setIsDark={setIsDark} language={language} />} />
          <Route path="/admin/messages" element={<AdminMessages isDark={isDark} setIsDark={setIsDark} language={language} />} />
          <Route path="/admin/users" element={<AdminUsers isDark={isDark} setIsDark={setIsDark} language={language} />} />
          <Route path="/admin/breeds" element={<AdminBreeds isDark={isDark} setIsDark={setIsDark} language={language} />} />
          <Route path="/admin/manage-breeds" element={<AdminManageBreeds isDark={isDark} setIsDark={setIsDark} language={language} />} />
          <Route path="/admin/diseases" element={<AdminDiseases isDark={isDark} setIsDark={setIsDark} language={language} />} />
          <Route path="/admin/manage-diseases" element={<AdminManageDiseases isDark={isDark} setIsDark={setIsDark} language={language} />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer isDark={isDark} language={language} />}
      
      {/* Global Usage Limit Modal */}
      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={() => triggerLimitModal(false)} 
        language={language}
      />

      {/* Global AI Chatbot Button & Widget */}
      {!isAdminPath && (
        <>
          <ChatbotWidget 
            isOpen={isChatbotOpen} 
            onClose={() => setIsChatbotOpen(false)} 
            isDark={isDark} 
            language={language} 
          />
          {!isChatbotOpen && (
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[var(--accent)] text-white rounded-full shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
              title="Ask FarmLens AI"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <i className="fa-solid fa-robot text-2xl"></i>
              <span className="absolute right-20 px-4 py-2 bg-[var(--card)] border border-[var(--border)] text-[var(--accent)] text-xs font-black rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                {language === 'en' ? 'Ask FarmLens AI' : 'एआई से पूछें'}
              </span>
            </button>
          )}
        </>
      )}

      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </div>
  );
}

export default App;