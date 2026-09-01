import React, { useState, useEffect } from "react";
import TypewriterText from "./TypewriterText";
import { soundFx } from "../../utils/soundEffects";
import "../styles/GuidedTourSpotlight.css";

export default function GuidedTourSpotlight({
  steps = [],
  currentStepIndex = 0,
  onNextStep,
  onSkipTour,
  onFinishTour,
}) {
  const currentStep = steps[currentStepIndex];
  const [targetRect, setTargetRect] = useState(null);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    setIsTypingDone(false);
    if (!currentStep) return;

    const updatePosition = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        });
      } else {
        // Fallback: Center screen if target element not found
        setTargetRect({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 200,
          width: 400,
          height: 200,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [currentStepIndex, currentStep]);

  if (!currentStep) return null;

  const handleNext = () => {
    soundFx.playClick();
    if (currentStepIndex + 1 < steps.length) {
      if (onNextStep) onNextStep(currentStepIndex + 1);
    } else {
      soundFx.playCoin();
      if (onFinishTour) onFinishTour();
    }
  };

  const { speaker, titleEN, titleES, en, es } = currentStep;

  // Compute position for floating tooltip speech bubble
  let tooltipStyle = {};
  if (targetRect) {
    const isTopHalf = targetRect.top < window.innerHeight / 2;
    tooltipStyle = {
      left: Math.max(20, Math.min(targetRect.left, window.innerWidth - 450)),
      top: isTopHalf ? targetRect.top + targetRect.height + 20 : targetRect.top - 240,
    };
  }

  return (
    <div className="tour-overlay-container">
      {/* Dark Overlay with Cutout Mask */}
      <svg className="tour-svg-mask">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="14"
                ry="14"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(3, 7, 18, 0.85)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Target Highlight Border Pulse */}
      {targetRect && (
        <div
          className="tour-highlight-box"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      )}

      {/* Top Bar Skip */}
      <div className="tour-top-bar">
        <span className="tour-badge">
          🔍 ENTRENAMIENTO DE CABINA ({currentStepIndex + 1} / {steps.length})
        </span>
        {onSkipTour && (
          <button className="tour-btn-skip" onClick={onSkipTour}>
            SALTAR TOUR ✕
          </button>
        )}
      </div>

      {/* Floating Sparky Speech Bubble */}
      <div className="tour-tooltip-card" style={tooltipStyle}>
        <div className="tour-tooltip-header">
          {speaker && <img src={speaker.avatar} alt="Sparky" className="tour-robot-avatar" />}
          <div>
            <div className="tour-title-es">{titleES}</div>
            <div className="tour-title-en">{titleEN}</div>
          </div>
        </div>

        <div className="tour-tooltip-body">
          <div className="tour-text-es">
            <TypewriterText
              text={es}
              speed={18}
              onComplete={() => setIsTypingDone(true)}
            />
          </div>
          <div className="tour-text-en">{en}</div>
        </div>

        <div className="tour-tooltip-footer">
          <div className="tour-dots">
            {steps.map((s, idx) => (
              <span
                key={s.id}
                className={`tour-dot ${idx === currentStepIndex ? "active" : ""}`}
              />
            ))}
          </div>

          <button className="tour-btn-next" onClick={handleNext}>
            {currentStepIndex + 1 < steps.length ? "ENTENDIDO ➔" : "FINALIZAR TOUR 🌟"}
          </button>
        </div>
      </div>
    </div>
  );
}
