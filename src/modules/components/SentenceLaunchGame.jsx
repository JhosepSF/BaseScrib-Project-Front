import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "../../styles/Panel.css";

// Helper to shuffle an array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function SentenceLaunchGame({ activity, onComplete, onClose }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [connections, setConnections] = useState({}); // { leftIndex: rightIndex }
  const [selectedLeft, setSelectedLeft] = useState(null); // left index
  
  const [portCoords, setPortCoords] = useState({}); // { portId: {x, y} }
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const containerRef = useRef(null);
  const questions = activity.questions || [];

  // Wire Colors
  const colors = ["#ff6b6b", "#2ec4b6", "#ffd166", "#ab47bc", "#ff6b35", "#00ff87"];

  // Calculate coordinates of all ports
  const updateCoords = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newCoords = {};

    leftNodes.forEach((node, idx) => {
      const port = document.getElementById(`left-port-${idx}`);
      if (port) {
        const rect = port.getBoundingClientRect();
        newCoords[`left-${idx}`] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      }
    });

    rightNodes.forEach((node, idx) => {
      const port = document.getElementById(`right-port-${idx}`);
      if (port) {
        const rect = port.getBoundingClientRect();
        newCoords[`right-${idx}`] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      }
    });

    setPortCoords(newCoords);
  };

  // Build the wire connect pairs from the correct sentence option
  useEffect(() => {
    if (questions.length === 0 || !questions[currentQIndex]) return;

    const question = questions[currentQIndex];
    const correctOpt = question.options?.find(o => o.is_correct);
    if (!correctOpt) return;

    // Split sentence into words
    const sentence = correctOpt.text;
    const words = sentence.split(" ");

    // Generate matching sequential pairs (word_i -> word_i+1)
    const pairs = [];
    for (let i = 0; i < words.length - 1; i++) {
      pairs.push({
        leftText: words[i],
        rightText: words[i + 1],
        matchIndex: i // unique match identifier
      });
    }

    // Prepare left nodes
    const left = pairs.map((p, idx) => ({
      id: idx,
      text: p.leftText,
      matchIndex: p.matchIndex
    }));

    // Prepare right nodes
    const right = pairs.map((p, idx) => ({
      id: idx,
      text: p.rightText,
      matchIndex: p.matchIndex
    }));

    // Shuffle left and right independently
    const shuffledLeft = shuffle(left);
    const shuffledRight = shuffle(right);

    setLeftNodes(shuffledLeft);
    setRightNodes(shuffledRight);
    setConnections({});
    setSelectedLeft(null);
    setIsError(false);
    setIsSuccess(false);
  }, [currentQIndex, questions]);

  // Update port coordinates once nodes render or window resizes
  useEffect(() => {
    if (leftNodes.length > 0 && rightNodes.length > 0) {
      // Small timeout to allow DOM to compute layout
      const timer = setTimeout(updateCoords, 150);
      window.addEventListener("resize", updateCoords);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateCoords);
      };
    }
  }, [leftNodes, rightNodes]);

  // Click handler for port
  const handleLeftClick = (idx) => {
    if (isSuccess) return;
    
    // Toggle selection
    if (selectedLeft === idx) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(idx);
    }
  };

  const handleRightClick = (rightIdx) => {
    if (isSuccess || selectedLeft === null) return;

    // Connect selectedLeft to rightIdx
    setConnections(prev => {
      const next = { ...prev };
      
      // Remove any existing connection to this right port to enforce 1-to-1
      Object.keys(next).forEach(leftKey => {
        if (next[leftKey] === rightIdx) {
          delete next[leftKey];
        }
      });

      next[selectedLeft] = rightIdx;
      return next;
    });

    setSelectedLeft(null);
  };

  const handleDisconnect = (leftIdx) => {
    if (isSuccess) return;
    setConnections(prev => {
      const next = { ...prev };
      delete next[leftIdx];
      return next;
    });
  };

  const handleVerify = () => {
    // Check if all left nodes are connected
    if (Object.keys(connections).length !== leftNodes.length) {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }

    // Verify if each connection matches the correct sequence (same matchIndex)
    let allCorrect = true;
    Object.keys(connections).forEach(leftIdxStr => {
      const leftIdx = Number(leftIdxStr);
      const rightIdx = connections[leftIdx];
      
      const leftNode = leftNodes[leftIdx];
      const rightNode = rightNodes[rightIdx];

      if (leftNode.matchIndex !== rightNode.matchIndex) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setIsSuccess(true);
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
        } else {
          onComplete(10, 10); // 10 XP, 10 Coins
        }
      }, 1500);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setConnections({}); // Reset connections on error
      }, 1500);
    }
  };

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 750, padding: 30, position: "relative" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 15 }}>
        <div style={{ textAlign: "left" }}>
          <span className="dashboard-kicker" style={{ color: "#2ec4b6", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "bold" }}>
            Misión 2: Panel de Conexión Eléctrica (Cables)
          </span>
          <h2 style={{ margin: "5px 0 0 0", color: "#b8fff9", fontSize: "1.6rem" }}>{activity.title}</h2>
        </div>
        <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "8px 16px" }}>
          Cerrar X
        </button>
      </div>

      {currentQuestion ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.85rem", marginBottom: 15 }}>
            <span>Fusibles: {currentQIndex + 1} de {questions.length}</span>
            <span>Energía de Red: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 8, fontSize: "1.1rem", textAlign: "left" }}>
            Instrucciones: Une los cables en el orden gramatical correcto para restablecer la corriente del cohete.
          </h3>
          <p style={{ color: "rgba(230, 247, 255, 0.7)", fontSize: "0.95rem", marginBottom: 25, textAlign: "left" }}>
            {currentQuestion.text}
          </p>

          {/* Wire Deck Area */}
          <div 
            id="wire-canvas-container" 
            ref={containerRef} 
            className="wire-minigame-deck"
          >
            {/* SVG Canvas to render cables */}
            <svg className="wire-svg-canvas">
              {/* Render Established Connections */}
              {Object.keys(connections).map((leftIdxStr) => {
                const leftIdx = Number(leftIdxStr);
                const rightIdx = connections[leftIdx];
                const start = portCoords[`left-${leftIdx}`];
                const end = portCoords[`right-${rightIdx}`];

                if (!start || !end) return null;

                // Wire color based on matchIndex
                const color = colors[leftNodes[leftIdx].matchIndex % colors.length];

                return (
                  <g key={`wire-${leftIdx}`}>
                    {/* Cable Drop Shadow (3D effect) */}
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="#000"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                    {/* Cable Glow Filter */}
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      opacity="0.45"
                      style={{ filter: `blur(4px)` }}
                    />
                    {/* Primary insulated cable */}
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={color}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Cable Specular reflection highlight */}
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="8,12"
                    />
                    {/* Glowing Electric Flow Current Overlay */}
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="6,15"
                      className="electric-flow-line"
                      style={{ filter: "drop-shadow(0 0 3px #fff)" }}
                    />
                    {/* Glowing sparks at left socket */}
                    <circle cx={start.x} cy={start.y} r="8" fill="#ffd166">
                      <animate attributeName="r" values="4;9;4" dur="0.9s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.9s" repeatCount="indefinite" />
                    </circle>
                    {/* Glowing sparks at right socket */}
                    <circle cx={end.x} cy={end.y} r="8" fill="#2ec4b6">
                      <animate attributeName="r" values="4;9;4" dur="0.9s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.9s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}

              {/* Render active connection being drawn */}
              {selectedLeft !== null && portCoords[`left-${selectedLeft}`] && (
                <line
                  x1={portCoords[`left-${selectedLeft}`].x}
                  y1={portCoords[`left-${selectedLeft}`].y}
                  x2={portCoords[`left-${selectedLeft}`].x + 40} // temporary indicator direction
                  y2={portCoords[`left-${selectedLeft}`].y}
                  stroke="#fff"
                  strokeWidth="3.5"
                  strokeDasharray="6,6"
                  className="electric-flow-line"
                  style={{ filter: "drop-shadow(0 0 5px #ffd166)" }}
                  opacity="0.85"
                />
              )}
            </svg>

            {/* Left Column Wires */}
            <div className="wire-column">
              {leftNodes.map((node, idx) => {
                const isSelected = selectedLeft === idx;
                const isConnected = connections[idx] !== undefined;
                const wireColor = colors[node.matchIndex % colors.length];

                return (
                  <div className="wire-node" key={`left-node-${idx}`}>
                    <div 
                      id={`left-port-${idx}`}
                      className={`wire-port ${isConnected ? "connected" : ""} ${isSelected ? "selected-port-spark" : ""}`}
                      onClick={() => handleLeftClick(idx)}
                      style={{
                        backgroundColor: isSelected ? "#fff" : wireColor,
                        boxShadow: isSelected ? `0 0 15px #fff` : `0 0 8px ${wireColor}`,
                        border: isSelected ? "3px solid #000" : "4px solid #000"
                      }}
                    />
                    <div className="wire-label">
                      {node.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column Terminals */}
            <div className="wire-column" style={{ alignItems: "flex-end" }}>
              {rightNodes.map((node, idx) => {
                // Check if any left node is connected to this right node
                const connectedLeftKey = Object.keys(connections).find(key => connections[key] === idx);
                const isConnected = connectedLeftKey !== undefined;
                const wireColor = isConnected ? colors[leftNodes[Number(connectedLeftKey)].matchIndex % colors.length] : "#141f32";

                return (
                  <div className="wire-node" key={`right-node-${idx}`} style={{ flexDirection: "row-reverse" }}>
                    <div 
                      id={`right-port-${idx}`}
                      className={`wire-port ${isConnected ? "connected" : ""}`}
                      onClick={() => handleRightClick(idx)}
                      style={{
                        backgroundColor: wireColor,
                        boxShadow: isConnected ? `0 0 12px ${wireColor}` : "none",
                        border: "4px solid #000"
                      }}
                    />
                    <div className="wire-label" style={{ textAlign: "right" }}>
                      {node.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 15, marginTop: 30 }}>
            <button 
              className="btn-cancel" 
              style={{ flex: 1, margin: 0 }} 
              onClick={() => setConnections({})}
              disabled={Object.keys(connections).length === 0 || isSuccess}
            >
              🔄 Limpiar Cables
            </button>
            <button 
              className="btn-create" 
              style={{ flex: 2, background: "linear-gradient(135deg, #2ec4b6, #26a399)", color: "#002427", margin: 0 }} 
              onClick={handleVerify}
              disabled={Object.keys(connections).length !== leftNodes.length || isSuccess}
            >
              ⚡ Conectar Energía
            </button>
          </div>

          {isError && (
            <div style={{ marginTop: 20, color: "#ff6b6b", fontWeight: "bold", textAlign: "center" }} className="animate-shake">
              💥 ¡CORTOCIRCUITO! Una o más conexiones son incorrectas.
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 20, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
              ✨ ¡SISTEMA RESTABLECIDO! Energía eléctrica normalizada.
            </div>
          )}
        </div>
      ) : (
        <p>Cargando cables de Sentence Launch...</p>
      )}
    </div>
  );
}

SentenceLaunchGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    questions: PropTypes.array
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
