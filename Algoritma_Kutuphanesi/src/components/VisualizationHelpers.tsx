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
  'selection sort': {
    name: 'Seçim Sıralama (Selection Sort)',
    description: 'Seçim sıralama, her adımda sırasız kısımda en küçük elemanı bulup sıralı kısımın sonuna yerleştiren basit bir sıralama algoritmasıdır.',
    complexity: {
      time: 'O(n²)', 
      space: 'O(1)'
    },
    steps: [
      'Dizinin ilk elemanını başlangıç minimum değeri olarak kabul et',
      'Kalan tüm elemanları tarayarak gerçek minimum değeri bul',
      'Minimum değeri dizinin başındaki eleman ile yer değiştir',
      'Sıralanan kısmı bir eleman genişlet ve bir sonraki pozisyon için tekrarla',
      'Sırasız kısım bitene kadar bu adımları tekrarla'
    ]
  },
  'insertion sort': {
    name: 'Ekleme Sıralama (Insertion Sort)',
    description: 'Ekleme sıralama, her elemanı sıralı kısımda uygun pozisyonuna yerleştirerek çalışan basit bir sıralama algoritmasıdır.',
    complexity: {
      time: 'O(n²)', 
      space: 'O(1)'
    },
    steps: [
      'İkinci elemandan başla (ilk eleman zaten sıralı sayılır)',
      'Mevcut elemanı seç (anahtar)',
      'Anahtarı sıralı kısımla karşılaştır (sağdan sola)',
      'Anahtardan büyük elemanları bir pozisyon sağa kaydır',
      'Anahtarı doğru pozisyona yerleştir ve bir sonraki elemana geç'
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
      'Diziyi ortadan ikiye böl (divide)',
      'Sol yarıyı recursive olarak sırala',
      'Sağ yarıyı recursive olarak sırala', 
      'İki sıralı yarıyı merge et (conquer)',
      'Birleştirme sırasında elemanları karşılaştır ve en küçüğünü seç',
      'Tüm elemanlar birleştirilene kadar devam et'
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
      'Diziden bir pivot eleman seç (genellikle son eleman)',
      'Partition işlemi başlat: pivottan küçük elemanları sola taşı',
      'Pivottan büyük elemanları sağda bırak',
      'Pivotu doğru pozisyonuna yerleştir',
      'Sol yarıyı (pivottan küçük) recursive olarak sırala',
      'Sağ yarıyı (pivottan büyük) recursive olarak sırala'
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
    case 'selection sort':
    case 'seçim sıralama':
    case 'secim sıralama':
      title = 'Seçim Sıralama (Selection Sort)';
      complexity = 'O(n²) - O(1)';
      description = 'Seçim sıralama, her adımda sırasız kısımda en küçük elemanı bulup sıralı kısımın sonuna yerleştiren basit bir sıralama algoritmasıdır.';
      steps = [
        'Dizinin ilk elemanını başlangıç minimum değeri olarak kabul et.',
        'Kalan tüm elemanları tarayarak gerçek minimum değeri bul.',
        'Minimum değeri dizinin başındaki eleman ile yer değiştir.',
        'Sıralanan kısmı bir eleman genişlet.',
        'Sırasız kısım bitene kadar bu adımları tekrarla.'
      ];
      pros = [
        'Basit ve anlaşılması kolay algoritma',
        'Yerinde (in-place) sıralama yapar',
        'Sabit alan karmaşıklığı O(1)',
        'Minimum sayıda takas işlemi yapar'
      ];
      cons = [
        'O(n²) zaman karmaşıklığı nedeniyle büyük veriler için yavaş',
        'Kararlı (stable) değildir',
        'Veri kısmen sıralı olsa bile performansı değişmez',
        'Bubble sort\'a göre daha az takas yapar ama aynı zaman karmaşıklığına sahip'
      ];
      break;
    case 'insertion sort':
    case 'ekleme sıralama':
    case 'yerleştirme sıralama':
      title = 'Ekleme Sıralama (Insertion Sort)';
      complexity = 'O(n²) - O(1)';
      description = 'Ekleme sıralama, her elemanı sıralı kısımda uygun pozisyonuna yerleştirerek çalışan basit bir sıralama algoritmasıdır.';
      steps = [
        'İkinci elemandan başla (ilk eleman zaten sıralı sayılır).',
        'Mevcut elemanı seç (anahtar değer).',
        'Anahtarı sıralı kısımla karşılaştır (sağdan sola doğru).',
        'Anahtardan büyük elemanları bir pozisyon sağa kaydır.',
        'Anahtarı doğru pozisyona yerleştir.',
        'Bir sonraki elemana geç ve işlemi tekrarla.'
      ];
      pros = [
        'Basit ve anlaşılması kolay algoritma',
        'Yerinde (in-place) sıralama yapar',
        'Kararlı (stable) bir sıralama algoritmasıdır',
        'Küçük veri setleri için etkilidir',
        'Kısmen sıralı dizilerde iyi performans gösterir',
        'Online algoritma - veriler gelir gelmez sıralayabilir'
      ];
      cons = [
        'O(n²) zaman karmaşıklığı nedeniyle büyük veriler için yavaş',
        'Bubble sort ve selection sort\'a göre daha fazla karşılaştırma yapabilir',
        'Büyük veri setleri için merge sort veya quick sort tercih edilmelidir'
      ];
      break;
    case 'merge sort':
    case 'birleştirme sıralaması':
    case 'birlestirme sıralama':
      title = 'Birleştirme Sıralaması (Merge Sort)';
      complexity = 'O(n log n) - O(n)';
      description = 'Birleştirme sıralaması, bölüm-birleştir (divide and conquer) yaklaşımını kullanır. Diziyi tekrar tekrar iki parçaya böler, parçaları sıralar ve sonra birleştirir.';
      steps = [
        'Diziyi ortadan ikiye böl.',
        'Sol yarıyı recursive olarak sırala.',
        'Sağ yarıyı recursive olarak sırala.',
        'İki sıralı yarıyı karşılaştırarak birleştir.',
        'En küçük elemanı seç ve sonuç dizisine ekle.',
        'Tüm elemanlar birleştirilene kadar devam et.'
      ];
      pros = [
        'Garantili O(n log n) zaman karmaşıklığı',
        'Kararlı (stable) sıralama algoritması',
        'Büyük veri setleri için çok etkili',
        'Predictable performance - en kötü durum da O(n log n)',
        'Paralel işleme uygun',
        'External sorting için ideal'
      ];
      cons = [
        'O(n) ek alan gerektirir',
        'Küçük diziler için overhead',
        'In-place değil (ek bellek kullanır)',
        'Cache performansı diğer algoritmalardan düşük olabilir'
      ];
      break;
    case 'quick sort':
    case 'hızlı sıralama':
    case 'hizli sıralama':
      title = 'Hızlı Sıralama (Quick Sort)';
      complexity = 'Ortalama: O(n log n), En kötü: O(n²)';
      description = 'Hızlı sıralama, bir pivot eleman seçerek diziyi ikiye böler. Pivottan küçük elemanlar pivotun soluna, büyük elemanlar ise sağına yerleştirilir.';
      steps = [
        'Diziden bir pivot eleman seç (genellikle son eleman)',
        'Partition işlemi başlat: pivottan küçük elemanları sola taşı',
        'Pivottan büyük elemanları sağda bırak',
        'Pivotu doğru pozisyonuna yerleştir',
        'Sol yarıyı (pivottan küçük) recursive olarak sırala',
        'Sağ yarıyı (pivottan büyük) recursive olarak sırala'
      ];
      pros = [
        'Ortalama O(n log n) zaman karmaşıklığı',
        'Yerinde (in-place) sıralama yapar',
        'Cache-friendly - iyi locality of reference',
        'Pratikte genellikle en hızlı sıralama algoritması',
        'Paralel işleme uygun',
        'Adaptive - kısmen sıralı dizilerde iyi performans'
      ];
      cons = [
        'En kötü durumda O(n²) zaman karmaşıklığı',
        'Kararlı (stable) değildir',
        'Kötü pivot seçimi performansı düşürür',
        'Recursive yapı stack overflow riskine yol açabilir',
        'Küçük diziler için overhead'
      ];
      break;
    case 'linear search':
    case 'doğrusal arama':
    case 'dogrusal arama':
    case 'sequential search':
      title = 'Doğrusal Arama (Linear Search)';
      complexity = 'O(n) - O(1)';
      description = 'Doğrusal arama, bir dizide hedef değeri bulmak için dizinin başından sonuna kadar her elemanı tek tek kontrol eden basit bir arama algoritmasıdır.';
      steps = [
        'Dizinin ilk elemanından başla.',
        'Mevcut elemanı hedef değer ile karşılaştır.',
        'Eşitse: Hedef bulundu! Pozisyonu döndür.',
        'Eşit değilse: Bir sonraki elemana geç.',
        'Dizi sonuna kadar bu işlemi tekrarla.',
        'Tüm elemanlar kontrol edildiyse: Hedef bulunamadı.'
      ];
      pros = [
        'Çok basit ve anlaşılması kolay algoritma',
        'Sıralı olmayan dizilerde de çalışır',
        'Herhangi bir ön hazırlık gerektirmez',
        'Sabit alan karmaşıklığı O(1)',
        'Small data sets için yeterli',
        'Implementation çok kolay'
      ];
      cons = [
        'O(n) zaman karmaşıklığı - büyük veriler için yavaş',
        'En kötü durumda tüm diziyi taramak gerekir',
        'Binary search\'e göre çok daha yavaş',
        'Büyük veri setleri için verimsiz',
        'Average case\'de n/2 karşılaştırma gerekir'
      ];
      break;
    case 'singly linked list':
    case 'tekli bağlı liste':
    case 'tek yönlü bağlı liste':
    case 'singly linked':
    case 'bağlı liste':
    case 'bagli liste':
      title = 'Tek Yönlü Bağlı Liste (Singly Linked List)';
      complexity = 'Arama: O(n), Ekleme: O(1) - başa, O(n) - ortaya, Silme: O(1) - baştan, O(n) - ortadan';
      description = 'Tek yönlü bağlı liste, her düğümün bir veri alanı ve sonraki düğüme işaret eden bir pointer içerdiği dinamik veri yapısıdır. Düğümler bellekte rastgele yerleştirilir ve pointer\'lar aracılığıyla birbirine bağlanır.';
      steps = [
        'Her düğüm (node) bir değer (data) ve bir sonraki düğüme işaret eden pointer (next) içerir.',
        'HEAD pointer listinin ilk düğümünü gösterir.',
        'Son düğümün next pointer\'ı NULL değerini gösterir.',
        'Başa ekleme: Yeni düğümün next\'i eski head\'i gösterir, HEAD yeni düğümü gösterir.',
        'Sona ekleme: Son düğümü bulup next\'ini yeni düğümü gösterecek şekilde ayarla.',
        'Arama: HEAD\'den başlayarak her düğümü kontrol et.',
        'Silme: Silinecek düğümün önceki düğümünün next\'ini silinecek düğümün next\'i ile değiştir.'
      ];
      pros = [
        'Dinamik boyut - çalışma zamanında boyut değiştirebilir',
        'Bellek kullanımı sadece ihtiyaç kadar',
        'Başa ekleme/silme O(1) zamanda yapılır',
        'Array\'lerin aksine boyut sınırı yok',
        'Bellek fragmantasyonunu azaltır',
        'Cache locality array\'lere göre daha esnek'
      ];
      cons = [
        'Her düğüm için ekstra pointer alanı gerekir',
        'Sequential access - random access yok',
        'Cache locality array\'lere göre daha düşük',
        'Ters yönde traverse edilemez',
        'Orta elementlere erişim O(n) zaman alır',
        'Ekstra bellek overhead (pointer\'lar için)'
      ];
      break;
    case 'doubly linked list':
    case 'çift yönlü bağlı liste':
    case 'çift yonlu bağlı liste':
    case 'cift yonlu bagli liste':
    case 'çiftli bağlı liste':
    case 'ciftli bagli liste':
    case 'doubly linked':
    case 'çift bağlı':
    case 'cift bagli':
      title = 'Çift Yönlü Bağlı Liste (Doubly Linked List)';
      complexity = 'Arama: O(n/2), Ekleme: O(1) - başa/sona, O(n/2) - ortaya, Silme: O(1) - baştan/sondan, O(n) - ortadan';
      description = 'Çift yönlü bağlı liste, her düğümün bir veri alanı, sonraki düğüme işaret eden next pointer\'ı ve önceki düğüme işaret eden previous pointer\'ı içerdiği gelişmiş dinamik veri yapısıdır. HEAD ve TAIL pointer\'ları ile her iki yönden de erişim sağlanır.';
      steps = [
        'Her düğüm (node) bir değer (data), sonraki düğüme işaret eden pointer (next) ve önceki düğüme işaret eden pointer (previous) içerir.',
        'HEAD pointer listinin ilk düğümünü, TAIL pointer son düğümünü gösterir.',
        'İlk düğümün previous\'ı ve son düğümün next\'i NULL değerini gösterir.',
        'Başa ekleme: Yeni düğümün next\'i eski head\'i gösterir, eski head\'in previous\'ı yeni düğümü gösterir, HEAD yeni düğümü gösterir.',
        'Sona ekleme: TAIL pointer sayesinde O(1) zamanda son düğüme erişip yeni düğümü ekle.',
        'Arama: HEAD\'den ileri veya TAIL\'den geri yönde arama yaparak ortalama n/2 karşılaştırma.',
        'Silme: Silinecek düğümün önceki ve sonraki düğümlerinin pointer\'larını güncelleyerek bağlantıyı koru.'
      ];
      pros = [
        'Çift yönlü traverse - ileri ve geri yönde hareket mümkün',
        'Sona ekleme/silme O(1) zamanda (TAIL pointer sayesinde)',
        'Ortalama arama süresini yarıya indirir (n/2)',
        'Dinamik boyut - çalışma zamanında boyut değiştirebilir',
        'Bellek kullanımı sadece ihtiyaç kadar',
        'Daha esnek veri manipülasyonu',
        'Önceki düğüme direkt erişim'
      ];
      cons = [
        'Her düğüm için ekstra previous pointer alanı gerekir',
        'Tek yönlü listeye göre daha fazla bellek tüketir',
        'Ekleme/silme işlemleri daha karmaşık (iki pointer güncellenir)',
        'Cache locality array\'lere göre daha düşük',
        'Implementation complexity artar',
        'Ekstra bellek overhead (previous pointer\'lar için)'
      ];
      break;
    case 'circular linked list':
      title = 'Dairesel Bağlı Liste';
      description = 'Son düğümün next pointer\'ının ilk düğümü gösterdiği, döngüsel yapıya sahip bağlı liste.';
      complexity = 'O(1) - O(n)';
      steps = [
        'Son düğümün next pointer\'ının ilk düğümü gösterdiği, döngüsel yapıya sahip bağlı liste.',
        'Başa ekleme: Yeni düğümün next\'i eski head\'i gösterir, HEAD yeni düğümü gösterir.',
        'Sona ekleme: Son düğümü bulup next\'ini yeni düğümü gösterecek şekilde ayarla.',
        'Arama: HEAD\'den başlayarak her düğümü kontrol et.',
        'Silme: Silinecek düğümün önceki düğümünün next\'ini silinecek düğümün next\'i ile değiştir.'
      ];
      pros = [
        'Son düğümden ilk düğüme doğrudan erişim',
        'Döngüsel uygulamalar için ideal',
        'Sona ekleme HEAD pointer ile O(1)',
        'Round-robin algoritmaları için uygun'
      ];
      cons = [
        'Sonsuz döngü riski',
        'Döngü tespiti gerekli',
        'Traverse işlemi karmaşık',
        'NULL kontrolleri yetersiz'
      ];
      break;
    case 'binary search':
    case 'ikili arama':
    case 'binary arama':
      title = 'İkili Arama (Binary Search)';
      complexity = 'O(log n) - O(1)';
      description = 'İkili arama, sıralı bir dizide hedef değeri bulmak için dizinin ortasından başlayarak arama aralığını her adımda yarıya indiren hızlı bir arama algoritmasıdır.';
      steps = [
        'Dizinin sıralı olduğundan emin ol.',
        'Arama aralığının başlangıç (left) ve bitiş (right) noktalarını belirle.',
        'Orta pozisyonu hesapla: mid = (left + right) / 2',
        'Orta pozisyondaki değeri hedef ile karşılaştır.',
        'Eşitse: Hedef bulundu! Pozisyonu döndür.',
        'Hedef > orta değer ise: Sağ yarıda ara (left = mid + 1)',
        'Hedef < orta değer ise: Sol yarıda ara (right = mid - 1)',
        'Arama aralığı bitene kadar tekrarla.'
      ];
      pros = [
        'Çok hızlı: O(log n) zaman karmaşıklığı',
        'Sabit alan karmaşıklığı O(1)',
        'Büyük veri setlerinde çok verimli',
        'Basit ve anlaşılması kolay algoritma',
        'Recursive veya iterative implementasyon mümkün',
        'Worst-case bile çok hızlı'
      ];
      cons = [
        'Sadece sıralı dizilerde çalışır',
        'Dizinin önceden sıralanması gerekir',
        'Random access gerektirir (linked list\'te verimli değil)',
        'Dynamic data için uygun değil',
        'Insertion/deletion sonrası yeniden sıralama gerekir'
      ];
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
    case 'avl tree':
    case 'avl ağacı':
    case 'avl agaci':
    case 'adelson-velsky-landis':
      title = 'AVL Ağacı (Adelson-Velsky-Landis Tree)';
      complexity = 'Arama, Ekleme, Silme: O(log n)';
      description = 'AVL ağacı, kendi kendini dengeleyen ikili arama ağacıdır. Her düğümde, sol ve sağ alt ağaçlarının yükseklikleri arasındaki fark (balance factor) en fazla 1\'dir. Dengesizlik durumunda otomatik rotasyonlar yapılarak denge korunur.';
      steps = [
        'Her düğüm için balance factor hesaplanır: BF = Sol Alt Ağaç Yüksekliği - Sağ Alt Ağaç Yüksekliği',
        'Balance factor değeri -1, 0 veya 1 olmalıdır.',
        'BF > 1 ise sol ağır durum - sağ rotasyon gereklidir.',
        'BF < -1 ise sağ ağır durum - sol rotasyon gereklidir.',
        'Ekleme/silme sonrası balance factor kontrol edilir.',
        'Gerekirse rotasyonlar (LL, LR, RL, RR) yapılarak denge sağlanır.',
        'Rotasyon sonrası yükseklikler ve balance factor\'lar güncellenir.'
      ];
      pros = [
        'Garanti edilmiş O(log n) zaman karmaşıklığı',
        'Sıkı dengeli yapı - yükseklik farkı en fazla 1',
        'Arama işlemleri için optimal performans',
        'Balance factor ile kolay dengesizlik tespiti',
        'Deterministik performans - en kötü durum bile hızlı',
        'İlk kendi kendini dengeleyen ağaç yapısı'
      ];
      cons = [
        'Ekleme ve silme işlemleri karmaşık (rotasyonlar)',
        'Red-Black ağaçlara göre daha sık rotasyon gerekir',
        'Her düğümde yükseklik bilgisi saklanmalı',
        'Bellek kullanımı biraz daha fazla',
        'Sık ekleme/silme yapılan uygulamalarda daha yavaş olabilir'
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