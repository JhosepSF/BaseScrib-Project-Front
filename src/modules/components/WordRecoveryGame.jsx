import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/recluta principal personaje solo.png";
import "../../styles/Panel.css";

export function WordRecoveryGame({ activity, onComplete, onClose }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [filledWords, setFilledWords] = useState([]); // e.g. ["is", "is"]
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const questions = activity.questions || [];

  useEffect(() => {
    setSelectedOptionId(null);
    setFilledWords([]);
    setIsError(false);
    setIsSuccess(false);
  }, [currentQIndex]);

  const handleOptionSelect = (option) => {
    if (isSuccess) return;
    setSelectedOptionId(option.id);
    setIsError(false);
    setIsSuccess(false);

    // Split the option text by "/" to get the individual words for the blanks
    const parts = option.text.split(" / ").map(p => p.trim());
    setFilledWords(parts);
  };

  const handleVerify = () => {
    const question = questions[currentQIndex];
    const selectedOption = question.options?.find(o => o.id === selectedOptionId);

    if (!selectedOption) return;

    if (selectedOption.is_correct) {
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
        setSelectedOptionId(null);
        setFilledWords([]);
      }, 1500);
    }
  };

  const currentQuestion = questions[currentQIndex];

  // Helper to render the sentence with highlighted blanks
  const renderSentenceWithBlanks = (text, filled) => {
    const parts = text.split("___");
    
    return (
      <div 
        style={{ 
          fontSize: "1.35rem", 
          lineHeight: "2.2", 
          color: "#e6f7ff", 
          textAlign: "center",
          fontWeight: "600",
          margin: "15px 0"
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
                    borderBottom: isEmpty ? "2.5px dashed #ffd166" : "2.5px solid #2ec4b6",
                    background: isEmpty ? "rgba(255, 209, 102, 0.08)" : "rgba(46, 196, 182, 0.18)",
                    color: isEmpty ? "#ffd166" : "#b8fff9",
                    padding: "4px 14px",
                    borderRadius: 6,
                    margin: "0 8px",
                    fontWeight: "800",
                    display: "inline-block",
                    minWidth: 70,
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
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 750, padding: 30, position: "relative" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 15 }}>
        <div style={{ textAlign: "left" }}>
          <span className="dashboard-kicker" style={{ color: "#ffd166", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "bold" }}>
            Misión 3: Cargar Reactor Principal (Vocabulario)
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
            <span>Celda de Energía: {currentQIndex + 1} de {questions.length}</span>
            <span>Estabilidad de Combustión: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 15, fontSize: "1.1rem", textAlign: "left" }}>
            Instrucciones: Selecciona la combinación de celdas de combustible correcta para estabilizar el reactor de la nave.
          </h3>

          {/* Reactor Chamber Visual Zone */}
          <div 
            className={`fuel-chamber ${selectedOptionId ? "fuel-slot-active" : ""}`}
            style={{ 
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              padding: "30px 20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 15 }}>
              <img 
                src={ReclutaPrincipal} 
                alt="Operador de Combustible" 
                className="floating-crewmate"
                style={{ 
                  width: "140px", 
                  height: "140px", 
                  filter: isSuccess 
                    ? "hue-rotate(85deg) saturate(1.6) drop-shadow(0 0 8px #2ec4b6)" 
                    : isError 
                      ? "hue-rotate(130deg) saturate(1.5) drop-shadow(0 0 8px #ff6b6b)" 
                      : "drop-shadow(0 0 5px rgba(255, 209, 102, 0.45))",
                  objectFit: "contain",
                  transition: "all 0.3s ease"
                }}
              />
            </div>
            {renderSentenceWithBlanks(currentQuestion.text, filledWords)}
            
            {/* Visual Fuel Bar Indicator */}
            <div style={{ width: "80%", height: 12, background: "rgba(255,255,255,0.08)", borderRadius: 6, marginTop: 25, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.1)" }}>
              <div 
                style={{ 
                  height: "100%", 
                  width: isSuccess ? "100%" : selectedOptionId ? "60%" : "15%",
                  background: isSuccess 
                    ? "linear-gradient(90deg, #2ec4b6, #00ff87)" 
                    : selectedOptionId 
                      ? "linear-gradient(90deg, #ffb84d, #ffd166)" 
                      : "linear-gradient(90deg, #ff6b6b, #ff8787)",
                  boxShadow: isSuccess ? "0 0 10px #00ff87" : "none",
                  transition: "width 0.8s ease, background-color 0.4s ease"
                }} 
              />
            </div>
            <span style={{ fontSize: "0.75rem", color: "rgba(230, 247, 255, 0.5)", marginTop: 10, textTransform: "uppercase", letterSpacing: "1px" }}>
              {isSuccess ? "⚡ REACTOR ALIMENTADO 100%" : selectedOptionId ? "🔋 CELDA SELECCIONADA - LISTO PARA CARGAR" : "⚠️ ESPERANDO CELDA DE COMBUSTIBLE"}
            </span>
          </div>

          {/* Answer Combinations Grid */}
          <div style={{ marginTop: 30, textAlign: "left" }}>
            <h4 style={{ color: "#9be6df", marginBottom: 12, fontSize: "0.95rem", fontWeight: "bold" }}>Opciones de Combustible Disponibles:</h4>
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: 15 
              }}
            >
              {currentQuestion.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt)}
                    style={{
                      padding: "18px 20px",
                      borderRadius: 10,
                      border: isSelected 
                        ? "2px solid #b8fff9" 
                        : "1.5px solid rgba(255, 255, 255, 0.15)",
                      background: isSelected 
                        ? "rgba(46, 196, 182, 0.2)" 
                        : "rgba(0, 0, 0, 0.4)",
                      color: isSelected ? "#b8fff9" : "#e6f7ff",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      margin: 0,
                      boxShadow: isSelected ? "0 0 15px rgba(46, 196, 182, 0.25)" : "none",
                      transition: "all 0.2s ease",
                      textAlign: "center"
                    }}
                    className="reactor-cell-btn"
                  >
                    🔋 {opt.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: 35, display: "flex", justifyContent: "center" }}>
            <button 
              className="btn-create" 
              style={{ 
                width: "100%", 
                maxWidth: 320, 
                padding: "16px 24px",
                background: "linear-gradient(135deg, #ffd166, #ffb84d)",
                color: "#1a1a00",
                fontSize: "1.05rem",
                fontWeight: "bold",
                margin: 0,
                boxShadow: "0 0 15px rgba(255, 209, 102, 0.25)"
              }} 
              disabled={!selectedOptionId || isSuccess}
              onClick={handleVerify}
            >
              ⚡ ¡Inyectar Celda de Energía!
            </button>
          </div>

          {isError && (
            <div style={{ marginTop: 20, color: "#ff6b6b", fontWeight: "bold", textAlign: "center" }} className="animate-shake">
              💥 ¡INCOMPATIBILIDAD DE COMBUSTIBLE! Inestabilidad detectada en el reactor.
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 20, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
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
  onClose: PropTypes.func.isRequired
};
