import { useState } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import "../../styles/Panel.css";

export function ComicGame({ activity, onComplete, onClose }) {
  const [viewMode, setViewMode] = useState("reading"); // "reading" or "quiz"
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isError, setIsError] = useState(false);
  const [mistakes, setMistakes] = useState(0);
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
        english: "The General writes and reads daily reports. The mission is going well.",
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
    ],
    6: [
      {
        title: "Registro 1: Inspección de Equipos",
        text: "El Capitán Bric inicia la auditoría: '¿Tenemos suficientes tanques de oxígeno en la bahía?'",
        english: "Captain Bric asks: 'Do we have enough oxygen tanks in the cargo bay?'",
        illustration: "📦",
        mood: "happy"
      },
      {
        title: "Registro 2: Asignación de Herramientas",
        text: "Tom tiene una caja de herramientas completa, pero Dani no tiene el código de acceso.",
        english: "Tom has a toolkit, but Dani doesn't have the key code.",
        illustration: "🧰",
        mood: "happy"
      },
      {
        title: "Registro 3: Escáner de Frecuencia",
        text: "Ale tiene el escáner de frecuencia listo para el chequeo del motor.",
        english: "Ale has the frequency scanner ready for the engine check.",
        illustration: "📡",
        mood: "happy"
      },
      {
        title: "Registro 4: Balance de Suministros",
        text: "'No tenemos fallas de energía hoy. ¡Los suministros están en orden!'",
        english: "'We don't have energy failures today. Supplies are in order!'",
        illustration: "🔋",
        mood: "happy"
      }
    ],
    7: [
      {
        title: "Registro 1: Transmisión Alienígena",
        text: "Una señal desconocida llega al radar de la base. '¿Quién está enviando esto?'",
        english: "An unknown signal arrives at the radar. 'Who is sending this?'",
        illustration: "📶",
        mood: "scared"
      },
      {
        title: "Registro 2: Coordenadas del Mensaje",
        text: "'¿De dónde viene la señal y qué significa?' pregunta la oficial Dani.",
        english: "'Where is it coming from and what does it mean?' asks officer Dani.",
        illustration: "🗺️",
        mood: "happy"
      },
      {
        title: "Registro 3: Marca Temporal",
        text: "'¿Cuándo inició la transmisión?' El reloj del sistema marca las 09:00 exactas.",
        english: "'When did the transmission start?' The system clock marks exactly 09:00.",
        illustration: "⏱️",
        mood: "happy"
      },
      {
        title: "Registro 4: Decodificación",
        text: "La tripulación usa preguntas Wh (What, Where, Who, When) para entender el mensaje.",
        english: "The crew uses Wh-questions to decode and understand the message.",
        illustration: "❓",
        mood: "happy"
      }
    ],
    8: [
      {
        title: "Registro 1: Visor en el Laboratorio",
        text: "Alguien dejó un visor espacial en la mesa de experimentos. '¿Es tu visor, Ale?'",
        english: "Someone left a space visor on the lab table. 'Is this your visor, Ale?'",
        illustration: "🥽",
        mood: "happy"
      },
      {
        title: "Registro 2: Identificación Posesiva",
        text: "'No, es el visor de ella. ¡Es suyo!' responde Ale señalando a la recluta.",
        english: "'No, it's her visor. It's hers!' answers Ale pointing to the recruit.",
        illustration: "👉",
        mood: "happy"
      },
      {
        title: "Registro 3: Casco de Tom",
        text: "'Este casco espacial es mío y la linterna de plasma es de Bric (de él).'",
        english: "'This space helmet is mine and the plasma torch is Bric's (his).'",
        illustration: "🪖",
        mood: "happy"
      },
      {
        title: "Registro 4: Inventario Personal",
        text: "Cada objeto en Base ONE queda debidamente etiquetado con su dueño.",
        english: "Every item in Base ONE is now properly tagged with its owner.",
        illustration: "🏷️",
        mood: "happy"
      }
    ],
    9: [
      {
        title: "Registro 1: Llamada a la Estación",
        text: "Dino llama al comandante por el canal de radio: '¿Puedes escucharme?'",
        english: "Dino calls the commander over radio: 'Can you hear me?'",
        illustration: "📻",
        mood: "happy"
      },
      {
        title: "Registro 2: Envió de Coordenadas",
        text: "'¡Les estoy enviando las coordenadas de navegación a ellos ahora mismo!'",
        english: "'I am sending them the navigation coordinates right now!'",
        illustration: "📍",
        mood: "happy"
      },
      {
        title: "Registro 3: Confirmación de Bric",
        text: "El Capitán Bric nos llamó. Le respondimos sin demora por el enlace secundario.",
        english: "Captain Bric called us. We answered him promptly on the secondary link.",
        illustration: "📞",
        mood: "happy"
      },
      {
        title: "Registro 4: Canal Seguro",
        text: "Por favor ayúdanos con el radar. '¡Los escucho alto y claro, cambio!'",
        english: "Please help us with the radar. 'I hear you loud and clear, over!'",
        illustration: "🎙️",
        mood: "happy"
      }
    ],
    10: [
      {
        title: "Registro 1: Cubierta de Simulación",
        text: "Bric guía a los reclutas: 'Este equipo de aquí es un simulador de gravedad.'",
        english: "Bric shows the recruits: 'This machine here is a gravity simulator.'",
        illustration: "🕹️",
        mood: "happy"
      },
      {
        title: "Registro 2: Escudos en Distancia",
        text: "'Aquellos escudos en la pared distante son escudos cuánticos de defensa.'",
        english: "'Those shields on the distant wall are quantum defense shields.'",
        illustration: "🛡️",
        mood: "happy"
      },
      {
        title: "Registro 3: Herramientas Cercanas",
        text: "'Estas herramientas en mi mano son para reparación de circuitos.'",
        english: "'These tools in my hand are for circuit repairs.'",
        illustration: "🔧",
        mood: "happy"
      },
      {
        title: "Registro 4: Demostración Completa",
        text: "Usando This, That, These y Those identificamos todos los módulos del deck.",
        english: "Using This, That, These, and Those we identify all deck modules.",
        illustration: "🖥️",
        mood: "happy"
      }
    ],
    11: [
      {
        title: "Registro 1: Auditoría de Plasma",
        text: "Dani revisa los tanques: '¿Cuánto combustible de plasma nos queda para el salto?'",
        english: "Dani checks tanks: 'How much plasma fuel do we have left for the jump?'",
        illustration: "🧪",
        mood: "happy"
      },
      {
        title: "Registro 2: Células Cuánticas",
        text: "'¡Tenemos muchas células de energía almacenadas en la bodega!'",
        english: "'We have a lot of energy cells stored in the hold!'",
        illustration: "⚡",
        mood: "happy"
      },
      {
        title: "Registro 3: Cohetes de Reserva",
        text: "'¿Cuántos cohetes de repuesto hay en el hangar?' 'Hay algunos cohetes.'",
        english: "'How many spare rockets are in the hangar?' 'There are some rockets.'",
        illustration: "🚀",
        mood: "happy"
      },
      {
        title: "Registro 4: Reservas Verificadas",
        text: "El conteo cuantitativo confirma reservas suficientes para la expedición.",
        english: "Quantifier audit confirms sufficient reserves for the expedition.",
        illustration: "📊",
        mood: "happy"
      }
    ],
    12: [
      {
        title: "Registro 1: Encuentro en Scribtonia",
        text: "La tripulación encuentra un compañero alienígena amigable durante la patrulla.",
        english: "The crew encounters a friendly alien companion during patrol.",
        illustration: "👾",
        mood: "happy"
      },
      {
        title: "Registro 2: Características de la Criatura",
        text: "Es un ser luminoso, inteligente y de color azul brillante.",
        english: "It is a luminous, intelligent and bright blue creature.",
        illustration: "✨",
        mood: "happy"
      },
      {
        title: "Registro 3: Tecnología de Propulsión",
        text: "Base ONE cuenta con un motor de propulsión muy rápido y avanzado.",
        english: "Base ONE features a very fast and advanced propulsion engine.",
        illustration: "🌀",
        mood: "happy"
      },
      {
        title: "Registro 4: Dossier Registrado",
        text: "El catálogo de especies de Scribtonia suma un nuevo informe de primer contacto.",
        english: "The Scribtonian species catalog adds a new first contact report.",
        illustration: "📖",
        mood: "happy"
      }
    ],
    13: [
      {
        title: "Registro 1: Cuadro Comparativo",
        text: "Scribtonia es más grande que la Tierra, pero Júpiter es el más grande del sistema.",
        english: "Scribtonia is bigger than Earth, but Jupiter is the biggest of all!",
        illustration: "🪐",
        mood: "happy"
      },
      {
        title: "Registro 2: Física Estelar",
        text: "'La luz es más rápida que el sonido en el espacio profundo', explica Dino.",
        english: "'Light is faster than sound in deep space', explains Dino.",
        illustration: "💫",
        mood: "happy"
      },
      {
        title: "Registro 3: Naves en Comparación",
        text: "Base ONE es la estación más rápida y más potente construida en el sector.",
        english: "Base ONE is the fastest and most powerful station built in the sector.",
        illustration: "🌌",
        mood: "happy"
      },
      {
        title: "Registro 4: Informe de Órbita",
        text: "Los reclutas dominan los comparativos (-er/more) y superlativos (-est/most).",
        english: "Recruits master comparatives (-er/more) and superlatives (-est/most).",
        illustration: "🏆",
        mood: "happy"
      }
    ],
    14: [
      {
        title: "Registro 1: Ceremonia de Honor",
        text: "El Capitán Bric promueve a Tom y a toda la tripulación por completar el programa.",
        english: "Captain Bric promotes Tom and the entire crew for completing the program.",
        illustration: "🎖️",
        mood: "happy"
      },
      {
        title: "Registro 2: La Bóveda Central",
        text: "¡La medalla oficial de graduación se encuentra dentro de la bóveda central!",
        english: "The official graduation medal is located inside the central vault!",
        illustration: "🔐",
        mood: "happy"
      },
      {
        title: "Registro 3: Posición de Mando",
        text: "El asiento del comandante se ubica entre los dos monitores táctiles principales.",
        english: "The commander seat is located between the two main touch monitors.",
        illustration: "💺",
        mood: "happy"
      },
      {
        title: "Registro 4: Coordenadas de Graduación",
        text: "¡Felicidades recluta! Has desbloqueado las coordenadas finales de BaseScrib.",
        english: "Congratulations recruit! You unlocked BaseScrib's final coordinates.",
        illustration: "🎓",
        mood: "happy"
      }
    ]
  };

  const currentDay = activity.day_num || activity.mission || 1;
  const comicPanels = panelsMap[currentDay] || panelsMap[1];

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
          onComplete(10, 10, mistakes); // 10 XP, 10 Coins, mistakes
        }
      }, 1200);
    } else {
      setMistakes((prev) => prev + 1);
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
        {onClose && (
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "8px 16px", background: "linear-gradient(135deg, #ff6b6b, #ee5a6f)" }}>
            Cerrar X
          </button>
        )}
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
