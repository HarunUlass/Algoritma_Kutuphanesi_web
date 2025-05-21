import React, { useState, useEffect, useRef } from 'react';
import { AlgorithmInfoCard } from './VisualizationHelpers';
import '../styles/GraphVisualization.css';

// Graf görselleştirmesi için veri tipleri
interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
  color?: string;
  distance?: number; // Dijkstra için mesafe
}

interface Edge {
  source: number;
  target: number;
  weight: number;
  color?: string;
}

interface Graph {
  nodes: Node[];
  edges: Edge[];
}

interface GraphVisualizationProps {
  algorithmType: string;
  title: string;
  customGraph?: Graph;
  animationSpeed?: number;
}

// Sabitler
const DEFAULT_ANIMATION_SPEED = 1000; // ms
const NODE_RADIUS = 20;
const EDGE_WIDTH = 2;

// Örnek graf oluştur
const createExampleGraph = (): Graph => {
  const width = 600;
  const height = 300;
  
  // Düğümleri dengeli bir şekilde yerleştirme
  const nodes: Node[] = [
    { id: 0, x: width * 0.2, y: height * 0.3, label: 'A', distance: Infinity },
    { id: 1, x: width * 0.5, y: height * 0.2, label: 'B', distance: Infinity },
    { id: 2, x: width * 0.8, y: height * 0.3, label: 'C', distance: Infinity },
    { id: 3, x: width * 0.1, y: height * 0.6, label: 'D', distance: Infinity },
    { id: 4, x: width * 0.4, y: height * 0.7, label: 'E', distance: Infinity },
    { id: 5, x: width * 0.7, y: height * 0.6, label: 'F', distance: Infinity },
  ];
  
  // Kenarlar (ağırlıklı)
  const edges: Edge[] = [
    { source: 0, target: 1, weight: 4 },
    { source: 0, target: 3, weight: 2 },
    { source: 1, target: 2, weight: 3 },
    { source: 1, target: 4, weight: 3 },
    { source: 2, target: 5, weight: 2 },
    { source: 3, target: 4, weight: 6 },
    { source: 4, target: 5, weight: 1 },
  ];
  
  return { nodes, edges };
};

// Ana graf görselleştirme bileşeni
const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  algorithmType,
  title,
  customGraph,
  animationSpeed = DEFAULT_ANIMATION_SPEED,
}) => {
  const [graph, setGraph] = useState<Graph>(customGraph || createExampleGraph());
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(animationSpeed);
  const [explanationText, setExplanationText] = useState<string>('Görselleştirmeyi başlatmak için "Başlat" düğmesine tıklayın.');
  const [sourceNode, setSourceNode] = useState<number>(0); // Başlangıç düğümü seçimi

  // Renkler
  const normalNodeColor = '#6c5ce7';
  const startNodeColor = '#27ae60';
  const visitedNodeColor = '#3498db';
  const currentNodeColor = '#e74c3c';
  const shortestPathColor = '#f1c40f';
  
  const normalEdgeColor = '#95a5a6';
  const activeEdgeColor = '#e74c3c';
  const shortestPathEdgeColor = '#f1c40f';
  
  // Yeni bir graf oluştur
  const resetGraph = () => {
    if (processing) return;
    setGraph(createExampleGraph());
    setCurrentStep(0);
    setTotalSteps(0);
    setExplanationText('Görselleştirmeyi başlatmak için "Başlat" düğmesine tıklayın.');
  };
  
  // Bekleme yardımcı fonksiyonu
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Dijkstra algoritması animasyonu
  const visualizeDijkstra = async () => {
    if (processing) return;
    setProcessing(true);
    setCurrentStep(0);
    
    // Grafı kopyala
    const newGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    
    // Düğümleri sıfırla
    newGraph.nodes.forEach(node => {
      node.distance = Infinity;
      node.color = normalNodeColor;
    });
    
    // Kenarları sıfırla
    newGraph.edges.forEach(edge => {
      edge.color = normalEdgeColor;
    });
    
    // Başlangıç düğümünü ayarla
    newGraph.nodes[sourceNode].distance = 0;
    newGraph.nodes[sourceNode].color = startNodeColor;
    
    setGraph(newGraph);
    setExplanationText(`Dijkstra algoritması başlangıç düğümü: ${newGraph.nodes[sourceNode].label}`);
    await wait(speed);
    
    // Toplam adım sayısı (temsili)
    const steps = newGraph.nodes.length * 2;
    setTotalSteps(steps);
    
    // Dijkstra algoritması
    const distances: number[] = newGraph.nodes.map(node => node.distance || Infinity);
    const visited: boolean[] = Array(newGraph.nodes.length).fill(false);
    let stepCount = 0;
    
    for (let i = 0; i < newGraph.nodes.length; i++) {
      // En kısa mesafeli ziyaret edilmemiş düğümü bul
      let minDistance = Infinity;
      let minIndex = -1;
      
      for (let j = 0; j < distances.length; j++) {
        if (!visited[j] && distances[j] < minDistance) {
          minDistance = distances[j];
          minIndex = j;
        }
      }
      
      if (minIndex === -1) break; // Tüm erişilebilir düğümler ziyaret edildi
      
      stepCount++;
      setCurrentStep(stepCount);
      
      // Güncel düğümü vurgula
      const currentNode = newGraph.nodes[minIndex];
      currentNode.color = currentNodeColor;
      setGraph({...newGraph});
      
      setExplanationText(`Adım ${stepCount}: Düğüm ${currentNode.label} işleniyor, mesafe: ${currentNode.distance}`);
      await wait(speed);
      
      // Düğümü ziyaret edildi olarak işaretle
      visited[minIndex] = true;
      currentNode.color = visitedNodeColor;
      
      // Komşu düğümleri kontrol et
      const edges = newGraph.edges.filter(edge => edge.source === minIndex || edge.target === minIndex);
      
      for (const edge of edges) {
        const neighborIndex = edge.source === minIndex ? edge.target : edge.source;
        
        if (visited[neighborIndex]) continue;
        
        const neighborNode = newGraph.nodes[neighborIndex];
        
        // Kenarı vurgula
        edge.color = activeEdgeColor;
        setGraph({...newGraph});
        
        setExplanationText(`Düğüm ${currentNode.label}'den Düğüm ${neighborNode.label}'ye olan yol kontrol ediliyor`);
        await wait(speed / 2);
        
        // Mesafeyi güncelle
        const altDistance = distances[minIndex] + edge.weight;
        
        if (altDistance < distances[neighborIndex]) {
          distances[neighborIndex] = altDistance;
          neighborNode.distance = altDistance;
          
          setExplanationText(`Düğüm ${neighborNode.label}'nin mesafesi ${altDistance} olarak güncellendi`);
          await wait(speed / 2);
        }
        
        // Kenarı normal renge döndür
        edge.color = normalEdgeColor;
      }
      
      setGraph({...newGraph});
    }
    
    // En kısa yolları vurgula
    setExplanationText("Dijkstra algoritması tamamlandı. En kısa yollar belirlendi.");
    
    setProcessing(false);
  };
  
  // BFS algoritması animasyonu
  const visualizeBFS = async () => {
    if (processing) return;
    setProcessing(true);
    setCurrentStep(0);
    
    // Grafı kopyala
    const newGraph = JSON.parse(JSON.stringify(graph)) as Graph;
    
    // Düğümleri sıfırla
    newGraph.nodes.forEach(node => {
      node.color = normalNodeColor;
    });
    
    // Kenarları sıfırla
    newGraph.edges.forEach(edge => {
      edge.color = normalEdgeColor;
    });
    
    // Başlangıç düğümünü ayarla
    newGraph.nodes[sourceNode].color = startNodeColor;
    
    setGraph(newGraph);
    setExplanationText(`BFS algoritması başlangıç düğümü: ${newGraph.nodes[sourceNode].label}`);
    await wait(speed);
    
    // BFS algoritması
    const visited = Array(newGraph.nodes.length).fill(false);
    const queue: number[] = [sourceNode];
    visited[sourceNode] = true;
    
    let stepCount = 0;
    setTotalSteps(newGraph.nodes.length);
    
    while (queue.length > 0) {
      const currentNodeIndex = queue.shift()!;
      const currentNode = newGraph.nodes[currentNodeIndex];
      
      stepCount++;
      setCurrentStep(stepCount);
      
      // Şu anki düğümü vurgula
      currentNode.color = currentNodeColor;
      setGraph({...newGraph});
      
      setExplanationText(`Adım ${stepCount}: Düğüm ${currentNode.label} ziyaret ediliyor`);
      await wait(speed);
      
      // Komşu düğümleri kontrol et
      const edges = newGraph.edges.filter(edge => 
        edge.source === currentNodeIndex || edge.target === currentNodeIndex
      );
      
      for (const edge of edges) {
        const neighborIndex = edge.source === currentNodeIndex ? edge.target : edge.source;
        
        if (!visited[neighborIndex]) {
          // Komşu düğümü ziyaret et
          visited[neighborIndex] = true;
          queue.push(neighborIndex);
          
          // Kenarı vurgula
          edge.color = activeEdgeColor;
          newGraph.nodes[neighborIndex].color = visitedNodeColor;
          
          setGraph({...newGraph});
          setExplanationText(`Düğüm ${currentNode.label}'den komşu düğüm ${newGraph.nodes[neighborIndex].label} keşfedildi`);
          await wait(speed / 2);
        }
      }
      
      // İşlenen düğümü ziyaret edildi olarak işaretle
      currentNode.color = visitedNodeColor;
      setGraph({...newGraph});
      await wait(speed / 2);
    }
    
    setExplanationText("BFS algoritması tamamlandı. Tüm erişilebilir düğümler ziyaret edildi.");
    setProcessing(false);
  };
  
  // Görselleştirmeyi başlat
  const startVisualization = () => {
    if (processing) return;
    
    // Algoritma tipine göre uygun görselleştirmeyi seç
    switch (algorithmType.toLowerCase()) {
      case 'dijkstra':
        visualizeDijkstra();
        break;
      case 'bfs':
        visualizeBFS();
        break;
      default:
        setExplanationText(`${algorithmType} algoritması için görselleştirme henüz eklenmedi.`);
    }
  };
  
  // Başlangıç düğümünü değiştir
  const changeSourceNode = (nodeIndex: number) => {
    if (processing) return;
    setSourceNode(nodeIndex);
    
    // Tüm düğümleri normal renge döndür
    const newGraph = {...graph};
    newGraph.nodes.forEach(node => {
      node.color = normalNodeColor;
    });
    
    // Yeni başlangıç düğümünü vurgula
    newGraph.nodes[nodeIndex].color = startNodeColor;
    
    setGraph(newGraph);
    setExplanationText(`Başlangıç düğümü ${newGraph.nodes[nodeIndex].label} olarak ayarlandı`);
  };
  
  return (
    <div className="graph-visualization-container">
      <h2 className="visualization-title">{title} Görselleştirmesi</h2>
      
      <div className="controls-container">
        <button 
          className="control-button"
          onClick={resetGraph}
          disabled={processing}
        >
          Yeni Graf
        </button>
        <button 
          className="control-button primary"
          onClick={startVisualization}
          disabled={processing}
        >
          {processing ? 'Çalışıyor...' : 'Başlat'}
        </button>
        <div className="speed-control">
          <label htmlFor="graph-speed">Hız:</label>
          <input 
            id="graph-speed"
            type="range" 
            min="200" 
            max="2000" 
            step="200"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={processing}
          />
        </div>
      </div>
      
      <div className="source-node-selector">
        <span>Başlangıç Düğümü: </span>
        {graph.nodes.map((node) => (
          <button
            key={node.id}
            className={`node-button ${sourceNode === node.id ? 'active' : ''}`}
            onClick={() => changeSourceNode(node.id)}
            disabled={processing}
          >
            {node.label}
          </button>
        ))}
      </div>
      
      <div className="progress-container">
        <div className="progress-text">
          {processing ? `Adım ${currentStep}/${totalSteps || '?'}` : ''}
        </div>
        {processing && totalSteps > 0 && (
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
      
      <div className="graph-area">
        <svg width="100%" height="350" viewBox="0 0 600 350">
          {/* Kenarları çiz */}
          {graph.edges.map((edge, index) => {
            const sourceNode = graph.nodes[edge.source];
            const targetNode = graph.nodes[edge.target];
            
            // Kenarın orta noktası (ağırlığı göstermek için)
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;
            
            return (
              <g key={`edge-${index}`}>
                <line 
                  x1={sourceNode.x} 
                  y1={sourceNode.y} 
                  x2={targetNode.x} 
                  y2={targetNode.y}
                  stroke={edge.color || normalEdgeColor}
                  strokeWidth={EDGE_WIDTH}
                />
                <circle 
                  cx={midX} 
                  cy={midY} 
                  r={12} 
                  fill="white" 
                  stroke={edge.color || normalEdgeColor}
                />
                <text 
                  x={midX} 
                  y={midY} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fontSize="12"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
          
          {/* Düğümleri çiz */}
          {graph.nodes.map((node) => (
            <g key={`node-${node.id}`}>
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={NODE_RADIUS}
                fill={node.color || normalNodeColor}
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
                {node.label}
              </text>
              {node.distance !== undefined && node.distance !== Infinity && (
                <text 
                  x={node.x} 
                  y={node.y + NODE_RADIUS + 15}
                  textAnchor="middle"
                  fontSize="12"
                >
                  {node.distance}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      
      <div className="info-section">
        <AlgorithmInfoCard algorithmType={algorithmType} />
      </div>
    </div>
  );
};

export default GraphVisualization; 