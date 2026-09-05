import { useState } from "react";
import PropTypes from "prop-types";
import { SentenceLaunchGame } from "./SentenceLaunchGame";
import { ShipRepairGame } from "./ShipRepairGame";
import { ComicGame } from "./ComicGame";
import { WordRecoveryGame } from "./WordRecoveryGame";
import { WritingGame } from "./WritingGame";
import { soundFx } from "../utils/soundEffects";
import "../../styles/DailyGameRunner.css";

const STAGES = [
  { id: 1, type: "grammar", title: "Etapa 1: Gramática Espacial", icon: "⚡", component: SentenceLaunchGame, desc: "Lanzamiento de Oraciones" },
  { id: 2, type: "vocabulary", title: "Etapa 2: Vocabulario de la Nave", icon: "🛠️", component: ShipRepairGame, desc: "Reparación de Módulos" },
  { id: 3, type: "reading", title: "Etapa 3: Lectura de Cómic", icon: "📖", component: ComicGame, desc: "Comprensión de Bitácora" },
  { id: 4, type: "listening", title: "Etapa 4: Escucha y Frecuencias", icon: "🛰️", component: WordRecoveryGame, desc: "Recuperación de Frecuencia" },
  { id: 5, type: "writing", title: "Etapa 5: Informe Final al Profesor", icon: "✉️", component: WritingGame, desc: "Redacción y Envío al Buzón" },
];

export function DailyGameRunner({ dayNumber, activities = [], userId, onFinishAll, onClose }) {
  const [stageIndex, setStageIndex] = useState(0); // 0 to 4
  const [totalXP, setTotalXP] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [completedAutoScore, setCompletedAutoScore] = useState(null);

  const currentStage = STAGES[stageIndex];

  // Helper to match activity to current stage type or fallback to position
  const findActivityForStage = (stageType, index) => {
    if (!activities || activities.length === 0) return null;
    const match = activities.find(a => 
      (a.title && a.title.toLowerCase().includes(stageType)) ||
      (a.description && a.description.toLowerCase().includes(stageType))
    );
    return match || activities[index] || activities[0];
  };

  const handleStageComplete = (xp = 15, coins = 15, mistakes = 0) => {
    soundFx.playSuccess();
    setTotalXP(prev => prev + xp);
    setTotalCoins(prev => prev + coins);
    setTotalMistakes(prev => prev + mistakes);

    const isLastAutoStage = stageIndex === 3; // Finished Stage 4 (Listening)
    const isFinalStage = stageIndex === 4; // Finished Stage 5 (Writing)

    if (isLastAutoStage) {
      // Calculate final auto-graded score (0 to 20)
      const cumulativeMistakes = totalMistakes + mistakes;
      const calculatedScore = Math.max(0, Number((20 - cumulativeMistakes * 0.75).toFixed(1)));
      setCompletedAutoScore(calculatedScore);
    }

    if (isFinalStage) {
      // Finished all 5 stages!
      soundFx.playStreakBonus();
      if (onFinishAll) {
        onFinishAll({
          dayNumber,
          totalXP: totalXP + xp,
          totalCoins: totalCoins + coins,
          totalMistakes: totalMistakes + mistakes,
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
    setStageIndex(prev => prev + 1);
  };

  const currentActivity = findActivityForStage(currentStage.type, stageIndex);
  const StageComponent = currentStage.component;

  // Auto-calculated score for overlay
  const currentAutoScore = Math.max(0, Number((20 - totalMistakes * 0.75).toFixed(1)));

  return (
    <div className="daily-runner-overlay">
      {/* Top Banner Progress Bar */}
      <div className="daily-runner-hud">
        <div className="runner-hud-left">
          <span className="runner-day-badge">🚀 MISIÓN DÍA {dayNumber}</span>
          <span className="runner-stage-indicator">
            Etapa {stageIndex + 1} de 5: <strong>{currentStage.title}</strong>
          </span>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="runner-stepper">
          {STAGES.map((stg, i) => {
            let statusClass = "future";
            if (i < stageIndex) statusClass = "done";
            else if (i === stageIndex) statusClass = "active";

            return (
              <div key={stg.id} className={`stepper-pill ${statusClass}`}>
                <span className="pill-icon">{stg.icon}</span>
                <span className="pill-name">{stg.title.split(":")[0]}</span>
              </div>
            );
          })}
        </div>

        <button className="runner-close-btn" onClick={onClose} title="Salir al Panel">
          ✕
        </button>
      </div>

      {/* Main Game Stage Area */}
      <div className="daily-runner-content">
        {!showTransition ? (
          <StageComponent
            activity={currentActivity}
            userId={userId}
            hideHeader={true}
            onComplete={handleStageComplete}
            onClose={onClose}
          />
        ) : (
          /* Transition Overlay between Stages */
          <div className="runner-transition-modal">
            <div className="transition-card">
              <div className="transition-icon-glow">{STAGES[stageIndex].icon}</div>
              <h2>¡ETAPA {stageIndex + 1} COMPLETADA!</h2>
              <p className="transition-subtitle">{STAGES[stageIndex].desc} superado con éxito.</p>

              {stageIndex < 4 ? (
                <div className="transition-score-box">
                  <div className="score-stat">
                    <span>Recompensa Acumulada</span>
                    <strong>+{totalXP} XP | +{totalCoins} Monedas 🪙</strong>
                  </div>
                  <div className="score-stat">
                    <span>Equivocaciones en Juegos</span>
                    <strong style={{ color: totalMistakes === 0 ? "#2ec4b6" : "#ff6b6b" }}>
                      {totalMistakes} {totalMistakes === 1 ? "error" : "errores"}
                    </strong>
                  </div>
                  <div className="score-stat highlight-stat">
                    <span>Nota Automática Actual (/20)</span>
                    <strong className="auto-score-number">⭐ {currentAutoScore} / 20</strong>
                  </div>
                </div>
              ) : (
                <div className="transition-score-box writing-next-box">
                  <h3>🎯 NOTA DE JUEGOS AUTOMÁTICOS: <span className="gold-score">{completedAutoScore} / 20</span></h3>
                  <p>A continuación ingresarás a la <strong>Etapa 5: Writing (Redacción Espacial)</strong>.</p>
                  <small>Esta etapa será enviada a la bandeja del profesor para su calificación manual independiente (0 a 20).</small>
                </div>
              )}

              <div className="next-stage-preview">
                <span>SIGUIENTE PASO:</span>
                <h4>{STAGES[stageIndex + 1]?.icon} {STAGES[stageIndex + 1]?.title}</h4>
              </div>

              <button className="btn-next-stage" onClick={handleNextStage}>
                Continuar a Etapa {stageIndex + 2} ➔
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
  onFinishAll: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
