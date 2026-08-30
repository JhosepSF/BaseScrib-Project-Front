import { useState, useEffect } from "react";
import { soundFx } from "../utils/soundEffects";
import { API_BASE } from "../../config";

export default function AbyssModal({ user, token, onClose, onUserUpdated, selectedDay = 1 }) {
  const [floor, setFloor] = useState(selectedDay);
  const [backendQuestions, setBackendQuestions] = useState(null);
  const [bossTitle, setBossTitle] = useState("");
  const [inChallenge, setInChallenge] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Genshin Star System States
  const [trialStartTime, setTrialStartTime] = useState(null);
  const [starsUnlocked, setStarsUnlocked] = useState(0);
  const [bestTimeSeconds, setBestTimeSeconds] = useState(null);
  const [claimedCoins, setClaimedCoins] = useState(0);
  const [runStarsEarned, setRunStarsEarned] = useState(0);
  const [runNewStars, setRunNewStars] = useState(0);
  const [runCoinsAwarded, setRunCoinsAwarded] = useState(0);

  useEffect(() => {
    if (selectedDay) setFloor(selectedDay);
  }, [selectedDay]);

  const fetchAbyssDayData = (dayNum) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE}/abyss-levels/by_day/?day=${dayNum}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.questions && data.questions.length > 0) {
          setBackendQuestions(data.questions);
          if (data.boss_name) setBossTitle(data.boss_name);
          if (data.stars_unlocked !== undefined) setStarsUnlocked(data.stars_unlocked);
          if (data.best_time_seconds !== undefined) setBestTimeSeconds(data.best_time_seconds);
          if (data.claimed_coins !== undefined) setClaimedCoins(data.claimed_coins);
        }
      })
      .catch(() => setBackendQuestions(null));
  };

  useEffect(() => {
    fetchAbyssDayData(floor);
  }, [floor]);

  // Abyss trial challenges (Special Speed-Trial & Boss Anomaly Formats) - Local Fallback
  const abyssTrialPool = {
    1: [
      { mode: "⚡ REACCIÓN RÁPIDA", q: "Piso 1 - Anomalia 1: 'Identify the recruit's age & origin signal'", target: "Tom is 13 years old and he is from Peru.", options: [{ text: "Tom is 13 years old and he is from Peru.", isCorrect: true }, { text: "Tom are 13 years old from Peru.", isCorrect: false }, { text: "Tom am 13 and is Peru.", isCorrect: false }] },
      { mode: "🛡️ ESCUDO GRAMATICAL", q: "Piso 1 - Anomalia 2: 'Detect the incorrect cabin item formulation'", target: "There are a desk in the cabin.", options: [{ text: "There are a desk in the cabin.", isCorrect: true }, { text: "There is a desk in the cabin.", isCorrect: false }, { text: "There are two chairs in the cabin.", isCorrect: false }] },
      { mode: "👑 BOSS ANOMALY: EL GUARDIÁN DE BRIC", q: "Piso 1 - BOSS: 'Decodifica el hábito del Capitán Bric antes que agote el reactor'", target: "Captain Bric drinks space tea at 07:00.", options: [{ text: "Captain Bric drinks space tea at 07:00.", isCorrect: true }, { text: "Captain Bric drinking tea 07:00.", isCorrect: false }, { text: "Captain Bric drink space tea at 07:00.", isCorrect: false }] }
    ],
    2: [
      { mode: "⚡ REACCIÓN RÁPIDA", q: "Piso 2 - Anomalia 1: 'Signal in Progress: Select the action happening NOW'", target: "Ale and Dani are repairing the radar.", options: [{ text: "Ale and Dani are repairing the radar.", isCorrect: true }, { text: "Ale and Dani repairs the radar.", isCorrect: false }, { text: "Ale and Dani is repairing the radar.", isCorrect: false }] },
      { mode: "🛡️ ESCUDO GRAMATICAL", q: "Piso 2 - Anomalia 2: 'Frequency Check: How often do they inspect oxygen?'", target: "They always check the oxygen levels.", options: [{ text: "They always check the oxygen levels.", isCorrect: true }, { text: "They check always the oxygen levels.", isCorrect: false }, { text: "They always checking the oxygen levels.", isCorrect: false }] },
      { mode: "👑 BOSS ANOMALY: NÚCLEO PLASMA", q: "Piso 2 - BOSS: 'Sobrecarga de combustible: ¿Qué equipo tiene Dani?'", target: "Dani has a laser scanner kit.", options: [{ text: "Dani has a laser scanner kit.", isCorrect: true }, { text: "Dani have a laser scanner kit.", isCorrect: false }, { text: "Dani haves a laser scanner kit.", isCorrect: false }] }
    ],
    3: [
      { mode: "⚡ REACCIÓN RÁPIDA", q: "Piso 3 - Anomalia 1: 'Wh-Transmission: Interroga la procedencia de la nave'", target: "Where is the starship coming from?", options: [{ text: "Where is the starship coming from?", isCorrect: true }, { text: "Who is the starship coming from?", isCorrect: false }, { text: "When is the starship coming from?", isCorrect: false }] },
      { mode: "🛡️ ESCUDO GRAMATICAL", q: "Piso 3 - Anomalia 2: 'Propiedad Cuántica: Identifica el pronombre correcto'", target: "That visor belongs to Ale. It is hers.", options: [{ text: "That visor belongs to Ale. It is hers.", isCorrect: true }, { text: "That visor belongs to Ale. It is her.", isCorrect: false }, { text: "That visor belongs to Ale. It is she.", isCorrect: false }] },
      { mode: "👑 BOSS ANOMALY: ESPECTRO DE SCRIBTONIA", q: "Piso 3 - BOSS: 'Señala los escudos lejanos en la bahía de simulaciones'", target: "Those are quantum energy shields.", options: [{ text: "Those are quantum energy shields.", isCorrect: true }, { text: "This are quantum energy shields.", isCorrect: false }, { text: "That are quantum energy shields.", isCorrect: false }] }
    ],
    4: [
      { mode: "⚡ REACCIÓN RÁPIDA", q: "Piso 4 - Anomalia 1: 'Cuantificador de Combustible: Selecciona la pregunta correcta'", target: "How much plasma fuel is left?", options: [{ text: "How much plasma fuel is left?", isCorrect: true }, { text: "How many plasma fuel is left?", isCorrect: false }, { text: "How count plasma fuel is left?", isCorrect: false }] },
      { mode: "🛡️ ESCUDO GRAMATICAL", q: "Piso 4 - Anomalia 2: 'Comparación Planetaria: Scribtonia vs la Tierra'", target: "Scribtonia is more luminous than Earth.", options: [{ text: "Scribtonia is more luminous than Earth.", isCorrect: true }, { text: "Scribtonia is luminouser than Earth.", isCorrect: false }, { text: "Scribtonia is most luminous than Earth.", isCorrect: false }] },
      { mode: "👑 BOSS FINAL: ANOMALÍA SUPREMA DEL ABISMO", q: "Piso 4 - BOSS FINAL: 'Ubica la medalla de graduación en la bóveda'", target: "The medal is inside the central vault.", options: [{ text: "The medal is inside the central vault.", isCorrect: true }, { text: "The medal is inside of to the vault.", isCorrect: false }, { text: "The medal is behind of the vault.", isCorrect: false }] }
    ]
  };

  useEffect(() => {
    let timer;
    if (inChallenge && !completed && !failed && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (inChallenge && timeLeft === 0 && !completed && !failed) {
      soundFx.playError();
      handleMistake();
    }
    return () => clearInterval(timer);
  }, [inChallenge, timeLeft, completed, failed]);

  const activeQuestions = backendQuestions || abyssTrialPool[floor] || abyssTrialPool[1];

  const startAbyss = () => {
    soundFx.playWarp();
    fetchAbyssDayData(floor); // Refresh permuted question order & choices
    setTrialStartTime(Date.now());
    setInChallenge(true);
    setCurrentQIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setCoinsEarned(0);
    setTimeLeft(12);
    setCompleted(false);
    setFailed(false);
  };

  const handleMistake = () => {
    soundFx.playError();
    setCombo(0);
    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      setFailed(true);
    } else {
      handleNextQuestion();
    }
  };

  const handleOptionClick = (isCorrect) => {
    if (selectedOption !== null) return;
    setSelectedOption(isCorrect);

    if (isCorrect) {
      soundFx.playSuccess();
      soundFx.playLaser();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const comboMultiplier = newCombo > 1 ? newCombo : 1;
      const points = 10 * comboMultiplier;
      setScore(prev => prev + points);
      setCoinsEarned(prev => prev + (floor * 20 * comboMultiplier));
    } else {
      soundFx.playError();
      setCombo(0);
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => setFailed(true), 800);
        return;
      }
    }

    setTimeout(() => {
      setSelectedOption(null);
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(12);
    } else {
      soundFx.playCoin();
      soundFx.playStreakBonus();
      setCompleted(true);

      const completionTime = trialStartTime ? (Date.now() - trialStartTime) / 1000 : 25.0;

      // Submit result to backend for Genshin star calculations and claimed coins
      if (token) {
        fetch(`${API_BASE}/abyss-levels/submit_result/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            day_number: floor,
            completion_time_seconds: completionTime,
            lives_remaining: lives
          })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data.status === "success") {
              setRunStarsEarned(data.stars_earned);
              setRunNewStars(data.new_stars);
              setRunCoinsAwarded(data.coins_awarded);
              setStarsUnlocked(data.total_stars);
              setClaimedCoins(data.claimed_coins);
              if (data.best_time_seconds) setBestTimeSeconds(data.best_time_seconds);
              if (onUserUpdated && user) {
                onUserUpdated({
                  ...user,
                  coins: data.user_coins,
                  xp: data.user_xp
                });
              }
            }
          })
          .catch(() => {});
      }
    }
  };

  const q = activeQuestions[currentQIndex] || activeQuestions[0];

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(ellipse at center, rgba(35, 8, 60, 0.96), rgba(4, 1, 14, 0.99))",
      backdropFilter: "blur(14px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: 20
    }}>
      <div className="modal-card animate-scaleUp" style={{
        background: "linear-gradient(150deg, #1d0b38, #090318)",
        border: "2px solid #f72585",
        borderRadius: 24,
        padding: 28,
        maxWidth: 680,
        width: "100%",
        boxShadow: "0 0 70px rgba(247, 37, 133, 0.4), inset 0 0 30px rgba(114, 9, 183, 0.4)",
        position: "relative",
        color: "#e6f7ff"
      }}>
        <button 
          onClick={() => { soundFx.playClick(); onClose(); }}
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
            border: "1px solid rgba(247, 37, 133, 0.5)",
            color: "#f72585",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ✖
        </button>

        {/* LOBBY INICIAL DEL ABISMO */}
        {!inChallenge && !failed && !completed && (
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "4rem", display: "inline-block", animation: "pulse 1.8s infinite" }}>🌀</span>
            <h2 style={{ color: "#f72585", margin: "10px 0 5px 0", fontSize: "1.85rem", textShadow: "0 0 20px rgba(247, 37, 133, 0.7)" }}>
              El Abismo Cuántico (Día {floor})
            </h2>
            <p style={{ color: "#7209b7", fontSize: "0.95rem", fontWeight: "bold", marginBottom: 8 }}>
              Desafío de Reacción & Supervivencia Gramatical (DCN 2019 / MCER A1-A2)
            </p>

            {/* MARCADOR DE ESTRELLAS AL ESTILO GENSHIN IMPACT */}
            <div style={{ background: "rgba(255, 209, 102, 0.12)", border: "1.5px solid #ffd166", borderRadius: 16, padding: "12px 18px", margin: "12px auto 16px auto", maxWidth: 520 }}>
              <div style={{ fontSize: "2rem", letterSpacing: 6, marginBottom: 4 }}>
                {starsUnlocked >= 1 ? "⭐" : "☆"} {starsUnlocked >= 2 ? "⭐" : "☆"} {starsUnlocked >= 3 ? "⭐" : "☆"}
              </div>
              <p style={{ color: "#ffd166", fontSize: "0.9rem", fontWeight: "bold", margin: 0 }}>
                Estrellas del Abismo: {starsUnlocked} / 3 | Recompensa: {claimedCoins} / 150 🪙
              </p>
              {bestTimeSeconds && (
                <span style={{ color: "#4cc9f0", fontSize: "0.8rem", display: "block", marginTop: 4 }}>
                  ⏱️ Mejor tiempo récord: {bestTimeSeconds.toFixed(1)}s
                </span>
              )}
            </div>

            {/* REQUISITOS DE ESTRELLAS */}
            <div style={{ background: "rgba(114, 9, 183, 0.18)", border: "1px solid rgba(247, 37, 133, 0.4)", borderRadius: 16, padding: 14, marginBottom: 20, textAlign: "left" }}>
              <strong style={{ color: "#9be6df", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>
                🎯 Desafíos de Estrellas (Recompensas Fijas):
              </strong>
              <div style={{ fontSize: "0.8rem", color: "#e6f7ff", display: "flex", flexDirection: "column", gap: 4 }}>
                <div>⭐ <strong>1 Estrella (+50 🪙)</strong>: Completar el Abismo del Día.</div>
                <div>⭐⭐ <strong>2 Estrellas (+100 🪙)</strong>: Completar en ≤ 50s con al menos 1 vida.</div>
                <div>⭐⭐⭐ <strong>3 Estrellas (+150 🪙)</strong>: Completar en ≤ 35s con al menos 2 vidas.</div>
              </div>
            </div>

            <button 
              onClick={startAbyss}
              style={{
                background: "linear-gradient(135deg, #f72585, #7209b7)",
                color: "white",
                padding: "14px 34px",
                borderRadius: 14,
                fontWeight: "bold",
                fontSize: "1.1rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(247, 37, 133, 0.6)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <span>🌀 Iniciar Desafío Abisal (Día {floor})</span>
            </button>
          </div>
        )}

        {/* MODO RETO DE ALTA VELOCIDAD */}
        {inChallenge && !completed && !failed && q && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: "1px solid rgba(247, 37, 133, 0.25)", paddingBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: "rgba(247, 37, 133, 0.2)", border: "1px solid #f72585", color: "#f72585", padding: "4px 10px", borderRadius: 12, fontSize: "0.78rem", fontWeight: "bold" }}>
                  {q.mode}
                </span>
                <span style={{ color: "#9be6df", fontWeight: "bold", fontSize: "0.85rem" }}>
                  Oleada {currentQIndex + 1} / {activeQuestions.length}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                {combo > 1 && (
                  <span style={{ background: "linear-gradient(135deg, #ffd166, #ffb84d)", color: "#1a1a00", padding: "3px 10px", borderRadius: 12, fontWeight: "bold", fontSize: "0.85rem", animation: "bounce 0.5s" }}>
                    🔥 Combo x{combo}!
                  </span>
                )}
                <div style={{ color: "#ff6b6b", fontSize: "1.1rem", fontWeight: "bold" }}>
                  {"🛡️".repeat(lives)}
                </div>
                <div style={{ 
                  background: timeLeft <= 4 ? "rgba(255, 107, 107, 0.3)" : "rgba(114, 9, 183, 0.25)", 
                  border: timeLeft <= 4 ? "1px solid #ff6b6b" : "1px solid #7209b7", 
                  color: timeLeft <= 4 ? "#ff6b6b" : "#4cc9f0", 
                  padding: "5px 14px", 
                  borderRadius: 20, 
                  fontWeight: "bold", 
                  fontSize: "1rem" 
                }}>
                  ⏱️ {timeLeft}s
                </div>
              </div>
            </div>

            <h3 style={{ color: "#b8fff9", fontSize: "1.1rem", marginBottom: 20, minHeight: 48, lineHeight: 1.4 }}>
              {q.q}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {q.options.map((opt, idx) => {
                let btnBg = "rgba(255, 255, 255, 0.04)";
                let btnBorder = "1px solid rgba(247, 37, 133, 0.3)";

                if (selectedOption !== null) {
                  if (opt.isCorrect) {
                    btnBg = "rgba(46, 196, 182, 0.3)";
                    btnBorder = "2px solid #2ec4b6";
                  } else if (selectedOption === false) {
                    btnBg = "rgba(255, 107, 107, 0.3)";
                    btnBorder = "2px solid #ff6b6b";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(opt.isCorrect)}
                    style={{
                      background: btnBg,
                      border: btnBorder,
                      borderRadius: 14,
                      padding: "14px 18px",
                      color: "#e6f7ff",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      textAlign: "left",
                      justifyContent: "flex-start",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PANTALLA DE FRACASO / COLAPSO DEL PORTAL */}
        {failed && (
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "4rem" }}>💥</span>
            <h2 style={{ color: "#ff6b6b", margin: "10px 0 5px 0" }}>¡Portal Colapsado!</h2>
            <p style={{ color: "#9be6df", fontSize: "0.95rem" }}>
              Tus escudos cuánticos se agotaron en el Día {floor}. ¡Reinicia el circuito!
            </p>
            <div style={{ margin: "20px 0" }}>
              <button 
                onClick={startAbyss}
                style={{ background: "linear-gradient(135deg, #f72585, #7209b7)", color: "white", padding: "12px 28px", borderRadius: 12, fontWeight: "bold", border: "none", cursor: "pointer" }}
              >
                🔄 Reintentar Día {floor}
              </button>
            </div>
          </div>
        )}

        {/* PANTALLA DE PISO SUPERADO ESTILO GENSHIN IMPACT */}
        {completed && (
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "4rem", display: "inline-block", animation: "tada 1s" }}>🏆</span>
            <h2 style={{ color: "#ffd166", margin: "10px 0 5px 0", fontSize: "1.7rem" }}>¡Abismo del Día {floor} Conquistado!</h2>
            
            {/* DISPLAY DE ESTRELLAS GANADAS */}
            <div style={{ fontSize: "2.8rem", letterSpacing: 10, margin: "10px 0" }}>
              {runStarsEarned >= 1 ? "⭐" : "☆"} {runStarsEarned >= 2 ? "⭐" : "☆"} {runStarsEarned >= 3 ? "⭐" : "☆"}
            </div>

            <p style={{ color: "#9be6df", fontSize: "0.95rem" }}>
              {runNewStars > 0
                ? `¡Has desbloqueado ${runNewStars} nueva(s) estrella(s) y reclamado +${runCoinsAwarded} Monedas!`
                : `¡Excelente tiempo! Las recompensas de las ${starsUnlocked} estrella(s) de este día ya fueron reclamadas previamente.`}
            </p>

            <div style={{ background: "rgba(255, 209, 102, 0.12)", border: "1px solid #ffd166", borderRadius: 18, padding: 18, margin: "20px 0", display: "flex", justifyContent: "space-around" }}>
              <div>
                <span style={{ color: "#9be6df", fontSize: "0.8rem" }}>Monedas Reclamadas</span>
                <h3 style={{ color: "#ffd166", margin: "4px 0 0 0", fontSize: "1.4rem" }}>🪙 +{runCoinsAwarded} Coins</h3>
              </div>
              <div>
                <span style={{ color: "#9be6df", fontSize: "0.8rem" }}>Estrellas Totales</span>
                <h3 style={{ color: "#f72585", margin: "4px 0 0 0", fontSize: "1.4rem" }}>⭐ {starsUnlocked} / 3</h3>
              </div>
              <div>
                <span style={{ color: "#9be6df", fontSize: "0.8rem" }}>Puntos de XP</span>
                <h3 style={{ color: "#7ee7c6", margin: "4px 0 0 0", fontSize: "1.4rem" }}>⭐ +{score} XP</h3>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button 
                onClick={startAbyss}
                style={{ background: "rgba(255, 255, 255, 0.1)", color: "#b8fff9", border: "1px solid #2ec4b6", padding: "12px 22px", borderRadius: 12, fontWeight: "bold", cursor: "pointer" }}
              >
                🔄 Reintentar para Mejorar Tiempo
              </button>
              <button 
                onClick={onClose}
                style={{ background: "linear-gradient(135deg, #f72585, #7209b7)", color: "white", padding: "12px 28px", borderRadius: 12, fontWeight: "bold", border: "none", cursor: "pointer" }}
              >
                ✅ Regresar a la Base
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
