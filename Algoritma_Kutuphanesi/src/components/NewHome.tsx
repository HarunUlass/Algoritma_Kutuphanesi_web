import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NewHome.css';
import logoImage from '../assets/logo.png';

// Kategori türünü tanımlayalım
interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  subCategories: string[];
}

// Yeni kategoriler
const categories: Category[] = [
  {
    id: '1',
    title: 'Veri Yapıları',
    icon: '🏗️',
    description: 'Diziler, Bağlı Listeler, Ağaçlar, Hash Tabloları ve daha fazlası',
    color: '#3498db',
    subCategories: ['Diziler', 'Bağlı Listeler', 'Ağaçlar', 'Hash Tabloları', 'Yığınlar ve Kuyruklar']
  },
  {
    id: '2',
    title: 'Derin Öğrenme',
    icon: '🧠',
    description: 'Yapay Sinir Ağları, CNN, RNN ve derin öğrenme mimarileri',
    color: '#9b59b6',
    subCategories: ['Sinir Ağları', 'CNN', 'RNN', 'Transformers', 'GAN']
  },
  {
    id: '3',
    title: 'Makine Öğrenmesi',
    icon: '🤖',
    description: 'Regresyon, Sınıflandırma, Kümeleme ve diğer ML algoritmaları',
    color: '#e74c3c',
    subCategories: ['Denetimli Öğrenme', 'Denetimsiz Öğrenme', 'Pekiştirmeli Öğrenme']
  },
  {
    id: '4',
    title: 'Doğal Dil İşleme',
    icon: '💬',
    description: 'Metin işleme, Dil modelleri ve NLP teknikleri',
    color: '#2ecc71',
    subCategories: ['Tokenizasyon', 'Vektör Modeller', 'Duygu Analizi', 'Makine Çevirisi']
  },
  {
    id: '5',
    title: 'Makine Görünümü',
    icon: '👁️',
    description: 'Görüntü işleme, Nesne tanıma ve diğer CV teknikleri',
    color: '#f39c12',
    subCategories: ['Görüntü İşleme', 'Nesne Tespiti', 'Segmentasyon', '3D Görüntüleme']
  },
];

// Öne çıkan algoritma kartları
const featuredCards = [
  {
    id: '1',
    title: 'Arama Algoritmaları',
    description: 'Linear, Binary ve Hash tabanlı arama algoritmaları',
    icon: '🔍',
    link: '/algorithms/1',
    complexity: 'O(log n) - O(n)'
  },
  {
    id: '2',
    title: 'Sıralama Algoritmaları',
    description: 'Quick, Merge, Bubble ve Selection sıralama',
    icon: '🔄',
    link: '/algorithms/1',
    complexity: 'O(n log n) - O(n²)'
  },
  {
    id: '3',
    title: 'Grafik Algoritmaları',
    description: 'DFS, BFS, Dijkstra ve diğer algoritmaları',
    icon: '📊',
    link: '/algorithms/1',
    complexity: 'O(V+E) - O(V²)'
  },
  {
    id: '4',
    title: 'Optimizasyon Algoritmaları',
    description: 'Dinamik programlama ve diğer optimizasyon yöntemleri',
    icon: '⚡',
    link: '/algorithms/3',
    complexity: 'Değişken'
  }
];

const NewHome: React.FC = () => {
  // localStorage'dan oturum durumunu kontrol et
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username') || '';
  const userInitial = username ? username.charAt(0).toUpperCase() : 'G';

  return (
    <div className="home-safe-area">
      <div className="home-content">
        <header className="home-header">
          <div className="home-logo">
            <img src={logoImage} alt="Logo" className="logo-fallback" />
            <div className="home-logo-text">Algoritma Kütüphanesi</div>
          </div>
          <div className="header-right">
            <button className="search-button">🔍</button>
            <Link to={isLoggedIn ? "/profile" : "/login"} className="profile-button">
              {isLoggedIn ? userInitial : '🔑'}
            </Link>
          </div>
        </header>
        
        <section className="main-section">
          <div className="section-title">
            <span className="section-title-accent"></span>
            Kategoriler
          </div>
          <div className="categories-grid">
            {categories.map((item) => (
              <Link 
                to={`/algorithms/${item.id}`} 
                className="category-card" 
                key={item.id}
              >
                <div className="category-image">{item.icon}</div>
                <div className="category-info">
                  <div className="category-name">{item.title}</div>
                  <div className="category-count">{item.subCategories.length} algoritma</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        <section className="main-section">
          <div className="section-title">
            <span className="section-title-accent"></span>
            Popüler Algoritmalar
          </div>
          <div className="featured-algorithms">
            {featuredCards.map(card => (
              <Link 
                to={card.link} 
                className="algorithm-card" 
                key={card.id}
              >
                <div className="algorithm-info">
                  <div className="algorithm-title">{card.title}</div>
                  <div className="algorithm-description">{card.description}</div>
                  <div className="algorithm-complexity">Karmaşıklık: {card.complexity}</div>
                </div>
                <div className="algorithm-icon">{card.icon}</div>
              </Link>
            ))}
          </div>
        </section>
        
        {!isLoggedIn && (
          <section className="main-section login-prompt-section">
            <div className="section-title">
              <span className="section-title-accent"></span>
              Hesap Oluşturun
            </div>
            <div className="login-prompt">
              <p>Algoritma Kütüphanesi'nde hesap oluşturarak favori algoritmaları kaydedin ve ziyaret geçmişinizi takip edin.</p>
              <Link to="/login" className="login-button">
                Giriş Yap / Kayıt Ol
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default NewHome; 