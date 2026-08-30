import { useState } from "react";
import { API_BASE } from "../../config";

export default function PrePostTestModal({ testType, user, token, onClose, onCompleted }) {
  const isPre = testType === "pre";
  const title = isPre ? "📝 Evaluación Inicial (Pre-Test)" : "🎓 Evaluación Final (Post-Test)";

  const [answers, setAnswers] = useState({});
  const [writingText, setWritingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      text: "1. Completa con la forma correcta del verbo To Be: 'She ___ 15 years old and she ___ a new student.'",
      options: ["is / is", "am / are", "are / is", "is / am"],
      correct: "is / is"
    },
    {
      id: 2,
      text: "2. Selecciona la oración gramaticalmente CORRECTA:",
      options: [
        "He can plays football very well.",
        "He can play football very well.",
        "He can playing football very well.",
        "He cans play football very well."
      ],
      correct: "He can play football very well."
    },
    {
      id: 3,
      text: "3. ¿Cuál es la opción adecuada? 'There ___ two new computers in the training room.'",
      options: ["is", "are", "am", "be"],
      correct: "are"
    },
    {
      id: 4,
      text: "4. Completa la rutina diaria: 'I always ___ my English report before mission training.'",
      options: ["writes", "write", "writing", "wrote"],
      correct: "write"
    }
  ];

  const handleOptionChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correctCount += 1;
    });

    const scorePct = Math.round((correctCount / questions.length) * 20); // 0-20 scale

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/pre-post-tests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          student: user.id,
          test_type: testType,
          score: scorePct,
          raw_data: {
            answers,
            writingText,
            correctCount,
            totalQuestions: questions.length
          }
        })
      });

      if (!res.ok) {
        throw new Error("Error al guardar la evaluación.");
      }

      setCompleted(true);
      if (onCompleted) onCompleted(scorePct);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(3, 15, 23, 0.88)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: 20
    }}>
      <div className="modal-card animate-scaleUp" style={{
        background: "linear-gradient(145deg, #0d2833, #051820)",
        border: "2px solid #2ec4b6",
        borderRadius: 24,
        padding: 30,
        maxWidth: 600,
        width: "100%",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 50px rgba(46, 196, 182, 0.3)",
        position: "relative",
        color: "#e6f7ff"
      }}>
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            padding: 0,
            margin: 0,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(46, 196, 182, 0.4)",
            color: "#9be6df",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
        >
          ✖
        </button>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#2ec4b6", margin: "5px 0 2px 0", fontSize: "1.6rem" }}>{title}</h2>
          <p style={{ color: "#9be6df", fontSize: "0.88rem" }}>
            Evaluación diagnóstica para la investigación de producción escrita de inglés.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {completed ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <span style={{ fontSize: "3.5rem" }}>🎉</span>
            <h3 style={{ color: "#ffd166", margin: "15px 0 10px 0" }}>¡Evaluación Completada!</h3>
            <p style={{ color: "#9be6df", marginBottom: 25 }}>
              Tus respuestas han sido enviadas al sistema del profesor para el registro de la investigación.
            </p>
            <button 
              onClick={onClose}
              style={{
                padding: "12px 28px",
                background: "linear-gradient(135deg, #2ec4b6, #26a399)",
                border: "none",
                color: "#002427",
                fontWeight: "bold",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ overflowY: "auto", paddingRight: 5 }} className="custom-scroll">
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 20 }}>
              {questions.map((q) => (
                <div key={q.id} style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(184, 255, 249, 0.15)",
                  borderRadius: 12,
                  padding: 16
                }}>
                  <p style={{ color: "#b8fff9", fontWeight: "600", marginBottom: 12, fontSize: "0.95rem" }}>
                    {q.text}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {q.options.map((opt, i) => (
                      <label key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: answers[q.id] === opt ? "rgba(46, 196, 182, 0.25)" : "rgba(0,0,0,0.3)",
                        border: answers[q.id] === opt ? "1px solid #2ec4b6" : "1px solid rgba(255,255,255,0.08)",
                        padding: "10px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: "0.88rem",
                        color: answers[q.id] === opt ? "#ffd166" : "#e6f7ff"
                      }}>
                        <input 
                          type="radio" 
                          name={`q_${q.id}`} 
                          value={opt} 
                          checked={answers[q.id] === opt}
                          onChange={() => handleOptionChange(q.id, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* WRITING SECTION */}
              <div style={{
                background: "rgba(255, 209, 102, 0.05)",
                border: "1px solid rgba(255, 209, 102, 0.25)",
                borderRadius: 12,
                padding: 16
              }}>
                <label style={{ display: "block", color: "#ffd166", fontWeight: "bold", marginBottom: 8, fontSize: "0.95rem" }}>
                  5. Sección de Producción Escrita libre:
                </label>
                <p style={{ color: "#9be6df", fontSize: "0.85rem", marginBottom: 10 }}>
                  Escribe una breve presentación personal en inglés (3 a 5 oraciones). Incluye tu nombre, edad, origen y habilidades (usando *can*).
                </p>
                <textarea 
                  rows={4}
                  value={writingText}
                  onChange={(e) => setWritingText(e.target.value)}
                  placeholder="Hello, my name is... I am ... years old..."
                  style={{
                    width: "100%",
                    padding: 12,
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(184, 255, 249, 0.2)",
                    borderRadius: 8,
                    color: "#e6f7ff",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button 
                type="button" 
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "transparent",
                  border: "1px solid rgba(184, 255, 249, 0.3)",
                  color: "#9be6df",
                  borderRadius: 10,
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading || Object.keys(answers).length < questions.length}
                style={{
                  flex: 2,
                  padding: "12px",
                  background: Object.keys(answers).length < questions.length ? "#3a505b" : "linear-gradient(135deg, #2ec4b6, #26a399)",
                  border: "none",
                  color: "#002427",
                  fontWeight: "bold",
                  borderRadius: 10,
                  cursor: Object.keys(answers).length < questions.length ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Enviando..." : "Enviar Evaluacion 🚀"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
