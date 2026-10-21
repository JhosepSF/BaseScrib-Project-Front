import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { soundFx } from "../utils/soundEffects";

// Helper to map an expressive icon to a vocabulary word
const getWordIcon = (wordEn, category) => {
  const w = (wordEn || "").toLowerCase();
  const c = (category || "").toLowerCase();

  // Specific word mappings
  if (w.includes("robot")) return "🤖";
  if (w.includes("spaceship") || w.includes("rocket") || w.includes("ship")) return "🚀";
  if (w.includes("computer") || w.includes("screen")) return "💻";
  if (w.includes("book") || w.includes("read")) return "📖";
  if (w.includes("write")) return "✍️";
  if (w.includes("table")) return "🪑";
  if (w.includes("chair")) return "💺";
  if (w.includes("sleep")) return "💤";
  if (w.includes("wake")) return "⏰";
  if (w.includes("eat") || w.includes("breakfast") || w.includes("lunch") || w.includes("dinner")) return "🍎";
  if (w.includes("clean") || w.includes("shower")) return "🧼";
  if (w.includes("repair") || w.includes("tool")) return "🛠️";
  if (w.includes("fly")) return "🦅";
  if (w.includes("star") || w.includes("bright")) return "⭐";
  if (w.includes("planet") || w.includes("moon")) return "🪐";
  if (w.includes("photo")) return "📷";
  if (w.includes("garden")) return "🌱";
  if (w.includes("sick")) return "🩺";
  if (w.includes("talk") || w.includes("whisper")) return "💬";
  if (w.includes("fast") || w.includes("speed")) return "⚡";
  if (w.includes("laser")) return "🔦";
  if (w.includes("study")) return "📚";
  if (w.includes("name") || w.includes("recruit")) return "🧑‍🚀";
  if (w.includes("dance")) return "💃";
  if (w.includes("sing")) return "🎤";
  if (w.includes("sport")) return "⚽";
  if (w.includes("cook")) return "🍳";
  if (w.includes("handicraft")) return "🎨";
  if (w.includes("help")) return "🤝";

  // Category fallbacks
  if (c.includes("technology") || c.includes("tools")) return "🛰️";
  if (c.includes("space")) return "🌌";
  if (c.includes("routines") || c.includes("actions")) return "⏳";
  if (c.includes("furniture") || c.includes("places")) return "🛸";
  return "✨";
};

// Helper to pronounce English word using SpeechSynthesis
const speakEnglishWord = (text) => {
  try {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  } catch (_) {}
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function VocabularyTrainerModal({
  dayNumber = 1,
  vocabulary = [],
  isOpen,
  onClose,
  onComplete
}) {
  const [step, setStep] = useState(1); // 1: Show & Learn, 2: Word-Word (EN-ES), 3: Image-Word (No ES)

  // Step 1 State: Flashcard index & flip
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Take a curated active set of 4 words for mini-game matching
  const activeSet = useMemo(() => {
    const pool = vocabulary && vocabulary.length > 0
      ? vocabulary
      : [
          { en: "robot", es: "robot", category: "technology" },
          { en: "computer", es: "computadora", category: "technology" },
          { en: "spaceship", es: "nave espacial", category: "space" },
          { en: "repair", es: "reparar", category: "actions" }
        ];
    return pool.slice(0, 4);
  }, [vocabulary]);

  // Step 2 State (EN -> ES Word Matching)
  const [step2SelectedEn, setStep2SelectedEn] = useState(null);
  const [step2Matches, setStep2Matches] = useState({}); // { enWord: esWord }
  const [step2Error, setStep2Error] = useState(false);

  // Step 3 State (Image -> EN Word Matching, 100% English immersion, NO Spanish)
  const [step3SelectedImg, setStep3SelectedImg] = useState(null);
  const [step3Matches, setStep3Matches] = useState({}); // { wordEn: true }
  const [step3Error, setStep3Error] = useState(false);

  // Shuffled items for steps
  const step2EsOptions = useMemo(() => shuffle(activeSet.map(w => w.es)), [activeSet]);
  const step3EnOptions = useMemo(() => shuffle(activeSet.map(w => w.en)), [activeSet]);

  if (!isOpen) return null;

  const currentFlashcard = activeSet[cardIdx] || activeSet[0];

  // Step 1: Next / Prev
  const handleNextCard = () => {
    setFlipped(false);
    setCardIdx(prev => (prev + 1) % activeSet.length);
  };
  const handlePrevCard = () => {
    setFlipped(false);
    setCardIdx(prev => (prev - 1 + activeSet.length) % activeSet.length);
  };

  // Step 2: Handle Match
  const handleStep2EnClick = (wordEn) => {
    if (step2Matches[wordEn]) return;
    soundFx.playClick();
    setStep2SelectedEn(wordEn);
    setStep2Error(false);
  };

  const handleStep2EsClick = (wordEs) => {
    if (!step2SelectedEn) return;
    const targetItem = activeSet.find(w => w.en === step2SelectedEn);

    if (targetItem && targetItem.es === wordEs) {
      soundFx.playSuccess();
      setStep2Matches(prev => ({ ...prev, [step2SelectedEn]: wordEs }));
      setStep2SelectedEn(null);
      setStep2Error(false);
    } else {
      soundFx.playError();
      setStep2Error(true);
      setTimeout(() => setStep2Error(false), 1200);
    }
  };

  const isStep2Completed = Object.keys(step2Matches).length === activeSet.length;

  // Step 3: Handle Image to English Match (NO Spanish)
  const handleStep3ImgClick = (item) => {
    if (step3Matches[item.en]) return;
    soundFx.playClick();
    setStep3SelectedImg(item.en);
    setStep3Error(false);
  };

  const handleStep3EnClick = (wordEn) => {
    if (!step3SelectedImg) return;

    if (step3SelectedImg === wordEn) {
      soundFx.playLaser();
      soundFx.playSuccess();
      setStep3Matches(prev => ({ ...prev, [wordEn]: true }));
      setStep3SelectedImg(null);
      setStep3Error(false);
    } else {
      soundFx.playError();
      setStep3Error(true);
      setTimeout(() => setStep3Error(false), 1200);
    }
  };

  const isStep3Completed = Object.keys(step3Matches).length === activeSet.length;

  const handleFinishAll = () => {
    soundFx.playStreakBonus();
    soundFx.playCoin();
    if (onComplete) onComplete(15, 15);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(2, 6, 18, 0.88)",
      backdropFilter: "blur(10px)",
      zIndex: 5000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(8, 20, 38, 0.98), rgba(12, 28, 54, 0.98))",
        border: "2px solid #2ec4b6",
        borderRadius: "24px",
        maxWidth: "680px",
        width: "100%",
        padding: "clamp(18px, 3vh, 28px)",
        boxShadow: "0 0 40px rgba(46, 196, 182, 0.4)",
        boxSizing: "border-box",
        position: "relative"
      }} className="animate-fadeIn">

        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid rgba(46, 196, 182, 0.3)", paddingBottom: "12px", marginBottom: "16px" }}>
          <div>
            <span style={{ color: "#ffd166", fontSize: "0.78rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
              🔤 Taller de Aprendizaje Progresivo • Día {dayNumber}
            </span>
            <h2 style={{ margin: "2px 0 0 0", color: "#b8fff9", fontSize: "clamp(1.1rem, 2vh, 1.4rem)" }}>
              Vocabulario Clave: De la Imagen a la Inmersión
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              border: "1.5px solid #ef4444",
              color: "#ef4444",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ✕
          </button>
        </div>

        {/* 3-Step Process Stepper */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          <div 
            onClick={() => { soundFx.playClick(); setStep(1); }}
            style={{
              background: step === 1 ? "rgba(46, 196, 182, 0.25)" : step > 1 ? "rgba(46, 196, 182, 0.1)" : "rgba(255, 255, 255, 0.05)",
              border: step === 1 ? "2px solid #2ec4b6" : "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "8px 10px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <span style={{ fontSize: "0.75rem", color: step === 1 ? "#ffd166" : "#a0aec0", fontWeight: "bold", display: "block" }}>PASO 1</span>
            <span style={{ fontSize: "0.82rem", color: "#e6f7ff", fontWeight: "700" }}>👁️ Imagen + Palabra</span>
          </div>

          <div 
            onClick={() => { soundFx.playClick(); setStep(2); }}
            style={{
              background: step === 2 ? "rgba(46, 196, 182, 0.25)" : step > 2 ? "rgba(46, 196, 182, 0.1)" : "rgba(255, 255, 255, 0.05)",
              border: step === 2 ? "2px solid #2ec4b6" : "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "8px 10px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <span style={{ fontSize: "0.75rem", color: step === 2 ? "#ffd166" : "#a0aec0", fontWeight: "bold", display: "block" }}>PASO 2</span>
            <span style={{ fontSize: "0.82rem", color: "#e6f7ff", fontWeight: "700" }}>🔗 Relaciona (EN ➔ ES)</span>
          </div>

          <div 
            onClick={() => { soundFx.playClick(); setStep(3); }}
            style={{
              background: step === 3 ? "rgba(46, 196, 182, 0.25)" : "rgba(255, 255, 255, 0.05)",
              border: step === 3 ? "2px solid #2ec4b6" : "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              padding: "8px 10px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <span style={{ fontSize: "0.75rem", color: step === 3 ? "#ffd166" : "#a0aec0", fontWeight: "bold", display: "block" }}>PASO 3</span>
            <span style={{ fontSize: "0.82rem", color: "#e6f7ff", fontWeight: "700" }}>🎯 Imagen ➔ EN (100%)</span>
          </div>
        </div>

        {/* STEP 1: SHOW IMAGE AND ENGLISH WORD */}
        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#ffd166", fontSize: "0.88rem", margin: "0 0 14px 0", fontWeight: "600" }}>
              1️⃣ Observa la imagen, escucha la pronunciación y conoce la palabra en inglés:
            </p>

            {/* Flashcard Box */}
            <div
              onClick={() => setFlipped(prev => !prev)}
              style={{
                background: "rgba(10, 25, 48, 0.8)",
                border: "2px solid #00f0ff",
                borderRadius: "18px",
                padding: "24px 20px",
                maxWidth: "340px",
                margin: "0 auto 16px auto",
                boxShadow: "0 0 25px rgba(0, 240, 255, 0.25)",
                cursor: "pointer",
                transition: "all 0.25s ease"
              }}
            >
              <div style={{ fontSize: "4.5rem", marginBottom: "10px" }}>
                {getWordIcon(currentFlashcard.en, currentFlashcard.category)}
              </div>
              <h3 style={{ fontSize: "1.8rem", color: "#b8fff9", margin: "0 0 6px 0", letterSpacing: "1px", textTransform: "uppercase" }}>
                {currentFlashcard.en}
              </h3>

              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0, 240, 255, 0.15)", padding: "4px 12px", borderRadius: "12px", color: "#00f0ff", fontSize: "0.82rem", fontWeight: "bold", marginBottom: "12px" }}>
                🔊 Escuchar pronunciación
              </div>

              <div style={{ borderTop: "1px dashed rgba(255, 255, 255, 0.2)", paddingTop: "10px" }}>
                {flipped ? (
                  <span style={{ color: "#ffd166", fontSize: "1.1rem", fontWeight: "bold" }}>
                    Significado: "{currentFlashcard.es}"
                  </span>
                ) : (
                  <span style={{ color: "#94a3b8", fontSize: "0.82rem", fontStyle: "italic" }}>
                    👉 Toca la tarjeta para voltear y ver en español
                  </span>
                )}
              </div>
            </div>

            {/* Flashcard Navigation */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <button
                onClick={handlePrevCard}
                style={{ padding: "8px 16px", background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
              >
                ◀ Anterior
              </button>
              <button
                onClick={() => speakEnglishWord(currentFlashcard.en)}
                style={{ padding: "8px 16px", background: "rgba(0, 240, 255, 0.2)", border: "1px solid #00f0ff", color: "#00f0ff", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
              >
                🔊 Audio
              </button>
              <span style={{ color: "#9be6df", fontSize: "0.85rem", fontWeight: "bold" }}>
                {cardIdx + 1} / {activeSet.length}
              </span>
              <button
                onClick={handleNextCard}
                style={{ padding: "8px 16px", background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
              >
                Siguiente ▶
              </button>
            </div>

            <button
              onClick={() => { soundFx.playWarp(); setStep(2); }}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #2ec4b6, #208b81)",
                border: "none",
                borderRadius: "14px",
                color: "#fff",
                fontWeight: "900",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(46, 196, 182, 0.5)"
              }}
            >
              ¡He repasado las palabras! Pasar al Paso 2: Relacionar ➔
            </button>
          </div>
        )}

        {/* STEP 2: RELATE WORDS (ENGLISH <-> SPANISH) */}
        {step === 2 && (
          <div>
            <p style={{ color: "#ffd166", fontSize: "0.88rem", margin: "0 0 14px 0", textAlign: "center", fontWeight: "600" }}>
              2️⃣ Relaciona cada palabra en inglés con su significado en español (ej. I - yo):
            </p>

            {step2Error && (
              <div style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", color: "#fca5a5", borderRadius: "10px", padding: "6px", textAlign: "center", fontSize: "0.85rem", marginBottom: "12px" }}>
                ❌ Asociación incorrecta. ¡Inténtalo de nuevo!
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {/* English Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ color: "#00f0ff", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>Inglés:</span>
                {activeSet.map((item) => {
                  const isMatched = !!step2Matches[item.en];
                  const isSelected = step2SelectedEn === item.en;

                  return (
                    <button
                      key={item.en}
                      onClick={() => handleStep2EnClick(item.en)}
                      disabled={isMatched}
                      style={{
                        padding: "12px 14px",
                        background: isMatched ? "rgba(46, 196, 182, 0.3)" : isSelected ? "rgba(0, 240, 255, 0.3)" : "rgba(10, 25, 45, 0.7)",
                        border: isMatched ? "2px solid #2ec4b6" : isSelected ? "2.5px solid #00f0ff" : "1.5px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        color: isMatched ? "#2ec4b6" : "#fff",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        cursor: isMatched ? "default" : "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span>{item.en}</span>
                      <span>{isMatched ? "✔️" : isSelected ? "👉" : "🔤"}</span>
                    </button>
                  );
                })}
              </div>

              {/* Spanish Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ color: "#ffd166", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>Español:</span>
                {step2EsOptions.map((esWord) => {
                  const matchedEn = Object.keys(step2Matches).find(k => step2Matches[k] === esWord);
                  const isMatched = !!matchedEn;

                  return (
                    <button
                      key={esWord}
                      onClick={() => handleStep2EsClick(esWord)}
                      disabled={isMatched}
                      style={{
                        padding: "12px 14px",
                        background: isMatched ? "rgba(46, 196, 182, 0.3)" : "rgba(10, 25, 45, 0.7)",
                        border: isMatched ? "2px solid #2ec4b6" : "1.5px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        color: isMatched ? "#2ec4b6" : "#ffd166",
                        fontWeight: "bold",
                        fontSize: "0.95rem",
                        cursor: isMatched ? "default" : "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span>{esWord}</span>
                      <span>{isMatched ? "✔️" : "💬"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {isStep2Completed ? (
              <button
                onClick={() => { soundFx.playWarp(); setStep(3); }}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
                  border: "none",
                  borderRadius: "14px",
                  color: "#0d1b2a",
                  fontWeight: "900",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(255, 209, 102, 0.5)"
                }}
              >
                🎉 ¡Excelente! Pasar al Paso 3: Inmersión por Imágenes ➔
              </button>
            ) : (
              <p style={{ textAlign: "center", color: "#9be6df", fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
                💡 Selecciona una palabra en inglés y luego su correspondiente en español.
              </p>
            )}
          </div>
        )}

        {/* STEP 3: RELATE IMAGE DIRECTLY TO ENGLISH (100% IMMERSION - NO SPANISH) */}
        {step === 3 && (
          <div>
            <div style={{
              background: "rgba(255, 209, 102, 0.12)",
              border: "1.5px solid #ffd166",
              borderRadius: "12px",
              padding: "10px",
              marginBottom: "16px",
              textAlign: "center"
            }}>
              <span style={{ color: "#ffd166", fontWeight: "900", fontSize: "0.95rem" }}>
                3️⃣ Inmersión Total (¡Sin Español!):
              </span>
              <p style={{ color: "#e6f7ff", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
                Relaciona directamente la <strong>imagen visual</strong> con la <strong>palabra en inglés</strong>.
              </p>
            </div>

            {step3Error && (
              <div style={{ background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", color: "#fca5a5", borderRadius: "10px", padding: "6px", textAlign: "center", fontSize: "0.85rem", marginBottom: "12px" }}>
                ❌ La imagen no coincide con esa palabra. ¡Prueba de nuevo!
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {/* Image Visual Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ color: "#00f0ff", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>Imágenes Conceptuales:</span>
                {activeSet.map((item) => {
                  const isMatched = !!step3Matches[item.en];
                  const isSelected = step3SelectedImg === item.en;

                  return (
                    <button
                      key={item.en}
                      onClick={() => handleStep3ImgClick(item)}
                      disabled={isMatched}
                      style={{
                        padding: "10px 14px",
                        background: isMatched ? "rgba(46, 196, 182, 0.3)" : isSelected ? "rgba(0, 240, 255, 0.3)" : "rgba(10, 25, 45, 0.7)",
                        border: isMatched ? "2px solid #2ec4b6" : isSelected ? "2.5px solid #00f0ff" : "1.5px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        cursor: isMatched ? "default" : "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span style={{ fontSize: "2rem" }}>
                        {getWordIcon(item.en, item.category)}
                      </span>
                      <span style={{ fontSize: "0.85rem", color: isMatched ? "#2ec4b6" : "#fff", fontWeight: "bold" }}>
                        {isMatched ? "✔️ Solved" : isSelected ? "👉 Selected" : "Tap"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* English Words Column (ONLY ENGLISH, NO SPANISH) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ color: "#b8fff9", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>English Words:</span>
                {step3EnOptions.map((wordEn) => {
                  const isMatched = !!step3Matches[wordEn];

                  return (
                    <button
                      key={wordEn}
                      onClick={() => handleStep3EnClick(wordEn)}
                      disabled={isMatched}
                      style={{
                        padding: "16px 14px",
                        background: isMatched ? "rgba(46, 196, 182, 0.3)" : "rgba(10, 25, 45, 0.7)",
                        border: isMatched ? "2px solid #2ec4b6" : "1.5px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        color: isMatched ? "#2ec4b6" : "#00f0ff",
                        fontWeight: "900",
                        fontSize: "1.05rem",
                        textTransform: "uppercase",
                        cursor: isMatched ? "default" : "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span>{wordEn}</span>
                      <span>{isMatched ? "✔️" : "⚡"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {isStep3Completed ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#ffd166", fontSize: "1.2rem", fontWeight: "900", marginBottom: "12px" }}>
                  🌟 ¡PROCESO DE VOCABULARIO COMPLETADO CON ÉXITO! (+15 XP / +15 Coins)
                </div>
                <button
                  onClick={handleFinishAll}
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: "linear-gradient(135deg, #00ff87, #2ec4b6)",
                    border: "none",
                    borderRadius: "14px",
                    color: "#051622",
                    fontWeight: "900",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    boxShadow: "0 0 25px rgba(0, 255, 135, 0.5)"
                  }}
                >
                  🚀 ¡LISTO! VOLVER A LA ESTACIÓN ➔
                </button>
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#9be6df", fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
                💡 Toca una imagen en la izquierda y conéctala con su palabra en inglés a la derecha.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

VocabularyTrainerModal.propTypes = {
  dayNumber: PropTypes.number,
  vocabulary: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func
};

export default VocabularyTrainerModal;
