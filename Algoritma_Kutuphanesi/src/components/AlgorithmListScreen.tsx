import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/AlgorithmListScreen.css';
import { FaArrowLeft, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

// Veri tipleri
interface Algorithm {
  id: string;
  title: string;
  description: string;
  complexity: string;
  difficulty: string;
  category: string;
  subCategory: string;
}

interface SubCategories {
  [key: string]: Algorithm[];
}

// Sabit algoritma verileri
const algorithmData: Algorithm[] = [
  // Veri Yapıları - Diziler
  {
    id: '1',
    title: 'Bubble Sort',
    description: 'Yan yana bulunan elemanları karşılaştırarak sıralama yapan basit bir algoritmadır.',
    complexity: 'O(n²)',
    difficulty: 'Kolay',
    category: '1',
    subCategory: 'Diziler'
  },
  {
    id: '2',
    title: 'Selection Sort',
    description: 'Her adımda dizideki en küçük elemanı bulup doğru konuma yerleştiren bir sıralama algoritmasıdır.',
    complexity: 'O(n²)',
    difficulty: 'Kolay',
    category: '1',
    subCategory: 'Diziler'
  },
  {
    id: '3',
    title: 'Insertion Sort',
    description: 'Diziyi tek tek eleman ekleyerek sıralayan, küçük veri setleri için etkili bir sıralama algoritmasıdır.',
    complexity: 'O(n²)',
    difficulty: 'Kolay',
    category: '1',
    subCategory: 'Diziler'
  },
  {
    id: '4',
    title: 'Merge Sort',
    description: 'Böl ve yönet stratejisini kullanarak veriyi sıralayan etkili bir algoritmadır.',
    complexity: 'O(n log n)',
    difficulty: 'Orta',
    category: '1',
    subCategory: 'Diziler'
  },
  {
    id: '5',
    title: 'Quick Sort',
    description: 'Böl ve yönet yaklaşımını kullanan hızlı ve verimli bir sıralama algoritmasıdır.',
    complexity: 'O(n log n)',
    difficulty: 'Orta',
    category: '1',
    subCategory: 'Diziler'
  },
  {
    id: '6',
    title: 'Binary Search',
    description: 'Sıralı bir dizide bir elemanın verimli şekilde aranmasını sağlayan algoritmadır.',
    complexity: 'O(log n)',
    difficulty: 'Kolay',
    category: '1',
    subCategory: 'Diziler'
  },
  
  // Veri Yapıları - Bağlı Listeler
  {
    id: '7',
    title: 'Tek Yönlü Bağlı Liste',
    description: 'Her düğümün bir sonraki düğüme işaret ettiği bir veri yapısıdır.',
    complexity: 'O(n)',
    difficulty: 'Kolay',
    category: '1',
    subCategory: 'Bağlı Listeler'
  },
  {
    id: '8',
    title: 'Çift Yönlü Bağlı Liste',
    description: 'Her düğümün bir önceki ve bir sonraki düğüme işaret ettiği bir veri yapısıdır.',
    complexity: 'O(n)',
    difficulty: 'Orta',
    category: '1',
    subCategory: 'Bağlı Listeler'
  },
  {
    id: '9',
    title: 'Dairesel Bağlı Liste',
    description: 'Son düğümün ilk düğüme işaret ettiği, sürekli bir döngü oluşturan bağlı liste yapısıdır.',
    complexity: 'O(n)',
    difficulty: 'Orta',
    category: '1',
    subCategory: 'Bağlı Listeler'
  },
  
  // Veri Yapıları - Ağaçlar
  {
    id: '10',
    title: 'İkili Arama Ağacı',
    description: 'Her düğümün sol alt ağacındaki değerlerin kendisinden küçük, sağ alt ağacındaki değerlerin kendisinden büyük olduğu veri yapısıdır.',
    complexity: 'O(log n)',
    difficulty: 'Orta',
    category: '1',
    subCategory: 'Ağaçlar'
  },
  {
    id: '11',
    title: 'AVL Ağacı',
    description: 'Kendi kendini dengeleyen bir ikili arama ağacı türüdür.',
    complexity: 'O(log n)',
    difficulty: 'Zor',
    category: '1',
    subCategory: 'Ağaçlar'
  },
  {
    id: '12',
    title: 'Kırmızı-Siyah Ağaç',
    description: 'Kendi kendini dengeleyen ikili bir arama ağacı türüdür. Her düğüm kırmızı veya siyah renge sahiptir.',
    complexity: 'O(log n)',
    difficulty: 'Zor',
    category: '1',
    subCategory: 'Ağaçlar'
  },
  
  // Makine Öğrenmesi - Denetimli Öğrenme
  {
    id: '13',
    title: 'Karar Ağaçları',
    description: 'Verilerin özelliklerine göre sınıflandırma yapan ağaç yapısında bir modeldir.',
    complexity: 'O(n log n)',
    difficulty: 'Orta',
    category: '3',
    subCategory: 'Denetimli Öğrenme'
  },
  {
    id: '14',
    title: 'Destek Vektör Makineleri',
    description: 'Veri noktalarını ayıran optimum hiper düzlemi bulmaya çalışan bir sınıflandırma algoritmasıdır.',
    complexity: 'O(n²)',
    difficulty: 'Zor',
    category: '3',
    subCategory: 'Denetimli Öğrenme'
  },
  
  // Makine Öğrenmesi - Denetimsiz Öğrenme
  {
    id: '15',
    title: 'K-Means Kümeleme',
    description: 'Verileri k sayıda kümeye ayıran bir kümeleme algoritmasıdır.',
    complexity: 'O(k·n·t)',
    difficulty: 'Orta',
    category: '3', 
    subCategory: 'Denetimsiz Öğrenme'
  },
  
  // Derin Öğrenme
  {
    id: '16',
    title: 'Geri Yayılım Algoritması',
    description: 'Yapay sinir ağlarının eğitiminde kullanılan gradyan tabanlı bir optimizasyon algoritmasıdır.',
    complexity: 'O(n²)',
    difficulty: 'Zor',
    category: '2',
    subCategory: 'Sinir Ağları'
  },
  {
    id: '17',
    title: 'Evrişimli Sinir Ağları',
    description: 'Görüntü tanıma ve işleme için tasarlanmış derin öğrenme mimarisidir.',
    complexity: 'O(n⁴)',
    difficulty: 'Zor',
    category: '2',
    subCategory: 'CNN'
  }
];

// Kategori bilgileri
const categories = {
  '1': {
    id: '1',
    title: 'Veri Yapıları',
    icon: '🏗️',
    description: 'Diziler, Bağlı Listeler, Ağaçlar, Hash Tabloları ve daha fazlası',
    color: '#3498db',
    subCategories: ['Diziler', 'Bağlı Listeler', 'Ağaçlar']
  },
  '2': {
    id: '2',
    title: 'Derin Öğrenme',
    icon: '🧠',
    description: 'Yapay Sinir Ağları, CNN, RNN ve derin öğrenme mimarileri',
    color: '#9b59b6',
    subCategories: ['Sinir Ağları', 'CNN', 'RNN']
  },
  '3': {
    id: '3',
    title: 'Makine Öğrenmesi',
    icon: '🤖',
    description: 'Regresyon, Sınıflandırma, Kümeleme ve diğer ML algoritmaları',
    color: '#e74c3c',
    subCategories: ['Denetimli Öğrenme', 'Denetimsiz Öğrenme', 'Pekiştirmeli Öğrenme']
  }
};

const difficultyColors = {
  'Kolay': '#27ae60',
  'Orta': '#f39c12',
  'Zor': '#e74c3c',
};

const AlgorithmListScreen = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  
  // Kategoriye ait algoritmaları gruplayarak alt kategorilere ayır
  const getSubCategoriesWithAlgorithms = () => {
    // Kategoriye ait tüm algoritmaları filtrele
    const categoryAlgorithms = algorithmData.filter(algo => algo.category === categoryId);
    
    // Alt kategorilere göre grupla
    const grouped: SubCategories = {};
    
    if (category?.subCategories) {
      // Önce tüm alt kategorileri boş dizilerle başlat
      category.subCategories.forEach(subCat => {
        grouped[subCat] = [];
      });
      
      // Algoritmaları uygun alt kategorilere yerleştir
      categoryAlgorithms.forEach(algo => {
        if (grouped[algo.subCategory]) {
          grouped[algo.subCategory].push(algo);
        }
      });
    }
    
    return grouped;
  };
  
  const category = categoryId ? categories[categoryId as keyof typeof categories] : null;
  const subCategories = getSubCategoriesWithAlgorithms();
  
  // Sayfa yüklendiğinde varsayılan alt kategoriyi seç
  useEffect(() => {
    if (category?.subCategories && category.subCategories.length > 0) {
      setSelectedSubCategory(category.subCategories[0]);
    } else {
      setSelectedSubCategory(null);
    }
    // Filtreleri sıfırla
    setDifficultyFilter([]);
    setSearchQuery('');
  }, [categoryId]);
  
  // Alt kategori seçimi değiştiğinde çalışır
  const handleSubCategoryClick = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };
  
  // Arama input değiştiğinde çalışır
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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

  // Filtreleri temizle
  const clearFilters = () => {
    setDifficultyFilter([]);
    setSearchQuery('');
  };
  
  // Görüntülenecek algoritmaları filtrele
  const filteredAlgorithms = () => {
    if (!selectedSubCategory) return [];
    
    let allAlgorithms = subCategories[selectedSubCategory] || [];
    
    // Zorluk filtresini uygula
    if (difficultyFilter.length > 0) {
      allAlgorithms = allAlgorithms.filter(algorithm => 
        difficultyFilter.includes(algorithm.difficulty)
      );
    }
    
    // Arama sorgusunu uygula
    if (searchQuery.trim()) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      return allAlgorithms.filter(algorithm => 
        algorithm.title.toLowerCase().includes(lowerSearchQuery) || 
        algorithm.description.toLowerCase().includes(lowerSearchQuery) ||
        algorithm.complexity.toLowerCase().includes(lowerSearchQuery)
      );
    }
    
    return allAlgorithms;
  };

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
  
  // Kategori bulunamadıysa göster
  if (!category) {
    return (
      <div className="algorithm-list-container">
        <div className="error-container">
          <h2>Kategori Bulunamadı</h2>
          <p>Belirtilen kategori bulunamadı. Lütfen geçerli bir kategori seçin.</p>
          <button 
            className="action-button"
            onClick={() => navigate('/')}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="algorithm-list-page">
      <div className="header-container">
        <Link to="/" className="back-button">
          <FaArrowLeft />
        </Link>
        <h1 className="category-title">
          <span className="category-icon">{category.icon}</span>
          {category.title}
        </h1>
        <div className="actions-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Algoritma ara..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery ? (
              <FaTimes 
                className="search-clear-icon" 
                onClick={() => setSearchQuery('')}
              />
            ) : (
              <FaSearch className="search-icon" />
            )}
          </div>
          <button 
            className={`filter-button ${isFilterOpen ? 'active' : ''}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label="Filtrele"
          >
            <FaFilter />
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="filter-panel">
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
          <div className="filter-actions">
            <button className="clear-filters-button" onClick={clearFilters}>
              Filtreleri Temizle
            </button>
            <button className="close-filters-button" onClick={() => setIsFilterOpen(false)}>
              Kapat
            </button>
          </div>
        </div>
      )}

      <div className="subcategories-container">
        {category.subCategories.map((subCategory) => (
          <button
            key={subCategory}
            className={`subcategory-button ${selectedSubCategory === subCategory ? "active" : ""}`}
            onClick={() => handleSubCategoryClick(subCategory)}
          >
            {subCategory}
          </button>
        ))}
      </div>

      <div className="algorithms-container">
        {filteredAlgorithms().length > 0 ? (
          filteredAlgorithms().map((algorithm) => (
            <Link 
              to={`/algorithm/${algorithm.title}`} 
              key={algorithm.id} 
              className="algorithm-card"
            >
              <div className="algorithm-title-row">
                <h3 className="algorithm-title">
                  {searchQuery ? highlightText(algorithm.title, searchQuery) : algorithm.title}
                </h3>
                <div 
                  className="difficulty-badge"
                  style={{ backgroundColor: difficultyColors[algorithm.difficulty as keyof typeof difficultyColors] }}
                >
                  {algorithm.difficulty}
                </div>
              </div>
              <p className="algorithm-description">
                {searchQuery ? highlightText(algorithm.description, searchQuery) : algorithm.description}
              </p>
              <div className="complexity-badge">
                <span className="complexity-label">Karmaşıklık:</span>
                <span className="complexity-value">
                  {searchQuery ? highlightText(algorithm.complexity, searchQuery) : algorithm.complexity}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-results">
            <p>
              {(searchQuery.trim() || difficultyFilter.length > 0)
                ? 'Arama kriterlerinize uygun algoritma bulunamadı.'
                : 'Yakında Gelecek'
              }
            </p>
            {(searchQuery.trim() || difficultyFilter.length > 0) && (
              <button className="clear-filters-button" onClick={clearFilters}>
                Filtreleri Temizle
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="results-summary">
        {filteredAlgorithms().length > 0 && (
          <p>{filteredAlgorithms().length} algoritma bulundu</p>
        )}
      </div>
    </div>
  );
};

export default AlgorithmListScreen; 