import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Helper to shuffle an array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function SentenceLaunchGame({ activity, onComplete, onClose }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [targetSentence, setTargetSentence] = useState("");
  const [targetWords, setTargetWords] = useState([]);
  const [scrambledPool, setScrambledPool] = useState([]); // Array of { id, word, selected: bool }
  const [selectedWords, setSelectedWords] = useState([]); // Array of { poolId, word }
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const questions = activity.questions || [];

  // Load question data
  useEffect(() => {
    if (questions.length === 0 || !questions[currentQIndex]) return;

    const question = questions[currentQIndex];
    // Find correct option
    const correctOpt = question.options?.find(o => o.is_correct);
    if (!correctOpt) return;

    const sentence = correctOpt.text;
    setTargetSentence(sentence);

    // Split sentence into words, keeping punctuation intact
    const words = sentence.split(" ");
    setTargetWords(words);

    // Create pool of words and scramble them
    const pool = words.map((w, idx) => ({
      id: idx,
      word: w,
      selected: false
    }));
    setScrambledPool(shuffle(pool));
    setSelectedWords([]);
    setIsError(false);
    setIsSuccess(false);
  }, [currentQIndex, questions]);

  const handleWordClick = (poolItem) => {
    if (poolItem.selected) return;

    // Add to selected list
    setSelectedWords([...selectedWords, { poolId: poolItem.id, word: poolItem.word }]);
    
    // Mark as selected in pool
    setScrambledPool(prevPool =>
      prevPool.map(item =>
        item.id === poolItem.id ? { ...item, selected: true } : item
      )
    );
  };

  const handleSelectedWordClick = (selectedItem, index) => {
    // Remove from selected list
    setSelectedWords(prevSelected => prevSelected.filter((_, idx) => idx !== index));

    // Mark as unselected in pool
    setScrambledPool(prevPool =>
      prevPool.map(item =>
        item.id === selectedItem.poolId ? { ...item, selected: false } : item
      )
    );
  };

  const handleReset = () => {
    setSelectedWords([]);
    setScrambledPool(prevPool => prevPool.map(item => ({ ...item, selected: false })));
    setIsError(false);
  };

  const handleLaunch = () => {
    const assembled = selectedWords.map(s => s.word).join(" ");
    
    if (assembled === targetSentence) {
      setIsSuccess(true);
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
        } else {
          onComplete(10, 10); // 10 XP, 10 Coins
        }
      }, 1500);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        handleReset();
      }, 1500);
    }
  };

  const currentQuestion = questions[currentQIndex];

  return (
    <div className="auth-card panel-large animate-fadeIn" style={{ maxWidth: 700 }}>
      <div className="panel-title-row" style={{ marginBottom: 20 }}>
        <div>
          <span className="dashboard-kicker">Actividad 2: Lanzamiento de Oraciones (Gramática)</span>
          <h2>{activity.title}</h2>
        </div>
        <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 12px" }}>
          Cerrar X
        </button>
      </div>

      {currentQuestion ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.9rem", marginBottom: 15 }}>
            <span>Cohete {currentQIndex + 1} de {questions.length}</span>
            <span>Estabilidad de órbita: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 10, fontSize: "1.1rem" }}>
            Instrucciones: Ordena las palabras para formar la oración correcta y lanzar el cohete.
          </h3>
          <p style={{ color: "rgba(230, 247, 255, 0.7)", fontSize: "0.9rem", marginBottom: 25 }}>
            {currentQuestion.text}
          </p>

          {/* Spaceship launch visual zone */}
          <div 
            className="launch-pad" 
            style={{ 
              background: "rgba(0, 0, 0, 0.4)", 
              border: "1px solid rgba(184, 255, 249, 0.15)", 
              borderRadius: 15, 
              padding: 25, 
              minHeight: 180, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Rocket Icon with animation */}
            <div 
              style={{ 
                fontSize: "3.5rem", 
                transform: isSuccess ? "translateY(-150px) scale(0.8)" : "none",
                transition: isSuccess ? "transform 1.2s cubic-bezier(.68,-0.55,.27,1.55)" : "none",
                marginBottom: 15
              }}
            >
              🚀
            </div>

            {/* Assembled Sentence Box */}
            <div 
              className={`assembled-sentence-container ${isError ? "animate-shake" : ""}`}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: isSuccess ? "2px solid #2ec4b6" : isError ? "2px solid #ff6b6b" : "1px dashed rgba(184, 255, 249, 0.4)",
                borderRadius: 10,
                width: "100%",
                boxSizing: "border-box",
                minHeight: 60,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: 10
              }}
            >
              {selectedWords.length === 0 ? (
                <span style={{ color: "rgba(230, 247, 255, 0.4)", fontStyle: "italic", fontSize: "0.95rem" }}>
                  Haz clic en las palabras de abajo para construir la oración...
                </span>
              ) : (
                selectedWords.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectedWordClick(item, idx)}
                    style={{
                      background: "linear-gradient(135deg, #b8fff9, #9be6df)",
                      color: "#051820",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      margin: 0
                    }}
                  >
                    {item.word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Word Pool Zone */}
          <div style={{ marginTop: 25, textAlign: "center" }}>
            <div 
              style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                justifyContent: "center", 
                gap: 10,
                minHeight: 60 
              }}
            >
              {scrambledPool.map((poolItem) => (
                <button
                  key={poolItem.id}
                  disabled={poolItem.selected}
                  onClick={() => handleWordClick(poolItem)}
                  style={{
                    background: poolItem.selected ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 8,
                    color: poolItem.selected ? "rgba(255,255,255,0.15)" : "#e6f7ff",
                    padding: "10px 16px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: poolItem.selected ? "default" : "pointer",
                    margin: 0,
                    transition: "all 0.2s ease"
                  }}
                  className={poolItem.selected ? "" : "word-pool-btn"}
                >
                  {poolItem.word}
                </button>
              ))}
            </div>
          </div>

          {/* Game controls */}
          <div style={{ display: "flex", gap: 15, marginTop: 30 }}>
            <button 
              className="btn-cancel" 
              style={{ flex: 1 }} 
              onClick={handleReset}
              disabled={selectedWords.length === 0 || isSuccess}
            >
              🔄 Reiniciar
            </button>
            <button 
              className="btn-create" 
              style={{ flex: 2, background: "linear-gradient(135deg, #ffd166, #ffb84d)", color: "#1a1a00" }} 
              onClick={handleLaunch}
              disabled={selectedWords.length !== targetWords.length || isSuccess}
            >
              🚀 ¡Lanzar Cohete!
            </button>
          </div>

          {isError && (
            <div style={{ marginTop: 15, color: "#ff6b6b", fontWeight: "bold", textAlign: "center" }}>
              💥 ¡Falla en el lanzamiento! La secuencia de palabras es incorrecta.
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 15, color: "#2ec4b6", fontWeight: "bold", textAlign: "center" }}>
              ✨ ¡Lanzamiento exitoso! Trayectoria correcta establecida.
            </div>
          )}
        </div>
      ) : (
        <p>Cargando preguntas de Sentence Launch...</p>
      )}
    </div>
  );
}

SentenceLaunchGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    questions: PropTypes.array
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
