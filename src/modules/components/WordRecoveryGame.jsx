import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import "../../styles/Panel.css";
import { soundFx } from "../utils/soundEffects";

// Helper to shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Curricular Recovery Questions for all 14 Days
const DEFAULT_RECOVERY_QUESTIONS = {
  1: [
    { id: "rq1-1", text: "Hello, I ___ a new recruit.", options: [{ id: "ro1-1", text: "am", is_correct: true }, { id: "ro1-2", text: "is", is_correct: false }, { id: "ro1-3", text: "are", is_correct: false }] },
    { id: "rq1-2", text: "He ___ 14 years old.", options: [{ id: "ro1-4", text: "is", is_correct: true }, { id: "ro1-5", text: "am", is_correct: false }, { id: "ro1-6", text: "are", is_correct: false }] },
    { id: "rq1-3", text: "We ___ ready for the mission.", options: [{ id: "ro1-7", text: "are", is_correct: true }, { id: "ro1-8", text: "is", is_correct: false }, { id: "ro1-9", text: "am", is_correct: false }] }
  ],
  2: [
    { id: "rq2-1", text: "This ___ our space cabin.", options: [{ id: "ro2-1", text: "is", is_correct: true }, { id: "ro2-2", text: "are", is_correct: false }, { id: "ro2-3", text: "am", is_correct: false }] },
    { id: "rq2-2", text: "The tools ___ inside the locker.", options: [{ id: "ro2-4", text: "are", is_correct: true }, { id: "ro2-5", text: "is", is_correct: false }, { id: "ro2-6", text: "am", is_correct: false }] }
  ],
  3: [
    { id: "rq3-1", text: "I always ___ breakfast at seven o'clock.", options: [{ id: "ro3-1", text: "eat", is_correct: true }, { id: "ro3-2", text: "eats", is_correct: false }, { id: "ro3-3", text: "eating", is_correct: false }] },
    { id: "rq3-2", text: "The captain ___ the daily report.", options: [{ id: "ro3-4", text: "writes", is_correct: true }, { id: "ro3-5", text: "write", is_correct: false }, { id: "ro3-6", text: "writing", is_correct: false }] }
  ],
  4: [
    { id: "rq4-1", text: "Dani ___ calibrating the stellar radar.", options: [{ id: "ro4-1", text: "is", is_correct: true }, { id: "ro4-2", text: "are", is_correct: false }, { id: "ro4-3", text: "am", is_correct: false }] },
    { id: "rq4-2", text: "The robots ___ repairing the engine.", options: [{ id: "ro4-4", text: "are", is_correct: true }, { id: "ro4-5", text: "is", is_correct: false }, { id: "ro4-6", text: "am", is_correct: false }] }
  ],
  5: [
    { id: "rq5-1", text: "You ___ wear a helmet in this zone.", options: [{ id: "ro5-1", text: "must", is_correct: true }, { id: "ro5-2", text: "can", is_correct: false }, { id: "ro5-3", text: "will", is_correct: false }] },
    { id: "rq5-2", text: "Recruits ___ not enter the reactor core.", options: [{ id: "ro5-4", text: "must", is_correct: true }, { id: "ro5-5", text: "have", is_correct: false }, { id: "ro5-6", text: "do", is_correct: false }] }
  ],
  6: [
    { id: "rq6-1", text: "Yesterday, we ___ a luminous asteroid.", options: [{ id: "ro6-1", text: "discovered", is_correct: true }, { id: "ro6-2", text: "discover", is_correct: false }, { id: "ro6-3", text: "discovers", is_correct: false }] },
    { id: "rq6-2", text: "The probe ___ safely on the rock.", options: [{ id: "ro6-4", text: "landed", is_correct: true }, { id: "ro6-5", text: "land", is_correct: false }, { id: "ro6-6", text: "landing", is_correct: false }] }
  ],
  7: [
    { id: "rq7-1", text: "We ___ a distress signal in Sector 4.", options: [{ id: "ro7-1", text: "heard", is_correct: true }, { id: "ro7-2", text: "hear", is_correct: false }, { id: "ro7-3", text: "hears", is_correct: false }] },
    { id: "rq7-2", text: "The commander ___ an urgent warning.", options: [{ id: "ro7-4", text: "sent", is_correct: true }, { id: "ro7-5", text: "send", is_correct: false }, { id: "ro7-6", text: "sending", is_correct: false }] }
  ],
  8: [
    { id: "rq8-1", text: "The ion engine is ___ than the rocket.", options: [{ id: "ro8-1", text: "faster", is_correct: true }, { id: "ro8-2", text: "fast", is_correct: false }, { id: "ro8-3", text: "fastest", is_correct: false }] },
    { id: "rq8-2", text: "Scribtonia has a ___ atmosphere than the Moon.", options: [{ id: "ro8-4", text: "denser", is_correct: true }, { id: "ro8-5", text: "dense", is_correct: false }, { id: "ro8-6", text: "densest", is_correct: false }] }
  ],
  9: [
    { id: "rq9-1", text: "Base ONE is the ___ advanced station.", options: [{ id: "ro9-1", text: "most", is_correct: true }, { id: "ro9-2", text: "more", is_correct: false }, { id: "ro9-3", text: "much", is_correct: false }] },
    { id: "rq9-2", text: "Nova Scrib is the ___ star in the sky.", options: [{ id: "ro9-4", text: "brightest", is_correct: true }, { id: "ro9-5", text: "brighter", is_correct: false }, { id: "ro9-6", text: "bright", is_correct: false }] }
  ],
  10: [
    { id: "rq10-1", text: "Tomorrow, the crew ___ through the nebula.", options: [{ id: "ro10-1", text: "will fly", is_correct: true }, { id: "ro10-2", text: "flew", is_correct: false }, { id: "ro10-3", text: "flies", is_correct: false }] },
    { id: "rq10-2", text: "The shuttle ___ docking at two o'clock.", options: [{ id: "ro10-4", text: "is", is_correct: true }, { id: "ro10-5", text: "are", is_correct: false }, { id: "ro10-6", text: "were", is_correct: false }] }
  ],
  11: [
    { id: "rq11-1", text: "If the shields fail, the hull ___ breach.", options: [{ id: "ro11-1", text: "will", is_correct: true }, { id: "ro11-2", text: "did", is_correct: false }, { id: "ro11-3", text: "was", is_correct: false }] },
    { id: "rq11-2", text: "If we follow protocol, we ___ stay safe.", options: [{ id: "ro11-4", text: "will", is_correct: true }, { id: "ro11-5", text: "did", is_correct: false }, { id: "ro11-6", text: "were", is_correct: false }] }
  ],
  12: [
    { id: "rq12-1", text: "The crew ___ already visited three stations.", options: [{ id: "ro12-1", text: "has", is_correct: true }, { id: "ro12-2", text: "have", is_correct: false }, { id: "ro12-3", text: "having", is_correct: false }] },
    { id: "rq12-2", text: "We ___ completed all planetary scans.", options: [{ id: "ro12-4", text: "have", is_correct: true }, { id: "ro12-5", text: "has", is_correct: false }, { id: "ro12-6", text: "having", is_correct: false }] }
  ],
  13: [
    { id: "rq13-1", text: "The signal was ___ by the base radar.", options: [{ id: "ro13-1", text: "detected", is_correct: true }, { id: "ro13-2", text: "detect", is_correct: false }, { id: "ro13-3", text: "detecting", is_correct: false }] },
    { id: "rq13-2", text: "Cosmic samples must be ___ in capsules.", options: [{ id: "ro13-4", text: "stored", is_correct: true }, { id: "ro13-5", text: "store", is_correct: false }, { id: "ro13-6", text: "storing", is_correct: false }] }
  ],
  14: [
    { id: "rq14-1", text: "We ___ graduated as space cadets today.", options: [{ id: "ro14-1", text: "have", is_correct: true }, { id: "ro14-2", text: "has", is_correct: false }, { id: "ro14-3", text: "having", is_correct: false }] },
    { id: "rq14-2", text: "Our team is ready ___ the deep cosmos.", options: [{ id: "ro14-4", text: "to explore", is_correct: true }, { id: "ro14-5", text: "explore", is_correct: false }, { id: "ro14-6", text: "explored", is_correct: false }] }
  ]
};

export function WordRecoveryGame({ activity, onComplete, onClose, hideHeader = false }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [filledWords, setFilledWords] = useState([]); // e.g. ["is", "is"]
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const dayNum = activity?.dayNumber || activity?.day_num || activity?.day || 1;
  const questions = (activity?.questions && activity.questions.length > 0)
    ? activity.questions
    : (DEFAULT_RECOVERY_QUESTIONS[dayNum] || DEFAULT_RECOVERY_QUESTIONS[1]);
  const currentQuestion = questions[currentQIndex];
  const lastQRef = useRef(null);

  useEffect(() => {
    const qKey = `${currentQIndex}-${currentQuestion?.id || currentQuestion?.text || 'def'}`;
    if (lastQRef.current === qKey && shuffledOptions.length > 0) return;
    lastQRef.current = qKey;

    setSelectedOptionId(null);
    setFilledWords([]);
    setIsError(false);
    setIsSuccess(false);
    setShowSolution(false);

    if (currentQuestion?.options && currentQuestion.options.length > 0) {
      setShuffledOptions(shuffle(currentQuestion.options));
    } else {
      setShuffledOptions([]);
    }
  }, [currentQIndex, currentQuestion?.id, currentQuestion?.text]);

  const handleOptionSelect = (option) => {
    if (isSuccess || showSolution) return;
    setSelectedOptionId(option.id);
    setIsError(false);
    setIsSuccess(false);

    // Split the option text by "/" to get the individual words for the blanks
    const parts = option.text.split(" / ").map(p => p.trim());
    setFilledWords(parts);
  };

  const handleVerify = () => {
    if (!currentQuestion || showSolution || isSuccess) return;
    const selectedOption = currentQuestion.options?.find(o => o.id === selectedOptionId);

    if (!selectedOption) return;

    if (selectedOption.is_correct) {
      soundFx.playLaser();
      soundFx.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
        } else {
          soundFx.playCoin();
          soundFx.playStreakBonus();
          onComplete(15, 15, mistakes); // 15 XP, 15 Coins, mistakes
        }
      }, 1500);
    } else {
      soundFx.playError();
      setMistakes((prev) => prev + 1);
      setIsError(true);
      setShowSolution(true);
    }
  };

  const handleNextAfterError = () => {
    setShowSolution(false);
    setIsError(false);
    setSelectedOptionId(null);
    setFilledWords([]);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      soundFx.playCoin();
      soundFx.playStreakBonus();
      onComplete(15, 15, mistakes);
    }
  };

  const correctOption = currentQuestion?.options?.find(o => o.is_correct);
  const selectedUserOption = currentQuestion?.options?.find(o => o.id === selectedOptionId);

  // Helper to render the sentence with highlighted blanks
  const renderSentenceWithBlanks = (text, filled) => {
    const parts = text.split("___");
    
    return (
      <div 
        style={{ 
          fontSize: "1.15rem", 
          lineHeight: "1.8", 
          color: "#e6f7ff", 
          textAlign: "center",
          fontWeight: "600",
          margin: "10px 0"
        }}
      >
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          const word = filled[index] || "____";
          const isEmpty = !filled[index];

          return (
            <span key={index}>
              {part}
              {!isLast && (
                <span 
                  style={{ 
                    borderBottom: isEmpty ? "2.5px dashed #ffd166" : showSolution ? "2.5px solid #ef4444" : "2.5px solid #2ec4b6",
                    background: isEmpty ? "rgba(255, 209, 102, 0.08)" : showSolution ? "rgba(239, 68, 68, 0.18)" : "rgba(46, 196, 182, 0.18)",
                    color: isEmpty ? "#ffd166" : showSolution ? "#fca5a5" : "#b8fff9",
                    padding: "3px 12px",
                    borderRadius: 6,
                    margin: "0 6px",
                    fontWeight: "800",
                    display: "inline-block",
                    minWidth: 60,
                    textAlign: "center",
                    boxShadow: isEmpty ? "none" : "0 0 10px rgba(46, 196, 182, 0.3)",
                    transition: "all 0.3s ease"
                  }}
                  className={isEmpty ? "pulse-blank" : ""}
                >
                  {word}
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 740, width: "100%", padding: "16px 20px", position: "relative", margin: "auto" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 10 }}>
          <div style={{ textAlign: "left" }}>
            <span className="dashboard-kicker" style={{ color: "#ffd166", textTransform: "uppercase", fontSize: "0.78rem", fontWeight: "bold" }}>
              Etapa 4: Escucha y Frecuencia (Celdas de Energía)
            </span>
            <h2 style={{ margin: "3px 0 0 0", color: "#b8fff9", fontSize: "1.35rem" }}>{activity?.title || "Recuperación de Frecuencia"}</h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 14px" }}>
            Cerrar X
          </button>
        </div>
      )}

      {currentQuestion ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.82rem", marginBottom: 10 }}>
            <span>Celda de Energía: {currentQIndex + 1} de {questions.length}</span>
            <span>Estabilidad de Combustión: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 10, fontSize: "0.95rem", textAlign: "left", lineHeight: "1.4" }}>
            Instrucciones: Selecciona la combinación de celdas de combustible correcta para estabilizar el reactor.
          </h3>

          {/* Reactor Chamber Visual Zone */}
          <div 
            className={`fuel-chamber ${selectedOptionId ? "fuel-slot-active" : ""}`}
            style={{ 
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              padding: "14px 18px",
              border: showSolution ? "2px solid #ef4444" : isSuccess ? "2px solid #2ec4b6" : "1.5px solid rgba(255, 209, 102, 0.3)",
              background: showSolution ? "rgba(239, 68, 68, 0.08)" : isSuccess ? "rgba(46, 196, 182, 0.08)" : "rgba(0, 0, 0, 0.4)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <img 
                src={ReclutaPrincipal} 
                alt="Operador de Combustible" 
                className="floating-crewmate"
                style={{ 
                  width: "90px", 
                  height: "90px", 
                  filter: isSuccess 
                    ? "hue-rotate(85deg) saturate(1.6) drop-shadow(0 0 8px #2ec4b6)" 
                    : showSolution 
                      ? "hue-rotate(130deg) saturate(1.5) drop-shadow(0 0 8px #ff6b6b)" 
                      : "drop-shadow(0 0 5px rgba(255, 209, 102, 0.45))",
                  objectFit: "contain",
                  transition: "all 0.3s ease"
                }}
              />
            </div>
            {renderSentenceWithBlanks(currentQuestion.text, filledWords)}
            
            {/* Visual Fuel Bar Indicator */}
            <div style={{ width: "80%", height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, marginTop: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", margin: "12px auto 0 auto" }}>
              <div 
                style={{ 
                  height: "100%", 
                  width: isSuccess ? "100%" : showSolution ? "20%" : selectedOptionId ? "60%" : "15%",
                  background: isSuccess 
                    ? "linear-gradient(90deg, #2ec4b6, #00ff87)" 
                    : showSolution 
                      ? "linear-gradient(90deg, #ef4444, #fca5a5)" 
                      : selectedOptionId 
                        ? "linear-gradient(90deg, #ffb84d, #ffd166)" 
                        : "linear-gradient(90deg, #ff6b6b, #ff8787)",
                  boxShadow: isSuccess ? "0 0 10px #00ff87" : "none",
                  transition: "width 0.8s ease, background-color 0.4s ease"
                }} 
              />
            </div>
            <span style={{ fontSize: "0.72rem", color: showSolution ? "#fca5a5" : "rgba(230, 247, 255, 0.5)", marginTop: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              {showSolution ? "💥 INCOMPATIBILIDAD DE CELDA REGISTRADA" : isSuccess ? "⚡ REACTOR ALIMENTADO 100%" : selectedOptionId ? "🔋 CELDA SELECCIONADA - LISTO PARA CARGAR" : "⚠️ ESPERANDO CELDA DE COMBUSTIBLE"}
            </span>
          </div>

          {/* Answer Combinations Grid */}
          <div style={{ marginTop: 14, textAlign: "left" }}>
            <h4 style={{ color: "#9be6df", marginBottom: 8, fontSize: "0.88rem", fontWeight: "bold" }}>Opciones de Combustible Disponibles:</h4>
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
                gap: 10 
              }}
            >
              {shuffledOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isRightOpt = showSolution && opt.is_correct;
                const isWrongOpt = showSolution && isSelected && !opt.is_correct;

                let borderStyle = "1.5px solid rgba(255, 255, 255, 0.15)";
                let bgStyle = "rgba(0, 0, 0, 0.4)";
                let colorStyle = "#e6f7ff";

                if (isRightOpt) {
                  borderStyle = "2px solid #2ec4b6";
                  bgStyle = "rgba(46, 196, 182, 0.25)";
                  colorStyle = "#b8fff9";
                } else if (isWrongOpt) {
                  borderStyle = "2px solid #ef4444";
                  bgStyle = "rgba(239, 68, 68, 0.25)";
                  colorStyle = "#fca5a5";
                } else if (isSelected) {
                  borderStyle = "2px solid #b8fff9";
                  bgStyle = "rgba(46, 196, 182, 0.2)";
                  colorStyle = "#b8fff9";
                }
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt)}
                    disabled={showSolution}
                    style={{
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: borderStyle,
                      background: bgStyle,
                      color: colorStyle,
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                      cursor: showSolution ? "default" : "pointer",
                      margin: 0,
                      boxShadow: isSelected ? "0 0 15px rgba(46, 196, 182, 0.25)" : "none",
                      transition: "all 0.2s ease",
                      textAlign: "center"
                    }}
                    className="reactor-cell-btn"
                  >
                    🔋 {opt.text}
                    {isRightOpt && <span style={{ display: "block", fontSize: "0.75rem", color: "#2ec4b6" }}>✔️ CORRECTO</span>}
                    {isWrongOpt && <span style={{ display: "block", fontSize: "0.75rem", color: "#ef4444" }}>❌ TU ELECCIÓN</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {!showSolution ? (
            /* Action buttons */
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <button 
                className="btn-create" 
                style={{ 
                  width: "100%", 
                  maxWidth: 320, 
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #ffd166, #ffb84d)",
                  color: "#1a1a00",
                  fontSize: "1rem",
                  fontWeight: "900",
                  margin: 0,
                  boxShadow: "0 0 15px rgba(255, 209, 102, 0.25)"
                }} 
                disabled={!selectedOptionId || isSuccess}
                onClick={handleVerify}
              >
                ⚡ ¡Inyectar Celda de Energía!
              </button>
            </div>
          ) : (
            /* EXPLICIT SOLUTION ERROR FEEDBACK PANEL WITH BUTTON */
            <div 
              style={{ 
                background: "rgba(239, 68, 68, 0.12)", 
                border: "1.5px solid #ef4444", 
                borderRadius: "14px", 
                padding: "14px 18px", 
                marginTop: "14px", 
                textAlign: "center" 
              }} 
              className="animate-fadeIn"
            >
              <div style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.05rem", marginBottom: "6px" }}>
                💥 ¡CELDA DE ENERGÍA INCOMPATIBLE! (-0.75 pts)
              </div>

              <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px 14px", borderRadius: 10, textAlign: "left", marginBottom: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#fca5a5", fontSize: "0.88rem", marginBottom: 4 }}>
                  ❌ <strong>Tu combinación elegida:</strong> {selectedUserOption?.text || "Incompleta"}
                </div>
                <div style={{ color: "#2ec4b6", fontSize: "0.92rem", fontWeight: "bold" }}>
                  ✔️ <strong>Combinación Correcta del Reactor:</strong> {correctOption?.text}
                </div>
              </div>

              <button
                onClick={handleNextAfterError}
                style={{
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#0d1b2a",
                  fontWeight: "900",
                  fontSize: "0.98rem",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255, 209, 102, 0.5)",
                  transition: "all 0.2s ease"
                }}
              >
                💡 ENTENDIDO - CONTINUAR A LA SIGUIENTE CELDA ➔
              </button>
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 10, color: "#2ec4b6", fontWeight: "bold", textAlign: "center", fontSize: "0.88rem" }}>
              ✨ ¡CELDA ACOPLADA! Energía inyectada con éxito.
            </div>
          )}
        </div>
      ) : (
        <p>Cargando celdas del reactor...</p>
      )}
    </div>
  );
}

WordRecoveryGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    questions: PropTypes.array
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  hideHeader: PropTypes.bool
};

