import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { SentenceLaunchGame } from "./SentenceLaunchGame";
import { ShipRepairGame } from "./ShipRepairGame";
import { ComicGame } from "./ComicGame";
import { WordRecoveryGame } from "./WordRecoveryGame";
import { WritingGame } from "./WritingGame";
import { soundFx } from "../utils/soundEffects";
import "../../styles/DailyGameRunner.css";

const STAGES = [
  { id: 1, type: "vocabulary", title: "Stage 1: Vocabulary", icon: "🛠️", component: ShipRepairGame, desc: "Ship Repair & Module Vocabulary" },
  { id: 2, type: "grammar", title: "Stage 2: Grammar", icon: "⚡", component: SentenceLaunchGame, desc: "Sentence Launch & Grammar" },
  { id: 3, type: "reading", title: "Stage 3: Reading", icon: "📖", component: ComicGame, desc: "Comic Reading & Log Comprehension" },
  { id: 4, type: "listening", title: "Stage 4: Listening", icon: "🛰️", component: WordRecoveryGame, desc: "Audio Frequency & Word Recovery" },
  { id: 5, type: "writing", title: "Stage 5: Writing", icon: "✉️", component: WritingGame, desc: "Final Mission Report to Teacher" },
];

class StageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught in game stage:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          textAlign: "center",
          padding: "40px 20px",
          background: "rgba(10, 20, 35, 0.9)",
          border: "2px solid #ef4444",
          borderRadius: "16px",
          maxWidth: "500px",
          margin: "auto",
          color: "#ffd166"
        }}>
          <span style={{ fontSize: "2.5rem" }}>⚠️</span>
          <h3 style={{ margin: "12px 0 6px 0", color: "#ffd166" }}>Interference Detected in Stage</h3>
          <p style={{ color: "#e6f7ff", fontSize: "0.9rem", marginBottom: "16px" }}>
            {this.state.error?.message || "An anomaly occurred while processing this mission's data."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #2ec4b6, #208b81)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🔄 Retry Stage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function DailyGameRunner({
  dayNumber,
  activities = [],
  userId,
  token: propToken,
  onStageComplete,
  onFinishAll,
  onClose
}) {
  const [stageIndex, setStageIndex] = useState(0); // 0 to 4
  const [completedStages, setCompletedStages] = useState([]); // array of stage numbers, e.g. [1, 2]
  const [totalXP, setTotalXP] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [completedAutoScore, setCompletedAutoScore] = useState(null);
  const [resumedNotice, setResumedNotice] = useState(false);

  const currentStage = STAGES[stageIndex];
  const cacheKey = `basescrib_daily_progress_${userId || 'guest'}_day_${dayNumber}`;

  // Helper to match activity to current stage type or fallback to position
  const findActivityForStage = (stageType, index) => {
    if (!activities || activities.length === 0) return null;
    const stageKeywords = {
      grammar: ["grammar", "gramática", "sentence", "oración"],
      vocabulary: ["vocabulary", "vocabulario", "repair", "reparación", "mantenimiento", "maintenance"],
      reading: ["reading", "lectura", "comic", "cómic", "bitácora"],
      listening: ["listening", "escucha", "recovery", "recuperación", "frecuencia"],
      writing: ["writing", "redacción", "informe", "personal log", "log"]
    };
    const keywords = stageKeywords[stageType] || [stageType];
    const match = activities.find(a => {
      const t = (a.title || "").toLowerCase();
      const d = (a.description || "").toLowerCase();
      return keywords.some(k => t.includes(k) || d.includes(k));
    });
    return match || activities[index] || activities[0];
  };

  // 1. Initial load: Restore saved stage progress from localStorage & sync with backend
  useEffect(() => {
    // A. Read local cached progress
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        const cached = JSON.parse(stored);
        if (Array.isArray(cached.completedStages) && cached.completedStages.length > 0) {
          setCompletedStages(cached.completedStages);
          const nextIdx = Math.max(0, Math.min(4, (cached.currentStage || 1) - 1));
          setStageIndex(nextIdx);
          if (nextIdx > 0) setResumedNotice(true);
          if (cached.totalXP) setTotalXP(cached.totalXP);
          if (cached.totalCoins) setTotalCoins(cached.totalCoins);
          if (cached.totalMistakes) setTotalMistakes(cached.totalMistakes);
        }
      }
    } catch (e) {
      console.warn("Could not parse local mission progress cache:", e);
    }

    // B. Fetch persistent state from backend API
    const authToken = propToken || localStorage.getItem("basescrib_token") || localStorage.getItem("token") || "";
    if (authToken) {
      fetch(`/api/daily-mission-progress/by-day/?day=${dayNumber}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data && data.day_number === dayNumber) {
            const remoteStages = Array.isArray(data.completed_stages) ? data.completed_stages : [];
            if (remoteStages.length > 0) {
              setCompletedStages(remoteStages);
              const nextIdx = Math.max(0, Math.min(4, (data.current_stage || 1) - 1));
              setStageIndex(nextIdx);
              if (nextIdx > 0) setResumedNotice(true);
              setTotalXP(data.total_xp || 0);
              setTotalCoins(data.total_coins || 0);
              setTotalMistakes(data.total_mistakes || 0);

              // Update local cache
              localStorage.setItem(cacheKey, JSON.stringify({
                completedStages: remoteStages,
                currentStage: data.current_stage || 1,
                totalXP: data.total_xp || 0,
                totalCoins: data.total_coins || 0,
                totalMistakes: data.total_mistakes || 0,
                isCompleted: data.is_completed || false,
                lastSavedAt: new Date().toISOString()
              }));
            }
          }
        })
        .catch(err => {
          console.warn("Could not load backend daily mission progress:", err);
        });
    }
  }, [dayNumber, userId, propToken, cacheKey]);

  // Hide resumed notice badge after 4 seconds
  useEffect(() => {
    if (resumedNotice) {
      const timer = setTimeout(() => setResumedNotice(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [resumedNotice]);

  const handleStageComplete = (xp = 15, coins = 15, mistakes = 0) => {
    soundFx.playSuccess();
    const stageNumber = stageIndex + 1;
    const newXP = totalXP + xp;
    const newCoins = totalCoins + coins;
    const newMistakes = totalMistakes + mistakes;
    const newCompleted = Array.from(new Set([...completedStages, stageNumber])).sort((a, b) => a - b);

    setCompletedStages(newCompleted);
    setTotalXP(newXP);
    setTotalCoins(newCoins);
    setTotalMistakes(newMistakes);

    const isLastAutoStage = stageIndex === 3; // Finished Stage 4 (Listening)
    const isFinalStage = stageIndex === 4 || newCompleted.length >= 5; // Finished Stage 5 (Writing)
    const nextStageNum = Math.min(5, stageNumber + 1);

    // 1. Immediately persist locally (so if user closes right away, nothing is lost)
    localStorage.setItem(cacheKey, JSON.stringify({
      completedStages: newCompleted,
      currentStage: nextStageNum,
      totalXP: newXP,
      totalCoins: newCoins,
      totalMistakes: newMistakes,
      isCompleted: isFinalStage,
      lastSavedAt: new Date().toISOString()
    }));

    // 2. Notify parent container immediately to credit live XP/coins
    if (onStageComplete) {
      onStageComplete(stageNumber, xp, coins, mistakes);
    }

    // Calculate final auto-graded score (0 to 20)
    const cumulativeMistakes = newMistakes;
    const calculatedScore = Math.max(0, Number((20 - cumulativeMistakes * 0.75).toFixed(1)));

    // 3. Immediately persist to backend API
    const authToken = propToken || localStorage.getItem("basescrib_token") || localStorage.getItem("token") || "";
    if (authToken) {
      fetch(`/api/daily-mission-progress/save-stage/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          day_number: dayNumber,
          stage: stageNumber,
          xp,
          coins,
          mistakes,
          game_score: calculatedScore
        })
      }).catch(err => {
        console.error("Error saving stage progress to backend:", err);
      });
    }

    if (isLastAutoStage || isFinalStage) {
      setCompletedAutoScore(calculatedScore);
    }

    if (isFinalStage) {
      // Finished all 5 stages!
      soundFx.playStreakBonus();
      if (onFinishAll) {
        onFinishAll({
          dayNumber,
          totalXP: newXP,
          totalCoins: newCoins,
          totalMistakes: newMistakes,
          autoScore: completedAutoScore ?? 20
        });
      }
    } else {
      setShowTransition(true);
    }
  };

  const handleNextStage = () => {
    soundFx.playWarp();
    setShowTransition(false);
    setStageIndex(prev => Math.min(4, prev + 1));
  };

  const currentActivity = useMemo(() => {
    return findActivityForStage(currentStage.type, stageIndex);
  }, [currentStage.type, stageIndex, activities]);
  const StageComponent = currentStage.component;

  // Auto-calculated score for overlay
  const currentAutoScore = Math.max(0, Number((20 - totalMistakes * 0.75).toFixed(1)));

  return (
    <div className="daily-runner-overlay">
      {/* Floating Save Toast Notification — Positioned floating overlay so zero layout shift occurs */}
      {resumedNotice && (
        <div className="runner-floating-toast animate-fadeIn">
          💾 Saved Progress Restored
        </div>
      )}

      {/* Top Banner Progress Bar */}
      <div className="daily-runner-hud">
        <div className="runner-hud-left">
          <div className="runner-hud-meta">
            <span className="runner-day-badge">🚀 DAY {dayNumber}</span>
            <span className="runner-step-counter">STAGE {stageIndex + 1} / 5</span>
          </div>
          <h3 className="runner-stage-name">
            {completedStages.includes(currentStage.id) ? "✅ " : currentStage.icon + " "}
            {currentStage.title.split(":")[1]?.trim() || currentStage.title}
          </h3>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="runner-stepper">
          {STAGES.map((stg, i) => {
            const isDone = completedStages.includes(stg.id);
            let statusClass = "future";
            if (isDone) statusClass = "done";
            else if (i === stageIndex) statusClass = "active";

            return (
              <div
                key={stg.id}
                className={`stepper-pill ${statusClass}`}
                onClick={() => {
                  if (isDone || i <= stageIndex) {
                    setStageIndex(i);
                    setShowTransition(false);
                  }
                }}
                style={{ cursor: (isDone || i <= stageIndex) ? "pointer" : "default" }}
                title={isDone ? `Stage ${stg.id}: ${stg.type} (click to review)` : `Stage ${stg.id}: ${stg.type}`}
              >
                <span className="pill-icon">{isDone ? "✅" : stg.icon}</span>
                <span className="pill-name">Stage {stg.id}</span>
              </div>
            );
          })}
        </div>

        <button className="runner-close-btn" onClick={onClose} title="Save and Exit to Station">
          ✕
        </button>
      </div>

      {/* Main Game Stage Area */}
      <div className="daily-runner-content">
        {!showTransition ? (
          <StageErrorBoundary key={`stage-boundary-${stageIndex}-${dayNumber}`}>
            <StageComponent
              activity={currentActivity ? { ...currentActivity, dayNumber } : { dayNumber, title: currentStage.title }}
              userId={userId}
              hideHeader={true}
              onComplete={handleStageComplete}
              onClose={onClose}
            />
          </StageErrorBoundary>
        ) : (
          /* Transition Overlay between Stages */
          <div className="runner-transition-modal">
            <div className="transition-card">
              <div className="transition-icon-glow">{STAGES[stageIndex].icon}</div>
              <h2>STAGE {stageIndex + 1} COMPLETED!</h2>
              <p className="transition-subtitle">{STAGES[stageIndex].desc} completed successfully.</p>
              <div style={{
                background: "rgba(46, 196, 182, 0.12)",
                border: "1px dashed rgba(46, 196, 182, 0.5)",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "0.8rem",
                color: "#b8fff9",
                marginBottom: "12px"
              }}>
                💾 Your progress has been saved. If you exit now, you can resume from Stage {Math.min(5, stageIndex + 2)}.
              </div>

              {stageIndex < 4 ? (
                <div className="transition-score-box">
                  <div className="score-stat">
                    <span>Accumulated Rewards</span>
                    <strong>+{totalXP} XP | +{totalCoins} Coins 🪙</strong>
                  </div>
                  <div className="score-stat">
                    <span>Mistakes in Games</span>
                    <strong style={{ color: totalMistakes === 0 ? "#2ec4b6" : "#ff6b6b" }}>
                      {totalMistakes} {totalMistakes === 1 ? "mistake" : "mistakes"}
                    </strong>
                  </div>
                  <div className="score-stat highlight-stat">
                    <span>Current Auto-Grade (/20)</span>
                    <strong className="auto-score-number">⭐ {currentAutoScore} / 20</strong>
                  </div>
                </div>
              ) : (
                <div className="transition-score-box writing-next-box">
                  <h3>🎯 AUTOMATIC GAMES SCORE: <span className="gold-score">{completedAutoScore} / 20</span></h3>
                  <p>Up next: <strong>Stage 5: Writing (Mission Report)</strong>.</p>
                  <small>This stage will be submitted to the teacher's dashboard for grading (0 to 20).</small>
                </div>
              )}

              <div className="next-stage-preview">
                <span>NEXT STAGE:</span>
                <h4>{STAGES[stageIndex + 1]?.icon} {STAGES[stageIndex + 1]?.title}</h4>
              </div>

              <button className="btn-next-stage" onClick={handleNextStage}>
                Continue to Stage {stageIndex + 2} ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

DailyGameRunner.propTypes = {
  dayNumber: PropTypes.number.isRequired,
  activities: PropTypes.array,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  token: PropTypes.string,
  onStageComplete: PropTypes.func,
  onFinishAll: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
