import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Location } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import NewHome from './components/NewHome';
import LoginScreen from './components/LoginScreen';
import AlgorithmListScreen from './components/AlgorithmListScreen';
import AlgorithmDetailScreen from './components/AlgorithmDetailScreen';
import ProfileScreen from './components/ProfileScreen';
import './App.css';

function App() {
  // Router içinde olduğundan emin olmak için try-catch içinde useLocation kullan
  const [location, setLocation] = useState<Location | null>(null);
  const [routerError, setRouterError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const loc = useLocation();
      setLocation(loc);
    } catch (error) {
      console.error('Router hatası:', error);
      setRouterError(true);
    }
  }, []);

  useEffect(() => {
    // Uygulama çalıştığını göstermek için konsola bir mesaj yaz
    console.log('Uygulama başlatıldı!');
    if (location) {
      console.log('Mevcut konum:', location.pathname);
    }
  }, [location]);

  // Router hatası varsa basit bir hata mesajı göster
  if (routerError) {
    return <div className="error-container">Router bağlantı hatası!</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/splash" />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/home" element={<NewHome />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/algorithms/:categoryId" element={<AlgorithmListScreen />} />
        <Route path="/algorithm/:algorithmId" element={<AlgorithmDetailScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<div>Sayfa bulunamadı</div>} />
      </Routes>
    </div>
  );
}

export default App;
