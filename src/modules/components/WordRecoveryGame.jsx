import { useEffect, useState } from "react";
import PropTypes from "prop-types";

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
    // Split the text by "___"
    const parts = text.split("___");
    
    return (
      <div 
        style={{ 
          fontSize: "1.4rem", 
          lineHeight: "2", 
          color: "#e6f7ff", 
          textAlign: "center",
          fontWeight: "500",
          margin: "20px 0"
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
                    borderBottom: isEmpty ? "2px dashed #ffd166" : "2px solid #2ec4b6",
                    background: isEmpty ? "rgba(255, 209, 102, 0.08)" : "rgba(46, 196, 182, 0.15)",
                    color: isEmpty ? "#ffd166" : "#b8fff9",
                    padding: "4px 12px",
                    borderRadius: 6,
                    margin: "0 8px",
                    fontWeight: "700",
                    display: "inline-block",
                    minWidth: 60,
                    textAlign: "center",
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
    <div className="auth-card panel-large animate-fadeIn" style={{ maxWidth: 700 }}>
      <div className="panel-title-row" style={{ marginBottom: 20 }}>
        <div>
          <span className="dashboard-kicker">Actividad 3: Recuperación de Palabras (Vocabulario)</span>
          <h2>{activity.title}</h2>
        </div>
        <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 12px" }}>
          Cerrar X
        </button>
      </div>

      {currentQuestion ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.9rem", marginBottom: 15 }}>
            <span>Nivel de Combustible: {currentQIndex + 1} de {questions.length}</span>
            <span>Estabilidad del Reactor: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 15, fontSize: "1.1rem" }}>
            Instrucciones: Selecciona la combinación de palabras correcta para rellenar los espacios en blanco y recargar la energía de la nave.
          </h3>

          {/* Sentence Display Area */}
          <div 
            className="reactor-room" 
            style={{ 
              background: "rgba(0, 0, 0, 0.4)", 
              border: "1px solid rgba(184, 255, 249, 0.15)", 
              borderRadius: 15, 
              padding: "30px 20px", 
              minHeight: 140, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {renderSentenceWithBlanks(currentQuestion.text, filledWords)}
            
            {/* Visual Fuel Bar Indicator */}
            <div style={{ width: "80%", height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 5, marginTop: 20, overflow: "hidden" }}>
              <div 
                style={{ 
                  height: "100%", 
                  width: isSuccess ? "100%" : selectedOptionId ? "50%" : "10%",
                  background: isSuccess ? "#2ec4b6" : "#ffd166",
                  transition: "width 0.8s ease, background-color 0.4s ease"
                }} 
              />
            </div>
          </div>

          {/* Answer Combinations Grid */}
          <div style={{ marginTop: 25 }}>
            <h4 style={{ color: "#9be6df", marginBottom: 12, fontSize: "0.95rem" }}>Opciones de Combustible Disponibles:</h4>
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: 12 
              }}
            >
              {currentQuestion.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt)}
                    style={{
                      padding: "16px 20px",
                      borderRadius: 10,
                      border: isSelected 
                        ? "2px solid #2ec4b6" 
                        : "1px solid rgba(255, 255, 255, 0.15)",
                      background: isSelected 
                        ? "rgba(46, 196, 182, 0.15)" 
                        : "rgba(255, 255, 255, 0.04)",
                      color: isSelected ? "#b8fff9" : "#e6f7ff",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      margin: 0,
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
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
            <button 
              className="btn-create" 
              style={{ 
                width: "100%", 
                maxWidth: 300, 
                padding: 15,
                background: "linear-gradient(135deg, #2ec4b6, #26a399)",
                color: "#002427"
              }} 
              disabled={!selectedOptionId || isSuccess}
              onClick={handleVerify}
            >
              ⚡ ¡Cargar Celda de Energía!
            </button>
          </div>

          {isError && (
            <div style={{ marginTop: 15, color: "#ff6b6b", fontWeight: "bold", textAlign: "center" }} className="animate-shake">
              💥 ¡Inestabilidad en el núcleo! Combinación incorrecta.
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 15, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
              ✨ ¡Celda cargada con éxito! Energía del motor restaurada al 100%.
            </div>
          )}
        </div>
      ) : (
        <p>Cargando preguntas de Word Recovery...</p>
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
