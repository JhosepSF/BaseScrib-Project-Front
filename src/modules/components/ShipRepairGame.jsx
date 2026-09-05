import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import "../../styles/Panel.css";

export function ShipRepairGame({ activity, onComplete, onClose }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const questions = activity.questions || [];

  useEffect(() => {
    setSelectedOptionId(null);
    setIsError(false);
    setIsSuccess(false);
  }, [currentQIndex]);

  const handleOptionSelect = (optionId) => {
    if (isSuccess) return;
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
          onComplete(15, 15, mistakes); // 15 XP, 15 Coins, mistakes
        }
      }, 1500);
    } else {
      setMistakes((prev) => prev + 1);
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
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 750, padding: 30, position: "relative" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 15 }}>
        <div style={{ textAlign: "left" }}>
          <span className="dashboard-kicker" style={{ color: "#ff6b6b", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "bold" }}>
            Misión 4: Calibrar Escudos (Detección de Errores)
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
            <span>Sección de Escudos: {currentQIndex + 1} de {questions.length}</span>
            <span>Estabilidad de Escudo: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 15, fontSize: "1.1rem", textAlign: "left" }}>
            Instrucciones: Se ha detectado una avería gramatical en la red del escudo. Selecciona el nodo con el diagnóstico de corrección correcto.
          </h3>

          {/* Shield Status Deck */}
          <div 
            className="repair-deck" 
            style={{ 
              background: "rgba(255, 107, 107, 0.04)", 
              border: isSuccess 
                ? "2.5px solid #2ec4b6" 
                : "2.5px solid rgba(255, 107, 107, 0.3)", 
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
            <div style={{ position: "absolute", top: 10, right: 15, color: isSuccess ? "#2ec4b6" : "#ff6b6b", fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              {isSuccess ? "✓ SHIELD STABLE" : "⚠️ SHIELD ANOMALY DETECTED"}
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 15 }}>
              <img 
                src={ReclutaPrincipal} 
                alt="Operador de Escudo" 
                className="floating-crewmate"
                style={{ 
                  width: "200px", 
                  height: "200px", 
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

            <div style={{ fontSize: "1.45rem", color: "#ff8787", fontWeight: "bold", letterSpacing: 0.5, textDecoration: isSuccess ? "none" : "line-through", textShadow: "0 0 10px rgba(255, 107, 107, 0.2)" }}>
              "{getIncorrectSentence(currentQuestion.text)}"
            </div>

            <div style={{ fontSize: "2.5rem", marginTop: 15 }} className={isSuccess ? "" : "animate-bounce"}>
              {isSuccess ? "🛡️✨" : "🛡️💥"}
            </div>
          </div>

          {/* Hex Node Grid for Shield Calibration */}
          <div style={{ marginTop: 30, textAlign: "left" }}>
            <h4 style={{ color: "#9be6df", marginBottom: 15, fontSize: "0.95rem", fontWeight: "bold" }}>Nodos del Generador de Escudo:</h4>
            
            <div className="shield-hex-grid">
              {currentQuestion.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isRepaired = isSuccess && opt.is_correct;
                
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    style={{
                      padding: "16px 20px",
                      borderRadius: 12,
                      border: isSelected 
                        ? "2px solid #b8fff9" 
                        : isRepaired 
                          ? "2.5px solid #2ec4b6" 
                          : "1.5px solid rgba(255, 255, 255, 0.15)",
                      background: isSelected 
                        ? "rgba(46, 196, 182, 0.2)" 
                        : isRepaired
                          ? "rgba(46, 196, 182, 0.25)"
                          : "rgba(0, 0, 0, 0.4)",
                      color: isSelected ? "#b8fff9" : "#e6f7ff",
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      margin: 0,
                      flex: "1 1 200px",
                      minWidth: "200px",
                      boxShadow: isSelected ? "0 0 15px rgba(46, 196, 182, 0.2)" : "none",
                      transition: "all 0.2s ease",
                      textAlign: "center"
                    }}
                    className={`shield-opt-btn ${isSelected ? "shield-selected" : ""}`}
                  >
                    🛠️ {opt.text}
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
              🛡️ Calibrar Shield Node
            </button>
          </div>

          {isError && (
            <div style={{ marginTop: 20, color: "#ff6b6b", fontWeight: "bold", textAlign: "center" }} className="animate-shake">
              💥 ERROR DE RED: Frecuencia de nodo incorrecta. ¡Sobrecarga en el escudo!
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 20, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
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
    title: PropTypes.string.isRequired,
    questions: PropTypes.array
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
