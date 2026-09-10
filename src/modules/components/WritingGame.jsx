import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";
import { fetchWithAuth } from "../utils/apiClient";
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
  const [prevSubmission, setPrevSubmission] = useState(null);

  const dayNum = activity?.day_num || activity?.dayNumber || activity?.day || 1;
  const promptText = activity?.questions?.[0]?.text || DEFAULT_WRITING_PROMPTS[dayNum] || DEFAULT_WRITING_PROMPTS[1];
  const minChars = 20;
  const charsRemaining = Math.max(0, minChars - text.trim().length);
  const isValidLength = text.trim().length >= minChars;

  // Cargar envío previo del estudiante para este día (si existe) para permitir reenvío/mejora
  useEffect(() => {
    let isMounted = true;
    fetchWithAuth(`${API_BASE}/writing-submissions/`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (!isMounted || !Array.isArray(data)) return;
        const daySubs = data.filter(s => {
          const sDay = s.day_number || (s.mission_id && s.mission_id <= 14 ? s.mission_id : 1);
          return sDay === dayNum;
        });
        if (daySubs.length > 0) {
          daySubs.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
          const latest = daySubs[0];
          setText(prev => (prev ? prev : (latest.text || "")));
        }
      })
      .catch(err => {
        console.warn("Could not fetch prior writing submission:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [dayNum]);

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
      const missionId = activity?.mission || activity?.mission_id || dayNum;

      const res = await fetchWithAuth(`${API_BASE}/writing-submissions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
      className="glass-console auth-card panel-large animate-fadeIn"
      style={{
        maxWidth: 760,
        width: "100%",
        padding: "clamp(8px, 1.8vh, 16px) clamp(10px, 2vw, 18px)",
        position: "relative",
        margin: "0 auto",
        border: "2px solid #39ff14",
        boxShadow: "0 0 35px rgba(57, 255, 20, 0.25)",
        boxSizing: "border-box"
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
            marginBottom: "clamp(6px, 1.2vh, 10px)",
            borderBottom: "1.5px solid rgba(57, 255, 20, 0.3)",
            paddingBottom: "clamp(4px, 1vh, 8px)"
          }}
        >
          <div style={{ textAlign: "left" }}>
            <span
              className="dashboard-kicker retro-text"
              style={{
                color: "#39ff14",
                textTransform: "uppercase",
                fontSize: "clamp(0.68rem, 1.3vh, 0.76rem)",
                fontWeight: "bold",
                letterSpacing: "0.8px"
              }}
            >
              ✉️ Etapa 5: Terminal de Redacción & Envío al Buzón Docente
            </span>
            <h2 className="retro-text" style={{ margin: "2px 0 0 0", fontSize: "clamp(1.1rem, 2.2vh, 1.35rem)", color: "#ffffff" }}>
              {activity?.title || `Informe Escrito Espacial — Día ${dayNum}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-logout"
            style={{
              margin: 0,
              padding: "4px 12px",
              fontSize: "0.82rem",
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
            marginBottom: 8,
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "0.85rem",
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
            marginBottom: "clamp(4px, 1vh, 8px)",
            fontSize: "clamp(0.78rem, 1.5vh, 0.88rem)",
            textAlign: "left",
            lineHeight: "1.3"
          }}
        >
          &gt; INSTRUCCIONES: Redacta tu informe en inglés en la terminal y presiona el botón inferior para enviarlo directamente a la bandeja de calificación de tu profesor.
        </h3>

        {/* Writing Prompt Box */}
        <div
          style={{
            background: "rgba(0, 20, 5, 0.6)",
            border: "1.5px solid rgba(57, 255, 20, 0.4)",
            borderRadius: 12,
            padding: "clamp(8px, 1.4vh, 12px) clamp(10px, 1.8vw, 16px)",
            marginBottom: "clamp(6px, 1.2vh, 10px)",
            textAlign: "left"
          }}
        >
          <div
            className="retro-text"
            style={{
              color: "#ffd166",
              fontWeight: "900",
              fontSize: "clamp(0.72rem, 1.4vh, 0.82rem)",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
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
              fontSize: "clamp(0.85rem, 1.7vh, 0.98rem)",
              color: "#e6f7ff",
              lineHeight: 1.4,
              fontWeight: "500"
            }}
          >
            {promptText}
          </p>
        </div>

        {/* Banner de Entrega / Evaluación Anterior */}
        {prevSubmission && (
          <div
            className="animate-fadeIn"
            style={{
              background: prevSubmission.reviewed ? "rgba(255, 209, 102, 0.12)" : "rgba(46, 196, 182, 0.12)",
              border: prevSubmission.reviewed ? "1.5px solid #ffd166" : "1.5px solid #2ec4b6",
              borderRadius: 12,
              padding: "clamp(6px, 1.2vh, 10px) clamp(10px, 1.8vw, 14px)",
              marginBottom: "clamp(6px, 1.2vh, 10px)",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontWeight: "900", fontSize: "0.8rem", color: prevSubmission.reviewed ? "#ffd166" : "#2ec4b6" }}>
                {prevSubmission.reviewed ? "📜 CALIFICACIÓN ANTERIOR REGISTRADA:" : "📬 ENTREGA ANTERIOR DETECTADA:"}
              </span>
              {prevSubmission.score !== null && prevSubmission.score !== undefined && (
                <span style={{ background: "rgba(255, 209, 102, 0.25)", color: "#ffd166", padding: "2px 8px", borderRadius: 6, fontWeight: 900, fontSize: "0.8rem" }}>
                  ⭐ {prevSubmission.score} / 20 PTS
                </span>
              )}
            </div>
            {prevSubmission.feedback && (
              <p style={{ margin: "2px 0 4px 0", fontSize: "0.82rem", color: "#e6f7ff" }}>
                <strong>Observaciones del Profesor:</strong> "{prevSubmission.feedback}"
              </p>
            )}
            <small style={{ color: "#9be6df", fontSize: "0.75rem", display: "block" }}>
              💡 Tu escrito previo ya fue cargado en la terminal. Puedes editarlo, corregir los detalles señalados por el docente y reenviarlo para subir tu calificación.
            </small>
          </div>
        )}

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
              rows={4}
              placeholder="Escribe tu texto en inglés aquí... (Ej: Hello commander! My name is Tom and I am ready for the mission...)"
              className="retro-input"
              style={{
                width: "100%",
                padding: "clamp(8px, 1.4vh, 12px) 14px",
                borderRadius: 10,
                fontSize: "clamp(0.85rem, 1.6vh, 0.95rem)",
                resize: "vertical",
                minHeight: "clamp(70px, 13vh, 115px)",
                boxSizing: "border-box",
                lineHeight: "1.4",
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
                fontSize: "clamp(0.75rem, 1.4vh, 0.82rem)",
                marginTop: 6,
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
            <div style={{ marginTop: "clamp(8px, 1.6vh, 14px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <button
                type="submit"
                disabled={loading || isSuccess || !isValidLength}
                style={{
                  width: "100%",
                  maxWidth: 420,
                  padding: "clamp(10px, 1.8vh, 13px) 20px",
                  background: !isValidLength
                    ? "rgba(57, 255, 20, 0.15)"
                    : "linear-gradient(135deg, #1b5e20, #2e7d32)",
                  color: !isValidLength ? "#888888" : "#ffffff",
                  border: !isValidLength ? "2px solid #444444" : "2px solid #39ff14",
                  borderRadius: 12,
                  boxShadow: isValidLength ? "0 0 20px rgba(57, 255, 20, 0.35)" : "none",
                  fontSize: "clamp(0.85rem, 1.8vh, 0.98rem)",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  cursor: isValidLength ? "pointer" : "not-allowed",
                  transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                {loading ? (
                  <span>📡 TRANSMITIENDO AL BUZÓN DOCENTE...</span>
                ) : prevSubmission?.reviewed ? (
                  <span>✉️ REENVIAR INFORME CORREGIDO AL PROFESOR ➔</span>
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
              {prevSubmission?.reviewed ? "¡INFORME CORREGIDO TRANSMITIDO AL PROFESOR!" : "¡INFORME TRANSMITIDO AL PROFESOR!"}
            </h2>
            <p style={{ color: "#ffffff", fontSize: "1rem", margin: "0 0 10px 0" }}>
              {prevSubmission?.reviewed
                ? "Tu nueva versión corregida fue enviada exitosamente a la Bandeja Docente para actualizar tu calificación."
                : "Tu escrito fue recibido exitosamente en la Bandeja de Calificación del Docente."}
            </p>
            <div style={{ color: "#ffd166", fontWeight: "bold", fontSize: "1.1rem" }}>
              ⭐ Recompensa: +20 XP | +20 Monedas 🪙 acreditadas
            </div>
            <p style={{ color: "#9be6df", fontSize: "0.85rem", marginTop: 10 }}>
              El profesor revisará tu redacción y actualizará tu nota oficial de 0 a 20 con retroalimentación.
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
