import { useState } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/recluta principal personaje solo.png";
import "../../styles/Panel.css";

export function ComicGame({ activity, onComplete, onClose }) {
  const [viewMode, setViewMode] = useState("reading"); // "reading" or "quiz"
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [showStatusText, setShowStatusText] = useState("SISTEMA OK");

  const questions = activity.questions || [];
  const missionId = activity.mission || 1;

  const panelsMap = {
    1: [
      {
        title: "Registro 1: Llegada",
        text: "Hoy es un día especial. ¡La nave espacial ha llegado a Basescrib!",
        english: "Today is a special day. The spaceship has arrived at Basescrib!",
        illustration: "🚀",
        mood: "happy"
      },
      {
        title: "Registro 2: Identificación",
        text: "\"Bienvenido, recluta. ¿Cuál es tu nombre?\" \"Mi nombre es Tom.\" \"¿Cuántos años tienes?\" \"Tengo trece años.\"",
        english: "\"Welcome, recruit. What is your name?\" \"My name is Tom.\" \"How old are you?\" \"I am thirteen years old.\"",
        illustration: "👨‍🚀",
        mood: "happy"
      },
      {
        title: "Registro 3: Coordenadas",
        text: "\"¿De dónde eres?\" \"Soy de Perú. Soy peruano.\" \"¿Cuál es tu color favorito?\" \"Mi color favorito es el azul.\"",
        english: "\"Where are you from?\" \"I am from Peru. I'm peruvian.\" \"What is your favorite color?\" \"My favorite color is blue.\"",
        illustration: "🌎",
        mood: "happy"
      },
      {
        title: "Registro 4: Rol de Ingeniería",
        text: "\"¿Qué te gusta?\" \"Me gustan los robots y la ciencia.\" \"¿Puedes reparar naves?\" \"¡Sí, puedo!\"",
        english: "\"What do you like?\" \"I like robots and science.\" \"Can you repair spaceships?\" \"Yes, I can!\"",
        illustration: "🔧",
        mood: "happy"
      }
    ],
    2: [
      {
        title: "Registro 1: Inducción",
        text: "¡Buenos días a todos! Bienvenidos de nuevo a Basescrib.",
        english: "Good morning, everyone! Welcome back to Basescrib.",
        illustration: "👋",
        mood: "happy"
      },
      {
        title: "Registro 2: Inventario",
        text: "Entramos a la sala de estudio. Hay cinco computadoras y hay libros.",
        english: "We enter the study room. There are five computers and there are books.",
        illustration: "💻",
        mood: "happy"
      },
      {
        title: "Registro 3: Asistente Robótico",
        text: "Hay un robot. Muestra cinco fotos de comida.",
        english: "There is a robot. It shows five photos of food.",
        illustration: "🤖",
        mood: "happy"
      },
      {
        title: "Registro 4: Domo Ecológico",
        text: "¡Hay 10 estrellas! Y hay un alien amigable en el jardín hoy.",
        english: "There are 10 stars! And there is a friendly alien in the garden today.",
        illustration: "🪐",
        mood: "happy"
      }
    ],
    3: [
      {
        title: "Registro 1: Inicio de Turno",
        text: "El General se despierta a las 7:00, come cereal y bebe leche a las 7:30.",
        english: "The General wakes up at 7:00, eats cereal and drinks milk at 7:30.",
        illustration: "🥣",
        mood: "happy"
      },
      {
        title: "Registro 2: Entrenamiento",
        text: "\"¿Qué haces cada mañana?\" El Entrenador responde: \"Como frutas y entreno.\"",
        english: "\"What do you do every morning?\" The Trainer answers, \"I eat fruits and train.\"",
        illustration: "🏋️",
        mood: "happy"
      },
      {
        title: "Registro 3: Mantenimiento",
        text: "\"Limpio la sala de control.\" Y el otro: \"Estudio inglés y duermo temprano.\"",
        english: "\"I clean the control room.\" And the other: \"I study English and sleep early.\"",
        illustration: "🧹",
        mood: "happy"
      },
      {
        title: "Registro 4: Reporte Técnico",
        text: "El General escribe y lee los reportes diarios. La misión va muy bien.",
        english: "El General escribe y lee los reportes diarios. La misión va muy bien.",
        illustration: "📊",
        mood: "happy"
      }
    ],
    4: [
      {
        title: "Registro 1: Guardia Temporal",
        text: "El General está enfermo. Te pide supervisar a los reclutas hoy.",
        english: "The General is sick. He asks you to supervise the recruits today.",
        illustration: "🤒",
        mood: "scared"
      },
      {
        title: "Registro 2: Tareas en Curso",
        text: "\"Estoy estudiando inglés.\" En la otra sala: \"Estoy limpiando la sala de control.\"",
        english: "\"I am studying English.\" In the other room: \"I am cleaning the control room.\"",
        illustration: "📝",
        mood: "happy"
      },
      {
        title: "Registro 3: Bitácora",
        text: "\"Estoy leyendo una guía espacial.\" Y el otro: \"Estoy escribiendo un reporte.\"",
        english: "\"I am reading a space guide.\" And the other: \"I am writing a report.\"",
        illustration: "✍️",
        mood: "happy"
      },
      {
        title: "Registro 4: Recarga",
        text: "Cerca de la cafetería encuentras a otro recluta. \"Estoy almorzando.\"",
        english: "Near the cafeteria you meet another recruit. \"I am eating lunch.\"",
        illustration: "🍕",
        mood: "happy"
      }
    ],
    5: [
      {
        title: "Registro 1: Compartir Rutinas",
        text: "La tripulación está almorzando. El nuevo recluta de la base pregunta sobre tu rutina.",
        english: "The crew is eating lunch. The new recruit asks about your routine.",
        illustration: "🍱",
        mood: "happy"
      },
      {
        title: "Registro 2: Agenda de Órbita",
        text: "Siempre me despierto a las 6:00 y estudio a las 4:00. A veces entreno a las 5:00.",
        english: "I always wake up at 6:00 a.m. and study at 4:00 p.m. I sometimes train at 5:00 p.m.",
        illustration: "⏰",
        mood: "happy"
      },
      {
        title: "Registro 3: Aficiones",
        text: "A veces exploro Basescrib. Me gusta dibujar, pero nunca dibujo en misiones.",
        english: "I sometimes explore Basescrib. I like to draw, but I never draw during missions.",
        illustration: "🎨",
        mood: "happy"
      },
      {
        title: "Registro 4: Horas de Descanso",
        text: "\"¿Duermes a las 3:00 p.m.?\" ¡No! Nunca duermo a las 3:00 p.m. ¡Estás muy ocupado!",
        english: "\"Do you sleep at 3:00 p.m.?\" No! I never sleep at 3:00 p.m. You are very busy!",
        illustration: "❌",
        mood: "happy"
      }
    ]
  };

  const comicPanels = panelsMap[missionId] || panelsMap[1];

  const handleOptionClick = (option) => {
    setSelectedOptionId(option.id);
    setIsError(false);

    if (option.is_correct) {
      setShowStatusText("VERIFICACIÓN EXITOSA");
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
          setSelectedOptionId(null);
          setShowStatusText("SISTEMA OK");
        } else {
          onComplete(5, 5); // 5 XP, 5 Coins
        }
      }, 1200);
    } else {
      setIsError(true);
      setShowStatusText("FALLO DE AUTENTICACIÓN");
      setTimeout(() => {
        setIsError(false);
        setSelectedOptionId(null);
        setShowStatusText("SISTEMA OK");
      }, 1200);
    }
  };

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 800, padding: 30, position: "relative" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 25, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 15 }}>
        <div style={{ textAlign: "left" }}>
          <span className="dashboard-kicker" style={{ color: "#ffd166", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "bold" }}>
            Misión 1: Lectura de Archivos de Bitácora
          </span>
          <h2 style={{ margin: "5px 0 0 0", color: "#b8fff9", fontSize: "1.6rem" }}>{activity.title}</h2>
        </div>
        <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "8px 16px", background: "linear-gradient(135deg, #ff6b6b, #ee5a6f)" }}>
          Cerrar X
        </button>
      </div>

      {viewMode === "reading" ? (
        <div>
          <p style={{ color: "#9be6df", fontSize: "0.95rem", marginBottom: 20, textAlign: "left" }}>
            📂 Analiza las bitácoras del tripulante en inglés y español antes de comenzar el cuestionario de acceso.
          </p>

          {/* Comic panels grid */}
          <div 
            className="comic-grid" 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: 20, 
              marginBottom: 30 
            }}
          >
            {comicPanels.map((panel, idx) => (
              <div 
                key={idx} 
                className="comic-card" 
                style={{ 
                  background: "rgba(0, 0, 0, 0.35)", 
                  border: "1.5px solid rgba(184, 255, 249, 0.15)", 
                  borderRadius: 12, 
                  padding: 20, 
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease"
                }}
              >
                {/* Visual Novel layout Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(184, 255, 249, 0.1)", paddingBottom: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: "1.4rem" }}>📄</span>
                  <h4 style={{ color: "#ffd166", margin: 0, fontSize: "0.95rem", fontWeight: "bold" }}>{panel.title}</h4>
                </div>

                {/* Floating Vector crewmate icon based on panel theme */}
                <div style={{ display: "flex", justifyContent: "center", gap: 15, alignItems: "center", margin: "15px 0" }}>
                  <div className="floating-crewmate" style={{ display: "flex", justifyContent: "center" }}>
                    <img 
                      src={ReclutaPrincipal} 
                      alt="Recluta" 
                      style={{ 
                        width: "120px", 
                        height: "120px",
                        filter: idx % 2 === 0 ? "hue-rotate(130deg) saturate(1.5)" : "none",
                        objectFit: "contain"
                      }} 
                    />
                  </div>
                  <span style={{ fontSize: "2.5rem" }}>{panel.illustration}</span>
                </div>

                <p style={{ margin: "10px 0", fontSize: "0.95rem", color: "#e6f7ff", lineHeight: "1.4" }}>
                  "{panel.text}"
                </p>
                <div 
                  className="speech-bubble" 
                  style={{ 
                    background: "rgba(184, 255, 249, 0.08)", 
                    borderRadius: 8, 
                    padding: "10px 12px", 
                    marginTop: 12,
                    fontWeight: "600",
                    color: "#b8fff9",
                    border: "1px solid rgba(184, 255, 249, 0.15)",
                    fontSize: "0.9rem"
                  }}
                >
                  {panel.english}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button 
              className="btn-start" 
              style={{ 
                width: "100%", 
                maxWidth: 320, 
                padding: "16px 24px", 
                fontSize: "1.1rem",
                boxShadow: "0 0 20px rgba(255, 183, 3, 0.4)"
              }} 
              onClick={() => setViewMode("quiz")}
            >
              🚀 Iniciar Cuestionario de Acceso
            </button>
          </div>
        </div>
      ) : (
        // Quiz Mode
        <div style={{ textAlign: "left", padding: "10px 5px" }}>
          {currentQuestion ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.85rem", marginBottom: 15 }}>
                <span>PREGUNTA: {currentQIndex + 1} de {questions.length}</span>
                <span>ESTADO CONSOLA: <strong style={{ color: isError ? "#ff6b6b" : "#2ec4b6" }}>{showStatusText}</strong></span>
              </div>

              {/* Reactor Status Area */}
              <div 
                style={{ 
                  background: isError 
                    ? "rgba(255, 107, 107, 0.08)" 
                    : selectedOptionId && !isError 
                      ? "rgba(46, 196, 182, 0.08)" 
                      : "rgba(0, 0, 0, 0.4)", 
                  border: isError 
                    ? "2px solid #ff6b6b" 
                    : selectedOptionId && !isError 
                      ? "2px solid #2ec4b6" 
                      : "1.5px solid rgba(184, 255, 249, 0.2)",
                  borderRadius: 12,
                  padding: "20px 25px",
                  marginBottom: 25,
                  position: "relative",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div className="floating-crewmate">
                    <img 
                      src={ReclutaPrincipal} 
                      alt="Recluta Principal" 
                      style={{ 
                        width: "130px", 
                        height: "130px", 
                        filter: isError 
                          ? "hue-rotate(130deg) saturate(1.5) drop-shadow(0 0 8px #ff6b6b)" 
                          : selectedOptionId && !isError 
                            ? "hue-rotate(85deg) saturate(1.6) drop-shadow(0 0 8px #2ec4b6)" 
                            : "drop-shadow(0 0 6px rgba(0, 245, 255, 0.35))",
                        objectFit: "contain",
                        transition: "all 0.3s ease"
                      }} 
                    />
                  </div>
                  <h3 style={{ color: "#e6f7ff", margin: 0, fontSize: "1.15rem", lineHeight: "1.4" }}>
                    {currentQuestion.text}
                  </h3>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {currentQuestion.options?.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let borderStyle = "1px solid rgba(255, 255, 255, 0.15)";
                  let bgStyle = "rgba(255, 255, 255, 0.04)";
                  let colorStyle = "#e6f7ff";
                  
                  if (isSelected) {
                    if (isError) {
                      borderStyle = "2px solid #ff6b6b";
                      bgStyle = "rgba(255, 107, 107, 0.25)";
                      colorStyle = "#ff8787";
                    } else {
                      borderStyle = "2px solid #2ec4b6";
                      bgStyle = "rgba(46, 196, 182, 0.25)";
                      colorStyle = "#b8fff9";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt)}
                      style={{
                        padding: "16px 20px",
                        borderRadius: 10,
                        border: borderStyle,
                        background: bgStyle,
                        color: colorStyle,
                        textAlign: "left",
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        margin: 0,
                        transition: "all 0.2s ease"
                      }}
                      className="quiz-option-btn"
                    >
                      🚀 {opt.text}
                    </button>
                  );
                })}
              </div>

              {isError && (
                <div style={{ marginTop: 20, color: "#ff6b6b", fontWeight: "bold", textAlign: "center" }} className="animate-shake">
                  🚨 ERROR: Datos incorrectos. ¡Revisa tu bitácora!
                </div>
              )}

              {selectedOptionId && !isError && (
                <div style={{ marginTop: 20, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
                  📡 TRANSMISIÓN OK: Avanzando...
                </div>
              )}
            </div>
          ) : (
            <p>No hay preguntas disponibles en esta actividad.</p>
          )}

          <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
            <button className="btn-cancel" onClick={() => setViewMode("reading")} style={{ margin: 0 }}>
              📖 Consultar Bitácoras
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
    questions: PropTypes.array,
    mission: PropTypes.number
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
