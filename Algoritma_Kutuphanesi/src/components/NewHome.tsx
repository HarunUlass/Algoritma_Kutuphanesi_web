import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NewHome.css';
import logoImage from '../assets/logo.png';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { getAllQuizzes, Quiz } from '../services/quizService';

// Kategori türünü tanımlayalım
interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  subCategories: string[];
}

// Algoritma araması için model
interface Algorithm {
  id: string;
  title: string;
  description: string;
  icon?: string;
  complexity: string;
  category: string;
  subCategory?: string;
  difficulty?: string;
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

// Tüm algoritmaların bir listesi (arama için)
const allAlgorithms: Algorithm[] = [
  ...featuredCards.map(card => ({
    ...card,
    category: '0',
    difficulty: 'Orta'
  })),
  {
    id: '5',
    title: 'Bubble Sort',
    description: 'Yan yana bulunan elemanları karşılaştırarak sıralama yapan basit bir algoritmadır.',
    complexity: 'O(n²)',
    difficulty: 'Kolay',
    category: '1',
    subCategory: 'Diziler',
    icon: '🔄'
  },
  {
    id: '6',
    title: 'Quick Sort',
    description: 'Böl ve yönet yaklaşımını kullanan hızlı ve verimli bir sıralama algoritmasıdır.',
    complexity: 'O(n log n)',
    difficulty: 'Orta',
    category: '1',
    subCategory: 'Diziler',
    icon: '⚡'
  },
  {
    id: '7',
    title: 'Binary Search',
    description: 'Sıralı bir dizide bir elemanın verimli şekilde aranmasını sağlayan algoritmadır.',
    complexity: 'O(log n)',
    difficulty: 'Kolay',
    category: '1',
    subCategory: 'Diziler',
    icon: '🔍'
  },
  {
    id: '8',
    title: 'İkili Arama Ağacı',
    description: 'Her düğümün sol alt ağacındaki değerlerin kendisinden küçük, sağ alt ağacındaki değerlerin kendisinden büyük olduğu veri yapısıdır.',
    complexity: 'O(log n)',
    difficulty: 'Orta',
    category: '1',
    subCategory: 'Ağaçlar',
    icon: '🌳'
  },
  {
    id: '9',
    title: 'K-Means Kümeleme',
    description: 'Verileri k sayıda kümeye ayıran bir kümeleme algoritmasıdır.',
    complexity: 'O(k·n·t)',
    difficulty: 'Orta',
    category: '3',
    subCategory: 'Denetimsiz Öğrenme',
    icon: '📊'
  },
  {
    id: '10',
    title: 'Evrişimli Sinir Ağları',
    description: 'Görüntü tanıma ve işleme için tasarlanmış derin öğrenme mimarisidir.',
    complexity: 'O(n⁴)',
    difficulty: 'Zor',
    category: '2',
    subCategory: 'CNN',
    icon: '🧠'
  }
];

const difficultyColors = {
  'Kolay': '#27ae60',
  'Orta': '#f39c12',
  'Zor': '#e74c3c',
};

const NewHome: React.FC = () => {
  // localStorage'dan oturum durumunu kontrol et
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username') || '';
  const userInitial = username ? username.charAt(0).toUpperCase() : 'G';
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  
  // Arama panelini aç/kapat
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setDifficultyFilter([]);
      setCategoryFilter([]);
    }
  };
  
  // Zorluk filtresini değiştir
  const handleDifficultyFilterChange = (difficulty: string) => {
    setDifficultyFilter(prev => {
      if (prev.includes(difficulty)) {
        return prev.filter(d => d !== difficulty);
      } else {
        return [...prev, difficulty];
      }
    });
  };
  
  // Kategori filtresini değiştir
  const handleCategoryFilterChange = (categoryId: string) => {
    setCategoryFilter(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(c => c !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  // Filtreleri temizle
  const clearFilters = () => {
    setDifficultyFilter([]);
    setCategoryFilter([]);
    setSearchQuery('');
  };
  
  // Arama sonuçlarını filtrele
  const filteredAlgorithms = () => {
    let results = [...allAlgorithms];
    
    // Zorluk filtresini uygula
    if (difficultyFilter.length > 0) {
      results = results.filter(algorithm => 
        algorithm.difficulty && difficultyFilter.includes(algorithm.difficulty)
      );
    }
    
    // Kategori filtresini uygula
    if (categoryFilter.length > 0) {
      results = results.filter(algorithm => 
        categoryFilter.includes(algorithm.category)
      );
    }
    
    // Arama sorgusunu uygula
    if (searchQuery.trim()) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      return results.filter(algorithm => 
        algorithm.title.toLowerCase().includes(lowerSearchQuery) || 
        algorithm.description.toLowerCase().includes(lowerSearchQuery) ||
        (algorithm.complexity && algorithm.complexity.toLowerCase().includes(lowerSearchQuery))
      );
    }
    
    return results;
  };
  
  // Arama sonuçları
  const searchResults = filteredAlgorithms();
  
  // Metni vurgula (arama terimine göre)
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    if (!lowerText.includes(lowerQuery)) return text;
    
    const startIndex = lowerText.indexOf(lowerQuery);
    const endIndex = startIndex + lowerQuery.length;
    
    return (
      <>
        {text.substring(0, startIndex)}
        <span className="highlight">{text.substring(startIndex, endIndex)}</span>
        {text.substring(endIndex)}
      </>
    );
  };

  // Algoritma detay sayfasına git
  const goToAlgorithmDetail = (algorithmTitle: string) => {
    navigate(`/algorithm/${algorithmTitle}`);
    setIsSearchOpen(false);
  };

  return (
    <div className="home-safe-area">
      <div className="home-content">
        <header className="home-header">
          <div className="home-logo">
            <img src={logoImage} alt="Logo" className="logo-fallback" />
            <div className="home-logo-text">Algoritma Kütüphanesi</div>
          </div>
          <div className="header-right">
            <button className="search-button" onClick={toggleSearch}>
              {isSearchOpen ? <FaTimes /> : <FaSearch />}
            </button>
            <Link to={isLoggedIn ? "/profile" : "/login"} className="profile-button">
              {isLoggedIn ? userInitial : '🔑'}
            </Link>
          </div>
        </header>
        
        {isSearchOpen && (
          <div className="search-panel">
            <div className="search-header">
              <div className="search-input-container">
                <FaSearch className="search-input-icon" />
                <input
                  type="text"
                  placeholder="Algoritma ara..."
                  className="search-input-field"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <FaTimes 
                    className="search-clear-icon" 
                    onClick={() => setSearchQuery('')}
                  />
                )}
              </div>
            </div>
            
            <div className="filter-options">
              <div className="filter-section">
                <h3>Zorluk Derecesi</h3>
                <div className="difficulty-filters">
                  {Object.keys(difficultyColors).map(difficulty => (
                    <label key={difficulty} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={difficultyFilter.includes(difficulty)}
                        onChange={() => handleDifficultyFilterChange(difficulty)}
                      />
                      <span 
                        className="difficulty-label"
                        style={{ backgroundColor: difficultyColors[difficulty as keyof typeof difficultyColors] }}
                      >
                        {difficulty}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <h3>Kategoriler</h3>
                <div className="category-filters">
                  {categories.map(category => (
                    <label key={category.id} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={categoryFilter.includes(category.id)}
                        onChange={() => handleCategoryFilterChange(category.id)}
                      />
                      <span className="category-filter-label" style={{ color: category.color }}>
                        {category.icon} {category.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {(difficultyFilter.length > 0 || categoryFilter.length > 0 || searchQuery) && (
                <button className="clear-filters-button" onClick={clearFilters}>
                  Filtreleri Temizle
                </button>
              )}
            </div>
            
            <div className="search-results">
              <div className="results-header">
                {searchResults.length > 0 ? (
                  <span>{searchResults.length} algoritma bulundu</span>
                ) : (
                  <span>Sonuç bulunamadı</span>
                )}
              </div>
              
              <div className="results-list">
                {searchResults.map(algorithm => (
                  <div 
                    className="search-result-item" 
                    key={algorithm.id}
                    onClick={() => goToAlgorithmDetail(algorithm.title)}
                  >
                    <div className="result-item-icon">
                      {algorithm.icon}
                    </div>
                    <div className="result-item-info">
                      <div className="result-item-title">
                        {searchQuery ? highlightText(algorithm.title, searchQuery) : algorithm.title}
                        {algorithm.difficulty && (
                          <span 
                            className="result-difficulty"
                            style={{ backgroundColor: difficultyColors[algorithm.difficulty as keyof typeof difficultyColors] }}
                          >
                            {algorithm.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="result-item-description">
                        {searchQuery ? highlightText(algorithm.description, searchQuery) : algorithm.description}
                      </div>
                      <div className="result-item-complexity">
                        <span>Karmaşıklık:</span> 
                        {searchQuery ? highlightText(algorithm.complexity, searchQuery) : algorithm.complexity}
                      </div>
                    </div>
                  </div>
                ))}
                
                {searchResults.length === 0 && (
                  <div className="no-results-message">
                    <p>Arama kriterlerinize uygun algoritma bulunamadı.</p>
                    <p>Farklı bir arama terimi deneyin veya filtreleri değiştirin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
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
        const [quizzes, setQuizzes] = useState<Quiz[]>([]);
        const [quizLoading, setQuizLoading] = useState<boolean>(true);
        const [quizError, setQuizError] = useState<string | null>(null);
        
        useEffect(() => {
          const fetchQuizzes = async () => {
            setQuizLoading(true);
            setQuizError(null);
            try {
              const data = await getAllQuizzes();
              setQuizzes(data);
            } catch (err) {
              setQuizError('Quizler yüklenirken hata oluştu.');
            } finally {
              setQuizLoading(false);
            }
          };
          fetchQuizzes();
        }, []);
      </div>
    </div>
  );
};

export default NewHome;