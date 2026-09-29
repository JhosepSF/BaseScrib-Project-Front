import { useState } from "react";
import PropTypes from "prop-types";
import { soundFx } from "../utils/soundEffects";

/**
 * MissionConsole — Interactive 5-slot mission grid.
 * Clicking a slot shows stage info and instructions.
 */

const STAGE_METAS = {
  vocabulary: { id: 1, icon: "🛠️", name: "Vocabulary", activityName: "Ship Repair", stage: "Stage 1: Vocabulary", desc: "Detect technical faults and match space vocabulary.", reward: "10 XP / 10 Coins 🪙" },
  grammar: { id: 2, icon: "⚡", name: "Grammar", activityName: "Sentence Launch", stage: "Stage 2: Grammar", desc: "Build and align space sentence grammar structures.", reward: "10 XP / 10 Coins 🪙" },
  reading: { id: 3, icon: "📖", name: "Reading", activityName: "Comic Reading", stage: "Stage 3: Reading", desc: "Read the comic panels and answer comprehension questions.", reward: "10 XP / 10 Coins 🪙" },
  listening: { id: 4, icon: "🛰️", name: "Listening", activityName: "Word Recovery", stage: "Stage 4: Listening", desc: "Tune audio frequencies and recover vocabulary words.", reward: "10 XP / 10 Coins 🪙" },
  writing: { id: 5, icon: "✉️", name: "Writing", activityName: "Writing Lab", stage: "Stage 5: Writing", desc: "Compose the mission log report for teacher review.", reward: "15 XP / Transmission" },
};

function resolveActivityMeta(act, index) {
  const text = ((act?.title || "") + " " + (act?.description || "")).toLowerCase();
  if (text.includes("repair") || text.includes("maintenance") || text.includes("vocab")) {
    return STAGE_METAS.vocabulary;
  }
  if (text.includes("sentence") || text.includes("launch") || text.includes("grammar") || text.includes("gramát")) {
    return STAGE_METAS.grammar;
  }
  if (text.includes("comic") || text.includes("reading") || text.includes("lectura") || text.includes("bitácora")) {
    return STAGE_METAS.reading;
  }
  if (text.includes("recovery") || text.includes("word") || text.includes("listen") || text.includes("frecuen")) {
    return STAGE_METAS.listening;
  }
  if (text.includes("writing") || text.includes("informe") || text.includes("redac") || text.includes("log")) {
    return STAGE_METAS.writing;
  }
  const ordered = [STAGE_METAS.vocabulary, STAGE_METAS.grammar, STAGE_METAS.reading, STAGE_METAS.listening, STAGE_METAS.writing];
  return ordered[index % 5];
}

export default function MissionConsole({
  dayActivities,
  completedList,
  onStartGame,
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
            🛰️ No mission logs registered for this day yet.
          </div>
        </div>
      </div>
    );
  }

  // Map and sort activities by stage 1 to 5 order
  const sortedActivities = [...dayActivities]
    .map((act, index) => ({ act, meta: resolveActivityMeta(act, index) }))
    .sort((a, b) => a.meta.id - b.meta.id);

  return (
    <div className="mission-console">
      <div className="mission-console__slots">
        {sortedActivities.map(({ act, meta }) => {
          const isCompleted = !!completedList[act.id];

          return (
            <div
              key={act.id}
              className={`mission-slot ${isCompleted ? "mission-slot--completed" : "mission-slot--pending"}`}
              onClick={() => {
                soundFx.playClick();
                setSelectedInfo({ act, meta });
              }}
              title="Click to view stage details"
            >
              <span className="mission-slot__icon">{meta.icon}</span>
              <span className="mission-slot__name" style={{ fontWeight: "700" }}>{meta.stage}</span>
              <span className="mission-slot__subname" style={{ fontSize: "0.72rem", color: "#9be6df", opacity: 0.9 }}>
                {meta.activityName}
              </span>
              <span className="mission-slot__reward">{meta.reward}</span>
              {isCompleted && (
                <span className="mission-slot__badge-complete">Completed</span>
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

            <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px dashed rgba(46, 196, 182, 0.4)", borderRadius: "14px", padding: "12px 16px", marginTop: "16px" }}>
              <span style={{ fontSize: "0.78rem", color: "#2ec4b6", fontWeight: "bold" }}>
                🚀 FLUID MISSION SEQUENCE:
              </span>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#9be6df" }}>
                Daily stages are completed in a continuous interactive sequence. Press <strong>PLAY</strong> to launch today's mission.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => setSelectedInfo(null)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "14px",
                  color: "#cbd5e0",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
              {onStartGame && (
                <button
                  onClick={() => {
                    const act = selectedInfo.act;
                    setSelectedInfo(null);
                    onStartGame(act);
                  }}
                  style={{
                    flex: 1.6,
                    padding: "12px",
                    background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                    border: "none",
                    borderRadius: "14px",
                    color: "#0d1b2a",
                    fontWeight: "900",
                    fontSize: "1.05rem",
                    cursor: "pointer",
                    boxShadow: "0 0 15px rgba(255, 209, 102, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    letterSpacing: "0.5px"
                  }}
                >
                  ▶ PLAY
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

MissionConsole.propTypes = {
  dayActivities: PropTypes.array,
  completedList: PropTypes.object,
  onStartGame: PropTypes.func,
};
