import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "../../styles/Panel.css";
import { soundFx } from "../utils/soundEffects";

// Vocabulary Dictionary by Day
const VOCAB_BY_DAY = {
  1: [
    { en: "spaceship", es: "nave espacial" },
    { en: "planet", es: "planeta" },
    { en: "crew", es: "tripulación" },
    { en: "name", es: "nombre" },
    { en: "country", es: "país" },
    { en: "skills", es: "habilidades" },
    { en: "favorite", es: "favorito" },
    { en: "fly", es: "volar" }
  ],
  2: [
    { en: "alien", es: "alienígena" },
    { en: "robot", es: "robot" },
    { en: "spacesuit", es: "traje espacial" },
    { en: "helmet", es: "casco" },
    { en: "computer", es: "computadora" },
    { en: "table", es: "mesa" },
    { en: "star", es: "estrella" },
    { en: "chair", es: "silla" }
  ],
  3: [
    { en: "wake up", es: "despertarse" },
    { en: "train", es: "entrenar" },
    { en: "study", es: "estudiar" },
    { en: "clean", es: "limpiar" },
    { en: "eat", es: "comer" },
    { en: "write", es: "escribir" },
    { en: "sleep", es: "dormir" },
    { en: "inspect", es: "inspeccionar" }
  ],
  4: [
    { en: "studying", es: "estudiando" },
    { en: "cleaning", es: "limpiando" },
    { en: "reading", es: "leyendo" },
    { en: "writing", es: "escribiendo" },
    { en: "eating", es: "comiendo" },
    { en: "talking", es: "conversando" },
    { en: "working", es: "trabajando" },
    { en: "repairing", es: "reparando" }
  ],
  5: [
    { en: "always", es: "siempre" },
    { en: "sometimes", es: "a veces" },
    { en: "never", es: "nunca" },
    { en: "help", es: "ayudar" },
    { en: "meet", es: "reunirse" },
    { en: "explore", es: "explorar" },
    { en: "schedule", es: "horario" },
    { en: "time", es: "tiempo" }
  ],
  6: [
    { en: "have", es: "tener" },
    { en: "has", es: "tener (él/ella)" },
    { en: "don't have", es: "no tener" },
    { en: "toolkit", es: "caja de herramientas" },
    { en: "oxygen tank", es: "tanque de oxígeno" },
    { en: "scanner", es: "escáner" },
    { en: "energy cell", es: "célula de energía" },
    { en: "key code", es: "código de acceso" }
  ],
  7: [
    { en: "what", es: "qué / cuál" },
    { en: "where", es: "dónde" },
    { en: "when", es: "cuándo" },
    { en: "who", es: "quién" },
    { en: "why", es: "por qué" },
    { en: "how", es: "cómo" },
    { en: "signal", es: "señal" },
    { en: "frequency", es: "frecuencia" }
  ],
  8: [
    { en: "my", es: "mi" },
    { en: "your", es: "tu" },
    { en: "his", es: "su (de él)" },
    { en: "her", es: "su (de ella)" },
    { en: "mine", es: "mío" },
    { en: "yours", es: "tuyo" },
    { en: "visor", es: "visor" },
    { en: "badge", es: "insignia" }
  ],
  9: [
    { en: "me", es: "mí / me" },
    { en: "him", es: "él / lo" },
    { en: "her", es: "ella / la" },
    { en: "us", es: "nosotros / nos" },
    { en: "them", es: "ellos / los" },
    { en: "transmission", es: "transmisión" },
    { en: "channel", es: "canal" },
    { en: "coordinates", es: "coordenadas" }
  ],
  10: [
    { en: "this", es: "este / esta" },
    { en: "that", es: "ese / esa" },
    { en: "these", es: "estos / estas" },
    { en: "those", es: "esos / esas" },
    { en: "shield", es: "escudo" },
    { en: "console", es: "consola" },
    { en: "controls", es: "controles" },
    { en: "deck", es: "cubierta" }
  ]
};

// Helper to shuffle an array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate vocabulary cable nodes ensuring NO straight-line matching horizontal pairs!
function createGameNodes(pairs) {
  const left = pairs.map((p, idx) => ({ id: idx, text: p.en, matchIndex: idx }));
  const right = pairs.map((p, idx) => ({ id: idx, text: p.es, matchIndex: idx }));

  let shuffledLeft = shuffle(left);
  let shuffledRight = shuffle(right);

  // Guarantee NO horizontal straight-line matches (derangement)!
  if (shuffledLeft.length > 1) {
    let attempts = 0;
    while (
      attempts < 40 &&
      shuffledRight.some((rItem, idx) => rItem.matchIndex === shuffledLeft[idx].matchIndex)
    ) {
      shuffledRight = shuffle(right);
      attempts++;
    }
  }

  return { leftNodes: shuffledLeft, rightNodes: shuffledRight };
}

export function SentenceLaunchGame({ activity, onComplete, onClose, hideHeader = false }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [leftNodes, setLeftNodes] = useState([]);
  const [rightNodes, setRightNodes] = useState([]);
  const [connections, setConnections] = useState({}); // { leftIndex: rightIndex }
  const [selectedLeft, setSelectedLeft] = useState(null); // left index
  
  const [portCoords, setPortCoords] = useState({}); // { portId: {x, y} }
  const [mistakes, setMistakes] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Solution feedback evaluation state
  const [showSolution, setShowSolution] = useState(false);
  const [evalResults, setEvalResults] = useState({}); // { leftIdx: { userRightIdx, isCorrect, correctRightIdx } }

  const containerRef = useRef(null);

  // Determine rounds/questions
  const questions = (activity?.questions && activity.questions.length > 0) ? activity.questions : [1, 2];

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

  // Build English <-> Spanish vocabulary wire pairs for current round (100% randomized per student/attempt)
  useEffect(() => {
    const dayNum = activity?.dayNumber || activity?.day || 1;
    const dayVocab = VOCAB_BY_DAY[dayNum] || VOCAB_BY_DAY[1];

    // Pick 4 random pairs from day's pool for this round
    const shuffledDayVocab = shuffle(dayVocab);
    const roundPairs = shuffledDayVocab.slice(0, 4);

    const { leftNodes: lNodes, rightNodes: rNodes } = createGameNodes(roundPairs);

    setLeftNodes(lNodes);
    setRightNodes(rNodes);
    setConnections({});
    setSelectedLeft(null);
    setIsError(false);
    setIsSuccess(false);
    setShowSolution(false);
    setEvalResults({});
  }, [currentQIndex, activity]);

  // Update port coordinates on render / window resize
  useEffect(() => {
    if (leftNodes.length > 0 && rightNodes.length > 0) {
      const timer = setTimeout(updateCoords, 150);
      window.addEventListener("resize", updateCoords);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateCoords);
      };
    }
  }, [leftNodes, rightNodes]);

  const handleLeftClick = (idx) => {
    if (isSuccess || showSolution) return;
    if (selectedLeft === idx) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(idx);
    }
  };

  const handleRightClick = (rightIdx) => {
    if (isSuccess || showSolution || selectedLeft === null) return;

    setConnections(prev => {
      const next = { ...prev };
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

  const handleVerify = () => {
    if (showSolution || isSuccess) return;

    if (Object.keys(connections).length !== leftNodes.length) {
      soundFx.playError();
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }

    // Detailed evaluation of each connection
    const results = {};
    let allCorrect = true;

    leftNodes.forEach((lNode, lIdx) => {
      const userRightIdx = connections[lIdx];
      const correctRightIdx = rightNodes.findIndex(rNode => rNode.matchIndex === lNode.matchIndex);
      const isCorrect = (userRightIdx !== undefined) && (rightNodes[userRightIdx]?.matchIndex === lNode.matchIndex);

      if (!isCorrect) allCorrect = false;

      results[lIdx] = {
        userRightIdx,
        correctRightIdx,
        isCorrect
      };
    });

    if (allCorrect) {
      soundFx.playLaser();
      soundFx.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        handleNextRound();
      }, 1500);
    } else {
      // 1-Attempt Incorrect: Record mistake, show red (wrong) vs green (correct) wire feedback
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      soundFx.playError();
      setIsError(true);
      setShowSolution(true);
      setEvalResults(results);
    }
  };

  const handleNextRound = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      soundFx.playCoin();
      soundFx.playStreakBonus();
      onComplete(15, 15, mistakes);
    }
  };

  return (
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 740, width: "100%", padding: "16px 20px", position: "relative", margin: "auto" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 10 }}>
          <div style={{ textAlign: "left" }}>
            <span className="dashboard-kicker" style={{ color: "#2ec4b6", textTransform: "uppercase", fontSize: "0.78rem", fontWeight: "bold" }}>
              Etapa 1: Cableado de Vocabulario Espacial
            </span>
            <h2 style={{ margin: "3px 0 0 0", color: "#b8fff9", fontSize: "1.4rem" }}>{activity?.title || "Reconexión de Energía Espacial"}</h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 14px" }}>
            Cerrar X
          </button>
        </div>
      )}

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.82rem", marginBottom: 10 }}>
          <span>Fusibles de Red: {currentQIndex + 1} de {questions.length}</span>
          <span>Energía Restablecida: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
        </div>

        <h3 style={{ color: "#ffd166", marginBottom: 10, fontSize: "0.95rem", textAlign: "left", lineHeight: "1.4" }}>
          ⚡ Instructions / Instrucciones: Une los cables de cada palabra en Inglés (izquierda) con su significado correcto en Español (derecha) para restablecer la corriente del cohete.
        </h3>

        {/* Wire Deck Area */}
        <div 
          id="wire-canvas-container" 
          ref={containerRef} 
          className="wire-minigame-deck"
          style={{ maxWidth: "480px", margin: "10px auto", padding: "12px 14px", minHeight: "210px" }}
        >
          {/* SVG Canvas to render cables */}
          <svg className="wire-svg-canvas">
            {!showSolution ? (
              /* Normal Gameplay Connections */
              Object.keys(connections).map((leftIdxStr) => {
                const leftIdx = Number(leftIdxStr);
                const rightIdx = connections[leftIdx];
                const start = portCoords[`left-${leftIdx}`];
                const end = portCoords[`right-${rightIdx}`];

                if (!start || !end) return null;

                const wireColor = colors[leftNodes[leftIdx].matchIndex % colors.length];

                return (
                  <g key={`wire-${leftIdx}`}>
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="#000"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={wireColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      opacity="0.45"
                      style={{ filter: `blur(4px)` }}
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={wireColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x)/2} ${start.y}, ${(start.x + end.x)/2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="8,12"
                    />
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
                    <circle cx={start.x} cy={start.y} r="8" fill="#ffd166">
                      <animate attributeName="r" values="4;9;4" dur="0.9s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.9s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={end.x} cy={end.y} r="8" fill="#2ec4b6">
                      <animate attributeName="r" values="4;9;4" dur="0.9s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.9s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })
            ) : (
              /* Solution Evaluation Mode: Render User Wires (Red for Wrong, Green for Right) + Solution Wires */
              leftNodes.map((lNode, lIdx) => {
                const res = evalResults[lIdx];
                if (!res) return null;

                const start = portCoords[`left-${lIdx}`];
                const userEnd = portCoords[`right-${res.userRightIdx}`];
                const correctEnd = portCoords[`right-${res.correctRightIdx}`];

                if (!start) return null;

                return (
                  <g key={`eval-group-${lIdx}`}>
                    {/* Render User Attempt Wire */}
                    {userEnd && (
                      <>
                        <path
                          d={`M ${start.x} ${start.y} C ${(start.x + userEnd.x)/2} ${start.y}, ${(start.x + userEnd.x)/2} ${userEnd.y}, ${userEnd.x} ${userEnd.y}`}
                          fill="none"
                          stroke={res.isCorrect ? "#2ec4b6" : "#ef4444"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          opacity="0.85"
                          style={{ filter: `drop-shadow(0 0 8px ${res.isCorrect ? "#2ec4b6" : "#ef4444"})` }}
                        />
                        <path
                          d={`M ${start.x} ${start.y} C ${(start.x + userEnd.x)/2} ${start.y}, ${(start.x + userEnd.x)/2} ${userEnd.y}, ${userEnd.x} ${userEnd.y}`}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="4,8"
                        />
                      </>
                    )}

                    {/* If Incorrect, Render Green Dashed Solution Wire */}
                    {!res.isCorrect && correctEnd && (
                      <path
                        d={`M ${start.x} ${start.y} C ${(start.x + correctEnd.x)/2} ${start.y}, ${(start.x + correctEnd.x)/2} ${correctEnd.y}, ${correctEnd.x} ${correctEnd.y}`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="6,8"
                        style={{ filter: "drop-shadow(0 0 10px #10b981)" }}
                      />
                    )}
                  </g>
                );
              })
            )}

            {/* Active drawing wire line */}
            {selectedLeft !== null && portCoords[`left-${selectedLeft}`] && (
              <line
                x1={portCoords[`left-${selectedLeft}`].x}
                y1={portCoords[`left-${selectedLeft}`].y}
                x2={portCoords[`left-${selectedLeft}`].x + 40}
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

          {/* Left Column Wires (English) */}
          <div className="wire-column">
            {leftNodes.map((node, idx) => {
              const isSelected = selectedLeft === idx;
              const isConnected = connections[idx] !== undefined;
              const evalItem = evalResults[idx];
              
              let wireColor = colors[node.matchIndex % colors.length];
              if (showSolution && evalItem) {
                wireColor = evalItem.isCorrect ? "#2ec4b6" : "#ef4444";
              }

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
                  <div className="wire-label" style={{ fontWeight: "bold", color: showSolution && evalItem && !evalItem.isCorrect ? "#fca5a5" : "#ffd166", fontSize: "1rem" }}>
                    🇬🇧 {node.text}
                    {showSolution && evalItem && (
                      <span style={{ marginLeft: "6px", fontSize: "0.85rem" }}>
                        {evalItem.isCorrect ? "✔️" : "❌"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column Terminals (Spanish) */}
          <div className="wire-column" style={{ alignItems: "flex-end" }}>
            {rightNodes.map((node, idx) => {
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
                  <div className="wire-label" style={{ textAlign: "right", fontWeight: "bold", color: "#9be6df", fontSize: "1rem" }}>
                    🇪🇸 {node.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Normal Action buttons */}
        {!showSolution && (
          <div style={{ display: "flex", gap: 15, marginTop: 14 }}>
            <button 
              className="btn-cancel" 
              style={{ flex: 1, margin: 0, padding: "10px 16px" }} 
              onClick={() => setConnections({})}
              disabled={Object.keys(connections).length === 0 || isSuccess}
            >
              🔄 Limpiar Cables
            </button>
            <button 
              className="btn-create" 
              style={{ flex: 2, background: "linear-gradient(135deg, #2ec4b6, #26a399)", color: "#002427", margin: 0, padding: "10px 16px" }} 
              onClick={handleVerify}
              disabled={Object.keys(connections).length !== leftNodes.length || isSuccess}
            >
              ⚡ Conectar Energía
            </button>
          </div>
        )}

        {/* Feedback Mode Panel with Manual Student Control Button */}
        {showSolution && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1.5px solid #ef4444", borderRadius: "16px", padding: "20px", marginTop: "20px", textAlign: "center" }} className="animate-fadeIn">
            <div style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.15rem", marginBottom: "6px" }}>
              💥 ¡CONEXIÓN INCORRECTA REGISTRADA! (-0.75 pts)
            </div>
            <p style={{ color: "#e6f7ff", fontSize: "0.95rem", margin: "0 0 16px 0", lineHeight: "1.5" }}>
              Las conexiones en <strong style={{ color: "#ef4444" }}>rojo (❌)</strong> representan tu intento incorrecto. Las líneas punteadas en <strong style={{ color: "#10b981" }}>verde (✔️)</strong> indican la traducción correcta. Tómate el tiempo necesario para revisarlas.
            </p>
            <button
              onClick={handleNextRound}
              style={{
                padding: "16px 36px",
                background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                border: "none",
                borderRadius: "14px",
                color: "#0d1b2a",
                fontWeight: "900",
                fontSize: "1.1rem",
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(255, 209, 102, 0.6)",
                transition: "all 0.2s ease"
              }}
            >
              💡 ENTENDIDO - CONTINUAR A LA SIGUIENTE RONDA ➔
            </button>
          </div>
        )}

        {isSuccess && (
          <div style={{ marginTop: 15, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
            ✨ ¡SISTEMA RESTABLECIDO! Todas las palabras están correctamente conectadas.
          </div>
        )}
      </div>
    </div>
  );
}

SentenceLaunchGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string,
    questions: PropTypes.array,
    dayNumber: PropTypes.number,
    day: PropTypes.number
  }),
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  hideHeader: PropTypes.bool
};
