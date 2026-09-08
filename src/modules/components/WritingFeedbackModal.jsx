import PropTypes from "prop-types";
import { renderAnnotatedText } from "../utils/textAnnotations";
import "../../styles/WritingFeedbackModal.css";

export function WritingFeedbackModal({ notification, onClose }) {
  if (!notification) return null;

  const originalOrAnnotated =
    notification.annotated_text || notification.original_text || "";
  const hasErrorsMarked =
    notification.annotated_text &&
    notification.annotated_text.includes("<mark");

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
        </div>

        <button className="btn-understand-feedback" onClick={onClose}>
          ¡Entendido, Capitán! 🚀
        </button>
      </div>
    </div>
  );
}

WritingFeedbackModal.propTypes = {
  notification: PropTypes.shape({
    title: PropTypes.string,
    created_at: PropTypes.string,
    score: PropTypes.number,
    feedback: PropTypes.string,
    message: PropTypes.string,
    original_text: PropTypes.string,
    annotated_text: PropTypes.string,
    corrected_text: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};
