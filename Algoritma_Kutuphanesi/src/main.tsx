import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import NewHome from './components/NewHome';
import LoginScreen from './components/LoginScreen';
import AlgorithmListScreen from './components/AlgorithmListScreen';
import AlgorithmDetailScreen from './components/AlgorithmDetailScreen';
import ProfileScreen from './components/ProfileScreen';
import './index.css';
import initializeDatabase from './utils/setupDb';
import { isInTestMode } from './utils/db';

// Console log ile uygulamanın başladığını gösterelim
console.log('Uygulama yükleniyor...');
console.log('Ortam:', import.meta.env.MODE);
console.log('MongoDB URI tanımlı mı:', !!import.meta.env.VITE_MONGODB_URI);

// MongoDB veritabanı bağlantısını başlat
try {
  console.log('Veritabanı bağlantısı başlatılmaya çalışılıyor...');
  initializeDatabase()
    .then((connected) => {
      if (connected) {
        console.log('MongoDB veritabanına başarıyla bağlandı');
      } else {
        console.log('MongoDB bağlantısı başarısız, test verileri kullanılacak');
      }
      
      // Test modu kontrolü
      if (isInTestMode()) {
        console.warn('UYARI: Test modunda çalışılıyor! Gerçek veritabanı bağlantısı yok.');
        console.warn('Demo kullanıcısı: test@example.com, şifre: password123');
      }
    })
    .catch((error) => {
      console.error('MongoDB bağlantısı sırasında hata:', error);
    });
} catch (error) {
  console.error('Veritabanı başlatma hatası:', error);
}

// Router tanımla (createHashRouter, tarayıcı geçmişini URL hash'leri kullanarak yönetir)
const router = createHashRouter([
  {
    path: '/',
    element: <SplashScreen />,
  },
  {
    path: '/splash',
    element: <SplashScreen />,
  },
  {
    path: '/home',
    element: <NewHome />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/algorithms/:categoryId',
    element: <AlgorithmListScreen />,
  },
  {
    path: '/algorithm/:algorithmId',
    element: <AlgorithmDetailScreen />,
  },
  {
    path: '/profile',
    element: <ProfileScreen />,
  },
  {
    path: '*',
    element: <div>Sayfa bulunamadı</div>,
  },
]);

// React root oluştur
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element bulunamadı');

const root = ReactDOM.createRoot(rootElement);

// RouterProvider kullanarak uygulamayı render et
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
