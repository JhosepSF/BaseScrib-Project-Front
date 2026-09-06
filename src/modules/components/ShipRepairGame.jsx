import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
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

export function ShipRepairGame({ activity, onComplete, onClose, hideHeader = false }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  // Word-Pill Assembly State
  const [availableWords, setAvailableWords] = useState([]);
  const [assembledWords, setAssembledWords] = useState([]);
  const [targetSentence, setTargetSentence] = useState("");

  // Shuffled Multiple Choice Fallback Options
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const questions = activity.questions || [];
  const currentQuestion = questions[currentQIndex];

  // Helper to extract scrambled words from question text or target correct option
  useEffect(() => {
    setIsError(false);
    setIsSuccess(false);
    setSelectedOptionId(null);
    setAssembledWords([]);

    if (!currentQuestion) return;

    // Shuffle options so correct answer is NEVER locked to index 0 / left side!
    if (currentQuestion.options && currentQuestion.options.length > 0) {
      setShuffledOptions(shuffle(currentQuestion.options));
    } else {
      setShuffledOptions([]);
    }

    // Find correct target sentence
    const correctOpt = currentQuestion.options?.find(o => o.is_correct) || currentQuestion.options?.[0];
    const targetText = correctOpt ? correctOpt.text : currentQuestion.text;
    setTargetSentence(targetText);

    // Extract scrambled words if prompt contains "Arrange: ..." or from target sentence
    let wordsToScramble = [];
    const arrangeMatch = currentQuestion.text?.match(/Arrange:\s*([^\n\r]+)/i);
    if (arrangeMatch) {
      wordsToScramble = arrangeMatch[1].split("/").map(w => w.trim()).filter(Boolean);
    } else if (targetText) {
      wordsToScramble = targetText.split(" ").map(w => w.trim()).filter(Boolean);
    }

    if (wordsToScramble.length > 1) {
      // Create word pills with unique IDs for bank
      const pills = wordsToScramble.map((word, idx) => ({ id: `${idx}-${word}`, word }));
      setAvailableWords(shuffle(pills));
    } else {
      setAvailableWords([]);
    }
  }, [currentQIndex, activity, currentQuestion]);

  // Click word pill in bank to add to sentence
  const handleAddWord = (pill) => {
    if (isSuccess) return;
    setAvailableWords(prev => prev.filter(p => p.id !== pill.id));
    setAssembledWords(prev => [...prev, pill]);
    setIsError(false);
  };

  // Click word pill in assembled area to return to bank
  const handleRemoveWord = (pill) => {
    if (isSuccess) return;
    setAssembledWords(prev => prev.filter(p => p.id !== pill.id));
    setAvailableWords(prev => [...prev, pill]);
    setIsError(false);
  };

  // Reset assembled sentence
  const handleResetWords = () => {
    if (isSuccess) return;
    const all = [...availableWords, ...assembledWords];
    setAvailableWords(shuffle(all));
    setAssembledWords([]);
    setIsError(false);
  };

  const handleOptionSelect = (optionId) => {
    if (isSuccess) return;
    setSelectedOptionId(optionId);
    setIsError(false);
  };

  const handleVerify = () => {
    if (!currentQuestion) return;

    let isCorrectAnswer = false;

    if (availableWords.length > 0 || assembledWords.length > 0) {
      // Verify word pill assembly
      const builtStr = assembledWords.map(p => p.word).join(" ").toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      const targetStr = targetSentence.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      
      if (builtStr === targetStr) {
        isCorrectAnswer = true;
      }
    } else if (selectedOptionId) {
      // Verify multiple choice option
      const selectedOption = currentQuestion.options?.find(o => o.id === selectedOptionId);
      if (selectedOption?.is_correct) {
        isCorrectAnswer = true;
      }
    }

    if (isCorrectAnswer) {
      soundFx.playLaser();
      soundFx.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
        } else {
          soundFx.playCoin();
          soundFx.playStreakBonus();
          onComplete(15, 15, mistakes);
        }
      }, 1500);
    } else {
      setMistakes((prev) => prev + 1);
      soundFx.playError();
      setIsError(true);
    }
  };

  // Extracts incorrect sentence from the question text (e.g. Find the error in: '...')
  const getIncorrectSentence = (text = "") => {
    const match = text.match(/'([^']+)'/);
    return match ? match[1] : text;
  };

  const isSentenceMode = availableWords.length > 0 || assembledWords.length > 0;

  return (
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 720, width: "100%", padding: "18px 22px", position: "relative", margin: "auto" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 15, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 10 }}>
          <div style={{ textAlign: "left" }}>
            <span className="dashboard-kicker" style={{ color: "#ff6b6b", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "bold" }}>
              Etapa 2: Vocabulario y Construcción de Oraciones
            </span>
            <h2 style={{ margin: "4px 0 0 0", color: "#b8fff9", fontSize: "1.4rem" }}>{activity?.title || "Reparación de Módulos"}</h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 14px" }}>
            Cerrar X
          </button>
        </div>
      )}

      {currentQuestion ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.82rem", marginBottom: 10 }}>
            <span>Sección de Escudos: {currentQIndex + 1} de {questions.length}</span>
            <span>Estabilidad de Escudo: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 12, fontSize: "0.98rem", textAlign: "left", lineHeight: "1.4" }}>
            ⚡ Instructions / Instrucciones: {isSentenceMode ? "Selecciona y ordena las palabras clave para construir la oración gramatical correcta." : "Selecciona el nodo con el diagnóstico de corrección gramatical adecuado."}
          </h3>

          {/* Shield Status Deck */}
          <div 
            className="repair-deck" 
            style={{ 
              background: "rgba(255, 107, 107, 0.04)", 
              border: isSuccess 
                ? "2px solid #2ec4b6" 
                : "2px solid rgba(255, 107, 107, 0.3)", 
              borderRadius: 14, 
              padding: "14px 18px", 
              minHeight: 110, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 8, right: 12, color: isSuccess ? "#2ec4b6" : "#ff6b6b", fontWeight: "bold", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              {isSuccess ? "✓ SHIELD STABLE" : "⚠️ SHIELD ANOMALY DETECTED"}
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
              <img 
                src={ReclutaPrincipal} 
                alt="Operador de Escudo" 
                className="floating-crewmate"
                style={{ 
                  width: "90px", 
                  height: "90px", 
                  filter: isSuccess 
                    ? "hue-rotate(85deg) saturate(1.6) drop-shadow(0 0 10px #2ec4b6)" 
                    : isError 
                      ? "hue-rotate(130deg) saturate(1.5) drop-shadow(0 0 10px #ff6b6b)" 
                      : "drop-shadow(0 0 8px rgba(0, 245, 255, 0.4))",
                  objectFit: "contain",
                  transition: "all 0.3s ease"
                }}
              />
            </div>

            <div style={{ fontSize: "1.15rem", color: isSuccess ? "#2ec4b6" : "#ff8787", fontWeight: "bold", letterSpacing: 0.5 }}>
              "{getIncorrectSentence(currentQuestion.text)}"
            </div>
          </div>

          {/* WORD ASSEMBLY GAME MODE */}
          {isSentenceMode ? (
            <div style={{ marginTop: 16, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h4 style={{ color: "#9be6df", margin: 0, fontSize: "0.9rem", fontWeight: "bold" }}>
                  🧩 Construye la Oración Correcta:
                </h4>
                {assembledWords.length > 0 && (
                  <button 
                    onClick={handleResetWords}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#ffd166", padding: "3px 10px", borderRadius: 8, fontSize: "0.75rem", cursor: "pointer" }}
                  >
                    🔄 Reiniciar
                  </button>
                )}
              </div>

              {/* Assembled Sentence Dropzone Box */}
              <div 
                style={{
                  minHeight: "55px",
                  background: "rgba(0, 0, 0, 0.45)",
                  border: isError ? "2px solid #ff6b6b" : isSuccess ? "2px solid #2ec4b6" : "2px dashed #2ec4b6",
                  borderRadius: 14,
                  padding: "10px 14px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignItems: "center",
                  boxShadow: "inset 0 0 15px rgba(0,0,0,0.5)"
                }}
              >
                {assembledWords.length === 0 ? (
                  <span style={{ color: "rgba(184, 255, 249, 0.5)", fontSize: "0.85rem", fontStyle: "italic" }}>
                    Haz clic en las palabras de abajo para armar la oración aquí...
                  </span>
                ) : (
                  assembledWords.map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => handleRemoveWord(pill)}
                      style={{
                        padding: "6px 14px",
                        background: "linear-gradient(135deg, #2ec4b6, #208b81)",
                        color: "#002427",
                        border: "none",
                        borderRadius: 10,
                        fontWeight: "900",
                        fontSize: "0.92rem",
                        cursor: "pointer",
                        boxShadow: "0 0 8px rgba(46, 196, 182, 0.4)"
                      }}
                      title="Haz clic para quitar palabra"
                    >
                      {pill.word} ✖
                    </button>
                  ))
                )}
              </div>

              {/* Available Words Bank */}
              <div style={{ marginTop: 12 }}>
                <span style={{ fontSize: "0.78rem", color: "#94a3b8", display: "block", marginBottom: 6, fontWeight: "bold" }}>
                  BANCO DE PALABRAS DISPONIBLES:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {availableWords.map((pill) => (
                    <button
                      key={pill.id}
                      onClick={() => handleAddWord(pill)}
                      style={{
                        padding: "7px 15px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1.5px solid #ffd166",
                        color: "#ffd166",
                        borderRadius: 10,
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      + {pill.word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* MULTIPLE CHOICE MODE WITH SHUFFLED OPTIONS */
            <div style={{ marginTop: 16, textAlign: "left" }}>
              <h4 style={{ color: "#9be6df", marginBottom: 10, fontSize: "0.88rem", fontWeight: "bold" }}>Nodos del Generador de Escudo:</h4>
              <div className="shield-hex-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                {shuffledOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isRepaired = isSuccess && opt.is_correct;
                  
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: isSelected ? "2px solid #b8fff9" : isRepaired ? "2px solid #2ec4b6" : "1.5px solid rgba(255, 255, 255, 0.15)",
                        background: isSelected ? "rgba(46, 196, 182, 0.2)" : isRepaired ? "rgba(46, 196, 182, 0.25)" : "rgba(0, 0, 0, 0.4)",
                        color: isSelected ? "#b8fff9" : "#e6f7ff",
                        fontSize: "0.88rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      🛠️ {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
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
              disabled={(isSentenceMode ? assembledWords.length === 0 : !selectedOptionId) || isSuccess}
              onClick={handleVerify}
            >
              🛡️ Calibrar Shield Node
            </button>
          </div>

          {isError && (
            <div style={{ marginTop: 12, color: "#ff6b6b", fontWeight: "bold", textAlign: "center", fontSize: "0.9rem" }} className="animate-shake">
              💥 ERROR DE RED: La ordenación de palabras es incorrecta. Inténtalo de nuevo.
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 12, color: "#2ec4b6", fontWeight: "bold", textAlign: "center", fontSize: "0.9rem" }}>
              ✨ CALIBRACIÓN COMPLETADA: Escudo de energía normalizado al 100%.
            </div>
          )}
        </div>
      ) : (
        <p>Cargando escudos...</p>
      )}
    </div>
  );
}

ShipRepairGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string,
    questions: PropTypes.array
  }),
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  hideHeader: PropTypes.bool
};
