import React, { useState } from "react";
import VisualNovelDialogue from "./VisualNovelDialogue";
import HolographicRoomSimulator from "./HolographicRoomSimulator";
import {
  INTRO_CUTSCENE_SLIDES,
  MISSION_1_TUTORIAL_SLIDES,
} from "../data/onboardingStory";
import { soundFx } from "../../utils/soundEffects";

/**
 * OnboardingModal Component
 * Orchestrates the full Onboarding flow:
 * 1. Intro Cutscene (Visual Novel Style)
 * 2. Holographic Interactive Room Simulator
 * 3. Mission 1 Walkthrough Briefing
 * 4. Completion Reward Claim
 */
export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [mode, setMode] = useState("CUTSCENE"); // 'CUTSCENE' | 'SPOTLIGHT_TOUR' | 'MISSION_1' | 'REWARD'
  const [cutsceneIndex, setCutsceneIndex] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);

  if (!isOpen) return null;

  const handleCutsceneFinish = () => {
    soundFx.playSuccess();
    setMode("SPOTLIGHT_TOUR");
  };

  const handleSpotlightFinish = () => {
    soundFx.playSuccess();
    setMode("MISSION_1");
  };

  const handleMissionFinish = () => {
    soundFx.playCoin();
    setMode("REWARD");
  };

  const handleClaimReward = () => {
    soundFx.playStreakBonus();
    if (onComplete) onComplete();
    if (onClose) onClose();
  };

  const handleSkipAll = () => {
    soundFx.playClick();
    if (onClose) onClose();
  };

  return (
    <>
      {mode === "CUTSCENE" && (
        <VisualNovelDialogue
          slides={INTRO_CUTSCENE_SLIDES}
          currentStepIndex={cutsceneIndex}
          onNextStep={(idx) => setCutsceneIndex(idx)}
          onSkipAll={handleSkipAll}
          onFinish={handleCutsceneFinish}
        />
      )}

      {mode === "SPOTLIGHT_TOUR" && (
        <HolographicRoomSimulator
          onSkipTour={() => setMode("MISSION_1")}
          onFinishTour={handleSpotlightFinish}
        />
      )}

      {mode === "MISSION_1" && (
        <VisualNovelDialogue
          slides={MISSION_1_TUTORIAL_SLIDES}
          currentStepIndex={missionIndex}
          onNextStep={(idx) => setMissionIndex(idx)}
          onSkipAll={handleSkipAll}
          onFinish={handleMissionFinish}
        />
      )}

      {mode === "REWARD" && (
        <div className="vn-scene-container" style={{ justifyContent: "center", alignItems: "center" }}>
          <div className="vn-overlay-gradient" />
          <div
            className="vn-dialogue-box"
            style={{
              maxWidth: "500px",
              textAlign: "center",
              alignItems: "center",
              animation: "vnCharacterBounce 2s infinite ease-in-out",
            }}
          >
            <div style={{ fontSize: "3rem" }}>🎉 🎖️ 🪙</div>
            <h2 style={{ color: "#38bdf8", fontSize: "1.8rem", margin: "10px 0" }}>
              ¡ENTRENAMIENTO COMPLETADO!
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: "1rem", lineHeight: "1.5" }}>
              Has recibido tu kit de inicio de recluta de Base ONE:
            </p>
            <div
              style={{
                display: "flex",
                gap: "20px",
                margin: "15px 0",
                justify: "center",
              }}
            >
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.2)",
                  border: "1px solid #f59e0b",
                  padding: "10px 20px",
                  borderRadius: "14px",
                  color: "#fcd34d",
                  fontWeight: "800",
                }}
              >
                +100 Monedas 🪙
              </div>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid #10b981",
                  padding: "10px 20px",
                  borderRadius: "14px",
                  color: "#6ee7b7",
                  fontWeight: "800",
                }}
              >
                Insignia Recluta 🏅
              </div>
            </div>
            <button className="vn-btn-action" onClick={handleClaimReward} style={{ width: "100%" }}>
              ¡COMENZAR MISIÓN DEL DÍA 1! 🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
}
