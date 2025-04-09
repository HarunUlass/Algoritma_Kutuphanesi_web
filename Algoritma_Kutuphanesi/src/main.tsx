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

// Console log ile uygulamanın başladığını gösterelim
console.log('Uygulama yükleniyor...');
console.log('Ortam:', import.meta.env.MODE);

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
