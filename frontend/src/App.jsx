import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BreedsPage from './pages/BreedsPage';
import PredictPage from './pages/PredictPage';
import DiseasePredictPage from './pages/DiseasePredictPage';
import BreedInfoPage from './pages/BreedInfoPage';

function App() {
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en');
  const [prediction, setPrediction] = useState(null);

  return (
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
          </Routes>
        </main>

        <Footer isDark={isDark} language={language} />
      </div>
    </Router>
  );
}

export default App;