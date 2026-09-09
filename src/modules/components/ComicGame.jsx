import { useState, useEffect, useRef } from "react";
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

// Curricular Comic Comprehension Questions for all 14 Days
const DEFAULT_COMIC_QUESTIONS = {
  1: [
    { id: "cq1-1", text: "¿Cuál es la estación espacial a la que arriba el recluta?", options: [{ id: "co1-1", text: "Base ONE", is_correct: true }, { id: "co1-2", text: "Estación Cero", is_correct: false }, { id: "co1-3", text: "Nave Impostora", is_correct: false }] },
    { id: "cq1-2", text: "¿Quién es el asistente de vuelo con inteligencia artificial?", options: [{ id: "co1-4", text: "Sparky Bot", is_correct: true }, { id: "co1-5", text: "Capitán Bric", is_correct: false }, { id: "co1-6", text: "Recluta Leo", is_correct: false }] }
  ],
  2: [
    { id: "cq2-1", text: "¿Dónde descansan los miembros de la tripulación?", options: [{ id: "co2-1", text: "En los dormitorios de la base", is_correct: true }, { id: "co2-2", text: "En la esclusa de aire", is_correct: false }, { id: "co2-3", text: "Fuera de la órbita", is_correct: false }] },
    { id: "cq2-2", text: "¿Qué elemento protege al explorador en el vacío espacial?", options: [{ id: "co2-4", text: "El traje espacial y casco", is_correct: true }, { id: "co2-5", text: "Una manta térmica", is_correct: false }, { id: "co2-6", text: "El radar de consola", is_correct: false }] }
  ],
  3: [
    { id: "cq3-1", text: "¿Qué actividad realiza la tripulación al inicio del turno?", options: [{ id: "co3-1", text: "Reunión informativa y desayuno", is_correct: true }, { id: "co3-2", text: "Dormir todo el día", is_correct: false }, { id: "co3-3", text: "Abandonar la estación", is_correct: false }] },
    { id: "cq3-2", text: "¿A qué hora reportan los reclutas su informe?", options: [{ id: "co3-4", text: "Al finalizar su turno diario", is_correct: true }, { id: "co3-5", text: "Nunca reportan", is_correct: false }, { id: "co3-6", text: "Solo los domingos", is_correct: false }] }
  ],
  4: [
    { id: "cq4-1", text: "¿Qué tarea técnica está supervisando Dani?", options: [{ id: "co4-1", text: "La calibración del radar estelar", is_correct: true }, { id: "co4-2", text: "Cocinar la cena", is_correct: false }, { id: "co4-3", text: "Pintar los pasillos", is_correct: false }] },
    { id: "cq4-2", text: "¿Quién está reparando la bobina del motor?", options: [{ id: "co4-4", text: "Sparky Bot", is_correct: true }, { id: "co4-5", text: "El General Bric", is_correct: false }, { id: "co4-6", text: "Un visitante desconocido", is_correct: false }] }
  ],
  5: [
    { id: "cq5-1", text: "¿Qué regla de seguridad es obligatoria en la base?", options: [{ id: "co5-1", text: "Llevar casco en zonas de descompresión", is_correct: true }, { id: "co5-2", text: "Apagar los escudos", is_correct: false }, { id: "co5-3", text: "Abrir las compuertas sin aviso", is_correct: false }] },
    { id: "cq5-2", text: "¿Quién tiene autorización para acceder al núcleo del reactor?", options: [{ id: "co5-4", text: "Solo oficiales autorizados", is_correct: true }, { id: "co5-5", text: "Cualquier recluta nuevo", is_correct: false }, { id: "co5-6", text: "Nadie en absoluto", is_correct: false }] }
  ],
  6: [
    { id: "cq6-1", text: "¿Qué descubrió la tripulación en su bitácora pasada?", options: [{ id: "co6-1", text: "Un campo de asteroides luminosos", is_correct: true }, { id: "co6-2", text: "Un agujero negro gigante", is_correct: false }, { id: "co6-3", text: "Una flota enemiga", is_correct: false }] },
    { id: "cq6-2", text: "¿Logró el equipo aterrizar la sonda?", options: [{ id: "co6-4", text: "Sí, aterrizó con éxito", is_correct: true }, { id: "co6-5", text: "No, se perdió en el espacio", is_correct: false }, { id: "co6-6", text: "Nunca despegaron", is_correct: false }] }
  ],
  7: [
    { id: "cq7-1", text: "¿De dónde provino la señal de socorro registrada?", options: [{ id: "co7-1", text: "Del Sector 4 de Scribtonia", is_correct: true }, { id: "co7-2", text: "Del planeta Tierra", is_correct: false }, { id: "co7-3", text: "De la propia nave", is_correct: false }] },
    { id: "cq7-2", text: "¿Qué acción tomó el equipo al escuchar la señal?", options: [{ id: "co7-4", text: "Enviaron un informe al General Bric", is_correct: true }, { id: "co7-5", text: "Ignoraron la alerta", is_correct: false }, { id: "co7-6", text: "Apagaron la radio", is_correct: false }] }
  ],
  8: [
    { id: "cq8-1", text: "¿Cómo se compara el motor de iones con el cohete químico?", options: [{ id: "co8-1", text: "Es más rápido y eficiente", is_correct: true }, { id: "co8-2", text: "Es más lento y ruidoso", is_correct: false }, { id: "co8-3", text: "Es exactamente idéntico", is_correct: false }] },
    { id: "cq8-2", text: "¿Qué planeta tiene una atmósfera más densa?", options: [{ id: "co8-4", text: "Scribtonia", is_correct: true }, { id: "co8-5", text: "La Luna", is_correct: false }, { id: "co8-6", text: "Marte", is_correct: false }] }
  ],
  9: [
    { id: "cq9-1", text: "¿Cuál es la instalación más avanzada de la flota?", options: [{ id: "co9-1", text: "La Base ONE", is_correct: true }, { id: "co9-2", text: "El puesto minero", is_correct: false }, { id: "co9-3", text: "La nave de carga", is_correct: false }] },
    { id: "cq9-2", text: "¿Cuál es la estrella más brillante de la constelación?", options: [{ id: "co9-4", text: "Nova Scrib", is_correct: true }, { id: "co9-5", text: "Alpha Centauri", is_correct: false }, { id: "co9-6", text: "El Sol", is_correct: false }] }
  ],
  10: [
    { id: "cq10-1", text: "¿Qué maniobra planea realizar el comandante mañana?", options: [{ id: "co10-1", text: "Navegar a través de la nebulosa", is_correct: true }, { id: "co10-2", text: "Regresar a la Tierra", is_correct: false }, { id: "co10-3", text: "Desmantelar la nave", is_correct: false }] },
    { id: "cq10-2", text: "¿A qué hora está programado el acoplamiento del módulo?", options: [{ id: "co10-4", text: "A las 14:00 horas", is_correct: true }, { id: "co10-5", text: "A medianoche", is_correct: false }, { id: "co10-6", text: "En tres semanas", is_correct: false }] }
  ],
  11: [
    { id: "cq11-1", text: "¿Qué sucederá si los escudos de plasma fallan?", options: [{ id: "co11-1", text: "El casco sufrirá una brecha de presión", is_correct: true }, { id: "co11-2", text: "La nave irá más rápido", is_correct: false }, { id: "co11-3", text: "Se apagarán las luces interiores", is_correct: false }] },
    { id: "cq11-2", text: "¿Cómo asegurará el escuadrón su supervivencia?", options: [{ id: "co11-4", text: "Siguiendo el protocolo al pie de la letra", is_correct: true }, { id: "co11-5", text: "Desconectando los sensores", is_correct: false }, { id: "co11-6", text: "Saliendo sin traje", is_correct: false }] }
  ],
  12: [
    { id: "cq12-1", text: "¿Cuántas estaciones orbitales ha visitado la tripulación?", options: [{ id: "co12-1", text: "Tres estaciones alienígenas", is_correct: true }, { id: "co12-2", text: "Ninguna hasta ahora", is_correct: false }, { id: "co12-3", text: "Más de cien", is_correct: false }] },
    { id: "cq12-2", text: "¿Ha completado el oficial científico los análisis?", options: [{ id: "co12-4", text: "Sí, ya completó todos los escaneos", is_correct: true }, { id: "co12-5", text: "No, aún no ha comenzado", is_correct: false }, { id: "co12-6", text: "Perdió los datos", is_correct: false }] }
  ],
  13: [
    { id: "cq13-1", text: "¿Cómo fue detectada la señal en la anomalía?", options: [{ id: "co13-1", text: "Fue captada por los sensores de radar de la base", is_correct: true }, { id: "co13-2", text: "Por observación visual directa", is_correct: false }, { id: "co13-3", text: "Por un mensaje de texto", is_correct: false }] },
    { id: "cq13-2", text: "¿Dónde deben almacenarse las muestras cósmicas?", options: [{ id: "co13-4", text: "En cápsulas de biocontención", is_correct: true }, { id: "co13-5", text: "En la cocina de la nave", is_correct: false }, { id: "co13-6", text: "En los casilleros de ropa", is_correct: false }] }
  ],
  14: [
    { id: "cq14-1", text: "¿Qué logro celebra hoy el escuadrón de Base ONE?", options: [{ id: "co14-1", text: "Completar la formación lingüística y de vuelo", is_correct: true }, { id: "co14-2", text: "El fin de la misión de rescate", is_correct: false }, { id: "co14-3", text: "El retiro del General Bric", is_correct: false }] },
    { id: "cq14-2", text: "¿Para qué está preparado el equipo de expedición?", options: [{ id: "co14-4", text: "Para la exploración del espacio profundo", is_correct: true }, { id: "co14-5", text: "Para quedarse en los dormitorios", is_correct: false }, { id: "co14-6", text: "Para reiniciar el curso básico", is_correct: false }] }
  ]
};

// Curricular Comic Bitácora Panels for all 14 Days
const DEFAULT_COMIC_PANELS = {
  1: [
    {
      title: "Panel 1: Arribo a Base ONE",
      text: "Nuestra nave espacial acaba de acoplarse con éxito a la estación Base ONE.",
      english: "Our spaceship has just docked successfully at Base ONE station.",
      illustration: "🚀🛰️"
    },
    {
      title: "Panel 2: Asistente Sparky Bot",
      text: "¡Saludos recluta! Soy Sparky Bot, tu asistente de vuelo con inteligencia artificial.",
      english: "Greetings recruit! I am Sparky Bot, your artificial intelligence flight assistant.",
      illustration: "🤖⚡"
    }
  ],
  2: [
    {
      title: "Panel 1: Dormitorios de la Base",
      text: "Después de un largo viaje, la tripulación descansa en los dormitorios de la base.",
      english: "After a long journey, the crew rests in the base dormitories.",
      illustration: "🛏️💤"
    },
    {
      title: "Panel 2: Traje y Casco Espacial",
      text: "El traje espacial presurizado y el casco protegen al explorador en el vacío cósmico.",
      english: "The pressurized spacesuit and helmet protect the explorer in the cosmic vacuum.",
      illustration: "🧑‍🚀🛡️"
    }
  ],
  3: [
    {
      title: "Panel 1: Reunión y Desayuno",
      text: "Iniciamos el turno matutino con una reunión informativa y desayuno energético.",
      english: "We begin the morning shift with a briefing meeting and energetic breakfast.",
      illustration: "🍳📋"
    },
    {
      title: "Panel 2: Reporte de Fin de Turno",
      text: "Todos los reclutas deben transmitir su informe oficial al finalizar su turno diario.",
      english: "All recruits must transmit their official report at the end of their daily shift.",
      illustration: "📊💻"
    }
  ],
  4: [
    {
      title: "Panel 1: Calibración del Radar",
      text: "Dani está supervisando atentamente la calibración del radar estelar.",
      english: "Dani is attentively supervising the calibration of the stellar radar.",
      illustration: "📡🔍"
    },
    {
      title: "Panel 2: Bobina de Sparky Bot",
      text: "Mientras tanto, Sparky Bot está reparando la bobina del motor principal.",
      english: "Meanwhile, Sparky Bot is repairing the main engine coil.",
      illustration: "🔧🤖"
    }
  ],
  5: [
    {
      title: "Panel 1: Zonas de Descompresión",
      text: "Es una regla de seguridad obligatoria llevar casco en las zonas de descompresión.",
      english: "It is a mandatory safety rule to wear a helmet in decompression zones.",
      illustration: "⛑️⚠️"
    },
    {
      title: "Panel 2: Núcleo del Reactor",
      text: "Solo los oficiales autorizados tienen permiso para ingresar al núcleo del reactor.",
      english: "Only authorized officers have permission to enter the reactor core.",
      illustration: "⚛️🔐"
    }
  ],
  6: [
    {
      title: "Panel 1: Asteroides Luminosos",
      text: "En nuestra bitácora pasada descubrimos un deslumbrante campo de asteroides luminosos.",
      english: "In our past log we discovered a dazzling luminous asteroid field.",
      illustration: "☄️✨"
    },
    {
      title: "Panel 2: Aterrizaje Exitoso",
      text: "El equipo confirmó que la sonda de exploración aterrizó con total éxito en la roca.",
      english: "The team confirmed that the exploration probe landed successfully on the rock.",
      illustration: "🛸🪐"
    }
  ],
  7: [
    {
      title: "Panel 1: Señal del Sector 4",
      text: "Registramos una misteriosa señal de socorro proveniente del Sector 4 de Scribtonia.",
      english: "We recorded a mysterious distress signal coming from Sector 4 of Scribtonia.",
      illustration: "📻🚨"
    },
    {
      title: "Panel 2: Reporte al General Bric",
      text: "Inmediatamente enviamos un informe detallado de la anomalía al General Bric.",
      english: "We immediately sent a detailed report of the anomaly to General Bric.",
      illustration: "🎖️📨"
    }
  ],
  8: [
    {
      title: "Panel 1: Motor Iónico vs Químico",
      text: "El nuevo motor de iones es notablemente más rápido y eficiente que el cohete químico.",
      english: "The new ion engine is remarkably faster and more efficient than chemical rockets.",
      illustration: "🚀⚡"
    },
    {
      title: "Panel 2: Atmósfera de Scribtonia",
      text: "Los sensores revelan que el planeta Scribtonia posee una atmósfera más densa.",
      english: "Sensors reveal that planet Scribtonia possesses a much denser atmosphere.",
      illustration: "🪐💨"
    }
  ],
  9: [
    {
      title: "Panel 1: La Base ONE",
      text: "La Base ONE es reconocida como la instalación más avanzada y segura de toda la flota.",
      english: "Base ONE is recognized as the most advanced and secure facility in the fleet.",
      illustration: "🏢🌌"
    },
    {
      title: "Panel 2: Estrella Nova Scrib",
      text: "En la noche cósmica, Nova Scrib brilla como la estrella más brillante de la galaxia.",
      english: "In the cosmic night, Nova Scrib shines as the brightest star in the galaxy.",
      illustration: "⭐🌟"
    }
  ],
  10: [
    {
      title: "Panel 1: Hacia la Nebulosa",
      text: "El comandante anunció que planea navegar a través de la nebulosa interestelar mañana.",
      english: "The commander announced he plans to navigate through the interstellar nebula tomorrow.",
      illustration: "🌌🧭"
    },
    {
      title: "Panel 2: Acoplamiento a las 14:00",
      text: "El acoplamiento del módulo logístico está programado exactamente a las 14:00 horas.",
      english: "Docking of the logistics module is scheduled at exactly 14:00 hours.",
      illustration: "🕑🛰️"
    }
  ],
  11: [
    {
      title: "Panel 1: Falla de Escudos",
      text: "Si los escudos de plasma fallan bajo fuego solar, el casco sufrirá una brecha grave.",
      english: "If plasma shields fail under solar fire, the hull will suffer a severe breach.",
      illustration: "🛡️💥"
    },
    {
      title: "Panel 2: Protocolo Estricto",
      text: "El escuadrón asegurará su supervivencia siguiendo el protocolo al pie de la letra.",
      english: "The squadron will ensure its survival by following the protocol strictly.",
      illustration: "📜✔️"
    }
  ],
  12: [
    {
      title: "Panel 1: Tres Estaciones Alienígenas",
      text: "Hasta la fecha, nuestra tripulación ya ha visitado tres estaciones alienígenas.",
      english: "To date, our crew has already visited three alien stations.",
      illustration: "👽🛸"
    },
    {
      title: "Panel 2: Análisis Completados",
      text: "El oficial científico confirmó que ya completó todos los escaneos planetarios.",
      english: "The science officer confirmed he has already completed all planetary scans.",
      illustration: "🔬📑"
    }
  ],
  13: [
    {
      title: "Panel 1: Sensores de Radar",
      text: "La extraña señal en la anomalía fue captada por los sensores de radar de la base.",
      english: "The strange signal in the anomaly was captured by the base's radar sensors.",
      illustration: "📡⚡"
    },
    {
      title: "Panel 2: Cápsulas de Biocontención",
      text: "Las muestras biológicas cósmicas deben almacenarse en cápsulas de biocontención.",
      english: "The cosmic biological samples must be stored in biocontainment capsules.",
      illustration: "🧪🔒"
    }
  ],
  14: [
    {
      title: "Panel 1: Graduación de Base ONE",
      text: "¡Hoy celebramos con orgullo completar la formación lingüística y de vuelo estelar!",
      english: "Today we proudly celebrate completing our linguistic and star flight training!",
      illustration: "🎓🏆"
    },
    {
      title: "Panel 2: Expedición al Espacio Profundo",
      text: "Nuestro escuadrón está plenamente preparado para la exploración del espacio profundo.",
      english: "Our squadron is fully prepared for deep space exploration.",
      illustration: "🚀✨"
    }
  ]
};

const panelsMap = DEFAULT_COMIC_PANELS;

export function ComicGame({ activity, onComplete, onClose, hideHeader = false }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [viewMode, setViewMode] = useState("reading"); // "reading" | "quiz"
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [isError, setIsError] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showStatusText, setShowStatusText] = useState("SISTEMA OK");

  const dayNum = activity?.dayNumber || activity?.day_num || activity?.day || 1;
  const questions = (activity?.questions && activity.questions.length > 0)
    ? activity.questions
    : (DEFAULT_COMIC_QUESTIONS[dayNum] || DEFAULT_COMIC_QUESTIONS[1]);
  const missionId = activity?.mission || (dayNum + 6);
  const currentQuestion = questions[currentQIndex];

  const lastQRef = useRef(null);

  useEffect(() => {
    const qKey = `${dayNum}-${currentQIndex}-${currentQuestion?.id || currentQuestion?.text || 'def'}`;
    if (lastQRef.current === qKey && shuffledOptions.length > 0) return;
    lastQRef.current = qKey;

    setSelectedOptionId(null);
    setIsError(false);
    setShowSolution(false);
    setShowStatusText("SISTEMA OK");

    if (currentQuestion?.options && currentQuestion.options.length > 0) {
      setShuffledOptions(shuffle(currentQuestion.options));
    } else {
      setShuffledOptions([]);
    }
  }, [currentQIndex, dayNum, currentQuestion?.id, currentQuestion?.text]);

  const handleOptionClick = (option) => {
    if (showSolution) return;
    setSelectedOptionId(option.id);
    setIsError(false);

    if (option.is_correct) {
      soundFx.playLaser();
      soundFx.playSuccess();
      setShowStatusText("VERIFICACIÓN EXITOSA");
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
          setSelectedOptionId(null);
          setShowStatusText("SISTEMA OK");
        } else {
          soundFx.playCoin();
          soundFx.playStreakBonus();
          onComplete(10, 10, mistakes); // 10 XP, 10 Coins, mistakes
        }
      }, 1200);
    } else {
      soundFx.playError();
      setMistakes((prev) => prev + 1);
      setIsError(true);
      setShowSolution(true);
      setShowStatusText("FALLO DE AUTENTICACIÓN");
    }
  };

  const handleNextAfterError = () => {
    setShowSolution(false);
    setIsError(false);
    setSelectedOptionId(null);
    setShowStatusText("SISTEMA OK");
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      soundFx.playCoin();
      soundFx.playStreakBonus();
      onComplete(10, 10, mistakes);
    }
  };

  const correctOption = currentQuestion?.options?.find(o => o.is_correct);
  const selectedUserOption = currentQuestion?.options?.find(o => o.id === selectedOptionId);

  return (
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 760, width: "100%", padding: "16px 20px", position: "relative", margin: "auto" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 8 }}>
          <div style={{ textAlign: "left" }}>
            <span className="dashboard-kicker" style={{ color: "#ffd166", textTransform: "uppercase", fontSize: "0.78rem", fontWeight: "bold" }}>
              Etapa 3: Bitácora y Lectura de Cómic
            </span>
            <h2 style={{ margin: "3px 0 0 0", color: "#b8fff9", fontSize: "1.4rem" }}>{activity?.title || "Lectura de Cómic"}</h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 14px", background: "linear-gradient(135deg, #ff6b6b, #ee5a6f)" }}>
            Cerrar X
          </button>
        </div>
      )}

      {viewMode === "reading" ? (
        <div>
          <p style={{ color: "#9be6df", fontSize: "0.9rem", marginBottom: 14, textAlign: "left" }}>
            📂 Analiza las bitácoras del tripulante en inglés y español antes de comenzar el cuestionario de acceso.
          </p>

          {/* Comic panels grid */}
          <div 
            className="comic-grid" 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: 14, 
              marginBottom: 16 
            }}
          >
            {(DEFAULT_COMIC_PANELS[dayNum] || DEFAULT_COMIC_PANELS[1]).map((panel, idx) => (
              <div 
                key={idx} 
                className="comic-card" 
                style={{ 
                  background: "rgba(0, 0, 0, 0.35)", 
                  border: "1.5px solid rgba(184, 255, 249, 0.15)", 
                  borderRadius: 12, 
                  padding: 14, 
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease"
                }}
              >
                {/* Visual Novel layout Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(184, 255, 249, 0.1)", paddingBottom: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: "1.2rem" }}>📄</span>
                  <h4 style={{ color: "#ffd166", margin: 0, fontSize: "0.9rem", fontWeight: "bold" }}>{panel.title}</h4>
                </div>

                {/* Floating Vector crewmate icon based on panel theme */}
                <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center", margin: "6px 0" }}>
                  <div className="floating-crewmate" style={{ display: "flex", justifyContent: "center" }}>
                    <img 
                      src={ReclutaPrincipal} 
                      alt="Recluta" 
                      style={{ 
                        width: "75px", 
                        height: "75px",
                        filter: idx % 2 === 0 ? "hue-rotate(130deg) saturate(1.5)" : "none",
                        objectFit: "contain"
                      }} 
                    />
                  </div>
                  <span style={{ fontSize: "1.8rem" }}>{panel.illustration}</span>
                </div>

                <p style={{ margin: "8px 0", fontSize: "0.9rem", color: "#e6f7ff", lineHeight: "1.3" }}>
                  "{panel.text}"
                </p>
                <div 
                  className="speech-bubble" 
                  style={{ 
                    background: "rgba(184, 255, 249, 0.08)", 
                    borderRadius: 8, 
                    padding: "8px 10px", 
                    marginTop: 8,
                    fontWeight: "600",
                    color: "#b8fff9",
                    border: "1px solid rgba(184, 255, 249, 0.15)",
                    fontSize: "0.85rem"
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
                padding: "12px 24px", 
                fontSize: "1rem",
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
        <div style={{ textAlign: "left", padding: "5px 0" }}>
          {currentQuestion ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.82rem", marginBottom: 10 }}>
                <span>PREGUNTA: {currentQIndex + 1} de {questions.length}</span>
                <span>ESTADO CONSOLA: <strong style={{ color: showSolution ? "#ef4444" : isError ? "#ff6b6b" : "#2ec4b6" }}>{showStatusText}</strong></span>
              </div>

              {/* Question Status Area */}
              <div 
                style={{ 
                  background: showSolution 
                    ? "rgba(239, 68, 68, 0.08)" 
                    : selectedOptionId && !isError 
                      ? "rgba(46, 196, 182, 0.08)" 
                      : "rgba(0, 0, 0, 0.4)", 
                  border: showSolution 
                    ? "2px solid #ef4444" 
                    : selectedOptionId && !isError 
                      ? "2px solid #2ec4b6" 
                      : "1.5px solid rgba(184, 255, 249, 0.2)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 14,
                  position: "relative",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="floating-crewmate">
                    <img 
                      src={ReclutaPrincipal} 
                      alt="Recluta Principal" 
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        filter: showSolution 
                          ? "hue-rotate(130deg) saturate(1.5) drop-shadow(0 0 8px #ff6b6b)" 
                          : selectedOptionId && !isError 
                            ? "hue-rotate(85deg) saturate(1.6) drop-shadow(0 0 8px #2ec4b6)" 
                            : "drop-shadow(0 0 6px rgba(0, 245, 255, 0.35))",
                        objectFit: "contain",
                        transition: "all 0.3s ease"
                      }} 
                    />
                  </div>
                  <h3 style={{ color: "#e6f7ff", margin: 0, fontSize: "1rem", lineHeight: "1.4" }}>
                    {currentQuestion.text}
                  </h3>
                </div>
              </div>

              {/* Quiz Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {shuffledOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isRightOpt = showSolution && opt.is_correct;
                  const isWrongOpt = showSolution && isSelected && !opt.is_correct;

                  let borderStyle = "1px solid rgba(255, 255, 255, 0.15)";
                  let bgStyle = "rgba(255, 255, 255, 0.04)";
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
                    borderStyle = "2px solid #2ec4b6";
                    bgStyle = "rgba(46, 196, 182, 0.25)";
                    colorStyle = "#b8fff9";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt)}
                      disabled={showSolution}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: borderStyle,
                        background: bgStyle,
                        color: colorStyle,
                        textAlign: "left",
                        fontSize: "0.88rem",
                        fontWeight: "600",
                        cursor: showSolution ? "default" : "pointer",
                        margin: 0,
                        transition: "all 0.2s ease",
                        display: "flex",
                        justify: "space-between",
                        alignItems: "center"
                      }}
                      className="quiz-option-btn"
                    >
                      <span>🚀 {opt.text}</span>
                      {isRightOpt && <span style={{ fontWeight: "bold", color: "#2ec4b6" }}>✔️ CORRECTO</span>}
                      {isWrongOpt && <span style={{ fontWeight: "bold", color: "#ef4444" }}>❌ TU ELECCIÓN</span>}
                    </button>
                  );
                })}
              </div>

              {/* EXPLICIT ERROR FEEDBACK PANEL WITH CONTINUATION BUTTON */}
              {showSolution && (
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
                    💥 ¡RESPUESTA INCORRECTA REGISTRADA! (-0.75 pts)
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px 14px", borderRadius: 10, textAlign: "left", marginBottom: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ color: "#fca5a5", fontSize: "0.88rem", marginBottom: 4 }}>
                      ❌ <strong>Tu respuesta:</strong> {selectedUserOption?.text || "Incorrecta"}
                    </div>
                    <div style={{ color: "#2ec4b6", fontSize: "0.92rem", fontWeight: "bold" }}>
                      ✔️ <strong>Respuesta Correcta de la Bitácora:</strong> {correctOption?.text}
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
                    💡 ENTENDIDO - CONTINUAR A LA SIGUIENTE PREGUNTA ➔
                  </button>
                </div>
              )}

              {!showSolution && selectedOptionId && !isError && (
                <div style={{ marginTop: 12, color: "#2ec4b6", fontWeight: "bold", textAlign: "center", fontSize: "0.88rem" }}>
                  📡 TRANSMISIÓN OK: Avanzando...
                </div>
              )}
            </div>
          ) : (
            <p>No hay preguntas disponibles en esta actividad.</p>
          )}

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
            <button className="btn-cancel" onClick={() => setViewMode("reading")} style={{ margin: 0, padding: "6px 14px", fontSize: "0.82rem" }}>
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
    mission: PropTypes.number,
    day_num: PropTypes.number
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  hideHeader: PropTypes.bool
};

