import React, { useState, useEffect, useRef } from 'react';
import { AlgorithmInfoCard } from './VisualizationHelpers';
import '../styles/TreeVisualization.css';

// Ağaç görselleştirmesi için veri tipleri
interface TreeNode {
  id: number;
  value: number;
  color: 'red' | 'black';
  left: number | null;
  right: number | null;
  parent: number | null;
  x?: number;
  y?: number;
  highlighted?: boolean;
}

interface RedBlackTree {
  nodes: TreeNode[];
  root: number | null;
}

interface TreeVisualizationProps {
  algorithmType: string;
  title: string;
  customTree?: RedBlackTree;
  animationSpeed?: number;
}

// Varsayılan animasyon hızı ve renk sabitleri
const DEFAULT_ANIMATION_SPEED = 500;
const NODE_RADIUS = 22;
const LEVEL_HEIGHT = 80;
const RED_COLOR = '#e74c3c';
const BLACK_COLOR = '#2c3e50';
const HIGHLIGHT_COLOR = '#f39c12';

// Örnek kırmızı-siyah ağaç
const createSampleRedBlackTree = (): RedBlackTree => {
  // Rastgele sayıda düğüm oluştur (5-15 arası)
  const nodeCount = Math.floor(Math.random() * 11) + 5;
  
  // Kullanılacak değerler kümesi (1-99 arası)
  const availableValues = Array.from({ length: 99 }, (_, i) => i + 1);
  
  // Rastgele değerler seç
  const selectedValues: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableValues.length);
    selectedValues.push(availableValues[randomIndex]);
    availableValues.splice(randomIndex, 1);
  }
  
  // Değerleri sırala
  selectedValues.sort((a, b) => a - b);
  
  // Ağaç düğümlerini oluşturmaya başla
  const nodes: TreeNode[] = [];
  
  // Kök düğümü oluştur (her zaman siyah)
  const rootValue = selectedValues[Math.floor(selectedValues.length / 2)];
  nodes.push({
    id: 0,
    value: rootValue,
    color: 'black',
    left: null,
    right: null,
    parent: null
  });
  
  // İkili arama ağacı oluştur
  for (let i = 0; i < selectedValues.length; i++) {
    const value = selectedValues[i];
    
    // Kök değerini atla, zaten ekledik
    if (value === rootValue) continue;
    
    // Yeni düğüm
    const newNodeId = nodes.length;
    
    // Düğümü ekleyecek yeri bul
    let currentNodeId = 0; // Kökten başla
    let parentNodeId: number | null = null;
    let isLeftChild = false;
    
    while (currentNodeId !== null) {
      const currentNode = nodes[currentNodeId];
      parentNodeId = currentNodeId;
      
      if (value < currentNode.value) {
        currentNodeId = currentNode.left;
        isLeftChild = true;
      } else {
        currentNodeId = currentNode.right;
        isLeftChild = false;
      }
    }
    
    // Yeni düğümü oluştur (Başlangıçta kırmızı)
    const newNode: TreeNode = {
      id: newNodeId,
      value: value,
      color: 'red', // Başlangıçta kırmızı
      left: null,
      right: null,
      parent: parentNodeId
    };
    
    // Ebeveyn bağlantısını güncelle
    if (parentNodeId !== null) {
      const parentNode = nodes[parentNodeId];
      if (isLeftChild) {
        parentNode.left = newNodeId;
      } else {
        parentNode.right = newNodeId;
      }
    }
    
    // Düğümü ekle
    nodes.push(newNode);
  }
  
  // Kırmızı-Siyah ağaç kurallarını uygula
  ensureRedBlackRules(nodes);
  
  return {
    root: 0,
    nodes: nodes
  };
};

// Kırmızı-Siyah Ağaç kurallarını uygulama
const ensureRedBlackRules = (nodes: TreeNode[]): void => {
  // Kural 2: Kök düğüm her zaman siyahtır
  if (nodes.length > 0) {
    nodes[0].color = 'black';
  }
  
  // Kural 4: Kırmızı düğümlerin tüm çocukları siyahtır
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.color === 'red') {
      const parentId = node.parent;
      if (parentId !== null && nodes[parentId].color === 'red') {
        // Ebeveyn kırmızıysa, bu düğümü siyah yap
        node.color = 'black';
      }
    }
  }
  
  // Kural 3: Tüm yaprak düğümler siyahtır
  // Not: Bu kural teoride NULL (nil) düğümler içindir, uygulamada gerçek düğümlerle ilgilenmiyoruz
  // Ama yaprak düğümleri (çocuğu olmayan düğüm) siyah yapalım
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.left === null && node.right === null) {
      node.color = 'black';
    }
  }
  
  // Kural 5: Her yolda eşit sayıda siyah düğüm olmalı
  balanceBlackNodes(nodes, 0);
};

// Her yolu dengelemek için yardımcı fonksiyon
const balanceBlackNodes = (nodes: TreeNode[], rootId: number): number => {
  if (rootId === null) return 1; // NULL düğümler siyah sayılır
  
  const node = nodes[rootId];
  
  // Yaprak düğümse, siyah sayısını döndür
  if (node.left === null && node.right === null) {
    return node.color === 'black' ? 1 : 0;
  }
  
  // Sol ve sağ alt ağaçların siyah yüksekliklerini hesapla
  const leftBlackHeight = node.left !== null ? balanceBlackNodes(nodes, node.left) : 1;
  const rightBlackHeight = node.right !== null ? balanceBlackNodes(nodes, node.right) : 1;
  
  // Eğer dengeli değilse, düğümü siyah yaparak dengeyi sağla
  if (leftBlackHeight !== rightBlackHeight) {
    node.color = 'black';
  }
  
  // Bu düğümün siyah yüksekliğini döndür
  return node.color === 'black' ? Math.max(leftBlackHeight, rightBlackHeight) + 1 : Math.max(leftBlackHeight, rightBlackHeight);
};

const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  algorithmType,
  title,
  customTree,
  animationSpeed = DEFAULT_ANIMATION_SPEED
}) => {
  // Durumlar
  const [tree, setTree] = useState<RedBlackTree>(customTree || createSampleRedBlackTree());
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(animationSpeed);
  const [explanationText, setExplanationText] = useState<string>('Kırmızı-Siyah Ağaç görselleştirmesi. Başlatmak için "Yapı Göster" düğmesine tıklayın.');
  const [operationValue, setOperationValue] = useState<string>('');
  const svgRef = useRef<SVGSVGElement>(null);

  // Bekleme yardımcı fonksiyonu
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Ağaç yapısını sıfırla ve yeni bir ağaç oluştur
  const resetTree = () => {
    if (processing) return;
    const newTree = createSampleRedBlackTree();
    setTree(newTree);
    setCurrentStep(0);
    setTotalSteps(0);
    setExplanationText('Kırmızı-Siyah Ağaç görselleştirmesi. Başlatmak için "Yapı Göster" düğmesine tıklayın.');
    calculateNodePositions(newTree);
  };

  // İkili arama ağacı yaratma ve düğüm ekleme
  const insertNode = async () => {
    if (processing || !operationValue) return;
    setProcessing(true);
    
    const value = parseInt(operationValue);
    if (isNaN(value)) {
      setExplanationText('Lütfen geçerli bir sayı girin.');
      setProcessing(false);
      return;
    }
    
    setExplanationText(`${value} değeri ağaca ekleniyor...`);
    
    // Yeni ağaç durumunu oluştur
    const newTree = JSON.parse(JSON.stringify(tree)) as RedBlackTree;
    
    // Yeni düğüm oluştur
    const newNodeId = newTree.nodes.length;
    const newNode: TreeNode = {
      id: newNodeId,
      value: value,
      color: 'red', // Yeni düğümler kırmızı başlar
      left: null,
      right: null,
      parent: null
    };
    
    // Ağaca ekle
    let insertPosition: number | null = null;
    let isLeftChild = false;
    
    if (newTree.root === null) {
      // Ağaç boşsa, kök olarak ekle
      newTree.root = newNodeId;
      newNode.color = 'black'; // Kök düğüm siyah olur
    } else {
      // Standart BST eklemesi
      let currentId: number | null = newTree.root;
      let parentId: number | null = null;
      
      while (currentId !== null) {
        parentId = currentId;
        const current = newTree.nodes[currentId];
        
        if (value < current.value) {
          currentId = current.left;
          isLeftChild = true;
        } else if (value > current.value) {
          currentId = current.right;
          isLeftChild = false;
        } else {
          // Değer zaten ağaçta var
          setExplanationText(`${value} değeri zaten ağaçta bulunuyor.`);
          setProcessing(false);
          return;
        }
      }
      
      // Ebeveyn düğüme bağla
      if (parentId !== null) {
        newNode.parent = parentId;
        
        if (isLeftChild) {
          newTree.nodes[parentId].left = newNodeId;
        } else {
          newTree.nodes[parentId].right = newNodeId;
        }
        
        insertPosition = parentId;
      }
    }
    
    // Düğümü ekle
    newTree.nodes.push(newNode);
    
    // Düğüm eklemeden önceki görünümü göster
    calculateNodePositions(newTree);
    setTree({...newTree});
    await wait(speed);
    
    // Kırmızı-Siyah Ağaç özelliklerini korumak için dengeleme
    if (newNode.color === 'red' && newNode.parent !== null) {
      setExplanationText(`${value} değeri eklendi, ağaç dengeleniyor...`);
      await fixTreeAfterInsertion(newTree, newNodeId);
    }
    
    // Ağacı güncelle
    calculateNodePositions(newTree);
    setTree({...newTree});
    setOperationValue('');
    setProcessing(false);
    setExplanationText(`${value} değeri başarıyla eklendi ve ağaç dengelendi.`);
    
    verifyRedBlackProperties(newTree);
  };

  // Ekleme sonrası ağaç dengeleme
  const fixTreeAfterInsertion = async (tree: RedBlackTree, nodeId: number): Promise<void> => {
    let currentId = nodeId;
    let parentId: number | null = tree.nodes[currentId].parent;
    
    // Adım 1: Eğer düğüm kök ise siyaha boya ve çık
    if (parentId === null) {
      tree.nodes[currentId].color = 'black';
      calculateNodePositions(tree);
      setTree({...tree});
      return;
    }
    
    // Adım 2: Ebeveyn siyahsa hiçbir şey yapma (kural zaten sağlanıyor)
    if (tree.nodes[parentId].color === 'black') {
      return;
    }
    
    // Düğüm kırmızı ve ebeveyni de kırmızı ise dengeleme gerekiyor
    while (currentId !== tree.root && 
           parentId !== null && 
           tree.nodes[parentId].color === 'red') {
      
      // Büyükebeveyni bul
      const grandparentId = tree.nodes[parentId].parent;
      
      // Eğer büyükebevey yoksa (imkansız, çünkü parent kırmızı ve kök siyah olmalı)
      if (grandparentId === null) {
        tree.nodes[parentId].color = 'black';
        break;
      }
      
      const grandparent = tree.nodes[grandparentId];
      
      // Amcayı bul - büyükebeveynin diğer çocuğu
      const parentIsLeftChild = grandparent.left === parentId;
      const uncleId = parentIsLeftChild ? grandparent.right : grandparent.left;
      
      // Adım 3: Amca kırmızı ise, renk değişimi yap
      if (uncleId !== null && tree.nodes[uncleId].color === 'red') {
        setExplanationText('Durum 1: Amca kırmızı - Renk değiştiriliyor');
        
        // Ebeveyni ve amcayı siyah yap
        tree.nodes[parentId].color = 'black';
        tree.nodes[uncleId].color = 'black';
        
        // Büyükebeveyni kırmızı yap
        tree.nodes[grandparentId].color = 'red';
        
        // Değişiklikleri göster
        calculateNodePositions(tree);
        setTree({...tree});
        await wait(speed);
        
        // Büyükebeveyni kontrol etmek için yukarı çık
        currentId = grandparentId;
        parentId = tree.nodes[currentId].parent;
        continue;
      }
      
      // Adım 4 ve 5: Amca siyah veya null
      
      // Adım 4: Current, parent'in iç düğümü ise rotasyon ile düzelt
      const isCurrentLeftChild = tree.nodes[parentId].left === currentId;
      
      if (parentIsLeftChild && !isCurrentLeftChild) {
        // LR durumu: Sol-Sağ rotasyon
        setExplanationText('Durum 2: LR durumu - Sol rotasyon yapılıyor');
        
        // Sol rotasyon
        await leftRotate(tree, parentId);
        
        // Düzeltme sonrası pozisyonları güncelle
        currentId = tree.nodes[currentId].left as number;
      } 
      else if (!parentIsLeftChild && isCurrentLeftChild) {
        // RL durumu: Sağ-Sol rotasyon
        setExplanationText('Durum 2: RL durumu - Sağ rotasyon yapılıyor');
        
        // Sağ rotasyon
        await rightRotate(tree, parentId);
        
        // Düzeltme sonrası pozisyonları güncelle
        currentId = tree.nodes[currentId].right as number;
      }
      
      // Referansları güncelle
      parentId = tree.nodes[currentId].parent;
      if (parentId === null) break;
      
      const newGrandparentId = tree.nodes[parentId].parent;
      if (newGrandparentId === null) break;
      
      // Adım 5: Final renk değişimi ve rotasyon
      setExplanationText('Durum 3: Final renk değişimi ve rotasyon');
      
      // Renk değişimi
      tree.nodes[parentId].color = 'black';
      tree.nodes[newGrandparentId].color = 'red';
      
      // Büyükebevey etrafında rotasyon
      if (tree.nodes[newGrandparentId].left === parentId) {
        // LL durumu
        await rightRotate(tree, newGrandparentId);
      } else {
        // RR durumu
        await leftRotate(tree, newGrandparentId);
      }
      
      // Değişiklikleri göster
      calculateNodePositions(tree);
      setTree({...tree});
      await wait(speed);
      
      // Rotasyon ve renk değişiminden sonra tamamlandı
      break;
    }
    
    // Son kural: Kök her zaman siyah olmalı
    if (tree.root !== null) {
      tree.nodes[tree.root].color = 'black';
    }
    
    // Ağaç yapısındaki değişiklikleri görüntüle
    calculateNodePositions(tree);
    setTree({...tree});
  };

  // Sol rotasyon
  const leftRotate = async (tree: RedBlackTree, nodeId: number) => {
    const node = tree.nodes[nodeId];
    const rightChildId = node.right;
    
    if (rightChildId === null) return;
    
    const rightChild = tree.nodes[rightChildId];
    
    // Sağ çocuğun sol alt ağacını düğümün sağ alt ağacı yap
    node.right = rightChild.left;
    
    // Sağ çocuğun sol çocuğunun ebeveynini güncelle
    if (rightChild.left !== null) {
      tree.nodes[rightChild.left].parent = nodeId;
    }
    
    // Sağ çocuğun ebeveynini düğümün ebeveynine ayarla
    rightChild.parent = node.parent;
    
    if (node.parent === null) {
      // Düğüm kökse, yeni kök sağ çocuk olur
      tree.root = rightChildId;
    } else {
      // Düğümün ebeveyninin çocuk referansını güncelle
      const parent = tree.nodes[node.parent];
      if (node.parent !== null && parent.left === nodeId) {
        parent.left = rightChildId;
      } else if (node.parent !== null) {
        parent.right = rightChildId;
      }
    }
    
    // Sağ çocuğun sol çocuğunu düğüm yap
    rightChild.left = nodeId;
    // Düğümün ebeveynini sağ çocuk yap
    node.parent = rightChildId;
    
    // Pozisyonları güncelle
    calculateNodePositions(tree);
    setTree({...tree});
    await wait(speed / 2);
  };

  // Sağ rotasyon
  const rightRotate = async (tree: RedBlackTree, nodeId: number) => {
    const node = tree.nodes[nodeId];
    const leftChildId = node.left;
    
    if (leftChildId === null) return;
    
    const leftChild = tree.nodes[leftChildId];
    
    // Sol çocuğun sağ alt ağacını düğümün sol alt ağacı yap
    node.left = leftChild.right;
    
    // Sol çocuğun sağ çocuğunun ebeveynini güncelle
    if (leftChild.right !== null) {
      tree.nodes[leftChild.right].parent = nodeId;
    }
    
    // Sol çocuğun ebeveynini düğümün ebeveynine ayarla
    leftChild.parent = node.parent;
    
    if (node.parent === null) {
      // Düğüm kökse, yeni kök sol çocuk olur
      tree.root = leftChildId;
    } else {
      // Düğümün ebeveyninin çocuk referansını güncelle
      const parent = tree.nodes[node.parent];
      if (node.parent !== null && parent.right === nodeId) {
        parent.right = leftChildId;
      } else if (node.parent !== null) {
        parent.left = leftChildId;
      }
    }
    
    // Sol çocuğun sağ çocuğunu düğüm yap
    leftChild.right = nodeId;
    // Düğümün ebeveynini sol çocuk yap
    node.parent = leftChildId;
    
    // Pozisyonları güncelle
    calculateNodePositions(tree);
    setTree({...tree});
    await wait(speed / 2);
  };

  // Kırmızı-Siyah Ağaç özelliklerini kontrol et
  const verifyRedBlackProperties = (tree: RedBlackTree) => {
    if (tree.root === null) return true;
    
    let propertiesText = [];
    let allPropertiesMet = true;
    
    // Özellik 1: Her düğüm ya kırmızı ya da siyahtır (veri yapısı gereği zaten sağlanır)
    propertiesText.push("✓ Her düğüm ya kırmızı ya da siyahtır.");
    
    // Özellik 2: Kök düğüm siyahtır
    if (tree.root !== null && tree.nodes[tree.root].color === 'black') {
      propertiesText.push("✓ Kök düğüm siyahtır.");
    } else {
      propertiesText.push("✗ Kök düğüm siyah değil!");
      allPropertiesMet = false;
    }
    
    // Özellik 3: Kırmızı bir düğümün tüm çocukları siyah olmalıdır
    let redNodeWithRedChild = false;
    for (const node of tree.nodes) {
      if (node.highlighted) continue; // Silinmiş düğümleri atla
      
      if (node.color === 'red') {
        const leftChildId = node.left;
        const rightChildId = node.right;
        
        if ((leftChildId !== null && tree.nodes[leftChildId].color === 'red') ||
            (rightChildId !== null && tree.nodes[rightChildId].color === 'red')) {
          redNodeWithRedChild = true;
          break;
        }
      }
    }
    
    if (!redNodeWithRedChild) {
      propertiesText.push("✓ Kırmızı düğümlerin tüm çocukları siyahtır.");
    } else {
      propertiesText.push("✗ Kırmızı bir düğümün kırmızı çocuğu var!");
      allPropertiesMet = false;
    }
    
    // Özellik 4: Herhangi bir düğümden yaprak (NIL) düğümlere kadar giden herhangi bir yoldaki siyah düğüm sayısı aynıdır
    
    // Bu özelliği kontrol etmek için kökten başlayarak her yaprak yolu için siyah düğüm sayısını hesaplayıp 
    // tüm yollar için aynı sayıda siyah düğüm olup olmadığını kontrol edelim
    const blackHeights = new Set<number>();
    
    // Kökten yapraklara doğru siyah düğüm sayısını hesapla
    const countBlackNodes = (nodeId: number | null, count: number): void => {
      if (nodeId === null) {
        // Yaprak (NIL) düğüme ulaştık, yol üzerindeki siyah düğüm sayısını kaydet
        blackHeights.add(count + 1); // +1 çünkü NIL düğümler siyah kabul edilir
        return;
      }
      
      const node = tree.nodes[nodeId];
      if (node.highlighted) return; // Silinmiş düğümleri atla
      
      // Eğer düğüm siyahsa sayacı arttır
      const newCount = node.color === 'black' ? count + 1 : count;
      
      // Sol ve sağ alt ağaçlar için hesaplama yap
      countBlackNodes(node.left, newCount);
      countBlackNodes(node.right, newCount);
    };
    
    // Kökten başlayarak tüm yolları kontrol et
    if (tree.root !== null) {
      countBlackNodes(tree.root, 0);
    }
    
    // Eğer tüm yollarda aynı sayıda siyah düğüm varsa, blackHeights setinde sadece bir değer olmalı
    if (blackHeights.size === 1) {
      propertiesText.push("✓ Her yolda aynı sayıda siyah düğüm bulunur.");
    } else {
      propertiesText.push("✗ Bazı yollarda farklı sayıda siyah düğüm var!");
      allPropertiesMet = false;
    }
    
    if (allPropertiesMet) {
      setExplanationText(`Ağaç Kırmızı-Siyah Ağaç özelliklerini koruyor! ${propertiesText.join(" ")}`);
    } else {
      setExplanationText(`Uyarı: Ağaç Kırmızı-Siyah Ağaç özelliklerini bozuyor! ${propertiesText.join(" ")}`);
    }
    
    return allPropertiesMet;
  };

  // Ağaçtan bir değeri sil
  const deleteNode = async () => {
    if (processing || !operationValue) return;
    setProcessing(true);
    
    const value = parseInt(operationValue);
    if (isNaN(value)) {
      setExplanationText('Lütfen geçerli bir sayı girin.');
      setProcessing(false);
      return;
    }
    
    setExplanationText(`${value} değeri ağaçtan siliniyor...`);
    await wait(speed);
    
    // Silinecek düğümü bul
    const newTree = JSON.parse(JSON.stringify(tree)) as RedBlackTree;
    const nodeIndexToDelete = newTree.nodes.findIndex(node => node.value === value);
    
    if (nodeIndexToDelete === -1) {
      setExplanationText(`${value} değeri ağaçta bulunamadı.`);
      setProcessing(false);
      return;
    }
    
    // Silme işlemini gerçekleştir
    await deleteNodeFromTree(newTree, nodeIndexToDelete);
    
    // Son olarak renk kurallarını uygula
    ensureRedBlackProperties(newTree);
    
    // Pozisyonları güncelle
    calculateNodePositions(newTree);
    
    // Ağacı güncelle
    setTree(newTree);
    setOperationValue('');
    setProcessing(false);
    verifyRedBlackProperties(newTree);
  };

  // Ağaçtan düğüm silme işlemi
  const deleteNodeFromTree = async (tree: RedBlackTree, nodeIndex: number) => {
    const nodeToDelete = tree.nodes[nodeIndex];
    
    // Düğümün rengi (düğüm silindikten sonra dengeleme için kullanılacak)
    let originalColor = nodeToDelete.color;
    
    let replacementNodeId: number | null = null;
    let replacementNodeParentId: number | null = null;
    
    // Case 1: Yaprak düğüm (hiç çocuğu yok)
    if (nodeToDelete.left === null && nodeToDelete.right === null) {
      replacementNodeId = null;
      replacementNodeParentId = nodeToDelete.parent;
      
      // Ebeveyn bağlantısını güncelle
      if (nodeToDelete.parent === null) {
        // Kök düğümü siliyoruz
        tree.root = null;
      } else {
        const parent = tree.nodes[nodeToDelete.parent];
        if (parent.left === nodeIndex) {
          parent.left = null;
        } else {
          parent.right = null;
        }
      }
    }
    // Case 2: Tek çocuklu düğüm
    else if (nodeToDelete.left === null) {
      // Sadece sağ çocuk var
      replacementNodeId = nodeToDelete.right;
      replacementNodeParentId = nodeToDelete.parent;
      
      if (replacementNodeId !== null) {
        tree.nodes[replacementNodeId].parent = nodeToDelete.parent;
      }
      
      if (nodeToDelete.parent === null) {
        tree.root = replacementNodeId;
      } else {
        const parent = tree.nodes[nodeToDelete.parent];
        if (parent.left === nodeIndex) {
          parent.left = replacementNodeId;
        } else {
          parent.right = replacementNodeId;
        }
      }
    } 
    else if (nodeToDelete.right === null) {
      // Sadece sol çocuk var
      replacementNodeId = nodeToDelete.left;
      replacementNodeParentId = nodeToDelete.parent;
      
      if (replacementNodeId !== null) {
        tree.nodes[replacementNodeId].parent = nodeToDelete.parent;
      }
      
      if (nodeToDelete.parent === null) {
        tree.root = replacementNodeId;
      } else {
        const parent = tree.nodes[nodeToDelete.parent];
        if (parent.left === nodeIndex) {
          parent.left = replacementNodeId;
        } else {
          parent.right = replacementNodeId;
        }
      }
    }
    // Case 3: İki çocuklu düğüm
    else {
      // Successor'ı bul (sağ alt ağacın en sol düğümü)
      setExplanationText(`İki çocuklu düğüm siliniyor. Successor (halef) düğüm aranıyor...`);
      await wait(speed);
      
      let successorId = nodeToDelete.right;
      let successor = tree.nodes[successorId];
      
      while (successor.left !== null) {
        successorId = successor.left;
        successor = tree.nodes[successorId];
      }
      
      // Successor'ın rengini hatırla
      originalColor = successor.color;
      
      // Successor'ın sağ çocuğunu (olabilir veya olmayabilir)
      replacementNodeId = successor.right;
      
      if (successor.parent === nodeIndex) {
        // Successor, silinecek düğümün doğrudan sağ çocuğu ise
        replacementNodeParentId = successorId;
        
        if (replacementNodeId !== null) {
          tree.nodes[replacementNodeId].parent = successorId;
        }
      } else {
        // Successor, daha derinde bir düğüm ise
        replacementNodeParentId = successor.parent;
        
        if (replacementNodeParentId !== null) {
          // Successor'ın ebeveyninin sol bağlantısını güncelle
          tree.nodes[replacementNodeParentId].left = successor.right;
          
          if (successor.right !== null) {
            tree.nodes[successor.right].parent = replacementNodeParentId;
          }
        }
        
        // Successor'ı silinecek düğümün yerine koy - sağ bağlantıyı güncelle
        successor.right = nodeToDelete.right;
        if (nodeToDelete.right !== null) {
          tree.nodes[nodeToDelete.right].parent = successorId;
        }
      }
      
      // Successor'ı silinecek düğümün yerine koy
      if (nodeToDelete.parent === null) {
        tree.root = successorId;
      } else {
        const parent = tree.nodes[nodeToDelete.parent];
        if (parent.left === nodeIndex) {
          parent.left = successorId;
        } else {
          parent.right = successorId;
        }
      }
      
      // Successor'ın sol bağlantısını ve rengini güncelle
      successor.left = nodeToDelete.left;
      if (nodeToDelete.left !== null) {
        tree.nodes[nodeToDelete.left].parent = successorId;
      }
      successor.color = nodeToDelete.color;
      successor.parent = nodeToDelete.parent;
    }
    
    // Eğer silinen veya taşınan düğüm siyahsa, dengeleme gerekir
    if (originalColor === 'black' && replacementNodeId !== null) {
      setExplanationText('Siyah düğüm silindi, ağaç dengeleniyor...');
      await wait(speed);
      
      await fixTreeAfterDeletion(tree, replacementNodeId, replacementNodeParentId);
    }
    
    // Düğümü işaretle (görünmez yap)
    tree.nodes[nodeIndex].highlighted = true;
    
    setExplanationText(`${nodeToDelete.value} değeri başarıyla silindi.`);
  };

  // Silme sonrası ağaç dengeleme
  const fixTreeAfterDeletion = async (tree: RedBlackTree, nodeId: number | null, parentId: number | null) => {
    if (tree.root === null) return;
    
    let currentNodeId = nodeId;
    let currentParentId = parentId;
    
    // Eğer düğüm null veya kök ise işlemi sonlandır
    if (currentNodeId === tree.root || currentNodeId === null || currentParentId === null) {
      if (currentNodeId !== null) {
        tree.nodes[currentNodeId].color = 'black';
      }
      return;
    }
    
    // Ekstra siyah özelliği giderilene kadar devam et
    while (currentNodeId !== tree.root && 
           (currentNodeId === null || 
            (currentNodeId !== null && tree.nodes[currentNodeId].color === 'black'))) {
      
      if (currentParentId === null) break;
      
      const parent = tree.nodes[currentParentId];
      const isLeftChild = parent.left === currentNodeId;
      
      // Kardeş düğümü bul
      let siblingId = isLeftChild ? parent.right : parent.left;
      
      if (siblingId === null) break;
      
      const sibling = tree.nodes[siblingId];
      
      // Case 1: Kardeş kırmızıysa
      if (sibling.color === 'red') {
        setExplanationText('Case 1: Kardeş düğüm kırmızı, renkler değiştiriliyor ve rotasyon yapılıyor.');
        await wait(speed);
        
        sibling.color = 'black';
        parent.color = 'red';
        
        if (isLeftChild) {
          await leftRotate(tree, currentParentId);
          // Rotasyon sonrası kardeşi güncelle
          siblingId = parent.right;
        } else {
          await rightRotate(tree, currentParentId);
          // Rotasyon sonrası kardeşi güncelle
          siblingId = parent.left;
        }
        
        if (siblingId === null) break;
      }
      
      // Kardeşin çocuklarını kontrol et
      const siblingLeftChildId = tree.nodes[siblingId].left;
      const siblingRightChildId = tree.nodes[siblingId].right;
      
      const siblingLeftChildColor = siblingLeftChildId === null ? 'black' : tree.nodes[siblingLeftChildId].color;
      const siblingRightChildColor = siblingRightChildId === null ? 'black' : tree.nodes[siblingRightChildId].color;
      
      // Case 2: Kardeş siyah ve her iki çocuğu da siyah
      if (siblingLeftChildColor === 'black' && siblingRightChildColor === 'black') {
        setExplanationText('Case 2: Kardeş siyah ve her iki çocuğu da siyah, kardeş kırmızı yapılıyor.');
        await wait(speed);
        
        tree.nodes[siblingId].color = 'red';
        currentNodeId = currentParentId;
        currentParentId = tree.nodes[currentNodeId].parent;
        
        calculateNodePositions(tree);
        setTree({...tree});
        await wait(speed / 2);
        continue;
      }
      
      // Case 3: Kardeş siyah, içteki çocuk kırmızı, dıştaki çocuk siyah
      if (isLeftChild && siblingRightChildColor === 'black' && siblingLeftChildColor === 'red') {
        setExplanationText('Case 3: Kardeş siyah, iç çocuk kırmızı, dış çocuk siyah. Kardeş etrafında rotasyon yapılıyor.');
        await wait(speed);
        
        tree.nodes[siblingId].color = 'red';
        if (siblingLeftChildId !== null) {
          tree.nodes[siblingLeftChildId].color = 'black';
        }
        
        await rightRotate(tree, siblingId);
        
        // Rotasyon sonrası kardeşi güncelle
        siblingId = parent.right;
        if (siblingId === null) break;
        
      } else if (!isLeftChild && siblingLeftChildColor === 'black' && siblingRightChildColor === 'red') {
        setExplanationText('Case 3: Kardeş siyah, iç çocuk kırmızı, dış çocuk siyah. Kardeş etrafında rotasyon yapılıyor.');
        await wait(speed);
        
        tree.nodes[siblingId].color = 'red';
        if (siblingRightChildId !== null) {
          tree.nodes[siblingRightChildId].color = 'black';
        }
        
        await leftRotate(tree, siblingId);
        
        // Rotasyon sonrası kardeşi güncelle
        siblingId = parent.left;
        if (siblingId === null) break;
      }
      
      // Case 4: Kardeş siyah, dıştaki çocuk kırmızı
      setExplanationText('Case 4: Kardeş siyah, dıştaki çocuk kırmızı. Ebeveyn etrafında rotasyon yapılıyor.');
      await wait(speed);
      
      const updatedSibling = tree.nodes[siblingId];
      updatedSibling.color = parent.color;
      parent.color = 'black';
      
      if (isLeftChild) {
        if (updatedSibling.right !== null) {
          tree.nodes[updatedSibling.right].color = 'black';
        }
        await leftRotate(tree, currentParentId);
      } else {
        if (updatedSibling.left !== null) {
          tree.nodes[updatedSibling.left].color = 'black';
        }
        await rightRotate(tree, currentParentId);
      }
      
      // İşlemi sonlandır
      currentNodeId = tree.root;
      break;
    }
    
    // Kök düğümü siyah yap ve işlemi sonlandır
    if (currentNodeId !== null) {
      tree.nodes[currentNodeId].color = 'black';
    }
    
    if (tree.root !== null) {
      tree.nodes[tree.root].color = 'black';
    }
  };

  // Renk düzeltmesi uygulayan ve en önemli kuralları doğrulayan fonksiyon
  const ensureRedBlackProperties = (tree: RedBlackTree) => {
    if (tree.root === null) return;
    
    // Kök her zaman siyah olmalı
    if (tree.root !== null) {
      tree.nodes[tree.root].color = 'black';
    }
    
    // Her kırmızı düğümün çocukları siyah olmalı
    for (let i = 0; i < tree.nodes.length; i++) {
      const node = tree.nodes[i];
      if (node.highlighted) continue; // Silinmiş düğümleri atla
      
      if (node.color === 'red') {
        // Sol çocuk varsa ve kırmızıysa, siyaha dönüştür
        if (node.left !== null && tree.nodes[node.left].color === 'red') {
          tree.nodes[node.left].color = 'black';
        }
        
        // Sağ çocuk varsa ve kırmızıysa, siyaha dönüştür
        if (node.right !== null && tree.nodes[node.right].color === 'red') {
          tree.nodes[node.right].color = 'black';
        }
      }
    }
    
    // Siyah yüksekliği düzenle - tüm yolların siyah yüksekliği aynı olmalı
    adjustBlackHeight(tree);
  };

  // Siyah yüksekliği düzenleme fonksiyonu - her yolda eşit sayıda siyah düğüm olmasını sağlar
  const adjustBlackHeight = (tree: RedBlackTree) => {
    if (tree.root === null) return;
    
    // Her düğümden yapraklara giden yollar için siyah düğüm sayısını hesapla
    const paths: {nodeId: number, blackCount: number}[] = [];
    
    // Tüm yaprak yollarını ve siyah sayısını bul
    const findLeafPaths = (nodeId: number | null, blackCount: number, path: number[]) => {
      if (nodeId === null) return;
      
      const node = tree.nodes[nodeId];
      if (node.highlighted) return; // Silinmiş düğümleri atla
      
      const newBlackCount = node.color === 'black' ? blackCount + 1 : blackCount;
      const newPath = [...path, nodeId];
      
      // Yaprak düğüme ulaştık
      if (node.left === null && node.right === null) {
        paths.push({
          nodeId: nodeId,
          blackCount: newBlackCount
        });
        return;
      }
      
      if (node.left !== null) findLeafPaths(node.left, newBlackCount, newPath);
      if (node.right !== null) findLeafPaths(node.right, newBlackCount, newPath);
    };
    
    findLeafPaths(tree.root, 0, []);
    
    // Hedef siyah sayısını belirle (en yüksek olan)
    let maxBlackCount = 0;
    for (const path of paths) {
      maxBlackCount = Math.max(maxBlackCount, path.blackCount);
    }
    
    // Siyah sayısı hedeften düşük olan yollarda renkleri ayarla
    for (const path of paths) {
      if (path.blackCount < maxBlackCount) {
        // Yaprak düğümleri siyah yap
        const node = tree.nodes[path.nodeId];
        if (node.color === 'red') {
          node.color = 'black';
        }
      }
    }
  };

  // Ağaç düğümlerinin koordinatlarını hesapla
  const calculateNodePositions = (currentTree: RedBlackTree) => {
    if (currentTree.root === null) return;
    
    // Ağacın derinliğini hesapla
    const getDepth = (nodeId: number | null): number => {
      if (nodeId === null) return 0;
      const node = currentTree.nodes[nodeId];
      if (node.highlighted) return 0; // Silinmiş düğümleri atla
      
      return 1 + Math.max(
        getDepth(node.left),
        getDepth(node.right)
      );
    };
    
    const depth = getDepth(currentTree.root);
    const svgWidth = 800;
    const svgHeight = depth * LEVEL_HEIGHT + 80;
    
    // Her seviyedeki düğüm sayısını bulmak için hazırlık
    const nodeCounts: number[] = Array(depth).fill(0);
    
    // Düğüm pozisyonlarını hesapla
    const calculatePosition = (nodeId: number | null, level: number, leftX: number, rightX: number): void => {
      if (nodeId === null) return;
      
      const node = currentTree.nodes[nodeId];
      if (node.highlighted) return; // Silinmiş düğümleri atla
      
      const x = (leftX + rightX) / 2;
      const y = level * LEVEL_HEIGHT + 40;
      
      // Pozisyonu güncelle
      node.x = x;
      node.y = y;
      
      // Alt ağaçlar için hesapla
      calculatePosition(node.left, level + 1, leftX, x);
      calculatePosition(node.right, level + 1, x, rightX);
    };
    
    // Kök düğümden itibaren pozisyonları hesapla
    calculatePosition(currentTree.root, 0, 0, svgWidth);
  };

  // İlk render'da düğüm pozisyonlarını hesapla
  useEffect(() => {
    calculateNodePositions(tree);
  }, []);

  // Ağaç özelliklerini açıkla ve görselleştir
  const explainRedBlackTree = async () => {
    if (processing) return;
    setProcessing(true);
    setCurrentStep(0);
    
    const steps = [
      "Kırmızı-Siyah Ağaç, kendini dengeleyen ikili arama ağacıdır.",
      "Her düğüm ya kırmızı ya da siyahtır.",
      "Kök düğüm her zaman siyahtır.",
      "Kırmızı bir düğümün tüm çocukları siyah olmalıdır.",
      "Herhangi bir düğümden yaprak düğümlere kadar olan her yolda aynı sayıda siyah düğüm bulunur.",
      "Bu özellikler sayesinde, ağaç her zaman dengeli kalır ve işlemler O(log n) zaman karmaşıklığına sahiptir."
    ];
    
    setTotalSteps(steps.length);
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i + 1);
      setExplanationText(steps[i]);
      await wait(speed * 2);
    }
    
    setProcessing(false);
  };

  return (
    <div className="tree-visualization-container">
      <h2 className="visualization-title">{title}</h2>
      
      <div className="controls-container">
        <button 
          className="control-button"
          onClick={resetTree}
          disabled={processing}
        >
          Yeni Ağaç
        </button>
        
        <button 
          className="control-button primary"
          onClick={explainRedBlackTree}
          disabled={processing}
        >
          Özellikleri Göster
        </button>
        
        <div className="node-operation">
          <input
            type="text"
            value={operationValue}
            onChange={(e) => setOperationValue(e.target.value)}
            placeholder="Sayı girin..."
            disabled={processing}
          />
          <div className="operation-buttons">
            <button 
              className="operation-button insert"
              onClick={insertNode}
              disabled={processing || !operationValue}
            >
              Ekle
            </button>
            <button 
              className="operation-button delete"
              onClick={deleteNode}
              disabled={processing || !operationValue}
            >
              Sil
            </button>
          </div>
        </div>
        
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
            disabled={processing}
          />
        </div>
      </div>
      
      <div className="progress-section">
        {processing && (
          <>
            <div className="progress-text">
              {`Adım ${currentStep}/${totalSteps}`}
            </div>
            {totalSteps > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="explanation-box">
        <p>{explanationText}</p>
      </div>
      
      <div className="tree-area">
        <svg 
          ref={svgRef}
          width="100%" 
          height="400"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Ağaç bağlantılarını çiz */}
          {tree.nodes.map((node) => {
            if (node.highlighted) return null; // Silinmiş düğümleri atla
            
            return (
              <React.Fragment key={`edges-${node.id}`}>
                {node.left !== null && 
                 tree.nodes[node.left] && 
                 !tree.nodes[node.left].highlighted && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={tree.nodes[node.left].x}
                    y2={tree.nodes[node.left].y}
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                )}
                {node.right !== null && 
                 tree.nodes[node.right] && 
                 !tree.nodes[node.right].highlighted && (
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={tree.nodes[node.right].x}
                    y2={tree.nodes[node.right].y}
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                )}
              </React.Fragment>
            );
          })}
          
          {/* Ağaç düğümlerini çiz */}
          {tree.nodes.map((node) => {
            if (node.highlighted) return null; // Silinmiş düğümleri atla
            
            return (
              <g key={`node-${node.id}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={node.color === 'red' ? RED_COLOR : BLACK_COLOR}
                  stroke="#fff"
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {node.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="info-section">
        <div className="tree-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: RED_COLOR }}></div>
            <span>Kırmızı Düğüm</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: BLACK_COLOR }}></div>
            <span>Siyah Düğüm</span>
          </div>
        </div>
        
        <AlgorithmInfoCard algorithmType="Red-Black Tree" />
      </div>
    </div>
  );
};

export default TreeVisualization; 