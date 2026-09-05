import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import "../../styles/TeacherWritingInbox.css";

export function TeacherWritingInbox({ token }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [filter, setFilter] = useState("pending"); // "pending" or "all"

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/writing-submissions/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSelectSubmission = (sub) => {
    setSelectedSubmission(sub);
    setScoreInput(sub.score !== null && sub.score !== undefined ? sub.score.toString() : "20");
    setFeedbackInput(sub.feedback || "");
    setStatusMsg("");
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const numScore = parseInt(scoreInput, 10);
    if (isNaN(numScore) || numScore < 0 || numScore > 20) {
      setStatusMsg("⚠️ La nota debe ser un número entero entre 0 y 20.");
      return;
    }

    setSaving(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${API_BASE}/writing-submissions/${selectedSubmission.id}/mark_reviewed/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewed: true,
          score: numScore,
          feedback: feedbackInput
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setStatusMsg("✅ Calificación de 0 a 20 guardada y estudiante notificado exitosamente.");
        setSelectedSubmission(updated);
        fetchSubmissions();
      } else {
        setStatusMsg("❌ Error al guardar la calificación.");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Error de red.");
    } finally {
      setSaving(false);
    }
  };

  const filteredList = submissions.filter(sub => {
    if (filter === "pending") return !sub.reviewed;
    return true;
  });

  return (
    <div className="teacher-inbox-container">
      <div className="inbox-header">
        <h2>✉️ BANDEJA DE REVISIÓN Y CALIFICACIÓN DE WRITING</h2>
        <p>Evalúa las redacciones enviadas por los estudiantes. Asigna una calificación de <strong>0 a 20</strong> y comentarios de retroalimentación.</p>
      </div>

      <div className="inbox-filter-bar">
        <button
          className={`filter-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          ⏳ Pendientes ({submissions.filter(s => !s.reviewed).length})
        </button>
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          📋 Todos los Envíos ({submissions.length})
        </button>
        <button className="btn-refresh-inbox" onClick={fetchSubmissions} disabled={loading}>
          🔄 Actualizar
        </button>
      </div>

      <div className="inbox-main-layout">
        {/* Left Submissions List */}
        <div className="submissions-sidebar">
          {loading && <p className="inbox-loading">Cargando envíos...</p>}
          {!loading && filteredList.length === 0 && (
            <p className="inbox-empty">No hay escritos en esta categoría.</p>
          )}

          {filteredList.map((sub) => {
            const isSelected = selectedSubmission?.id === sub.id;
            return (
              <div
                key={sub.id}
                className={`submission-card ${isSelected ? "selected" : ""} ${sub.reviewed ? "reviewed" : ""}`}
                onClick={() => handleSelectSubmission(sub)}
              >
                <div className="sub-card-top">
                  <span className="sub-student-name">👤 Recluta #{sub.student}</span>
                  <span className={`sub-status-badge ${sub.reviewed ? "badge-green" : "badge-orange"}`}>
                    {sub.reviewed ? `⭐ ${sub.score}/20` : "Pendiente"}
                  </span>
                </div>
                <div className="sub-card-snippet">
                  "{sub.text ? sub.text.substring(0, 70) + "..." : "Sin texto"}"
                </div>
                <small className="sub-date">
                  {new Date(sub.submitted_at).toLocaleDateString()} {new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            );
          })}
        </div>

        {/* Right Detail & Grading Form */}
        <div className="submission-detail-pane">
          {selectedSubmission ? (
            <div className="detail-card-inner">
              <div className="detail-header">
                <h3>📜 Informe Enviado por Recluta #{selectedSubmission.student}</h3>
                <span className="detail-date">
                  Enviado el {new Date(selectedSubmission.submitted_at).toLocaleString()}
                </span>
              </div>

              <div className="student-text-box">
                <label>DOCUMENTO COMPLETO DEL ALUMNO:</label>
                <div className="text-content-display">
                  {selectedSubmission.text}
                </div>
              </div>

              <form onSubmit={handleSaveGrade} className="grading-form">
                <h4>✍️ EVALUACIÓN DOCENTE (ESCALA DE 0 A 20)</h4>

                <div className="form-group-score">
                  <label htmlFor="score-input">Calificación Final Writing (0 a 20):</label>
                  <div className="score-input-wrapper">
                    <input
                      id="score-input"
                      type="number"
                      min="0"
                      max="20"
                      value={scoreInput}
                      onChange={(e) => setScoreInput(e.target.value)}
                      required
                    />
                    <span className="max-score-tag">/ 20 Puntos</span>
                  </div>
                </div>

                <div className="form-group-feedback">
                  <label htmlFor="feedback-input">Observaciones y Correcciones del Profesor:</label>
                  <textarea
                    id="feedback-input"
                    rows="4"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Ej: Excelente uso de vocabulario sobre rutinas. Revisa la ortografía de los verbos en tercera persona."
                  />
                </div>

                {statusMsg && <div className="grading-status-banner">{statusMsg}</div>}

                <button type="submit" className="btn-submit-grade" disabled={saving}>
                  {saving ? "Guardando y Notificando..." : "💾 Guardar Calificación (0-20) y Notificar Alumno"}
                </button>
              </form>
            </div>
          ) : (
            <div className="no-selection-placeholder">
              <span>👈 Selecciona un escrito de la lista izquierda para evaluar.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

TeacherWritingInbox.propTypes = {
  token: PropTypes.string.isRequired,
};
