import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import { ComicGame } from "./ComicGame";
import { SentenceLaunchGame } from "./SentenceLaunchGame";
import { WordRecoveryGame } from "./WordRecoveryGame";
import { ShipRepairGame } from "./ShipRepairGame";
import { WritingGame } from "./WritingGame";

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
      { en: "star", es: "estrella" }
    ],
    objective: "Explorar la base Basescrib: recorre los módulos de estudio y el jardín espacial para identificar objetos y tripulantes."
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
      { en: "schedule", es: "horario" }
    ],
    objective: "Inspeccionar rutinas de la tripulación: descubre qué hacen los tripulantes cada día y organiza tu horario espacial."
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
      { en: "drawing", es: "dibujando" }
    ],
    objective: "Supervisar las tareas activas de la nave: debido a que el General está enfermo, debes reportar qué hace cada recluta justo ahora."
  },
  5: {
    grammar: "Adverbs of Frequency (always, sometimes, never), How often, What time",
    vocabulary: [
      { en: "wake up", es: "despertarse" },
      { en: "train", es: "entrenar" },
      { en: "help", es: "ayudar" },
      { en: "meet", es: "reunirse" },
      { en: "study", es: "estudiar" },
      { en: "explore", es: "explorar" },
      { en: "draw", es: "dibujar" },
      { en: "sleep", es: "dormir" }
    ],
    objective: "Completar la encuesta de hábitos: comparte con el nuevo recluta con qué frecuencia realizas tus actividades diarias."
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
  const navigate = useNavigate();
  const token = localStorage.getItem("basescrib_token") || "";

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
          coins: data.coins
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
        backgroundImage: "url('/src/assets/amongus/Nave dentro.png')",
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

  return (
    <div style={{
      backgroundImage: "url('/src/assets/amongus/Nave dentro.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0, left: 0,
      zIndex: 100,
      overflow: "hidden",
      padding: "20px 15px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div
        className="glass-console room-console-card panel-large animate-fadeIn neon-scrollbar"
        style={{
          maxWidth: 850,
          width: "100%",
          padding: 30,
          borderRadius: 16,
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
          overflowX: "hidden",
          boxSizing: "border-box"
        }}
      >
        {error && <div className="error-message">{error}</div>}

      <div className="panel-title-row" style={{ borderBottom: "1px solid rgba(184, 255, 249, 0.15)", paddingBottom: 15 }}>
        <div>
          <span className="dashboard-kicker">Misión Activa: Dimensión {selectedDay}</span>
          <h2>Centro de Control de Actividades</h2>
          <p>Completa cada actividad del simulador para preparar el lanzamiento.</p>
        </div>

        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 15, flexWrap: "wrap" }}>
            <button 
              onClick={() => navigate("/avatar")} 
              className="btn-avatar"
              style={{
                margin: 0,
                padding: "8px 14px",
                fontSize: "0.85rem",
                background: "linear-gradient(135deg, #2ec4b6, #26a399)",
                color: "#002427",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
            >
              🎨 Personalizar Avatar
            </button>
            <div className="user-stats-pill" style={{ margin: 0 }}>
              <span className="stat-item">⭐ {user.xp} XP</span>
              <span className="stat-item">🪙 {user.coins} Monedas</span>
            </div>
          </div>
        )}
      </div>

      {/* Day Selector Tabs */}
      <div 
        className="day-selector-tabs" 
        style={{ 
          display: "flex", 
          gap: 10, 
          marginTop: 20, 
          marginBottom: 10, 
          overflowX: "auto", 
          paddingBottom: 8,
          borderBottom: "1px solid rgba(184, 255, 249, 0.1)"
        }}
      >
        {[1, 2, 3, 4, 5].map((dayNum) => (
          <button
            key={dayNum}
            onClick={() => setSelectedDay(dayNum)}
            className="btn-tab"
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: selectedDay === dayNum ? "2px solid #b8fff9" : "1px solid rgba(184, 255, 249, 0.25)",
              background: selectedDay === dayNum ? "rgba(46, 196, 182, 0.25)" : "rgba(255,255,255,0.04)",
              color: selectedDay === dayNum ? "#b8fff9" : "#9be6df",
              fontWeight: "bold",
              fontSize: "0.85rem",
              cursor: "pointer",
              margin: 0,
              boxShadow: selectedDay === dayNum ? "0 0 12px rgba(184, 255, 249, 0.2)" : "none",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease"
            }}
          >
            🚀 Día {dayNum}
          </button>
        ))}
      </div>

      {/* Mission Briefing Card */}
      {missionBriefings[selectedDay] && (
        <div 
          className="briefing-card animate-fadeIn" 
          style={{ 
            background: "rgba(15, 58, 71, 0.4)", 
            border: "1px solid rgba(184, 255, 249, 0.2)", 
            borderRadius: 12, 
            padding: 20, 
            textAlign: "left", 
            marginTop: 15,
            marginBottom: 20,
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.05)"
          }}
        >
          <h4 style={{ color: "#ffd166", margin: "0 0 10px 0", fontSize: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
            📋 Bitácora de Misión - Objetivo del Día:
          </h4>
          <p style={{ margin: "0 0 15px 0", color: "#e6f7ff", fontSize: "0.9rem", lineHeight: "1.4" }}>
            {missionBriefings[selectedDay].objective}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {/* Grammar Target */}
            <div style={{ flex: "1 1 250px" }}>
              <span style={{ fontSize: "0.8rem", color: "#9be6df", fontWeight: "bold", textTransform: "uppercase" }}>🎯 Enfoque Gramatical</span>
              <p style={{ margin: "5px 0 0 0", color: "#b8fff9", fontSize: "0.85rem", fontWeight: "600" }}>
                {missionBriefings[selectedDay].grammar}
              </p>
            </div>

            {/* Vocabulary list */}
            <div style={{ flex: "2 2 400px" }}>
              <span style={{ fontSize: "0.8rem", color: "#9be6df", fontWeight: "bold", textTransform: "uppercase" }}>🔤 Vocabulario Clave</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px", marginTop: 6 }}>
                {missionBriefings[selectedDay].vocabulary.map((vocab, index) => (
                  <span 
                    key={index} 
                    style={{ 
                      fontSize: "0.75rem", 
                      background: "rgba(255, 255, 255, 0.06)", 
                      color: "#e6f7ff", 
                      padding: "4px 8px", 
                      borderRadius: 4,
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      display: "inline-block"
                    }}
                    title={vocab.es}
                  >
                    <strong>{vocab.en}</strong> <span style={{ color: "#ffd166", opacity: 0.8 }}>({vocab.es})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Section */}
      <div className="mission-progress-container" style={{ margin: "20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem", color: "#9be6df" }}>
          <span>Progreso de la Misión (Día {selectedDay})</span>
          <span>{dayCompletedCount} / {dayActivities.length} Completado</span>
        </div>
        <div className="progress-bar-bg" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: 10, height: 12, overflow: "hidden" }}>
          <div 
            className="progress-bar-fill" 
            style={{ 
              background: "linear-gradient(90deg, #2ec4b6, #b8fff9)", 
              height: "100%", 
              width: `${dayProgressPercent}%`, 
              transition: "width 0.5s ease" 
            }}
          />
        </div>
      </div>

      {/* Activities Grid */}
      <div className="activities-list-container">
        {dayActivities.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px dashed rgba(184, 255, 249, 0.2)" }}>
            <p style={{ color: "#9be6df", margin: 0 }}>No hay actividades registradas en la base de datos para el Día {selectedDay} aún.</p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 15 }}>
            {dayActivities.map((act) => {
              const meta = getActivityMetadata(act.id);
              const isCompleted = !!completedList[act.id];
              
              return (
                <li 
                  key={act.id} 
                  className={`activity-quest-card ${isCompleted ? "quest-complete" : ""}`}
                  style={{
                    background: isCompleted ? "rgba(46, 196, 182, 0.1)" : "rgba(255, 255, 255, 0.03)",
                    border: isCompleted ? "1px solid rgba(46, 196, 182, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 12,
                    padding: "15px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    setActiveGame({ type: act.id, activity: act });
                    setGameStartTime(Date.now());
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                    <span style={{ fontSize: "2rem" }}>{meta.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <span style={{ fontSize: "0.8rem", color: isCompleted ? "#2ec4b6" : "#ffd166", fontWeight: "600", textTransform: "uppercase" }}>
                        {meta.typeName}
                      </span>
                      <h3 style={{ margin: "4px 0", color: "#e6f7ff", fontSize: "1.1rem" }}>{act.title}</h3>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "rgba(230, 247, 255, 0.7)" }}>{act.description}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                    <span style={{ fontSize: "0.8rem", color: "#9be6df", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 4 }}>
                      {meta.reward}
                    </span>
                    
                    {isCompleted ? (
                      <span className="badge-complete" style={{ color: "#2ec4b6", fontWeight: "bold", fontSize: "0.9rem" }}>
                        ✓ Completado
                      </span>
                    ) : (
                      <button className="btn-start" style={{ margin: 0, padding: "8px 16px", fontSize: "0.85rem" }}>
                        Jugar
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div style={{ marginTop: 25, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onBack} className="btn-cancel">
          Salir al Portal
        </button>
      </div>
      </div>
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
