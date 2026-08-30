import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import { ComicGame } from "./ComicGame";
import { SentenceLaunchGame } from "./SentenceLaunchGame";
import { WordRecoveryGame } from "./WordRecoveryGame";
import { ShipRepairGame } from "./ShipRepairGame";
import { WritingGame } from "./WritingGame";
import UnlockMissionModal from "./UnlockMissionModal";
import LeaderboardModal from "./LeaderboardModal";
import PrePostTestModal from "./PrePostTestModal";
import StoreModal from "./StoreModal";
import InventoryModal from "./InventoryModal";
import AbyssModal from "./AbyssModal";
import AvatarShowcase from "./AvatarShowcase";
import ValleDePortalesView from "./ValleDePortalesView";
import { soundFx } from "../utils/soundEffects";
import RecluteHUD from "./RecluteHUD";
import MissionConsole from "./MissionConsole";
import HoloMonitor from "./HoloMonitor";
import PortalGateway from "./PortalGateway";
import { RoomActivityPanel3D } from "./RoomActivityPanel3D";
import naveDentro2D from "../../assets/amongus/Nave_dentro_16_9_2D.jpg";
import "../../styles/SpaceStation.css";

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


export function RoomActivityPanel({ joinedRoom, onBack }) {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [completedList, setCompletedList] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeGame, setActiveGame] = useState(null); // { type, activity }
  const [gameStartTime, setGameStartTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showAbyss, setShowAbyss] = useState(false);
  const [showVallePortales, setShowVallePortales] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testType, setTestType] = useState("pre");
  const [unlockingMission, setUnlockingMission] = useState(null);
  const [unlockedMissionIds, setUnlockedMissionIds] = useState([]);
  const [sparkyPhrase, setSparkyPhrase] = useState("¡Buen trabajo, recluta! Continúa con la misión.");
  const [viewMode, setViewMode] = useState("classic"); // "classic" or "3d"
  const navigate = useNavigate();
  const token = localStorage.getItem("basescrib_token") || "";

  // Sparky phrases rotation
  useEffect(() => {
    const phrases = [
      "¡Buen trabajo, recluta! Continúa con la misión.",
      "Focus, recruit! You can do it!",
      "Great job, keep going!",
      "La constancia es la clave del éxito espacial.",
      "¡No te rindas! La dimensión te necesita.",
      "Aprender un nuevo idioma es como descubrir un nuevo planeta.",
      "¡Estás mejorando muy rápido!",
      "Mantén tu racha activa, recluta."
    ];

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      setSparkyPhrase(phrases[randomIndex]);
    }, 8000); // Change phrase every 8 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Fetch current user and activities
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch User profile to get latest coins/xp
        const userRes = await fetch(`${API_BASE}/users/me/`, { headers });
        if (!userRes.ok) throw new Error("Error cargando perfil");
        const userData = await userRes.json();
        setUser(userData);

        // Fetch Activities
        const actRes = await fetch(`${API_BASE}/activities/`, { headers });
        if (!actRes.ok) throw new Error("Error cargando actividades");
        const actData = await actRes.json();

        // Sort activities by ID or order
        const sortedActs = actData.sort((a, b) => a.id - b.id);
        setActivities(sortedActs);

        // Check writing submissions from backend to see if Activity 5 is submitted
        const subRes = await fetch(`${API_BASE}/writing-submissions/`, { headers });
        let writingSubmitted = false;
        if (subRes.ok) {
          const subData = await subRes.json();
          // if student has any submission, count it as submitted/completed
          const mySubs = subData.filter(s => s.student === userData.id);
          if (mySubs.length > 0) {
            writingSubmitted = true;
          }
        }

        // Load local completion states for games 1-4
        const localData = localStorage.getItem(`completed_acts_${userData.id}`) || "{}";
        const completedMap = JSON.parse(localData);
        if (writingSubmitted) {
          completedMap[5] = true; // Activity 5 is complete/submitted
        }
        setCompletedList(completedMap);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Callback when a game is successfully completed
  const handleGameComplete = async (activityId, xpEarned, coinsEarned) => {
    const duration = gameStartTime ? (Date.now() - gameStartTime) / 1000 : 30.0;
    try {
      // 1. Award rewards in backend
      const res = await fetch(`${API_BASE}/users/award_rewards/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ xp: xpEarned, coins: coinsEarned }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update user state
        setUser(prev => ({
          ...prev,
          xp: data.xp,
          coins: data.coins,
          streak_count: data.streak_count ?? prev?.streak_count ?? 0
        }));
      }

      // 2. Track Event in backend
      await fetch(`${API_BASE}/tracking-events/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student: user.id,
          event_type: "activity_complete",
          metadata: { activity_id: activityId, xp: xpEarned, coins: coinsEarned },
          duration: duration
        }),
      });

      // 3. Send EngagementMetric to backend (so it calculates on the Teacher Dashboard!)
      await fetch(`${API_BASE}/engagement-metrics/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student: user.id,
          metric: "time_on_task",
          value: duration
        }),
      });

      // 4. Update local state and localStorage
      const updatedMap = { ...completedList, [activityId]: true };
      setCompletedList(updatedMap);
      localStorage.setItem(`completed_acts_${user.id}`, JSON.stringify(updatedMap));

      // Close game
      setActiveGame(null);
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };


  if (loading) {
    return (
      <div className="auth-card">
        <p>Cargando panel de actividades...</p>
      </div>
    );
  }

  // Count completed activities for progress bar
  const completedCount = Object.keys(completedList).filter(k => completedList[k]).length;
  const progressPercent = activities.length > 0 ? (completedCount / activities.length) * 100 : 0;

  // Render game overlays
  if (activeGame) {
    const gameType = ((activeGame.activity.id - 1) % 5) + 1;
    let gameComponent = null;

    if (gameType === 1) {
      gameComponent = (
        <ComicGame
          activity={activeGame.activity}
          onComplete={(xp, coins) => handleGameComplete(activeGame.activity.id, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    } else if (gameType === 2) {
      gameComponent = (
        <SentenceLaunchGame
          activity={activeGame.activity}
          onComplete={(xp, coins) => handleGameComplete(activeGame.activity.id, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    } else if (gameType === 3) {
      gameComponent = (
        <WordRecoveryGame
          activity={activeGame.activity}
          onComplete={(xp, coins) => handleGameComplete(activeGame.activity.id, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    } else if (gameType === 4) {
      gameComponent = (
        <ShipRepairGame
          activity={activeGame.activity}
          onComplete={(xp, coins) => handleGameComplete(activeGame.activity.id, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    } else if (gameType === 5) {
      gameComponent = (
        <WritingGame
          activity={activeGame.activity}
          userId={user.id}
          onComplete={(xp, coins) => handleGameComplete(activeGame.activity.id, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    }

    return (
      <div style={{
        backgroundImage: `url(${naveDentro2D})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0, left: 0,
        zIndex: 200,
        overflow: "hidden", // Disable scrolling on full page background
        padding: "15px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center" // Center the mission box vertically
      }}>
        <div style={{
          maxHeight: "94vh",
          overflowY: "auto",
          width: "100%",
          maxWidth: gameType === 1 ? "800px" : "750px",
          borderRadius: "15px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)",
          scrollbarWidth: "thin" // Style for Firefox
        }}>
          {gameComponent}
        </div>
      </div>
    );
  }

  // Helper to get activity icon and subtitle
  const getActivityMetadata = (id) => {
    const gameType = ((id - 1) % 5) + 1;
    switch (gameType) {
      case 1:
        return { icon: "📖", typeName: "Comic Reading", reward: "5 XP / 5 Monedas" };
      case 2:
        return { icon: "🚀", typeName: "Sentence Launch", reward: "10 XP / 10 Monedas" };
      case 3:
        return { icon: "🔋", typeName: "Word Recovery", reward: "10 XP / 10 Monedas" };
      case 4:
        return { icon: "🔧", typeName: "Ship Repair", reward: "10 XP / 10 Monedas" };
      case 5:
        return { icon: "✍️", typeName: "Writing Lab", reward: "15 XP / Transmisión" };
      default:
        return { icon: "👾", typeName: "Game", reward: "10 XP" };
    }
  };

  const dayActivities = activities.filter(act => act.day_num === selectedDay);
  const dayCompletedCount = dayActivities.filter(act => !!completedList[act.id]).length;
  const dayProgressPercent = dayActivities.length > 0 ? (dayCompletedCount / dayActivities.length) * 100 : 0;

  if (viewMode === "3d") {
    return (
      <>
        <RoomActivityPanel3D
          user={user}
          activities={activities}
          completedList={completedList}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          onStartGame={(act) => {
            setActiveGame({ type: act.id, activity: act });
            setGameStartTime(Date.now());
          }}
          onToggleViewMode={() => setViewMode("classic")}
          onOpenStore={() => setShowStore(true)}
          onOpenInventory={() => setShowInventory(true)}
          onOpenRank={() => setShowLeaderboard(true)}
          onOpenEval={() => {
            setTestType("pre");
            setShowTest(true);
          }}
          onOpenVallePortales={() => setShowVallePortales(true)}
          onLogout={onBack}
        />

        {showLeaderboard && (
          <LeaderboardModal
            roomId={joinedRoom?.id}
            token={token}
            onClose={() => setShowLeaderboard(false)}
          />
        )}

        {showStore && (
          <StoreModal
            user={user}
            token={token}
            onClose={() => setShowStore(false)}
            onUserUpdated={(updatedUser) => setUser(updatedUser)}
          />
        )}

        {showInventory && (
          <InventoryModal
            user={user}
            token={token}
            onClose={() => setShowInventory(false)}
            onUserUpdated={(updatedUser) => setUser(updatedUser)}
          />
        )}

        {showVallePortales && (
          <ValleDePortalesView
            user={user}
            token={token}
            onClose={() => setShowVallePortales(false)}
            onUserUpdated={(updatedUser) => setUser(updatedUser)}
          />
        )}

        {showAbyss && (
          <AbyssModal
            user={user}
            token={token}
            selectedDay={selectedDay}
            onClose={() => setShowAbyss(false)}
            onUserUpdated={(updatedUser) => setUser(updatedUser)}
          />
        )}

        {showTest && (
          <PrePostTestModal
            testType={testType}
            user={user}
            token={token}
            onClose={() => setShowTest(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-station-room">
      {/* BACKGROUND & AMBIENT EFFECTS */}
      <img
        src={naveDentro2D}
        className="space-station-room__bg"
        alt="Space Station Interior"
      />
      <div className="space-station-room__overlay" />
      <div className="ambient-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="ambient-particle" />
        ))}
      </div>

      {/* VIEW MODE TOGGLE FLOATING BUTTON */}
      <button
        onClick={() => setViewMode("3d")}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 999,
          padding: "10px 18px",
          background: "linear-gradient(135deg, #f72585, #7209b7)",
          color: "white",
          border: "none",
          borderRadius: "20px",
          fontWeight: "bold",
          fontSize: "0.85rem",
          cursor: "pointer",
          boxShadow: "0 0 15px rgba(247, 37, 133, 0.6)"
        }}
      >
        🌀 Probar Vista 3D Mapeada (Beta)
      </button>

      {/* TOP HUD */}
      <RecluteHUD
        user={user}
        onOpenStore={() => setShowStore(true)}
        onOpenRank={() => setShowLeaderboard(true)}
        onOpenEval={() => {
          setTestType("pre");
          setShowTest(true);
        }}
        onOpenInventory={() => setShowInventory(true)}
        onLogout={onBack}
      />

      {/* MAIN DIEGETIC LAYOUT */}
      <div className="station-layout">

        {/* CENTER CONSOLES (BITACORA, TABS, VOCAB) */}
        <div className="station-layout__middle">

          {/* LEFT MONITOR: BITACORA */}
          {missionBriefings[selectedDay] ? (
            <HoloMonitor icon="📋" title={`BITÁCORA - DÍA ${selectedDay}`}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ color: "#ffd166", fontWeight: "bold" }}>Misión:</span>
                <p style={{ margin: "4px 0", color: "rgba(230, 247, 255, 0.9)" }}>
                  {missionBriefings[selectedDay].objective}
                </p>
              </div>
              <div>
                <span style={{ color: "#ffd166", fontWeight: "bold" }}>Gramática:</span>
                <p style={{ margin: "4px 0", color: "#b8fff9", fontWeight: "600" }}>
                  {missionBriefings[selectedDay].grammar}
                </p>
              </div>
            </HoloMonitor>
          ) : (
            <HoloMonitor icon="🛰️" title={`MISIÓN ACTIVA - DÍA ${selectedDay}`}>
              <p style={{ margin: "4px 0", color: "rgba(230, 247, 255, 0.9)" }}>
                Completa el circuito de los 5 simuladores del Día {selectedDay} para desbloquear la estrella de la lección.
              </p>
            </HoloMonitor>
          )}

          {/* CENTRAL CONSOLE: MISSION TABS AND SLOTS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 15 }}>
            <div className="mission-console__day-tabs">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((dayNum) => (
                <button
                  key={dayNum}
                  onClick={() => { soundFx.playClick(); setSelectedDay(dayNum); }}
                  className={`mission-console__day-tab ${selectedDay === dayNum ? "mission-console__day-tab--active" : ""}`}
                >
                  🚀 Día {dayNum}
                </button>
              ))}
            </div>

            <MissionConsole
              dayActivities={dayActivities}
              completedList={completedList}
              onStartGame={(act) => {
                setActiveGame({ type: act.id, activity: act });
                setGameStartTime(Date.now());
              }}
            />

            <div className="station-progress">
              <div className="station-progress__labels">
                <span>Progreso de Misión (Día {selectedDay})</span>
                <span>{dayCompletedCount} / {dayActivities.length || 5}</span>
              </div>
              <div className="station-progress__bar-bg">
                <div
                  className="station-progress__bar-fill"
                  style={{ width: `${dayProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT MONITOR: VOCABULARY */}
          {missionBriefings[selectedDay] && (
            <HoloMonitor icon="🔤" title="VOCABULARIO CLAVE">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {missionBriefings[selectedDay].vocabulary.map((vocab, index) => (
                  <span key={index} className="vocab-chip" title={vocab.es}>
                    <span className="vocab-chip__en">{vocab.en}</span>
                    <span className="vocab-chip__es">({vocab.es})</span>
                  </span>
                ))}
              </div>
            </HoloMonitor>
          )}

        </div>

        {/* BOTTOM SECTION: AVATAR, SPARKY AND PORTAL */}
        <div className="station-layout__bottom">
          <div className="station-layout__bottom-left">
            <div
              onClick={() => { soundFx.playClick(); setShowInventory(true); }}
              title="¡Haz Clic para abrir tu Armario e Inventario!"
              style={{ pointerEvents: "auto", position: "relative", cursor: "pointer" }}
            >
              <AvatarShowcase
                outfitId={user?.selected_outfit || "m_base"}
                petId={localStorage.getItem("basescrib_equipped_pet") || "pet_alien_blue"}
                size="small"
              />
            </div>

            <div className="sparky-container">
              <div className="sparky-bubble">
                {sparkyPhrase}
              </div>
              <span className="sparky-emoji">🤖</span>
            </div>
          </div>

          <div className="station-layout__bottom-right">
            <PortalGateway onOpen={() => setShowVallePortales(true)} />
          </div>
        </div>

      </div>

      {/* MODAL OVERLAYS */}
      {showVallePortales && (
        <ValleDePortalesView
          user={user}
          token={token}
          onClose={() => setShowVallePortales(false)}
          onUserUpdated={(updatedUser) => setUser(updatedUser)}
        />
      )}

      {showAbyss && (
        <AbyssModal
          user={user}
          token={token}
          selectedDay={selectedDay}
          onClose={() => setShowAbyss(false)}
          onUserUpdated={(updatedUser) => setUser(updatedUser)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          roomId={joinedRoom?.id}
          token={token}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showStore && (
        <StoreModal
          user={user}
          token={token}
          onClose={() => setShowStore(false)}
          onUserUpdated={(updatedUser) => setUser(updatedUser)}
        />
      )}

      {showInventory && (
        <InventoryModal
          user={user}
          token={token}
          onClose={() => setShowInventory(false)}
          onUserUpdated={(updatedUser) => setUser(updatedUser)}
        />
      )}

      {showTest && (
        <PrePostTestModal
          testType={testType}
          user={user}
          token={token}
          onClose={() => setShowTest(false)}
        />
      )}

      {unlockingMission && (
        <UnlockMissionModal
          mission={unlockingMission}
          token={token}
          onClose={() => setUnlockingMission(null)}
          onUnlocked={(mId) => setUnlockedMissionIds([...unlockedMissionIds, mId])}
        />
      )}
    </div>
  );
}

RoomActivityPanel.propTypes = {
  joinedRoom: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};
