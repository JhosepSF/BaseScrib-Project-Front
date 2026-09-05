import PropTypes from "prop-types";
import "../../styles/WritingFeedbackModal.css";

export function WritingFeedbackModal({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="feedback-close-btn" onClick={onClose}>✕</button>

        <div className="feedback-modal-header">
          <span className="feedback-badge-tag">✉️ NOTIFICACIÓN OFICIAL</span>
          <h2>{notification.title || "Evaluación de Writing"}</h2>
          <small>{new Date(notification.created_at).toLocaleString()}</small>
        </div>

        <div className="feedback-score-hero">
          <span>CALIFICACIÓN REGISTRADA POR EL PROFESOR:</span>
          <div className="hero-score-badge">
            <span className="score-star">⭐</span>
            <span className="score-num">{notification.score !== null ? notification.score : "--"}</span>
            <span className="score-max">/ 20</span>
          </div>
        </div>

        <div className="feedback-comments-section">
          <h4>💬 Observaciones y Correcciones del Docente:</h4>
          <div className="feedback-text-content">
            {notification.feedback || notification.message || "El profesor ha revisado tu entrega."}
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
  notification: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
