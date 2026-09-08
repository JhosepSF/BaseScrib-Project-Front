import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import "../../styles/Panel.css";
import { soundFx } from "../utils/soundEffects";

// Helper to shuffle an array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Curricular Shield Diagnostics for all 14 Days
const DEFAULT_REPAIR_QUESTIONS = {
  1: [
    { id: "r1-1", text: "Diagnóstico: 'I is a recruit on Base ONE.'", options: [{ id: "o1-1", text: "I am a recruit on Base ONE.", is_correct: true }, { id: "o1-2", text: "I be a recruit on Base ONE.", is_correct: false }, { id: "o1-3", text: "I are a recruit on Base ONE.", is_correct: false }] },
    { id: "r1-2", text: "Diagnóstico: 'We is ready for mission launch.'", options: [{ id: "o1-4", text: "We are ready for mission launch.", is_correct: true }, { id: "o1-5", text: "We am ready for mission launch.", is_correct: false }, { id: "o1-6", text: "We be ready for mission launch.", is_correct: false }] }
  ],
  2: [
    { id: "r2-1", text: "Diagnóstico: 'There is three sensors in the cabin.'", options: [{ id: "o2-1", text: "There are three sensors in the cabin.", is_correct: true }, { id: "o2-2", text: "There has three sensors in the cabin.", is_correct: false }, { id: "o2-3", text: "There be three sensors in the cabin.", is_correct: false }] },
    { id: "r2-2", text: "Diagnóstico: 'This oxygen tanks is full.'", options: [{ id: "o2-4", text: "These oxygen tanks are full.", is_correct: true }, { id: "o2-5", text: "This oxygen tanks are full.", is_correct: false }, { id: "o2-6", text: "These oxygen tanks is full.", is_correct: false }] }
  ],
  3: [
    { id: "r3-1", text: "Diagnóstico: 'He clean the shield panels every morning.'", options: [{ id: "o3-1", text: "He cleans the shield panels every morning.", is_correct: true }, { id: "o3-2", text: "He cleaning the shield panels every morning.", is_correct: false }, { id: "o3-3", text: "He clean the shield panels every morning.", is_correct: false }] },
    { id: "r3-2", text: "Diagnóstico: 'The crew do not sleeps during patrol.'", options: [{ id: "o3-4", text: "The crew does not sleep during patrol.", is_correct: true }, { id: "o3-5", text: "The crew do not sleeps during patrol.", is_correct: false }, { id: "o3-6", text: "The crew not sleep during patrol.", is_correct: false }] }
  ],
  4: [
    { id: "r4-1", text: "Diagnóstico: 'Sparky is repair the engine coil right now.'", options: [{ id: "o4-1", text: "Sparky is repairing the engine coil right now.", is_correct: true }, { id: "o4-2", text: "Sparky are repairing the engine coil right now.", is_correct: false }, { id: "o4-3", text: "Sparky repair the engine coil right now.", is_correct: false }] },
    { id: "r4-2", text: "Diagnóstico: 'They is calibrating the star radar.'", options: [{ id: "o4-4", text: "They are calibrating the star radar.", is_correct: true }, { id: "o4-5", text: "They was calibrating the star radar.", is_correct: false }, { id: "o4-6", text: "They is calibrate the star radar.", is_correct: false }] }
  ],
  5: [
    { id: "r5-1", text: "Diagnóstico: 'Cadets can to enter the reactor without authorization.'", options: [{ id: "o5-1", text: "Cadets cannot enter the reactor without authorization.", is_correct: true }, { id: "o5-2", text: "Cadets must to enter the reactor without authorization.", is_correct: false }, { id: "o5-3", text: "Cadets can to enter the reactor.", is_correct: false }] },
    { id: "r5-2", text: "Diagnóstico: 'All pilots must wearing space helmets.'", options: [{ id: "o5-4", text: "All pilots must wear space helmets.", is_correct: true }, { id: "o5-5", text: "All pilots must to wear space helmets.", is_correct: false }, { id: "o5-6", text: "All pilots must wearing helmets.", is_correct: false }] }
  ],
  6: [
    { id: "r6-1", text: "Diagnóstico: 'Yesterday the squad discover an asteroid cluster.'", options: [{ id: "o6-1", text: "Yesterday the squad discovered an asteroid cluster.", is_correct: true }, { id: "o6-2", text: "Yesterday the squad discoveried an asteroid cluster.", is_correct: false }, { id: "o6-3", text: "Yesterday the squad was discover an asteroid cluster.", is_correct: false }] },
    { id: "r6-2", text: "Diagnóstico: 'The captain landed not on the moon.'", options: [{ id: "o6-4", text: "The captain did not land on the moon.", is_correct: true }, { id: "o6-5", text: "The captain landed not on the moon.", is_correct: false }, { id: "o6-6", text: "The captain did not landed on the moon.", is_correct: false }] }
  ],
  7: [
    { id: "r7-1", text: "Diagnóstico: 'We seen a strange alien beacon in sector 4.'", options: [{ id: "o7-1", text: "We saw a strange alien beacon in sector 4.", is_correct: true }, { id: "o7-2", text: "We seed a strange alien beacon in sector 4.", is_correct: false }, { id: "o7-3", text: "We seen a strange beacon.", is_correct: false }] },
    { id: "r7-2", text: "Diagnóstico: 'Dani sented an emergency dispatch to Base ONE.'", options: [{ id: "o7-4", text: "Dani sent an emergency dispatch to Base ONE.", is_correct: true }, { id: "o7-5", text: "Dani send an emergency dispatch to Base ONE.", is_correct: false }, { id: "o7-6", text: "Dani was sented an emergency dispatch.", is_correct: false }] }
  ],
  8: [
    { id: "r8-1", text: "Diagnóstico: 'Scribtonia is more large than our home planet.'", options: [{ id: "o8-1", text: "Scribtonia is larger than our home planet.", is_correct: true }, { id: "o8-2", text: "Scribtonia is more large than our home planet.", is_correct: false }, { id: "o8-3", text: "Scribtonia is largest than our home planet.", is_correct: false }] },
    { id: "r8-2", text: "Diagnóstico: 'The ion thruster is more fast than the chemical rocket.'", options: [{ id: "o8-4", text: "The ion thruster is faster than the chemical rocket.", is_correct: true }, { id: "o8-5", text: "The ion thruster is fast than the chemical rocket.", is_correct: false }, { id: "o8-6", text: "The ion thruster is more fast.", is_correct: false }] }
  ],
  9: [
    { id: "r9-1", text: "Diagnóstico: 'This is the most bright star in the galaxy.'", options: [{ id: "o9-1", text: "This is the brightest star in the galaxy.", is_correct: true }, { id: "o9-2", text: "This is the most bright star in the galaxy.", is_correct: false }, { id: "o9-3", text: "This is the brighter star in the galaxy.", is_correct: false }] },
    { id: "r9-2", text: "Diagnóstico: 'Base ONE is the most powerful base in the quadrant.'", options: [{ id: "o9-4", text: "Base ONE is the most powerful base in the quadrant.", is_correct: true }, { id: "o9-5", text: "Base ONE is the powerfullest base in the quadrant.", is_correct: false }, { id: "o9-6", text: "Base ONE is most powerful base.", is_correct: false }] }
  ],
  10: [
    { id: "r10-1", text: "Diagnóstico: 'Tomorrow we will to navigate through the nebula.'", options: [{ id: "o10-1", text: "Tomorrow we will navigate through the nebula.", is_correct: true }, { id: "o10-2", text: "Tomorrow we will navigating through the nebula.", is_correct: false }, { id: "o10-3", text: "Tomorrow we will to navigate.", is_correct: false }] },
    { id: "r10-2", text: "Diagnóstico: 'The commander is going dock the pod at 14:00.'", options: [{ id: "o10-4", text: "The commander is going to dock the pod at 14:00.", is_correct: true }, { id: "o10-5", text: "The commander is going dock the pod at 14:00.", is_correct: false }, { id: "o10-6", text: "The commander going to dock the pod.", is_correct: false }] }
  ],
  11: [
    { id: "r11-1", text: "Diagnóstico: 'If the shield drops, the hull breaches.'", options: [{ id: "o11-1", text: "If the shield drops, the hull will breach.", is_correct: true }, { id: "o11-2", text: "If the shield will drop, the hull breaches.", is_correct: false }, { id: "o11-3", text: "If shield drop, hull will breach.", is_correct: false }] },
    { id: "r11-2", text: "Diagnóstico: 'We will survive if we follows the protocol.'", options: [{ id: "o11-4", text: "We will survive if we follow the protocol.", is_correct: true }, { id: "o11-5", text: "We will survive if we will follow the protocol.", is_correct: false }, { id: "o11-6", text: "We survive if we will follow protocol.", is_correct: false }] }
  ],
  12: [
    { id: "r12-1", text: "Diagnóstico: 'I have visit three alien orbital stations.'", options: [{ id: "o12-1", text: "I have visited three alien orbital stations.", is_correct: true }, { id: "o12-2", text: "I has visited three alien orbital stations.", is_correct: false }, { id: "o12-3", text: "I have visiting three orbital stations.", is_correct: false }] },
    { id: "r12-2", text: "Diagnóstico: 'The science officer has already completed the scans.'", options: [{ id: "o12-4", text: "The science officer has already completed the scans.", is_correct: true }, { id: "o12-5", text: "The science officer have already completed the scans.", is_correct: false }, { id: "o12-6", text: "The science officer has already complete scans.", is_correct: false }] }
  ],
  13: [
    { id: "r13-1", text: "Diagnóstico: 'The distress beacon was detect by our radar array.'", options: [{ id: "o13-1", text: "The distress beacon was detected by our radar array.", is_correct: true }, { id: "o13-2", text: "The distress beacon was detecting by our radar array.", is_correct: false }, { id: "o13-3", text: "The distress beacon were detected by radar.", is_correct: false }] },
    { id: "r13-2", text: "Diagnóstico: 'Cosmic samples must be store in containment pods.'", options: [{ id: "o13-4", text: "Cosmic samples must be stored in containment pods.", is_correct: true }, { id: "o13-5", text: "Cosmic samples must be store in containment pods.", is_correct: false }, { id: "o13-6", text: "Cosmic samples must being stored in pods.", is_correct: false }] }
  ],
  14: [
    { id: "r14-1", text: "Diagnóstico: 'We has mastered all communication protocols on Base ONE.'", options: [{ id: "o14-1", text: "We have mastered all communication protocols on Base ONE.", is_correct: true }, { id: "o14-2", text: "We has mastered all communication protocols on Base ONE.", is_correct: false }, { id: "o14-3", text: "We having mastered all protocols.", is_correct: false }] },
    { id: "r14-2", text: "Diagnóstico: 'The expedition team are ready for deep space exploration.'", options: [{ id: "o14-4", text: "The expedition team is ready for deep space exploration.", is_correct: true }, { id: "o14-5", text: "The expedition team are ready for deep space exploration.", is_correct: false }, { id: "o14-6", text: "The expedition team be ready.", is_correct: false }] }
  ]
};

export function ShipRepairGame({ activity, onComplete, onClose, hideHeader = false }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [failedUserText, setFailedUserText] = useState("");
  const [mistakes, setMistakes] = useState(0);

  // Word-Pill Assembly State
  const [availableWords, setAvailableWords] = useState([]);
  const [assembledWords, setAssembledWords] = useState([]);
  const [targetSentence, setTargetSentence] = useState("");

  // Shuffled Multiple Choice Fallback Options
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const dayNum = activity?.dayNumber || activity?.day_num || 1;
  const questions = (activity?.questions && activity.questions.length > 0)
    ? activity.questions
    : (DEFAULT_REPAIR_QUESTIONS[dayNum] || DEFAULT_REPAIR_QUESTIONS[1]);
  const currentQuestion = questions[currentQIndex];

  // Helper to extract scrambled words from question text or target correct option
  useEffect(() => {
    setIsError(false);
    setIsSuccess(false);
    setShowSolution(false);
    setSelectedOptionId(null);
    setAssembledWords([]);
    setFailedUserText("");

    if (!currentQuestion) return;

    // Shuffle options so correct answer is NEVER locked to index 0 / left side!
    if (currentQuestion.options && currentQuestion.options.length > 0) {
      setShuffledOptions(shuffle(currentQuestion.options));
    } else {
      setShuffledOptions([]);
    }

    // Find correct target sentence
    const correctOpt = currentQuestion.options?.find(o => o.is_correct) || currentQuestion.options?.[0];
    const targetText = correctOpt ? correctOpt.text : currentQuestion.text;
    setTargetSentence(targetText);

    // Extract scrambled words if prompt contains "Arrange: ..." or from target sentence
    let wordsToScramble = [];
    const arrangeMatch = currentQuestion.text?.match(/Arrange:\s*([^\n\r]+)/i);
    if (arrangeMatch) {
      wordsToScramble = arrangeMatch[1].split("/").map(w => w.trim()).filter(Boolean);
    } else if (targetText) {
      wordsToScramble = targetText.split(" ").map(w => w.trim()).filter(Boolean);
    }

    if (wordsToScramble.length > 1) {
      // Create word pills with unique IDs for bank
      const pills = wordsToScramble.map((word, idx) => ({ id: `${idx}-${word}`, word }));
      setAvailableWords(shuffle(pills));
    } else {
      setAvailableWords([]);
    }
  }, [currentQIndex, activity, currentQuestion]);

  // Click word pill in bank to add to sentence
  const handleAddWord = (pill) => {
    if (isSuccess || showSolution) return;
    setAvailableWords(prev => prev.filter(p => p.id !== pill.id));
    setAssembledWords(prev => [...prev, pill]);
    setIsError(false);
  };

  // Click word pill in assembled area to return to bank
  const handleRemoveWord = (pill) => {
    if (isSuccess || showSolution) return;
    setAssembledWords(prev => prev.filter(p => p.id !== pill.id));
    setAvailableWords(prev => [...prev, pill]);
    setIsError(false);
  };

  // Reset assembled sentence
  const handleResetWords = () => {
    if (isSuccess || showSolution) return;
    const all = [...availableWords, ...assembledWords];
    setAvailableWords(shuffle(all));
    setAssembledWords([]);
    setIsError(false);
  };

  const handleOptionSelect = (optionId) => {
    if (isSuccess || showSolution) return;
    setSelectedOptionId(optionId);
    setIsError(false);
  };

  const handleVerify = () => {
    if (!currentQuestion || showSolution || isSuccess) return;

    let isCorrectAnswer = false;
    const userAttemptStr = (availableWords.length > 0 || assembledWords.length > 0)
      ? assembledWords.map(p => p.word).join(" ")
      : shuffledOptions.find(o => o.id === selectedOptionId)?.text || "";

    if (availableWords.length > 0 || assembledWords.length > 0) {
      // Verify word pill assembly
      const builtStr = assembledWords.map(p => p.word).join(" ").toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      const targetStr = targetSentence.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      
      if (builtStr === targetStr) {
        isCorrectAnswer = true;
      }
    } else if (selectedOptionId) {
      // Verify multiple choice option
      const selectedOption = currentQuestion.options?.find(o => o.id === selectedOptionId);
      if (selectedOption?.is_correct) {
        isCorrectAnswer = true;
      }
    }

    if (isCorrectAnswer) {
      soundFx.playLaser();
      soundFx.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
        } else {
          soundFx.playCoin();
          soundFx.playStreakBonus();
          onComplete(15, 15, mistakes);
        }
      }, 1500);
    } else {
      setMistakes((prev) => prev + 1);
      soundFx.playError();
      setIsError(true);
      setFailedUserText(userAttemptStr);
      setShowSolution(true);
    }
  };

  const handleNextAfterError = () => {
    setShowSolution(false);
    setIsError(false);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      soundFx.playCoin();
      soundFx.playStreakBonus();
      onComplete(15, 15, mistakes);
    }
  };

  // Extracts incorrect sentence from the question text (e.g. Find the error in: '...')
  const getIncorrectSentence = (text = "") => {
    const match = text.match(/'([^']+)'/);
    return match ? match[1] : text;
  };

  const isSentenceMode = availableWords.length > 0 || assembledWords.length > 0;

  return (
    <div className="glass-console auth-card panel-large animate-fadeIn" style={{ maxWidth: 720, width: "100%", padding: "16px 20px", position: "relative", margin: "auto" }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 8 }}>
          <div style={{ textAlign: "left" }}>
            <span className="dashboard-kicker" style={{ color: "#ff6b6b", textTransform: "uppercase", fontSize: "0.78rem", fontWeight: "bold" }}>
              Etapa 2: Vocabulario y Construcción de Oraciones
            </span>
            <h2 style={{ margin: "3px 0 0 0", color: "#b8fff9", fontSize: "1.35rem" }}>{activity?.title || "Reparación de Módulos"}</h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "6px 14px" }}>
            Cerrar X
          </button>
        </div>
      )}

      {currentQuestion ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.82rem", marginBottom: 8 }}>
            <span>Sección de Escudos: {currentQIndex + 1} de {questions.length}</span>
            <span>Estabilidad de Escudo: {Math.round(((currentQIndex) / questions.length) * 100)}%</span>
          </div>

          <h3 style={{ color: "#ffd166", marginBottom: 10, fontSize: "0.95rem", textAlign: "left", lineHeight: "1.4" }}>
            ⚡ Instructions / Instrucciones: {isSentenceMode ? "Selecciona y ordena las palabras clave para construir la oración gramatical correcta." : "Selecciona el nodo con el diagnóstico de corrección gramatical adecuado."}
          </h3>

          {/* Shield Status Deck */}
          <div 
            className="repair-deck" 
            style={{ 
              background: showSolution 
                ? "rgba(239, 68, 68, 0.08)" 
                : isSuccess 
                  ? "rgba(46, 196, 182, 0.08)" 
                  : "rgba(255, 107, 107, 0.04)", 
              border: showSolution 
                ? "2px solid #ef4444" 
                : isSuccess 
                  ? "2px solid #2ec4b6" 
                  : "2px solid rgba(255, 107, 107, 0.3)", 
              borderRadius: 14, 
              padding: "12px 16px", 
              minHeight: 100, 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", top: 6, right: 10, color: showSolution ? "#ef4444" : isSuccess ? "#2ec4b6" : "#ff6b6b", fontWeight: "bold", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              {showSolution ? "💥 ANOMALÍA REGISTRADA (-0.75 PTS)" : isSuccess ? "✓ SHIELD STABLE" : "⚠️ SHIELD ANOMALY DETECTED"}
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
              <img 
                src={ReclutaPrincipal} 
                alt="Operador de Escudo" 
                className="floating-crewmate"
                style={{ 
                  width: "85px", 
                  height: "85px", 
                  filter: isSuccess 
                    ? "hue-rotate(85deg) saturate(1.6) drop-shadow(0 0 10px #2ec4b6)" 
                    : showSolution 
                      ? "hue-rotate(130deg) saturate(1.5) drop-shadow(0 0 10px #ff6b6b)" 
                      : "drop-shadow(0 0 8px rgba(0, 245, 255, 0.4))",
                  objectFit: "contain",
                  transition: "all 0.3s ease"
                }}
              />
            </div>

            <div style={{ fontSize: "1.1rem", color: isSuccess ? "#2ec4b6" : showSolution ? "#ff8787" : "#ff8787", fontWeight: "bold", letterSpacing: 0.5 }}>
              "{getIncorrectSentence(currentQuestion.text)}"
            </div>
          </div>

          {/* GAMEPLAY MODE WHEN NOT SHOWING SOLUTION */}
          {!showSolution ? (
            <>
              {/* WORD ASSEMBLY GAME MODE */}
              {isSentenceMode ? (
                <div style={{ marginTop: 14, textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <h4 style={{ color: "#9be6df", margin: 0, fontSize: "0.88rem", fontWeight: "bold" }}>
                      🧩 Construye la Oración Correcta:
                    </h4>
                    {assembledWords.length > 0 && (
                      <button 
                        onClick={handleResetWords}
                        style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#ffd166", padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", cursor: "pointer" }}
                      >
                        🔄 Reiniciar
                      </button>
                    )}
                  </div>

                  {/* Assembled Sentence Dropzone Box */}
                  <div 
                    style={{
                      minHeight: "50px",
                      background: "rgba(0, 0, 0, 0.45)",
                      border: isError ? "2px solid #ff6b6b" : isSuccess ? "2px solid #2ec4b6" : "2px dashed #2ec4b6",
                      borderRadius: 12,
                      padding: "8px 12px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      alignItems: "center",
                      boxShadow: "inset 0 0 15px rgba(0,0,0,0.5)"
                    }}
                  >
                    {assembledWords.length === 0 ? (
                      <span style={{ color: "rgba(184, 255, 249, 0.5)", fontSize: "0.82rem", fontStyle: "italic" }}>
                        Haz clic en las palabras de abajo para armar la oración aquí...
                      </span>
                    ) : (
                      assembledWords.map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => handleRemoveWord(pill)}
                          style={{
                            padding: "5px 12px",
                            background: "linear-gradient(135deg, #2ec4b6, #208b81)",
                            color: "#002427",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: "900",
                            fontSize: "0.88rem",
                            cursor: "pointer",
                            boxShadow: "0 0 8px rgba(46, 196, 182, 0.4)"
                          }}
                          title="Haz clic para quitar palabra"
                        >
                          {pill.word} ✖
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available Words Bank */}
                  <div style={{ marginTop: 10 }}>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: 4, fontWeight: "bold" }}>
                      BANCO DE PALABRAS DISPONIBLES:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {availableWords.map((pill) => (
                        <button
                          key={pill.id}
                          onClick={() => handleAddWord(pill)}
                          style={{
                            padding: "6px 13px",
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1.5px solid #ffd166",
                            color: "#ffd166",
                            borderRadius: 8,
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          }}
                        >
                          + {pill.word}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* MULTIPLE CHOICE MODE WITH SHUFFLED OPTIONS */
                <div style={{ marginTop: 14, textAlign: "left" }}>
                  <h4 style={{ color: "#9be6df", marginBottom: 8, fontSize: "0.85rem", fontWeight: "bold" }}>Nodos del Generador de Escudo:</h4>
                  <div className="shield-hex-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                    {shuffledOptions.map((opt) => {
                      const isSelected = selectedOptionId === opt.id;
                      const isRepaired = isSuccess && opt.is_correct;
                      
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleOptionSelect(opt.id)}
                          style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: isSelected ? "2px solid #b8fff9" : isRepaired ? "2px solid #2ec4b6" : "1.5px solid rgba(255, 255, 255, 0.15)",
                            background: isSelected ? "rgba(46, 196, 182, 0.2)" : isRepaired ? "rgba(46, 196, 182, 0.25)" : "rgba(0, 0, 0, 0.4)",
                            color: isSelected ? "#b8fff9" : "#e6f7ff",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          🛠️ {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action button */}
              <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                <button 
                  className="btn-create" 
                  style={{ 
                    width: "100%", 
                    maxWidth: 320, 
                    padding: "11px 22px",
                    background: "linear-gradient(135deg, #ffd166, #ffb84d)",
                    color: "#1a1a00",
                    fontSize: "0.95rem",
                    fontWeight: "900",
                    margin: 0,
                    boxShadow: "0 0 15px rgba(255, 209, 102, 0.25)"
                  }} 
                  disabled={(isSentenceMode ? assembledWords.length === 0 : !selectedOptionId) || isSuccess}
                  onClick={handleVerify}
                >
                  🛡️ Calibrar Shield Node
                </button>
              </div>
            </>
          ) : (
            /* EXPLICIT ERROR SOLUTION FEEDBACK PANEL WITH BUTTON */
            <div 
              style={{ 
                background: "rgba(239, 68, 68, 0.12)", 
                border: "1.5px solid #ef4444", 
                borderRadius: "14px", 
                padding: "14px 18px", 
                marginTop: "14px", 
                textAlign: "center" 
              }} 
              className="animate-fadeIn"
            >
              <div style={{ color: "#ef4444", fontWeight: "900", fontSize: "1.05rem", marginBottom: "8px" }}>
                💥 ¡CALIBRACIÓN INCORRECTA REGISTRADA! (-0.75 pts)
              </div>

              <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px 14px", borderRadius: 10, textAlign: "left", marginBottom: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#fca5a5", fontSize: "0.9rem", marginBottom: 6 }}>
                  ❌ <strong>Tu intento:</strong> {failedUserText || "(Incompleto)"}
                </div>
                <div style={{ color: "#2ec4b6", fontSize: "0.95rem", fontWeight: "bold" }}>
                  ✔️ <strong>Oración Gramatical Correcta:</strong> {targetSentence}
                </div>
              </div>

              <p style={{ color: "#cbd5e0", fontSize: "0.85rem", margin: "0 0 12px 0", lineHeight: "1.4" }}>
                Revisa detenidamente la corrección arriba para identificar tu error gramatical.
              </p>

              <button
                onClick={handleNextAfterError}
                style={{
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#0d1b2a",
                  fontWeight: "900",
                  fontSize: "0.98rem",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255, 209, 102, 0.5)",
                  transition: "all 0.2s ease"
                }}
              >
                💡 ENTENDIDO - CONTINUAR A LA SIGUIENTE SECCIÓN ➔
              </button>
            </div>
          )}

          {isSuccess && (
            <div style={{ marginTop: 10, color: "#2ec4b6", fontWeight: "bold", textAlign: "center", fontSize: "0.88rem" }}>
              ✨ CALIBRACIÓN COMPLETADA: Escudo de energía normalizado al 100%.
            </div>
          )}
        </div>
      ) : (
        <p>Cargando escudos...</p>
      )}
    </div>
  );
}

ShipRepairGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string,
    questions: PropTypes.array
  }),
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  hideHeader: PropTypes.bool
};

