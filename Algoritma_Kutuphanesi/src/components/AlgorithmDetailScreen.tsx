import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AlgorithmDetailScreen.css';

// Example implementation of Bubble Sort in JavaScript
const bubbleSortCode = `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in the wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`;

// Example implementation of Binary Search in JavaScript
const binarySearchCode = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Find the middle index
    const mid = Math.floor((left + right) / 2);
    
    // Check if target is at mid
    if (arr[mid] === target) {
      return mid;
    }
    
    // If target is greater, ignore left half
    if (arr[mid] < target) {
      left = mid + 1;
    } 
    // If target is smaller, ignore right half
    else {
      right = mid - 1;
    }
  }
  
  // Target not found
  return -1;
}`;

interface CodeExamples {
  [key: string]: {
    javascript: string;
  };
}

const codeExamples: CodeExamples = {
  'Bubble Sort': {
    javascript: bubbleSortCode,
    // We could add other languages like Python, Java, etc.
  },
  'Binary Search': {
    javascript: binarySearchCode,
  },
};

// Tab types
type TabType = 'description' | 'code' | 'visual';

interface AlgorithmType {
  id: string;
  title: string;
  description: string;
  complexity: {
    time: string;
    space: string;
    average: string;
  };
  steps: string[];
  pros: string[];
  cons: string[];
  code: {
    [key: string]: string;
  };
}

// Mock data for the algorithm detail
const algorithmData: { [key: string]: AlgorithmType } = {
  '1': {
    id: '1',
    title: 'Bubble Sort',
    description: 'Bubble Sort, sıralama algoritmaları arasında en basit olanlardan biridir. Dizideki her elemanı kendinden sonra gelen elemanla karşılaştırarak, daha büyük ise yerlerini değiştiren bir algoritmadır. Her geçişte en büyük eleman dizinin sonuna taşınır.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
      average: 'O(n²)'
    },
    steps: [
      'Dizinin başından başlayarak, her elemanı bir sonraki elemanla karşılaştır.',
      'Eğer mevcut eleman bir sonraki elemandan büyükse, bu iki elemanın yerini değiştir.',
      'Dizinin sonuna ulaşıldığında, en büyük eleman dizinin sonuna gelmiş olur.',
      'Dizinin boyutu kadar (veya gerektiğinde daha az) geçiş yaparak tüm diziyi sırala.'
    ],
    pros: [
      'Uygulaması çok kolaydır',
      'Çok az bellek alanı gerektirir (in-place sıralama)',
      'Küçük veri kümeleri için etkilidir'
    ],
    cons: [
      'Büyük veri kümeleri için çok yavaş çalışır',
      'Zaman karmaşıklığı O(n²) olduğu için verimsizdir',
      'Quick Sort, Merge Sort gibi gelişmiş algoritmalardan daha kötü performans gösterir'
    ],
    code: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in the wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n):
        for j in range(0, n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap them if they are in the wrong order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr`,
      java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap them if they are in the wrong order
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
      'c++': `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap them if they are in the wrong order
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
    }
  }
};

interface AlgorithmDetailScreenProps {
  // Gerekli prop'lar burada tanımlanabilir
}

const AlgorithmDetailScreen: React.FC<AlgorithmDetailScreenProps> = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Sayfa yüklendiğinde sayfanın en üstüne scroll yap
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [algorithmId]);
  
  // Kopyalama durumunu sıfırla
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  // Demo amacıyla algorithm verisini burada tutuyoruz
  const algorithm = algorithmData[algorithmId as string] || {
    id: '0',
    title: 'Algoritma Bulunamadı',
    description: '',
    complexity: { time: '', space: '', average: '' },
    steps: [],
    pros: [],
    cons: [],
    code: {}
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(algorithm.code[selectedLanguage] || '');
    setCopied(true);
  };
  
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
                  <div className="complexity-row">
                    <span className="complexity-label">Zaman Karmaşıklığı (Ortalama):</span>
                    <div className="complexity-badge" style={{ backgroundColor: '#6c5ce7' }}>
                      <span className="complexity-value">{algorithm.complexity.average}</span>
                    </div>
                  </div>
                  <div className="complexity-row">
                    <span className="complexity-label">Zaman Karmaşıklığı (En Kötü):</span>
                    <div className="complexity-badge" style={{ backgroundColor: '#e74c3c' }}>
                      <span className="complexity-value">{algorithm.complexity.time}</span>
                    </div>
                  </div>
                  <div className="complexity-row">
                    <span className="complexity-label">Alan Karmaşıklığı:</span>
                    <div className="complexity-badge" style={{ backgroundColor: '#3498db' }}>
                      <span className="complexity-value">{algorithm.complexity.space}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="section">
                <h3 className="section-title">Algoritma Adımları</h3>
                <ol className="steps-list">
                  {algorithm.steps.map((step, index) => (
                    <li key={index} className="step-item">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="section">
                <h3 className="section-title">Avantajlar ve Dezavantajlar</h3>
                <div className="pros-cons-container">
                  <div className="pros-section">
                    <h4>Avantajlar</h4>
                    <ul className="pros-list">
                      {algorithm.pros.map((pro, index) => (
                        <li key={index} className="pro-item">{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="cons-section">
                    <h4>Dezavantajlar</h4>
                    <ul className="cons-list">
                      {algorithm.cons.map((con, index) => (
                        <li key={index} className="con-item">{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'code' && (
            <div className="code-container">
              <div className="language-selector">
                {Object.keys(algorithm.code).map((lang) => (
                  <button
                    key={lang}
                    className={`language-button ${selectedLanguage === lang ? 'active' : ''}`}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
              
              <pre className="code-block">
                <code>{algorithm.code[selectedLanguage] || 'Seçilen dil için kod örneği bulunamadı'}</code>
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
              </div>
            </div>
          )}
          
          {activeTab === 'visual' && (
            <div className="visual-container">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDetailScreen; 