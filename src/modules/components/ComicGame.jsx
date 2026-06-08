import { useState } from "react";
import PropTypes from "prop-types";

export function ComicGame({ activity, onComplete, onClose }) {
  const [viewMode, setViewMode] = useState("reading"); // "reading" or "quiz"
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isError, setIsError] = useState(false);

  const questions = activity.questions || [];

  // Mock comic pages data
  const comicPanels = [
    {
      title: "Panel 1: Saludo",
      text: "¡Hola! Mi nombre es Leo. Tengo 13 años de edad.",
      english: "Hi! My name is Leo. I am 13 years old.",
      illustration: "👨‍🚀🚀",
      desc: "Leo te saluda desde su cápsula espacial de exploración."
    },
    {
      title: "Panel 2: Origen",
      text: "Soy de Perú. Vivo en Lima, la capital.",
      english: "I am from Peru. I live in Lima.",
      illustration: "🌎🇵🇪",
      desc: "Se observa la Tierra a través de la ventana del transbordador."
    },
    {
      title: "Panel 3: Habilidades",
      text: "Puedo usar computadoras y seguir instrucciones complicadas.",
      english: "I can use computers and follow instructions.",
      illustration: "💻🛰️",
      desc: "Leo opera la supercomputadora principal de la nave."
    },
    {
      title: "Panel 4: Pasatiempos",
      text: "Me gustan los videojuegos y leer novelas de ciencia ficción.",
      english: "I like video games and reading science fiction.",
      illustration: "🎮📖",
      desc: "Leo flota en gravedad cero sosteniendo un libro holográfico."
    }
  ];

  const handleOptionClick = (option) => {
    setSelectedOptionId(option.id);
    setIsError(false);

    if (option.is_correct) {
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
          setSelectedOptionId(null);
        } else {
          // Finished all questions!
          onComplete(5, 5); // 5 XP, 5 Coins
        }
      }, 800);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setSelectedOptionId(null);
      }, 1000);
    }
  };

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="auth-card panel-large animate-fadeIn" style={{ maxWidth: 800 }}>
      <div className="panel-title-row" style={{ marginBottom: 20 }}>
        <div>
          <span className="dashboard-kicker">Actividad 1: Comprensión Lectora</span>
          <h2>{activity.title}</h2>
        </div>
        <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 12px" }}>
          Cerrar X
        </button>
      </div>

      {viewMode === "reading" ? (
        <div>
          {/* Comic panels grid */}
          <div 
            className="comic-grid" 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: 20, 
              marginBottom: 25 
            }}
          >
            {comicPanels.map((panel, idx) => (
              <div 
                key={idx} 
                className="comic-card" 
                style={{ 
                  background: "rgba(255, 255, 255, 0.05)", 
                  border: "2px solid rgba(184, 255, 249, 0.2)", 
                  borderRadius: 15, 
                  padding: 15, 
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                }}
              >
                <div style={{ fontSize: "3rem", margin: "10px 0" }}>{panel.illustration}</div>
                <h4 style={{ color: "#ffd166", margin: "5px 0" }}>{panel.title}</h4>
                <p style={{ margin: "5px 0", fontSize: "0.85rem", fontStyle: "italic", color: "#9be6df" }}>
                  "{panel.text}"
                </p>
                <div 
                  className="speech-bubble" 
                  style={{ 
                    background: "rgba(184, 255, 249, 0.15)", 
                    borderRadius: 10, 
                    padding: 10, 
                    marginTop: 10,
                    fontWeight: "bold",
                    color: "#b8fff9",
                    border: "1px solid rgba(184, 255, 249, 0.3)"
                  }}
                >
                  {panel.english}
                </div>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", display: "block", marginTop: 10 }}>
                  {panel.desc}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button 
              className="btn-start" 
              style={{ width: "100%", maxWidth: 300, padding: 15 }} 
              onClick={() => setViewMode("quiz")}
            >
              🚀 ¡Iniciar Cuestionario!
            </button>
          </div>
        </div>
      ) : (
        // Quiz Mode
        <div style={{ textAlign: "left", padding: "10px 20px" }}>
          {currentQuestion ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.9rem", marginBottom: 15 }}>
                <span>Pregunta {currentQIndex + 1} de {questions.length}</span>
                <span>Progreso: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
              </div>

              <h3 style={{ color: "#b8fff9", marginBottom: 20, fontSize: "1.3rem" }}>
                {currentQuestion.text}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {currentQuestion.options?.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let borderStyle = "1px solid rgba(255, 255, 255, 0.15)";
                  let bgStyle = "rgba(255, 255, 255, 0.04)";
                  
                  if (isSelected) {
                    if (isError) {
                      borderStyle = "2px solid #ff6b6b";
                      bgStyle = "rgba(255, 107, 107, 0.2)";
                    } else {
                      borderStyle = "2px solid #2ec4b6";
                      bgStyle = "rgba(46, 196, 182, 0.2)";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt)}
                      style={{
                        padding: 15,
                        borderRadius: 10,
                        border: borderStyle,
                        background: bgStyle,
                        color: "#e6f7ff",
                        textAlign: "left",
                        fontSize: "1rem",
                        cursor: "pointer",
                        margin: 0,
                        transition: "all 0.2s ease"
                      }}
                      className="quiz-option-btn"
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {isError && (
                <div style={{ marginTop: 15, color: "#ff6b6b", fontWeight: "bold", textAlign: "center" }} className="animate-shake">
                  ❌ ¡Inténtalo de nuevo! Respuesta incorrecta.
                </div>
              )}

              {selectedOptionId && !isError && (
                <div style={{ marginTop: 15, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
                  🎉 ¡Correcto! Cargando siguiente pregunta...
                </div>
              )}
            </div>
          ) : (
            <p>No hay preguntas disponibles en esta actividad.</p>
          )}

          <div style={{ marginTop: 25, display: "flex", justifyContent: "space-between" }}>
            <button className="btn-cancel" onClick={() => setViewMode("reading")}>
              Volver a leer el Comic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ComicGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    questions: PropTypes.array
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
