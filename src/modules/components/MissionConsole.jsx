import { useState } from "react";
import PropTypes from "prop-types";
import { soundFx } from "../utils/soundEffects";

/**
 * MissionConsole — Interactive 5-slot mission grid.
 * Clicking a slot shows stage info and instructions.
 */

const missionMeta = [
  { icon: "📖", name: "Comic Reading", stage: "Etapa 1: Lectura", desc: "Comprensión de viñetas interactivas de la bitácora espacial.", reward: "5 XP / 5 🪙" },
  { icon: "🚀", name: "Sentence Launch", stage: "Etapa 2: Gramática", desc: "Construcción y alineación espacial de estructuras gramaticales.", reward: "10 XP / 10 🪙" },
  { icon: "🔋", name: "Word Recovery", stage: "Etapa 3: Escucha", desc: "Sintonía de frecuencias de audio y recuperación de vocabulario.", reward: "10 XP / 10 🪙" },
  { icon: "🔧", name: "Ship Repair", stage: "Etapa 4: Vocabulario", desc: "Detección de fallos técnicos y emparejamiento de vocabulario.", reward: "10 XP / 10 🪙" },
  { icon: "✍️", name: "Writing Lab", stage: "Etapa 5: Writing", desc: "Redacción del informe de misión para revisión docente.", reward: "15 XP / Transmisión" },
];

export default function MissionConsole({
  dayActivities,
  completedList,
}) {
  const [selectedInfo, setSelectedInfo] = useState(null);

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
                setSelectedInfo({ act, meta });
              }}
              title="Haz clic para ver información de esta etapa"
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

      {/* STAGE INFO MODAL */}
      {selectedInfo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(2, 6, 18, 0.85)",
            backdropFilter: "blur(10px)",
            zIndex: 4500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setSelectedInfo(null)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(10, 25, 50, 0.98) 0%, rgba(5, 12, 28, 0.99) 100%)",
              border: "2px solid #2ec4b6",
              borderRadius: "24px",
              padding: "28px 36px",
              maxWidth: "500px",
              width: "90%",
              color: "#e6f7ff",
              boxShadow: "0 0 50px rgba(46, 196, 182, 0.4)",
              position: "relative",
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedInfo(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 18,
                background: "rgba(239, 68, 68, 0.2)",
                border: "1.5px solid #ef4444",
                color: "#ef4444",
                borderRadius: "50%",
                width: 32,
                height: 32,
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              ✕
            </button>

            <span style={{ fontSize: "3.2rem", display: "block", marginBottom: "10px" }}>
              {selectedInfo.meta.icon}
            </span>

            <span style={{ background: "rgba(46, 196, 182, 0.2)", color: "#2ec4b6", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase" }}>
              {selectedInfo.meta.stage}
            </span>

            <h3 style={{ margin: "10px 0 6px 0", color: "#ffd166", fontSize: "1.4rem" }}>
              {selectedInfo.meta.name}
            </h3>

            <p style={{ fontSize: "0.92rem", color: "#cbd5e0", lineHeight: "1.6", margin: "14px 0" }}>
              {selectedInfo.act.description || selectedInfo.meta.desc}
            </p>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px dashed rgba(255, 209, 102, 0.4)", borderRadius: "14px", padding: "12px 16px", marginTop: "16px" }}>
              <span style={{ fontSize: "0.78rem", color: "#ffd166", fontWeight: "bold" }}>
                💡 NOTA DEL COMANDO:
              </span>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#9be6df" }}>
                Para realizar esta etapa y el resto de actividades del día, presiona el botón principal <strong>"🚀 ¡INICIAR MISIÓN DEL DÍA!"</strong>.
              </p>
            </div>

            <button
              onClick={() => setSelectedInfo(null)}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #2ec4b6, #208b81)",
                border: "none",
                borderRadius: "14px",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
            >
              Entendido 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

MissionConsole.propTypes = {
  dayActivities: PropTypes.array.isRequired,
  completedList: PropTypes.object.isRequired,
};
