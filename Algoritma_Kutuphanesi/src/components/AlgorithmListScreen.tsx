import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/AlgorithmListScreen.css';

// Veri tipleri
interface Algorithm {
  id: string;
  title: string;
  description: string;
  complexity: string;
  difficulty: string;
}

interface SubCategories {
  [key: string]: Algorithm[];
}

interface AllCategories {
  [key: string]: SubCategories;
}

// Mock veri
const dataStructuresSubCategories: SubCategories = {
  'Diziler': [
    {
      id: '1',
      title: 'Bubble Sort',
      complexity: 'O(n²)',
      difficulty: 'Kolay',
      description: 'Yan yana bulunan elemanları karşılaştırarak sıralama yapan basit bir algoritmadır.'
    },
    {
      id: '2',
      title: 'Binary Search',
      complexity: 'O(log n)',
      difficulty: 'Kolay',
      description: 'Sıralı bir dizide bir elemanın verimli şekilde aranmasını sağlayan algoritmadır.'
    },
    {
      id: '3',
      title: 'Merge Sort',
      complexity: 'O(n log n)',
      difficulty: 'Orta',
      description: 'Böl ve yönet stratejisini kullanarak veriyi sıralayan etkili bir algoritmadır.'
    },
    {
      id: '4',
      title: 'Quick Sort',
      complexity: 'O(n log n)',
      difficulty: 'Orta',
      description: 'Böl ve yönet yaklaşımını kullanan hızlı ve verimli bir sıralama algoritmasıdır.'
    }
  ],
  'Bağlı Listeler': [
    {
      id: '5',
      title: 'Tek Yönlü Bağlı Liste',
      complexity: 'O(n)',
      difficulty: 'Kolay',
      description: 'Her düğümün bir sonraki düğüme işaret ettiği bir veri yapısıdır.'
    },
    {
      id: '6',
      title: 'Çift Yönlü Bağlı Liste',
      complexity: 'O(n)',
      difficulty: 'Orta',
      description: 'Her düğümün bir önceki ve bir sonraki düğüme işaret ettiği bir veri yapısıdır.'
    }
  ],
  'Ağaçlar': [
    {
      id: '7',
      title: 'İkili Arama Ağacı',
      complexity: 'O(log n)',
      difficulty: 'Orta',
      description: 'Her düğümün sol alt ağacındaki değerlerin kendisinden küçük, sağ alt ağacındaki değerlerin kendisinden büyük olduğu veri yapısıdır.'
    },
    {
      id: '8',
      title: 'AVL Ağacı',
      complexity: 'O(log n)',
      difficulty: 'Zor',
      description: 'Kendi kendini dengeleyen bir ikili arama ağacı türüdür.'
    }
  ]
};

const deepLearningSubCategories: SubCategories = {
  'Sinir Ağları': [
    {
      id: '9',
      title: 'Geri Yayılım Algoritması',
      complexity: 'O(n²)',
      difficulty: 'Zor',
      description: 'Yapay sinir ağlarının eğitiminde kullanılan gradyan tabanlı bir optimizasyon algoritmasıdır.'
    }
  ],
  'CNN': [
    {
      id: '10',
      title: 'Evrişimli Sinir Ağları',
      complexity: 'O(n⁴)',
      difficulty: 'Zor',
      description: 'Görüntü tanıma ve işleme için tasarlanmış derin öğrenme mimarisidir.'
    }
  ],
  'RNN': [
    {
      id: '11',
      title: 'Tekrarlayan Sinir Ağları',
      complexity: 'O(n²)',
      difficulty: 'Zor',
      description: 'Zaman serisi verileri ve sıralı verileri işlemek için tasarlanmış bir sinir ağı türüdür.'
    }
  ]
};

const machineLearningSubCategories: SubCategories = {
  'Denetimli Öğrenme': [
    {
      id: '12',
      title: 'Karar Ağaçları',
      complexity: 'O(n log n)',
      difficulty: 'Orta',
      description: 'Verilerin özelliklerine göre sınıflandırma yapan ağaç yapısında bir modeldir.'
    },
    {
      id: '13',
      title: 'Destek Vektör Makineleri',
      complexity: 'O(n²)',
      difficulty: 'Zor',
      description: 'Veri noktalarını ayıran optimum hiper düzlemi bulmaya çalışan bir sınıflandırma algoritmasıdır.'
    }
  ],
  'Denetimsiz Öğrenme': [
    {
      id: '14',
      title: 'K-Means Kümeleme',
      complexity: 'O(k·n·t)',
      difficulty: 'Orta',
      description: 'Verileri k sayıda kümeye ayıran bir kümeleme algoritmasıdır.'
    },
    {
      id: '15',
      title: 'Hiyerarşik Kümeleme',
      complexity: 'O(n³)',
      difficulty: 'Orta',
      description: 'Veri noktalarını hiyerarşik bir ağaç yapısında kümeleyerek gruplaştıran bir algoritmadır.'
    }
  ],
  'Pekiştirmeli Öğrenme': [
    {
      id: '16',
      title: 'Q-Öğrenme',
      complexity: 'O(n²)',
      difficulty: 'Zor',
      description: 'Ajan, çevre ve ödül sistemi üzerinden en iyi eylem stratejisini öğrenen bir algoritmadır.'
    }
  ]
};

// Tüm kategoriler objesini oluştur
const allCategories: AllCategories = {
  '1': dataStructuresSubCategories,
  '2': deepLearningSubCategories,
  '3': machineLearningSubCategories,
  // Diğer kategoriler eklenebilir
};

const difficultyColors: {[key: string]: string} = {
  'Kolay': '#27ae60',
  'Orta': '#f39c12',
  'Zor': '#e74c3c',
};

// URL parametrelerini alabilmek için basit bir mock kategori objesi
const mockCategories = {
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
  },
};

const AlgorithmListScreen: React.FC = () => {
  // URL'den kategori id parametresini almak için useParams kullanıyoruz
  const { categoryId } = useParams<{ categoryId: string }>();
  // Demo amacıyla mock kategoriyi kullanıyoruz (gerçek uygulamada props veya global state olabilir)
  const category = mockCategories[categoryId as keyof typeof mockCategories];
  
  // Alt kategorileri alıyoruz
  const subCategories = allCategories[categoryId || '1'] || {};
  const subCategoryNames = Object.keys(subCategories);
  
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryNames[0] || '');
  const algorithms = subCategories[selectedSubCategory] || [];
  
  // Sayfa yüklendiğinde sayfanın en üstüne scroll yap
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, selectedSubCategory]);
  
  return (
    <div className="algorithm-list-container">
      <div className="algorithm-list-content">
        <div className="algorithm-list-header">
          <Link to="/" className="back-button">
            ←
          </Link>
          <h1 className="header-title" data-icon={category?.icon || ''}>
            {category?.title || 'Algoritma Listesi'}
          </h1>
          <div className="empty-space"></div>
        </div>

        {/* Alt Kategori Seçici */}
        <div className="sub-category-container">
          <div className="sub-category-scroll">
            {subCategoryNames.map((name) => (
              <button
                key={name}
                className={`sub-category-button ${selectedSubCategory === name ? 'active' : ''}`}
                onClick={() => setSelectedSubCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Algoritma Listesi */}
        <div className="algorithms-container">
          {algorithms.length > 0 ? (
            algorithms.map((item) => (
              <Link 
                to={`/algorithm/${item.id}`} 
                key={item.id}
                style={{ textDecoration: 'none' }}
              >
                <div className="algorithm-item">
                  <div className="algorithm-header">
                    <h3 className="algorithm-title">{item.title}</h3>
                    <div
                      className="difficulty-badge"
                      style={{ backgroundColor: difficultyColors[item.difficulty] }}
                    >
                      <span className="difficulty-text">{item.difficulty}</span>
                    </div>
                  </div>
                  <p className="algorithm-description">{item.description}</p>
                  <div className="algorithm-footer">
                    <span className="complexity-label">Karmaşıklık:</span>
                    <span className="complexity-value">{item.complexity}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">
              Bu kategoride algoritma bulunamadı.
            </div>
          )}
        </div>
        
        {/* Sayfa sonu boşluğu */}
        <div className="page-end-spacer"></div>
      </div>
    </div>
  );
};

export default AlgorithmListScreen; 