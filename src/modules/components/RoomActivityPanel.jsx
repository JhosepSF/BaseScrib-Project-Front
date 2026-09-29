import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import { fetchWithAuth, getAccessToken } from "../utils/apiClient";
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
import { DailyGameRunner } from "./DailyGameRunner";
import naveDentro2D from "../../assets/amongus/Nave_dentro_16_9_2D.jpg";
import "../../styles/SpaceStation.css";

import { MISSION_BRIEFINGS as missionBriefings } from "../constants/curriculumVocabulary";


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
  const [activeRunnerDay, setActiveRunnerDay] = useState(null);
  const [remoteVocabByDay, setRemoteVocabByDay] = useState({});

  // Dynamically synchronize live vocabulary from backend API
  useEffect(() => {
    let isMounted = true;
    fetchWithAuth(`${API_BASE}/daily-vocabulary/?day=${selectedDay}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => ({ en: item.word_en, es: item.word_es }));
          setRemoteVocabByDay(prev => ({ ...prev, [selectedDay]: mapped }));
        }
      })
      .catch(err => {
        console.warn("Could not fetch remote daily vocabulary for day", selectedDay, err);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedDay]);

  const getDayLockStatus = (dayNum) => {
    if (dayNum === 1) return { isUnlocked: true };

    const unlockedDays = joinedRoom?.unlocked_days || [1];
    if (unlockedDays.includes(dayNum)) {
      return { isUnlocked: true };
    }

    return {
      isUnlocked: false,
      reason: `El docente aún no ha desbloqueado la misión del Día ${dayNum} para este salón.`
    };
  };

  const navigate = useNavigate();
  const token = getAccessToken();

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

    if (activeRunnerDay) return;

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      setSparkyPhrase(phrases[randomIndex]);
    }, 8000); // Change phrase every 8 seconds

    return () => clearInterval(intervalId);
  }, [activeRunnerDay]);

  // Fetch current user and activities
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // Fetch User profile to get latest coins/xp
        const userRes = await fetchWithAuth(`${API_BASE}/users/me/`);
        if (!userRes.ok) throw new Error("Error cargando perfil");
        const userData = await userRes.json();
        setUser(userData);

        // Fetch Activities
        const actRes = await fetchWithAuth(`${API_BASE}/activities/`);
        if (!actRes.ok) throw new Error("Error cargando actividades");
        const actData = await actRes.json();

        // Sort activities by ID or order
        const sortedActs = actData.sort((a, b) => a.id - b.id);
        setActivities(sortedActs);

        // Check writing submissions from backend to see if Activity 5 is submitted
        const subRes = await fetchWithAuth(`${API_BASE}/writing-submissions/`);
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
      const res = await fetchWithAuth(`${API_BASE}/users/award_rewards/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      await fetchWithAuth(`${API_BASE}/tracking-events/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: user?.id,
          event_type: "activity_complete",
          metadata: { activity_id: activityId, xp: xpEarned, coins: coinsEarned },
          duration: duration
        }),
      });

      // 3. Send EngagementMetric to backend (so it calculates on the Teacher Dashboard!)
      await fetchWithAuth(`${API_BASE}/engagement-metrics/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: user?.id,
          metric: "time_on_task",
          value: duration
        }),
      });

      // 4. Update local state and localStorage
      const updatedMap = { ...completedList, [activityId]: true };
      setCompletedList(updatedMap);
      if (user?.id) {
        localStorage.setItem(`completed_acts_${user.id}`, JSON.stringify(updatedMap));
      }

      // Close game
      setActiveGame(null);
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };


  const runnerActivities = useMemo(() => {
    if (!activeRunnerDay || !activities) return [];
    return activities.filter(act => act.day_num === activeRunnerDay);
  }, [activities, activeRunnerDay]);

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
    let gameType = ((activeGame.activity.id - 1) % 5) + 1;
    const tLower = (activeGame.activity.title || "").toLowerCase();
    const dLower = (activeGame.activity.description || "").toLowerCase();
    if (tLower.includes("writing") || dLower.includes("writing") || tLower.includes("redacción") || tLower.includes("informe")) {
      gameType = 5;
    } else if (tLower.includes("comic") || dLower.includes("comic") || tLower.includes("reading") || tLower.includes("lectura")) {
      gameType = 1;
    } else if (tLower.includes("sentence") || dLower.includes("sentence") || tLower.includes("launch") || tLower.includes("gramática")) {
      gameType = 2;
    } else if (tLower.includes("recovery") || dLower.includes("recovery") || tLower.includes("frecuencia") || tLower.includes("escucha")) {
      gameType = 3;
    } else if (tLower.includes("repair") || dLower.includes("repair") || tLower.includes("maintenance") || tLower.includes("vocabulario")) {
      gameType = 4;
    }
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
        return { icon: "🛠️", typeName: "Vocabulary & Ship Repair", reward: "10 XP / 10 Coins 🪙" };
      case 2:
        return { icon: "⚡", typeName: "Grammar - Sentence Launch", reward: "10 XP / 10 Coins 🪙" };
      case 3:
        return { icon: "📖", typeName: "Comic Reading", reward: "10 XP / 10 Coins 🪙" };
      case 4:
        return { icon: "🛰️", typeName: "Word Recovery", reward: "10 XP / 10 Coins 🪙" };
      case 5:
        return { icon: "✍️", typeName: "Writing Lab", reward: "15 XP / Transmission" };
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
          joinedRoom={joinedRoom}
          activities={activities}
          completedList={completedList}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          token={token}
          onActivityComplete={handleGameComplete}
          onUserUpdated={(updatedUser) => {
            if (typeof updatedUser === "function") {
              setUser(updatedUser);
            } else {
              setUser(prev => ({ ...prev, ...updatedUser }));
            }
          }}
          onStartGame={() => {
            soundFx.playWarp();
            setActiveRunnerDay(selectedDay);
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
        onToggleViewMode={() => setViewMode("3d")}
        is3DView={false}
      />

      {/* MAIN DIEGETIC LAYOUT */}
      <div className="station-layout">

        {/* CENTER CONSOLES (BITACORA, TABS, VOCAB) */}
        <div className="station-layout__middle">

          {/* LEFT MONITOR: BITACORA */}
          {missionBriefings[selectedDay] ? (
            <HoloMonitor className="station-bitacora-monitor" icon="📋" title={`BITÁCORA - DÍA ${selectedDay}`}>
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
            <HoloMonitor className="station-bitacora-monitor" icon="🛰️" title={`MISIÓN ACTIVA - DÍA ${selectedDay}`}>
              <p style={{ margin: "4px 0", color: "rgba(230, 247, 255, 0.9)" }}>
                Completa el circuito de los 5 simuladores del Día {selectedDay} para desbloquear la estrella de la lección.
              </p>
            </HoloMonitor>
          )}

          {/* CENTRAL CONSOLE: MISSION TABS AND SLOTS */}
          <div className="station-center-console">
            <div className="mission-console__day-tabs">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((dayNum) => {
                const isUnlocked = getDayLockStatus(dayNum).isUnlocked;
                return (
                  <button
                    key={dayNum}
                    onClick={() => { soundFx.playClick(); setSelectedDay(dayNum); }}
                    className={`mission-console__day-tab ${selectedDay === dayNum ? "mission-console__day-tab--active" : ""}`}
                    style={{ opacity: isUnlocked ? 1 : 0.65 }}
                  >
                    {isUnlocked ? `🚀 Day ${dayNum}` : `🔒 Day ${dayNum}`}
                  </button>
                );
              })}
            </div>

            {(() => {
              const lockStatus = getDayLockStatus(selectedDay);
              return lockStatus.isUnlocked ? (
                <button
                  onClick={() => {
                    soundFx.playWarp();
                    setActiveRunnerDay(selectedDay);
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                    border: "none",
                    borderRadius: "16px",
                    color: "#0d1b2a",
                    fontWeight: "900",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    boxShadow: "0 0 20px rgba(255, 209, 102, 0.6)",
                    marginBottom: "8px",
                    transition: "all 0.2s ease"
                  }}
                >
                  🚀 START DAY {selectedDay} MISSION! ➔
                </button>
              ) : (
                <div style={{
                  padding: "14px 18px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1.5px solid #ef4444",
                  borderRadius: "16px",
                  color: "#fca5a5",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  marginBottom: "8px"
                }}>
                  🔒 DAY LOCKED: {lockStatus.reason}
                </div>
              );
            })()}

            <MissionConsole
              dayActivities={dayActivities}
              completedList={completedList}
              onStartGame={() => {
                const lockStatus = getDayLockStatus(selectedDay);
                if (!lockStatus.isUnlocked) {
                  alert(`🔒 This day is locked. ${lockStatus.reason}`);
                  return;
                }
                soundFx.playWarp();
                setActiveRunnerDay(selectedDay);
              }}
            />

            <div className="station-progress">
              <div className="station-progress__labels">
                <span>Mission Progress (Day {selectedDay})</span>
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
            <HoloMonitor className="station-vocab-monitor" icon="🔤" title="VOCABULARIO CLAVE">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {(remoteVocabByDay[selectedDay] || missionBriefings[selectedDay].vocabulary).map((vocab, index) => (
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
                petId={user?.equipped_pet || localStorage.getItem("basescrib_equipped_pet") || "pet_alien_blue"}
                suitColor={user?.suit_color || "#2ec4b6"}
                visorColor={user?.visor_color || "#a3e2f7"}
                accessory={user?.accessory || "none"}
                basePlatform={user?.base_platform || "none"}
                decal={user?.decal || "none"}
                gender={user?.gender || (user?.selected_outfit?.startsWith("m_") ? "male" : "female")}
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

      {/* SEQUENCED DAILY GAME RUNNER OVERLAY */}
      {activeRunnerDay && (
        <DailyGameRunner
          dayNumber={activeRunnerDay}
          activities={runnerActivities}
          userId={user?.id}
          token={token}
          onStageComplete={(stageNum, xp, coins) => {
            setUser(prev => ({
              ...prev,
              xp: (prev?.xp || 0) + xp,
              coins: (prev?.coins || 0) + coins
            }));
          }}
          onFinishAll={(runnerData) => {
            localStorage.setItem(`basescrib_day_${runnerData.dayNumber}_completed_at`, new Date().toISOString());
            setActiveRunnerDay(null);
            handleGameComplete(1, runnerData.totalXP, runnerData.totalCoins);
          }}
          onClose={() => setActiveRunnerDay(null)}
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
