import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export function ShipRepairGame({ activity, onComplete, onClose }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const questions = activity.questions || [];

  useEffect(() => {
    setSelectedOptionId(null);
    setIsError(false);
    setIsSuccess(false);
  }, [currentQIndex]);

  const handleOptionSelect = (optionId) => {
    setSelectedOptionId(optionId);
    setIsError(false);
    setIsSuccess(false);
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
      }, 1500);
    }
  };

  const currentQuestion = questions[currentQIndex];

  // Extracts incorrect sentence from the question text (e.g. Find the error in: '...')
  const getIncorrectSentence = (text) => {
    const match = text.match(/'([^']+)'/);
    return match ? match[1] : text;
  };

  return (
    <div className="auth-card panel-large animate-fadeIn" style={{ maxWidth: 700 }}>
      <div className="panel-title-row" style={{ marginBottom: 20 }}>
        <div>
          <span className="dashboard-kicker">Actividad 4: Reparación del Casco (Detección de Errores)</span>
          <h2>{activity.title}</h2>
        </div>
        <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 12px" }}>
          Cerrar X
        </button>
      </div>

      {currentQuestion ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.9rem", marginBottom: 15 }}>
            <span>Sección del Casco: {currentQIndex + 1} de {questions.length}</span>
            <span>Integridad de Estructura: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 15, fontSize: "1.1rem" }}>
            Instrucciones: Se ha detectado una fuga de oxígeno debido a un error gramatical. Selecciona el diagnóstico correcto para reparar el casco.
          </h3>

          {/* Broken system dashboard */}
          <div 
            className="repair-deck" 
            style={{ 
              background: "rgba(255, 107, 107, 0.05)", 
              border: isSuccess 
                ? "2px solid #2ec4b6" 
                : "2px solid rgba(255, 107, 107, 0.3)", 
              borderRadius: 15, 
              padding: "25px 20px", 
              minHeight: 140, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Warning indicator */}
            <div style={{ position: "absolute", top: 10, right: 15, color: isSuccess ? "#2ec4b6" : "#ff6b6b", fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase" }}>
              {isSuccess ? "✓ Casco Sellado" : "⚠️ ERROR DE SISTEMA DETECTADO"}
            </div>

            <div style={{ fontSize: "1.5rem", color: "#ff8787", fontWeight: "bold", letterSpacing: 0.5, textDecoration: "line-through" }}>
              "{getIncorrectSentence(currentQuestion.text)}"
            </div>

            <div style={{ fontSize: "2.5rem", marginTop: 15 }} className={isSuccess ? "" : "animate-bounce"}>
              {isSuccess ? "🔧✨" : "🛠️🔧"}
            </div>
          </div>

          {/* Diagnostic choices */}
          <div style={{ marginTop: 25 }}>
            <h4 style={{ color: "#9be6df", marginBottom: 12, fontSize: "0.95rem" }}>Selecciona el Diagnóstico de Reparación:</h4>
            <div 
              style={{ 
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              {currentQuestion.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let borderStyle = "1px solid rgba(255, 255, 255, 0.15)";
                let bgStyle = "rgba(255, 255, 255, 0.04)";
                
                if (isSelected) {
                  borderStyle = "2px solid #ffd166";
                  bgStyle = "rgba(255, 209, 102, 0.15)";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    style={{
                      padding: "15px 20px",
                      borderRadius: 10,
                      border: borderStyle,
                      background: bgStyle,
                      color: isSelected ? "#ffd166" : "#e6f7ff",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      margin: 0,
                      transition: "all 0.2s ease",
                      textAlign: "left"
                    }}
                    className="repair-opt-btn"
                  >
                    🛠️ {opt.text}
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
                background: "linear-gradient(135deg, #ffd166, #ffb84d)",
                color: "#1a1a00"
              }} 
              disabled={!selectedOptionId || isSuccess}
              onClick={handleVerify}
            >
              🔧 Ejecutar Reparación
            </button>
          </div>

          {isError && (
            <div style={{ marginTop: 15, color: "#ff6b6b", fontWeight: "bold", textAlign: "center" }} className="animate-shake">
              💥 ¡Fallo de reparación! El diagnóstico seleccionado no solucionó la fuga.
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 15, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
              ✨ ¡Fuga sellada con éxito! Presión del casco normalizada.
            </div>
          )}
        </div>
      ) : (
        <p>Cargando preguntas de Ship Repair...</p>
      )}
    </div>
  );
}

ShipRepairGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    questions: PropTypes.array
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
