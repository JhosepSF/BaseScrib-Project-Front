import React, { useState, useEffect } from "react";
import TypewriterText from "./TypewriterText";
import AvatarShowcase from "../../components/AvatarShowcase";
import API_BASE from "../../../config";
import { soundFx } from "../../utils/soundEffects";
import "../styles/VisualNovelDialogue.css";

export default function VisualNovelDialogue({
  slides = [],
  currentStepIndex = 0,
  onNextStep,
  onSkipAll,
  onFinish,
}) {
  const currentSlide = slides[currentStepIndex];
  const [isSkipped, setIsSkipped] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Genshin Impact Character Selection States (Shot 6)
  const [selectedGender, setSelectedGender] = useState("male"); // 'male' (Leo) | 'female' (Lia)
  const [selectedColor, setSelectedColor] = useState("#2ec4b6");
  const [selectedBase, setSelectedBase] = useState("ring");
  const [selectedVisor, setSelectedVisor] = useState("none");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setIsSkipped(false);
    setIsTypingComplete(false);
    setShowConfirmModal(false);
  }, [currentStepIndex]);

  // Keyboard shortcut listener (ENTER or SPACE to advance/skip)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showConfirmModal) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTypingComplete, currentStepIndex, slides.length, showConfirmModal, selectedGender, selectedColor, selectedBase, selectedVisor]);

  if (!currentSlide) return null;

  const { bg, speaker, en, es, isAvatarSelectionStep } = currentSlide;

  const toggleGender = () => {
    soundFx.playClick();
    setSelectedGender((prev) => (prev === "male" ? "female" : "male"));
  };

  const handleConfirmAvatarChoice = async () => {
    soundFx.playSuccess();
    setShowConfirmModal(false);

    const token = localStorage.getItem("basescrib_token");
    const outfitKey = selectedGender === "male" ? "m_base" : "f_base";

    // Save gender and initial preferences locally
    localStorage.setItem("user_gender", selectedGender);
    localStorage.setItem("selected_outfit", outfitKey);
    localStorage.setItem("suit_color", selectedColor);

    if (token) {
      try {
        await fetch(`${API_BASE}/users/select_outfit/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            outfit_id: outfitKey,
            suit_color: selectedColor,
            visor_color: selectedVisor,
            accessory: selectedBase,
            decal: "none",
            gender: selectedGender,
          }),
        });
      } catch (err) {
        console.error("Error al guardar personaje inicial:", err);
      }
    }

    if (currentStepIndex + 1 < slides.length) {
      if (onNextStep) onNextStep(currentStepIndex + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const handleNext = () => {
    if (isAvatarSelectionStep) {
      soundFx.playClick();
      setShowConfirmModal(true);
      return;
    }

    if (!isTypingComplete && !isSkipped) {
      // First press: instant reveal full text
      setIsSkipped(true);
      setIsTypingComplete(true);
      soundFx.playClick();
    } else {
      // Second press: advance slide
      soundFx.playClick();
      if (currentStepIndex + 1 < slides.length) {
        if (onNextStep) onNextStep(currentStepIndex + 1);
      } else {
        soundFx.playSuccess();
        if (onFinish) onFinish();
      }
    }
  };

  return (
    <div className="vn-scene-container">
      {/* Background Image Layer */}
      <div
        className="vn-background-layer"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="vn-overlay-gradient" />

      {/* Top Bar Controls */}
      <div className="vn-top-bar">
        <div className="vn-chapter-tag">
          <span className="vn-tag-icon">🚀</span> BASESCRIB NARRATIVE LORE
        </div>
        {onSkipAll && (
          <button className="vn-btn-skip-all" onClick={onSkipAll}>
            OMITIR CINEMÁTICA ⏩
          </button>
        )}
      </div>

      {/* OVERLAY HOLOGRÁFICO: 5 DIMENSIONES DEL ENTRENAMIENTO DIARIO (SHOTS 3 Y 4) */}
      {(currentSlide.id === 3 || currentSlide.id === 4) && (
        <div className="vn-game-preview-overlay">
          <div className="vn-game-preview-card">
            <div className="vn-game-preview-header">
              <span className="vn-game-preview-title">
                🛸 Módulos Diarios de Entrenamiento — Base ONE
              </span>
              <span className="vn-game-preview-badge">5 Juegos por Día 🎮</span>
            </div>
            <div className="vn-game-preview-grid">
              <div className="vn-mini-game-item">
                <div className="vn-mini-game-icon">🔤</div>
                <div className="vn-mini-game-name">1. Vocabulario</div>
                <div className="vn-mini-game-desc">Flashcards & Audio</div>
              </div>
              <div className="vn-mini-game-item">
                <div className="vn-mini-game-icon">📖</div>
                <div className="vn-mini-game-name">2. Lectura Cómic</div>
                <div className="vn-mini-game-desc">Diálogos de Escuadrón</div>
              </div>
              <div className="vn-mini-game-item">
                <div className="vn-mini-game-icon">🚀</div>
                <div className="vn-mini-game-name">3. Lanzamiento</div>
                <div className="vn-mini-game-desc">Orden de Oraciones</div>
              </div>
              <div className="vn-mini-game-item">
                <div className="vn-mini-game-icon">🌀</div>
                <div className="vn-mini-game-name">4. Portales</div>
                <div className="vn-mini-game-desc">Desafío DCN & Coins</div>
              </div>
              <div className="vn-mini-game-item" style={{ borderColor: "#ffd166", background: "rgba(255, 209, 102, 0.08)" }}>
                <div className="vn-mini-game-icon">✍️</div>
                <div className="vn-mini-game-name" style={{ color: "#ffd166" }}>5. Writing Mailbox</div>
                <div className="vn-mini-game-desc" style={{ color: "#fef08a" }}>Carta al Profesor</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY HOLOGRÁFICO: BUZÓN ESPACIAL DE WRITING (SHOT 7) */}
      {currentSlide.id === 7 && (
        <div className="vn-game-preview-overlay">
          <div className="vn-mailbox-card">
            <div className="vn-mailbox-header">
              <span className="vn-mailbox-title">
                📮 Sistema de Buzón Espacial — Producción Escrita
              </span>
              <span className="vn-mailbox-status">
                ✍️ Redacción ➔ 📨 Envío ➔ 📝 Nota Oficial
              </span>
            </div>
            <div className="vn-mailbox-body">
              <strong style={{ color: "#38bdf8", display: "block", marginBottom: 4 }}>
                📩 Para: General Bric / Profesor del Curso
              </strong>
              <p style={{ margin: 0, fontStyle: "italic", color: "#cbd5e1" }}>
                "Dear General Bric, I am excited to join Base ONE. I am ready to practice my English daily..."
              </p>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 8, fontSize: "0.75rem", color: "#ffd166" }}>
                <span>✨ El alumno redacta y envía su carta en el sistema</span>
                <span>⭐ El docente califica y otorga retroalimentación</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENSHIN IMPACT STYLE CHARACTER SELECTION STAGE (SHOT 6) */}
      {isAvatarSelectionStep && (
        <div className="genshin-avatar-stage-container animate-fadeIn">
          {/* SECCIÓN PRINCIPAL CON FLECHAS FLANQUEANDO AL PERSONAJE */}
          <div className="genshin-avatar-selection-wrapper">
            <button 
              className="genshin-arrow-btn left"
              onClick={toggleGender}
              title="Cambiar Personaje (Leo / Lia)"
            >
              ◀
            </button>

            {/* ESCENARIO DEL PERSONAJE PRINCIPAL */}
            <div 
              className="genshin-center-platform-box"
              onClick={toggleGender}
              style={{ cursor: "pointer" }}
              title="Haz clic para alternar entre Leo y Lia"
            >
              <div className="genshin-character-title-badge">
                {selectedGender === "male" ? "🧑‍🚀 Recluta Leo (Masculino)" : "👩‍🚀 Entrenadora Lia (Femenino)"}
              </div>

              <AvatarShowcase
                outfitId={selectedGender === "male" ? "m_base" : "f_base"}
                suitColor={selectedColor}
                visorColor={selectedVisor}
                accessory={selectedBase}
                decal="none"
                gender={selectedGender}
                size="xxlarge"
                transparent={true}
                showPet={false}
                showTitle={false}
              />

              <span className="genshin-switch-hint">
                🔄 Haz clic en el personaje o las flechas para alternar entre Leo y Lia
              </span>
            </div>

            <button 
              className="genshin-arrow-btn right"
              onClick={toggleGender}
              title="Cambiar Personaje (Leo / Lia)"
            >
              ▶
            </button>
          </div>

          {/* CONTROLES LATERALES DE PERSONALIZACIÓN INICIAL */}
          <div className="genshin-custom-sidebar">
            <div>
              <div className="genshin-section-title">🎨 Color de Traje</div>
              <div className="genshin-swatch-row">
                {[
                  { color: "#2ec4b6", label: "Sin Color Extra (Original) 🚫", icon: "🚫", bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(15, 23, 42, 0.9))" },
                  { color: "#ffffff", label: "Blanco Espacial 🤍", icon: "", bg: "#ffffff" },
                  { color: "#ff6b6b", label: "Rojo Estelar 🔴", icon: "", bg: "#ff6b6b" },
                  { color: "#ffd166", label: "Amarillo Dorado 💛", icon: "", bg: "#ffd166" }
                ].map((item) => (
                  <div
                    key={item.color}
                    className={`genshin-color-swatch ${selectedColor === item.color ? "active" : ""}`}
                    style={{ 
                      background: item.bg, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "0.85rem",
                      border: selectedColor === item.color ? "2.5px solid #00f0ff" : "1.5px solid rgba(255, 255, 255, 0.3)"
                    }}
                    onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setSelectedColor(item.color); }}
                    title={item.label}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="genshin-section-title">⭕ Base de Suelo</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  { id: "ring", name: "⭕ Aro Neón" },
                  { id: "aura_cyan", name: "🌀 Portal Cian" },
                  { id: "aura_quantum", name: "🔮 Campo Cuántico" },
                  { id: "aura_gold", name: "⚜️ Cresta Celestial" },
                  { id: "aura_solar", name: "🔥 Sol Estelar" },
                  { id: "none", name: "🚫 Sin Base" }
                ].map((b) => (
                  <button
                    key={b.id}
                    className={`genshin-option-chip ${selectedBase === b.id ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setSelectedBase(b.id); }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="genshin-section-title">👓 Gafas Iniciales</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  { id: "gafas_oscuras", name: "🕶️ Oscuras" },
                  { id: "gafas_cian", name: "👓 Cian" },
                  { id: "gafas_rojas", name: "🔴 Rojas" },
                  { id: "gafas_amarillas", name: "💛 Amarillas" },
                  { id: "gafas_verdes", name: "🟢 Verdes" },
                  { id: "gafas_violetas", name: "💜 Violetas" },
                  { id: "none", name: "🚫 Sin Gafas" }
                ].map((g) => (
                  <button
                    key={g.id}
                    className={`genshin-option-chip ${selectedVisor === g.id ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); soundFx.playClick(); setSelectedVisor(g.id); }}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Portrait Stage (For non-selection steps) */}
      {!isAvatarSelectionStep && (
        <div className="vn-character-stage">
          {speaker && (
            <div className={`vn-portrait-wrapper ${!isTypingComplete ? "vn-speaking-pulse" : ""}`}>
              <div className="vn-portrait-frame">
                <img src={speaker.avatar} alt={speaker.name} className="vn-portrait-img" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Japanese Visual Novel Text Box */}
      <div className="vn-dialogue-box">
        <div className="vn-speaker-header">
          <span className="vn-speaker-name" style={{ color: speaker?.color || "#60a5fa" }}>
            {speaker?.name || "Command Center"}
          </span>
          <span className="vn-speaker-role">{speaker?.role || "Base One AI"}</span>
        </div>

        <div className="vn-text-body">
          {/* Primary English Text */}
          <div className="vn-text-en">
            <span className="vn-lang-tag">EN</span>
            <TypewriterText
              text={en}
              speed={20}
              isSkipped={isSkipped}
              onComplete={() => setIsTypingComplete(true)}
              className="vn-en-content"
            />
          </div>

          {/* Subtitle Spanish Text */}
          <div className="vn-text-es">
            <span className="vn-lang-tag es">ES</span>
            <TypewriterText
              text={es}
              speed={15}
              isSkipped={isSkipped}
              className="vn-es-content"
            />
          </div>
        </div>

        {/* Next / Skip Controls */}
        <div className="vn-controls-footer">
          <div className="vn-step-counter">
            PASO {currentStepIndex + 1} / {slides.length}
          </div>

          <button className="vn-btn-action" onClick={handleNext}>
            {isAvatarSelectionStep ? (
              <>ELEGIR ESTE PERSONAJE 🌟</>
            ) : !isTypingComplete && !isSkipped ? (
              <>COMPLETAR TEXTO ⚡</>
            ) : (
              <>
                {currentStepIndex + 1 < slides.length ? "CONTINUAR [ENTER] ➔" : "FINALIZAR 🌟"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE PERSONAJE */}
      {showConfirmModal && (
        <div className="vn-confirm-modal-overlay">
          <div className="vn-confirm-card">
            <h2 className="vn-confirm-title">🚀 REGISTRO DE RECLUTA OFICIAL</h2>
            <div className="vn-confirm-subtitle">
              {selectedGender === "male" ? "🧑‍🚀 Recluta Leo (Masculino)" : "👩‍🚀 Entrenadora Lia (Femenino)"}
            </div>
            <p className="vn-confirm-desc">
              ¿Confirmas a este personaje como tu identidad principal para la estación?
              <br />
              <small style={{ color: "#94a3b8" }}>
                (La tienda, armario y misiones se configurarán especialmente para tu recluta elegido).
              </small>
            </p>
            <button className="vn-confirm-btn-primary" onClick={handleConfirmAvatarChoice}>
              ¡SÍ, CONFIRMAR PERSONAJE! 🌟
            </button>
            <button className="vn-confirm-btn-secondary" onClick={() => setShowConfirmModal(false)}>
              Elegir al otro recluta 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
