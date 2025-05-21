import React from 'react';
import '../styles/VisualizationHelpers.css';

// Algoritma açıklamaları - kullanıcı için bilgi ve yardım
export const algorithmDescriptions = {
  'bubble sort': {
    name: 'Kabarcık Sıralama (Bubble Sort)',
    description: 'Kabarcık sıralama, her adımda yanyana duran elemanları karşılaştırıp, sıralamaya aykırı olanları yer değiştiren basit bir sıralama algoritmasıdır.',
    complexity: {
      time: 'O(n²)', 
      space: 'O(1)'
    },
    steps: [
      'Dizinin başından başlayarak her bir elemanı bir sonraki eleman ile karşılaştır',
      'Eğer eleman sıralamaya aykırı ise yer değiştir',
      'Dizinin sonuna geldiğinde, başa dön ve aynı süreci tekrarla',
      'Her bir geçişte en büyük eleman dizinin sonuna yerleşir',
      'Hiçbir değişiklik yapılmayan bir geçiş gerçekleşene kadar devam et'
    ]
  },
  'merge sort': {
    name: 'Birleştirme Sıralaması (Merge Sort)',
    description: 'Birleştirme sıralaması, bölüm-birleştir (divide and conquer) yaklaşımını kullanır. Diziyi tekrar tekrar iki parçaya böler, parçaları sıralar ve sonra birleştirir.',
    complexity: {
      time: 'O(n log n)', 
      space: 'O(n)'
    },
    steps: [
      'Diziyi ikiye böl',
      'Her iki yarıyı recursif olarak sırala',
      'İki sıralı yarıyı birleştir'
    ]
  },
  'quick sort': {
    name: 'Hızlı Sıralama (Quick Sort)',
    description: 'Hızlı sıralama, bir pivot eleman seçerek diziyi ikiye böler. Pivottan küçük elemanlar pivotun soluna, büyük elemanlar ise sağına yerleştirilir.',
    complexity: {
      time: 'Ortalama: O(n log n), En kötü: O(n²)', 
      space: 'O(log n)'
    },
    steps: [
      'Diziden bir pivot eleman seç',
      'Diziyi pivottan küçük ve büyük elemanlar olarak ikiye ayır',
      'Recursif olarak her iki parçayı aynı yöntemle sırala'
    ]
  },
  'binary search': {
    name: 'İkili Arama (Binary Search)',
    description: 'İkili arama, sıralı bir dizide hedef değeri bulmak için dizinin ortasından başlayarak arama aralığını her adımda yarıya indiren hızlı bir arama algoritmasıdır.',
    complexity: {
      time: 'O(log n)',
      space: 'O(1)'
    },
    steps: [
      'Dizinin ortasındaki elemana bak',
      'Eğer hedef değer ortadaki elemana eşitse, arama tamamlandı',
      'Eğer hedef değer ortadaki elemandan küçükse, sol yarıda aramaya devam et',
      'Eğer hedef değer ortadaki elemandan büyükse, sağ yarıda aramaya devam et',
      'Arama aralığı boş olana kadar yukarıdaki adımları tekrarla'
    ]
  },
  'dijkstra': {
    name: 'Dijkstra Algoritması',
    description: 'Dijkstra algoritması, bir grafta başlangıç düğümünden diğer tüm düğümlere olan en kısa yolları bulan bir algoritma olarak ağırlıklı graflar için kullanılır.',
    complexity: {
      time: 'O((V + E) log V) - Öncelik kuyruğu ile',
      space: 'O(V)'
    },
    steps: [
      'Başlangıç düğümüne 0, diğer tüm düğümlere sonsuz mesafe değeri ata',
      'Ziyaret edilmemiş düğümler kümesini oluştur',
      'Mesafesi en küçük olan ziyaret edilmemiş düğümü seç',
      'Bu düğümün tüm komşularını kontrol et',
      'Eğer mevcut mesafe, bu düğüm üzerinden geçerek hesaplanan mesafeden büyükse, mesafeyi güncelle',
      'Düğümü ziyaret edildi olarak işaretle',
      'Tüm düğümler ziyaret edilene kadar devam et'
    ]
  }
};

// Algoritma kompleksitesini görselleştiren bileşen
export const ComplexityVisualizer: React.FC<{
  timeComplexity: string;
  spaceComplexity?: string;
}> = ({ timeComplexity, spaceComplexity }) => {
  // Kompleksite kategorileri ve renkleri
  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(1)') || complexity.includes('O(log n)')) {
      return '#27ae60'; // Yeşil - çok iyi
    } else if (complexity.includes('O(n)') || complexity.includes('O(n log n)')) {
      return '#f39c12'; // Turuncu - orta
    } else if (complexity.includes('O(n²)')) {
      return '#e67e22'; // Turuncu kırmızı - kötü
    } else {
      return '#e74c3c'; // Kırmızı - çok kötü
    }
  };

  return (
    <div className="complexity-container">
      <div className="complexity-item">
        <span className="complexity-label">Zaman Karmaşıklığı:</span>
        <span className="complexity-value" style={{ color: getComplexityColor(timeComplexity) }}>
          {timeComplexity}
        </span>
      </div>
      
      {spaceComplexity && (
        <div className="complexity-item">
          <span className="complexity-label">Alan Karmaşıklığı:</span>
          <span className="complexity-value" style={{ color: getComplexityColor(spaceComplexity) }}>
            {spaceComplexity}
          </span>
        </div>
      )}
    </div>
  );
};

// Algoritma adımlarını gösteren bileşen
export const StepVisualizer: React.FC<{
  steps: string[];
}> = ({ steps }) => {
  return (
    <div className="steps-container">
      {steps.map((step, index) => (
        <div key={index} className="step-item">
          <div className="step-number-container">
            <span className="step-number">{index + 1}</span>
          </div>
          <span className="step-text">{step}</span>
        </div>
      ))}
    </div>
  );
};

// Algoritma bilgi kartı
export const AlgorithmInfoCard: React.FC<{
  algorithmType: string;
}> = ({ algorithmType }) => {
  let title = 'Algoritma Bilgileri';
  let complexity = '';
  let description = '';
  let pros: string[] = [];
  let cons: string[] = [];
  let steps: string[] = [];
  
  // Algoritma tipine göre bilgileri belirle
  switch (algorithmType.toLowerCase()) {
    case 'bubble sort':
    case 'kabarcık sıralama':
      title = 'Kabarcık Sıralama (Bubble Sort)';
      complexity = 'O(n²) - O(1)';
      description = 'Kabarcık sıralama, her adımda yanyana duran elemanları karşılaştırıp, sıralamaya aykırı olanları yer değiştiren basit bir sıralama algoritmasıdır.';
      steps = [
        'Dizinin başından başla.',
        'Ardışık elemanları karşılaştır.',
        'Eğer mevcut eleman bir sonrakinden büyükse, yerlerini değiştir.',
        'Dizinin sonuna kadar bu işlemi tekrarla.',
        'Tüm dizi sıralanana kadar bu adımları tekrarla.'
      ];
      break;
    case 'merge sort':
    case 'birleştirme sıralaması':
      title = 'Birleştirme Sıralaması (Merge Sort)';
      complexity = 'O(n log n) - O(n)';
      description = 'Birleştirme sıralaması, bölüm-birleştir (divide and conquer) yaklaşımını kullanır. Diziyi tekrar tekrar iki parçaya böler, parçaları sıralar ve sonra birleştirir.';
      break;
    case 'quick sort':
    case 'hızlı sıralama':
      title = 'Hızlı Sıralama (Quick Sort)';
      complexity = 'Ortalama: O(n log n), En kötü: O(n²)';
      description = 'Hızlı sıralama, bir pivot eleman seçerek diziyi ikiye böler. Pivottan küçük elemanlar pivotun soluna, büyük elemanlar ise sağına yerleştirilir.';
      break;
    case 'binary search':
    case 'ikili arama':
      title = 'İkili Arama (Binary Search)';
      complexity = 'O(log n) - O(1)';
      description = 'İkili arama, sıralı bir dizide hedef değeri bulmak için dizinin ortasından başlayarak arama aralığını her adımda yarıya indiren hızlı bir arama algoritmasıdır.';
      break;
    case 'dijkstra':
    case 'dijkstra algoritması':
      title = 'Dijkstra Algoritması';
      complexity = 'O((V + E) log V) - Öncelik kuyruğu ile';
      description = 'Dijkstra algoritması, bir grafta başlangıç düğümünden diğer tüm düğümlere olan en kısa yolları bulan bir algoritma olarak ağırlıklı graflar için kullanılır.';
      break;
    case 'red-black tree':
    case 'kırmızı-siyah ağaç':
      title = 'Kırmızı-Siyah Ağaç';
      complexity = 'Arama, Ekleme, Silme: O(log n)';
      description = 'Kırmızı-Siyah Ağaç, kendi kendini dengeleyen ikili arama ağacı türüdür. Her düğüm kırmızı veya siyah olarak işaretlenir ve belirli özellikleri koruyarak ağacın dengeli kalmasını sağlar.';
      steps = [
        'Her düğüm ya kırmızı ya da siyahtır.',
        'Kök düğüm her zaman siyahtır.',
        'Bütün yaprak (null) düğümler siyahtır.',
        'Kırmızı bir düğümün çocukları siyah olmalıdır.',
        'Herhangi bir düğümden, o düğümün alt ağacındaki yaprak düğümlere kadar olan yollardaki siyah düğüm sayısı aynıdır.'
      ];
      pros = [
        'Garanti edilmiş O(log n) zaman karmaşıklığı',
        'Dengeli bir veri yapısı',
        'Ekleme ve silme işlemlerinden sonra otomatik dengelenir',
        'B-ağaçları ve 2-3-4 ağaçlarıyla ilişkilidir'
      ];
      cons = [
        'Ekleme ve silme işlemleri daha karmaşıktır',
        'AVL ağaçlarına göre daha fazla alan kullanabilir',
        'Dengeli ağaç yapısı nedeniyle her zaman en uygun düzen olmayabilir'
      ];
      break;
    default:
      return (
        <div className="info-card">
          <h3 className="info-title">{algorithmType}</h3>
          <p className="info-text">Bu algoritma için detaylı bilgi bulunmamaktadır.</p>
        </div>
      );
  }

  return (
    <div className="info-card">
      <h3 className="info-title">{title}</h3>
      <p className="info-text">{description}</p>
      
      <ComplexityVisualizer 
        timeComplexity={complexity} 
      />
      
      {steps.length > 0 && (
        <>
          <h4 className="steps-title">Algoritma Adımları:</h4>
          <StepVisualizer steps={steps} />
        </>
      )}
      
      {(pros.length > 0 || cons.length > 0) && (
        <div className="pros-cons-container">
          {pros.length > 0 && (
            <div className="pros-container">
              <h4>Avantajlar:</h4>
              <ul>
                {pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </div>
          )}
          
          {cons.length > 0 && (
            <div className="cons-container">
              <h4>Dezavantajlar:</h4>
              <ul>
                {cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default {
  AlgorithmInfoCard,
  ComplexityVisualizer,
  StepVisualizer,
  algorithmDescriptions
}; 