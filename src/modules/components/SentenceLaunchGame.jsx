import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "../../styles/Panel.css";
import { soundFx } from "../utils/soundEffects";
import { API_BASE } from "../../config";
import { fetchWithAuth } from "../utils/apiClient";
import { CURRICULUM_VOCABULARY_DATA as VOCAB_BY_DAY } from "../constants/curriculumVocabulary";

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

  // Dynamic API vocabulary state
  const [fetchedVocab, setFetchedVocab] = useState([]);
  const [usedWordsHistory, setUsedWordsHistory] = useState(new Set());

  // Solution feedback evaluation state
  const [showSolution, setShowSolution] = useState(false);
  const [evalResults, setEvalResults] = useState({}); // { leftIdx: { userRightIdx, isCorrect, correctRightIdx } }

  const containerRef = useRef(null);
  const lastBuiltQIndexRef = useRef(-1);

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

  // Fetch expanded vocabulary from backend database API for the day
  useEffect(() => {
    let isMounted = true;
    const dayNum = activity?.dayNumber || activity?.day || activity?.day_num || 1;
    fetchWithAuth(`${API_BASE}/daily-vocabulary/?day=${dayNum}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => ({ en: item.word_en, es: item.word_es }));
          setFetchedVocab(mapped);
        }
      })
      .catch(err => {
        console.warn("Could not fetch remote daily vocabulary, using comprehensive offline pool:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [activity?.dayNumber, activity?.day, activity?.day_num]);

  // Build English <-> Spanish vocabulary wire pairs for current round (100% randomized per student/attempt)
  useEffect(() => {
    // CRITICAL: Prevent re-running and wiping connections when parent re-renders!
    if (lastBuiltQIndexRef.current === currentQIndex && leftNodes.length > 0) {
      return;
    }
    lastBuiltQIndexRef.current = currentQIndex;

    const dayNum = activity?.dayNumber || activity?.day || activity?.day_num || 1;
    const fullPool = fetchedVocab.length > 0 ? fetchedVocab : (VOCAB_BY_DAY[dayNum] || VOCAB_BY_DAY[1]);

    // Exclude words already used in prior rounds of this session to ensure variety
    let candidatePool = fullPool.filter(w => !usedWordsHistory.has(w.en.toLowerCase()));
    if (candidatePool.length < 4) {
      // If pool is exhausted across multiple rounds, reset history
      candidatePool = fullPool;
      setUsedWordsHistory(new Set());
    }

    // Pick 4 random pairs from available pool
    const shuffledPool = shuffle(candidatePool);
    const roundPairs = shuffledPool.slice(0, 4);

    // Record used words
    setUsedWordsHistory(prev => {
      const next = new Set(prev);
      roundPairs.forEach(p => next.add(p.en.toLowerCase()));
      return next;
    });

    const { leftNodes: lNodes, rightNodes: rNodes } = createGameNodes(roundPairs);

    setLeftNodes(lNodes);
    setRightNodes(rNodes);
    setConnections({});
    setSelectedLeft(null);
    setIsError(false);
    setIsSuccess(false);
    setShowSolution(false);
    setEvalResults({});
  }, [currentQIndex, activity?.dayNumber, activity?.day, activity?.day_num]);

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
    <div
      className="glass-console auth-card panel-large animate-fadeIn"
      style={{
        maxWidth: 740,
        width: "100%",
        padding: "clamp(8px, 1.8vh, 16px) clamp(10px, 2vw, 18px)",
        position: "relative",
        margin: "0 auto",
        boxSizing: "border-box"
      }}
    >
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "clamp(6px, 1.2vh, 10px)", borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: "clamp(4px, 1vh, 8px)" }}>
          <div style={{ textAlign: "left" }}>
            <span className="dashboard-kicker" style={{ color: "#ffd166", textTransform: "uppercase", fontSize: "clamp(0.7rem, 1.4vh, 0.78rem)", fontWeight: "bold" }}>
              Stage 2: Grammar - Sentence Launch
            </span>
            <h2 style={{ margin: "2px 0 0 0", color: "#b8fff9", fontSize: "clamp(1.1rem, 2.2vh, 1.35rem)" }}>{activity?.title || "Sentence Launch & Grammar"}</h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "4px 12px", fontSize: "0.82rem" }}>
            Close ✕
          </button>
        </div>
      )}

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "clamp(0.72rem, 1.4vh, 0.82rem)", marginBottom: "clamp(4px, 1vh, 8px)" }}>
          <span>Power Relays: {currentQIndex + 1} of {questions.length}</span>
          <span>Energy Restored: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
        </div>

        <h3 style={{ color: "#ffd166", marginBottom: "clamp(6px, 1.2vh, 10px)", fontSize: "clamp(0.78rem, 1.6vh, 0.92rem)", textAlign: "left", lineHeight: "1.3" }}>
          ⚡ Instructions / Instrucciones: Une los cables de cada palabra en Inglés (izquierda) con su significado correcto en Español (derecha) para restablecer la corriente del cohete.
        </h3>

        {/* Wire Deck Area */}
        <div
          id="wire-canvas-container"
          ref={containerRef}
          className="wire-minigame-deck"
          style={{ maxWidth: "480px", margin: "6px auto" }}
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
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y}, ${(start.x + end.x) / 2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="#000"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y}, ${(start.x + end.x) / 2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={wireColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      opacity="0.45"
                      style={{ filter: `blur(4px)` }}
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y}, ${(start.x + end.x) / 2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke={wireColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y}, ${(start.x + end.x) / 2} ${end.y}, ${end.x} ${end.y}`}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="8,12"
                    />
                    <path
                      d={`M ${start.x} ${start.y} C ${(start.x + end.x) / 2} ${start.y}, ${(start.x + end.x) / 2} ${end.y}, ${end.x} ${end.y}`}
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
                          d={`M ${start.x} ${start.y} C ${(start.x + userEnd.x) / 2} ${start.y}, ${(start.x + userEnd.x) / 2} ${userEnd.y}, ${userEnd.x} ${userEnd.y}`}
                          fill="none"
                          stroke={res.isCorrect ? "#2ec4b6" : "#ef4444"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          opacity="0.85"
                          style={{ filter: `drop-shadow(0 0 8px ${res.isCorrect ? "#2ec4b6" : "#ef4444"})` }}
                        />
                        <path
                          d={`M ${start.x} ${start.y} C ${(start.x + userEnd.x) / 2} ${start.y}, ${(start.x + userEnd.x) / 2} ${userEnd.y}, ${userEnd.x} ${userEnd.y}`}
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
                        d={`M ${start.x} ${start.y} C ${(start.x + correctEnd.x) / 2} ${start.y}, ${(start.x + correctEnd.x) / 2} ${correctEnd.y}, ${correctEnd.x} ${correctEnd.y}`}
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
                    {node.text}
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
                    {node.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Normal Action buttons */}
        {!showSolution && (
          <div style={{ display: "flex", gap: "clamp(8px, 1.5vw, 15px)", marginTop: "clamp(6px, 1.4vh, 12px)" }}>
            <button
              className="btn-cancel"
              style={{ flex: 1, margin: 0, padding: "clamp(7px, 1.4vh, 10px) clamp(10px, 1.8vw, 16px)", fontSize: "clamp(0.82rem, 1.6vh, 0.95rem)", borderRadius: 10 }}
              onClick={() => setConnections({})}
              disabled={Object.keys(connections).length === 0 || isSuccess}
            >
              🔄 Limpiar Cables
            </button>
            <button
              className="btn-create"
              style={{ flex: 2, background: "linear-gradient(135deg, #2ec4b6, #26a399)", color: "#002427", margin: 0, padding: "clamp(7px, 1.4vh, 10px) clamp(10px, 1.8vw, 16px)", fontSize: "clamp(0.85rem, 1.6vh, 0.98rem)", fontWeight: "900", borderRadius: 10 }}
              onClick={handleVerify}
              disabled={Object.keys(connections).length !== leftNodes.length || isSuccess}
            >
              ⚡ Conectar Energía
            </button>
          </div>
        )}

        {/* Feedback Mode Panel with Manual Student Control Button */}
        {showSolution && (
          <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1.5px solid #ef4444", borderRadius: "14px", padding: "clamp(10px, 2vh, 16px)", marginTop: "clamp(8px, 1.5vh, 14px)", textAlign: "center" }} className="animate-fadeIn">
            <div style={{ color: "#ef4444", fontWeight: "900", fontSize: "clamp(0.95rem, 1.8vh, 1.1rem)", marginBottom: "4px" }}>
              💥 ¡CONEXIÓN INCORRECTA REGISTRADA! (-0.75 pts)
            </div>
            <p style={{ color: "#e6f7ff", fontSize: "clamp(0.78rem, 1.5vh, 0.88rem)", margin: "0 0 clamp(8px, 1.5vh, 12px) 0", lineHeight: "1.4" }}>
              Las conexiones en <strong style={{ color: "#ef4444" }}>rojo (❌)</strong> representan tu intento incorrecto. Las líneas punteadas en <strong style={{ color: "#10b981" }}>verde (✔️)</strong> indican la traducción correcta. Tómate el tiempo necesario para revisarlas.
            </p>
            <button
              onClick={handleNextRound}
              style={{
                padding: "clamp(8px, 1.6vh, 12px) clamp(16px, 3vw, 28px)",
                background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#0d1b2a",
                fontWeight: "900",
                fontSize: "clamp(0.85rem, 1.7vh, 1rem)",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(255, 209, 102, 0.5)",
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
