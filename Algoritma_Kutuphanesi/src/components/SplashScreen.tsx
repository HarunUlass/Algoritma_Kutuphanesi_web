import React, { useEffect, useState } from 'react';
import '../styles/SplashScreen.css';

const SplashScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('SplashScreen yüklendi, 2 saniye sonra ana sayfaya yönlendirilecek');
    
    // 2 saniye sonra ana sayfaya yönlendir
    const timer = setTimeout(() => {
      console.log('Yönlendirme zamanı geldi, ana sayfaya gidiliyor');
      setLoading(false);
      
      // Hash router kullanıldığında "#/home" şeklinde yönlendirme yapar
      window.location.hash = '#/home';
    }, 2000);

    return () => {
      console.log('SplashScreen temizleniyor');
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="splash-container">
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <div className="logo-container">
        <div className="logo-fallback">
          <div className="logo-text">A</div>
        </div>
        <h1 className="app-name">Algoritma Kütüphanesi</h1>
        <p className="tagline">Algoritmaları keşfedin, anlayın ve uygulamada kullanın</p>
      </div>
      
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
      
      <div className="version-text">v1.0.0</div>
    </div>
  );
};

export default SplashScreen; 