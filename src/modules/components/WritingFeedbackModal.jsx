import { useState } from "react";
import PropTypes from "prop-types";
import { renderAnnotatedText } from "../utils/textAnnotations";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";
import { fetchWithAuth } from "../utils/apiClient";
import "../../styles/WritingFeedbackModal.css";

export function WritingFeedbackModal({ notification, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [revisedText, setRevisedText] = useState(
    notification?.original_text || ""
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  if (!notification) return null;

  const originalOrAnnotated =
    notification.annotated_text || notification.original_text || "";
  const hasErrorsMarked =
    notification.annotated_text &&
    notification.annotated_text.includes("<mark");

  const minChars = 20;
  const charsRemaining = Math.max(0, minChars - revisedText.trim().length);
  const isValidLength = revisedText.trim().length >= minChars;

  const handleStartEdit = () => {
    soundFx.playClick();
    if (!revisedText && notification.original_text) {
      setRevisedText(notification.original_text);
    }
    setIsEditing(true);
    setErrorMsg("");
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!isValidLength) {
      setErrorMsg(`Tu escrito debe contener al menos ${minChars} caracteres. Faltan ${charsRemaining} caracteres.`);
      soundFx.playError();
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const day = notification.day_number || 1;

      const res = await fetchWithAuth(`${API_BASE}/writing-submissions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          day_number: day,
          text: revisedText.trim(),
          reviewed: false
        })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ detail: "Error al transmitir" }));
        throw new Error(errBody.detail || "Error al transmitir tu versión corregida");
      }

      soundFx.playSuccess();
      soundFx.playStreakBonus();
      setSuccessMsg(true);
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err.message || "No se pudo reenviar la redacción.");
      soundFx.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="feedback-close-btn" onClick={onClose} title="Cerrar modal">
          ✕
        </button>

        <div className="feedback-modal-header">
          <span className="feedback-badge-tag">✉️ EVALUACIÓN DOCENTE OFICIAL</span>
          <h2>{notification.title || "Revisión de Writing"}</h2>
          <small>{new Date(notification.created_at).toLocaleString()}</small>
        </div>

        {/* HERO SCORE BADGE (0 - 20) */}
        <div className="feedback-score-hero">
          <span className="score-hero-label">CALIFICACIÓN REGISTRADA POR EL PROFESOR:</span>
          <div className="hero-score-badge">
            <span className="score-star">⭐</span>
            <span className="score-num">
              {notification.score !== null && notification.score !== undefined
                ? notification.score
                : "--"}
            </span>
            <span className="score-max">/ 20</span>
          </div>
        </div>

        {/* SCROLLABLE FEEDBACK BODY */}
        <div className="feedback-modal-body">
          {/* SECCIÓN 1: TEXTO DEL ALUMNO CON ERRORES RESALTADOS */}
          {originalOrAnnotated && (
            <div className="feedback-section feedback-section-annotated">
              <div className="section-title-bar">
                <span className="section-icon">🔴</span>
                <h4>Tu Redacción {hasErrorsMarked ? "con Errores Señalados:" : "Entregada:"}</h4>
                {hasErrorsMarked && (
                  <span className="errors-found-pill">Errores detectados</span>
                )}
              </div>
              <div className="feedback-annotated-box">
                {renderAnnotatedText(originalOrAnnotated)}
              </div>
            </div>
          )}

          {/* SECCIÓN 2: VERSIÓN CORRECTA SUGERIDA POR EL PROFESOR */}
          {notification.corrected_text && (
            <div className="feedback-section feedback-section-corrected">
              <div className="section-title-bar">
                <span className="section-icon">🟢</span>
                <h4>Versión Correcta Recomendada por el Docente:</h4>
              </div>
              <div className="feedback-corrected-box">
                {notification.corrected_text}
              </div>
            </div>
          )}

          {/* SECCIÓN 3: OBSERVACIONES Y CONSEJOS */}
          <div className="feedback-section feedback-section-comments">
            <div className="section-title-bar">
              <span className="section-icon">💬</span>
              <h4>Observaciones y Consejos Pedagógicos:</h4>
            </div>
            <div className="feedback-comments-box">
              {notification.feedback ||
                notification.message ||
                "El docente ha revisado tu informe de escritura."}
            </div>
          </div>

          {/* SECCIÓN 4: PANEL DE CORRECCIÓN Y REENVÍO (SI SE ACTIVA) */}
          {isEditing && (
            <div className="feedback-revision-box animate-fadeIn">
              <div className="section-title-bar" style={{ marginBottom: 10 }}>
                <span className="section-icon">✍️</span>
                <h4 style={{ color: "#ffd166" }}>
                  Bandeja de Corrección y Mejora de Redacción:
                </h4>
              </div>
              <p style={{ fontSize: "0.84rem", color: "#b8fff9", margin: "0 0 10px 0" }}>
                Aplica las recomendaciones del profesor y reenvía tu texto para subir tu nota.
              </p>

              {errorMsg && (
                <div className="feedback-revision-error">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleResubmit}>
                <textarea
                  value={revisedText}
                  onChange={(e) => setRevisedText(e.target.value)}
                  disabled={loading}
                  rows={4}
                  className="feedback-revision-textarea"
                  placeholder="Corrige tu redacción en inglés aquí..."
                />

                <div className="feedback-revision-counter">
                  <span>
                    {isValidLength ? (
                      <strong style={{ color: "#2ec4b6" }}>✓ Longitud suficiente ({revisedText.trim().length} caracteres)</strong>
                    ) : (
                      <span style={{ color: "#ffd166" }}>⏳ Mínimo requerido: {minChars} caracteres (Faltan {charsRemaining})</span>
                    )}
                  </span>
                  <span>LOG: {revisedText.trim().length} CHR</span>
                </div>

                <div className="feedback-revision-actions">
                  <button
                    type="button"
                    className="btn-revision-cancel"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    ← Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-revision-submit"
                    disabled={loading || !isValidLength}
                  >
                    {loading ? "📡 Transmitiendo..." : "✉️ Reenviar al Profesor para Recalificar ➔"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CONFIRMACIÓN DE REENVÍO EXITOSO */}
          {successMsg && (
            <div className="feedback-success-banner animate-scaleUp">
              <span style={{ fontSize: "1.8rem" }}>📬</span>
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "#2ec4b6", fontSize: "1rem" }}>
                  ¡NUEVA VERSIÓN TRANSMITIDA AL PROFESOR!
                </h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#e6f7ff" }}>
                  Tu redacción corregida ya está en la bandeja del docente para una nueva evaluación.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ACCIONES DEL MODAL */}
        {!isEditing && (
          <div className="feedback-modal-actions">
            <button className="btn-understand-feedback" onClick={onClose}>
              ¡Entendido, Capitán! 🚀
            </button>
            {!successMsg && (
              <button className="btn-retry-writing-feedback" onClick={handleStartEdit}>
                ✏️ Corregir Mi Redacción y Reenviar ➔
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

WritingFeedbackModal.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    created_at: PropTypes.string,
    score: PropTypes.number,
    feedback: PropTypes.string,
    message: PropTypes.string,
    original_text: PropTypes.string,
    annotated_text: PropTypes.string,
    corrected_text: PropTypes.string,
    day_number: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};
