import { useState } from "react";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";
import "../../styles/Panel.css";

const DEFAULT_WRITING_PROMPTS = {
  1: "Write a short paragraph (20-50 words) introducing yourself to the crew: your name, age, country, likes, and abilities.",
  2: "Write a short report describing 4 key items in your space cabin and what they are used for.",
  3: "Describe your daily routine aboard the starship: what time you wake up, train, and study.",
  4: "Write about the actions and maintenance tasks the crew members are performing right now.",
  5: "Write about your habits in the starbase using frequency adverbs (always, usually, sometimes, never).",
  6: "Describe your mission equipment: list what tools you have and what supplies you don't have.",
  7: "Write an inquiry report asking 4 Wh- questions about the anomaly and signal origin.",
  8: "Write an inventory log identifying personal belongings using possessive pronouns (mine, yours, his, hers, ours).",
  9: "Draft an official communication transmission directed to Earth command and your fellow cadets.",
  10: "Describe the starship control console using demonstratives (this, that, these, those).",
  11: "Write a comparison report between two starships or exploration drones using comparative adjectives.",
  12: "Write a celestial record entry highlighting the fastest, biggest, and brightest cosmic phenomena.",
  13: "Write a captain's log entry about yesterday's expedition and what your crew discovered.",
  14: "Write your final graduation speech summarizing your accomplishments and journey as a space pioneer."
};

export function WritingGame({ activity, userId, onComplete, onClose, hideHeader = false }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const dayNum = activity?.day_num || activity?.dayNumber || activity?.day || 1;
  const promptText = activity?.questions?.[0]?.text || DEFAULT_WRITING_PROMPTS[dayNum] || DEFAULT_WRITING_PROMPTS[1];
  const minChars = 20;
  const charsRemaining = Math.max(0, minChars - text.trim().length);
  const isValidLength = text.trim().length >= minChars;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidLength) {
      setError(`Tu escrito debe contener al menos ${minChars} caracteres. Faltan ${charsRemaining} caracteres.`);
      soundFx.playError();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("basescrib_token") || "";
      // Calculate or extract mission ID (default to Day 1 = Mission 7, etc.)
      const missionId = activity?.mission || activity?.mission_id || (dayNum + 6);

      const res = await fetch(`${API_BASE}/writing-submissions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          student: userId || undefined,
          mission: missionId,
          day_number: dayNum,
          text: text.trim(),
          reviewed: false
        })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ detail: "Error" }));
        throw new Error(errBody.detail || "Error al transmitir la actividad escrita al profesor");
      }

      soundFx.playSuccess();
      soundFx.playStreakBonus();
      setIsSuccess(true);

      // Award XP & coins and trigger completion
      setTimeout(() => {
        if (onComplete) {
          onComplete(20, 20, 0); // 20 XP, 20 Coins, 0 mistakes
        }
      }, 2500);

    } catch (err) {
      setError(err.message);
      soundFx.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass-console auth-card panel-large retro-terminal animate-fadeIn"
      style={{
        maxWidth: 760,
        width: "100%",
        padding: "18px 24px",
        position: "relative",
        margin: "auto",
        border: "2px solid #39ff14",
        boxShadow: "0 0 35px rgba(57, 255, 20, 0.25)"
      }}
    >
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div
          className="panel-title-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            borderBottom: "1.5px solid rgba(57, 255, 20, 0.3)",
            paddingBottom: 10
          }}
        >
          <div style={{ textAlign: "left" }}>
            <span
              className="dashboard-kicker retro-text"
              style={{
                color: "#39ff14",
                textTransform: "uppercase",
                fontSize: "0.8rem",
                fontWeight: "bold",
                letterSpacing: "1px"
              }}
            >
              ✉️ Etapa 5: Terminal de Redacción & Envío al Buzón Docente
            </span>
            <h2 className="retro-text" style={{ margin: "4px 0 0 0", fontSize: "1.45rem", color: "#ffffff" }}>
              {activity?.title || `Informe Escrito Espacial — Día ${dayNum}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-logout"
            style={{
              margin: 0,
              padding: "6px 14px",
              background: "rgba(239, 68, 68, 0.2)",
              border: "1.5px solid #ef4444",
              color: "#ef4444",
              fontWeight: "bold"
            }}
          >
            Cerrar X
          </button>
        </div>
      )}

      {error && (
        <div
          className="error-message animate-fadeIn"
          style={{
            background: "rgba(255, 107, 107, 0.15)",
            border: "1.5px solid #ff6b6b",
            color: "#ff6b6b",
            marginBottom: 12,
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: "600"
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div>
        <h3
          className="retro-text"
          style={{
            color: "#39ff14",
            marginBottom: 10,
            fontSize: "0.95rem",
            textAlign: "left",
            lineHeight: "1.4"
          }}
        >
          &gt; INSTRUCCIONES: Redacta tu informe en inglés en la terminal y presiona el botón inferior para enviarlo directamente a la bandeja de calificación de tu profesor.
        </h3>

        {/* Writing Prompt Box */}
        <div
          style={{
            background: "rgba(0, 20, 5, 0.6)",
            border: "1.5px solid rgba(57, 255, 20, 0.4)",
            borderRadius: 14,
            padding: "16px 18px",
            marginBottom: 14,
            textAlign: "left"
          }}
        >
          <div
            className="retro-text"
            style={{
              color: "#ffd166",
              fontWeight: "900",
              fontSize: "0.85rem",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <span>📡</span> CONSIGNAS DEL COMANDO ESPACIAL (DÍA {dayNum}):
          </div>
          <p
            className="retro-text"
            style={{
              margin: 0,
              fontSize: "1.05rem",
              color: "#e6f7ff",
              lineHeight: 1.5,
              fontWeight: "500"
            }}
          >
            {promptText}
          </p>
        </div>

        {/* Text Input Area & Action Button */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError("");
              }}
              disabled={loading || isSuccess}
              rows={5}
              placeholder="Escribe tu texto en inglés aquí... (Ej: Hello commander! My name is Tom and I am ready for the mission...)"
              className="retro-input"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                fontSize: "1rem",
                resize: "vertical",
                minHeight: "120px",
                boxSizing: "border-box",
                lineHeight: "1.5",
                background: "rgba(5, 15, 5, 0.8)",
                border: isValidLength ? "2px solid #39ff14" : "1.5px solid rgba(57, 255, 20, 0.3)",
                color: "#b8fff9",
                fontFamily: "monospace"
              }}
            />

            {/* Character counter & guidance indicator */}
            <div
              className="retro-text"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.85rem",
                marginTop: 8,
                color: isValidLength ? "#39ff14" : "#ffd166"
              }}
            >
              <span>
                {isValidLength ? (
                  <strong style={{ color: "#39ff14" }}>✓ Longitud mínima alcanzada ({text.trim().length} caracteres)</strong>
                ) : (
                  <span>⏳ Mínimo requerido: {minChars} caracteres (Faltan {charsRemaining})</span>
                )}
              </span>
              <span>LOG: {text.trim().length} CHR</span>
            </div>

            {/* Big Prominent Submit Button */}
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <button
                type="submit"
                disabled={loading || isSuccess || !isValidLength}
                style={{
                  width: "100%",
                  maxWidth: 420,
                  padding: "15px 28px",
                  background: !isValidLength
                    ? "rgba(57, 255, 20, 0.15)"
                    : "linear-gradient(135deg, #1b5e20, #2e7d32)",
                  color: !isValidLength ? "#888888" : "#ffffff",
                  border: !isValidLength ? "2px solid #444444" : "2px solid #39ff14",
                  borderRadius: 14,
                  boxShadow: isValidLength ? "0 0 25px rgba(57, 255, 20, 0.4)" : "none",
                  fontSize: "1.05rem",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  cursor: isValidLength ? "pointer" : "not-allowed",
                  transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10
                }}
              >
                {loading ? (
                  <span>📡 TRANSMITIENDO AL BUZÓN DOCENTE...</span>
                ) : (
                  <span>✉️ ENVIAR INFORME AL PROFESOR ➔</span>
                )}
              </button>

              {!isValidLength && (
                <small style={{ color: "#9be6df", fontSize: "0.8rem" }}>
                  Escribe al menos {minChars} caracteres para habilitar el botón de envío.
                </small>
              )}
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div
            className="animate-scaleUp"
            style={{
              background: "rgba(46, 196, 182, 0.15)",
              border: "2px solid #2ec4b6",
              borderRadius: 16,
              padding: "24px 20px",
              marginTop: 14,
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: 8 }}>📬</div>
            <h2 style={{ color: "#2ec4b6", margin: "0 0 8px 0", fontSize: "1.45rem" }}>
              ¡INFORME TRANSMITIDO AL PROFESOR!
            </h2>
            <p style={{ color: "#ffffff", fontSize: "1rem", margin: "0 0 10px 0" }}>
              Tu escrito fue recibido exitosamente en la <strong>Bandeja de Calificación del Docente</strong>.
            </p>
            <div style={{ color: "#ffd166", fontWeight: "bold", fontSize: "1.1rem" }}>
              ⭐ Recompensa: +20 XP | +20 Monedas 🪙 acreditadas
            </div>
            <p style={{ color: "#9be6df", fontSize: "0.85rem", marginTop: 10 }}>
              El profesor revisará tu redacción y te asignará una nota de 0 a 20 con retroalimentación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

WritingGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string,
    mission: PropTypes.number,
    mission_id: PropTypes.number,
    day_num: PropTypes.number,
    dayNumber: PropTypes.number,
    day: PropTypes.number,
    questions: PropTypes.array
  }),
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  hideHeader: PropTypes.bool
};
