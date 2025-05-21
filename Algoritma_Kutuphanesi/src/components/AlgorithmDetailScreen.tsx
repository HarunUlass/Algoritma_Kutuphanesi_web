import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AlgorithmDetailScreen.css';
import { api } from '../services/apiClient';
import AlgorithmVisualization from './AlgorithmVisualization';
import GraphVisualization from './GraphVisualization';
import TreeVisualization from './TreeVisualization';

// Tab types
type TabType = 'description' | 'code' | 'visual';

// Backend'den gelen veri yapısına uygun arayüz
interface Algorithm {
  _id: string;
  title: string;
  description: string;
  complexity: {
    time: {
      worst: string;
      average?: string;
      best?: string;
    };
    space: string;
  };
  stability: string;
  steps: string[];
  pros: string[];
  cons: string[];
  exampleCode: {
    language: string;
    code: string;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// Boş algoritma nesnesi
const emptyAlgorithm: Algorithm = {
  _id: '',
  title: 'Yükleniyor...',
  description: '',
  complexity: {
    time: {
      worst: '',
      average: '',
      best: ''
    },
    space: ''
  },
  stability: '',
  steps: [],
  pros: [],
  cons: [],
  exampleCode: {
    language: 'javascript',
    code: ''
  }
};

interface AlgorithmDetailScreenProps {
  // Gerekli prop'lar burada tanımlanabilir
}

const AlgorithmDetailScreen: React.FC<AlgorithmDetailScreenProps> = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState<Algorithm>(emptyAlgorithm);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Backend API'den algoritma verilerini çek
  useEffect(() => {
    const fetchAlgorithmData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`${algorithmId} algoritması getiriliyor...`);
        
        // Backend API'den veri çek
        const data = await api.algorithms.getByTitle(algorithmId || '');
        console.log('Algoritma verisi yüklendi:', data);
        
        if (data) {
          setAlgorithm(data);
          
          // Dil seçeneğini örnek kodda kullanılan dile ayarla
          if (data.exampleCode && data.exampleCode.language) {
            setSelectedLanguage(data.exampleCode.language);
          }
          
          // Algoritma görüntüleme olayını tetikle
          recordAlgorithmView(data);
        } else {
          setError('Algoritma bulunamadı. Lütfen geçerli bir algoritma seçin.');
        }
      } catch (error) {
        console.error('Algoritma verisi yüklenirken hata:', error);
        setError('Algoritma verisi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    if (algorithmId) {
      fetchAlgorithmData();
    }
    
    // Sayfa yüklendiğinde sayfanın en üstüne scroll yap
    window.scrollTo(0, 0);
  }, [algorithmId]);
  
  // Algoritma görüntüleme kaydı oluştur
  const recordAlgorithmView = (algorithm: Algorithm) => {
    // Görüntüleme verilerini hazırla
    const viewData = {
      id: algorithm._id || '',
      title: algorithm.title || '',
      description: (algorithm.description || '').substring(0, 100) + (algorithm.description && algorithm.description.length > 100 ? '...' : ''),
      complexity: algorithm.complexity?.time?.worst || '',
      difficulty: getDifficulty(algorithm),
      url: `/#/algorithm/${encodeURIComponent(algorithm.title || '')}`
    };
    
    // Algoritma görüntüleme olayını özel event olarak tetikle
    const event = new CustomEvent('algorithmViewed', { detail: viewData });
    window.dispatchEvent(event);
    
    // API'ye bildir (back-end entegrasyonu)
    const userId = localStorage.getItem('userId');
    console.log('localStorage userId:', userId);
    
    if (userId) {
      // userId'den "user_" önekini kaldır (eğer varsa)
      const cleanUserId = userId.startsWith('user_') ? userId.substring(5) : userId;
      
      console.log(`Algoritma görüntüleme kaydı gönderiliyor: ${algorithm.title} (${algorithm._id || ''})`);
      console.log(`Kullanıcı ID: ${cleanUserId}`);
      
      // Backend'in çalıştığı doğru portu kullan (3000 olarak varsayıyoruz, backend/server.js'de belirtildiği gibi)
      const apiUrl = `http://localhost:3000/api/users/${cleanUserId}/algo-viewed/${algorithm._id || ''}`;
      
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          difficulty: getDifficulty(algorithm),
          title: algorithm.title  // Başlığı da gönderelim
        })
      })
      .then(response => {
        if (!response.ok) {
          console.error(`API Hatası (${response.status}): ${apiUrl}`);
          return response.text().then(text => {
            throw new Error(`HTTP Hata: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Algoritma görüntüleme kaydedildi:', data);
      })
      .catch(error => {
        console.error('Algoritma görüntüleme kaydedilemedi:', error);
        // Hata durumunda alternatif bir yaklaşım deneyebiliriz - başlığı kullanarak tekrar deneyelim
        if (algorithm.title) {
          console.log(`Alternatif yöntemle yeniden deneniyor (başlıkla): ${algorithm.title}`);
          
          fetch(`http://localhost:3000/api/users/${cleanUserId}/algo-viewed/${encodeURIComponent(algorithm.title)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              difficulty: getDifficulty(algorithm),
              title: algorithm.title
            })
          })
          .then(response => response.json())
          .then(data => console.log('Alternatif yöntemle kaydedildi:', data))
          .catch(err => console.error('Alternatif yöntem de başarısız:', err));
        }
      });
    } else {
      console.log('Kullanıcı giriş yapmadığı için görüntüleme kaydedilmiyor');
    }
    
    console.log(`"${algorithm.title}" algoritması görüntülendi`, algorithm);
  };
  
  // Algoritma zorluğunu belirle
  const getDifficulty = (algorithm: Algorithm): string => {
    // Algoritma complexity bilgisi yoksa varsayılan değer dön
    if (!algorithm?.complexity?.time?.worst) {
      return 'Belirtilmemiş';
    }
    
    // Burada algoritmanın zorluğunu belirlemek için bir mantık uygulayabiliriz
    // Örneğin, algoritmanın karmaşıklığına bakarak zorluk seviyesini belirleyebiliriz
    const worstComplexity = algorithm.complexity.time.worst;
    
    if (worstComplexity.includes('1)') || worstComplexity.includes('log n)')) {
      return 'Kolay';
    } else if (worstComplexity.includes('n log n)') || worstComplexity.includes('n)')) {
      return 'Orta';
    } else {
      return 'Zor';
    }
  };
  
  // Kopyalama durumunu sıfırla
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  // Algoritma kodunu kopyala
  const handleCopyCode = () => {
    if (algorithm.exampleCode && algorithm.exampleCode.code) {
      navigator.clipboard.writeText(algorithm.exampleCode.code);
      setCopied(true);
    }
  };
  
  // Yükleme durumunda göster
  if (loading) {
    return (
      <div className="algorithm-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Algoritma bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  // Hata durumunda göster
  if (error) {
    // Algoritma bulunamadığında "Yakında Gelecek" şablonu göster
    return (
      <div className="algorithm-detail-container">
        <div className="algorithm-detail-header">
          <a href="#" className="back-button" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
            ←
          </a>
          <h1 className="header-title">{algorithmId}</h1>
          <button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        <div className="algorithm-detail-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'description' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Açıklama
            </button>
            <button 
              className={`tab ${activeTab === 'code' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Kod
            </button>
            <button 
              className={`tab ${activeTab === 'visual' ? 'active-tab' : ''}`}
              onClick={() => setActiveTab('visual')}
            >
              Görselleştirme
            </button>
          </div>

          <div className="content-container">
            {activeTab === 'description' && (
              <div className="description-container">
                <div className="summary-section">
                  <p className="description-text">
                    <span className="coming-soon">Yakında Gelecek</span>
                    <br />
                    Bu algoritmanın detaylı açıklaması eklenecektir.
                  </p>
                </div>
                
                <div className="section">
                  <h3 className="section-title">Zaman ve Alan Karmaşıklığı</h3>
                  <div className="complexity-container">
                    <div className="complexity-row">
                      <span className="complexity-label">Zaman Karmaşıklığı (Ortalama):</span>
                      <div className="complexity-badge" style={{ backgroundColor: '#6c5ce7' }}>
                        <span className="complexity-value">Yakında Eklenecek</span>
                      </div>
                    </div>
                    <div className="complexity-row">
                      <span className="complexity-label">Zaman Karmaşıklığı (En Kötü):</span>
                      <div className="complexity-badge" style={{ backgroundColor: '#e74c3c' }}>
                        <span className="complexity-value">Yakında Eklenecek</span>
                      </div>
                    </div>
                    <div className="complexity-row">
                      <span className="complexity-label">Zaman Karmaşıklığı (En İyi):</span>
                      <div className="complexity-badge" style={{ backgroundColor: '#2ecc71' }}>
                        <span className="complexity-value">Yakında Eklenecek</span>
                      </div>
                    </div>
                    <div className="complexity-row">
                      <span className="complexity-label">Alan Karmaşıklığı:</span>
                      <div className="complexity-badge" style={{ backgroundColor: '#3498db' }}>
                        <span className="complexity-value">Yakında Eklenecek</span>
                      </div>
                    </div>
                    <div className="complexity-row">
                      <span className="complexity-label">Stabilite:</span>
                      <div className="complexity-badge" style={{ backgroundColor: '#9b59b6' }}>
                        <span className="complexity-value">Yakında Eklenecek</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="section">
                  <h3 className="section-title">Algoritma Adımları</h3>
                  <ol className="steps-list">
                    <li className="step-item">Yakında algoritma adımları eklenecektir.</li>
                  </ol>
                </div>
                
                <div className="section">
                  <h3 className="section-title">Avantajlar ve Dezavantajlar</h3>
                  <div className="pros-cons-container">
                    <div className="pros-section">
                      <h4>Avantajlar</h4>
                      <ul className="pros-list">
                        <li className="pro-item">Yakında eklenecek</li>
                      </ul>
                    </div>
                    <div className="cons-section">
                      <h4>Dezavantajlar</h4>
                      <ul className="cons-list">
                        <li className="con-item">Yakında eklenecek</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'code' && (
              <div className="code-container">
                <div className="language-selector">
                  <button className="language-button active">
                    JavaScript
                  </button>
                </div>
                
                <pre className="code-block">
                  <code>{`// Bu algoritmanın kodu yakında eklenecektir.
// Çalışmalarımız devam ediyor...

function comingSoon() {
  console.log("Yakında bu algoritmanın kodunu burada görebileceksiniz!");
  return "Çok yakında!";
}`}</code>
                </pre>
                
                <div className="button-container">
                  <button className="action-button secondary">
                    Kopyala
                  </button>
                  <button className="action-button">
                    Çalıştır
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'visual' && (
              <div className="visual-container">
                <h2 className="visualization-title">Bubble Sort Görselleştirmesi</h2>
                
                <div className="controls-container">
                  <button className="control-button">Yeni Dizi</button>
                  <button className="control-button primary">Başlat</button>
                  <div className="speed-control">
                    <label htmlFor="speed">Hız:</label>
                    <input 
                      id="speed"
                      type="range" 
                      min="100" 
                      max="1000" 
                      step="100"
                      defaultValue="500"
                    />
                  </div>
                </div>

                <div className="explanation-box">
                  <p>Görselleştirmeyi başlatmak için "Başlat" düğmesine tıklayın.</p>
                </div>

                <div className="visualization-area">
                  <div className="array-bar" style={{ height: '120px', width: '30px', backgroundColor: '#6c5ce7', margin: '0 5px' }}>
                    <span className="bar-value">60</span>
                  </div>
                  <div className="array-bar" style={{ height: '80px', width: '30px', backgroundColor: '#6c5ce7', margin: '0 5px' }}>
                    <span className="bar-value">40</span>
                  </div>
                  <div className="array-bar" style={{ height: '160px', width: '30px', backgroundColor: '#6c5ce7', margin: '0 5px' }}>
                    <span className="bar-value">80</span>
                  </div>
                  <div className="array-bar" style={{ height: '100px', width: '30px', backgroundColor: '#6c5ce7', margin: '0 5px' }}>
                    <span className="bar-value">50</span>
                  </div>
                  <div className="array-bar" style={{ height: '140px', width: '30px', backgroundColor: '#6c5ce7', margin: '0 5px' }}>
                    <span className="bar-value">70</span>
                  </div>
                  <div className="array-bar" style={{ height: '180px', width: '30px', backgroundColor: '#6c5ce7', margin: '0 5px' }}>
                    <span className="bar-value">90</span>
                  </div>
                  <div className="array-bar" style={{ height: '60px', width: '30px', backgroundColor: '#6c5ce7', margin: '0 5px' }}>
                    <span className="bar-value">30</span>
                  </div>
                  <div className="array-bar" style={{ height: '200px', width: '30px', backgroundColor: '#6c5ce7', margin: '0 5px' }}>
                    <span className="bar-value">100</span>
                  </div>
                </div>
                
                <div className="algorithm-info">
                  <h3>Kabarcık Sıralama (Bubble Sort)</h3>
                  <p>Kabarcık sıralama, her adımda yanyana duran elemanları karşılaştırıp, sıralamaya aykırı olanları yer değiştiren basit bir sıralama algoritmasıdır.</p>
                  
                  <div className="complexity-info">
                    <div className="complexity-item">
                      <span className="complexity-label">Zaman Karmaşıklığı:</span>
                      <span className="complexity-value" style={{color: '#e67e22'}}>O(n²)</span>
                    </div>
                    <div className="complexity-item">
                      <span className="complexity-label">Alan Karmaşıklığı:</span>
                      <span className="complexity-value" style={{color: '#27ae60'}}>O(1)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="algorithm-detail-container">
      <div className="algorithm-detail-header">
        <a href="#" className="back-button" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
          ←
        </a>
        <h1 className="header-title">{algorithm.title}</h1>
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="algorithm-detail-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'description' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Açıklama
          </button>
          <button 
            className={`tab ${activeTab === 'code' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            Kod
          </button>
          <button 
            className={`tab ${activeTab === 'visual' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('visual')}
          >
            Görselleştirme
          </button>
        </div>

        <div className="content-container">
          {activeTab === 'description' && (
            <div className="description-container">
              <div className="summary-section">
                <p className="description-text">{algorithm.description}</p>
              </div>
              
              <div className="section">
                <h3 className="section-title">Zaman ve Alan Karmaşıklığı</h3>
                <div className="complexity-container">
                  {algorithm.complexity?.time?.average && (
                    <div className="complexity-row">
                      <span className="complexity-label">Zaman Karmaşıklığı (Ortalama):</span>
                      <div className="complexity-badge" style={{ backgroundColor: '#6c5ce7' }}>
                        <span className="complexity-value">{algorithm.complexity.time.average}</span>
                      </div>
                    </div>
                  )}
                  <div className="complexity-row">
                    <span className="complexity-label">Zaman Karmaşıklığı (En Kötü):</span>
                    <div className="complexity-badge" style={{ backgroundColor: '#e74c3c' }}>
                      <span className="complexity-value">{algorithm.complexity?.time?.worst || 'Belirtilmemiş'}</span>
                    </div>
                  </div>
                  {algorithm.complexity?.time?.best && (
                    <div className="complexity-row">
                      <span className="complexity-label">Zaman Karmaşıklığı (En İyi):</span>
                      <div className="complexity-badge" style={{ backgroundColor: '#2ecc71' }}>
                        <span className="complexity-value">{algorithm.complexity.time.best}</span>
                      </div>
                    </div>
                  )}
                  <div className="complexity-row">
                    <span className="complexity-label">Alan Karmaşıklığı:</span>
                    <div className="complexity-badge" style={{ backgroundColor: '#3498db' }}>
                      <span className="complexity-value">{algorithm.complexity?.space || 'Belirtilmemiş'}</span>
                    </div>
                  </div>
                  <div className="complexity-row">
                    <span className="complexity-label">Stabilite:</span>
                    <div className="complexity-badge" style={{ backgroundColor: '#9b59b6' }}>
                      <span className="complexity-value">{algorithm.stability || 'Belirtilmemiş'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section">
                <h3 className="section-title">Algoritma Adımları</h3>
                <ol className="steps-list">
                  {algorithm.steps && algorithm.steps.length > 0 ? (
                    algorithm.steps.map((step, index) => (
                      <li key={index} className="step-item">{step}</li>
                    ))
                  ) : (
                    <li className="step-item">Adım bilgisi henüz eklenmemiş.</li>
                  )}
                </ol>
              </div>
              
              <div className="section">
                <h3 className="section-title">Avantajlar ve Dezavantajlar</h3>
                <div className="pros-cons-container">
                  <div className="pros-section">
                    <h4>Avantajlar</h4>
                    <ul className="pros-list">
                      {algorithm.pros && algorithm.pros.length > 0 ? (
                        algorithm.pros.map((pro, index) => (
                          <li key={index} className="pro-item">{pro}</li>
                        ))
                      ) : (
                        <li className="pro-item">Avantaj bilgisi henüz eklenmemiş.</li>
                      )}
                    </ul>
                  </div>
                  <div className="cons-section">
                    <h4>Dezavantajlar</h4>
                    <ul className="cons-list">
                      {algorithm.cons && algorithm.cons.length > 0 ? (
                        algorithm.cons.map((con, index) => (
                          <li key={index} className="con-item">{con}</li>
                        ))
                      ) : (
                        <li className="con-item">Dezavantaj bilgisi henüz eklenmemiş.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'code' && (
            <div className="code-container">
              <div className="language-selector">
                <button
                  className={`language-button active`}
                  onClick={() => setSelectedLanguage(algorithm.exampleCode?.language || 'javascript')}
                >
                  {(algorithm.exampleCode?.language || 'javascript').charAt(0).toUpperCase() + (algorithm.exampleCode?.language || 'javascript').slice(1)}
                </button>
              </div>
              
              <pre className="code-block">
                <code>{algorithm.exampleCode?.code || 'Kod örneği bulunamadı'}</code>
              </pre>
              
              <div className="button-container">
                <button 
                  className="action-button secondary"
                  onClick={handleCopyCode}
                >
                  {copied ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
                <button className="action-button">
                  Çalıştır
                </button>
                <button 
                  className="action-button quiz-button"
                  onClick={() => navigate(`/quiz/${algorithm._id}`)}
                >
                  Quiz'i Başlat
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'visual' && (
            <div className="visual-container">
              {algorithm.title.toLowerCase().includes('bubble') || 
               algorithm.title.toLowerCase().includes('kabarcık') || 
               algorithm.title.toLowerCase().includes('kabarck') ? (
                <AlgorithmVisualization 
                  algorithmType="bubble sort"
                  title="Kabarcık Sıralama (Bubble Sort)"
                  animationSpeed={500}
                />
              ) : algorithm.title.toLowerCase().includes('kırmızı-siyah') || 
                  algorithm.title.toLowerCase().includes('kirmizi-siyah') || 
                  algorithm.title.toLowerCase().includes('red-black') ? (
                <TreeVisualization 
                  algorithmType="red-black tree"
                  title="Kırmızı-Siyah Ağaç"
                  animationSpeed={500}
                />
              ) : (
                <>
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <rect width="120" height="20" x="15" y="20" rx="5" fill="#FF8C00" opacity="0.2" />
                    <rect width="80" height="20" x="15" y="50" rx="5" fill="#FF8C00" opacity="0.4" />
                    <rect width="60" height="20" x="15" y="80" rx="5" fill="#FF8C00" opacity="0.6" />
                    <rect width="40" height="20" x="15" y="110" rx="5" fill="#FF8C00" opacity="0.8" />
                  </svg>
                  <div>
                    <p className="coming-soon">Görselleştirme Çok Yakında</p>
                    <p>Algoritma görselleştirme özelliği üzerinde çalışıyoruz. Yakında kullanıma sunulacaktır.</p>
                  </div>
                  <div className="button-container">
                    <button className="action-button secondary">
                      Bildirim Al
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDetailScreen;