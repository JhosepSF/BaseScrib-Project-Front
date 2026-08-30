import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AvatarShowcase from "./AvatarShowcase";
import { soundFx } from "../utils/soundEffects";
import RecluteHUD from "./RecluteHUD";
import { RoomCalibratorTool } from "./RoomCalibratorTool";
import PortalGateway from "./PortalGateway";
import naveDentroImage from "../../assets/amongus/Nave_dentro_16_9.jpg";
import sparkyOpenOpen from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA ABIERTA.png";
import sparkyOpenClosed from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA CERRADA.png";
import sparkyClosedOpen from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS CERRADOS - BOCA ABIERTA.png";
import sparkyClosedClosed from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS CERRADOS- BOCA CERRADA.png";
import cofreCerrado from "../../assets/amongus/COFRE/COFRE CERRADO.png";
import cofreEtapa1 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 1.png";
import cofreEtapa2 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 2.png";
import cofreEtapa3 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 3.png";
import cofreEtapa4 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 4.png";
import cofreEtapa5 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 5.png";
import cofreAbierto from "../../assets/amongus/COFRE/COFRE ABIERTO.png";
import "../../styles/SpaceStation.css";
import "../../styles/RoomActivityPanel3D.css";

const missionBriefings = {
  1: {
    grammar: "Verb To Be (am/is/are), Preferences (like/favorite), Abilities (can)",
    vocabulary: [
      { en: "recruit", es: "recluta" },
      { en: "spaceship", es: "nave espacial" },
      { en: "planet", es: "planeta" },
      { en: "crew", es: "tripulación" },
      { en: "name", es: "nombre" },
      { en: "age", es: "edad" },
      { en: "country", es: "país" },
      { en: "favorite", es: "favorito" },
      { en: "like", es: "gustar" },
      { en: "can", es: "poder" },
      { en: "fly", es: "volar" },
      { en: "repair", es: "reparar" }
    ],
    objective: "Presentarte ante el General: comparte tu nombre, edad, país de origen, tu color favorito y tus habilidades técnicas."
  },
  2: {
    grammar: "There is / There are (singular vs plural, articles a / an)",
    vocabulary: [
      { en: "alien", es: "alienígena" },
      { en: "robot", es: "robot" },
      { en: "table", es: "mesa" },
      { en: "chair", es: "silla" },
      { en: "book", es: "libro" },
      { en: "computer", es: "computadora" },
      { en: "photo", es: "foto" },
      { en: "star", es: "estrella" },
      { en: "spacesuit", es: "traje espacial" },
      { en: "helmet", es: "casco" }
    ],
    objective: "Explorar la base Basescrib: recorre los módulos de estudio y la cabina espacial para identificar objetos y suministros."
  },
  3: {
    grammar: "Present Simple (Routines, He/She/It + verb + s/es)",
    vocabulary: [
      { en: "wake up", es: "despertarse" },
      { en: "train", es: "entrenar" },
      { en: "study", es: "estudiar" },
      { en: "clean", es: "limpiar" },
      { en: "eat", es: "comer" },
      { en: "write", es: "escribir" },
      { en: "sleep", es: "dormir" },
      { en: "schedule", es: "horario" },
      { en: "inspect", es: "inspeccionar" },
      { en: "monitor", es: "monitorear" }
    ],
    objective: "Inspeccionar rutinas de la tripulación en Base ONE: descubre qué hacen los tripulantes cada día y organiza tu horario espacial."
  },
  4: {
    grammar: "Present Continuous (Subject + am/is/are + verb + ing)",
    vocabulary: [
      { en: "studying", es: "estudiando" },
      { en: "cleaning", es: "limpiando" },
      { en: "reading", es: "leyendo" },
      { en: "writing", es: "escribiendo" },
      { en: "eating", es: "comiendo" },
      { en: "talking", es: "conversando" },
      { en: "working", es: "trabajando" },
      { en: "drawing", es: "dibujando" },
      { en: "repairing", es: "reparando" },
      { en: "scanning", es: "escaneando" }
    ],
    objective: "Supervisar las tareas activas de la nave: ante la emergencia, reporta las acciones en desarrollo de cada recluta justo ahora."
  },
  5: {
    grammar: "Adverbs of Frequency (always, sometimes, never), How often, What time",
    vocabulary: [
      { en: "always", es: "siempre" },
      { en: "sometimes", es: "a veces" },
      { en: "never", es: "nunca" },
      { en: "wake up", es: "despertarse" },
      { en: "train", es: "entrenar" },
      { en: "help", es: "ayudar" },
      { en: "meet", es: "reunirse" },
      { en: "study", es: "estudiar" },
      { en: "explore", es: "explorar" },
      { en: "sleep", es: "dormir" }
    ],
    objective: "Auditar los horarios de órbita: comparte con el nuevo recluta con qué frecuencia realizas las tareas clave de la base."
  },
  6: {
    grammar: "Verb To Have (have / has / don't have / doesn't have)",
    vocabulary: [
      { en: "have", es: "tener (yo/tú/nosotros/ellos)" },
      { en: "has", es: "tener (él/ella)" },
      { en: "don't have", es: "no tener" },
      { en: "doesn't have", es: "no tener (3ra pers.)" },
      { en: "toolkit", es: "caja de herramientas" },
      { en: "oxygen tank", es: "tanque de oxígeno" },
      { en: "key code", es: "código de acceso" },
      { en: "scanner", es: "escáner" },
      { en: "energy cell", es: "célula de energía" },
      { en: "supplies", es: "suministros" }
    ],
    objective: "Realizar la auditoría de inventario en Base ONE: verifica qué herramientas y suministros tiene o no la tripulación."
  },
  7: {
    grammar: "Wh-Questions (What, Where, When, Who, Why, How)",
    vocabulary: [
      { en: "what", es: "qué / cuál" },
      { en: "where", es: "dónde" },
      { en: "when", es: "cuándo" },
      { en: "who", es: "quién" },
      { en: "why", es: "por qué" },
      { en: "how", es: "cómo" },
      { en: "signal", es: "señal" },
      { en: "frequency", es: "frecuencia" },
      { en: "origin", es: "origen" },
      { en: "meaning", es: "significado" }
    ],
    objective: "Investigar la transmisión alienígena desconocida: formula y responde preguntas clave sobre el origen del mensaje."
  },
  8: {
    grammar: "Possessive Adjectives (my, your, his, her) & Possessive Pronouns (mine, yours, his, hers)",
    vocabulary: [
      { en: "my", es: "mi" },
      { en: "your", es: "tu" },
      { en: "his", es: "su (de él)" },
      { en: "her", es: "su (de ella)" },
      { en: "mine", es: "mío/mía" },
      { en: "yours", es: "tuyo/tuya" },
      { en: "hers", es: "suyo/suya (de ella)" },
      { en: "visor", es: "visor" },
      { en: "helmet", es: "casco" },
      { en: "badge", es: "insignia" }
    ],
    objective: "Identificar pertenencias perdidas en el laboratorio: determina a quién pertenece cada equipo encontrado."
  },
  9: {
    grammar: "Personal & Object Pronouns (me, him, her, us, them)",
    vocabulary: [
      { en: "me", es: "mí / me" },
      { en: "him", es: "él / lo / le" },
      { en: "her", es: "ella / la / le" },
      { en: "us", es: "nosotros / nos" },
      { en: "them", es: "ellos / los / les" },
      { en: "transmission", es: "transmisión" },
      { en: "channel", es: "canal" },
      { en: "call", es: "llamar" },
      { en: "answer", es: "responder" },
      { en: "coordinates", es: "coordenadas" }
    ],
    objective: "Establecer comunicaciones directas con Base ONE: envía señales y mensajes a los miembros de la tripulación."
  },
  10: {
    grammar: "Demonstrative Pronouns (This, That, These, Those)",
    vocabulary: [
      { en: "this", es: "este / esta (cerca)" },
      { en: "that", es: "ese / esa / aquel (lejos)" },
      { en: "these", es: "estos / estas (cerca)" },
      { en: "those", es: "esos / esas / aquellos (lejos)" },
      { en: "simulator", es: "simulador" },
      { en: "shield", es: "escudo" },
      { en: "console", es: "consola" },
      { en: "deck", es: "cubierta" },
      { en: "controls", es: "controles" },
      { en: "quantum", es: "cuántico" }
    ],
    objective: "Explorar la cubierta de simulación: identifica los equipos de entrenamiento según su distancia y número."
  },
  11: {
    grammar: "Quantifiers (How many / How much, some, any, a lot of)",
    vocabulary: [
      { en: "how many", es: "cuántos/cuántas (contable)" },
      { en: "how much", es: "cuánto/cuánta (incontable)" },
      { en: "some", es: "algunos / algo de" },
      { en: "any", es: "alguno / ningún / cualquier" },
      { en: "a lot of", es: "mucho / gran cantidad de" },
      { en: "fuel", es: "combustible" },
      { en: "plasma", es: "plasma" },
      { en: "energy", es: "energía" },
      { en: "reserves", es: "reservas" },
      { en: "water", es: "agua" }
    ],
    objective: "Calcular las reservas de plasma y energía cuántica: realiza el inventario cuantitativo para el viaje interestelar."
  },
  12: {
    grammar: "Descriptive Adjectives (tall, fast, luminous, intelligent, bio-mechanic)",
    vocabulary: [
      { en: "tall", es: "alto" },
      { en: "fast", es: "rápido" },
      { en: "luminous", es: "luminoso" },
      { en: "intelligent", es: "inteligente" },
      { en: "bio-mechanic", es: "biomecánico" },
      { en: "friendly", es: "amigable" },
      { en: "blue", es: "azul" },
      { en: "companion", es: "compañero" },
      { en: "creature", es: "criatura" },
      { en: "species", es: "especie" }
    ],
    objective: "Catalogar a los acompañantes de Scribtonia: redacta informes descriptivos de las especies recién descubiertas."
  },
  13: {
    grammar: "Comparatives (-er / more) & Superlatives (-est / most)",
    vocabulary: [
      { en: "bigger", es: "más grande que" },
      { en: "smaller", es: "más pequeño que" },
      { en: "faster", es: "más rápido que" },
      { en: "biggest", es: "el más grande" },
      { en: "fastest", es: "el más rápido" },
      { en: "most powerful", es: "el más poderoso" },
      { en: "planet", es: "planeta" },
      { en: "starship", es: "nave estelar" },
      { en: "galaxy", es: "galaxia" },
      { en: "solar system", es: "sistema solar" }
    ],
    objective: "Comparar datos astronómicos y naves espacial: evalúa el tamaño, velocidad y alcance de cuerpos celestes."
  },
  14: {
    grammar: "Prepositions of Place (next to, behind, in front of, between, inside)",
    vocabulary: [
      { en: "next to", es: "al lado de" },
      { en: "behind", es: "detrás de" },
      { en: "in front of", es: "delante de" },
      { en: "between", es: "entre (dos objetos)" },
      { en: "inside", es: "dentro de" },
      { en: "vault", es: "bóveda" },
      { en: "medal", es: "medalla" },
      { en: "graduation", es: "graduación" },
      { en: "commander", es: "comandante" },
      { en: "coordinates", es: "coordenadas" }
    ],
    objective: "Localizar las coordenadas finales y graduación: encuentra la medalla en la bóveda central y completa la formación."
  }
};

const getActivityMetadata = (id) => {
  const gameType = ((id - 1) % 5) + 1;
  switch (gameType) {
    case 1: return { icon: "📖", name: "Comic" };
    case 2: return { icon: "🚀", name: "Launch" };
    case 3: return { icon: "🔋", name: "Recovery" };
    case 4: return { icon: "🔧", name: "Repair" };
    case 5: return { icon: "✍️", name: "Writing" };
    default: return { icon: "👾", name: "Game" };
  }
};

// =========================================================================
// REGULADOR DE TAMAÑO / ESCALA EN CÓDIGO PARA EL PORTAL DEL VALLE DE PORTALES
// Cambia este valor para aumentar o reducir el tamaño del espiral en la vista 3D:
// Ejemplos: 1.0 (pequeño), 2.0 (mediano), 3.0 (GRANDE), 4.0 (GIGANTE)
// =========================================================================
export const VALLE_PORTALES_SCALE = 2.3;

const ROOM_ZONES = [
  { id: "bitacora", label: "📋 BITÁCORA", x: 299, y: 238, width: 240, height: 356, color: "#ff007f", transform: "perspective(700px) rotateX(1deg) rotateY(16deg) rotateZ(-0.2deg) skewY(7.6deg)", transformOrigin: "top left" },
  { id: "tabs_dias", label: "📅 TABS DÍAS", x: 408, y: 660, width: 256, height: 145, color: "#00f0ff", transform: "perspective(400px) rotateX(2deg) rotateY(8deg) rotateZ(-3deg) skewX(13deg) skewY(-2deg)", transformOrigin: "center left" },
  { id: "racha", label: "🔥 RACHA", x: 1462, y: 637, width: 148, height: 102, color: "#ff5500", transform: "perspective(1200px) rotateX(14deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)", transformOrigin: "center right" },
  { id: "misiones", label: "🚀 MISIONES", x: 1614, y: 624, width: 270, height: 140, color: "#39ff14", transform: "perspective(1200px) rotateX(14deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)", transformOrigin: "center right" },
  { id: "monedas", label: "🪙 MONEDAS", x: 1912, y: 662, width: 195, height: 122, color: "#ffd700", transform: "perspective(1200px) rotateX(10deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)", transformOrigin: "center right" },
  { id: "vocabulario", label: "🔤 VOCABULARIO", x: 2130, y: 150, width: 380, height: 425, color: "#bf00ff", transform: "perspective(700px) rotateX(0deg) rotateY(-14deg) rotateZ(0deg) skewY(-4deg)", transformOrigin: "top left" },
  { id: "valle_portales", label: "🌀 ESPIRAL VALLE DE PORTALES", x: 1180, y: 220, width: 260, height: 260, color: "#f72585" },
  { id: "avatar", label: "👤 AVATAR (PERSONAJE + PET + PLACA)", x: 600, y: 190, width: 850, height: 1090, color: "#ffff00" },
  { id: "cofre", label: "🎁 COFRE TIENDA", x: 145, y: 810, width: 640, height: 640, color: "#ff00aa" },
  { id: "robot", label: "🤖 ROBOT SPARKY", x: 1680, y: 738, width: 750, height: 750, color: "#00ffaa" }
];

export function RoomActivityPanel3D({
  user,
  activities,
  completedList,
  selectedDay,
  setSelectedDay,
  onStartGame,
  onToggleViewMode,
  onOpenStore,
  onOpenInventory,
  onOpenRank,
  onOpenEval,
  onOpenVallePortales,
  onLogout
}) {
  const [sparkyPhrase, setSparkyPhrase] = useState("¡Buen trabajo, recluta! Continúa con la misión.");
  const [showCalibrator, setShowCalibrator] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'bitacora' | 'misiones' | 'vocabulario' | 'racha' | 'monedas'
  const [dayPage, setDayPage] = useState(0); // 0 = D1-D4, 1 = D5-D8, 2 = D9-D10
  const [isPortalHovered, setIsPortalHovered] = useState(false);

  // COFRE ANIMATION STATES
  const cofreFrames = [
    cofreCerrado,
    cofreEtapa1,
    cofreEtapa2,
    cofreEtapa3,
    cofreEtapa4,
    cofreEtapa5,
    cofreAbierto
  ];
  const [cofreFrameIndex, setCofreFrameIndex] = useState(0);
  const [isOpeningCofre, setIsOpeningCofre] = useState(false);

  const handleCofreClick = (e) => {
    if (e) e.stopPropagation();
    if (isOpeningCofre || showCalibrator) return;

    soundFx.playClick();
    setIsOpeningCofre(true);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step < cofreFrames.length) {
        setCofreFrameIndex(step);
      } else {
        clearInterval(interval);
        if (onOpenStore) onOpenStore();
        setTimeout(() => {
          setCofreFrameIndex(0);
          setIsOpeningCofre(false);
        }, 300);
      }
    }, 85);
  };

  // NATURAL ROBOT TALKING SEQUENCE (eyes open mouth toggle + occasional blink)
  const talkingSequence = [
    sparkyOpenClosed, // 0. Ojos abiertos - Boca cerrada (Reposo / Sílaba cerrada)
    sparkyOpenOpen,   // 1. Ojos abiertos - Boca abierta (Hablando)
    sparkyOpenClosed, // 2. Ojos abiertos - Boca cerrada
    sparkyOpenOpen,   // 3. Ojos abiertos - Boca abierta
    sparkyOpenClosed, // 4. Ojos abiertos - Boca cerrada
    sparkyOpenOpen,   // 5. Ojos abiertos - Boca abierta
    sparkyClosedClosed,// 6. Parpadeo natural (Ojos cerrados - Boca cerrada)
    sparkyOpenOpen    // 7. Ojos abiertos - Boca abierta
  ];

  const [seqIndex, setSeqIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTalking, setIsTalking] = useState(false);

  const sparkyPhrases = [
    "¡Buen trabajo, recluta! Continúa con la misión.",
    "Focus, recruit! You can do it!",
    "Great job! La constancia te llevará a la victoria.",
    "¡La base espacial cuenta con tus habilidades!",
    "¿Buscando accesorios? ¡Haz clic en el cofre para abrir la Tienda!",
    "¡Explora la Bitácora a tu izquierda para revisar el tema del día!",
    "Remember: Practice makes perfect. Keep up the great work!",
    "¡Completa las actividades diarias para ganar XP y Monedas!"
  ];

  const changeRobotPhrase = (isUserAction = false) => {
    if (isUserAction) {
      soundFx.playClick();
    }
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * sparkyPhrases.length);
    } while (sparkyPhrases[nextIndex] === sparkyPhrase && sparkyPhrases.length > 1);
    setSparkyPhrase(sparkyPhrases[nextIndex]);
  };

  const handleRobotClick = (e) => {
    if (e) e.stopPropagation();
    changeRobotPhrase(true);
  };

  // 1. Phrase Rotation Timer (Every 12 seconds - SILENT)
  useEffect(() => {
    const intervalId = setInterval(() => {
      changeRobotPhrase(false);
    }, 12000);
    return () => clearInterval(intervalId);
  }, [sparkyPhrase]);

  // 2. Typewriter Effect + Frame Switching Animation
  useEffect(() => {
    let charIndex = 0;
    setDisplayedText("");
    setIsTalking(true);

    const textInterval = setInterval(() => {
      if (charIndex < sparkyPhrase.length) {
        setDisplayedText(sparkyPhrase.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(textInterval);
        setIsTalking(false);
        setSeqIndex(0); // Return to idle open-eyes closed-mouth frame (Index 0)
      }
    }, 42);

    const frameInterval = setInterval(() => {
      if (charIndex < sparkyPhrase.length) {
        setSeqIndex((prev) => (prev + 1) % talkingSequence.length);
      } else {
        clearInterval(frameInterval);
      }
    }, 170); // 170ms cadence for smooth, natural speech movement

    return () => {
      clearInterval(textInterval);
      clearInterval(frameInterval);
    };
  }, [sparkyPhrase]);

  const dayActivities = activities.filter(act => act.day_num === selectedDay);





  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#020108", overflow: "hidden", zIndex: 100 }}>

      {/* TOP HUD BAR */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <RecluteHUD
          user={user}
          onOpenStore={onOpenStore}
          onOpenRank={onOpenRank}
          onOpenEval={onOpenEval}
          onOpenInventory={onOpenInventory}
          onLogout={onLogout}
        />
      </div>

      {/* TOP BAR CONTROLS */}
      <div style={{ position: "absolute", top: 75, left: 20, zIndex: 999, display: "flex", gap: 10 }}>
        <button
          onClick={onToggleViewMode}
          style={{
            padding: "6px 14px",
            background: "rgba(10, 25, 45, 0.9)",
            border: "1.5px solid #9be6df",
            borderRadius: "20px",
            color: "#9be6df",
            fontWeight: "bold",
            fontSize: "0.75rem",
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(46, 196, 182, 0.4)"
          }}
        >
          🖥️ Volver a Vista Clásica
        </button>

        <button
          onClick={() => setShowCalibrator(!showCalibrator)}
          style={{
            padding: "6px 14px",
            background: showCalibrator ? "#f72585" : "rgba(10, 25, 45, 0.9)",
            border: showCalibrator ? "2px solid #ffffff" : "1.5px solid #f72585",
            borderRadius: "20px",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.75rem",
            cursor: "pointer",
            boxShadow: showCalibrator ? "0 0 25px #f72585" : "0 0 15px rgba(247, 37, 133, 0.4)"
          }}
        >
          👁️ {showCalibrator ? "Ocultar Zonas / Modo Calibración" : "👁️ Ver Zonas de Calibración"}
        </button>
      </div>



      {/* HOLOGRAPHIC ZOOM DETAIL MODAL */}
      {activeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(2, 6, 18, 0.82)",
            backdropFilter: "blur(12px)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(10, 25, 50, 0.96) 0%, rgba(5, 12, 28, 0.98) 100%)",
              border: "2px solid #2ec4b6",
              borderRadius: "24px",
              padding: "30px 36px",
              maxWidth: "650px",
              width: "90%",
              color: "#e6f7ff",
              boxShadow: "0 0 60px rgba(46, 196, 182, 0.5), inset 0 0 30px rgba(46, 196, 182, 0.2)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: "absolute",
                top: 18,
                right: 22,
                background: "#f72585",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: 36,
                height: 36,
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(247, 37, 133, 0.6)"
              }}
            >
              ✖
            </button>

            {/* BITACORA MODAL CONTENT */}
            {activeModal === "bitacora" && (
              <div>
                <h2 style={{ margin: "0 0 16px 0", color: "#ffd166", fontSize: "24px", display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid rgba(255,209,102,0.4)", paddingBottom: "10px" }}>
                  📋 MISIÓN DÍA {selectedDay} (BITÁCORA DE A BORDO)
                </h2>
                <div style={{ margin: "16px 0", fontSize: "17px", lineHeight: "1.6", color: "#e6f7ff" }}>
                  <strong style={{ color: "#2ec4b6", fontSize: "18px" }}>Objetivo Principal:</strong>
                  <p style={{ marginTop: 6, background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: "12px", borderLeft: "4px solid #2ec4b6" }}>
                    {missionBriefings[selectedDay]?.objective}
                  </p>
                </div>
                <div style={{ margin: "16px 0", fontSize: "17px", lineHeight: "1.6" }}>
                  <strong style={{ color: "#ffd166", fontSize: "18px" }}>Enfoque Gramatical:</strong>
                  <p style={{ marginTop: 6, color: "#b8fff9", background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: "12px", borderLeft: "4px solid #ffd166" }}>
                    {missionBriefings[selectedDay]?.grammar}
                  </p>
                </div>
              </div>
            )}

            {/* MISIONES MODAL CONTENT */}
            {activeModal === "misiones" && (
              <div>
                <h2 style={{ margin: "0 0 16px 0", color: "#2ec4b6", fontSize: "24px", display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid rgba(46, 196, 182, 0.4)", paddingBottom: "10px" }}>
                  🚀 ACTIVIDADES Y DESAFÍOS DÍA {selectedDay}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "20px 0" }}>
                  {dayActivities.map((act) => {
                    const isCompleted = !!completedList[act.id];
                    const meta = getActivityMetadata(act.id);
                    return (
                      <div
                        key={act.id}
                        onClick={() => { setActiveModal(null); onStartGame(act); }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: isCompleted ? "rgba(46, 196, 182, 0.2)" : "rgba(255, 255, 255, 0.08)",
                          border: isCompleted ? "1.5px solid #2ec4b6" : "1.5px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "14px",
                          padding: "12px 18px",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <span style={{ fontSize: "28px" }}>{meta.icon}</span>
                          <div>
                            <h4 style={{ margin: 0, color: "#e6f7ff", fontSize: "17px" }}>{act.title}</h4>
                            <span style={{ fontSize: "13px", color: isCompleted ? "#2ec4b6" : "#ffd166" }}>
                              {isCompleted ? "✓ Completado (+XP +Monedas)" : "Pendiente por Iniciar"}
                            </span>
                          </div>
                        </div>
                        <button
                          style={{
                            background: isCompleted ? "#2ec4b6" : "linear-gradient(135deg, #ffd166, #ff9f1c)",
                            border: "none",
                            color: "black",
                            fontWeight: "bold",
                            borderRadius: "10px",
                            padding: "8px 16px",
                            fontSize: "14px",
                            cursor: "pointer"
                          }}
                        >
                          {isCompleted ? "Repasar" : "¡Iniciar!"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VOCABULARIO MODAL CONTENT */}
            {activeModal === "vocabulario" && (
              <div>
                <h2 style={{ margin: "0 0 16px 0", color: "#9be6df", fontSize: "24px", display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid rgba(155, 230, 223, 0.4)", paddingBottom: "10px" }}>
                  🔤 VOCABULARIO CLAVE DÍA {selectedDay}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "20px 0", maxHeight: "360px", overflowY: "auto" }}>
                  {missionBriefings[selectedDay]?.vocabulary.map((vocab, idx) => (
                    <div key={idx} style={{ background: "rgba(255, 255, 255, 0.08)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(155, 230, 223, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "16px", color: "#ffffff" }}>{vocab.en}</strong>
                      <span style={{ fontSize: "15px", color: "#ffd166", fontWeight: "bold" }}>{vocab.es}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RACHA MODAL CONTENT */}
            {activeModal === "racha" && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <h2 style={{ margin: "0 0 16px 0", color: "#ff6b6b", fontSize: "26px" }}>
                  🔥 RACHA ESPACIAL: {user?.streak_count || 0} DÍAS SEGUIDOS
                </h2>
                <p style={{ fontSize: "17px", color: "#e6f7ff", lineHeight: "1.6" }}>
                  ¡Mantén tu racha diaria completando al menos 1 actividad cada día para desbloquear recompensas cósmicas exclusivas!
                </p>
              </div>
            )}

            {/* MONEDAS MODAL CONTENT */}
            {activeModal === "monedas" && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <h2 style={{ margin: "0 0 16px 0", color: "#ffd166", fontSize: "26px" }}>
                  🪙 BALANCE DE MONEDAS: {user?.coins || 0} CRÉDITOS
                </h2>
                <p style={{ fontSize: "17px", color: "#e6f7ff", lineHeight: "1.6" }}>
                  ¡Gana más monedas completando misiones para comprar skins, gafas de colores y mascotas en la Tienda Espacial!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SVG CANVAS CONTAINER: STRICT 2560 x 1440 CANVAS */}
      <svg
        viewBox="0 0 2560 1440"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible"
        }}
      >
        {/* 1. BACKGROUND IMAGE 2560x1440 */}
        <image
          href={naveDentroImage}
          xlinkHref={naveDentroImage}
          x="0"
          y="0"
          width="2560"
          height="1440"
        />

        {/* 2. AVATAR EN EL SUELO (TAPETE BASE ONE ENTRADA) - POSICIÓN Y TAMAÑO EXACTO */}
        <foreignObject x="750" y="450" width="850" height="860" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-avatar-wrapper"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              transform: "scale(3.1)",
              transformOrigin: "bottom center",
              pointerEvents: "none",
              position: "relative"
            }}
          >
            {/* AVATAR SHOWCASE VISUAL EN SU TAMAÑO ORIGINAL */}
            <div style={{ pointerEvents: "none", position: "relative" }}>
              <AvatarShowcase
                outfitId={user?.selected_outfit || "m_base"}
                petId={localStorage.getItem("basescrib_equipped_pet") || "pet_alien_blue"}
                size="large"
                transparent={true}
              />
            </div>

            {/* HITBOX INVISIBLE INDEPENDIENTE SOLO EN EL CENTRO DEL CUERPO DEL AVATAR */}
            <div
              className="mapped-avatar-hitbox"
              onClick={() => { soundFx.playClick(); if (onOpenInventory) onOpenInventory(); }}
              title="¡Haz Clic en tu Avatar para abrir tu Inventario y Armario!"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90px",
                height: "180px",
                cursor: "pointer",
                pointerEvents: "auto",
                zIndex: 10
              }}
            />
          </div>
        </foreignObject>

        {/* 3. COFRE INTERACTIVO DE LA TIENDA - POSICIÓN Y TAMAÑO EXACTO */}
        <foreignObject x="145" y="810" width="640" height="640" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              pointerEvents: "none",
              position: "relative"
            }}
          >
            {/* IMAGEN DEL COFRE EN SU TAMAÑO ORIGINAL */}
            <img
              src={cofreFrames[cofreFrameIndex]}
              alt="Cofre de la Tienda Espacial"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "bottom center",
                filter: isOpeningCofre ? "drop-shadow(0 0 35px #ffd166)" : "drop-shadow(0 0 15px rgba(255, 209, 102, 0.7))",
                transition: "filter 0.2s ease, transform 0.2s ease",
                transform: isOpeningCofre ? "scale(1.08)" : "scale(1)",
                transformOrigin: "bottom center",
                pointerEvents: "none"
              }}
            />

            {/* HITBOX INVISIBLE INDEPENDIENTE SOLO EN EL CUERPO DEL COFRE */}
            <div
              onClick={handleCofreClick}
              title="¡Haz Clic para Abrir el Cofre y Entrar a la Tienda!"
              style={{
                position: "absolute",
                bottom: "0px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "380px",
                height: "300px",
                cursor: "pointer",
                pointerEvents: "auto",
                zIndex: 10
              }}
            />
          </div>
        </foreignObject>

        {/* 4. ROBOT SPARKY (ANIMADO NOVELA VISUAL + BUBBLE HABLA) */}
        <foreignObject x="1680" y="738" width="750" height="750" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", pointerEvents: "none" }}>
            <div
              className="robot-speech-bubble"
              style={{
                position: "absolute",
                top: "180px",
                left: "50px",
                width: "fit-content",
                maxWidth: "300px",
                height: "fit-content",
                fontSize: "20px",
                pointerEvents: "none",
                lineHeight: "1.4",
                boxSizing: "border-box",
                zIndex: 10
              }}
            >
              {displayedText}
              {isTalking && <span style={{ color: "#2ec4b6", fontWeight: "bold", animation: "blink 0.6s infinite" }}>|</span>}
            </div>

            <img
              src={talkingSequence[seqIndex]}
              alt="Robot Sparky Hablando"
              onClick={handleRobotClick}
              title="¡Haz Clic en Sparky para escuchar un consejo espacial!"
              style={{
                position: "absolute",
                top: "110px",
                left: "210px",
                width: "495px",
                height: "495px",
                objectFit: "contain",
                filter: isTalking ? "drop-shadow(0 0 25px rgba(46, 196, 182, 0.9))" : "drop-shadow(0 0 16px rgba(46, 196, 182, 0.7))",
                cursor: "pointer",
                pointerEvents: "auto",
                transition: "filter 0.2s ease, transform 0.15s ease"
              }}
            />
          </div>
        </foreignObject>

        {/* 5. ESPIRAL DEL VALLE DE PORTALES (CAPA FRONTAL TOP PARA NUNCA SER TAPADO) */}
        <foreignObject x="1470" y="290" width="300" height="300" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}
          >
            <div
              className="mapped-portal-gateway-hitbox"
              onClick={(e) => {
                e.stopPropagation();
                if (!showCalibrator) {
                  soundFx.playWarp();
                  if (onOpenVallePortales) onOpenVallePortales();
                }
              }}
              onMouseEnter={() => {
                setIsPortalHovered(true);
                soundFx.playWarp();
              }}
              onMouseLeave={() => setIsPortalHovered(false)}
              title="¡Haz Clic en el Espiral para viajar al Valle de Portales!"
              style={{
                cursor: "pointer",
                pointerEvents: "auto",
                borderRadius: "50%",
                padding: "10px",
                filter: isPortalHovered ? "drop-shadow(0 0 25px rgba(247, 37, 133, 0.95))" : "drop-shadow(0 0 10px rgba(247, 37, 133, 0.35))",
                opacity: isPortalHovered ? 1.0 : 0.88,
                transition: "filter 0.3s ease, opacity 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <PortalGateway
                onOpen={() => {
                  soundFx.playWarp();
                  if (onOpenVallePortales) onOpenVallePortales();
                }}
                scale={VALLE_PORTALES_SCALE}
                showLabel={false}
                is3D={true}
                isHovered={isPortalHovered}
              />
            </div>
          </div>
        </foreignObject>



        {/* 6. CONSOLAS DE PANTALLAS INTERACTIVAS (RENDERIZADAS EN LA CAPA SUPERIOR SUPERIOR DEL SVG PARA NUNCA SER TAPADAS) */}
        {/* BITACORA (Pared Izquierda) */}
        <foreignObject x="299" y="238" width="240" height="356" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-wall-left"
            onClick={(e) => {
              e.stopPropagation();
              if (!showCalibrator) setActiveModal("bitacora");
            }}
            title="Haz Clic para Expandir la Bitácora"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "top left",
              transform: "perspective(700px) rotateX(1deg) rotateY(16deg) rotateZ(-0.2deg) skewY(7.6deg)",
              background: "rgba(10, 25, 45, 0.92)",
              borderRadius: "14px",
              padding: "12px",
              border: "1.5px solid rgba(46, 196, 182, 0.6)",
              boxShadow: "inset 0 0 15px rgba(184, 255, 249, 0.3), 0 0 20px rgba(46, 196, 182, 0.4)",
              cursor: "pointer",
              pointerEvents: "auto"
            }}
          >
            <div className="bitacora-content">
              {missionBriefings[selectedDay] ? (
                <>
                  <h4 style={{ margin: "0 0 6px 0", color: "#ffd166", fontSize: "22px", borderBottom: "1px solid rgba(255,209,102,0.4)", paddingBottom: "4px" }}>
                    📋 MISIÓN DÍA {selectedDay}
                  </h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "20px", lineHeight: "1.3", color: "#e6f7ff" }}>
                    {missionBriefings[selectedDay].objective}
                  </p>
                  <span style={{ color: "#9be6df", fontWeight: "bold", fontSize: "18px" }}>Gramática:</span>
                  <p style={{ margin: "3px 0 0 0", color: "#b8fff9", fontSize: "20px", lineHeight: "1.3" }}>
                    {missionBriefings[selectedDay].grammar}
                  </p>
                </>
              ) : (
                <div style={{ textAlign: "center", marginTop: "15%" }}>
                  <h4 style={{ color: "#ffd166", fontSize: "14px" }}>Misión Día {selectedDay}</h4>
                </div>
              )}
            </div>
          </div>
        </foreignObject>

        {/* TABS DIAS (Consola Izquierda - BASE ONE - 2x2 GRID CON NAVEGACIÓN) */}
        <foreignObject x="408" y="660" width="256.5" height="145" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-console-left"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center left",
              transform: "perspective(400px) rotateX(2deg) rotateY(8deg) rotateZ(-3deg) skewX(13deg) skewY(-2deg)",
              pointerEvents: "auto",
              padding: "4px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%", gap: "4px" }}>
              {/* BOTÓN FLECHA IZQUIERDA (VOLVER) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  setDayPage((prev) => (prev > 0 ? prev - 1 : 3));
                }}
                title="Ver días anteriores"
                style={{
                  width: "28px",
                  height: "100%",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, rgba(46, 196, 182, 0.3), rgba(15, 76, 92, 0.4))",
                  border: "1.5px solid #2ec4b6",
                  color: "#9be6df",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 8px rgba(46, 196, 182, 0.5)",
                  flexShrink: 0,
                  pointerEvents: "auto"
                }}
              >
                ◀
              </button>

              {/* 2x2 GRID DE 4 BOTONES GRANDES */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "4px", flex: 1, height: "100%" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
                  .slice(dayPage * 4, (dayPage + 1) * 4)
                  .map((dayNum) => (
                    <button
                      key={dayNum}
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        setSelectedDay(dayNum);
                      }}
                      className={`day-btn-3d ${selectedDay === dayNum ? "active" : ""}`}
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        borderRadius: "6px",
                        background: selectedDay === dayNum ? "linear-gradient(135deg, #2ec4b6, #0f4c5c)" : "rgba(10, 25, 45, 0.9)",
                        border: selectedDay === dayNum ? "2px solid #b8fff9" : "1.5px solid rgba(46, 196, 182, 0.5)",
                        color: selectedDay === dayNum ? "#ffffff" : "#9be6df",
                        boxShadow: selectedDay === dayNum ? "0 0 15px rgba(46, 196, 182, 0.9)" : "inset 0 0 8px rgba(46,196,182,0.3)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "auto"
                      }}
                    >
                      D{dayNum}
                    </button>
                  ))}
              </div>

              {/* BOTÓN FLECHA DERECHA (AVANZAR) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  setDayPage((prev) => (prev + 1) % 4);
                }}
                title="Ver siguientes días"
                style={{
                  width: "28px",
                  height: "100%",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, rgba(255, 209, 102, 0.3), rgba(247, 37, 133, 0.3))",
                  border: "1.5px solid #ffd166",
                  color: "#ffd166",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 8px rgba(255, 209, 102, 0.5)",
                  flexShrink: 0,
                  pointerEvents: "auto"
                }}
              >
                ▶
              </button>
            </div>
          </div>
        </foreignObject>

        {/* RACHA (Consola Derecha - Monitor Izquierdo) */}
        <foreignObject x="1462" y="637" width="148" height="102" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-console-right-left"
            onClick={(e) => { e.stopPropagation(); if (!showCalibrator) setActiveModal("racha"); }}
            title="Haz Clic para Expandir Racha"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center right",
              transform: "perspective(1200px) rotateX(14deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)",
              cursor: "pointer",
              pointerEvents: "auto"
            }}
          >
            <div className="stat-3d-box">
              <span className="val" style={{ color: "#ff6b6b", fontSize: "38px", fontWeight: "bold", textShadow: "0 0 14px rgba(255,107,107,0.9)" }}>
                🔥 {user?.streak_count || 0}d
              </span>
              <span className="lbl" style={{ fontSize: "16px", color: "#ffffff", fontWeight: "bold" }}>Racha</span>
            </div>
          </div>
        </foreignObject>

        {/* MISIONES (Consola Derecha - Monitor Central) */}
        <foreignObject x="1614" y="624" width="270" height="140" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-console-right-center"
            onClick={(e) => { e.stopPropagation(); if (!showCalibrator) setActiveModal("misiones"); }}
            title="Haz Clic para Abrir Lista de Misiones"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center right",
              transform: "perspective(1200px) rotateX(14deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)",
              cursor: "pointer",
              pointerEvents: "auto"
            }}
          >
            <div className="mission-slot-3d">
              {dayActivities.slice(0, 5).map((act) => {
                const isCompleted = !!completedList[act.id];
                const meta = getActivityMetadata(act.id);
                return (
                  <div
                    key={act.id}
                    className={`mini-quest-card ${isCompleted ? "completed" : ""}`}
                    onClick={(e) => { e.stopPropagation(); onStartGame(act); }}
                    title={act.title}
                  >
                    <i style={{ fontSize: "20px" }}>{meta.icon}</i>
                    <span style={{ fontSize: "11px", fontWeight: "bold" }}>{meta.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </foreignObject>

        {/* MONEDAS (Consola Derecha - Monitor Derecho) */}
        <foreignObject x="1912" y="662" width="195" height="122" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-console-right-right"
            onClick={(e) => { e.stopPropagation(); if (!showCalibrator) setActiveModal("monedas"); }}
            title="Haz Clic para Ver Monedas"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center right",
              transform: "perspective(1200px) rotateX(10deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)",
              cursor: "pointer",
              pointerEvents: "auto"
            }}
          >
            <div className="stat-3d-box">
              <span className="val" style={{ color: "#ffd166", fontSize: "38px", fontWeight: "bold", textShadow: "0 0 14px rgba(255,209,102,0.9)" }}>
                🪙 {user?.coins || 0}
              </span>
              <span className="lbl" style={{ fontSize: "16px", color: "#ffffff", fontWeight: "bold" }}>Monedas</span>
            </div>
          </div>
        </foreignObject>

        {/* VOCABULARIO CLAVE (Panel Superior Derecho) */}
        {missionBriefings[selectedDay] && (
          <foreignObject x="2000" y="150" width="380" height="425" style={{ overflow: "visible", pointerEvents: "none" }}>
            <div
              className="mapped-screen mapped-vocab-right"
              onClick={(e) => { e.stopPropagation(); if (!showCalibrator) setActiveModal("vocabulario"); }}
              title="Haz Clic para Expandir Vocabulario Clave"
              style={{
                width: "100%",
                height: "100%",
                transformOrigin: "top left",
                transform: "perspective(700px) rotateX(0deg) rotateY(-14deg) rotateZ(0deg) skewY(-4deg)",
                cursor: "pointer",
                pointerEvents: "auto"
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "25px", borderBottom: "1px solid rgba(155,230,223,0.3)", paddingBottom: "8px" }}>
                🔤 VOCABULARIO CLAVE
              </h4>
              <div style={{ margin: "0 0 10px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {missionBriefings[selectedDay].vocabulary.map((vocab, index) => (
                  <span key={index} style={{ fontSize: "20px", background: "rgba(255,255,255,0.08)", padding: "4px 9px", borderRadius: "10px", color: "#e6f7ff" }}>
                    <strong>{vocab.en}</strong> <span style={{ color: "#ffd166" }}>({vocab.es})</span>
                  </span>
                ))}
              </div>
            </div>
          </foreignObject>
        )}

        {/* 11. STANDALONE MODULAR CALIBRATOR OVERLAY */}
        <RoomCalibratorTool active={showCalibrator} zones={ROOM_ZONES} />

      </svg>
    </div>
  );
}

RoomActivityPanel3D.propTypes = {
  user: PropTypes.object,
  activities: PropTypes.array.isRequired,
  completedList: PropTypes.object.isRequired,
  selectedDay: PropTypes.number.isRequired,
  setSelectedDay: PropTypes.func.isRequired,
  onStartGame: PropTypes.func.isRequired,
  onToggleViewMode: PropTypes.func.isRequired,
  onOpenStore: PropTypes.func,
  onOpenInventory: PropTypes.func,
  onOpenRank: PropTypes.func,
  onOpenEval: PropTypes.func,
  onOpenVallePortales: PropTypes.func,
  onLogout: PropTypes.func
};
