import React, { useState, useEffect } from "react";
import TypewriterText from "./TypewriterText";
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

  useEffect(() => {
    setIsSkipped(false);
    setIsTypingComplete(false);
  }, [currentStepIndex]);

  // Keyboard shortcut listener (ENTER or SPACE to advance/skip)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTypingComplete, currentStepIndex, slides.length]);

  if (!currentSlide) return null;

  const { bg, speaker, en, es } = currentSlide;

  const handleNext = () => {
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

      {/* Character Portrait & Graphic Novel Box */}
      <div className="vn-character-stage">
        {speaker && (
          <div className={`vn-portrait-wrapper ${!isTypingComplete ? "vn-speaking-pulse" : ""}`}>
            <div className="vn-portrait-frame" style={{ borderColor: speaker.color || "#3b82f6" }}>
              <img src={speaker.avatar} alt={speaker.name} className="vn-portrait-img" />
              <div className="vn-speaker-badge" style={{ backgroundColor: speaker.color || "#3b82f6" }}>
                {speaker.badge || "SPEAKER"}
              </div>
            </div>
          </div>
        )}
      </div>

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
            {!isTypingComplete && !isSkipped ? (
              <>COMPLETAR TEXTO ⚡</>
            ) : (
              <>
                {currentStepIndex + 1 < slides.length ? "CONTINUAR [ENTER] ➔" : "FINALIZAR 🌟"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
