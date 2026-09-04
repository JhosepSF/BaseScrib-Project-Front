import { useState } from "react";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import "../../styles/Panel.css";

export function WritingGame({ activity, userId, onComplete, onClose }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const questions = activity.questions || [];
  const currentQuestion = questions[0]; // Active writing prompt

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim().length < 30) {
      setError("Tu escrito debe contener al menos 30 caracteres para ser transmitido.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("basescrib_token") || "";
      const res = await fetch(`${API_BASE}/writing-submissions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          student: userId,
          mission: activity.mission, // mission ID
          text: text,
          reviewed: false
        })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ detail: "error" }));
        throw new Error(errBody.detail || "Error al enviar la actividad escrita");
      }

      setIsSuccess(true);
      
      // Award 15 XP immediately on submission
      setTimeout(() => {
        onComplete(20, 20); // 20 XP, 20 Coins
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-console auth-card panel-large retro-terminal animate-fadeIn" style={{ maxWidth: 750, padding: 30, position: "relative" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, borderBottom: "1.5px solid #153a1a", paddingBottom: 15 }}>
        <div style={{ textAlign: "left" }}>
          <span className="dashboard-kicker retro-text" style={{ textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "bold" }}>
            Misión 5: Terminal de Comunicaciones Comms
          </span>
          <h2 className="retro-text" style={{ margin: "5px 0 0 0", fontSize: "1.6rem" }}>{activity.title}</h2>
        </div>
        <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "8px 16px", background: "#153a1a", border: "1px solid #39ff14", color: "#39ff14" }}>
          Cerrar X
        </button>
      </div>

      {error && <div className="error-message" style={{ background: "rgba(255, 107, 107, 0.1)", border: "1px solid #ff6b6b", color: "#ff6b6b" }}>{error}</div>}

      {currentQuestion ? (
        <div>
          <h3 className="retro-text" style={{ marginBottom: 15, fontSize: "1.05rem", textAlign: "left" }}>
            &gt; INSTRUCCIONES: Escribe tu reporte en inglés en la terminal y transmite al comando de la Tierra.
          </h3>

          {/* Writing Prompt Console */}
          <div 
            style={{ 
              background: "rgba(0, 10, 0, 0.4)", 
              border: "1.5px solid #153a1a", 
              borderRadius: 12, 
              padding: 20,
              marginBottom: 20
            }}
          >
            <div className="retro-text" style={{ fontWeight: "bold", fontSize: "0.9rem", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
              &gt;&gt; SOLICITUD DE TRANSMISIÓN:
            </div>
            <p className="retro-text" style={{ margin: "0 0 20px 0", fontSize: "1.1rem", lineHeight: 1.5 }}>
              {currentQuestion.text}
            </p>

            <form onSubmit={handleSubmit}>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError("");
                }}
                disabled={loading || isSuccess}
                rows={6}
                placeholder="Escribe tu texto aquí en inglés... (Ej: Hello! My name is Tom...)"
                className="retro-input"
                style={{
                  width: "100%",
                  padding: 15,
                  borderRadius: 8,
                  fontSize: "1.05rem",
                  resize: "none",
                  boxSizing: "border-box",
                  lineHeight: "1.5",
                }}
              />

              <div className="retro-text" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginTop: 8 }}>
                <span>[MINIMO: 30 CARACTERES]</span>
                <span>[LOG: {text.length} CHR]</span>
              </div>

              {/* Action button */}
              <div style={{ marginTop: 25, display: "flex", justifyContent: "center" }}>
                <button 
                  type="submit"
                  disabled={loading || isSuccess || text.trim().length === 0}
                  style={{ 
                    width: "100%", 
                    maxWidth: 320, 
                    padding: "16px 24px",
                    background: "linear-gradient(135deg, #153a1a, #0d2511)",
                    color: "#39ff14",
                    border: "2px solid #39ff14",
                    boxShadow: "0 0 15px rgba(57, 255, 20, 0.25)",
                    fontSize: "1.05rem",
                    fontWeight: "bold",
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    cursor: "pointer"
                  }}
                >
                  {loading ? ">> ESTABLECIENDO CANAL..." : "📡 Iniciar Transmisión de Datos"}
                </button>
              </div>
            </form>
          </div>

          {isSuccess && (
            <div className="retro-text" style={{ marginTop: 20, fontWeight: "bold", textAlign: "center", fontSize: "1.05rem" }}>
              📡 TRANSMISIÓN COMPLETADA EXITOSAMENTE. (+15 XP REGISTRADOS)
            </div>
          )}
        </div>
      ) : (
        <p className="retro-text">Cargando comunicaciones de terminal...</p>
      )}
    </div>
  );
}

WritingGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    mission: PropTypes.number.isRequired,
    questions: PropTypes.array
  }).isRequired,
  userId: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
