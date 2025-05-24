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

// AVL Ağacı için yeni düğüm yapısı
interface AVLTreeNode {
  id: number;
  value: number;
  height: number;
  balanceFactor: number;
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

// AVL Ağacı yapısı
interface AVLTree {
  nodes: AVLTreeNode[];
  root: number | null;
}

interface TreeVisualizationProps {
  algorithmType: string;
  title: string;
  customTree?: RedBlackTree | AVLTree;
  animationSpeed?: number;
}

// Varsayılan animasyon hızı ve renk sabitleri
const DEFAULT_ANIMATION_SPEED = 500;
const NODE_RADIUS = 22;
const LEVEL_HEIGHT = 80;
const RED_COLOR = '#e74c3c';
const BLACK_COLOR = '#2c3e50';
const HIGHLIGHT_COLOR = '#f39c12';
const AVL_NODE_COLOR = '#3498db';
const AVL_UNBALANCED_COLOR = '#e74c3c';
const AVL_BALANCED_COLOR = '#27ae60';

// Örnek AVL ağacı oluştur
const createSampleAVLTree = (): AVLTree => {
  const nodeCount = Math.floor(Math.random() * 8) + 5; // 5-12 arası
  const availableValues = Array.from({ length: 99 }, (_, i) => i + 1);
  
  // Rastgele değerler seç
  const selectedValues: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableValues.length);
    selectedValues.push(availableValues[randomIndex]);
    availableValues.splice(randomIndex, 1);
  }
  
  // AVL ağacını adım adım oluştur
  const tree: AVLTree = { nodes: [], root: null };
  
  for (const value of selectedValues) {
    insertAVLNode(tree, value);
  }
  
  return tree;
};

// AVL ağacına düğüm ekleme
const insertAVLNode = (tree: AVLTree, value: number): void => {
  const newNodeId = tree.nodes.length;
  const newNode: AVLTreeNode = {
    id: newNodeId,
    value: value,
    height: 1,
    balanceFactor: 0,
    left: null,
    right: null,
    parent: null
  };
  
  tree.nodes.push(newNode);
  
  if (tree.root === null) {
    tree.root = newNodeId;
    return;
  }
  
  // Standart BST ekleme
  let currentId: number | null = tree.root;
  let parentId: number | null = null;
  
  while (currentId !== null) {
    parentId = currentId;
    const current: AVLTreeNode = tree.nodes[currentId];
    
    if (value < current.value) {
      currentId = current.left;
    } else if (value > current.value) {
      currentId = current.right;
      } else {
      // Değer zaten var, eklemeyi iptal et
      tree.nodes.pop();
      return;
    }
  }
  
  // Yeni düğümü bağla
  if (parentId !== null) {
    newNode.parent = parentId;
    const parent: AVLTreeNode = tree.nodes[parentId];
    
    if (value < parent.value) {
      parent.left = newNodeId;
      } else {
      parent.right = newNodeId;
    }
  }
  
  // Yükseklikleri ve balance factor'ları güncelle
  updateHeightsAndBalance(tree, parentId);
  
  // AVL özelliklerini koru
  rebalanceAVL(tree, parentId);
};

// Yükseklik hesaplama
const getNodeHeight = (tree: AVLTree, nodeId: number | null): number => {
  if (nodeId === null) return 0;
  return tree.nodes[nodeId].height;
};

// Balance factor hesaplama
const getBalanceFactor = (tree: AVLTree, nodeId: number): number => {
  const node: AVLTreeNode = tree.nodes[nodeId];
  return getNodeHeight(tree, node.left) - getNodeHeight(tree, node.right);
};

// Yükseklikleri ve balance factor'ları güncelle
const updateHeightsAndBalance = (tree: AVLTree, nodeId: number | null): void => {
  if (nodeId === null) return;
  
  const node: AVLTreeNode = tree.nodes[nodeId];
  
  // Yüksekliği güncelle
  const leftHeight = getNodeHeight(tree, node.left);
  const rightHeight = getNodeHeight(tree, node.right);
  node.height = Math.max(leftHeight, rightHeight) + 1;
  
  // Balance factor'ı güncelle
  node.balanceFactor = leftHeight - rightHeight;
  
  // Ebeveyne doğru devam et
  updateHeightsAndBalance(tree, node.parent);
};

// AVL dengeleme
const rebalanceAVL = (tree: AVLTree, nodeId: number | null): void => {
  if (nodeId === null) return;
  
  const node: AVLTreeNode = tree.nodes[nodeId];
  
  // Balance factor kontrolü
  if (Math.abs(node.balanceFactor) > 1) {
    // Dengeleme gerekli
    if (node.balanceFactor > 1) {
      // Sol ağır
      const leftChild = node.left !== null ? tree.nodes[node.left] : null;
      if (leftChild && leftChild.balanceFactor < 0) {
        // LR durumu
        if (node.left !== null) {
          leftRotateAVL(tree, node.left);
        }
      }
      // LL durumu
      rightRotateAVL(tree, nodeId);
    } else {
      // Sağ ağır  
      const rightChild = node.right !== null ? tree.nodes[node.right] : null;
      if (rightChild && rightChild.balanceFactor > 0) {
        // RL durumu
        if (node.right !== null) {
          rightRotateAVL(tree, node.right);
        }
      }
      // RR durumu
      leftRotateAVL(tree, nodeId);
    }
  }
  
  // Ebeveyne doğru devam et
  rebalanceAVL(tree, node.parent);
};

// AVL sol rotasyon
const leftRotateAVL = (tree: AVLTree, nodeId: number): void => {
  const node: AVLTreeNode = tree.nodes[nodeId];
  const rightChildId = node.right;
  
  if (rightChildId === null) return;
  
  const rightChild: AVLTreeNode = tree.nodes[rightChildId];
  
  // Rotasyon
  node.right = rightChild.left;
  if (rightChild.left !== null) {
    tree.nodes[rightChild.left].parent = nodeId;
  }
  
  rightChild.parent = node.parent;
  if (node.parent === null) {
    tree.root = rightChildId;
  } else {
    const parent: AVLTreeNode = tree.nodes[node.parent];
    if (parent.left === nodeId) {
      parent.left = rightChildId;
    } else {
      parent.right = rightChildId;
    }
  }
  
  rightChild.left = nodeId;
  node.parent = rightChildId;
  
  // Yükseklikleri güncelle
  if (nodeId !== null) {
    updateHeightsAndBalance(tree, nodeId);
  }
  if (rightChildId !== null) {
    updateHeightsAndBalance(tree, rightChildId);
  }
};

// AVL sağ rotasyon
const rightRotateAVL = (tree: AVLTree, nodeId: number): void => {
  const node: AVLTreeNode = tree.nodes[nodeId];
  const leftChildId = node.left;
  
  if (leftChildId === null) return;
  
  const leftChild: AVLTreeNode = tree.nodes[leftChildId];
  
  // Rotasyon
  node.left = leftChild.right;
  if (leftChild.right !== null) {
    tree.nodes[leftChild.right].parent = nodeId;
  }
  
  leftChild.parent = node.parent;
  if (node.parent === null) {
    tree.root = leftChildId;
  } else {
    const parent: AVLTreeNode = tree.nodes[node.parent];
    if (parent.right === nodeId) {
      parent.right = leftChildId;
    } else {
      parent.left = leftChildId;
    }
  }
  
  leftChild.right = nodeId;
  node.parent = leftChildId;
  
  // Yükseklikleri güncelle
  if (nodeId !== null) {
    updateHeightsAndBalance(tree, nodeId);
  }
  if (leftChildId !== null) {
    updateHeightsAndBalance(tree, leftChildId);
  }
};

// Örnek kırmızı-siyah ağaç
const createSampleRedBlackTree = (): RedBlackTree => {
  // Boş ağaç ile başla
  const tree: RedBlackTree = { nodes: [], root: null };
  
  // Sıralı değerler ekleyerek dengeli bir ağaç oluştur
  const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
  
  for (const value of values) {
    insertRedBlackNode(tree, value);
  }
  
  return tree;
};

// Red-Black Tree'ye düğüm ekleme (algoritma mantığına uygun)
const insertRedBlackNode = (tree: RedBlackTree, value: number): void => {
  const newNodeId = tree.nodes.length;
    const newNode: TreeNode = {
      id: newNodeId,
      value: value,
    color: 'red', // Yeni düğümler her zaman kırmızı başlar
      left: null,
      right: null,
      parent: null
    };
    
  tree.nodes.push(newNode);
  
  // Boş ağaç ise kök olarak ekle ve siyah yap
  if (tree.root === null) {
    tree.root = newNodeId;
    newNode.color = 'black'; // Kök her zaman siyah
    return;
  }
  
  // Standart BST ekleme
  let currentId: number | null = tree.root;
      let parentId: number | null = null;
      
      while (currentId !== null) {
        parentId = currentId;
    const current: TreeNode = tree.nodes[currentId];
        
        if (value < current.value) {
          currentId = current.left;
        } else if (value > current.value) {
          currentId = current.right;
        } else {
      // Değer zaten var, eklemeyi iptal et
      tree.nodes.pop();
          return;
        }
      }
      
  // Yeni düğümü ebeveyne bağla
      if (parentId !== null) {
        newNode.parent = parentId;
    const parent: TreeNode = tree.nodes[parentId];
        
    if (value < parent.value) {
      parent.left = newNodeId;
        } else {
      parent.right = newNodeId;
    }
  }
  
  // Red-Black tree özelliklerini koru
  fixRedBlackInsertion(tree, newNodeId);
};

// Red-Black tree ekleme sonrası düzeltme
const fixRedBlackInsertion = (tree: RedBlackTree, nodeId: number): void => {
    let currentId = nodeId;
  
  // Kök değilse ve ebeveyn kırmızı ise düzeltme gerekiyor
    while (currentId !== tree.root && 
         tree.nodes[currentId].parent !== null && 
         tree.nodes[tree.nodes[currentId].parent!].color === 'red') {
    
    const parentId = tree.nodes[currentId].parent!;
    const parent = tree.nodes[parentId];
    const grandparentId = parent.parent;
    
    if (grandparentId === null) break;
      
      const grandparent = tree.nodes[grandparentId];
      
    // Ebeveyn büyükebeveynin sol çocuğu mu?
    if (grandparent.left === parentId) {
      const uncleId = grandparent.right;
      
      // Case 1: Amca kırmızı - Renk değiştir
      if (uncleId !== null && tree.nodes[uncleId].color === 'red') {
        parent.color = 'black';
        tree.nodes[uncleId].color = 'black';
        grandparent.color = 'red';
        currentId = grandparentId;
      } else {
        // Case 2: Sağ çocuk ise sol rotasyon (LR durumu)
        if (parent.right === currentId) {
          currentId = parentId;
          rotateLeft(tree, currentId);
        }
        
        // Case 3: Sol çocuk - sağ rotasyon (LL durumu)
        const newParentId = tree.nodes[currentId].parent!;
        const newParent = tree.nodes[newParentId];
        const newGrandparentId = newParent.parent!;
        
        newParent.color = 'black';
        tree.nodes[newGrandparentId].color = 'red';
        rotateRight(tree, newGrandparentId);
      }
    } else {
      // Ebeveyn büyükebeveynin sağ çocuğu
      const uncleId = grandparent.left;
      
      // Case 1: Amca kırmızı - Renk değiştir
      if (uncleId !== null && tree.nodes[uncleId].color === 'red') {
        parent.color = 'black';
        tree.nodes[uncleId].color = 'black';
        grandparent.color = 'red';
        currentId = grandparentId;
      } else {
        // Case 2: Sol çocuk ise sağ rotasyon (RL durumu)
        if (parent.left === currentId) {
          currentId = parentId;
          rotateRight(tree, currentId);
        }
        
        // Case 3: Sağ çocuk - sol rotasyon (RR durumu)
        const newParentId = tree.nodes[currentId].parent!;
        const newParent = tree.nodes[newParentId];
        const newGrandparentId = newParent.parent!;
        
        newParent.color = 'black';
      tree.nodes[newGrandparentId].color = 'red';
        rotateLeft(tree, newGrandparentId);
      }
    }
  }
  
  // Kök her zaman siyah
    if (tree.root !== null) {
      tree.nodes[tree.root].color = 'black';
    }
  };

  // Sol rotasyon
const rotateLeft = (tree: RedBlackTree, nodeId: number): void => {
    const node = tree.nodes[nodeId];
    const rightChildId = node.right;
    
    if (rightChildId === null) return;
    
    const rightChild = tree.nodes[rightChildId];
    
    // Sağ çocuğun sol alt ağacını düğümün sağ alt ağacı yap
    node.right = rightChild.left;
    if (rightChild.left !== null) {
      tree.nodes[rightChild.left].parent = nodeId;
    }
    
    // Sağ çocuğun ebeveynini düğümün ebeveynine ayarla
    rightChild.parent = node.parent;
    
    if (node.parent === null) {
      tree.root = rightChildId;
  } else if (tree.nodes[node.parent].left === nodeId) {
    tree.nodes[node.parent].left = rightChildId;
    } else {
    tree.nodes[node.parent].right = rightChildId;
  }
  
  // Düğümü sağ çocuğun sol çocuğu yap
    rightChild.left = nodeId;
    node.parent = rightChildId;
  };

  // Sağ rotasyon
const rotateRight = (tree: RedBlackTree, nodeId: number): void => {
    const node = tree.nodes[nodeId];
    const leftChildId = node.left;
    
    if (leftChildId === null) return;
    
    const leftChild = tree.nodes[leftChildId];
    
    // Sol çocuğun sağ alt ağacını düğümün sol alt ağacı yap
    node.left = leftChild.right;
    if (leftChild.right !== null) {
      tree.nodes[leftChild.right].parent = nodeId;
    }
    
    // Sol çocuğun ebeveynini düğümün ebeveynine ayarla
    leftChild.parent = node.parent;
    
    if (node.parent === null) {
      tree.root = leftChildId;
  } else if (tree.nodes[node.parent].right === nodeId) {
    tree.nodes[node.parent].right = leftChildId;
    } else {
    tree.nodes[node.parent].left = leftChildId;
  }
  
  // Düğümü sol çocuğun sağ çocuğu yap
    leftChild.right = nodeId;
    node.parent = leftChildId;
};

// Red-Black tree düğüm silme
const deleteRedBlackNode = (tree: RedBlackTree, value: number): boolean => {
  // Silinecek düğümü bul
  const nodeToDelete = tree.nodes.find(node => node.value === value && !node.highlighted);
  if (!nodeToDelete) {
    return false;
  }
  
  let replacementNodeId: number | null = null;
  let deletedColor: 'red' | 'black' = nodeToDelete.color;
  
  if (nodeToDelete.left === null) {
    // Sol çocuk yok
    replacementNodeId = nodeToDelete.right;
    transplant(tree, nodeToDelete.id, nodeToDelete.right);
  } else if (nodeToDelete.right === null) {
    // Sağ çocuk yok
    replacementNodeId = nodeToDelete.left;
    transplant(tree, nodeToDelete.id, nodeToDelete.left);
    } else {
    // İki çocuk var - successor'ı bul
    const successorId = findMinimum(tree, nodeToDelete.right);
    const successor = tree.nodes[successorId];
    deletedColor = successor.color;
    replacementNodeId = successor.right;
    
    if (successor.parent === nodeToDelete.id) {
      if (replacementNodeId !== null) {
        tree.nodes[replacementNodeId].parent = successorId;
      }
    } else {
      transplant(tree, successorId, successor.right);
      successor.right = nodeToDelete.right;
      if (successor.right !== null) {
        tree.nodes[successor.right].parent = successorId;
      }
    }
    
    transplant(tree, nodeToDelete.id, successorId);
    successor.left = nodeToDelete.left;
    if (successor.left !== null) {
      tree.nodes[successor.left].parent = successorId;
    }
    successor.color = nodeToDelete.color;
  }
  
  // Düğümü sil (highlight olarak işaretle)
  nodeToDelete.highlighted = true;
  
  // Eğer silinen düğüm siyahsa dengeleme gerekir
  if (deletedColor === 'black' && replacementNodeId !== null) {
    fixRedBlackDeletion(tree, replacementNodeId);
  }
  
  return true;
};

// Alt ağaç değiştirme
const transplant = (tree: RedBlackTree, uId: number, vId: number | null): void => {
  const u = tree.nodes[uId];
  
  if (u.parent === null) {
    tree.root = vId;
  } else if (tree.nodes[u.parent].left === uId) {
    tree.nodes[u.parent].left = vId;
    } else {
    tree.nodes[u.parent].right = vId;
  }
  
  if (vId !== null) {
    tree.nodes[vId].parent = u.parent;
  }
};

// Minimum değeri bul
const findMinimum = (tree: RedBlackTree, nodeId: number): number => {
  let currentId = nodeId;
  while (tree.nodes[currentId].left !== null) {
    currentId = tree.nodes[currentId].left!;
  }
  return currentId;
};

// Red-Black tree silme sonrası düzeltme
const fixRedBlackDeletion = (tree: RedBlackTree, nodeId: number): void => {
  let currentId = nodeId;
  
  while (currentId !== tree.root && tree.nodes[currentId].color === 'black') {
    const parentId = tree.nodes[currentId].parent!;
    
    if (tree.nodes[parentId].left === currentId) {
      // Sol çocuk
      let siblingId = tree.nodes[parentId].right!;
      let sibling = tree.nodes[siblingId];
      
      // Case 1: Kardeş kırmızı
      if (sibling.color === 'red') {
        sibling.color = 'black';
        tree.nodes[parentId].color = 'red';
        rotateLeft(tree, parentId);
        siblingId = tree.nodes[parentId].right!;
        sibling = tree.nodes[siblingId];
      }
      
      // Case 2: Kardeş siyah, her iki çocuğu da siyah
      const siblingLeftColor = sibling.left === null ? 'black' : tree.nodes[sibling.left].color;
      const siblingRightColor = sibling.right === null ? 'black' : tree.nodes[sibling.right].color;
      
      if (siblingLeftColor === 'black' && siblingRightColor === 'black') {
        sibling.color = 'red';
        currentId = parentId;
      } else {
        // Case 3: Kardeş siyah, sol çocuk kırmızı, sağ çocuk siyah
        if (siblingRightColor === 'black') {
          if (sibling.left !== null) {
            tree.nodes[sibling.left].color = 'black';
          }
          sibling.color = 'red';
          rotateRight(tree, siblingId);
          siblingId = tree.nodes[parentId].right!;
          sibling = tree.nodes[siblingId];
        }
        
        // Case 4: Kardeş siyah, sağ çocuk kırmızı
        sibling.color = tree.nodes[parentId].color;
        tree.nodes[parentId].color = 'black';
        if (sibling.right !== null) {
          tree.nodes[sibling.right].color = 'black';
        }
        rotateLeft(tree, parentId);
        currentId = tree.root!;
      }
    } else {
      // Sağ çocuk (simetrik durumlar)
      let siblingId = tree.nodes[parentId].left!;
      let sibling = tree.nodes[siblingId];
      
      if (sibling.color === 'red') {
        sibling.color = 'black';
        tree.nodes[parentId].color = 'red';
        rotateRight(tree, parentId);
        siblingId = tree.nodes[parentId].left!;
        sibling = tree.nodes[siblingId];
      }
      
      const siblingLeftColor = sibling.left === null ? 'black' : tree.nodes[sibling.left].color;
      const siblingRightColor = sibling.right === null ? 'black' : tree.nodes[sibling.right].color;
      
      if (siblingLeftColor === 'black' && siblingRightColor === 'black') {
        sibling.color = 'red';
        currentId = parentId;
      } else {
        if (siblingLeftColor === 'black') {
          if (sibling.right !== null) {
            tree.nodes[sibling.right].color = 'black';
          }
          sibling.color = 'red';
          rotateLeft(tree, siblingId);
          siblingId = tree.nodes[parentId].left!;
          sibling = tree.nodes[siblingId];
        }
        
        sibling.color = tree.nodes[parentId].color;
        tree.nodes[parentId].color = 'black';
        if (sibling.left !== null) {
          tree.nodes[sibling.left].color = 'black';
        }
        rotateRight(tree, parentId);
        currentId = tree.root!;
      }
    }
  }
  
  tree.nodes[currentId].color = 'black';
};

// Red-Black tree özelliklerini doğrula
const validateRedBlackProperties = (tree: RedBlackTree): string[] => {
  const violations: string[] = [];
  
  if (tree.root === null) return violations;
  
  // Kural 2: Kök siyah mı?
  if (tree.nodes[tree.root].color !== 'black') {
    violations.push('Kök düğüm siyah değil!');
  }
  
  // Kural 4: Kırmızı düğümlerin çocukları siyah mı?
  for (const node of tree.nodes) {
    if (node.highlighted) continue;
    
    if (node.color === 'red') {
      if (node.left !== null && tree.nodes[node.left].color === 'red') {
        violations.push(`Kırmızı düğüm ${node.value} kırmızı sol çocuğa sahip!`);
      }
      if (node.right !== null && tree.nodes[node.right].color === 'red') {
        violations.push(`Kırmızı düğüm ${node.value} kırmızı sağ çocuğa sahip!`);
      }
    }
  }
  
  // Kural 5: Siyah yükseklik kontrolü
  const blackHeights = new Set<number>();
  const checkBlackHeight = (nodeId: number | null, blackCount: number): void => {
    if (nodeId === null) {
      blackHeights.add(blackCount);
      return;
    }
    
    const node = tree.nodes[nodeId];
    if (node.highlighted) return;
    
    const newCount = node.color === 'black' ? blackCount + 1 : blackCount;
    checkBlackHeight(node.left, newCount);
    checkBlackHeight(node.right, newCount);
  };
  
  checkBlackHeight(tree.root, 0);
  
  if (blackHeights.size > 1) {
    violations.push('Farklı yollarda farklı sayıda siyah düğüm var!');
  }
  
  return violations;
};

const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  algorithmType,
  title,
  customTree,
  animationSpeed = DEFAULT_ANIMATION_SPEED
}) => {
  // AVL ağacı mı yoksa Red-Black ağaç mı kontrol et
  const isAVLTree = algorithmType.toLowerCase().includes('avl');
  
  // Durumlar - algoritma tipine göre uygun ağaç türü
  const [tree, setTree] = useState<RedBlackTree | AVLTree>(() => {
    if (customTree) {
      return customTree;
    }
    return isAVLTree ? createSampleAVLTree() : createSampleRedBlackTree();
  });
  
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(animationSpeed);
  const [explanationText, setExplanationText] = useState<string>(() => {
    return isAVLTree 
      ? 'AVL Ağacı görselleştirmesi. Başlatmak için "Yapı Göster" düğmesine tıklayın.'
      : 'Kırmızı-Siyah Ağaç görselleştirmesi. Başlatmak için "Yapı Göster" düğmesine tıklayın.';
  });
  const [operationValue, setOperationValue] = useState<string>('');
  const svgRef = useRef<SVGSVGElement>(null);

  // Bekleme yardımcı fonksiyonu
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Ağaç yapısını sıfırla ve yeni bir ağaç oluştur
  const resetTree = () => {
    if (processing) return;
    const newTree = isAVLTree ? createSampleAVLTree() : createSampleRedBlackTree();
    setTree(newTree);
    setCurrentStep(0);
    setTotalSteps(0);
    const defaultText = isAVLTree 
      ? 'AVL Ağacı görselleştirmesi. Başlatmak için "Yapı Göster" düğmesine tıklayın.'
      : 'Kırmızı-Siyah Ağaç görselleştirmesi. Başlatmak için "Yapı Göster" düğmesine tıklayın.';
    setExplanationText(defaultText);
    calculateNodePositions(newTree);
  };

  // Düğüm ekleme - algoritma tipine göre uygun fonksiyonu çağır
  const insertNode = async () => {
    if (processing || !operationValue) return;
    setProcessing(true);
    
    const value = parseInt(operationValue);
    if (isNaN(value)) {
      setExplanationText('Lütfen geçerli bir sayı girin.');
      setProcessing(false);
      return;
    }
    
    if (isAVLTree) {
      await insertAVLNodeWithAnimation(value);
    } else {
      await insertRedBlackNodeWithAnimation(value);
    }
    
    setOperationValue('');
    setProcessing(false);
  };

  // AVL ağacına animasyonlu düğüm ekleme
  const insertAVLNodeWithAnimation = async (value: number) => {
    setExplanationText(`AVL Ağacına ${value} değeri ekleniyor...`);
    await wait(speed);
    
    const avlTree = tree as AVLTree;
    
    // Değer zaten var mı kontrol et
    const existingNode = avlTree.nodes.find(node => node.value === value && !node.highlighted);
    if (existingNode) {
      setExplanationText(`${value} değeri zaten ağaçta bulunuyor.`);
      return;
    }
    
    const newTree = JSON.parse(JSON.stringify(avlTree)) as AVLTree;
    
    // Ekleme öncesi durumu göster
    setExplanationText(`${value} için uygun pozisyon aranıyor...`);
        await wait(speed);
        
    // Düğümü ekle
    const newNodeId = newTree.nodes.length;
    const newNode: AVLTreeNode = {
      id: newNodeId,
      value: value,
      height: 1,
      balanceFactor: 0,
      left: null,
      right: null,
      parent: null
    };
    
    newTree.nodes.push(newNode);
    
    if (newTree.root === null) {
      newTree.root = newNodeId;
      setTree(newTree);
      calculateNodePositions(newTree);
      setExplanationText(`${value} değeri kök düğüm olarak eklendi.`);
      return;
    }
    
    // BST ekleme
    let currentId: number | null = newTree.root;
    let parentId: number | null = null;
    
    while (currentId !== null) {
      parentId = currentId;
      const current: AVLTreeNode = newTree.nodes[currentId];
      
      // Mevcut düğümü vurgula
      current.highlighted = true;
      setTree({...newTree});
      calculateNodePositions(newTree);
      setExplanationText(`${value} ile ${current.value} karşılaştırılıyor...`);
        await wait(speed);
      current.highlighted = false;
      
      if (value < current.value) {
        setExplanationText(`${value} < ${current.value}, sol tarafa gidiliyor...`);
        currentId = current.left;
      } else {
        setExplanationText(`${value} > ${current.value}, sağ tarafa gidiliyor...`);
        currentId = current.right;
      }
        await wait(speed / 2);
    }
    
    // Yeni düğümü bağla
    if (parentId !== null) {
      newNode.parent = parentId;
      const parent: AVLTreeNode = newTree.nodes[parentId];
      
      if (value < parent.value) {
        parent.left = newNodeId;
        setExplanationText(`${value} değeri ${parent.value}'in sol çocuğu olarak eklendi.`);
      } else {
        parent.right = newNodeId;
        setExplanationText(`${value} değeri ${parent.value}'in sağ çocuğu olarak eklendi.`);
      }
    }
    
    // Ağacı güncelle ve göster
    setTree(newTree);
    calculateNodePositions(newTree);
    await wait(speed);
    
    // Yükseklikleri güncelle
    setExplanationText('Yükseklikler ve balance factor\'lar güncelleniyor...');
    updateHeightsAndBalance(newTree, parentId);
    setTree({...newTree});
    calculateNodePositions(newTree);
        await wait(speed);
        
    // AVL dengeleme kontrolü
    setExplanationText('AVL dengeleme kuralları kontrol ediliyor...');
    await rebalanceAVLWithAnimation(newTree, parentId);
    
    setTree(newTree);
    calculateNodePositions(newTree);
    setExplanationText(`${value} değeri başarıyla eklendi ve ağaç dengelendi.`);
  };

  // AVL dengeleme animasyonlu
  const rebalanceAVLWithAnimation = async (tree: AVLTree, nodeId: number | null): Promise<void> => {
    if (nodeId === null) return;
    
    const node: AVLTreeNode = tree.nodes[nodeId];
    
    // Balance factor'ı göster
    node.highlighted = true;
    setTree({...tree});
    calculateNodePositions(tree);
    setExplanationText(`Düğüm ${node.value}: Yükseklik=${node.height}, Balance Factor=${node.balanceFactor}`);
      await wait(speed);
    node.highlighted = false;
    
    // Balance factor kontrolü
    if (Math.abs(node.balanceFactor) > 1) {
      setExplanationText(`Düğüm ${node.value} dengesiz! Balance factor: ${node.balanceFactor}. Rotasyon gerekiyor...`);
      await wait(speed);
      
      if (node.balanceFactor > 1) {
        // Sol ağır
        const leftChild = node.left !== null ? tree.nodes[node.left] : null;
        if (leftChild && leftChild.balanceFactor < 0) {
          // LR durumu
          setExplanationText('LR Durumu: Sol-Sağ rotasyon gerekiyor...');
          await wait(speed);
          if (node.left !== null) {
            await leftRotateAVLWithAnimation(tree, node.left);
          }
        }
        // LL durumu
        setExplanationText('LL Durumu: Sağ rotasyon yapılıyor...');
        await wait(speed);
        await rightRotateAVLWithAnimation(tree, nodeId);
      } else {
        // Sağ ağır  
        const rightChild = node.right !== null ? tree.nodes[node.right] : null;
        if (rightChild && rightChild.balanceFactor > 0) {
          // RL durumu
          setExplanationText('RL Durumu: Sağ-Sol rotasyon gerekiyor...');
          await wait(speed);
          if (node.right !== null) {
            await rightRotateAVLWithAnimation(tree, node.right);
          }
        }
        // RR durumu
        setExplanationText('RR Durumu: Sol rotasyon yapılıyor...');
        await wait(speed);
        await leftRotateAVLWithAnimation(tree, nodeId);
      }
    }
    
    // Ebeveyne doğru devam et
    await rebalanceAVLWithAnimation(tree, node.parent);
  };

  // AVL sol rotasyon animasyonlu
  const leftRotateAVLWithAnimation = async (tree: AVLTree, nodeId: number): Promise<void> => {
    const node: AVLTreeNode = tree.nodes[nodeId];
    const rightChildId = node.right;
    
    if (rightChildId === null) return;
    
    const rightChild: AVLTreeNode = tree.nodes[rightChildId];
    
    // Rotasyon öncesi durumu göster
    node.highlighted = true;
    rightChild.highlighted = true;
    setTree({...tree});
    calculateNodePositions(tree);
    setExplanationText(`Sol rotasyon: ${node.value} ve ${rightChild.value} pozisyonları değişiyor...`);
    await wait(speed);
    
    // Rotasyon işlemi
    leftRotateAVL(tree, nodeId);
    
    // Rotasyon sonrası durumu göster
    setTree({...tree});
    calculateNodePositions(tree);
    await wait(speed);
    
    // Vurguları kaldır
    tree.nodes.forEach(n => n.highlighted = false);
    setExplanationText('Sol rotasyon tamamlandı.');
  };

  // AVL sağ rotasyon animasyonlu
  const rightRotateAVLWithAnimation = async (tree: AVLTree, nodeId: number): Promise<void> => {
    const node: AVLTreeNode = tree.nodes[nodeId];
    const leftChildId = node.left;
    
    if (leftChildId === null) return;
    
    const leftChild: AVLTreeNode = tree.nodes[leftChildId];
    
    // Rotasyon öncesi durumu göster
    node.highlighted = true;
    leftChild.highlighted = true;
    setTree({...tree});
    calculateNodePositions(tree);
    setExplanationText(`Sağ rotasyon: ${node.value} ve ${leftChild.value} pozisyonları değişiyor...`);
    await wait(speed);
    
    // Rotasyon işlemi
    rightRotateAVL(tree, nodeId);
    
    // Rotasyon sonrası durumu göster
    setTree({...tree});
    calculateNodePositions(tree);
    await wait(speed);
    
    // Vurguları kaldır
    tree.nodes.forEach(n => n.highlighted = false);
    setExplanationText('Sağ rotasyon tamamlandı.');
  };

  // Red-Black Tree animasyonlu ekleme (mevcut kod)
  const insertRedBlackNodeWithAnimation = async (value: number) => {
    setExplanationText(`Red-Black Tree'ye ${value} değeri ekleniyor...`);
    
    const rbTree = tree as RedBlackTree;
    
    // Değer zaten var mı kontrol et
    const existingNode = rbTree.nodes.find(node => node.value === value && !node.highlighted);
    if (existingNode) {
      setExplanationText(`${value} değeri zaten ağaçta bulunuyor.`);
      return;
    }
    
    const newTree = JSON.parse(JSON.stringify(rbTree)) as RedBlackTree;
    
    // Ekleme öncesi durumu göster
    setExplanationText(`${value} için uygun pozisyon aranıyor...`);
    await wait(speed);
    
    // Red-Black Tree ekleme algoritması
    insertRedBlackNode(newTree, value);
    
    setTree(newTree);
    calculateNodePositions(newTree);
    setExplanationText(`${value} değeri başarıyla eklendi ve Red-Black Tree kuralları korundu.`);
    
    // Red-Black özellikleri doğrulandı
    const violations = validateRedBlackProperties(newTree);
    if (violations.length > 0) {
      console.log('Red-Black tree kuralları ihlal edildi:', violations);
      setExplanationText(`Uyarı: ${violations[0]}`);
    } else {
      console.log('Red-Black tree kuralları doğrulandı.');
    }
  };

  // Ağaç düğümlerinin koordinatlarını hesapla
  const calculateNodePositions = (currentTree: RedBlackTree | AVLTree) => {
    if (currentTree.root === null) return;
    
    // Ağaç türünü kontrol et
    const isAVL = 'height' in currentTree.nodes[0];
    
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
  const explainTree = async () => {
    if (processing) return;
    setProcessing(true);
    setCurrentStep(0);
    
    if (isAVLTree) {
      await explainAVLTree();
    } else {
      await explainRedBlackTree();
    }
    
    setProcessing(false);
  };

  // AVL ağacı özelliklerini açıkla
  const explainAVLTree = async () => {
    const steps = [
      "AVL Ağacı, kendini dengeleyen ikili arama ağacıdır.",
      "Her düğümün sol ve sağ alt ağaçlarının yükseklikleri arasındaki fark en fazla 1'dir.",
      "Balance Factor = Sol Alt Ağaç Yüksekliği - Sağ Alt Ağaç Yüksekliği",
      "Balance Factor değeri -1, 0 veya 1 olmalıdır.",
      "Dengesizlik durumunda rotasyonlar (LL, LR, RL, RR) yapılır.",
      "Bu özellikler sayesinde ağaç her zaman dengeli kalır ve işlemler O(log n) zaman karmaşıklığına sahiptir."
    ];
    
    setTotalSteps(steps.length);
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i + 1);
      setExplanationText(steps[i]);
      await wait(speed * 2);
    }
  };

  // Red-Black ağaç özelliklerini açıkla
  const explainRedBlackTree = async () => {
    const steps = [
      "Kırmızı-Siyah Ağaç, kendini dengeleyen ikili arama ağacıdır.",
      "Kural 1: Her düğüm ya kırmızı ya da siyahtır.",
      "Kural 2: Kök düğüm her zaman siyahtır.",
      "Kural 3: Tüm yaprak (NIL) düğümler siyahtır.",
      "Kural 4: Kırmızı bir düğümün tüm çocukları siyah olmalıdır.",
      "Kural 5: Herhangi bir düğümden yaprak düğümlere kadar olan her yolda aynı sayıda siyah düğüm bulunur.",
      "Bu kurallar sayesinde ağaç dengeli kalır ve işlemler O(log n) zaman karmaşıklığına sahiptir.",
      "Ekleme ve silme sırasında rotasyonlar ve renk değişimleri ile kurallar korunur."
    ];
    
    setTotalSteps(steps.length);
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i + 1);
      setExplanationText(steps[i]);
      
      // İlgili kuralları ağaçta vurgula
      if (i === 1) { // Kural 1
        setExplanationText("Kural 1: Her düğüm ya kırmızı ya da siyahtır. Ağaçtaki düğümlerin renklerini inceleyin.");
      } else if (i === 2) { // Kural 2
        const currentTree = tree as RedBlackTree;
        if (currentTree.root !== null) {
          const rootNode = currentTree.nodes[currentTree.root];
          setExplanationText(`Kural 2: Kök düğüm (${rootNode.value}) her zaman siyahtır.`);
        }
      } else if (i === 4) { // Kural 4
        setExplanationText("Kural 4: Kırmızı düğümlerin çocukları siyah olmalıdır. Kırmızı düğümleri ve çocuklarını kontrol edin.");
      } else if (i === 5) { // Kural 5
        setExplanationText("Kural 5: Her yolda aynı sayıda siyah düğüm olmalıdır. Bu 'siyah yükseklik' dengelenmesini sağlar.");
      }
      
      await wait(speed * 2);
    }
  };

  // Düğüm silme - algoritma tipine göre uygun fonksiyonu çağır
  const deleteNode = async () => {
    if (processing || !operationValue) return;
    setProcessing(true);
    
    const value = parseInt(operationValue);
    if (isNaN(value)) {
      setExplanationText('Lütfen geçerli bir sayı girin.');
      setProcessing(false);
      return;
    }
    
    if (isAVLTree) {
      await deleteAVLNodeWithAnimation(value);
    } else {
      await deleteRedBlackNodeWithAnimation(value);
    }
    
    setOperationValue('');
    setProcessing(false);
  };

  // AVL düğüm silme (basit implementasyon)
  const deleteAVLNodeWithAnimation = async (value: number) => {
    setExplanationText(`AVL Ağacından ${value} değeri siliniyor...`);
    await wait(speed);
    
    const avlTree = tree as AVLTree;
    const newTree = JSON.parse(JSON.stringify(avlTree)) as AVLTree;
    
    // Silinecek düğümü bul
    const nodeToDelete = newTree.nodes.find(node => node.value === value && !node.highlighted);
    if (!nodeToDelete) {
      setExplanationText(`${value} değeri ağaçta bulunamadı.`);
      return;
    }
    
    // Basit silme - düğümü highlight olarak işaretle
    nodeToDelete.highlighted = true;
    
    setTree(newTree);
    calculateNodePositions(newTree);
    setExplanationText(`${value} değeri silindi.`);
  };

  // Red-Black düğüm silme (mevcut implementasyon)
  const deleteRedBlackNodeWithAnimation = async (value: number) => {
    setExplanationText(`Red-Black Tree'den ${value} değeri siliniyor...`);
    await wait(speed);
    
    const rbTree = tree as RedBlackTree;
    const newTree = JSON.parse(JSON.stringify(rbTree)) as RedBlackTree;
    
    // Silme öncesi durumu göster
    setExplanationText(`${value} değeri ağaçta aranıyor...`);
    await wait(speed);
    
    // Red-Black Tree silme algoritması
    const deleted = deleteRedBlackNode(newTree, value);
    
    if (deleted) {
      setTree(newTree);
      calculateNodePositions(newTree);
      setExplanationText(`${value} değeri başarıyla silindi ve Red-Black Tree kuralları korundu.`);
      
      // Red-Black özellikleri doğrulandı
      const violations = validateRedBlackProperties(newTree);
      if (violations.length > 0) {
        console.log('Red-Black tree kuralları ihlal edildi:', violations);
        setExplanationText(`Uyarı: ${violations[0]}`);
      } else {
        console.log('Red-Black tree kuralları doğrulandı.');
      }
    } else {
      setExplanationText(`${value} değeri ağaçta bulunamadı.`);
    }
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
          onClick={explainTree}
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
            
            // Ağaç tipine göre renk belirleme
            let nodeColor = AVL_NODE_COLOR; // Default AVL rengi
            if (isAVLTree) {
              // AVL ağacı için renk mantığı
              const avlNode = node as AVLTreeNode;
              if (Math.abs(avlNode.balanceFactor) > 1) {
                nodeColor = AVL_UNBALANCED_COLOR;
              } else {
                nodeColor = AVL_BALANCED_COLOR;
              }
            } else {
              // Red-Black ağaç için renk mantığı
              const rbNode = node as TreeNode;
              nodeColor = rbNode.color === 'red' ? RED_COLOR : BLACK_COLOR;
            }
            
            return (
              <g key={`node-${node.id}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={nodeColor}
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
                {/* AVL ağacı için balance factor göster */}
                {isAVLTree && (
                  <text
                    x={node.x! + NODE_RADIUS + 5}
                    y={node.y! - NODE_RADIUS - 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#333"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    BF: {(node as AVLTreeNode).balanceFactor}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="info-section">
        <div className="tree-legend">
          {isAVLTree ? (
            <>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: AVL_BALANCED_COLOR }}></div>
                <span>Dengeli Düğüm</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: AVL_UNBALANCED_COLOR }}></div>
                <span>Dengesiz Düğüm</span>
              </div>
            </>
          ) : (
            <>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: RED_COLOR }}></div>
            <span>Kırmızı Düğüm</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: BLACK_COLOR }}></div>
            <span>Siyah Düğüm</span>
          </div>
            </>
          )}
        </div>
        
        <AlgorithmInfoCard algorithmType={isAVLTree ? "avl tree" : "red-black tree"} />
      </div>
    </div>
  );
};

export default TreeVisualization; 