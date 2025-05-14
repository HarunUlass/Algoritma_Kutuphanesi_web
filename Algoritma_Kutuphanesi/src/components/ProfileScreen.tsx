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

interface Badge {
  type: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  xpReward: number;
  earned: boolean;
  earnedAt: string | null;
}

interface UserProfile {
  username: string;
  email?: string;
  bio?: string;
  avatarColor?: string;
}

interface ViewedAlgorithm {
  id: string;
  title: string;
  description: string;
  complexity?: string;
  difficulty?: string;
  lastViewed: string; // ISO string tarih formatı
  viewCount: number;
  url: string; // Algoritma detay sayfasının URL'si
}

// Rozet ikonları için yardımcı fonksiyon
const getBadgeIcon = (iconKey: string) => {
  const iconMap: Record<string, string> = {
    'first_step': '🚶',
    'sorting_master': '📊',
    'quiz_genius': '🧠',
    'streak_hero': '🔥',
    'graduate': '🎓',
    'explorer': '🧭',
    'quiz_master': '🏆',
    'default': '✨'
  };
  
  return iconMap[iconKey] || iconMap.default;
};

// Rozet seviyelerine göre gruplandırma yardımcı fonksiyonu
const groupBadgesByLevel = (badges: Badge[]) => {
  const result: Record<number, Badge[]> = {
    1: [], // Bronze
    2: [], // Silver
    3: []  // Gold
  };
  
  badges.forEach(badge => {
    if (badge.level >= 1 && badge.level <= 3) {
      result[badge.level].push(badge);
    }
  });
  
  return result;
};

// Rozet seviye isimlerini çeviren yardımcı fonksiyon
const getLevelName = (level: number): string => {
  switch(level) {
    case 1: return 'Bronz';
    case 2: return 'Gümüş';
    case 3: return 'Altın';
    default: return '';
  }
};

const ProfileScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    bio: 'Algoritma Kütüphanesi Üyesi',
    avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
  });
  const [recentAlgorithms, setRecentAlgorithms] = useState<ViewedAlgorithm[]>([]);
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
      icon: '🔍',
      date: '24/03/2025',
      type: 'algoritma',
      link: '/algorithms/detail/4'
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
    
    // Profil bilgilerini ayarla
    setProfile(prev => ({
      ...prev,
      username: storedUsername || 'Kullanıcı'
    }));

    // Son görüntülenen algoritmaları yükle
    fetchRecentAlgorithms();

    // Algoritma görüntüleme olaylarını dinle
    window.addEventListener('algorithmViewed', handleAlgorithmView as any);

    // Component unmount olduğunda event listener'ı temizle
    return () => {
      window.removeEventListener('algorithmViewed', handleAlgorithmView as any);
    };
  }, [navigate]);

  // activeTab 'recents' olduğunda son görüntülenen algoritmaları yükle
  useEffect(() => {
    if (activeTab === 'recents') {
      fetchRecentAlgorithms();
    }
  }, [activeTab]);

  useEffect(() => {
    // Kullanıcı rozetlerini getir
    if (isLoggedIn) {
      fetchUserBadges();
    }
  }, [isLoggedIn]);

  const fetchUserBadges = async () => {
    try {
      setLoading(true);
      
      // Gerçek uygulamada API'den rozetleri çekmek için:
      // const userId = localStorage.getItem('userId');
      // if (!userId) {
      //   console.error('Kullanıcı ID bulunamadı');
      //   setBadges(mockBadges); // Hata durumunda örnek verileri kullan
      //   return;
      // }
      // 
      // const response = await fetch(`/api/users/${userId}/achievements`);
      // if (!response.ok) {
      //   throw new Error('Rozet verileri alınamadı');
      // }
      // const data = await response.json();
      // setBadges(data);
      
      // API entegrasyonu tamamlanana kadar örnek veriler kullanılacak
      setTimeout(() => {
        setBadges(mockBadges);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Rozet verileri alınırken hata oluştu:', error);
      setBadges(mockBadges); // Hata durumunda örnek verileri kullan
    } finally {
      setLoading(false);
    }
  };

  // Örnek rozet verileri
  const mockBadges: Badge[] = [
    {
      type: 'LEARNER',
      name: 'İlk Adım',
      description: 'İlk algoritma detayını görüntülediniz',
      icon: 'first_step',
      level: 1,
      xpReward: 10,
      earned: true,
      earnedAt: new Date().toISOString()
    },
    {
      type: 'QUIZ_MASTER',
      name: 'Quiz Ustası',
      description: 'İlk kez bir quizi başarıyla tamamladınız!',
      icon: 'quiz_master',
      level: 1,
      xpReward: 50,
      earned: true,
      earnedAt: new Date().toISOString()
    },
    {
      type: 'ALGORITHM_MASTER',
      name: 'Sıralama Uzmanı',
      description: 'Tüm sıralama algoritmalarını tamamladınız',
      icon: 'sorting_master',
      level: 2,
      xpReward: 100,
      earned: false,
      earnedAt: null
    },
    {
      type: 'QUIZ_GENIUS',
      name: 'Bilgi Dehası',
      description: '10 quizi başarıyla tamamladınız',
      icon: 'quiz_genius',
      level: 2,
      xpReward: 150,
      earned: false,
      earnedAt: null
    },
    {
      type: 'STREAK_HERO',
      name: 'Kararlı Öğrenci',
      description: '7 gün arka arkaya çalıştınız',
      icon: 'streak_hero',
      level: 1,
      xpReward: 50,
      earned: false,
      earnedAt: null
    },
    {
      type: 'GRADUATE',
      name: 'Algoritma Lisansı',
      description: 'İlk öğrenme yolunu tamamladınız',
      icon: 'graduate',
      level: 2,
      xpReward: 200,
      earned: false,
      earnedAt: null
    }
  ];

  // Son görüntülenen algoritmaları getiren fonksiyon
  const fetchRecentAlgorithms = async () => {
    try {
      setLoading(true);
      
      // Kullanıcı ID'sini localStorage'dan al
      const userId = localStorage.getItem('userId');
      
      console.log('fetchRecentAlgorithms - userId from localStorage:', userId);
      
      if (!userId) {
        console.error('Kullanıcı ID\'si bulunamadı');
        setRecentAlgorithms([]);
        setLoading(false);
        return;
      }
      
      // userId'den "user_" önekini kaldır (eğer varsa)
      const cleanUserId = userId.startsWith('user_') ? userId.substring(5) : userId;
      console.log('fetchRecentAlgorithms - kullanılan temiz userId:', cleanUserId);
      
      // API'den son görüntülenen algoritmaları getir
      const apiUrl = `http://localhost:3000/api/users/${cleanUserId}/recently-viewed-algorithms?limit=5`;
      console.log('fetchRecentAlgorithms - API çağrısı:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.error(`HTTP Hata: ${response.status} - ${await response.text()}`);
        throw new Error(`HTTP Hata: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('fetchRecentAlgorithms - API yanıtı:', data);
      
      if (Array.isArray(data)) {
        // URL'leri düzelt - doğru format '/#/algorithm/algo_title' olmalı
        const formattedData = data.map(algo => ({
          ...algo,
          url: `/#/algorithm/${encodeURIComponent(algo.title || algo.id)}`
        }));
        setRecentAlgorithms(formattedData);
      } else {
        console.error('API beklenen formatta veri döndürmedi', data);
        setRecentAlgorithms([]);
      }
    } catch (error) {
      console.error('Son görüntülenen algoritmaları getirme hatası:', error);
      setRecentAlgorithms([]);
    } finally {
      setLoading(false);
    }
  };

  // Algoritma görüntüleme olayını işle
  const handleAlgorithmView = (event: CustomEvent) => {
    // Event'ten algoritma verilerini al
    const algorithm = event.detail;
    
    if (!algorithm || !algorithm.id) {
      console.error('Geçersiz algoritma verisi:', algorithm);
      return;
    }
    
    // Kullanıcı ID'sini localStorage'dan al
    const userId = localStorage.getItem('userId');
    console.log('handleAlgorithmView - localStorage userId:', userId);
    
    if (!userId) {
      console.warn('Kullanıcı ID\'si bulunamadı, görüntüleme kaydedilemiyor');
      return;
    }
    
    // userId'den "user_" önekini kaldır (eğer varsa)
    const cleanUserId = userId.startsWith('user_') ? userId.substring(5) : userId;
    console.log('handleAlgorithmView - kullanılan temiz userId:', cleanUserId);
    console.log('handleAlgorithmView - algoritma id:', algorithm.id);
    
    // API'ye görüntüleme kaydı gönder
    const apiUrl = `http://localhost:3000/api/users/${cleanUserId}/algo-viewed/${algorithm.id}`;
    console.log('handleAlgorithmView - API çağrısı:', apiUrl);
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        difficulty: algorithm.difficulty || 'Orta'
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          console.error(`HTTP Hata: ${response.status} - ${text}`);
          throw new Error(`HTTP Hata: ${response.status}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Algoritma görüntüleme kaydedildi:', data);
      
      // Profil sayfasında görüntüleniyorsa, listeyi güncelle
      if (activeTab === 'recents') {
        fetchRecentAlgorithms();
      }
    })
    .catch(error => {
      console.error('Algoritma görüntüleme kaydedilemedi:', error);
    });
    
    // Ayrıca yerel depolama için yeni algoritma görüntüleme kaydı oluştur 
    // (API çağrısı başarısız olursa yedek olarak)
    updateLocalStorage(algorithm);
  };
  
  // Yerel depolama güncelleme fonksiyonu
  const updateLocalStorage = (algorithm: any) => {
    const viewedAlgo: ViewedAlgorithm = {
      id: algorithm.id,
      title: algorithm.title || 'Bilinmeyen Algoritma',
      description: algorithm.description || '',
      complexity: algorithm.complexity || 'O(?)',
      difficulty: algorithm.difficulty || 'Orta',
      lastViewed: new Date().toISOString(),
      viewCount: 1,
      url: algorithm.url || `/#/algorithm/${encodeURIComponent(algorithm.title || algorithm.id)}`
    };
    
    // localStorage ve sessionStorage'dan mevcut verileri al
    let sessionAlgos: ViewedAlgorithm[] = [];
    
    const sessionStored = sessionStorage.getItem('viewedAlgorithms');
    
    // Session verileri
    if (sessionStored) {
      try {
        sessionAlgos = JSON.parse(sessionStored);
        
        // Eğer algoritma daha önce görüntülenmişse, güncelle
        const index = sessionAlgos.findIndex(a => a.id === viewedAlgo.id);
        if (index >= 0) {
          viewedAlgo.viewCount = sessionAlgos[index].viewCount + 1;
          sessionAlgos[index] = viewedAlgo;
        } else {
          sessionAlgos.push(viewedAlgo);
        }
      } catch (error) {
        console.error('Session verisi bozuk, sıfırlanıyor');
        sessionAlgos = [viewedAlgo];
      }
    } else {
      sessionAlgos = [viewedAlgo];
    }
    
    // Güncellenmiş verileri kaydet
    sessionStorage.setItem('viewedAlgorithms', JSON.stringify(sessionAlgos));
  };

  // Tarih formatını düzenleyen yardımcı fonksiyon
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays < 30) {
      return `${diffDays} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  const handleProfileUpdate = () => {
    // Kullanıcı bilgilerini güncelle
    localStorage.setItem('username', profile.username);
    setUsername(profile.username);
    setIsEditMode(false);
    
    // Gerçek uygulamada burada API çağrısı yapılacak
    // Örneğin:
    // const userId = localStorage.getItem('userId');
    // fetch(`/api/users/${userId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profile)
    // });

    // Başarılı güncelleme mesajı
    alert('Profil başarıyla güncellendi!');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.setItem('isLoggedIn', 'false');
    navigate('/');
  };

  // Son görüntülenenleri temizle
  const clearRecentAlgorithms = () => {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      // Gerçek bir API uç noktası olsaydı burada sunucudaki kayıtları temizleme isteği yapardık
      // Şimdilik sadece yerel kayıtları temizliyoruz
      alert('Son görüntülenen algoritmalar temizlendi');
    }
    
    sessionStorage.removeItem('viewedAlgorithms');
    localStorage.removeItem('viewedAlgorithms');
    setRecentAlgorithms([]);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-info-container">
            {!isEditMode ? (
              // Profil görüntüleme modu
              <>
                <div className="profile-avatar" style={{background: profile.avatarColor ? `linear-gradient(135deg, ${profile.avatarColor}, ${adjustColor(profile.avatarColor, -30)})` : undefined}}>
                  {profile.username ? profile.username.charAt(0).toUpperCase() : 'K'}
                </div>
                <div className="profile-details">
                  <h2>{profile.username}</h2>
                  <p>{profile.bio}</p>
                  {profile.email && <p className="profile-email">{profile.email}</p>}
                </div>
                <div className="profile-actions">
                  <button 
                    className="profile-action-button"
                    onClick={() => setIsEditMode(true)}
                  >
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
              </>
            ) : (
              // Profil düzenleme modu
              <div className="profile-edit-form">
                <h2 className="edit-title">Profili Düzenle</h2>
                
                <div className="edit-avatar-section">
                  <div 
                    className="profile-avatar" 
                    style={{background: profile.avatarColor ? `linear-gradient(135deg, ${profile.avatarColor}, ${adjustColor(profile.avatarColor, -30)})` : undefined}}
                  >
                    {profile.username ? profile.username.charAt(0).toUpperCase() : 'K'}
                  </div>
                  <button 
                    className="change-avatar-color"
                    onClick={() => setProfile({
                      ...profile,
                      avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
                    })}
                  >
                    🎨 Renk Değiştir
                  </button>
                </div>
                
                <div className="edit-field">
                  <label htmlFor="username">Kullanıcı Adı</label>
                  <input
                    id="username"
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    placeholder="Kullanıcı adınız"
                  />
                </div>
                
                <div className="edit-field">
                  <label htmlFor="email">E-posta (isteğe bağlı)</label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    placeholder="E-posta adresiniz"
                  />
                </div>
                
                <div className="edit-field">
                  <label htmlFor="bio">Biyografi</label>
                  <textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Kendiniz hakkında kısa bir açıklama"
                    rows={3}
                  />
                </div>
                
                <div className="edit-actions">
                  <button 
                    className="cancel-button"
                    onClick={() => setIsEditMode(false)}
                  >
                    İptal
                  </button>
                  <button 
                    className="save-button"
                    onClick={handleProfileUpdate}
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'recents':
        return (
          <div className="profile-recents-container">
            <h2 className="section-title">Son Görüntülenen Algoritmalar</h2>
            <div className="recents-header">
              <div className="recents-info">
                <span>Gezdiğiniz algoritmaların kaydı otomatik olarak tutulur</span>
              </div>
              {recentAlgorithms.length > 0 && (
                <button onClick={clearRecentAlgorithms} className="clear-button">
                  <span className="clear-icon">🗑️</span>
                  <span className="clear-text">Temizle</span>
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Yükleniyor...</div>
              </div>
            ) : recentAlgorithms.length === 0 ? (
              <div className="recents-empty">
                <div className="empty-icon">🔍</div>
                <div className="empty-message">Henüz hiç algoritma görüntülemediniz</div>
                <div className="empty-suggestion">Algoritma kütüphanesini keşfetmeye başlayın!</div>
                <Link to="/algorithms" className="explore-button">Algoritmaları Keşfet</Link>
              </div>
            ) : (
              <div className="recents-list">
                {recentAlgorithms.map(algorithm => (
                  <Link 
                    to={algorithm.url.replace('/#', '')} 
                    className="recent-item" 
                    key={algorithm.id}
                  >
                    <div className="recent-item-icon">
                      {algorithm.difficulty === 'Kolay' ? '🟢' : 
                       algorithm.difficulty === 'Orta' ? '🟠' : '🔴'}
                    </div>
                    <div className="recent-item-details">
                      <div className="recent-item-title">{algorithm.title || `Algoritma ${algorithm.id}`}</div>
                      <div className="recent-item-description">{algorithm.description || 'Açıklama mevcut değil'}</div>
                      <div className="recent-item-meta">
                        <span className="recent-complexity">{algorithm.complexity || 'O(?)'}</span>
                        <span className="recent-time">{formatDate(algorithm.lastViewed)}</span>
                        <span className="view-count">{algorithm.viewCount} kez görüntülendi</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      case 'badges':
        return (
          <div className="profile-badges-container">
            <h2 className="section-title">Rozetlerim</h2>
            {loading ? (
              <div className="badges-loading">Rozetler yükleniyor...</div>
            ) : badges.length === 0 ? (
              <div className="badges-empty">
                <div className="empty-icon">🏅</div>
                <div className="empty-message">Henüz hiç rozetiniz yok.</div>
                <div className="empty-suggestion">Uygulamayı kullanmaya devam ederek rozetler kazanabilirsiniz!</div>
              </div>
            ) : (
              <>
                {/* Kazanılan rozet sayısı */}
                <div className="badges-summary">
                  <div className="earned-count">
                    {badges.filter(b => b.earned).length} / {badges.length} rozet kazanıldı
                  </div>
                </div>
                
                {/* Rozetleri seviyelerine göre gruplandır */}
                {Object.entries(groupBadgesByLevel(badges)).map(([level, levelBadges]) => (
                  levelBadges.length > 0 && (
                    <div key={level} className="badge-level-group">
                      <h3 className="level-title">
                        <span className={`level-icon level-${level}`}>
                          {level === '1' ? '🥉' : level === '2' ? '🥈' : '🥇'}
                        </span>
                        {getLevelName(Number(level))} Rozetler
                      </h3>
                      <div className="badges-grid">
                        {levelBadges.map((badge) => (
                          <div 
                            key={badge.type} 
                            className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}
                          >
                            {badge.earned ? (
                              <div className="badge-check">
                                <span role="img" aria-label="başarıldı">✓</span>
                              </div>
                            ) : (
                              <div className="badge-lock">
                                <span role="img" aria-label="kilitli">🔒</span>
                              </div>
                            )}
                            <div className={`badge-icon level-${badge.level}`}>
                              {getBadgeIcon(badge.icon)}
                            </div>
                            <div className="badge-details">
                              <div className="badge-name">{badge.name}</div>
                              <div className="badge-description">{badge.description}</div>
                              {badge.earned ? (
                                <div className="badge-earned-date">
                                  {new Date(badge.earnedAt!).toLocaleDateString('tr-TR')} tarihinde kazanıldı
                                </div>
                              ) : (
                                <div className="badge-locked-info">
                                  <span className="lock-icon">🔒</span> Kilit • {badge.xpReward} XP Ödülü
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Rengi karartmak veya aydınlatmak için yardımcı fonksiyon
  const adjustColor = (color: string, amount: number): string => {
    return color.replace(/^#/, '')
      .match(/.{2}/g)
      ?.map(c => {
        const num = parseInt(c, 16) + amount;
        return Math.max(Math.min(num, 255), 0).toString(16).padStart(2, '0');
      })
      .join('') || color;
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
          className={`profile-tab ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          <span className="tab-icon">🏆</span>
          <span className="tab-label">Rozetlerim</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen; 