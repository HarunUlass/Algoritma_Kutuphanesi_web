import React, { useState } from 'react';
import AlgorithmVisualization from './AlgorithmVisualization';
import GraphVisualization from './GraphVisualization';
import TreeVisualization from './TreeVisualization';
import '../styles/AlgorithmVisualizationPage.css';

// Algoritma kategorileri
const algorithmCategories = [
  { id: 'array', name: 'Dizi İşlemleri' },
  { id: 'graph', name: 'Graf İşlemleri' },
  { id: 'tree', name: 'Ağaç Yapıları' }
];

// Algoritma listesi
const algorithms = [
  // Dizi algoritmaları
  { id: 'bubble-sort', name: 'Kabarcık Sıralama (Bubble Sort)', category: 'array', type: 'bubble sort' },
  { id: 'binary-search', name: 'İkili Arama (Binary Search)', category: 'array', type: 'binary search' },
  { id: 'linear-search', name: 'Doğrusal Arama (Linear Search)', category: 'array', type: 'linear search' },
  
  // Graf algoritmaları
  { id: 'dijkstra', name: 'Dijkstra Algoritması', category: 'graph', type: 'dijkstra' },
  { id: 'bfs', name: 'Genişlik Öncelikli Arama (BFS)', category: 'graph', type: 'bfs' },
  
  // Ağaç algoritmaları
  { id: 'red-black-tree', name: 'Kırmızı-Siyah Ağaç', category: 'tree', type: 'red-black tree' },
];

const AlgorithmVisualizationPage: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('array');
  
  // Seçilen kategoriye göre algoritmaları filtrele
  const filteredAlgorithms = algorithms.filter(
    algorithm => algorithm.category === selectedCategory
  );
  
  // Algoritma seçildiğinde
  const handleAlgorithmSelect = (algorithmId: string) => {
    setSelectedAlgorithm(algorithmId);
  };
  
  // Kategori seçildiğinde
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedAlgorithm('');
  };
  
  // Seçilen algoritmanın bilgilerini bul
  const selectedAlgorithmInfo = algorithms.find(
    algorithm => algorithm.id === selectedAlgorithm
  );
  
  // Seçilen algoritma türüne göre uygun görselleştirme bileşenini render et
  const renderVisualizationComponent = () => {
    if (!selectedAlgorithmInfo) return null;
    
    switch (selectedAlgorithmInfo.category) {
      case 'array':
        return (
          <AlgorithmVisualization 
            algorithmType={selectedAlgorithmInfo.type}
            title={selectedAlgorithmInfo.name}
          />
        );
      case 'graph':
        return (
          <GraphVisualization 
            algorithmType={selectedAlgorithmInfo.type}
            title={selectedAlgorithmInfo.name}
          />
        );
      case 'tree':
        return (
          <TreeVisualization 
            algorithmType={selectedAlgorithmInfo.type}
            title={selectedAlgorithmInfo.name}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="visualization-page-container">
      <h1 className="page-title">Algoritma Görselleştirmeleri</h1>
      
      <div className="visualization-content">
        <div className="sidebar">
          <div className="categories-section">
            <h3>Kategoriler</h3>
            <ul className="category-list">
              {algorithmCategories.map((category) => (
                <li 
                  key={category.id}
                  className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="algorithms-section">
            <h3>Algoritmalar</h3>
            <ul className="algorithm-list">
              {filteredAlgorithms.map((algorithm) => (
                <li 
                  key={algorithm.id}
                  className={`algorithm-item ${selectedAlgorithm === algorithm.id ? 'active' : ''}`}
                  onClick={() => handleAlgorithmSelect(algorithm.id)}
                >
                  {algorithm.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="visualization-main">
          {selectedAlgorithm ? (
            <div className="visualization-container">
              {renderVisualizationComponent()}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Algoritmayı Seçin</h3>
              <p>Görselleştirmek istediğiniz algoritmayı sol menüden seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizationPage; 