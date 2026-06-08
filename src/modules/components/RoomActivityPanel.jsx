import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import { ComicGame } from "./ComicGame";
import { SentenceLaunchGame } from "./SentenceLaunchGame";
import { WordRecoveryGame } from "./WordRecoveryGame";
import { ShipRepairGame } from "./ShipRepairGame";
import { WritingGame } from "./WritingGame";

export function RoomActivityPanel({ joinedRoom, onBack }) {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [completedList, setCompletedList] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeGame, setActiveGame] = useState(null); // { type, activity }
  const [gameStartTime, setGameStartTime] = useState(null);
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
    const { id, questions } = activeGame.activity;
    if (id === 1) {
      return (
        <ComicGame
          activity={activeGame.activity}
          onComplete={(xp, coins) => handleGameComplete(1, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    } else if (id === 2) {
      return (
        <SentenceLaunchGame
          activity={activeGame.activity}
          onComplete={(xp, coins) => handleGameComplete(2, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    } else if (id === 3) {
      return (
        <WordRecoveryGame
          activity={activeGame.activity}
          onComplete={(xp, coins) => handleGameComplete(3, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    } else if (id === 4) {
      return (
        <ShipRepairGame
          activity={activeGame.activity}
          onComplete={(xp, coins) => handleGameComplete(4, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    } else if (id === 5) {
      return (
        <WritingGame
          activity={activeGame.activity}
          userId={user.id}
          onComplete={(xp, coins) => handleGameComplete(5, xp, coins)}
          onClose={() => setActiveGame(null)}
        />
      );
    }
  }

  // Helper to get activity icon and subtitle
  const getActivityMetadata = (id) => {
    switch (id) {
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

  return (
    <div className="teacher-panel panel-large animate-fadeIn">
      {error && <div className="error-message">{error}</div>}

      <div className="panel-title-row" style={{ borderBottom: "1px solid rgba(184, 255, 249, 0.15)", paddingBottom: 15 }}>
        <div>
          <span className="dashboard-kicker">Misión Activa: Dimensión 1</span>
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

      {/* Progress Section */}
      <div className="mission-progress-container" style={{ margin: "20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem", color: "#9be6df" }}>
          <span>Progreso de la Misión</span>
          <span>{completedCount} / {activities.length} Completado</span>
        </div>
        <div className="progress-bar-bg" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: 10, height: 12, overflow: "hidden" }}>
          <div 
            className="progress-bar-fill" 
            style={{ 
              background: "linear-gradient(90deg, #2ec4b6, #b8fff9)", 
              height: "100%", 
              width: `${progressPercent}%`, 
              transition: "width 0.5s ease" 
            }}
          />
        </div>
      </div>

      {/* Activities Grid */}
      <div className="activities-list-container">
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 15 }}>
          {activities.map((act) => {
            const meta = getActivityMetadata(act.id);
            const isCompleted = !!completedList[act.id];
            
            // Lock rules: allow student to do any activity, or sequential
            // Let's allow them to play any activity, but highlight incomplete ones!
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
                  <div>
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
      </div>

      <div style={{ marginTop: 25, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onBack} className="btn-cancel">
          Salir al Portal
        </button>
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
