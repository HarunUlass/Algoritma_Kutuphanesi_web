import React, { useState, useEffect, useRef } from 'react';
import { AlgorithmInfoCard } from './VisualizationHelpers';
import '../styles/AlgorithmVisualization.css';

// Farklı algoritmaların görselleştirmeleri için veri tipleri
interface ArrayVisualizationProps {
  algorithmType: string;
  title: string;
  animationSpeed?: number; // Milisaniye cinsinden animasyon hızı
  customArray?: number[]; // İsteğe bağlı özel dizi
}

// Sabitleri tanımla
const BAR_WIDTH = 30;
const BAR_MARGIN = 5;
const MAX_BAR_HEIGHT = 200;
const DEFAULT_ANIMATION_SPEED = 500; // ms

// Rastgele bir dizi oluşturmak için fonksiyon
const generateRandomArray = (length: number, maxValue: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * maxValue) + 10);
};

// Algoritma Görselleştirme bileşeni
const AlgorithmVisualization: React.FC<ArrayVisualizationProps> = ({
  algorithmType,
  title,
  animationSpeed = DEFAULT_ANIMATION_SPEED,
  customArray,
}) => {
  // Durumları tanımla
  const [array, setArray] = useState<number[]>(customArray || generateRandomArray(8, 100));
  const [sorting, setSorting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(animationSpeed);
  const [explanationText, setExplanationText] = useState<string>('Görselleştirmeyi başlatmak için "Başlat" düğmesine tıklayın.');
  
  // Renkleri tanımla
  const normalColor = '#6c5ce7'; // Mor
  const comparingColor = '#ffa500'; // Turuncu
  const swappingColor = '#ff0000'; // Kırmızı
  const sortedColor = '#2ed573'; // Yeşil
  
  // Bar renklerini tut
  const [barColors, setBarColors] = useState<string[]>(Array(array.length).fill(normalColor));
  
  // Her dizinin değişiminde renkleri yenile
  useEffect(() => {
    setBarColors(Array(array.length).fill(normalColor));
  }, [array]);
  
  // Bekleme yardımcı fonksiyonu
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Yeni bir rastgele dizi oluştur
  const resetArray = () => {
    if (sorting) return; // Sıralama işlemi sırasında yeni dizi oluşturma
    const newArray = generateRandomArray(8, 100);
    setArray(newArray);
    setCurrentStep(0);
    setTotalSteps(0);
    setExplanationText('Görselleştirmeyi başlatmak için "Başlat" düğmesine tıklayın.');
  };
  
  // İki barın rengini değiştir
  const highlightBars = (indices: number[], color: string) => {
    setBarColors(prevColors => {
      const newColors = [...prevColors];
      indices.forEach(index => {
        if (index >= 0 && index < newColors.length) {
          newColors[index] = color;
        }
      });
      return newColors;
    });
  };
  
  // Tüm barların rengini sıfırla
  const resetColors = () => {
    setBarColors(Array(array.length).fill(normalColor));
  };
  
  // İki elemanın yerini değiştir
  const swap = (arr: number[], i: number, j: number): number[] => {
    const newArr = [...arr];
    const temp = newArr[i];
    newArr[i] = newArr[j];
    newArr[j] = temp;
    return newArr;
  };
  
  // Bubble Sort algoritması görselleştirmesi
  const visualizeBubbleSort = async () => {
    if (sorting) return;
    setSorting(true);
    setCurrentStep(0);
    
    try {
      const newArray = [...array];
      const n = newArray.length;
      let totalSwaps = 0;
      
      // Toplam adım sayısını hesapla
      const totalPotentialSteps = (n * (n - 1)) / 2;
      setTotalSteps(totalPotentialSteps);
      
      let currentStepCount = 0;
      let swapped = false;
      
      for (let i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
          // Karşılaştırılan barları vurgula
          highlightBars([j, j + 1], comparingColor);
          setExplanationText(`${newArray[j]} ve ${newArray[j + 1]} karşılaştırılıyor...`);
          await wait(speed);
          
          if (newArray[j] > newArray[j + 1]) {
            // Takas edilecek barları vurgula
            highlightBars([j, j + 1], swappingColor);
            setExplanationText(`${newArray[j]} > ${newArray[j + 1]}, yer değiştiriliyor...`);
            await wait(speed);
            
            // Elemanları takas et
            const temp = newArray[j];
            newArray[j] = newArray[j+1];
            newArray[j+1] = temp;
            setArray([...newArray]);
            swapped = true;
            totalSwaps++;
            
            // Takas sonrası bekle
            await wait(speed / 2);
          }
          
          // Renkleri normale döndür
          highlightBars([j, j + 1], normalColor);
          currentStepCount++;
          setCurrentStep(currentStepCount);
        }
        
        // Geçiş tamamlandı, son eleman sıralandı
        highlightBars([n - i - 1], sortedColor);
        
        // Eğer takas yapılmadıysa, dizi sıralanmış demektir
        if (!swapped) {
          break;
        }
      }
      
      // Tüm elemanları sıralanmış olarak işaretle
      setBarColors(Array(n).fill(sortedColor));
      setExplanationText(`Sıralama tamamlandı! Toplam ${totalSwaps} takas yapıldı.`);
    } catch (error) {
      console.error("Bubble Sort sırasında hata:", error);
      setExplanationText("Görselleştirme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Linear Search algoritması görselleştirmesi
  const visualizeLinearSearch = async () => {
    if (sorting) return;
    setSorting(true);
    setCurrentStep(0);
    
    // Rastgele bir hedef değer seç (dizideki değerlerden veya dizide olmayan bir değer)
    const targetValue = Math.random() > 0.7 ? 
      Math.floor(Math.random() * 120) + 5 : // Rastgele bir değer
      array[Math.floor(Math.random() * array.length)]; // Diziden bir değer
    
    setTotalSteps(array.length);
    setExplanationText(`${targetValue} değeri aranıyor...`);
    
    resetColors();
    await wait(speed / 2);
    
    let found = false;
    
    for (let i = 0; i < array.length; i++) {
      // Mevcut elemanı vurgula
      highlightBars([i], comparingColor);
      setCurrentStep(i + 1);
      
      setExplanationText(`Adım ${i + 1}: ${array[i]} değeri ${targetValue} ile karşılaştırılıyor...`);
      await wait(speed);
      
      if (array[i] === targetValue) {
        // Eleman bulundu
        highlightBars([i], sortedColor);
        setExplanationText(`${targetValue} değeri ${i + 1}. konumda bulundu!`);
        found = true;
        break;
      } else {
        // Kontrol edilen elemanı işaretle
        highlightBars([i], normalColor);
      }
    }
    
    if (!found) {
      setExplanationText(`${targetValue} değeri dizide bulunamadı!`);
    }
    
    setSorting(false);
  };
  
  // Binary Search algoritması görselleştirmesi
  const visualizeBinarySearch = async () => {
    if (sorting) return;
    setSorting(true);
    setCurrentStep(0);
    
    // Binary search için diziyi sırala
    const sortedArray = [...array].sort((a, b) => a - b);
    setArray(sortedArray);
    
    // Rastgele bir hedef değer seç (dizideki değerlerden veya dizide olmayan bir değer)
    const targetValue = Math.random() > 0.7 ? 
      Math.floor(Math.random() * 120) + 5 : // Rastgele bir değer
      sortedArray[Math.floor(Math.random() * sortedArray.length)]; // Diziden bir değer
    
    setTotalSteps(Math.ceil(Math.log2(sortedArray.length)));
    setExplanationText(`Sıralı dizide ${targetValue} değeri ikili arama ile aranıyor...`);
    
    resetColors();
    await wait(speed);
    
    let left = 0;
    let right = sortedArray.length - 1;
    let stepCount = 0;
    let found = false;
    
    while (left <= right) {
      // Mevcut arama aralığını vurgula
      const searchRange = Array.from({ length: right - left + 1 }, (_, i) => left + i);
      highlightBars(searchRange, '#3498db'); // Mavi - arama aralığı
      await wait(speed / 2);
      
      const mid = Math.floor((left + right) / 2);
      stepCount++;
      setCurrentStep(stepCount);
      
      // Orta elemanı vurgula
      highlightBars([mid], comparingColor);
      setExplanationText(`Adım ${stepCount}: Orta eleman ${sortedArray[mid]} ile ${targetValue} karşılaştırılıyor...`);
      await wait(speed);
      
      if (sortedArray[mid] === targetValue) {
        // Eleman bulundu
        highlightBars([mid], sortedColor);
        setExplanationText(`${targetValue} değeri ${stepCount}. adımda bulundu!`);
        found = true;
        break;
      } else if (sortedArray[mid] < targetValue) {
        // Sağ tarafta ara
        left = mid + 1;
        setExplanationText(`${sortedArray[mid]} < ${targetValue}, sağ tarafta aramaya devam ediliyor...`);
      } else {
        // Sol tarafta ara
        right = mid - 1;
        setExplanationText(`${sortedArray[mid]} > ${targetValue}, sol tarafta aramaya devam ediliyor...`);
      }
      
      // Arama aralığını resetle
      resetColors();
    }
    
    if (!found) {
      setExplanationText(`${targetValue} değeri dizide bulunamadı!`);
    }
    
    setSorting(false);
  };
  
  // Görselleştirmeyi başlat
  const startVisualization = () => {
    if (sorting) return;
    
    // Algoritma tipine göre uygun görselleştirmeyi seç
    switch (algorithmType.toLowerCase()) {
      case 'bubble sort':
        visualizeBubbleSort();
        break;
      case 'linear search':
        visualizeLinearSearch();
        break;
      case 'binary search':
        visualizeBinarySearch();
        break;
      default:
        setExplanationText(`${algorithmType} algoritması için görselleştirme henüz eklenmedi.`);
    }
  };
  
  // Maksimum bar yüksekliğini bul
  const maxArrayValue = Math.max(...array);
  
  return (
    <div className="algorithm-visualization-container">
      <h2 className="visualization-title">{title} Görselleştirmesi</h2>
      
      <div className="controls-container">
        <button 
          className="control-button"
          onClick={resetArray}
          disabled={sorting}
        >
          Yeni Dizi
        </button>
        <button 
          className="control-button primary"
          onClick={startVisualization}
          disabled={sorting}
        >
          {sorting ? 'Çalışıyor...' : 'Başlat'}
        </button>
        <div className="speed-control">
          <label htmlFor="speed">Hız:</label>
          <input 
            id="speed"
            type="range" 
            min="100" 
            max="1000" 
            step="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={sorting}
          />
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-text">
          {sorting ? `Adım ${currentStep}/${totalSteps || '?'}` : ''}
        </div>
        {sorting && totalSteps > 0 && (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <div className="explanation-box">
        <p>{explanationText}</p>
      </div>
      
      <div className="visualization-area">
        {array.map((value, index) => (
          <div 
            key={index}
            className="array-bar"
            style={{
              height: `${(value / maxArrayValue) * MAX_BAR_HEIGHT}px`,
              width: `${BAR_WIDTH}px`,
              backgroundColor: barColors[index] || normalColor,
              margin: `0 ${BAR_MARGIN}px`
            }}
          >
            <span className="bar-value">{value}</span>
          </div>
        ))}
      </div>
      
      <div className="info-section">
        <AlgorithmInfoCard algorithmType={algorithmType} />
      </div>
    </div>
  );
};

export default AlgorithmVisualization; 