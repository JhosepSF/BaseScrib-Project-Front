import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";
import { renderAnnotatedText, stripHtmlMarks } from "../utils/textAnnotations";

export function TeacherDailyGrades({ token, rooms = [] }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Quick grading modal state
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [modalScore, setModalScore] = useState(15);
  const [modalFeedback, setModalFeedback] = useState("");
  const [modalAnnotatedText, setModalAnnotatedText] = useState("");
  const [modalCorrectedText, setModalCorrectedText] = useState("");
  const [annotatedStatusMsg, setAnnotatedStatusMsg] = useState("");
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [gradeSuccessMsg, setGradeSuccessMsg] = useState("");

  const modalAnnotatedRef = useRef(null);

  const authToken = token || localStorage.getItem("basescrib_token") || "";

  const fetchDailyGrades = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${API_BASE}/teacher-profiles/daily-grades/`;
      if (selectedRoomId) {
        url += `?room_id=${selectedRoomId}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) {
        throw new Error("No se pudieron cargar las calificaciones diarias");
      }
      const data = await res.json();
      setStudents(data.students || []);
      if (data.students?.length > 0 && !selectedStudentId) {
        setSelectedStudentId(data.students[0].id);
      }
    } catch (err) {
      setError(err.message || "Error al consultar las calificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyGrades();
  }, [selectedRoomId]);

  const handleOpenGradingModal = (dayData, student) => {
    if (!dayData.writing_submission_id) return;
    setGradingSubmission({
      id: dayData.writing_submission_id,
      dayNumber: dayData.day_number,
      studentName: student.username,
      text: dayData.writing_preview || "",
      currentScore: dayData.writing_score ?? 15,
      currentFeedback: dayData.writing_feedback || ""
    });
    setModalScore(dayData.writing_score ?? 15);
    setModalFeedback(dayData.writing_feedback || "¡Buen trabajo en tu redacción espacial!");
    setModalAnnotatedText(dayData.annotated_text || dayData.writing_preview || "");
    setModalCorrectedText(dayData.corrected_text || "");
    setGradeSuccessMsg("");
    setAnnotatedStatusMsg("");
  };

  const handleModalMarkError = () => {
    const textarea = modalAnnotatedRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) {
      setAnnotatedStatusMsg("ℹ️ Selecciona primero una palabra o frase para marcarla como error.");
      return;
    }
    const currentVal = modalAnnotatedText;
    const selected = currentVal.substring(start, end);
    if (selected.includes("<mark") || selected.includes("</mark>")) {
      setAnnotatedStatusMsg("⚠️ La selección ya contiene etiquetas de error.");
      return;
    }
    const before = currentVal.substring(0, start);
    const after = currentVal.substring(end);
    const wrapped = `<mark class="err-mark">${selected}</mark>`;
    setModalAnnotatedText(before + wrapped + after);
    setAnnotatedStatusMsg(`🔴 Error marcado: "${selected}"`);
  };

  const handleModalResetAnnotated = () => {
    if (!gradingSubmission) return;
    setModalAnnotatedText(gradingSubmission.text || "");
    setAnnotatedStatusMsg("🔄 Marcas de error eliminadas. Se restauró el texto original.");
  };

  const handleModalCopyOriginal = () => {
    if (!gradingSubmission) return;
    const clean = stripHtmlMarks(gradingSubmission.text || "");
    setModalCorrectedText(clean);
    setAnnotatedStatusMsg("📋 Texto original copiado al editor de corrección.");
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    setSubmittingGrade(true);
    setGradeSuccessMsg("");
    try {
      const res = await fetch(`${API_BASE}/writing-submissions/${gradingSubmission.id}/mark_reviewed/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          reviewed: true,
          score: Math.max(0, Math.min(20, Number(modalScore))),
          feedback: modalFeedback.trim(),
          annotated_text: modalAnnotatedText.trim(),
          corrected_text: modalCorrectedText.trim()
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Error al registrar la calificación");
      }

      soundFx.playSuccess();
      setGradeSuccessMsg("✅ ¡Calificación, errores y versión corregida guardados con éxito!");

      // Update in-memory state so view updates instantly
      setStudents(prev =>
        prev.map(st => {
          if (st.username !== gradingSubmission.studentName) return st;
          const updatedDays = st.days.map(d => {
            if (d.day_number !== gradingSubmission.dayNumber) return d;
            const newWritingScore = Math.max(0, Math.min(20, Number(modalScore)));
            let newAvg = null;
            if (d.game_score !== null) {
              newAvg = Number(((d.game_score + newWritingScore) / 2).toFixed(1));
            } else {
              newAvg = newWritingScore;
            }
            return {
              ...d,
              writing_score: newWritingScore,
              writing_reviewed: true,
              writing_feedback: modalFeedback.trim(),
              annotated_text: modalAnnotatedText.trim(),
              corrected_text: modalCorrectedText.trim(),
              daily_average: newAvg
            };
          });
          return { ...st, days: updatedDays };
        })
      );

      setTimeout(() => {
        setGradingSubmission(null);
        setGradeSuccessMsg("");
      }, 1200);

    } catch (err) {
      soundFx.playError();
      setError(err.message);
    } finally {
      setSubmittingGrade(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.username.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.grade && s.grade.toLowerCase().includes(q)) ||
      (s.section && s.section.toLowerCase().includes(q))
    );
  });

  const selectedStudent = students.find(s => s.id === selectedStudentId) || filteredStudents[0];

  // Global calculations
  const totalStudents = students.length;
  const allGameAvgs = students.map(s => s.summary?.game_avg).filter(v => v !== null);
  const globalGameAvg = allGameAvgs.length > 0 ? (allGameAvgs.reduce((a, b) => a + b, 0) / allGameAvgs.length).toFixed(1) : "-";
  const allWritingAvgs = students.map(s => s.summary?.writing_avg).filter(v => v !== null);
  const globalWritingAvg = allWritingAvgs.length > 0 ? (allWritingAvgs.reduce((a, b) => a + b, 0) / allWritingAvgs.length).toFixed(1) : "-";

  const getScoreBadgeStyle = (score) => {
    if (score === null || score === undefined) {
      return { background: "rgba(255,255,255,0.08)", color: "#888", border: "1px solid rgba(255,255,255,0.15)" };
    }
    if (score >= 14) {
      return { background: "rgba(0, 255, 135, 0.18)", color: "#00ff87", border: "1px solid #00ff87" };
    }
    if (score >= 11) {
      return { background: "rgba(255, 209, 102, 0.18)", color: "#ffd166", border: "1px solid #ffd166" };
    }
    return { background: "rgba(255, 77, 77, 0.18)", color: "#ff4d4d", border: "1px solid #ff4d4d" };
  };

  return (
    <div className="teacher-daily-grades" style={{ marginTop: "15px" }}>
      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "22px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(20, 30, 48, 0.75), rgba(36, 59, 85, 0.75))",
          border: "1px solid rgba(46, 196, 182, 0.4)",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <span style={{ fontSize: "2.4rem" }}>👥</span>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#9be6df", textTransform: "uppercase", letterSpacing: "1px" }}>Total Alumnos</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#ffffff" }}>{totalStudents}</div>
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(20, 30, 48, 0.75), rgba(36, 59, 85, 0.75))",
          border: "1px solid rgba(0, 255, 135, 0.4)",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <span style={{ fontSize: "2.4rem" }}>🎮</span>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#00ff87", textTransform: "uppercase", letterSpacing: "1px" }}>Promedio Juegos (Nota 1)</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#00ff87" }}>
              {globalGameAvg} <span style={{ fontSize: "1rem", color: "#88ffb8" }}>/ 20</span>
            </div>
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(20, 30, 48, 0.75), rgba(36, 59, 85, 0.75))",
          border: "1px solid rgba(255, 159, 28, 0.4)",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <span style={{ fontSize: "2.4rem" }}>✍️</span>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#ffb84d", textTransform: "uppercase", letterSpacing: "1px" }}>Promedio Writing (Nota 2)</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#ffd166" }}>
              {globalWritingAvg} <span style={{ fontSize: "1rem", color: "#ffe299" }}>/ 20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div style={{
        background: "rgba(10, 20, 35, 0.6)",
        border: "1px solid rgba(184, 255, 249, 0.2)",
        borderRadius: "12px",
        padding: "14px 18px",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "14px",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: "0.9rem", color: "#9be6df", fontWeight: "bold" }}>
            🏛️ Filtrar por Sala:
          </label>
          <select
            value={selectedRoomId}
            onChange={(e) => { setSelectedRoomId(e.target.value); setSelectedStudentId(null); }}
            style={{
              background: "#0d1b2a",
              color: "#ffffff",
              border: "1px solid rgba(46, 196, 182, 0.5)",
              borderRadius: "8px",
              padding: "8px 14px",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            <option value="">Todas las Salas Registradas</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.code})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", minWidth: "260px" }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "#0d1b2a",
              color: "#ffffff",
              border: "1px solid rgba(184, 255, 249, 0.3)",
              borderRadius: "8px",
              padding: "8px 14px",
              fontSize: "0.9rem"
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9be6df" }}>
          <div className="loading-spinner" style={{ margin: "0 auto 16px" }}></div>
          <p>Cargando matriz de 2 notas por día...</p>
        </div>
      ) : error ? (
        <div style={{ background: "rgba(255, 77, 77, 0.15)", border: "1px solid #ff4d4d", borderRadius: "10px", padding: "16px", color: "#ff8080", textAlign: "center" }}>
          {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#888", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "8px" }}>🚀 No se encontraron alumnos en esta sala.</p>
          <p style={{ fontSize: "0.85rem" }}>Pídeles a tus alumnos que se unan ingresando el código de la sala.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", alignItems: "start" }}>
          {/* Left Column: Student List Selection */}
          <div style={{
            background: "rgba(13, 27, 42, 0.8)",
            border: "1px solid rgba(46, 196, 182, 0.3)",
            borderRadius: "14px",
            padding: "16px",
            maxHeight: "750px",
            overflowY: "auto"
          }}>
            <h4 style={{ margin: "0 0 12px", color: "#9be6df", fontSize: "0.95rem", display: "flex", justifyContent: "space-between" }}>
              <span>Estudiantes ({filteredStudents.length})</span>
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredStudents.map(st => {
                const isSelected = selectedStudent?.id === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => { soundFx.playClick(); setSelectedStudentId(st.id); }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: isSelected ? "linear-gradient(135deg, rgba(46, 196, 182, 0.25), rgba(0, 240, 255, 0.15))" : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? "1.5px solid #2ec4b6" : "1px solid rgba(255, 255, 255, 0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontWeight: "bold", color: isSelected ? "#00f0ff" : "#ffffff", fontSize: "0.95rem" }}>
                        🧑‍🚀 {st.username}
                      </span>
                      {st.summary?.daily_avg !== null && (
                        <span style={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "2px 6px",
                          borderRadius: "6px",
                          ...getScoreBadgeStyle(st.summary.daily_avg)
                        }}>
                          Prom: {st.summary.daily_avg}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9be6df" }}>
                      {st.grade ? `${st.grade}° ${st.section || ""}` : "Estudiante"} • {st.summary?.completed_days ?? 0}/14 días
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 14 Days Detail for Selected Student */}
          {selectedStudent && (
            <div style={{
              background: "rgba(13, 27, 42, 0.85)",
              border: "1px solid rgba(46, 196, 182, 0.35)",
              borderRadius: "14px",
              padding: "20px"
            }}>
              {/* Header Info of Selected Student */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(184, 255, 249, 0.15)", paddingBottom: "14px", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", color: "#ffffff", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    🚀 Calificaciones de {selectedStudent.username}
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "#9be6df" }}>
                    {selectedStudent.email || "Sin correo"} • {selectedStudent.grade ? `Grado: ${selectedStudent.grade} - Sec: ${selectedStudent.section}` : "Aula General"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", color: "#88ffb8" }}>PROM. JUEGOS</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#00ff87" }}>
                      {selectedStudent.summary?.game_avg !== null ? `${selectedStudent.summary.game_avg} / 20` : "Pendiente"}
                    </div>
                  </div>
                  <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.15)" }}></div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", color: "#ffe299" }}>PROM. WRITING</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#ffd166" }}>
                      {selectedStudent.summary?.writing_avg !== null ? `${selectedStudent.summary.writing_avg} / 20` : "Pendiente"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Cards Grid (1 to 14) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
                {selectedStudent.days?.map(d => {
                  return (
                    <div
                      key={d.day_number}
                      style={{
                        background: "rgba(20, 35, 55, 0.6)",
                        border: "1px solid rgba(184, 255, 249, 0.15)",
                        borderRadius: "12px",
                        padding: "14px 16px",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                      }}
                    >
                      {/* Top Day Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{
                          fontWeight: "900",
                          fontSize: "0.95rem",
                          color: "#ffffff",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          📅 DÍA {d.day_number}
                        </span>

                        {d.daily_average !== null ? (
                          <span style={{
                            fontSize: "0.82rem",
                            fontWeight: "900",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            ...getScoreBadgeStyle(d.daily_average)
                          }}>
                            Prom: {d.daily_average}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#777" }}>Sin evaluar</span>
                        )}
                      </div>

                      {/* Nota 1: Juegos del Día */}
                      <div style={{
                        background: "rgba(0, 0, 0, 0.25)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div>
                          <div style={{ fontSize: "0.75rem", color: "#00ff87", fontWeight: "bold" }}>
                            🎮 NOTA 1: Juegos
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#888" }}>
                            {d.game_completed ? "5 juegos completados" : "En progreso"}
                          </div>
                        </div>

                        {d.game_score !== null ? (
                          <span style={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            ...getScoreBadgeStyle(d.game_score)
                          }}>
                            {d.game_score} <span style={{ fontSize: "0.65rem" }}>/ 20</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#888", fontStyle: "italic" }}>
                            Pendiente
                          </span>
                        )}
                      </div>

                      {/* Nota 2: Writing del Día */}
                      <div style={{
                        background: "rgba(0, 0, 0, 0.25)",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div>
                          <div style={{ fontSize: "0.75rem", color: "#ffd166", fontWeight: "bold" }}>
                            ✍️ NOTA 2: Writing
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#888" }}>
                            {d.writing_reviewed ? "Calificado por docente" : d.writing_submitted ? "🟡 Esperando revisión" : "No transmitido"}
                          </div>
                        </div>

                        {d.writing_score !== null ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span style={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              ...getScoreBadgeStyle(d.writing_score)
                            }}>
                              {d.writing_score} <span style={{ fontSize: "0.65rem" }}>/ 20</span>
                            </span>
                            <button
                              onClick={() => handleOpenGradingModal(d, selectedStudent)}
                              title="Modificar calificación de Writing"
                              style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "#ffd166",
                                borderRadius: "6px",
                                padding: "3px 6px",
                                fontSize: "0.75rem",
                                cursor: "pointer"
                              }}
                            >
                              ✏️
                            </button>
                          </div>
                        ) : d.writing_submitted ? (
                          <button
                            onClick={() => handleOpenGradingModal(d, selectedStudent)}
                            style={{
                              background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
                              border: "none",
                              color: "#0d1b2a",
                              fontWeight: "bold",
                              borderRadius: "6px",
                              padding: "4px 10px",
                              fontSize: "0.75rem",
                              cursor: "pointer"
                            }}
                          >
                            📝 Calificar
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "#777", fontStyle: "italic" }}>
                            Sin envío
                          </span>
                        )}
                      </div>

                      {/* Feedback snippet if available */}
                      {d.writing_feedback && (
                        <div style={{
                          fontSize: "0.72rem",
                          color: "#9be6df",
                          background: "rgba(46, 196, 182, 0.1)",
                          borderLeft: "2px solid #2ec4b6",
                          padding: "4px 8px",
                          borderRadius: "0 4px 4px 0",
                          fontStyle: "italic"
                        }}>
                          "{d.writing_feedback}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Quick Grading of Writing */}
      {gradingSubmission && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: "#0d1b2a",
            border: "2px solid #ffd166",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "640px",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "24px 28px",
            boxShadow: "0 0 40px rgba(255, 209, 102, 0.35)",
            color: "#e6f7ff"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, color: "#ffd166", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                ✍️ Evaluación de Writing — Día {gradingSubmission.dayNumber}
              </h3>
              <button
                onClick={() => setGradingSubmission(null)}
                style={{ background: "transparent", border: "none", color: "#888", fontSize: "1.3rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "14px", fontSize: "0.88rem", color: "#9be6df" }}>
              Alumno: <strong style={{ color: "#ffffff", fontSize: "0.95rem" }}>{gradingSubmission.studentName}</strong>
            </div>

            {/* SECCIÓN 1: HERRAMIENTA PARA REMARCAR ERRORES */}
            <div style={{
              background: "rgba(239, 68, 68, 0.06)",
              border: "1.5px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "12px",
              padding: "12px 14px",
              marginBottom: "16px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "900", color: "#ff8080" }}>
                  🔴 REMARCAR ERRORES EN EL ESCRITO DEL ALUMNO:
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={handleModalMarkError}
                    style={{
                      background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      border: "none",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                    title="Selecciona texto en el cuadro inferior y haz clic para marcar error"
                  >
                    🔴 Marcar Selección
                  </button>
                  <button
                    type="button"
                    onClick={handleModalResetAnnotated}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#ddd",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      cursor: "pointer"
                    }}
                  >
                    🔄 Limpiar
                  </button>
                </div>
              </div>

              <textarea
                ref={modalAnnotatedRef}
                rows="3"
                value={modalAnnotatedText}
                onChange={(e) => setModalAnnotatedText(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(10, 18, 30, 0.9)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#ffffff",
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                  resize: "vertical"
                }}
                placeholder="Selecciona las palabras erróneas y haz clic en '🔴 Marcar Selección'..."
              />

              {/* LIVE PREVIEW BOX */}
              <div style={{
                marginTop: "8px",
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px dashed rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                padding: "8px 10px",
                fontSize: "0.84rem",
                color: "#f1f5f9",
                lineHeight: 1.5
              }}>
                <div style={{ fontSize: "0.7rem", color: "#9be6df", fontWeight: "bold", marginBottom: "4px" }}>
                  👀 Vista previa del alumno con errores remarcados:
                </div>
                <div>{renderAnnotatedText(modalAnnotatedText || "(Sin texto)")}</div>
              </div>
            </div>

            {/* SECCIÓN 2: VERSIÓN CORRECTA DEL TEXTO */}
            <div style={{
              background: "rgba(16, 185, 129, 0.06)",
              border: "1.5px solid rgba(16, 185, 129, 0.35)",
              borderRadius: "12px",
              padding: "12px 14px",
              marginBottom: "16px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "900", color: "#34d399" }}>
                  🟢 VERSIÓN CORRECTA SUGERIDA (MODELO PEDAGÓGICO):
                </span>
                <button
                  type="button"
                  onClick={handleModalCopyOriginal}
                  style={{
                    background: "rgba(16, 185, 129, 0.2)",
                    border: "1px solid #10b981",
                    color: "#34d399",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                  title="Copia el texto del alumno para corregirlo más rápido"
                >
                  📋 Copiar texto del alumno
                </button>
              </div>
              <textarea
                rows="3"
                value={modalCorrectedText}
                onChange={(e) => setModalCorrectedText(e.target.value)}
                placeholder="Escribe aquí el texto del alumno pero ya en su forma correcta en inglés..."
                style={{
                  width: "100%",
                  background: "rgba(6, 78, 59, 0.15)",
                  border: "1px solid #10b981",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#a7f3d0",
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                  resize: "vertical"
                }}
              />
            </div>

            {/* Grading Form */}
            <form onSubmit={handleSaveGrade}>
              {/* NOTA VIGESIMAL (0 A 20) */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#ffd166", marginBottom: "6px", fontWeight: "bold" }}>
                  ⭐ Calificación Vigesimal (Escala 0 a 20):
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={modalScore}
                    onChange={(e) => setModalScore(Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#ffd166", cursor: "pointer" }}
                  />
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={modalScore}
                    onChange={(e) => setModalScore(Math.max(0, Math.min(20, Number(e.target.value))))}
                    style={{
                      width: "60px",
                      padding: "8px",
                      background: "#14213d",
                      border: "1px solid #ffd166",
                      borderRadius: "8px",
                      color: "#ffffff",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  />
                  <span style={{ fontSize: "0.9rem", color: "#888" }}>/ 20</span>
                </div>
              </div>

              {/* OBSERVACIONES */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#9be6df", marginBottom: "6px", fontWeight: "bold" }}>
                  💬 Retroalimentación Pedagógica (Feedback):
                </label>
                <textarea
                  rows="2"
                  value={modalFeedback}
                  onChange={(e) => setModalFeedback(e.target.value)}
                  placeholder="Escribe comentarios formativos sobre gramática, vocabulario y ortografía..."
                  style={{
                    width: "100%",
                    background: "#14213d",
                    border: "1px solid rgba(184, 255, 249, 0.3)",
                    borderRadius: "8px",
                    padding: "10px",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    resize: "vertical"
                  }}
                />
              </div>

              {annotatedStatusMsg && (
                <div style={{ color: "#ffd166", fontSize: "0.8rem", marginBottom: "10px", fontWeight: "bold" }}>
                  {annotatedStatusMsg}
                </div>
              )}

              {gradeSuccessMsg && (
                <div style={{ color: "#00ff87", fontSize: "0.9rem", fontWeight: "bold", textAlign: "center", marginBottom: "14px" }}>
                  {gradeSuccessMsg}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingGrade}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
                    border: "none",
                    color: "#0d1b2a",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 0 15px rgba(255, 209, 102, 0.3)"
                  }}
                >
                  {submittingGrade ? "Registrando..." : "💾 Guardar Calificación (0-20)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

TeacherDailyGrades.propTypes = {
  token: PropTypes.string,
  rooms: PropTypes.array
};
