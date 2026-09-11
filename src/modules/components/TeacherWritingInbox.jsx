import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import { fetchWithAuth } from "../utils/apiClient";
import { renderAnnotatedText, stripHtmlMarks } from "../utils/textAnnotations";
import "../../styles/TeacherWritingInbox.css";

export function TeacherWritingInbox({ token }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [scoreInput, setScoreInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [annotatedTextInput, setAnnotatedTextInput] = useState("");
  const [correctedTextInput, setCorrectedTextInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [filter, setFilter] = useState("pending"); // "pending" or "all"

  const annotatedTextareaRef = useRef(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/writing-submissions/`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleSelectSubmission = (sub) => {
    setSelectedSubmission(sub);
    setScoreInput(sub.score !== null && sub.score !== undefined ? sub.score.toString() : "20");
    setFeedbackInput(sub.feedback || "");
    setAnnotatedTextInput(sub.annotated_text || sub.text || "");
    setCorrectedTextInput(sub.corrected_text || "");
    setStatusMsg("");
  };

  const handleMarkSelectionAsError = () => {
    const textarea = annotatedTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      setStatusMsg("ℹ️ Selecciona primero una palabra o frase con el mouse o teclado para marcarla como error.");
      return;
    }

    const currentVal = annotatedTextInput;
    const selectedText = currentVal.substring(start, end);

    if (selectedText.includes("<mark") || selectedText.includes("</mark>")) {
      setStatusMsg("⚠️ El texto seleccionado ya contiene etiquetas de error.");
      return;
    }

    const before = currentVal.substring(0, start);
    const after = currentVal.substring(end);
    const wrapped = `<mark class="err-mark">${selectedText}</mark>`;

    const newAnnotated = before + wrapped + after;
    setAnnotatedTextInput(newAnnotated);
    setStatusMsg(`🔴 Error marcado: "${selectedText}". Revisa la vista previa abajo.`);
  };

  const handleResetAnnotated = () => {
    if (!selectedSubmission) return;
    setAnnotatedTextInput(selectedSubmission.text || "");
    setStatusMsg("🔄 Marcas de error eliminadas. Se restauró el texto original.");
  };

  const handleCopyOriginalToCorrected = () => {
    if (!selectedSubmission) return;
    const cleanText = stripHtmlMarks(selectedSubmission.text || "");
    setCorrectedTextInput(cleanText);
    setStatusMsg("📋 Texto original copiado a la versión correcta. Ahora puedes corregir los errores ortográficos y gramaticales.");
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
      const res = await fetchWithAuth(`${API_BASE}/writing-submissions/${selectedSubmission.id}/mark_reviewed/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reviewed: true,
          score: numScore,
          feedback: feedbackInput.trim(),
          annotated_text: annotatedTextInput.trim(),
          corrected_text: correctedTextInput.trim()
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setStatusMsg("✅ Calificación (0-20), errores remarcados y versión correcta guardados y notificados al alumno.");
        setSelectedSubmission(updated);
        fetchSubmissions();
      } else {
        const errData = await res.json().catch(() => ({}));
        setStatusMsg(errData.detail || "❌ Error al guardar la calificación.");
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
        <h2>✉️ BANDEJA DE REVISIÓN Y CORRECCIÓN DE WRITING</h2>
        <p>
          Remarca los errores del estudiante, redacta la versión corregida sugerida y asigna la calificación
          (<strong>0 a 20</strong>). El alumno recibirá la retroalimentación visual directa en su buzón espacial.
        </p>
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
                  <span className="sub-student-name">
                    👤 {sub.student_username || `Recluta #${sub.student}`}
                  </span>
                  <span className={`sub-status-badge ${sub.reviewed ? "badge-green" : "badge-orange"}`}>
                    {sub.reviewed ? `⭐ ${sub.score}/20` : "Pendiente"}
                  </span>
                </div>
                <div className="sub-card-day-badge">
                  📅 Día {sub.day_number || 1} • {sub.room_name || "Aula General"}
                </div>
                <div className="sub-card-snippet">
                  "{sub.text ? sub.text.substring(0, 65) + "..." : "Sin texto"}"
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
                <div>
                  <h3>
                    📜 Redacción de {selectedSubmission.student_username || `Recluta #${selectedSubmission.student}`} — Día {selectedSubmission.day_number || 1}
                  </h3>
                  <span className="detail-date">
                    Enviado el {new Date(selectedSubmission.submitted_at).toLocaleString()}
                  </span>
                </div>
                {selectedSubmission.reviewed && (
                  <span className="reviewed-badge-indicator">
                    ✅ Calificado: {selectedSubmission.score}/20
                  </span>
                )}
              </div>

              {/* TOOL: REMARCAR ERRORES EN EL TEXTO ORIGINAL */}
              <div className="error-marking-tool-section">
                <div className="marking-tool-header">
                  <label>🔴 HERRAMIENTA: REMARCAR ERRORES EN EL ESCRITO DEL ALUMNO</label>
                  <div className="marking-tool-actions">
                    <button
                      type="button"
                      className="btn-mark-error"
                      onClick={handleMarkSelectionAsError}
                      title="Selecciona texto en el cuadro inferior y haz clic aquí para marcarlo como error"
                    >
                      🔴 Marcar Selección como Error
                    </button>
                    <button
                      type="button"
                      className="btn-reset-marks"
                      onClick={handleResetAnnotated}
                      title="Quita todas las marcas y vuelve al texto original"
                    >
                      🔄 Limpiar Marcas
                    </button>
                  </div>
                </div>

                <textarea
                  ref={annotatedTextareaRef}
                  className="annotated-textarea-editor"
                  rows="4"
                  value={annotatedTextInput}
                  onChange={(e) => setAnnotatedTextInput(e.target.value)}
                  placeholder="Selecciona las palabras con errores y haz clic en '🔴 Marcar Selección como Error'..."
                />

                {/* VISTA PREVIA VISUAL DE ERRORES REMARCADOS */}
                <div className="live-preview-box">
                  <div className="preview-label">
                    👀 Vista Previa de cómo lo verá el alumno:
                  </div>
                  <div className="preview-content">
                    {renderAnnotatedText(annotatedTextInput || "(Sin texto)")}
                  </div>
                </div>
              </div>

              {/* SECCIÓN DE CALIFICACIÓN Y VERSIÓN CORREGIDA */}
              <form onSubmit={handleSaveGrade} className="grading-form">
                {/* TOOL: VERSIÓN CORRECTA DEL TEXTO */}
                <div className="form-group-corrected">
                  <div className="corrected-header-bar">
                    <label htmlFor="corrected-input">
                      🟢 VERSIÓN CORRECTA DEL TEXTO (MODELO PEDAGÓGICO):
                    </label>
                    <button
                      type="button"
                      className="btn-copy-original"
                      onClick={handleCopyOriginalToCorrected}
                      title="Copia el texto original para editar y corregir solo los errores"
                    >
                      📋 Copiar texto del alumno
                    </button>
                  </div>
                  <textarea
                    id="corrected-input"
                    rows="3"
                    className="corrected-textarea"
                    value={correctedTextInput}
                    onChange={(e) => setCorrectedTextInput(e.target.value)}
                    placeholder="Escribe la versión correcta del texto del alumno para que aprenda la forma adecuada en inglés..."
                  />
                </div>

                {/* OBSERVACIONES Y CONSEJOS */}
                <div className="form-group-feedback">
                  <label htmlFor="feedback-input">
                    💬 Observaciones y Consejos del Profesor (Feedback):
                  </label>
                  <textarea
                    id="feedback-input"
                    rows="3"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Ej: ¡Buen intento! Recuerda usar el pasado simple en verbos irregulares como 'went' o 'bought'..."
                  />
                </div>

                {/* NOTA VIGESIMAL (0 A 20) */}
                <div className="form-group-score">
                  <label htmlFor="score-input">
                    ⭐ Calificación Final Writing (Escala de 0 a 20):
                  </label>
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

                {statusMsg && <div className="grading-status-banner">{statusMsg}</div>}

                <button type="submit" className="btn-submit-grade" disabled={saving}>
                  {saving ? "Guardando y Notificando..." : "💾 Guardar Calificación (0-20), Errores y Versión Correcta"}
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
