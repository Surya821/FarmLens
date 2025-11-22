import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BreedsPage from './pages/BreedsPage';
import PredictPage from './pages/PredictPage';
import DiseasePredictPage from './pages/DiseasePredictPage';
import BreedInfoPage from './pages/BreedInfoPage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import AddCattlePage from './pages/AddCattlePage';
import CattleInfoPage from './pages/CattleInfoPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en');
  const [prediction, setPrediction] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <Header 
            isDark={isDark} 
            setIsDark={setIsDark} 
            language={language} 
            setLanguage={setLanguage} 
          />

          <main>
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage
                    isDark={isDark}
                    language={language}
                    setSelectedBreed={setSelectedBreed}
                  />
                } 
              />
              
              <Route 
                path="/breeds" 
                element={
                  <BreedsPage
                    isDark={isDark}
                    language={language}
                    setSelectedBreed={setSelectedBreed}
                  />
                } 
              />
              
              <Route 
                path="/predict" 
                element={
                  <PredictPage
                    isDark={isDark}
                    language={language}
                    setSelectedBreed={setSelectedBreed}
                    prediction={prediction}
                    setPrediction={setPrediction}
                  />
                } 
              />
              
              <Route 
                path="/disease" 
                element={
                  <DiseasePredictPage
                    isDark={isDark}
                    language={language}
                  />
                } 
              />
              
              <Route 
                path="/breed/:breedName" 
                element={
                  <BreedInfoPage
                    isDark={isDark}
                    language={language}
                    selectedBreed={selectedBreed}
                    prediction={prediction}
                  />
                } 
              />
              
              {/* New Routes */}
              <Route 
                path="/login" 
                element={
                  <AuthPage
                    isDark={isDark}
                    language={language}
                  />
                } 
              />
              
              <Route 
                path="/register" 
                element={
                  <AuthPage
                    isDark={isDark}
                    language={language}
                  />
                } 
              />
              
              <Route 
                path="/:username" 
                element={
                  <UserDashboard
                    isDark={isDark}
                    language={language}
                  />
                } 
              />
              
              <Route 
                path="/:username/addcattle" 
                element={
                  <AddCattlePage
                    isDark={isDark}
                    language={language}
                  />
                } 
              />
              
              <Route 
                path="/:username/cattleinfo/:cattleId" 
                element={
                  <CattleInfoPage
                    isDark={isDark}
                    language={language}
                  />
                } 
              />
              
              <Route 
                path="/:username/profile" 
                element={
                  <ProfilePage
                    isDark={isDark}
                    language={language}
                  />
                } 
              />
            </Routes>
          </main>

          <Footer isDark={isDark} language={language} />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDark ? "dark" : "light"}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;