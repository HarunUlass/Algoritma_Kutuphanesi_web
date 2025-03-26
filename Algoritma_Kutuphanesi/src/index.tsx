import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import initializeDatabase from './utils/setupDb';

// Console log ile uygulamanın başladığını gösterelim
console.log('Uygulama yükleniyor...');

// MongoDB veritabanı bağlantısını başlat - hatalar uygulama başlatılmasını engellemesin
try {
  console.log('Veritabanı bağlantısı başlatılmaya çalışılıyor...');
  initializeDatabase()
    .then((connected) => {
      console.log(connected ? 'MongoDB veritabanına başarıyla bağlandı' : 'MongoDB bağlantısı başarısız');
    })
    .catch((error) => {
      console.error('MongoDB bağlantısı sırasında hata:', error);
    });
} catch (error) {
  console.error('Veritabanı başlatma hatası:', error);
}

// React root oluştur
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element bulunamadı');

const root = ReactDOM.createRoot(rootElement);

// Uygulamayı render et - Router kullanarak tüm uygulamayı sarmalıyoruz
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 