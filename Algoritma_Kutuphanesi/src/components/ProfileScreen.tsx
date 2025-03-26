import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ProfileScreen.css';
import logoImage from '../assets/logo.png';

interface Algorithm {
  id: string;
  title: string;
  description: string;
  complexity?: string;
  difficulty?: string;
}

interface RecentActivity {
  id: string;
  title: string;
  icon: string;
  date: string;
  type: string;
  link: string;
}

interface FavoriteItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  link: string;
}

const ProfileScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const navigate = useNavigate();
  
  // Gerçek uygulamada, bu liste bir state yönetim aracından gelecektir
  const mockViewedAlgorithms: Algorithm[] = [
    {
      id: '1',
      title: 'Binary Search',
      description: 'Sıralı dizide ortadan ikiye bölerek arama yapar.',
      complexity: 'O(log n)',
      difficulty: 'Orta'
    },
    {
      id: '2',
      title: 'Quick Sort',
      description: 'Böl ve fethet stratejisini kullanarak hızlı sıralama yapar.',
      complexity: 'O(n log n)',
      difficulty: 'Orta'
    },
    {
      id: '3',
      title: 'Dijkstra Algoritması',
      description: 'Bir grafikteki iki düğüm arasındaki en kısa yolu bulan bir algoritma.',
      complexity: 'O((V+E)log V)',
      difficulty: 'Zor'
    }
  ];

  // Örnek son aktivite verileri
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      title: 'Arama Algoritmaları',
      icon: '🔍',
      date: '26/03/2025',
      type: 'algoritma',
      link: '/algorithms/1'
    },
    {
      id: '2',
      title: 'Sıralama Algoritmaları',
      icon: '🔄',
      date: '25/03/2025',
      type: 'algoritma',
      link: '/algorithms/2'
    },
    {
      id: '3',
      title: 'Makine Öğrenmesi',
      icon: '🤖',
      date: '25/03/2025',
      type: 'kategori',
      link: '/algorithms/3'
    },
    {
      id: '4',
      title: 'Dijkstra Algoritması',
      icon: '��',
      date: '24/03/2025',
      type: 'algoritma',
      link: '/algorithms/detail/4'
    }
  ];

  // Örnek favori verileri
  const favorites: FavoriteItem[] = [
    {
      id: '1',
      title: 'Binary Search',
      icon: '🔍',
      description: 'O(log n) karmaşıklığında arama algoritması',
      link: '/algorithms/detail/1'
    },
    {
      id: '2',
      title: 'Merge Sort',
      icon: '🔄',
      description: 'O(n log n) karmaşıklığında sıralama algoritması',
      link: '/algorithms/detail/2'
    },
    {
      id: '3',
      title: 'Yapay Sinir Ağları',
      icon: '🧠',
      description: 'Derin öğrenme temel mimarisi',
      link: '/algorithms/detail/3'
    }
  ];

  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgisini al
    const storedUsername = localStorage.getItem('username');
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    if (!loggedIn) {
      navigate('/login');
      return;
    }
    
    setUsername(storedUsername || 'Kullanıcı');
    setIsLoggedIn(loggedIn);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-info-container">
            <div className="profile-avatar">
              {username ? username.charAt(0).toUpperCase() : 'K'}
            </div>
            <div className="profile-details">
              <h2>{username}</h2>
              <p>Algoritma Kütüphanesi Üyesi</p>
            </div>
            <div className="profile-actions">
              <button className="profile-action-button">
                <span className="action-icon">⚙️</span>
                <span>Profili Düzenle</span>
              </button>
              <button 
                className="profile-action-button logout-button"
                onClick={handleLogout}
              >
                <span className="action-icon">🚪</span>
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        );
      case 'recents':
        return (
          <div className="profile-recents-container">
            <h2 className="section-title">Son Ziyaret Edilenler</h2>
            <div className="recents-list">
              {recentActivities.map(activity => (
                <Link to={activity.link} className="recent-item" key={activity.id}>
                  <div className="recent-item-icon">{activity.icon}</div>
                  <div className="recent-item-details">
                    <div className="recent-item-title">{activity.title}</div>
                    <div className="recent-item-meta">
                      <span className="recent-type">{activity.type}</span>
                      <span className="recent-date">{activity.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      case 'favorites':
        return (
          <div className="profile-favorites-container">
            <h2 className="section-title">Favoriler</h2>
            <div className="favorites-list">
              {favorites.map(item => (
                <Link to={item.link} className="favorite-item" key={item.id}>
                  <div className="favorite-item-icon">{item.icon}</div>
                  <div className="favorite-item-details">
                    <div className="favorite-item-title">{item.title}</div>
                    <div className="favorite-item-description">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <Link to="/" className="back-button">
            ←
          </Link>
          <h1 className="header-title">Profil</h1>
          <div className="empty-space"></div>
        </div>
        
        <div className="not-logged-in-container">
          <p className="not-logged-in-text">Profilinize erişmek için giriş yapın</p>
          <Link to="/login" className="login-button">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-safe-area">
      <header className="profile-header">
        <Link to="/" className="profile-back-button">
          <span>⬅️</span>
        </Link>
        <div className="profile-header-title">
          <div className="home-logo">
            <img src={logoImage} alt="Logo" className="logo-fallback" />
            <span className="profile-title">Profil</span>
          </div>
        </div>
        <div className="profile-header-right"></div>
      </header>

      <div className="profile-content">
        {renderTabContent()}
      </div>

      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          <span className="tab-label">Profil</span>
        </button>
        <button 
          className={`profile-tab ${activeTab === 'recents' ? 'active' : ''}`}
          onClick={() => setActiveTab('recents')}
        >
          <span className="tab-icon">🕒</span>
          <span className="tab-label">Son Görüntülenenler</span>
        </button>
        <button 
          className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <span className="tab-icon">🔖</span>
          <span className="tab-label">Favoriler</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen; 