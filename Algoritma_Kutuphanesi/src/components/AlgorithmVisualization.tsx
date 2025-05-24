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
  const [targetValue, setTargetValue] = useState<string>(''); // Binary search için hedef değer
  
  // Bağlı liste için ek state'ler
  const [selectedOperation, setSelectedOperation] = useState<string>('demo'); // Seçilen işlem
  const [inputValue, setInputValue] = useState<string>(''); // İşlem için girdi değeri
  const [insertPosition, setInsertPosition] = useState<string>(''); // Ekleme pozisyonu
  
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
    
    // Binary search için özel açıklama
    if (algorithmType.toLowerCase() === 'binary search') {
      setExplanationText('Aranacak değeri girin ve "Başlat" düğmesine tıklayın. Dizi otomatik olarak sıralanacaktır.');
    } else if (algorithmType.toLowerCase() === 'linear search') {
      setExplanationText('Aranacak değeri girin ve "Başlat" düğmesine tıklayın. Linear search baştan sona her elemanı kontrol eder.');
    } else if (algorithmType.toLowerCase().includes('singly')) {
      setExplanationText('İşlem seçin, gerekli parametreleri girin ve "Başlat" düğmesine tıklayın. Bağlı liste operasyonlarını görsel olarak takip edebilirsiniz.');
    } else if (algorithmType.toLowerCase().includes('doubly')) {
      setExplanationText('İşlem seçin, gerekli parametreleri girin ve "Başlat" düğmesine tıklayın. Çift yönlü bağlı liste operasyonlarını görsel olarak takip edebilirsiniz.');
    } else {
      setExplanationText('Görselleştirmeyi başlatmak için "Başlat" düğmesine tıklayın.');
    }
  }, [array, algorithmType]);
  
  // Bekleme yardımcı fonksiyonu
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Yeni bir rastgele dizi oluştur
  const resetArray = () => {
    if (sorting) return; // Sıralama işlemi sırasında yeni dizi oluşturma
    const newArray = generateRandomArray(8, 100);
    setArray(newArray);
    setCurrentStep(0);
    setTotalSteps(0);
    setTargetValue(''); // Hedef değeri sıfırla
    
    if (algorithmType.toLowerCase() === 'binary search') {
      setExplanationText('Aranacak değeri girin ve "Başlat" düğmesine tıklayın. Dizi otomatik olarak sıralanacaktır.');
    } else if (algorithmType.toLowerCase() === 'linear search') {
      setExplanationText('Aranacak değeri girin ve "Başlat" düğmesine tıklayın. Linear search baştan sona her elemanı kontrol eder.');
    } else if (algorithmType.toLowerCase().includes('singly')) {
      setExplanationText('İşlem seçin, gerekli parametreleri girin ve "Başlat" düğmesine tıklayın. Bağlı liste operasyonlarını görsel olarak takip edebilirsiniz.');
    } else {
      setExplanationText('Görselleştirmeyi başlatmak için "Başlat" düğmesine tıklayın.');
    }
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
    
    // Hedef değer kontrolü
    if (!targetValue.trim()) {
      setExplanationText('⚠️ Lütfen aranacak değeri girin!');
      return;
    }
    
    const target = parseInt(targetValue);
    if (isNaN(target)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    
    try {
      setTotalSteps(array.length);
      setExplanationText(`🎯 Hedef değer: ${target} | Linear Search başlıyor...`);
      
      resetColors();
      await wait(speed);
      
      let found = false;
      let foundIndex = -1;
      
      // Tüm diziyi başlangıçta normal renk ile göster
      setExplanationText(`📋 Dizi: [${array.join(', ')}] | Aranacak değer: ${target}`);
      await wait(speed);
      
      for (let i = 0; i < array.length; i++) {
        setCurrentStep(i + 1);
        
        // Mevcut elemanı vurgula (karşılaştırma rengi)
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 Adım ${i + 1}: ${i + 1}. pozisyondaki ${array[i]} değeri hedef ${target} ile karşılaştırılıyor...`);
        await wait(speed);
        
        if (array[i] === target) {
          // Eleman bulundu!
          highlightBars([i], sortedColor);
          setExplanationText(`🎉 BULUNDU! ${target} değeri ${i + 1}. pozisyonda bulundu!`);
          found = true;
          foundIndex = i;
          
          // Başarı animasyonu - bulunan elemanı vurgula
          for (let j = 0; j < 3; j++) {
            await wait(300);
            highlightBars([i], swappingColor);
            await wait(300);
            highlightBars([i], sortedColor);
          }
          break;
        } else {
          // Eleman hedefle eşleşmiyor
          setExplanationText(`❌ ${array[i]} ≠ ${target}, aramaya devam...`);
          await wait(speed / 2);
          
          // Kontrol edilen elemanı gri yap (kontrol edildi)
          highlightBars([i], '#95a5a6');
          await wait(speed / 2);
        }
      }
      
      if (!found) {
        // Hedef bulunamadı
        setExplanationText(`❌ ${target} değeri dizide bulunamadı! Tüm ${array.length} eleman kontrol edildi.`);
        
        // Tüm diziyi gri yap (bulunamadı göstergesi)
        highlightBars(Array.from({ length: array.length }, (_, i) => i), '#95a5a6');
        await wait(speed);
      }
      
      // Özet bilgi
      const efficiency = found ? 
        `${foundIndex + 1}/${array.length} eleman kontrol edildi` : 
        `${array.length}/${array.length} eleman kontrol edildi`;
      
      setExplanationText(
        found 
          ? `✅ Linear Search tamamlandı! Hedef ${foundIndex + 1}. adımda bulundu. Verimlilik: ${efficiency}`
          : `❌ Linear Search tamamlandı! Hedef ${array.length} adımda bulunamadığı kesinleşti. Verimlilik: ${efficiency}`
      );
      
    } catch (error) {
      console.error("Linear Search sırasında hata:", error);
      setExplanationText("Görselleştirme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Selection Sort algoritması görselleştirmesi
  const visualizeSelectionSort = async () => {
    if (sorting) return;
    setSorting(true);
    setCurrentStep(0);
    
    try {
      const newArray = [...array];
      const n = newArray.length;
      let totalSwaps = 0;
      
      // Toplam adım sayısını hesapla
      setTotalSteps(n - 1);
      
      let currentStepCount = 0;
      
      for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        // Mevcut minimum elemanı vurgula
        highlightBars([i], sortedColor);
        setExplanationText(`${i + 1}. geçiş: ${newArray[i]} başlangıç minimum değeri...`);
        await wait(speed);
        
        // Minimum elemanı bul
        for (let j = i + 1; j < n; j++) {
          // Karşılaştırılan elemanları vurgula
          highlightBars([minIndex, j], comparingColor);
          setExplanationText(`${newArray[j]} ile mevcut minimum ${newArray[minIndex]} karşılaştırılıyor...`);
          await wait(speed);
          
          if (newArray[j] < newArray[minIndex]) {
            // Yeni minimum bulundu
            highlightBars([minIndex], normalColor); // Eski minimumu normale döndür
            minIndex = j;
            highlightBars([minIndex], swappingColor); // Yeni minimumu vurgula
            setExplanationText(`Yeni minimum bulundu: ${newArray[minIndex]}`);
            await wait(speed / 2);
          } else {
            // Karşılaştırılan elemanı normale döndür
            highlightBars([j], normalColor);
          }
        }
        
        // Minimum eleman bulundu, şimdi takas yap
        if (minIndex !== i) {
          // Takas edilecek elemanları vurgula
          highlightBars([i, minIndex], swappingColor);
          setExplanationText(`${newArray[i]} ve ${newArray[minIndex]} yer değiştiriliyor...`);
          await wait(speed);
          
          // Elemanları takas et
          const temp = newArray[i];
          newArray[i] = newArray[minIndex];
          newArray[minIndex] = temp;
          setArray([...newArray]);
          totalSwaps++;
          
          await wait(speed / 2);
        }
        
        // İ pozisyonundaki eleman sıralandı
        highlightBars([i], sortedColor);
        currentStepCount++;
        setCurrentStep(currentStepCount);
        
        // Diğer elemanları normale döndür
        for (let k = i + 1; k < n; k++) {
          highlightBars([k], normalColor);
        }
        
        await wait(speed / 2);
      }
      
      // Son elemanı da sıralanmış olarak işaretle
      highlightBars([n - 1], sortedColor);
      
      // Tüm elemanları sıralanmış olarak işaretle
      setBarColors(Array(n).fill(sortedColor));
      setExplanationText(`Selection Sort tamamlandı! Toplam ${totalSwaps} takas yapıldı.`);
    } catch (error) {
      console.error("Selection Sort sırasında hata:", error);
      setExplanationText("Görselleştirme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Insertion Sort algoritması görselleştirmesi
  const visualizeInsertionSort = async () => {
    if (sorting) return;
    setSorting(true);
    setCurrentStep(0);
    
    try {
      const newArray = [...array];
      const n = newArray.length;
      let totalSwaps = 0;
      
      // Toplam adım sayısını hesapla (n-1 eleman yerleştirilecek)
      setTotalSteps(n - 1);
      
      let currentStepCount = 0;
      
      // İlk eleman zaten sıralı sayılır, ikinci elemandan başla
      highlightBars([0], sortedColor);
      setExplanationText('İlk eleman sıralı kabul ediliyor...');
      await wait(speed);
      
      for (let i = 1; i < n; i++) {
        let key = newArray[i];
        let j = i - 1;
        
        // Mevcut anahtarı vurgula
        highlightBars([i], swappingColor);
        setExplanationText(`${i + 1}. eleman (${key}) sıralı kısma yerleştiriliyor...`);
        await wait(speed);
        
        // Anahtardan büyük elemanları sağa kaydır
        while (j >= 0 && newArray[j] > key) {
          // Karşılaştırılan elemanları vurgula
          highlightBars([j, j + 1], comparingColor);
          setExplanationText(`${newArray[j]} > ${key}, ${newArray[j]} sağa kaydırılıyor...`);
          await wait(speed);
          
          // Elemanı sağa kaydır
          newArray[j + 1] = newArray[j];
          setArray([...newArray]);
          totalSwaps++;
          
          // Kaydırılan elemanı vurgula
          highlightBars([j + 1], comparingColor);
          await wait(speed / 2);
          
          j--;
        }
        
        // Anahtarı doğru pozisyona yerleştir
        newArray[j + 1] = key;
        setArray([...newArray]);
        
        // Yerleştirilen pozisyonu vurgula
        highlightBars([j + 1], swappingColor);
        setExplanationText(`${key} değeri ${j + 2}. pozisyona yerleştirildi.`);
        await wait(speed);
        
        // Sıralı kısmı güncelle (0'dan i'ye kadar tüm elemanlar sıralı)
        const sortedIndices = Array.from({ length: i + 1 }, (_, idx) => idx);
        highlightBars(sortedIndices, sortedColor);
        
        currentStepCount++;
        setCurrentStep(currentStepCount);
        
        await wait(speed / 2);
      }
      
      // Tüm elemanları sıralanmış olarak işaretle
      setBarColors(Array(n).fill(sortedColor));
      setExplanationText(`Insertion Sort tamamlandı! Toplam ${totalSwaps} kaydırma işlemi yapıldı.`);
    } catch (error) {
      console.error("Insertion Sort sırasında hata:", error);
      setExplanationText("Görselleştirme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Merge Sort algoritması görselleştirmesi
  const visualizeMergeSort = async () => {
    if (sorting) return;
    setSorting(true);
    setCurrentStep(0);
    
    try {
      const newArray = [...array];
      const n = newArray.length;
      
      // Toplam adım sayısını hesapla (log n seviye * n karşılaştırma)
      setTotalSteps(Math.ceil(Math.log2(n)) * n);
      
      let currentStepCount = 0;
      
      setExplanationText('Merge Sort başlıyor: Diziyi böl ve birleştir...');
      await wait(speed);
      
      // Merge sort ana fonksiyonu
      const mergeSort = async (arr: number[], left: number, right: number, level: number = 0): Promise<void> => {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        
        // Bölme aşamasını göster
        const divideColor = level % 2 === 0 ? '#3498db' : '#9b59b6'; // Mavi ve mor arasında geçiş
        highlightBars(Array.from({ length: right - left + 1 }, (_, i) => left + i), divideColor);
        setExplanationText(`Seviye ${level + 1}: [${left}-${right}] aralığı [${left}-${mid}] ve [${mid + 1}-${right}] olarak bölünüyor...`);
        await wait(speed);
        
        // Sol yarıyı sırala
        await mergeSort(arr, left, mid, level + 1);
        
        // Sağ yarıyı sırala
        await mergeSort(arr, mid + 1, right, level + 1);
        
        // İki yarıyı birleştir
        await merge(arr, left, mid, right, level);
      };
      
      // Birleştirme fonksiyonu
      const merge = async (arr: number[], left: number, mid: number, right: number, level: number): Promise<void> => {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        // Birleştirme aşamasını başlat
        const mergeColor = '#e67e22'; // Turuncu
        highlightBars(Array.from({ length: right - left + 1 }, (_, idx) => left + idx), mergeColor);
        setExplanationText(`Seviye ${level + 1}: [${left}-${mid}] ve [${mid + 1}-${right}] birleştiriliyor...`);
        await wait(speed);
        
        // İki diziyi karşılaştırarak birleştir
        while (i < leftArr.length && j < rightArr.length) {
          currentStepCount++;
          setCurrentStep(currentStepCount);
          
          // Karşılaştırılan elemanları vurgula
          if (left + i < arr.length && mid + 1 + j < arr.length) {
            highlightBars([k], comparingColor);
            setExplanationText(`${leftArr[i]} ile ${rightArr[j]} karşılaştırılıyor...`);
            await wait(speed);
          }
          
          if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            setExplanationText(`${leftArr[i]} seçildi ve ${k + 1}. pozisyona yerleştirildi.`);
            i++;
          } else {
            arr[k] = rightArr[j];
            setExplanationText(`${rightArr[j]} seçildi ve ${k + 1}. pozisyona yerleştirildi.`);
            j++;
          }
          
          // Diziyi güncelle
          setArray([...arr]);
          highlightBars([k], swappingColor);
          await wait(speed / 2);
          
          k++;
        }
        
        // Kalan elemanları ekle (sol dizi)
        while (i < leftArr.length) {
          arr[k] = leftArr[i];
          setArray([...arr]);
          highlightBars([k], swappingColor);
          setExplanationText(`Sol dizinin kalan elemanı ${leftArr[i]} ekleniyor...`);
          await wait(speed / 2);
          i++;
          k++;
          currentStepCount++;
          setCurrentStep(currentStepCount);
        }
        
        // Kalan elemanları ekle (sağ dizi)
        while (j < rightArr.length) {
          arr[k] = rightArr[j];
          setArray([...arr]);
          highlightBars([k], swappingColor);
          setExplanationText(`Sağ dizinin kalan elemanı ${rightArr[j]} ekleniyor...`);
          await wait(speed / 2);
          j++;
          k++;
          currentStepCount++;
          setCurrentStep(currentStepCount);
        }
        
        // Birleştirme tamamlandı
        highlightBars(Array.from({ length: right - left + 1 }, (_, idx) => left + idx), sortedColor);
        setExplanationText(`[${left}-${right}] aralığı başarıyla birleştirildi.`);
        await wait(speed / 2);
      };
      
      // Merge sort'u başlat
      await mergeSort(newArray, 0, n - 1);
      
      // Tüm elemanları sıralanmış olarak işaretle
      setBarColors(Array(n).fill(sortedColor));
      setExplanationText(`Merge Sort tamamlandı! Dizi başarıyla sıralandı.`);
    } catch (error) {
      console.error("Merge Sort sırasında hata:", error);
      setExplanationText("Görselleştirme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Quick Sort algoritması görselleştirmesi
  const visualizeQuickSort = async () => {
    if (sorting) return;
    setSorting(true);
    setCurrentStep(0);
    
    try {
      const newArray = [...array];
      const n = newArray.length;
      let totalSwaps = 0;
      
      // Toplam adım sayısını hesapla (ortalama n log n)
      setTotalSteps(Math.ceil(n * Math.log2(n)));
      
      let currentStepCount = 0;
      const pivotColor = '#e74c3c'; // Kırmızı - pivot için
      const partitionColor = '#3498db'; // Mavi - partition alanı için
      
      setExplanationText('Quick Sort başlıyor: Pivot seç ve böl...');
      await wait(speed);
      
      // Quick sort ana fonksiyonu
      const quickSort = async (arr: number[], low: number, high: number, level: number = 0): Promise<void> => {
        if (low < high) {
          // Partition alanını göster
          const partitionRange = Array.from({ length: high - low + 1 }, (_, i) => low + i);
          highlightBars(partitionRange, partitionColor);
          setExplanationText(`Seviye ${level + 1}: [${low}-${high}] aralığında partition işlemi başlıyor...`);
          await wait(speed);
          
          // Partition işlemi yap ve pivot indexini al
          const pivotIndex = await partition(arr, low, high, level);
          
          // Pivot doğru pozisyonuna yerleştirildi
          highlightBars([pivotIndex], sortedColor);
          setExplanationText(`Pivot ${arr[pivotIndex]} doğru pozisyonuna (${pivotIndex + 1}. pozisyon) yerleştirildi.`);
          await wait(speed);
          
          // Sol yarıyı sırala (pivottan küçük elemanlar)
          if (pivotIndex - 1 > low) {
            setExplanationText(`Sol yarı [${low}-${pivotIndex - 1}] sıralanıyor...`);
            await wait(speed / 2);
            await quickSort(arr, low, pivotIndex - 1, level + 1);
          }
          
          // Sağ yarıyı sırala (pivottan büyük elemanlar)
          if (pivotIndex + 1 < high) {
            setExplanationText(`Sağ yarı [${pivotIndex + 1}-${high}] sıralanıyor...`);
            await wait(speed / 2);
            await quickSort(arr, pivotIndex + 1, high, level + 1);
          }
        }
      };
      
      // Partition fonksiyonu (Lomuto partition scheme)
      const partition = async (arr: number[], low: number, high: number, level: number): Promise<number> => {
        // Son elemanı pivot olarak seç
        const pivot = arr[high];
        highlightBars([high], pivotColor);
        setExplanationText(`Pivot olarak ${pivot} seçildi (${high + 1}. pozisyon).`);
        await wait(speed);
        
        let i = low - 1; // Küçük elemanların indexi
        
        for (let j = low; j < high; j++) {
          currentStepCount++;
          setCurrentStep(currentStepCount);
          
          // Mevcut elemanı pivot ile karşılaştır
          highlightBars([j, high], comparingColor);
          setExplanationText(`${arr[j]} ile pivot ${pivot} karşılaştırılıyor...`);
          await wait(speed);
          
          if (arr[j] <= pivot) {
            // Eleman pivottan küçük veya eşit, sol tarafa taşı
            i++;
            if (i !== j) {
              // Elemanları takas et
              highlightBars([i, j], swappingColor);
              setExplanationText(`${arr[j]} ≤ ${pivot}, ${arr[i]} ile ${arr[j]} yer değiştiriliyor...`);
              await wait(speed);
              
              [arr[i], arr[j]] = [arr[j], arr[i]];
              setArray([...arr]);
              totalSwaps++;
              await wait(speed / 2);
            } else {
              setExplanationText(`${arr[j]} ≤ ${pivot}, zaten doğru pozisyonda.`);
              await wait(speed / 2);
            }
          } else {
            setExplanationText(`${arr[j]} > ${pivot}, sağ tarafta kalacak.`);
            await wait(speed / 2);
          }
          
          // Renkleri resetle
          highlightBars([j], normalColor);
        }
        
        // Pivotu doğru pozisyonuna yerleştir
        if (i + 1 !== high) {
          highlightBars([i + 1, high], swappingColor);
          setExplanationText(`Pivot ${pivot} doğru pozisyonuna (${i + 2}. pozisyon) yerleştiriliyor...`);
          await wait(speed);
          
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          setArray([...arr]);
          totalSwaps++;
          await wait(speed / 2);
        }
        
        // Sol tarafa pivottan küçük, sağ tarafa büyük elemanlar yerleşti
        const leftRange = Array.from({ length: i + 1 - low }, (_, idx) => low + idx);
        const rightRange = Array.from({ length: high - (i + 1) }, (_, idx) => i + 2 + idx);
        
        if (leftRange.length > 0) {
          highlightBars(leftRange, '#27ae60'); // Yeşil - pivottan küçük
          setExplanationText(`Sol taraf: Pivottan küçük elemanlar [${leftRange.map(idx => arr[idx]).join(', ')}]`);
          await wait(speed / 2);
        }
        
        if (rightRange.length > 0) {
          highlightBars(rightRange, '#e67e22'); // Turuncu - pivottan büyük
          setExplanationText(`Sağ taraf: Pivottan büyük elemanlar [${rightRange.map(idx => arr[idx]).join(', ')}]`);
          await wait(speed / 2);
        }
        
        return i + 1; // Pivot'un final pozisyonu
      };
      
      // Quick sort'u başlat
      await quickSort(newArray, 0, n - 1);
      
      // Tüm elemanları sıralanmış olarak işaretle
      setBarColors(Array(n).fill(sortedColor));
      setExplanationText(`Quick Sort tamamlandı! Toplam ${totalSwaps} takas yapıldı.`);
    } catch (error) {
      console.error("Quick Sort sırasında hata:", error);
      setExplanationText("Görselleştirme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Binary Search algoritması görselleştirmesi
  const visualizeBinarySearch = async () => {
    if (sorting) return;
    
    // Hedef değer kontrolü
    if (!targetValue.trim()) {
      setExplanationText('⚠️ Lütfen aranacak değeri girin!');
      return;
    }
    
    const target = parseInt(targetValue);
    if (isNaN(target)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    
    try {
      // Binary search için diziyi sırala
      const sortedArray = [...array].sort((a, b) => a - b);
      setArray(sortedArray);
      
      setExplanationText('Dizi sıralandı. Binary search başlıyor...');
      await wait(speed);
      
      setTotalSteps(Math.ceil(Math.log2(sortedArray.length)));
      setExplanationText(`🎯 Hedef değer: ${target} | Binary search başlıyor...`);
      
      // Tüm diziyi başlangıçta mavi ile vurgula (arama alanı)
      highlightBars(Array.from({ length: sortedArray.length }, (_, i) => i), '#3498db');
      await wait(speed * 1.5);
      
      let left = 0;
      let right = sortedArray.length - 1;
      let stepCount = 0;
      let found = false;
      const searchColor = '#3498db'; // Mavi - arama alanı
      const midColor = '#e67e22'; // Turuncu - orta eleman
      const eliminatedColor = '#95a5a6'; // Gri - elenen alan
      
      while (left <= right) {
        stepCount++;
        setCurrentStep(stepCount);
        
        // Mevcut arama aralığını vurgula
        resetColors();
        const searchRange = Array.from({ length: right - left + 1 }, (_, i) => left + i);
        highlightBars(searchRange, searchColor);
        
        setExplanationText(`📍 Adım ${stepCount}: Arama aralığı [${left}-${right}] (${right - left + 1} eleman)`);
        await wait(speed);
        
        const mid = Math.floor((left + right) / 2);
        
        // Orta elemanı özel renk ile vurgula
        highlightBars([mid], midColor);
        setExplanationText(`🔍 Orta pozisyon: ${mid + 1} | Orta değer: ${sortedArray[mid]} | Hedef: ${target}`);
        await wait(speed);
        
        if (sortedArray[mid] === target) {
          // Eleman bulundu!
          highlightBars([mid], sortedColor);
          setExplanationText(`🎉 BULUNDU! ${target} değeri ${mid + 1}. pozisyonda (${stepCount} adımda)`);
          found = true;
          
          // Başarı animasyonu - bulunan elemanı vurgula
          for (let i = 0; i < 3; i++) {
            await wait(200);
            highlightBars([mid], swappingColor);
            await wait(200);
            highlightBars([mid], sortedColor);
          }
          break;
        } else if (sortedArray[mid] < target) {
          // Hedef sağ yarıda - sol yarıyı eleme
          const eliminatedRange = Array.from({ length: mid - left + 1 }, (_, i) => left + i);
          highlightBars(eliminatedRange, eliminatedColor);
          
          setExplanationText(`📈 ${sortedArray[mid]} < ${target} → Sol yarı eleniyor [${left}-${mid}]`);
          await wait(speed);
          
          left = mid + 1;
          setExplanationText(`➡️ Yeni arama aralığı: [${left}-${right}]`);
          await wait(speed / 2);
        } else {
          // Hedef sol yarıda - sağ yarıyı eleme
          const eliminatedRange = Array.from({ length: right - mid + 1 }, (_, i) => mid + i);
          highlightBars(eliminatedRange, eliminatedColor);
          
          setExplanationText(`📉 ${sortedArray[mid]} > ${target} → Sağ yarı eleniyor [${mid}-${right}]`);
          await wait(speed);
          
          right = mid - 1;
          setExplanationText(`⬅️ Yeni arama aralığı: [${left}-${right}]`);
          await wait(speed / 2);
        }
      }
      
      if (!found) {
        // Hedef bulunamadı
        resetColors();
        setExplanationText(`❌ ${target} değeri dizide bulunamadı! (${stepCount} adımda kontrol edildi)`);
        
        // Tüm diziyi gri yap (bulunamadı göstergesi)
        highlightBars(Array.from({ length: sortedArray.length }, (_, i) => i), eliminatedColor);
        await wait(speed);
      }
      
      // Özet bilgi
      const efficiency = ((Math.log2(sortedArray.length) / sortedArray.length) * 100).toFixed(1);
      setExplanationText(
        found 
          ? `✅ Binary Search tamamlandı! Hedef ${stepCount} adımda bulundu. Verimlilik: %${efficiency}`
          : `❌ Binary Search tamamlandı! Hedef ${stepCount} adımda bulunamadığı kesinleşti. Verimlilik: %${efficiency}`
      );
      
    } catch (error) {
      console.error("Binary Search sırasında hata:", error);
      setExplanationText("Görselleştirme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Singly Linked List görselleştirmesi
  const visualizeSinglyLinkedList = async () => {
    if (sorting) return;
    
    // Operasyon tipine göre uygun fonksiyonu çağır
    switch (selectedOperation) {
      case 'demo':
        await performLinkedListDemo();
        break;
      case 'prepend':
        await performPrepend();
        break;
      case 'append':
        await performAppend();
        break;
      case 'insert':
        await performInsertAt();
        break;
      case 'search':
        await performSearch();
        break;
      case 'deleteHead':
        await performDeleteHead();
        break;
      case 'deleteTail':
        await performDeleteTail();
        break;
      case 'deleteValue':
        await performDeleteValue();
        break;
      case 'traverse':
        await performTraverse();
        break;
      case 'clear':
        await performClear();
        break;
      default:
        setExplanationText('Lütfen bir işlem seçin.');
    }
  };
  
  // Doubly Linked List görselleştirmesi
  const visualizeDoublyLinkedList = async () => {
    if (sorting) return;
    
    // Operasyon tipine göre uygun fonksiyonu çağır
    switch (selectedOperation) {
      case 'demo':
        await performDoublyLinkedListDemo();
        break;
      case 'prepend':
        await performDoublyPrepend();
        break;
      case 'append':
        await performDoublyAppend();
        break;
      case 'insert':
        await performDoublyInsertAt();
        break;
      case 'search':
        await performDoublySearch();
        break;
      case 'deleteHead':
        await performDoublyDeleteHead();
        break;
      case 'deleteTail':
        await performDoublyDeleteTail();
        break;
      case 'deleteValue':
        await performDoublyDeleteValue();
        break;
      case 'traverse':
        await performDoublyTraverse();
        break;
      case 'traverseBackward':
        await performDoublyTraverseBackward();
        break;
      case 'clear':
        await performDoublyClear();
        break;
      default:
        setExplanationText('Lütfen bir işlem seçin.');
    }
  };
  
  // Demo - Tüm operasyonları sırayla göster
  const performLinkedListDemo = async () => {
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(10);
    
    try {
      let linkedList = [...array];
      setExplanationText('🔗 Tek Yönlü Bağlı Liste Demo: Veri yapısının temel operasyonlarını keşfedelim...');
      await wait(speed);
      
      // Bağlı liste spesifik demo adımları
      const linkedListOperations = [
        { name: 'Yapı Açıklaması', action: () => explainStructure(linkedList) },
        { name: 'HEAD Pointer', action: () => showHeadPointer(linkedList) },
        { name: 'Başa Ekleme O(1)', action: () => demoInsert(linkedList, 'head') },
        { name: 'Sona Ekleme O(n)', action: () => demoInsert(linkedList, 'tail') },
        { name: 'Doğrusal Arama O(n)', action: () => demoSearch(linkedList) },
        { name: 'Liste Dolaşma O(n)', action: () => demoTraverse(linkedList) },
        { name: 'Baştan Silme O(1)', action: () => demoDelete(linkedList, 'head') },
        { name: 'Sondan Silme O(n)', action: () => demoDelete(linkedList, 'tail') },
        { name: 'Bellek Yönetimi', action: () => showMemoryManagement(linkedList) },
        { name: 'Demo Tamamlandı', action: () => demoComplete(linkedList) }
      ];
      
      for (let i = 0; i < linkedListOperations.length; i++) {
        setCurrentStep(i + 1);
        await linkedListOperations[i].action();
        linkedList = [...array]; // Güncel listeyi al
      }
      
    } catch (error) {
      console.error("Bağlı Liste Demo sırasında hata:", error);
      setExplanationText("Demo sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Başa ekleme (Prepend)
  const performPrepend = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen eklenecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(3);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`➕ Başa ${value} değeri ekleniyor...`);
      resetColors();
      await wait(speed);
      
      setCurrentStep(2);
      setExplanationText(`🔗 Yeni düğümün next pointer'ı mevcut HEAD'i gösterecek...`);
      if (linkedList.length > 0) {
        highlightBars([0], comparingColor); // Mevcut head
      }
      await wait(speed);
      
      setCurrentStep(3);
      linkedList.unshift(value);
      setArray([...linkedList]);
      highlightBars([0], swappingColor); // Yeni head
      setExplanationText(`✅ ${value} başa eklendi! HEAD pointer artık yeni düğümü gösteriyor. Zaman: O(1)`);
      setInputValue(''); // Input'u temizle
      
    } catch (error) {
      console.error("Prepend sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Sona ekleme (Append)
  const performAppend = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen eklenecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length + 2);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`➕ Sona ${value} değeri ekleniyor...`);
      resetColors();
      await wait(speed);
      
      // Son düğümü bul
      for (let i = 0; i < linkedList.length; i++) {
        setCurrentStep(i + 2);
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm kontrol ediliyor... Son düğümü arıyoruz.`);
        await wait(speed / 2);
      }
      
      setCurrentStep(linkedList.length + 2);
      linkedList.push(value);
      setArray([...linkedList]);
      highlightBars([linkedList.length - 1], swappingColor); // Yeni tail
      setExplanationText(`✅ ${value} sona eklendi! Son düğümün next'i yeni düğümü gösteriyor. Zaman: O(n)`);
      setInputValue(''); // Input'u temizle
      
    } catch (error) {
      console.error("Append sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Belirli pozisyona ekleme
  const performInsertAt = async () => {
    if (!inputValue.trim() || !insertPosition.trim()) {
      setExplanationText('⚠️ Lütfen değer ve pozisyon girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    const position = parseInt(insertPosition);
    
    if (isNaN(value) || isNaN(position)) {
      setExplanationText('⚠️ Lütfen geçerli sayılar girin!');
      return;
    }
    
    if (position < 0 || position > array.length) {
      setExplanationText(`⚠️ Pozisyon 0-${array.length} arasında olmalı!`);
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(position + 3);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`🎯 ${position + 1}. pozisyona ${value} ekleniyor...`);
      resetColors();
      await wait(speed);
      
      // Pozisyona kadar git
      for (let i = 0; i < position; i++) {
        setCurrentStep(i + 2);
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğümden ${position + 1}. pozisyona gidiyoruz...`);
        await wait(speed / 2);
      }
      
      setCurrentStep(position + 2);
      if (position < linkedList.length) {
        highlightBars([position], comparingColor);
        setExplanationText(`🔗 Yeni düğüm ${position + 1}. pozisyondaki düğümün önüne eklenecek...`);
        await wait(speed);
      }
      
      setCurrentStep(position + 3);
      linkedList.splice(position, 0, value);
      setArray([...linkedList]);
      highlightBars([position], swappingColor);
      setExplanationText(`✅ ${value} değeri ${position + 1}. pozisyona eklendi! Pointer'lar güncellendi. Zaman: O(n)`);
      setInputValue('');
      setInsertPosition('');
      
    } catch (error) {
      console.error("Insert sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Arama
  const performSearch = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen aranacak değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      let found = false;
      let foundIndex = -1;
      
      setExplanationText(`🔍 ${value} değeri aranıyor...`);
      resetColors();
      await wait(speed);
      
      // Sırayla arama
      for (let i = 0; i < array.length; i++) {
        setCurrentStep(i + 1);
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm kontrol ediliyor: ${array[i]} === ${value}?`);
        await wait(speed);
        
        if (array[i] === value) {
          highlightBars([i], sortedColor);
          setExplanationText(`🎉 ${value} değeri ${i + 1}. pozisyonda bulundu! Zaman: O(${i + 1})`);
          found = true;
          foundIndex = i;
          break;
        } else {
          highlightBars([i], '#95a5a6'); // Gri - kontrol edildi
        }
      }
      
      if (!found) {
        setExplanationText(`❌ ${value} değeri listede bulunamadı! Zaman: O(n)`);
      }
      
      setInputValue('');
      
    } catch (error) {
      console.error("Search sırasında hata:", error);
      setExplanationText("Arama sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Baştan silme
  const performDeleteHead = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Silinecek eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(3);
    
    try {
      let linkedList = [...array];
      const deletedValue = linkedList[0];
      
      setCurrentStep(1);
      highlightBars([0], swappingColor);
      setExplanationText(`🗑️ Baştan eleman siliniyor: ${deletedValue}`);
      await wait(speed);
      
      setCurrentStep(2);
      if (linkedList.length > 1) {
        highlightBars([1], comparingColor);
        setExplanationText(`🔗 HEAD pointer ikinci düğümü (${linkedList[1]}) gösterecek...`);
        await wait(speed);
      }
      
      setCurrentStep(3);
      linkedList.shift();
      setArray([...linkedList]);
      resetColors();
      setExplanationText(`✅ ${deletedValue} silindi! HEAD pointer güncellendi. Zaman: O(1)`);
      
    } catch (error) {
      console.error("Delete head sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Sondan silme
  const performDeleteTail = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Silinecek eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length + 1);
    
    try {
      let linkedList = [...array];
      const deletedValue = linkedList[linkedList.length - 1];
      
      setExplanationText(`🗑️ Sondan eleman siliniyor: ${deletedValue}`);
      resetColors();
      await wait(speed);
      
      // Son elemandan önceki elemana git
      for (let i = 0; i < linkedList.length - 1; i++) {
        setCurrentStep(i + 1);
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm: Son elemandan önceki düğümü arıyoruz...`);
        await wait(speed / 2);
      }
      
      setCurrentStep(linkedList.length);
      highlightBars([linkedList.length - 1], swappingColor);
      setExplanationText(`🔗 Son düğümün bağlantısı koparılıyor...`);
      await wait(speed);
      
      setCurrentStep(linkedList.length + 1);
      linkedList.pop();
      setArray([...linkedList]);
      resetColors();
      setExplanationText(`✅ ${deletedValue} silindi! Önceki düğümün next'i NULL olarak ayarlandı. Zaman: O(n)`);
      
    } catch (error) {
      console.error("Delete tail sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Belirli değer silme
  const performDeleteValue = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen silinecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      let linkedList = [...array];
      let found = false;
      
      setExplanationText(`🗑️ ${value} değeri aranıp siliniyor...`);
      resetColors();
      await wait(speed);
      
      // Değeri ara ve sil
      for (let i = 0; i < linkedList.length; i++) {
        setCurrentStep(i + 1);
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm kontrol ediliyor: ${linkedList[i]} === ${value}?`);
        await wait(speed);
        
        if (linkedList[i] === value) {
          highlightBars([i], swappingColor);
          setExplanationText(`🗑️ ${value} bulundu! Düğüm siliniyor...`);
          await wait(speed);
          
          linkedList.splice(i, 1);
          setArray([...linkedList]);
          setExplanationText(`✅ ${value} silindi! Önceki düğümün pointer'ı güncellenidi. Zaman: O(n)`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        setExplanationText(`❌ ${value} değeri listede bulunamadı!`);
      }
      
      setInputValue('');
      
    } catch (error) {
      console.error("Delete value sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Traverse
  const performTraverse = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Dolaşılacak eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      setExplanationText('🚶‍♂️ Liste baştan sona dolaşılıyor...');
      resetColors();
      await wait(speed);
      
      for (let i = 0; i < array.length; i++) {
        setCurrentStep(i + 1);
        highlightBars([i], '#3498db');
        setExplanationText(`🚶‍♂️ ${i + 1}. düğüm ziyaret ediliyor: ${array[i]}`);
        await wait(speed);
      }
      
      highlightBars(Array.from({ length: array.length }, (_, i) => i), sortedColor);
      setExplanationText(`✅ Tüm liste dolaşıldı! ${array.length} düğüm ziyaret edildi. Zaman: O(n)`);
      
    } catch (error) {
      console.error("Traverse sırasında hata:", error);
      setExplanationText("Dolaşma sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Listeyi temizle
  const performClear = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste zaten boş!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(1);
    
    try {
      setCurrentStep(1);
      setExplanationText('🗑️ Tüm liste temizleniyor...');
      highlightBars(Array.from({ length: array.length }, (_, i) => i), swappingColor);
      await wait(speed);
      
      setArray([]);
      resetColors();
      setExplanationText('✅ Liste tamamen temizlendi! HEAD pointer NULL olarak ayarlandı.');
      
    } catch (error) {
      console.error("Clear sırasında hata:", error);
      setExplanationText("Temizleme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Demo yardımcı fonksiyonları
  const showHeadPointer = async (linkedList: number[]) => {
    if (linkedList.length > 0) {
      highlightBars([0], '#3498db');
      setExplanationText(`👆 HEAD pointer ilk düğümü (${linkedList[0]}) işaret ediyor.`);
      await wait(speed);
    }
  };
  
  const demoInsert = async (linkedList: number[], position: 'head' | 'tail') => {
    const value = Math.floor(Math.random() * 100) + 1;
    if (position === 'head') {
      setExplanationText(`➕ Başa Ekleme: Yeni düğüm (${value}) oluşturuluyor...`);
      await wait(speed / 2);
      setExplanationText(`🔗 Yeni düğümün next'i mevcut HEAD'i gösterecek...`);
      await wait(speed / 2);
      linkedList.unshift(value);
      setArray([...linkedList]);
      highlightBars([0], swappingColor);
      setExplanationText(`✅ ${value} başa eklendi! HEAD pointer güncellendi. Zaman: O(1)`);
    } else {
      setExplanationText(`➕ Sona Ekleme: ${value} için yeni düğüm oluşturuluyor...`);
      await wait(speed / 2);
      setExplanationText(`🔍 Son düğümü bulmak için listede dolaşıyoruz... O(n)`);
      await wait(speed / 2);
      linkedList.push(value);
      setArray([...linkedList]);
      highlightBars([linkedList.length - 1], swappingColor);
      setExplanationText(`✅ ${value} sona eklendi! Son düğümün next'i güncellendi. Zaman: O(n)`);
    }
    await wait(speed);
  };
  
  const demoSearch = async (linkedList: number[]) => {
    if (linkedList.length > 0) {
      const searchValue = linkedList[Math.floor(linkedList.length / 2)];
      setExplanationText(`🔍 Doğrusal Arama: ${searchValue} değeri HEAD'den başlayarak aranıyor...`);
      
      for (let i = 0; i < linkedList.length; i++) {
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm kontrol ediliyor: ${linkedList[i]} === ${searchValue}?`);
        await wait(speed / 3);
        if (linkedList[i] === searchValue) {
          highlightBars([i], sortedColor);
          setExplanationText(`🎉 ${searchValue} bulundu! ${i + 1} adımda. Average: O(n/2), Worst: O(n)`);
          await wait(speed);
          break;
        }
      }
    }
  };
  
  const demoTraverse = async (linkedList: number[]) => {
    setExplanationText('🚶‍♂️ Liste Dolaşma: HEAD\'den başlayarak her düğüm next pointer ile ziyaret ediliyor...');
    for (let i = 0; i < linkedList.length; i++) {
      highlightBars([i], '#3498db');
      setExplanationText(`🚶‍♂️ ${i + 1}. düğüm ziyaret edildi: ${linkedList[i]} → next`);
      await wait(speed / 3);
    }
    setExplanationText('✅ Traverse tamamlandı! Tüm düğümler tek tek ziyaret edildi. Zaman: O(n)');
    await wait(speed / 2);
  };
  
  const demoDelete = async (linkedList: number[], position: 'head' | 'tail') => {
    if (linkedList.length === 0) return;
    
    if (position === 'head') {
      const value = linkedList[0];
      highlightBars([0], swappingColor);
      setExplanationText(`🗑️ Baştan Silme: HEAD düğümü (${value}) siliniyor...`);
      await wait(speed);
      setExplanationText(`🔗 HEAD pointer ikinci düğümü gösterecek şekilde güncelleniyor...`);
      await wait(speed / 2);
      linkedList.shift();
      setArray([...linkedList]);
      setExplanationText(`✅ ${value} silindi! HEAD güncellendi. Zaman: O(1)`);
    } else {
      const value = linkedList[linkedList.length - 1];
      setExplanationText(`🗑️ Sondan Silme: Son düğüm (${value}) için önceki düğüm aranıyor...`);
      await wait(speed / 2);
      highlightBars([linkedList.length - 1], swappingColor);
      setExplanationText(`🔗 Önceki düğümün next'i NULL olarak ayarlanıyor...`);
      await wait(speed);
      linkedList.pop();
      setArray([...linkedList]);
      setExplanationText(`✅ ${value} silindi! Son düğümün bağlantısı kesildi. Zaman: O(n)`);
    }
    await wait(speed / 2);
  };
  
  const demoComplete = async (linkedList: number[]) => {
    highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), sortedColor);
    const summary = linkedList.length > 0 ? 
      `[HEAD→${linkedList.join('→')}→NULL]` : 
      '[HEAD→NULL (Boş Liste)]';
    setExplanationText(`✅ Bağlı Liste Demo tamamlandı! Final durum: ${summary} (${linkedList.length} düğüm)`);
    await wait(speed);
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
      case 'selection sort':
        visualizeSelectionSort();
        break;
      case 'insertion sort':
        visualizeInsertionSort();
        break;
      case 'merge sort':
        visualizeMergeSort();
        break;
      case 'quick sort':
        visualizeQuickSort();
        break;
      case 'binary search':
        visualizeBinarySearch();
        break;
      case 'singly linked list':
      case 'tekli bağlı liste':
      case 'tek yönlü bağlı liste':
      case 'singly linked':
        visualizeSinglyLinkedList();
        break;
      case 'doubly linked list':
      case 'çift yönlü bağlı liste':
      case 'çiftli bağlı liste':
      case 'doubly linked':
        visualizeDoublyLinkedList();
        break;
      case 'circular linked list':
      case 'dairesel bağlı liste':
      case 'dairesel bagli liste':
      case 'circular linked':
      case 'döngüsel bağlı liste':
      case 'dongusel bagli liste':
      case 'halka bağlı liste':
      case 'halka bagli liste':
        visualizeCircularLinkedList();
        break;
      default:
        setExplanationText(`${algorithmType} algoritması için görselleştirme henüz eklenmedi.`);
    }
  };
  
  // Maksimum bar yüksekliğini bul
  const maxArrayValue = Math.max(...array);
  
  // Yapı açıklaması
  const explainStructure = async (linkedList: number[]) => {
    resetColors();
    setExplanationText('📋 Bağlı Liste Yapısı: Her düğüm bir veri ve bir sonraki düğüme işaret eden pointer içerir.');
    await wait(speed);
    
    if (linkedList.length > 0) {
      highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), '#3498db');
      setExplanationText(`🔗 Düğümler: [${linkedList.map((val, i) => `${val}→`).join('')}NULL] - Son düğüm NULL'ı gösterir.`);
      await wait(speed);
    }
  };
  
  // Bellek yönetimi açıklaması
  const showMemoryManagement = async (linkedList: number[]) => {
    resetColors();
    setExplanationText('💾 Bellek Yönetimi: Düğümler bellekte rastgele yerlerde saklanır, pointer\'lar onları birbirine bağlar.');
    await wait(speed);
    
    if (linkedList.length > 0) {
      highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), '#e67e22');
      setExplanationText(`📊 Bellek Kullanımı: ${linkedList.length} düğüm × (veri + pointer) = Dinamik boyut`);
      await wait(speed);
    }
  };
  
  // Çift Yönlü Bağlı Liste Fonksiyonları
  
  // Demo - Çift yönlü bağlı liste operasyonları
  const performDoublyLinkedListDemo = async () => {
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(12);
    
    try {
      let linkedList = [...array];
      setExplanationText('🔗↔️ Çift Yönlü Bağlı Liste Demo: İleri ve geri yönde bağlantıları keşfedelim...');
      await wait(speed);
      
      // Çift yönlü bağlı liste spesifik demo adımları
      const doublyOperations = [
        { name: 'Yapı Açıklaması', action: () => explainDoublyStructure(linkedList) },
        { name: 'HEAD & TAIL Pointers', action: () => showHeadTailPointers(linkedList) },
        { name: 'Başa Ekleme O(1)', action: () => doublyDemoInsert(linkedList, 'head') },
        { name: 'Sona Ekleme O(1)', action: () => doublyDemoInsert(linkedList, 'tail') },
        { name: 'Çift Yönlü Arama', action: () => doublyDemoSearch(linkedList) },
        { name: 'İleri Dolaşma', action: () => doublyDemoTraverse(linkedList, 'forward') },
        { name: 'Geri Dolaşma', action: () => doublyDemoTraverse(linkedList, 'backward') },
        { name: 'Baştan Silme O(1)', action: () => doublyDemoDelete(linkedList, 'head') },
        { name: 'Sondan Silme O(1)', action: () => doublyDemoDelete(linkedList, 'tail') },
        { name: 'Bidirectional Links', action: () => showBidirectionalLinks(linkedList) },
        { name: 'Bellek Avantajları', action: () => showDoublyMemoryAdvantages(linkedList) },
        { name: 'Demo Tamamlandı', action: () => doublyDemoComplete(linkedList) }
      ];
      
      for (let i = 0; i < doublyOperations.length; i++) {
        setCurrentStep(i + 1);
        await doublyOperations[i].action();
        linkedList = [...array]; // Güncel listeyi al
      }
      
    } catch (error) {
      console.error("Çift Yönlü Bağlı Liste Demo sırasında hata:", error);
      setExplanationText("Demo sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü başa ekleme
  const performDoublyPrepend = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen eklenecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(4);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`➕ Çift yönlü başa ekleme: ${value} için yeni düğüm oluşturuluyor...`);
      resetColors();
      await wait(speed);
      
      setCurrentStep(2);
      setExplanationText(`🔗 Yeni düğümün next'i mevcut HEAD'i gösterecek...`);
      if (linkedList.length > 0) {
        highlightBars([0], comparingColor); // Mevcut head
      }
      await wait(speed);
      
      setCurrentStep(3);
      setExplanationText(`🔗↔️ Mevcut HEAD'in previous'ı yeni düğümü gösterecek...`);
      await wait(speed);
      
      setCurrentStep(4);
      linkedList.unshift(value);
      setArray([...linkedList]);
      highlightBars([0], swappingColor); // Yeni head
      setExplanationText(`✅ ${value} başa eklendi! HEAD güncellendi, çift yönlü bağlantılar kuruldu. Zaman: O(1)`);
      setInputValue('');
      
    } catch (error) {
      console.error("Doubly Prepend sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü sona ekleme
  const performDoublyAppend = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen eklenecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(4);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`➕ Çift yönlü sona ekleme: ${value} için yeni düğüm oluşturuluyor...`);
      resetColors();
      await wait(speed);
      
      setCurrentStep(2);
      setExplanationText(`🔗 TAIL pointer sayesinde son düğüme direkt erişim! O(1)`);
      if (linkedList.length > 0) {
        highlightBars([linkedList.length - 1], comparingColor); // Mevcut tail
      }
      await wait(speed);
      
      setCurrentStep(3);
      setExplanationText(`🔗↔️ Çift yönlü bağlantılar kuruluyor: previous ← → next`);
      await wait(speed);
      
      setCurrentStep(4);
      linkedList.push(value);
      setArray([...linkedList]);
      highlightBars([linkedList.length - 1], swappingColor); // Yeni tail
      setExplanationText(`✅ ${value} sona eklendi! TAIL güncellendi, çift yönlü bağlantılar kuruldu. Zaman: O(1)`);
      setInputValue('');
      
    } catch (error) {
      console.error("Doubly Append sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü pozisyona ekleme
  const performDoublyInsertAt = async () => {
    if (!inputValue.trim() || !insertPosition.trim()) {
      setExplanationText('⚠️ Lütfen değer ve pozisyon girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    const position = parseInt(insertPosition);
    
    if (isNaN(value) || isNaN(position)) {
      setExplanationText('⚠️ Lütfen geçerli sayılar girin!');
      return;
    }
    
    if (position < 0 || position > array.length) {
      setExplanationText(`⚠️ Pozisyon 0-${array.length} arasında olmalı!`);
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(6);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`🎯 Çift yönlü pozisyona ekleme: ${position + 1}. pozisyona ${value} ekleniyor...`);
      resetColors();
      await wait(speed);
      
      setCurrentStep(2);
      const isNearHead = position < linkedList.length / 2;
      setExplanationText(`🧠 Optimizasyon: ${isNearHead ? 'HEAD\'den ileri' : 'TAIL\'den geri'} gidilecek!`);
      await wait(speed);
      
      // Optimum yönden traverse etmeyi simüle et
      setCurrentStep(3);
      if (isNearHead) {
        for (let i = 0; i < position; i++) {
          highlightBars([i], comparingColor);
          setExplanationText(`➡️ HEAD\'den ${i + 1}. adım: pozisyona doğru ilerleniyor...`);
          await wait(speed / 3);
        }
      } else {
        for (let i = linkedList.length - 1; i > position; i--) {
          highlightBars([i], comparingColor);
          setExplanationText(`⬅️ TAIL\'den ${linkedList.length - i}. adım: pozisyona doğru geriye gidiliyor...`);
          await wait(speed / 3);
        }
      }
      
      setCurrentStep(4);
      if (position < linkedList.length) {
        highlightBars([position], comparingColor);
        setExplanationText(`🔗↔️ Pozisyon bulundu! Çift yönlü bağlantılar güncelleniyor...`);
        await wait(speed);
      }
      
      setCurrentStep(5);
      setExplanationText(`🔗 Previous ← ${value} → Next bağlantıları kuruluyor...`);
      await wait(speed);
      
      setCurrentStep(6);
      linkedList.splice(position, 0, value);
      setArray([...linkedList]);
      highlightBars([position], swappingColor);
      setExplanationText(`✅ ${value} değeri ${position + 1}. pozisyona eklendi! Optimum yön kullanıldı. Zaman: O(n/2)`);
      setInputValue('');
      setInsertPosition('');
      
    } catch (error) {
      console.error("Doubly Insert sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü arama
  const performDoublySearch = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen aranacak değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      let found = false;
      let foundIndex = -1;
      
      setExplanationText(`🔍 Çift yönlü arama: ${value} değeri HEAD ve TAIL\'den aranacak...`);
      resetColors();
      await wait(speed);
      
      // Çift yönlü arama simülasyonu (dışarıdan içe doğru)
      let left = 0;
      let right = array.length - 1;
      let steps = 0;
      
      while (left <= right && !found) {
        steps++;
        setCurrentStep(steps);
        
        // Sol taraftan ara
        if (left <= right) {
          highlightBars([left], comparingColor);
          setExplanationText(`🔍➡️ HEAD tarafından ${left + 1}. pozisyon kontrol ediliyor: ${array[left]} === ${value}?`);
          await wait(speed);
          
          if (array[left] === value) {
            highlightBars([left], sortedColor);
            setExplanationText(`🎉 ${value} değeri ${left + 1}. pozisyonda bulundu! (HEAD tarafından, ${steps} adımda)`);
            found = true;
            foundIndex = left;
            break;
          }
          left++;
        }
        
        // Sağ taraftan ara
        if (left <= right && !found) {
          highlightBars([right], comparingColor);
          setExplanationText(`🔍⬅️ TAIL tarafından ${right + 1}. pozisyon kontrol ediliyor: ${array[right]} === ${value}?`);
          await wait(speed);
          
          if (array[right] === value) {
            highlightBars([right], sortedColor);
            setExplanationText(`🎉 ${value} değeri ${right + 1}. pozisyonda bulundu! (TAIL tarafından, ${steps} adımda)`);
            found = true;
            foundIndex = right;
            break;
          }
          right--;
        }
      }
      
      if (!found) {
        setExplanationText(`❌ ${value} değeri listede bulunamadı! Çift yönlü arama ile ${steps} adımda kontrol edildi.`);
      }
      
      setInputValue('');
      
    } catch (error) {
      console.error("Doubly Search sırasında hata:", error);
      setExplanationText("Arama sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü baştan silme
  const performDoublyDeleteHead = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Silinecek eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(4);
    
    try {
      let linkedList = [...array];
      const deletedValue = linkedList[0];
      
      setCurrentStep(1);
      highlightBars([0], swappingColor);
      setExplanationText(`🗑️ Çift yönlü baştan silme: HEAD düğümü (${deletedValue}) siliniyor...`);
      await wait(speed);
      
      setCurrentStep(2);
      setExplanationText(`🔗 HEAD pointer ikinci düğümü gösterecek...`);
      if (linkedList.length > 1) {
        highlightBars([1], comparingColor);
      }
      await wait(speed);
      
      setCurrentStep(3);
      setExplanationText(`🔗↔️ Yeni HEAD'in previous pointer'ı NULL olarak ayarlanıyor...`);
      await wait(speed);
      
      setCurrentStep(4);
      linkedList.shift();
      setArray([...linkedList]);
      resetColors();
      setExplanationText(`✅ ${deletedValue} silindi! HEAD güncellendi, çift yönlü bağlantılar temizlendi. Zaman: O(1)`);
      
    } catch (error) {
      console.error("Doubly Delete head sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü sondan silme
  const performDoublyDeleteTail = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Silinecek eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(4);
    
    try {
      let linkedList = [...array];
      const deletedValue = linkedList[linkedList.length - 1];
      
      setCurrentStep(1);
      highlightBars([linkedList.length - 1], swappingColor);
      setExplanationText(`🗑️ Çift yönlü sondan silme: TAIL düğümü (${deletedValue}) siliniyor...`);
      await wait(speed);
      
      setCurrentStep(2);
      setExplanationText(`🔗 TAIL pointer'ı önceki düğümü gösterecek...`);
      if (linkedList.length > 1) {
        highlightBars([linkedList.length - 2], comparingColor);
      }
      await wait(speed);
      
      setCurrentStep(3);
      setExplanationText(`🔗↔️ Yeni TAIL'in next pointer'ı NULL olarak ayarlanıyor...`);
      await wait(speed);
      
      setCurrentStep(4);
      linkedList.pop();
      setArray([...linkedList]);
      resetColors();
      setExplanationText(`✅ ${deletedValue} silindi! TAIL güncellendi, çift yönlü bağlantılar temizlendi. Zaman: O(1)`);
      
    } catch (error) {
      console.error("Doubly Delete tail sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü değer silme
  const performDoublyDeleteValue = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen silinecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      let linkedList = [...array];
      let found = false;
      
      setExplanationText(`🗑️ Çift yönlü değer silme: ${value} değeri aranıp siliniyor...`);
      resetColors();
      await wait(speed);
      
      // Değeri ara ve sil
      for (let i = 0; i < linkedList.length; i++) {
        setCurrentStep(i + 1);
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm kontrol ediliyor: ${linkedList[i]} === ${value}?`);
        await wait(speed);
        
        if (linkedList[i] === value) {
          highlightBars([i], swappingColor);
          setExplanationText(`🗑️ ${value} bulundu! Çift yönlü bağlantılar güncelleniyor...`);
          await wait(speed);
          
          setExplanationText(`🔗 Previous.next = current.next, Next.previous = current.previous`);
          await wait(speed);
          
          linkedList.splice(i, 1);
          setArray([...linkedList]);
          setExplanationText(`✅ ${value} silindi! Çift yönlü bağlantılar korundu. Zaman: O(n)`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        setExplanationText(`❌ ${value} değeri listede bulunamadı!`);
      }
      
      setInputValue('');
      
    } catch (error) {
      console.error("Doubly Delete value sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü ileri traverse
  const performDoublyTraverse = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Dolaşılacak eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      setExplanationText('🚶‍♂️➡️ İleri Dolaşma: HEAD\'den TAIL\'e doğru next pointer\'ları takip ediliyor...');
      resetColors();
      await wait(speed);
      
      for (let i = 0; i < array.length; i++) {
        setCurrentStep(i + 1);
        highlightBars([i], '#3498db');
        setExplanationText(`➡️ ${i + 1}. düğüm ziyaret edildi: ${array[i]} (next→)`);
        await wait(speed);
      }
      
      highlightBars(Array.from({ length: array.length }, (_, i) => i), sortedColor);
      setExplanationText(`✅ İleri dolaşma tamamlandı! ${array.length} düğüm HEAD→TAIL yönünde ziyaret edildi.`);
      
    } catch (error) {
      console.error("Doubly Traverse sırasında hata:", error);
      setExplanationText("Dolaşma sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü geri traverse
  const performDoublyTraverseBackward = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Dolaşılacak eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      setExplanationText('🚶‍♂️⬅️ Geri Dolaşma: TAIL\'den HEAD\'e doğru previous pointer\'ları takip ediliyor...');
      resetColors();
      await wait(speed);
      
      for (let i = array.length - 1; i >= 0; i--) {
        setCurrentStep(array.length - i);
        highlightBars([i], '#e67e22');
        setExplanationText(`⬅️ ${array.length - i}. adım: ${array[i]} (←previous)`);
        await wait(speed);
      }
      
      highlightBars(Array.from({ length: array.length }, (_, i) => i), sortedColor);
      setExplanationText(`✅ Geri dolaşma tamamlandı! ${array.length} düğüm TAIL←HEAD yönünde ziyaret edildi.`);
      
    } catch (error) {
      console.error("Doubly Traverse Backward sırasında hata:", error);
      setExplanationText("Geri dolaşma sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü listeyi temizle
  const performDoublyClear = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste zaten boş!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(1);
    
    try {
      setCurrentStep(1);
      setExplanationText('🗑️ Çift yönlü liste tamamen temizleniyor...');
      highlightBars(Array.from({ length: array.length }, (_, i) => i), swappingColor);
      await wait(speed);
      
      setArray([]);
      resetColors();
      setExplanationText('✅ Liste tamamen temizlendi! HEAD ve TAIL pointer\'ları NULL olarak ayarlandı.');
      
    } catch (error) {
      console.error("Doubly Clear sırasında hata:", error);
      setExplanationText("Temizleme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Çift yönlü yapı açıklaması
  const explainDoublyStructure = async (linkedList: number[]) => {
    resetColors();
    setExplanationText('📋↔️ Çift Yönlü Bağlı Liste: Her düğüm bir veri, bir next ve bir previous pointer içerir.');
    await wait(speed);
    
    if (linkedList.length > 0) {
      highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), '#3498db');
      setExplanationText(`🔗 Yapı: [NULL←${linkedList.map((val, i) => `${val}`).join('↔')}→NULL] - Çift yönlü bağlantılar`);
      await wait(speed);
    }
  };
  
  // HEAD ve TAIL pointer'ları göster
  const showHeadTailPointers = async (linkedList: number[]) => {
    if (linkedList.length > 0) {
      // HEAD'i vurgula
      highlightBars([0], '#e74c3c');
      setExplanationText(`👆 HEAD pointer ilk düğümü (${linkedList[0]}) işaret ediyor.`);
      await wait(speed);
      
      // TAIL'i vurgula
      highlightBars([linkedList.length - 1], '#2ecc71');
      setExplanationText(`👇 TAIL pointer son düğümü (${linkedList[linkedList.length - 1]}) işaret ediyor.`);
      await wait(speed);
      
      // Her ikisini birden vurgula
      highlightBars([0, linkedList.length - 1], '#9b59b6');
      setExplanationText('🔗 HEAD ve TAIL ile O(1) zamanda başa/sona erişim sağlanır!');
      await wait(speed);
    }
  };
  
  // Çift yönlü demo ekleme
  const doublyDemoInsert = async (linkedList: number[], position: 'head' | 'tail') => {
    const value = Math.floor(Math.random() * 100) + 1;
    if (position === 'head') {
      setExplanationText(`➕ Başa Ekleme: Yeni düğüm (${value}) oluşturuluyor...`);
      await wait(speed / 2);
      setExplanationText(`🔗 new.next = HEAD, HEAD.previous = new`);
      await wait(speed / 2);
      linkedList.unshift(value);
      setArray([...linkedList]);
      highlightBars([0], swappingColor);
      setExplanationText(`✅ ${value} başa eklendi! Çift yönlü bağlantılar kuruldu. Zaman: O(1)`);
    } else {
      setExplanationText(`➕ Sona Ekleme: ${value} için yeni düğüm oluşturuluyor...`);
      await wait(speed / 2);
      setExplanationText(`🔗 TAIL.next = new, new.previous = TAIL`);
      await wait(speed / 2);
      linkedList.push(value);
      setArray([...linkedList]);
      highlightBars([linkedList.length - 1], swappingColor);
      setExplanationText(`✅ ${value} sona eklendi! TAIL güncellendi. Zaman: O(1)`);
    }
    await wait(speed);
  };
  
  // Çift yönlü demo arama
  const doublyDemoSearch = async (linkedList: number[]) => {
    if (linkedList.length > 0) {
      const searchValue = linkedList[Math.floor(linkedList.length / 2)];
      setExplanationText(`🔍 Çift Yönlü Arama: ${searchValue} değeri HEAD ve TAIL\'den aranıyor...`);
      
      // Çift yönlü arama simülasyonu
      let left = 0;
      let right = linkedList.length - 1;
      let found = false;
      
      while (left <= right && !found) {
        // Sol taraftan
        if (left <= right) {
          highlightBars([left], comparingColor);
          setExplanationText(`🔍➡️ HEAD tarafından: ${linkedList[left]} === ${searchValue}?`);
          await wait(speed / 3);
          if (linkedList[left] === searchValue) {
            highlightBars([left], sortedColor);
            setExplanationText(`🎉 ${searchValue} bulundu! Çift yönlü arama avantajı: O(n/2)`);
            found = true;
            break;
          }
          left++;
        }
        
        // Sağ taraftan
        if (left <= right && !found) {
          highlightBars([right], comparingColor);
          setExplanationText(`🔍⬅️ TAIL tarafından: ${linkedList[right]} === ${searchValue}?`);
          await wait(speed / 3);
          if (linkedList[right] === searchValue) {
            highlightBars([right], sortedColor);
            setExplanationText(`🎉 ${searchValue} bulundu! Çift yönlü arama avantajı: O(n/2)`);
            found = true;
            break;
          }
          right--;
        }
      }
      await wait(speed);
    }
  };
  
  // Çift yönlü demo traverse
  const doublyDemoTraverse = async (linkedList: number[], direction: 'forward' | 'backward') => {
    if (direction === 'forward') {
      setExplanationText('🚶‍♂️➡️ İleri Dolaşma: HEAD\'den başlayarak next pointer\'ları takip ediliyor...');
      for (let i = 0; i < linkedList.length; i++) {
        highlightBars([i], '#3498db');
        setExplanationText(`➡️ ${i + 1}. düğüm: ${linkedList[i]} (next→)`);
        await wait(speed / 4);
      }
      setExplanationText('✅ İleri dolaşma tamamlandı! HEAD→TAIL yönünde.');
    } else {
      setExplanationText('🚶‍♂️⬅️ Geri Dolaşma: TAIL\'den başlayarak previous pointer\'ları takip ediliyor...');
      for (let i = linkedList.length - 1; i >= 0; i--) {
        highlightBars([i], '#e67e22');
        setExplanationText(`⬅️ ${linkedList.length - i}. adım: ${linkedList[i]} (←previous)`);
        await wait(speed / 4);
      }
      setExplanationText('✅ Geri dolaşma tamamlandı! TAIL←HEAD yönünde.');
    }
    await wait(speed / 2);
  };
  
  // Çift yönlü demo silme
  const doublyDemoDelete = async (linkedList: number[], position: 'head' | 'tail') => {
    if (linkedList.length === 0) return;
    
    if (position === 'head') {
      const value = linkedList[0];
      highlightBars([0], swappingColor);
      setExplanationText(`🗑️ Baştan Silme: HEAD düğümü (${value}) siliniyor...`);
      await wait(speed);
      setExplanationText(`🔗 HEAD = HEAD.next, new_HEAD.previous = NULL`);
      await wait(speed / 2);
      linkedList.shift();
      setArray([...linkedList]);
      setExplanationText(`✅ ${value} silindi! Çift yönlü bağlantılar güncellendi. Zaman: O(1)`);
    } else {
      const value = linkedList[linkedList.length - 1];
      highlightBars([linkedList.length - 1], swappingColor);
      setExplanationText(`🗑️ Sondan Silme: TAIL düğümü (${value}) siliniyor...`);
      await wait(speed);
      setExplanationText(`🔗 TAIL = TAIL.previous, new_TAIL.next = NULL`);
      await wait(speed / 2);
      linkedList.pop();
      setArray([...linkedList]);
      setExplanationText(`✅ ${value} silindi! TAIL pointer güncellendi. Zaman: O(1)`);
    }
    await wait(speed / 2);
  };
  
  // Çift yönlü bağlantıları göster
  const showBidirectionalLinks = async (linkedList: number[]) => {
    resetColors();
    setExplanationText('🔗↔️ Çift Yönlü Bağlantılar: Her düğüm önceki ve sonraki düğümlerle bağlıdır.');
    await wait(speed);
    
    if (linkedList.length > 1) {
      // Bağlantıları sırayla göster
      for (let i = 0; i < linkedList.length - 1; i++) {
        highlightBars([i, i + 1], '#9b59b6');
        setExplanationText(`🔗 ${linkedList[i]} ↔ ${linkedList[i + 1]} | next/previous bağlantısı`);
        await wait(speed / 2);
      }
      
      highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), sortedColor);
      setExplanationText('✅ Tüm çift yönlü bağlantılar aktif! İleri/geri hareket mümkün.');
      await wait(speed);
    }
  };
  
  // Çift yönlü bellek avantajları
  const showDoublyMemoryAdvantages = async (linkedList: number[]) => {
    resetColors();
    setExplanationText('💾 Çift Yönlü Liste Avantajları: Geri yönde hareket, O(1) tail operasyonları');
    await wait(speed);
    
    if (linkedList.length > 0) {
      highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), '#2ecc71');
      setExplanationText(`📊 Extra Maliyet: ${linkedList.length} × previous pointer | Avantaj: Çift yönlü erişim`);
      await wait(speed);
    }
  };
  
  // Çift yönlü demo tamamlandı
  const doublyDemoComplete = async (linkedList: number[]) => {
    highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), sortedColor);
    const summary = linkedList.length > 0 ? 
      `[NULL←HEAD↔${linkedList.join('↔')}↔TAIL→NULL]` : 
      '[HEAD→NULL, TAIL→NULL (Boş Liste)]';
    setExplanationText(`✅ Çift Yönlü Bağlı Liste Demo tamamlandı! ${summary} (${linkedList.length} düğüm)`);
    await wait(speed);
  };
  
  // Dairesel Bağlı Liste Görselleştirmesi
  const visualizeCircularLinkedList = async () => {
    if (sorting) return;
    
    // Operasyon tipine göre uygun fonksiyonu çağır
    switch (selectedOperation) {
      case 'demo':
        await performCircularLinkedListDemo();
        break;
      case 'prepend':
        await performCircularPrepend();
        break;
      case 'append':
        await performCircularAppend();
        break;
      case 'insert':
        await performCircularInsertAt();
        break;
      case 'search':
        await performCircularSearch();
        break;
      case 'deleteHead':
        await performCircularDeleteHead();
        break;
      case 'deleteTail':
        await performCircularDeleteTail();
        break;
      case 'deleteValue':
        await performCircularDeleteValue();
        break;
      case 'traverse':
        await performCircularTraverse();
        break;
      case 'clear':
        await performCircularClear();
        break;
      default:
        setExplanationText('Lütfen bir işlem seçin.');
    }
  };
  
  // Dairesel Bağlı Liste Demo
  const performCircularLinkedListDemo = async () => {
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(11);
    
    try {
      let linkedList = [...array];
      setExplanationText('🔗⭕ Dairesel Bağlı Liste Demo: Son düğümün ilk düğümü gösterdiği döngüsel yapıyı keşfedelim...');
      await wait(speed);
      
      // Dairesel bağlı liste spesifik demo adımları
      const circularOperations = [
        { name: 'Yapı Açıklaması', action: () => explainCircularStructure(linkedList) },
        { name: 'Döngüsel Bağlantı', action: () => showCircularConnection(linkedList) },
        { name: 'HEAD Pointer', action: () => showCircularHeadPointer(linkedList) },
        { name: 'Başa Ekleme O(1)', action: () => circularDemoInsert(linkedList, 'head') },
        { name: 'Sona Ekleme O(n)', action: () => circularDemoInsert(linkedList, 'tail') },
        { name: 'Döngüsel Arama', action: () => circularDemoSearch(linkedList) },
        { name: 'Döngüsel Dolaşma', action: () => circularDemoTraverse(linkedList) },
        { name: 'Baştan Silme O(1)', action: () => circularDemoDelete(linkedList, 'head') },
        { name: 'Sondan Silme O(n)', action: () => circularDemoDelete(linkedList, 'tail') },
        { name: 'Döngü Tespiti', action: () => showCircularLoop(linkedList) },
        { name: 'Demo Tamamlandı', action: () => circularDemoComplete(linkedList) }
      ];
      
      for (let i = 0; i < circularOperations.length; i++) {
        setCurrentStep(i + 1);
        await circularOperations[i].action();
        linkedList = [...array]; // Güncel listeyi al
      }
      
    } catch (error) {
      console.error("Dairesel Bağlı Liste Demo sırasında hata:", error);
      setExplanationText("Demo sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel başa ekleme
  const performCircularPrepend = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen eklenecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(5);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`➕ Dairesel başa ekleme: ${value} için yeni düğüm oluşturuluyor...`);
      resetColors();
      await wait(speed);
      
      setCurrentStep(2);
      setExplanationText(`🔗 Yeni düğümün next'i mevcut HEAD'i gösterecek...`);
      if (linkedList.length > 0) {
        highlightBars([0], comparingColor); // Mevcut head
      }
      await wait(speed);
      
      setCurrentStep(3);
      if (linkedList.length > 0) {
        setExplanationText(`⭕ Son düğümün next'i yeni düğümü gösterecek (dairesel bağlantı)...`);
        highlightBars([linkedList.length - 1], comparingColor); // Mevcut tail
        await wait(speed);
      }
      
      setCurrentStep(4);
      setExplanationText(`🔗 HEAD pointer yeni düğümü gösterecek...`);
      await wait(speed);
      
      setCurrentStep(5);
      linkedList.unshift(value);
      setArray([...linkedList]);
      highlightBars([0], swappingColor); // Yeni head
      
      // Dairesel bağlantıyı göster
      if (linkedList.length > 1) {
        setTimeout(() => {
          highlightBars([linkedList.length - 1, 0], '#9b59b6'); // Döngüsel bağlantı
        }, 300);
      }
      
      setExplanationText(`✅ ${value} başa eklendi! Dairesel bağlantı korundu. Zaman: O(1)`);
      setInputValue('');
      
    } catch (error) {
      console.error("Circular Prepend sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel sona ekleme
  const performCircularAppend = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen eklenecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length + 3);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`➕ Dairesel sona ekleme: ${value} için yeni düğüm oluşturuluyor...`);
      resetColors();
      await wait(speed);
      
      // Son düğümü bul (HEAD'den başlayarak döngüde)
      setCurrentStep(2);
      setExplanationText(`🔍 Son düğümü bulmak için döngüde dolaşılıyor...`);
      for (let i = 0; i < linkedList.length; i++) {
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm: Son düğümü arıyoruz...`);
        await wait(speed / 3);
        setCurrentStep(i + 3);
      }
      
      setCurrentStep(linkedList.length + 3);
      if (linkedList.length > 0) {
        highlightBars([linkedList.length - 1], swappingColor);
        setExplanationText(`⭕ Son düğüm bulundu! next'i yeni düğümü gösterecek...`);
        await wait(speed);
        
        setExplanationText(`🔗 Yeni düğümün next'i HEAD'i gösterecek (dairesel bağlantı)...`);
        await wait(speed);
      }
      
      linkedList.push(value);
      setArray([...linkedList]);
      highlightBars([linkedList.length - 1], swappingColor); // Yeni tail
      
      // Dairesel bağlantıyı göster
      setTimeout(() => {
        highlightBars([linkedList.length - 1, 0], '#9b59b6'); // Döngüsel bağlantı
      }, 300);
      
      setExplanationText(`✅ ${value} sona eklendi! Dairesel bağlantı korundu. Zaman: O(n)`);
      setInputValue('');
      
    } catch (error) {
      console.error("Circular Append sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel pozisyona ekleme
  const performCircularInsertAt = async () => {
    if (!inputValue.trim() || !insertPosition.trim()) {
      setExplanationText('⚠️ Lütfen değer ve pozisyon girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    const position = parseInt(insertPosition);
    
    if (isNaN(value) || isNaN(position)) {
      setExplanationText('⚠️ Lütfen geçerli sayılar girin!');
      return;
    }
    
    if (position < 0 || position > array.length) {
      setExplanationText(`⚠️ Pozisyon 0-${array.length} arasında olmalı!`);
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(position + 4);
    
    try {
      let linkedList = [...array];
      
      setCurrentStep(1);
      setExplanationText(`🎯 Dairesel pozisyona ekleme: ${position + 1}. pozisyona ${value} ekleniyor...`);
      resetColors();
      await wait(speed);
      
      // Pozisyona kadar git (döngüsel olarak)
      setCurrentStep(2);
      setExplanationText(`🔍 Dairesel listede ${position + 1}. pozisyona dolaşılıyor...`);
      for (let i = 0; i < position; i++) {
        const currentIndex = i % linkedList.length;
        highlightBars([currentIndex], comparingColor);
        setExplanationText(`🔍 ${i + 1}. adım: ${position + 1}. pozisyona gidiyoruz...`);
        await wait(speed / 2);
        setCurrentStep(i + 3);
      }
      
      setCurrentStep(position + 3);
      if (position < linkedList.length) {
        highlightBars([position], comparingColor);
        setExplanationText(`⭕ Pozisyon bulundu! Dairesel bağlantılar güncelleniyor...`);
        await wait(speed);
      }
      
      setCurrentStep(position + 4);
      linkedList.splice(position, 0, value);
      setArray([...linkedList]);
      highlightBars([position], swappingColor);
      
      // Dairesel bağlantıyı göster
      setTimeout(() => {
        highlightBars([linkedList.length - 1, 0], '#9b59b6'); // Döngüsel bağlantı
      }, 500);
      
      setExplanationText(`✅ ${value} değeri ${position + 1}. pozisyona eklendi! Dairesel yapı korundu. Zaman: O(n)`);
      setInputValue('');
      setInsertPosition('');
      
    } catch (error) {
      console.error("Circular Insert sırasında hata:", error);
      setExplanationText("İşlem sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel arama
  const performCircularSearch = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen aranacak değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      let found = false;
      let foundIndex = -1;
      let visitedCount = 0;
      
      setExplanationText(`🔍 Dairesel arama: ${value} değeri döngüsel olarak aranıyor...`);
      resetColors();
      await wait(speed);
      
      // Dairesel arama - HEAD'den başla ve en fazla n eleman kontrol et
      for (let i = 0; i < array.length; i++) {
        visitedCount++;
        setCurrentStep(i + 1);
        
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm kontrol ediliyor: ${array[i]} === ${value}? (Döngü: ${visitedCount})`);
        await wait(speed);
        
        if (array[i] === value) {
          highlightBars([i], sortedColor);
          setExplanationText(`🎉 ${value} değeri ${i + 1}. pozisyonda bulundu! (${visitedCount} adımda)`);
          found = true;
          foundIndex = i;
          
          // Dairesel bağlantıyı göster
          setTimeout(() => {
            highlightBars([array.length - 1, 0], '#9b59b6');
          }, 500);
          break;
        } else {
          // Kontrol edilen elemanı gri yap
          highlightBars([i], '#95a5a6');
          await wait(speed / 2);
        }
      }
      
      if (!found) {
        setExplanationText(`❌ ${value} değeri dairesel listede bulunamadı! Tam döngü tamamlandı (${visitedCount} eleman).`);
        
        // Tüm döngüyü göster
        highlightBars([array.length - 1, 0], '#e74c3c'); // Döngüsel bağlantı kırmızı
      }
      
      setInputValue('');
      
    } catch (error) {
      console.error("Circular Search sırasında hata:", error);
      setExplanationText("Arama sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel baştan silme
  const performCircularDeleteHead = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Silinecek eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(4);
    
    try {
      let linkedList = [...array];
      const deletedValue = linkedList[0];
      
      setCurrentStep(1);
      highlightBars([0], swappingColor);
      setExplanationText(`🗑️ Dairesel baştan silme: HEAD düğümü (${deletedValue}) siliniyor...`);
      await wait(speed);
      
      setCurrentStep(2);
      if (linkedList.length > 1) {
        setExplanationText(`🔗 HEAD pointer ikinci düğümü gösterecek...`);
        highlightBars([1], comparingColor);
        await wait(speed);
        
        setCurrentStep(3);
        setExplanationText(`⭕ Son düğümün next'i yeni HEAD'i gösterecek (dairesel bağlantı)...`);
        highlightBars([linkedList.length - 1], comparingColor);
        await wait(speed);
      }
      
      setCurrentStep(4);
      linkedList.shift();
      setArray([...linkedList]);
      
      if (linkedList.length > 0) {
        // Dairesel bağlantıyı göster
        setTimeout(() => {
          highlightBars([linkedList.length - 1, 0], '#9b59b6');
        }, 300);
      }
      
      resetColors();
      setExplanationText(`✅ ${deletedValue} silindi! HEAD güncellendi, dairesel bağlantı korundu. Zaman: O(1)`);
      
    } catch (error) {
      console.error("Circular Delete head sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel sondan silme
  const performCircularDeleteTail = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Silinecek eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length + 2);
    
    try {
      let linkedList = [...array];
      const deletedValue = linkedList[linkedList.length - 1];
      
      setCurrentStep(1);
      setExplanationText(`🗑️ Dairesel sondan silme: Son düğüm (${deletedValue}) siliniyor...`);
      resetColors();
      await wait(speed);
      
      // Son elemandan önceki elemana git
      for (let i = 0; i < linkedList.length - 1; i++) {
        setCurrentStep(i + 2);
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm: Son elemandan önceki düğümü arıyoruz...`);
        await wait(speed / 2);
      }
      
      setCurrentStep(linkedList.length + 1);
      if (linkedList.length > 1) {
        highlightBars([linkedList.length - 2], comparingColor);
        setExplanationText(`⭕ Son elemandan önceki düğüm bulundu! next'i HEAD'i gösterecek...`);
        await wait(speed);
      }
      
      setCurrentStep(linkedList.length + 2);
      highlightBars([linkedList.length - 1], swappingColor);
      setExplanationText(`🔗 Son düğümün bağlantısı koparılıyor...`);
      await wait(speed);
      
      linkedList.pop();
      setArray([...linkedList]);
      
      if (linkedList.length > 0) {
        // Dairesel bağlantıyı göster
        setTimeout(() => {
          highlightBars([linkedList.length - 1, 0], '#9b59b6');
        }, 300);
      }
      
      resetColors();
      setExplanationText(`✅ ${deletedValue} silindi! Dairesel bağlantı korundu. Zaman: O(n)`);
      
    } catch (error) {
      console.error("Circular Delete tail sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel değer silme
  const performCircularDeleteValue = async () => {
    if (!inputValue.trim()) {
      setExplanationText('⚠️ Lütfen silinecek değeri girin!');
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setExplanationText('⚠️ Lütfen geçerli bir sayı girin!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length);
    
    try {
      let linkedList = [...array];
      let found = false;
      
      setExplanationText(`🗑️ Dairesel değer silme: ${value} değeri aranıp siliniyor...`);
      resetColors();
      await wait(speed);
      
      // Değeri ara ve sil
      for (let i = 0; i < linkedList.length; i++) {
        setCurrentStep(i + 1);
        highlightBars([i], comparingColor);
        setExplanationText(`🔍 ${i + 1}. düğüm kontrol ediliyor: ${linkedList[i]} === ${value}?`);
        await wait(speed);
        
        if (linkedList[i] === value) {
          highlightBars([i], swappingColor);
          setExplanationText(`⭕ ${value} bulundu! Dairesel bağlantılar güncelleniyor...`);
          await wait(speed);
          
          if (i === 0) {
            setExplanationText(`🔗 HEAD düğümü siliniyor, son düğümün next'i yeni HEAD'i gösterecek...`);
          } else {
            setExplanationText(`🔗 Önceki düğümün next'i sonraki düğümü gösterecek...`);
          }
          await wait(speed);
          
          linkedList.splice(i, 1);
          setArray([...linkedList]);
          
          if (linkedList.length > 0) {
            // Dairesel bağlantıyı göster
            setTimeout(() => {
              highlightBars([linkedList.length - 1, 0], '#9b59b6');
            }, 300);
          }
          
          setExplanationText(`✅ ${value} silindi! Dairesel yapı korundu. Zaman: O(n)`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        setExplanationText(`❌ ${value} değeri dairesel listede bulunamadı!`);
      }
      
      setInputValue('');
      
    } catch (error) {
      console.error("Circular Delete value sırasında hata:", error);
      setExplanationText("Silme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel traverse
  const performCircularTraverse = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste boş! Dolaşılacak eleman yok.');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(array.length * 2); // İki tam döngü gösterelim
    
    try {
      setExplanationText('🚶‍♂️⭕ Dairesel Dolaşma: İki tam döngü gösterilerek dairesel yapı kanıtlanacak...');
      resetColors();
      await wait(speed);
      
      // İki tam döngü yap
      for (let cycle = 0; cycle < 2; cycle++) {
        setExplanationText(`🔄 ${cycle + 1}. Döngü başlıyor...`);
        await wait(speed / 2);
        
        for (let i = 0; i < array.length; i++) {
          setCurrentStep(cycle * array.length + i + 1);
          highlightBars([i], '#3498db');
          setExplanationText(`🚶‍♂️ ${cycle + 1}. döngü, ${i + 1}. düğüm: ${array[i]} ziyaret edildi`);
          await wait(speed);
          
          // Son elemanda döngüsel bağlantıyı göster
          if (i === array.length - 1) {
            setTimeout(() => {
              highlightBars([i, 0], '#9b59b6');
              setExplanationText(`⭕ Son düğümden HEAD'e döngüsel bağlantı! Döngü devam ediyor...`);
            }, speed / 2);
            await wait(speed);
          }
        }
      }
      
      highlightBars(Array.from({ length: array.length }, (_, i) => i), sortedColor);
      
      // Döngüsel bağlantıyı final olarak göster
      setTimeout(() => {
        highlightBars([array.length - 1, 0], '#e74c3c');
      }, 500);
      
      setExplanationText(`✅ Dairesel dolaşma tamamlandı! İki tam döngü gösterildi. Sonsuz döngü riski var! ⚠️`);
      
    } catch (error) {
      console.error("Circular Traverse sırasında hata:", error);
      setExplanationText("Dolaşma sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel listeyi temizle
  const performCircularClear = async () => {
    if (array.length === 0) {
      setExplanationText('⚠️ Liste zaten boş!');
      return;
    }
    
    setSorting(true);
    setCurrentStep(0);
    setTotalSteps(1);
    
    try {
      setCurrentStep(1);
      setExplanationText('🗑️ Dairesel liste tamamen temizleniyor...');
      
      // Döngüsel bağlantıyı göster
      highlightBars([array.length - 1, 0], '#e74c3c');
      await wait(speed);
      
      setExplanationText('⭕ Döngüsel bağlantı koparılıyor...');
      await wait(speed);
      
      highlightBars(Array.from({ length: array.length }, (_, i) => i), swappingColor);
      await wait(speed);
      
      setArray([]);
      resetColors();
      setExplanationText('✅ Dairesel liste tamamen temizlendi! HEAD pointer NULL olarak ayarlandı.');
      
    } catch (error) {
      console.error("Circular Clear sırasında hata:", error);
      setExplanationText("Temizleme sırasında bir hata oluştu.");
    } finally {
      setSorting(false);
    }
  };
  
  // Dairesel Bağlı Liste Demo Yardımcı Fonksiyonları
  
  // Dairesel yapı açıklaması
  const explainCircularStructure = async (linkedList: number[]) => {
    resetColors();
    setExplanationText('🔗⭕ Dairesel Bağlı Liste: Son düğümün next pointer\'ı NULL yerine ilk düğümü gösterir!');
    await wait(speed);
    
    if (linkedList.length > 0) {
      highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), '#3498db');
      setExplanationText(`🔄 Döngüsel yapı: [${linkedList.join('→')}→${linkedList[0]}] - Sonsuz döngü!`);
      await wait(speed);
    }
  };
  
  // Dairesel bağlantıyı göster
  const showCircularConnection = async (linkedList: number[]) => {
    resetColors();
    if (linkedList.length > 1) {
      setExplanationText('⭕ Döngüsel Bağlantı: Son düğümün next\'i ilk düğümü gösterir...');
      
      // Son ve ilk elemanı vurgula
      highlightBars([linkedList.length - 1, 0], '#9b59b6');
      await wait(speed);
      
      setExplanationText(`🔄 [TAIL: ${linkedList[linkedList.length - 1]}] → [HEAD: ${linkedList[0]}] döngüsel bağlantı!`);
      await wait(speed);
    }
  };
  
  // Dairesel HEAD pointer göster
  const showCircularHeadPointer = async (linkedList: number[]) => {
    resetColors();
    if (linkedList.length > 0) {
      setExplanationText('👉 HEAD Pointer: Dairesel listede sadece HEAD pointer var (TAIL yok)');
      highlightBars([0], '#e67e22');
      setExplanationText(`🎯 HEAD → ${linkedList[0]} (Listeye giriş noktası)`);
      await wait(speed);
    }
  };
  
  // Dairesel demo ekleme
  const circularDemoInsert = async (linkedList: number[], position: 'head' | 'tail') => {
    const value = Math.floor(Math.random() * 90) + 10;
    resetColors();
    
    if (position === 'head') {
      setExplanationText(`➕ Başa Ekleme Demo: ${value} ekleniyor (O(1))...`);
      
      if (linkedList.length > 0) {
        highlightBars([0], comparingColor); // Mevcut head
        await wait(speed / 2);
        
        // Son düğümün güncellenmesi
        highlightBars([linkedList.length - 1], '#9b59b6');
        setExplanationText(`⭕ Son düğümün next'i yeni düğümü gösterecek...`);
        await wait(speed);
      }
      
      linkedList.unshift(value);
      setArray([...linkedList]);
      highlightBars([0], swappingColor);
      
      // Döngüsel bağlantıyı göster
      setTimeout(() => {
        highlightBars([linkedList.length - 1, 0], '#9b59b6');
      }, 300);
      
      setExplanationText(`✅ ${value} başa eklendi! Zaman: O(1), dairesel bağlantı korundu.`);
    } else {
      setExplanationText(`➕ Sona Ekleme Demo: ${value} ekleniyor (O(n))...`);
      
      // Son düğümü bulmak için dolaşma
      for (let i = 0; i < linkedList.length; i++) {
        highlightBars([i], comparingColor);
        await wait(speed / 3);
      }
      
      linkedList.push(value);
      setArray([...linkedList]);
      highlightBars([linkedList.length - 1], swappingColor);
      
      // Döngüsel bağlantıyı göster
      setTimeout(() => {
        highlightBars([linkedList.length - 1, 0], '#9b59b6');
      }, 300);
      
      setExplanationText(`✅ ${value} sona eklendi! Zaman: O(n), dairesel bağlantı korundu.`);
    }
    await wait(speed / 2);
  };
  
  // Dairesel demo arama
  const circularDemoSearch = async (linkedList: number[]) => {
    if (linkedList.length === 0) return;
    
    const searchValue = linkedList[Math.floor(Math.random() * linkedList.length)];
    resetColors();
    setExplanationText(`🔍 Dairesel Arama Demo: ${searchValue} aranıyor...`);
    await wait(speed / 2);
    
    for (let i = 0; i < linkedList.length; i++) {
      highlightBars([i], comparingColor);
      setExplanationText(`🔍 ${i + 1}. düğüm: ${linkedList[i]} === ${searchValue}?`);
      await wait(speed / 2);
      
      if (linkedList[i] === searchValue) {
        highlightBars([i], sortedColor);
        setExplanationText(`🎉 ${searchValue} bulundu! Pozisyon: ${i + 1}, Döngü tespiti önemli!`);
        
        // Döngüsel bağlantıyı göster
        setTimeout(() => {
          highlightBars([linkedList.length - 1, 0], '#9b59b6');
        }, 500);
        break;
      }
    }
    await wait(speed / 2);
  };
  
  // Dairesel demo dolaşma
  const circularDemoTraverse = async (linkedList: number[]) => {
    resetColors();
    setExplanationText('🚶‍♂️⭕ Dairesel Dolaşma Demo: Döngü tespiti ile güvenli dolaşma...');
    await wait(speed / 2);
    
    let visited = 0;
    const maxVisits = linkedList.length + 2; // Döngü tespiti için limit
    
    for (let i = 0; i < maxVisits && visited < linkedList.length; i++) {
      const index = i % linkedList.length;
      highlightBars([index], '#3498db');
      
      if (i < linkedList.length) {
        setExplanationText(`🚶‍♂️ ${i + 1}. düğüm: ${linkedList[index]} ziyaret edildi`);
        visited++;
      } else {
        setExplanationText(`⚠️ Döngü tespit edildi! Güvenli çıkış yapılıyor...`);
        
        // Döngüsel bağlantıyı göster
        highlightBars([linkedList.length - 1, 0], '#e74c3c');
        break;
      }
      await wait(speed / 3);
    }
    await wait(speed / 2);
  };
  
  // Dairesel demo silme
  const circularDemoDelete = async (linkedList: number[], position: 'head' | 'tail') => {
    if (linkedList.length === 0) return;
    
    resetColors();
    
    if (position === 'head') {
      const deletedValue = linkedList[0];
      setExplanationText(`🗑️ Baştan Silme Demo: HEAD (${deletedValue}) siliniyor (O(1))...`);
      
      highlightBars([0], swappingColor);
      await wait(speed / 2);
      
      if (linkedList.length > 1) {
        setExplanationText(`⭕ Son düğümün next'i yeni HEAD'i gösterecek...`);
        highlightBars([linkedList.length - 1, 1], '#9b59b6');
        await wait(speed);
      }
      
      linkedList.shift();
      setArray([...linkedList]);
      setExplanationText(`✅ ${deletedValue} silindi! Zaman: O(1), dairesel yapı korundu.`);
    } else {
      const deletedValue = linkedList[linkedList.length - 1];
      setExplanationText(`🗑️ Sondan Silme Demo: TAIL (${deletedValue}) siliniyor (O(n))...`);
      
      // Son elemandan önceki elemanı bul
      for (let i = 0; i < linkedList.length - 1; i++) {
        highlightBars([i], comparingColor);
        await wait(speed / 4);
      }
      
      highlightBars([linkedList.length - 2], swappingColor);
      setExplanationText(`⭕ Son elemandan önceki düğümün next'i HEAD'i gösterecek...`);
      await wait(speed);
      
      linkedList.pop();
      setArray([...linkedList]);
      setExplanationText(`✅ ${deletedValue} silindi! Zaman: O(n), dairesel yapı korundu.`);
    }
    
    // Döngüsel bağlantıyı göster
    if (linkedList.length > 0) {
      setTimeout(() => {
        highlightBars([linkedList.length - 1, 0], '#9b59b6');
      }, 300);
    }
    await wait(speed / 2);
  };
  
  // Döngü tespiti gösterimi
  const showCircularLoop = async (linkedList: number[]) => {
    resetColors();
    setExplanationText('🔍 Döngü Tespiti: Floyd\'s Tortoise and Hare algoritması simülasyonu...');
    await wait(speed);
    
    if (linkedList.length < 2) {
      setExplanationText('⚠️ Döngü tespiti için en az 2 eleman gerekli.');
      return;
    }
    
    let slow = 0; // Yavaş pointer (kaplumbağa)
    let fast = 0; // Hızlı pointer (tavşan)
    
    for (let step = 0; step < linkedList.length; step++) {
      // Yavaş pointer 1 adım
      slow = (slow + 1) % linkedList.length;
      
      // Hızlı pointer 2 adım
      fast = (fast + 2) % linkedList.length;
      
      // İki pointer'ı farklı renklerle göster
      highlightBars([slow], '#3498db'); // Mavi - yavaş
      highlightBars([fast], '#e74c3c'); // Kırmızı - hızlı
      
      setExplanationText(`🐢 Yavaş: ${linkedList[slow]} (pos: ${slow + 1}), 🐰 Hızlı: ${linkedList[fast]} (pos: ${fast + 1})`);
      await wait(speed);
      
      // Eğer buluştularsa döngü var
      if (slow === fast) {
        highlightBars([slow], '#f39c12');
        setExplanationText(`🎯 Döngü tespit edildi! Buluşma noktası: ${linkedList[slow]} (${step + 1} adımda)`);
        
        // Döngüsel bağlantıyı göster
        setTimeout(() => {
          highlightBars([linkedList.length - 1, 0], '#9b59b6');
        }, 500);
        break;
      }
    }
    await wait(speed);
  };
  
  // Dairesel demo tamamlama
  const circularDemoComplete = async (linkedList: number[]) => {
    highlightBars(Array.from({ length: linkedList.length }, (_, i) => i), sortedColor);
    
    const summary = linkedList.length > 0 ? 
      `[HEAD→${linkedList.join('→')}→${linkedList[0]}] (Döngüsel)` : 
      '[HEAD→NULL (Boş Liste)]';
    
    setExplanationText(`✅ Dairesel Bağlı Liste Demo tamamlandı! Final: ${summary} (${linkedList.length} düğüm)`);
    
    // Final döngüsel bağlantı gösterimi
    if (linkedList.length > 0) {
      setTimeout(() => {
        highlightBars([linkedList.length - 1, 0], '#9b59b6');
      }, 500);
    }
    
    await wait(speed);
  };
  
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
        
        {(algorithmType.toLowerCase() === 'binary search' || algorithmType.toLowerCase() === 'linear search') && (
          <div className="target-input-control">
            <label htmlFor="targetValue">Aranacak Değer:</label>
            <input 
              id="targetValue"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="Örn: 45"
              disabled={sorting}
              style={{
                width: '80px',
                padding: '5px',
                marginLeft: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        )}
        
        {algorithmType.toLowerCase().includes('singly') && (
          <div className="linked-list-controls">
            <div className="operation-selector">
              <label htmlFor="operation">İşlem:</label>
              <select 
                id="operation"
                value={selectedOperation}
                onChange={(e) => setSelectedOperation(e.target.value)}
                disabled={sorting}
                style={{
                  padding: '5px',
                  marginLeft: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="demo">🎬 Bağlı Liste Demo</option>
                <option value="prepend">➕ Başa Ekleme (O(1))</option>
                <option value="append">➕ Sona Ekleme (O(n))</option>
                <option value="insert">🎯 Pozisyona Ekleme (O(n))</option>
                <option value="search">🔍 Değer Arama (O(n))</option>
                <option value="deleteHead">🗑️ Baştan Silme (O(1))</option>
                <option value="deleteTail">🗑️ Sondan Silme (O(n))</option>
                <option value="deleteValue">🗑️ Değer Silme (O(n))</option>
                <option value="traverse">🚶‍♂️ Liste Dolaşma (O(n))</option>
                <option value="clear">🧹 Listeyi Temizle (O(1))</option>
              </select>
            </div>
            
            {(selectedOperation === 'prepend' || selectedOperation === 'append' || 
              selectedOperation === 'search' || selectedOperation === 'deleteValue') && (
              <div className="value-input-control">
                <label htmlFor="inputValue">Değer:</label>
                <input 
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Sayı girin"
                  disabled={sorting}
                  style={{
                    width: '80px',
                    padding: '5px',
                    marginLeft: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}
            
            {selectedOperation === 'insert' && (
              <>
                <div className="value-input-control">
                  <label htmlFor="insertValue">Değer:</label>
                  <input 
                    id="insertValue"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Sayı"
                    disabled={sorting}
                    style={{
                      width: '60px',
                      padding: '5px',
                      marginLeft: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div className="position-input-control">
                  <label htmlFor="insertPosition">Pozisyon:</label>
                  <input 
                    id="insertPosition"
                    type="number"
                    value={insertPosition}
                    onChange={(e) => setInsertPosition(e.target.value)}
                    placeholder="0-N"
                    min="0"
                    max={array.length}
                    disabled={sorting}
                    style={{
                      width: '60px',
                      padding: '5px',
                      marginLeft: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
        
        {algorithmType.toLowerCase().includes('doubly') && (
          <div className="linked-list-controls">
            <div className="operation-selector">
              <label htmlFor="operation">İşlem:</label>
              <select 
                id="operation"
                value={selectedOperation}
                onChange={(e) => setSelectedOperation(e.target.value)}
                disabled={sorting}
                style={{
                  padding: '5px',
                  marginLeft: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="demo">🎬↔️ Çift Yönlü Liste Demo</option>
                <option value="prepend">➕ Başa Ekleme (O(1))</option>
                <option value="append">➕ Sona Ekleme (O(1))</option>
                <option value="insert">🎯 Pozisyona Ekleme (O(n/2))</option>
                <option value="search">🔍 Çift Yönlü Arama (O(n/2))</option>
                <option value="deleteHead">🗑️ Baştan Silme (O(1))</option>
                <option value="deleteTail">🗑️ Sondan Silme (O(1))</option>
                <option value="deleteValue">🗑️ Değer Silme (O(n))</option>
                <option value="traverse">🚶‍♂️➡️ İleri Dolaşma (O(n))</option>
                <option value="traverseBackward">🚶‍♂️⬅️ Geri Dolaşma (O(n))</option>
                <option value="clear">🧹 Listeyi Temizle (O(1))</option>
              </select>
            </div>
            
            {(selectedOperation === 'prepend' || selectedOperation === 'append' || 
              selectedOperation === 'search' || selectedOperation === 'deleteValue') && (
              <div className="value-input-control">
                <label htmlFor="inputValue">Değer:</label>
                <input 
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Sayı girin"
                  disabled={sorting}
                  style={{
                    width: '80px',
                    padding: '5px',
                    marginLeft: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}
            
            {selectedOperation === 'insert' && (
              <>
                <div className="value-input-control">
                  <label htmlFor="insertValue">Değer:</label>
                  <input 
                    id="insertValue"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Sayı"
                    disabled={sorting}
                    style={{
                      width: '60px',
                      padding: '5px',
                      marginLeft: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div className="position-input-control">
                  <label htmlFor="insertPosition">Pozisyon:</label>
                  <input 
                    id="insertPosition"
                    type="number"
                    value={insertPosition}
                    onChange={(e) => setInsertPosition(e.target.value)}
                    placeholder="0-N"
                    min="0"
                    max={array.length}
                    disabled={sorting}
                    style={{
                      width: '60px',
                      padding: '5px',
                      marginLeft: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
        
        {algorithmType.toLowerCase().includes('circular') && (
          <div className="linked-list-controls">
            <div className="operation-selector">
              <label htmlFor="operation">İşlem:</label>
              <select 
                id="operation"
                value={selectedOperation}
                onChange={(e) => setSelectedOperation(e.target.value)}
                disabled={sorting}
                style={{
                  padding: '5px',
                  marginLeft: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="demo">🎬⭕ Dairesel Liste Demo</option>
                <option value="prepend">➕ Başa Ekleme (O(1))</option>
                <option value="append">➕ Sona Ekleme (O(n))</option>
                <option value="insert">🎯 Pozisyona Ekleme (O(n))</option>
                <option value="search">🔍 Döngüsel Arama (O(n))</option>
                <option value="deleteHead">🗑️ Baştan Silme (O(1))</option>
                <option value="deleteTail">🗑️ Sondan Silme (O(n))</option>
                <option value="deleteValue">🗑️ Değer Silme (O(n))</option>
                <option value="traverse">🚶‍♂️⭕ Döngüsel Dolaşma (O(∞))</option>
                <option value="clear">🧹 Listeyi Temizle (O(1))</option>
              </select>
            </div>
            
            {(selectedOperation === 'prepend' || selectedOperation === 'append' || 
              selectedOperation === 'search' || selectedOperation === 'deleteValue') && (
              <div className="value-input-control">
                <label htmlFor="inputValue">Değer:</label>
                <input 
                  id="inputValue"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Sayı girin"
                  disabled={sorting}
                  style={{
                    width: '80px',
                    padding: '5px',
                    marginLeft: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}
            
            {selectedOperation === 'insert' && (
              <>
                <div className="value-input-control">
                  <label htmlFor="insertValue">Değer:</label>
                  <input 
                    id="insertValue"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Sayı"
                    disabled={sorting}
                    style={{
                      width: '60px',
                      padding: '5px',
                      marginLeft: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div className="position-input-control">
                  <label htmlFor="insertPosition">Pozisyon:</label>
                  <input 
                    id="insertPosition"
                    type="number"
                    value={insertPosition}
                    onChange={(e) => setInsertPosition(e.target.value)}
                    placeholder="0-N"
                    min="0"
                    max={array.length}
                    disabled={sorting}
                    style={{
                      width: '60px',
                      padding: '5px',
                      marginLeft: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}
        
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