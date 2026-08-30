import PropTypes from "prop-types";
import { soundFx } from "../utils/soundEffects";

/**
 * MissionConsole — Interactive 5-slot mission grid.
 * Each slot shows a mission with icon, name, reward, and completion state.
 */

const missionMeta = [
  { icon: "📖", name: "Comic Reading", reward: "5 XP / 5 🪙" },
  { icon: "🚀", name: "Sentence Launch", reward: "10 XP / 10 🪙" },
  { icon: "🔋", name: "Word Recovery", reward: "10 XP / 10 🪙" },
  { icon: "🔧", name: "Ship Repair", reward: "10 XP / 10 🪙" },
  { icon: "✍️", name: "Writing Lab", reward: "15 XP / Transmisión" },
];

export default function MissionConsole({
  dayActivities,
  completedList,
  onStartGame,
}) {
  if (!dayActivities || dayActivities.length === 0) {
    return (
      <div className="mission-console">
        <div className="mission-console__slots" style={{ gridTemplateColumns: "1fr" }}>
          <div style={{
            textAlign: "center",
            padding: "30px 20px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 12,
            border: "1px dashed rgba(184, 255, 249, 0.15)",
            color: "#9be6df",
            fontSize: "0.85rem"
          }}>
            🛰️ No hay misiones registradas para este día aún.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mission-console">
      <div className="mission-console__slots">
        {dayActivities.map((act) => {
          const gameType = ((act.id - 1) % 5);
          const meta = missionMeta[gameType] || missionMeta[0];
          const isCompleted = !!completedList[act.id];

          return (
            <div
              key={act.id}
              className={`mission-slot ${isCompleted ? "mission-slot--completed" : "mission-slot--pending"}`}
              onClick={() => {
                soundFx.playClick();
                onStartGame(act);
              }}
              title={act.description || act.title}
            >
              <span className="mission-slot__icon">{meta.icon}</span>
              <span className="mission-slot__name">{meta.name}</span>
              <span className="mission-slot__reward">{meta.reward}</span>
              {isCompleted && (
                <span className="mission-slot__badge-complete">Completado</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

MissionConsole.propTypes = {
  dayActivities: PropTypes.array.isRequired,
  completedList: PropTypes.object.isRequired,
  onStartGame: PropTypes.func.isRequired,
};
