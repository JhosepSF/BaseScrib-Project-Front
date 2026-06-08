import { useState } from "react";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";

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
        onComplete(15, 0); // 15 XP, 0 Coins (pending review)
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card panel-large animate-fadeIn" style={{ maxWidth: 700 }}>
      <div className="panel-title-row" style={{ marginBottom: 20 }}>
        <div>
          <span className="dashboard-kicker">Actividad 5: Transmisión Escrita (Laboratorio)</span>
          <h2>{activity.title}</h2>
        </div>
        <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 12px" }}>
          Cerrar X
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {currentQuestion ? (
        <div>
          <h3 style={{ color: "#ffd166", marginBottom: 15, fontSize: "1.1rem" }}>
            Instrucciones: Escribe tu presentación personal en inglés y transmítela a tu docente para su revisión y calificación.
          </h3>

          {/* Writing Prompt Console */}
          <div 
            className="writing-console" 
            style={{ 
              background: "rgba(0, 0, 0, 0.4)", 
              border: "1px solid rgba(184, 255, 249, 0.15)", 
              borderRadius: 15, 
              padding: 20,
              marginBottom: 20
            }}
          >
            <div style={{ color: "#b8fff9", fontWeight: "bold", fontSize: "0.95rem", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              🛰️ MENSAJE DE TRANSMISIÓN REQUERIDO:
            </div>
            <p style={{ margin: "0 0 15px 0", fontSize: "1.1rem", color: "#e6f7ff", lineHeight: 1.5 }}>
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
                placeholder="Escribe tu presentación aquí en inglés... (Ej: Hello! My name is Leo...)"
                style={{
                  width: "100%",
                  padding: 15,
                  borderRadius: 10,
                  border: "1px solid rgba(184, 255, 249, 0.3)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#e6f7ff",
                  fontSize: "1.05rem",
                  fontFamily: "inherit",
                  resize: "none",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => e.target.style.borderColor = "#2ec4b6"}
                onBlur={(e) => e.target.style.borderColor = "rgba(184, 255, 249, 0.3)"}
              />

              <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.85rem", marginTop: 8 }}>
                <span>Mínimo 30 caracteres</span>
                <span>Caracteres: {text.length}</span>
              </div>

              {/* Action button */}
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <button 
                  type="submit"
                  className="btn-create" 
                  style={{ 
                    width: "100%", 
                    maxWidth: 300, 
                    padding: 15,
                    background: "linear-gradient(135deg, #a8eaf5, #90e0ef)",
                    color: "#002427"
                  }} 
                  disabled={loading || isSuccess || text.trim().length === 0}
                >
                  {loading ? "Iniciando Transmisión..." : "📡 Transmitir a la Tierra"}
                </button>
              </div>
            </form>
          </div>

          {isSuccess && (
            <div style={{ marginTop: 15, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }} className="animate-pulse">
              ✨ ¡Transmisión en curso! Señal enviada a la base espacial con éxito. (+15 XP)
            </div>
          )}
        </div>
      ) : (
        <p>Cargando preguntas de Writing Lab...</p>
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
