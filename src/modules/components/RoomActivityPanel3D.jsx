import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import AvatarShowcase from "./AvatarShowcase";
import { soundFx } from "../utils/soundEffects";
import RecluteHUD from "./RecluteHUD";
import { RoomCalibratorTool } from "./RoomCalibratorTool";
import PortalGateway from "./PortalGateway";
import OnboardingModal from "../onboarding/components/OnboardingModal";
import { DailyGameRunner } from "./DailyGameRunner";
import naveDentroImage from "../../assets/amongus/Nave_dentro_16_9.jpg";
import sparkyOpenOpen from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA ABIERTA.png";
import sparkyOpenClosed from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA CERRADA.png";
import sparkyClosedOpen from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS CERRADOS - BOCA ABIERTA.png";
import sparkyClosedClosed from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS CERRADOS- BOCA CERRADA.png";
import cofreCerrado from "../../assets/amongus/COFRE/COFRE CERRADO.png";
import cofreEtapa1 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 1.png";
import cofreEtapa2 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 2.png";
import cofreEtapa3 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 3.png";
import cofreEtapa4 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 4.png";
import cofreEtapa5 from "../../assets/amongus/COFRE/COFRE ABRIENDOSE ETAPA 5.png";
import cofreAbierto from "../../assets/amongus/COFRE/COFRE ABIERTO.png";
import "../../styles/SpaceStation.css";
import "../../styles/RoomActivityPanel3D.css";

import { MISSION_BRIEFINGS as missionBriefings } from "../constants/curriculumVocabulary";

const getActivityMetadata = (id) => {
  const gameType = ((id - 1) % 5) + 1;
  switch (gameType) {
    case 1: return { icon: "📖", name: "Comic" };
    case 2: return { icon: "🚀", name: "Launch" };
    case 3: return { icon: "🔋", name: "Recovery" };
    case 4: return { icon: "🔧", name: "Repair" };
    case 5: return { icon: "✍️", name: "Writing" };
    default: return { icon: "👾", name: "Game" };
  }
};

// =========================================================================
// REGULADOR DE TAMAÑO / ESCALA EN CÓDIGO PARA EL PORTAL DEL VALLE DE PORTALES
// Cambia este valor para aumentar o reducir el tamaño del espiral en la vista 3D:
// Ejemplos: 1.0 (pequeño), 2.0 (mediano), 3.0 (GRANDE), 4.0 (GIGANTE)
// =========================================================================
export const VALLE_PORTALES_SCALE = 2.3;

const ROOM_ZONES = [
  { id: "bitacora", label: "📋 BITÁCORA", x: 299, y: 238, width: 240, height: 356, color: "#ff007f", transform: "perspective(700px) rotateX(1deg) rotateY(16deg) rotateZ(-0.2deg) skewY(7.6deg)", transformOrigin: "top left" },
  { id: "tabs_dias", label: "📅 TABS DÍAS", x: 408, y: 660, width: 256, height: 145, color: "#00f0ff", transform: "perspective(400px) rotateX(2deg) rotateY(8deg) rotateZ(-3deg) skewX(13deg) skewY(-2deg)", transformOrigin: "center left" },
  { id: "racha", label: "🔥 RACHA", x: 1462, y: 637, width: 148, height: 102, color: "#ff5500", transform: "perspective(1200px) rotateX(14deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)", transformOrigin: "center right" },
  { id: "misiones", label: "🚀 MISIONES", x: 1614, y: 624, width: 270, height: 140, color: "#39ff14", transform: "perspective(1200px) rotateX(14deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)", transformOrigin: "center right" },
  { id: "monedas", label: "🪙 MONEDAS", x: 1912, y: 662, width: 195, height: 122, color: "#ffd700", transform: "perspective(1200px) rotateX(10deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)", transformOrigin: "center right" },
  { id: "vocabulario", label: "🔤 VOCABULARIO", x: 2130, y: 150, width: 380, height: 425, color: "#bf00ff", transform: "perspective(700px) rotateX(0deg) rotateY(-14deg) rotateZ(0deg) skewY(-4deg)", transformOrigin: "top left" },
  { id: "valle_portales", label: "🌀 ESPIRAL VALLE DE PORTALES", x: 1180, y: 220, width: 260, height: 260, color: "#f72585" },
  { id: "avatar", label: "👤 AVATAR (PERSONAJE + PET + PLACA)", x: 600, y: 190, width: 850, height: 1090, color: "#ffff00" },
  { id: "cofre", label: "🎁 COFRE TIENDA", x: 145, y: 810, width: 640, height: 640, color: "#ff00aa" },
  { id: "robot", label: "🤖 ROBOT SPARKY", x: 1680, y: 738, width: 750, height: 750, color: "#00ffaa" }
];

export function RoomActivityPanel3D({
  user,
  joinedRoom,
  activities,
  completedList,
  selectedDay,
  setSelectedDay,
  token,
  onActivityComplete,
  onUserUpdated,
  onStartGame,
  onToggleViewMode,
  onOpenStore,
  onOpenInventory,
  onOpenRank,
  onOpenEval,
  onOpenVallePortales,
  onLogout
}) {
  const [sparkyPhrase, setSparkyPhrase] = useState("¡Buen trabajo, recluta! Continúa con la misión.");
  const [showCalibrator, setShowCalibrator] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'bitacora' | 'misiones' | 'vocabulario' | 'racha' | 'monedas'
  const [dayPage, setDayPage] = useState(0); // 0 = D1-D4, 1 = D5-D8, 2 = D9-D10
  const [isPortalHovered, setIsPortalHovered] = useState(false);
  const [activeRunnerDay, setActiveRunnerDay] = useState(null);

  const getDayLockStatus = (dayNum) => {
    if (dayNum === 1) return { isUnlocked: true };

    const unlockedDays = joinedRoom?.unlocked_days || [1];
    if (unlockedDays.includes(dayNum)) {
      return { isUnlocked: true };
    }

    return {
      isUnlocked: false,
      reason: `El docente aún no ha desbloqueado la misión del Día ${dayNum} para este salón.`
    };
  };

  // COFRE ANIMATION STATES
  const cofreFrames = [
    cofreCerrado,
    cofreEtapa1,
    cofreEtapa2,
    cofreEtapa3,
    cofreEtapa4,
    cofreEtapa5,
    cofreAbierto
  ];
  const [cofreFrameIndex, setCofreFrameIndex] = useState(0);
  const [isOpeningCofre, setIsOpeningCofre] = useState(false);

  const handleCofreClick = (e) => {
    if (e) e.stopPropagation();
    if (isOpeningCofre || showCalibrator) return;

    soundFx.playClick();
    setIsOpeningCofre(true);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step < cofreFrames.length) {
        setCofreFrameIndex(step);
      } else {
        clearInterval(interval);
        if (onOpenStore) onOpenStore();
        setTimeout(() => {
          setCofreFrameIndex(0);
          setIsOpeningCofre(false);
        }, 300);
      }
    }, 85);
  };

  // NATURAL ROBOT TALKING SEQUENCE (eyes open mouth toggle + occasional blink)
  const talkingSequence = [
    sparkyOpenClosed, // 0. Ojos abiertos - Boca cerrada (Reposo / Sílaba cerrada)
    sparkyOpenOpen,   // 1. Ojos abiertos - Boca abierta (Hablando)
    sparkyOpenClosed, // 2. Ojos abiertos - Boca cerrada
    sparkyOpenOpen,   // 3. Ojos abiertos - Boca abierta
    sparkyOpenClosed, // 4. Ojos abiertos - Boca cerrada
    sparkyOpenOpen,   // 5. Ojos abiertos - Boca abierta
    sparkyClosedClosed,// 6. Parpadeo natural (Ojos cerrados - Boca cerrada)
    sparkyOpenOpen    // 7. Ojos abiertos - Boca abierta
  ];

  const [seqIndex, setSeqIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTalking, setIsTalking] = useState(false);

  const sparkyPhrases = [
    "¡Buen trabajo, recluta! Continúa con la misión.",
    "Focus, recruit! You can do it!",
    "Great job! La constancia te llevará a la victoria.",
    "¡La base espacial cuenta con tus habilidades!",
    "¿Buscando accesorios? ¡Haz clic en el cofre para abrir la Tienda!",
    "¡Explora la Bitácora a tu izquierda para revisar el tema del día!",
    "Remember: Practice makes perfect. Keep up the great work!",
    "¡Completa las actividades diarias para ganar XP y Monedas!"
  ];

  const changeRobotPhrase = (isUserAction = false) => {
    if (isUserAction) {
      soundFx.playClick();
    }
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * sparkyPhrases.length);
    } while (sparkyPhrases[nextIndex] === sparkyPhrase && sparkyPhrases.length > 1);
    setSparkyPhrase(sparkyPhrases[nextIndex]);
  };

  const handleRobotClick = (e) => {
    if (e) e.stopPropagation();
    changeRobotPhrase(true);
  };

  // 1. Phrase Rotation Timer (Every 12 seconds - SILENT, paused while game runner is open)
  useEffect(() => {
    if (activeRunnerDay) return;
    const intervalId = setInterval(() => {
      changeRobotPhrase(false);
    }, 12000);
    return () => clearInterval(intervalId);
  }, [sparkyPhrase, activeRunnerDay]);

  // 2. Typewriter Effect + Frame Switching Animation
  useEffect(() => {
    let charIndex = 0;
    setDisplayedText("");
    setIsTalking(true);

    const textInterval = setInterval(() => {
      if (charIndex < sparkyPhrase.length) {
        setDisplayedText(sparkyPhrase.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(textInterval);
        setIsTalking(false);
        setSeqIndex(0); // Return to idle open-eyes closed-mouth frame (Index 0)
      }
    }, 42);

    const frameInterval = setInterval(() => {
      if (charIndex < sparkyPhrase.length) {
        setSeqIndex((prev) => (prev + 1) % talkingSequence.length);
      } else {
        clearInterval(frameInterval);
      }
    }, 170); // 170ms cadence for smooth, natural speech movement

    return () => {
      clearInterval(textInterval);
      clearInterval(frameInterval);
    };
  }, [sparkyPhrase]);

  const dayActivities = activities.filter(act => act.day_num === selectedDay);





  const runnerActivities = useMemo(() => {
    if (!activeRunnerDay || !activities) return [];
    return activities.filter(act => act.day_num === activeRunnerDay);
  }, [activities, activeRunnerDay]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100dvh", minHeight: "100vh", background: "#020108", overflow: "hidden", zIndex: 100 }}>

      {/* TOP HUD BAR */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <RecluteHUD
          user={user}
          onOpenStore={onOpenStore}
          onOpenRank={onOpenRank}
          onOpenEval={onOpenEval}
          onOpenInventory={onOpenInventory}
          onLogout={onLogout}
          onToggleViewMode={onToggleViewMode}
          is3DView={true}
        />
      </div>

      {/* ONBOARDING & TUTORIAL SYSTEM MODAL */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          localStorage.setItem("basescrib_onboarding_completed", "true");
          setShowOnboarding(false);
        }}
      />



      {/* HOLOGRAPHIC ZOOM DETAIL MODAL */}
      {activeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100dvh",
            minHeight: "100vh",
            background: "rgba(2, 6, 18, 0.82)",
            backdropFilter: "blur(12px)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(8px, 1.5vh, 20px)"
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, rgba(10, 25, 50, 0.96) 0%, rgba(5, 12, 28, 0.98) 100%)",
              border: "2px solid #2ec4b6",
              borderRadius: "24px",
              padding: "clamp(16px, 2.5vh, 28px) clamp(16px, 3vw, 32px)",
              maxWidth: "650px",
              width: "95%",
              maxHeight: "min(92vh, 92dvh)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              minHeight: 0,
              color: "#e6f7ff",
              boxShadow: "0 0 60px rgba(46, 196, 182, 0.5), inset 0 0 30px rgba(46, 196, 182, 0.2)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: "absolute",
                top: 18,
                right: 22,
                background: "#f72585",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: 36,
                height: 36,
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(247, 37, 133, 0.6)"
              }}
            >
              ✖
            </button>

            {/* BITACORA MODAL CONTENT */}
            {activeModal === "bitacora" && (
              <div>
                <h2 style={{ margin: "0 0 16px 0", color: "#ffd166", fontSize: "24px", display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid rgba(255,209,102,0.4)", paddingBottom: "10px" }}>
                  📋 MISIÓN DÍA {selectedDay} (BITÁCORA DE A BORDO)
                </h2>
                <div style={{ margin: "16px 0", fontSize: "17px", lineHeight: "1.6", color: "#e6f7ff" }}>
                  <strong style={{ color: "#2ec4b6", fontSize: "18px" }}>Objetivo Principal:</strong>
                  <p style={{ marginTop: 6, background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: "12px", borderLeft: "4px solid #2ec4b6" }}>
                    {missionBriefings[selectedDay]?.objective}
                  </p>
                </div>
                <div style={{ margin: "16px 0", fontSize: "17px", lineHeight: "1.6" }}>
                  <strong style={{ color: "#ffd166", fontSize: "18px" }}>Enfoque Gramatical:</strong>
                  <p style={{ marginTop: 6, color: "#b8fff9", background: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: "12px", borderLeft: "4px solid #ffd166" }}>
                    {missionBriefings[selectedDay]?.grammar}
                  </p>
                </div>
              </div>
            )}

            {/* MISIONES MODAL CONTENT */}
            {activeModal === "misiones" && (() => {
              const lockStatus = getDayLockStatus(selectedDay);
              const stages = [
                { icon: "🛠️", name: "Ship Repair", type: "Vocabulary", desc: "Diagnostic technical checks and space vocabulary matching." },
                { icon: "⚡", name: "Sentence Launch", type: "Grammar", desc: "Build and align space sentence grammar structures." },
                { icon: "📖", name: "Comic Reading", type: "Reading", desc: "Read interactive mission log panels and answer comprehension questions." },
                { icon: "🛰️", name: "Word Recovery", type: "Listening", desc: "Audio frequency tuning and vocabulary word recovery." },
                { icon: "✍️", name: "Writing Lab", type: "Writing", desc: "Compose the mission report for teacher review." }
              ];

              return (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <h2 style={{ margin: "0 0 16px 0", color: "#2ec4b6", fontSize: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderBottom: "2px solid rgba(46, 196, 182, 0.4)", paddingBottom: "10px" }}>
                    🚀 DAY {selectedDay} MISSION & BRIEFING
                  </h2>
                  <p style={{ fontSize: "15px", color: "#e6f7ff", lineHeight: "1.5", margin: "10px 0 18px 0" }}>
                    In this mission you will complete 5 continuous stages in pedagogical sequence:
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "20px" }}>
                    {stages.map((st, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(46, 196, 182, 0.3)",
                          borderRadius: "12px",
                          padding: "12px",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "20px" }}>{st.icon}</span>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "bold", color: "#ffd166" }}>Stage {idx + 1}: {st.type}</div>
                            <div style={{ fontSize: "12px", color: "#9be6df" }}>{st.name}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: "11px", color: "#b8fff9", opacity: 0.85, lineHeight: "1.3" }}>
                          {st.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  {lockStatus.isUnlocked ? (
                    <div style={{ background: "rgba(46, 196, 182, 0.12)", border: "1.5px dashed #2ec4b6", borderRadius: "18px", padding: "20px", margin: "10px 0" }}>
                      <p style={{ fontSize: "13px", color: "#b8fff9", margin: "0 0 14px 0" }}>
                        💡 <strong>Grading Mechanics:</strong> Graded 0 to 20 with deductions for incorrect attempts. The final Writing report is submitted to the teacher.
                      </p>
                      <button
                        onClick={() => {
                          setActiveModal(null);
                          setActiveRunnerDay(selectedDay);
                        }}
                        style={{
                          width: "100%",
                          padding: "16px 28px",
                          background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                          border: "none",
                          borderRadius: "16px",
                          color: "#0d1b2a",
                          fontWeight: "900",
                          fontSize: "1.15rem",
                          cursor: "pointer",
                          boxShadow: "0 0 25px rgba(255, 209, 102, 0.6)"
                        }}
                      >
                        🚀 START DAY {selectedDay} MISSION! ➔
                      </button>
                    </div>
                  ) : (
                    <div style={{ background: "rgba(239, 68, 68, 0.12)", border: "1.5px solid #ef4444", borderRadius: "18px", padding: "20px", margin: "10px 0" }}>
                      <span style={{ fontSize: "2.4rem", display: "block", marginBottom: "8px" }}>🔒</span>
                      <h3 style={{ color: "#ef4444", margin: "0 0 8px 0" }}>DAY LOCKED BY COOLDOWN</h3>
                      <p style={{ fontSize: "14px", color: "#fca5a5", fontWeight: "bold", margin: 0 }}>
                        {lockStatus.reason}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* VOCABULARIO MODAL CONTENT */}
            {activeModal === "vocabulario" && (
              <div>
                <h2 style={{ margin: "0 0 16px 0", color: "#9be6df", fontSize: "24px", display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid rgba(155, 230, 223, 0.4)", paddingBottom: "10px" }}>
                  🔤 VOCABULARIO CLAVE DÍA {selectedDay}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "20px 0", maxHeight: "360px", overflowY: "auto" }}>
                  {missionBriefings[selectedDay]?.vocabulary.map((vocab, idx) => (
                    <div key={idx} style={{ background: "rgba(255, 255, 255, 0.08)", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(155, 230, 223, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "16px", color: "#ffffff" }}>{vocab.en}</strong>
                      <span style={{ fontSize: "15px", color: "#ffd166", fontWeight: "bold" }}>{vocab.es}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RACHA MODAL CONTENT */}
            {activeModal === "racha" && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <h2 style={{ margin: "0 0 16px 0", color: "#ff6b6b", fontSize: "26px" }}>
                  🔥 RACHA ESPACIAL: {user?.streak_count || 0} DÍAS SEGUIDOS
                </h2>
                <p style={{ fontSize: "17px", color: "#e6f7ff", lineHeight: "1.6" }}>
                  ¡Mantén tu racha diaria completando al menos 1 actividad cada día para desbloquear recompensas cósmicas exclusivas!
                </p>
              </div>
            )}

            {/* MONEDAS MODAL CONTENT */}
            {activeModal === "monedas" && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <h2 style={{ margin: "0 0 16px 0", color: "#ffd166", fontSize: "26px" }}>
                  🪙 BALANCE DE MONEDAS: {user?.coins || 0} CRÉDITOS
                </h2>
                <p style={{ fontSize: "17px", color: "#e6f7ff", lineHeight: "1.6" }}>
                  ¡Gana más monedas completando misiones para comprar skins, gafas de colores y mascotas en la Tienda Espacial!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SVG CANVAS CONTAINER: STRICT 2560 x 1440 CANVAS */}
      <svg
        viewBox="0 0 2560 1440"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible"
        }}
      >
        {/* 1. BACKGROUND IMAGE 2560x1440 */}
        <image
          href={naveDentroImage}
          xlinkHref={naveDentroImage}
          x="0"
          y="0"
          width="2560"
          height="1440"
        />

        {/* 2. AVATAR EN EL SUELO (TAPETE BASE ONE ENTRADA) - POSICIÓN Y TAMAÑO EXACTO */}
        <foreignObject x="750" y="450" width="850" height="860" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-avatar-wrapper"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              transform: "scale(3.1)",
              transformOrigin: "bottom center",
              pointerEvents: "none",
              position: "relative"
            }}
          >
            {/* AVATAR SHOWCASE VISUAL EN SU TAMAÑO ORIGINAL */}
            <div style={{ pointerEvents: "none", position: "relative" }}>
              <AvatarShowcase
                outfitId={user?.selected_outfit || "m_base"}
                petId={user?.equipped_pet || localStorage.getItem("basescrib_equipped_pet") || "pet_alien_blue"}
                suitColor={user?.suit_color || "#2ec4b6"}
                visorColor={user?.visor_color || "#a3e2f7"}
                accessory={user?.accessory || "none"}
                basePlatform={user?.base_platform || "none"}
                decal={user?.decal || "none"}
                gender={user?.gender || (user?.selected_outfit?.startsWith("m_") ? "male" : "female")}
                size="large"
                transparent={true}
              />
            </div>

            {/* HITBOX INVISIBLE INDEPENDIENTE SOLO EN EL CENTRO DEL CUERPO DEL AVATAR */}
            <div
              className="mapped-avatar-hitbox"
              onClick={() => { soundFx.playClick(); if (onOpenInventory) onOpenInventory(); }}
              title="¡Haz Clic en tu Avatar para abrir tu Inventario y Armario!"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90px",
                height: "180px",
                cursor: "pointer",
                pointerEvents: "auto",
                zIndex: 10
              }}
            />
          </div>
        </foreignObject>

        {/* 3. COFRE INTERACTIVO DE LA TIENDA - POSICIÓN Y TAMAÑO EXACTO */}
        <foreignObject x="145" y="810" width="640" height="640" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              pointerEvents: "none",
              position: "relative"
            }}
          >
            {/* IMAGEN DEL COFRE EN SU TAMAÑO ORIGINAL */}
            <img
              src={cofreFrames[cofreFrameIndex]}
              alt="Cofre de la Tienda Espacial"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "bottom center",
                filter: isOpeningCofre ? "drop-shadow(0 0 35px #ffd166)" : "drop-shadow(0 0 15px rgba(255, 209, 102, 0.7))",
                transition: "filter 0.2s ease, transform 0.2s ease",
                transform: isOpeningCofre ? "scale(1.08)" : "scale(1)",
                transformOrigin: "bottom center",
                pointerEvents: "none"
              }}
            />

            {/* HITBOX INVISIBLE INDEPENDIENTE SOLO EN EL CUERPO DEL COFRE */}
            <div
              onClick={handleCofreClick}
              title="¡Haz Clic para Abrir el Cofre y Entrar a la Tienda!"
              style={{
                position: "absolute",
                bottom: "0px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "380px",
                height: "300px",
                cursor: "pointer",
                pointerEvents: "auto",
                zIndex: 10
              }}
            />
          </div>
        </foreignObject>

        {/* 4. ROBOT SPARKY (ANIMADO NOVELA VISUAL + BUBBLE HABLA) */}
        <foreignObject x="1680" y="738" width="750" height="750" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", pointerEvents: "none" }}>
            <div
              className="robot-speech-bubble"
              style={{
                position: "absolute",
                top: "180px",
                left: "50px",
                width: "fit-content",
                maxWidth: "300px",
                height: "fit-content",
                fontSize: "20px",
                pointerEvents: "none",
                lineHeight: "1.4",
                boxSizing: "border-box",
                zIndex: 10
              }}
            >
              {displayedText}
              {isTalking && <span style={{ color: "#2ec4b6", fontWeight: "bold", animation: "blink 0.6s infinite" }}>|</span>}
            </div>

            <img
              src={talkingSequence[seqIndex]}
              alt="Robot Sparky Hablando"
              onClick={handleRobotClick}
              title="¡Haz Clic en Sparky para escuchar un consejo espacial!"
              style={{
                position: "absolute",
                top: "110px",
                left: "210px",
                width: "495px",
                height: "495px",
                objectFit: "contain",
                filter: isTalking ? "drop-shadow(0 0 25px rgba(46, 196, 182, 0.9))" : "drop-shadow(0 0 16px rgba(46, 196, 182, 0.7))",
                cursor: "pointer",
                pointerEvents: "auto",
                transition: "filter 0.2s ease, transform 0.15s ease"
              }}
            />
          </div>
        </foreignObject>

        {/* 5. ESPIRAL DEL VALLE DE PORTALES (CAPA FRONTAL TOP PARA NUNCA SER TAPADO) */}
        <foreignObject x="1470" y="290" width="300" height="300" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}
          >
            <div
              className="mapped-portal-gateway-hitbox"
              data-tour="portals-button"
              onClick={(e) => {
                e.stopPropagation();
                if (!showCalibrator) {
                  soundFx.playWarp();
                  if (onOpenVallePortales) onOpenVallePortales();
                }
              }}
              onMouseEnter={() => {
                setIsPortalHovered(true);
                soundFx.playWarp();
              }}
              onMouseLeave={() => setIsPortalHovered(false)}
              title="¡Haz Clic en el Espiral para viajar al Valle de Portales!"
              style={{
                cursor: "pointer",
                pointerEvents: "auto",
                borderRadius: "50%",
                padding: "10px",
                filter: isPortalHovered ? "drop-shadow(0 0 25px rgba(247, 37, 133, 0.95))" : "drop-shadow(0 0 10px rgba(247, 37, 133, 0.35))",
                opacity: isPortalHovered ? 1.0 : 0.88,
                transition: "filter 0.3s ease, opacity 0.3s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <PortalGateway
                onOpen={() => {
                  soundFx.playWarp();
                  if (onOpenVallePortales) onOpenVallePortales();
                }}
                scale={VALLE_PORTALES_SCALE}
                showLabel={false}
                is3D={true}
                isHovered={isPortalHovered}
              />
            </div>
          </div>
        </foreignObject>

        {/* 6. CONSOLAS DE PANTALLAS INTERACTIVAS (RENDERIZADAS EN LA CAPA SUPERIOR SUPERIOR DEL SVG PARA NUNCA SER TAPADAS) */}
        {/* BITACORA (Pared Izquierda) */}
        <foreignObject x="299" y="238" width="240" height="356" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-wall-left"
            onClick={(e) => {
              e.stopPropagation();
              if (!showCalibrator) setActiveModal("bitacora");
            }}
            title="Haz Clic para Expandir la Bitácora"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "top left",
              transform: "perspective(700px) rotateX(1deg) rotateY(16deg) rotateZ(-0.2deg) skewY(7.6deg)",
              background: "rgba(10, 25, 45, 0.92)",
              borderRadius: "14px",
              padding: "12px",
              border: "1.5px solid rgba(46, 196, 182, 0.6)",
              boxShadow: "inset 0 0 15px rgba(184, 255, 249, 0.3), 0 0 20px rgba(46, 196, 182, 0.4)",
              cursor: "pointer",
              pointerEvents: "auto"
            }}
          >
            <div className="bitacora-content">
              {missionBriefings[selectedDay] ? (
                <>
                  <h4 style={{ margin: "0 0 6px 0", color: "#ffd166", fontSize: "22px", borderBottom: "1px solid rgba(255,209,102,0.4)", paddingBottom: "4px" }}>
                    📋 MISIÓN DÍA {selectedDay}
                  </h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "20px", lineHeight: "1.3", color: "#e6f7ff" }}>
                    {missionBriefings[selectedDay].objective}
                  </p>
                  <span style={{ color: "#9be6df", fontWeight: "bold", fontSize: "18px" }}>Gramática:</span>
                  <p style={{ margin: "3px 0 0 0", color: "#b8fff9", fontSize: "20px", lineHeight: "1.3" }}>
                    {missionBriefings[selectedDay].grammar}
                  </p>
                </>
              ) : (
                <div style={{ textAlign: "center", marginTop: "15%" }}>
                  <h4 style={{ color: "#ffd166", fontSize: "14px" }}>Misión Día {selectedDay}</h4>
                </div>
              )}
            </div>
          </div>
        </foreignObject>

        {/* TABS DIAS (Consola Izquierda - BASE ONE - 2x2 GRID CON NAVEGACIÓN) */}
        <foreignObject x="408" y="660" width="256.5" height="145" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-console-left"
            data-tour="day-selector"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center left",
              transform: "perspective(400px) rotateX(2deg) rotateY(8deg) rotateZ(-3deg) skewX(13deg) skewY(-2deg)",
              pointerEvents: "auto",
              padding: "4px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%", gap: "4px" }}>
              {/* BOTÓN FLECHA IZQUIERDA (VOLVER) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  setDayPage((prev) => (prev > 0 ? prev - 1 : 3));
                }}
                title="Ver días anteriores"
                style={{
                  width: "28px",
                  height: "100%",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, rgba(46, 196, 182, 0.3), rgba(15, 76, 92, 0.4))",
                  border: "1.5px solid #2ec4b6",
                  color: "#9be6df",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 8px rgba(46, 196, 182, 0.5)",
                  flexShrink: 0,
                  pointerEvents: "auto"
                }}
              >
                ◀
              </button>

              {/* 2x2 GRID DE 4 BOTONES GRANDES */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "4px", flex: 1, height: "100%" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
                  .slice(dayPage * 4, (dayPage + 1) * 4)
                  .map((dayNum) => (
                    <button
                      key={dayNum}
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playClick();
                        setSelectedDay(dayNum);
                      }}
                      className={`day-btn-3d ${selectedDay === dayNum ? "active" : ""}`}
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        borderRadius: "6px",
                        background: selectedDay === dayNum ? "linear-gradient(135deg, #2ec4b6, #0f4c5c)" : "rgba(10, 25, 45, 0.9)",
                        border: selectedDay === dayNum ? "2px solid #b8fff9" : "1.5px solid rgba(46, 196, 182, 0.5)",
                        color: selectedDay === dayNum ? "#ffffff" : "#9be6df",
                        boxShadow: selectedDay === dayNum ? "0 0 15px rgba(46, 196, 182, 0.9)" : "inset 0 0 8px rgba(46,196,182,0.3)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "auto"
                      }}
                    >
                      D{dayNum}
                    </button>
                  ))}
              </div>

              {/* BOTÓN FLECHA DERECHA (AVANZAR) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  setDayPage((prev) => (prev + 1) % 4);
                }}
                title="Ver siguientes días"
                style={{
                  width: "28px",
                  height: "100%",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, rgba(255, 209, 102, 0.3), rgba(247, 37, 133, 0.3))",
                  border: "1.5px solid #ffd166",
                  color: "#ffd166",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 8px rgba(255, 209, 102, 0.5)",
                  flexShrink: 0,
                  pointerEvents: "auto"
                }}
              >
                ▶
              </button>
            </div>
          </div>
        </foreignObject>

        {/* RACHA (Consola Derecha - Monitor Izquierdo) */}
        <foreignObject x="1462" y="637" width="148" height="102" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-console-right-left"
            onClick={(e) => { e.stopPropagation(); if (!showCalibrator) setActiveModal("racha"); }}
            title="Haz Clic para Expandir Racha"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center right",
              transform: "perspective(1200px) rotateX(14deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)",
              cursor: "pointer",
              pointerEvents: "auto"
            }}
          >
            <div className="stat-3d-box">
              <span className="val" style={{ color: "#ff6b6b", fontSize: "38px", fontWeight: "bold", textShadow: "0 0 14px rgba(255,107,107,0.9)" }}>
                🔥 {user?.streak_count || 0}d
              </span>
              <span className="lbl" style={{ fontSize: "16px", color: "#ffffff", fontWeight: "bold" }}>Racha</span>
            </div>
          </div>
        </foreignObject>

        {/* MISIONES (Consola Derecha - Monitor Central) */}
        <foreignObject x="1614" y="624" width="270" height="140" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-console-right-center"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center right",
              transform: "perspective(1200px) rotateX(14deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)",
              pointerEvents: "auto",
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: "900", color: "#2ec4b6", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              🛰️ DAY {selectedDay} MISSION
            </div>

            <div style={{ display: "flex", gap: "8px", width: "100%", height: "78px", marginTop: "4px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (showCalibrator) return;
                  const lockStatus = getDayLockStatus(selectedDay);
                  if (!lockStatus.isUnlocked) {
                    setActiveModal("misiones");
                  } else {
                    setActiveRunnerDay(selectedDay);
                  }
                }}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#0d1b2a",
                  fontWeight: "900",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  boxShadow: "0 0 15px rgba(255, 209, 102, 0.4)",
                  transition: "all 0.15s ease"
                }}
                title="Start today's 5 mission stages"
              >
                <span style={{ fontSize: "20px" }}>🚀</span>
                <span>START MISSION</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!showCalibrator) setActiveModal("misiones");
                }}
                style={{
                  width: "60px",
                  background: "rgba(46, 196, 182, 0.18)",
                  border: "1.5px solid #2ec4b6",
                  borderRadius: "10px",
                  color: "#9be6df",
                  fontWeight: "bold",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  transition: "all 0.2s"
                }}
                title="Ver detalles de los 5 juegos"
              >
                <span style={{ fontSize: "18px" }}>ℹ️</span>
                <span>INFO</span>
              </button>
            </div>
          </div>
        </foreignObject>

        {/* MONEDAS (Consola Derecha - Monitor Derecho) */}
        <foreignObject x="1912" y="662" width="195" height="122" style={{ overflow: "visible", pointerEvents: "none" }}>
          <div
            className="mapped-screen mapped-console-right-right"
            onClick={(e) => { e.stopPropagation(); if (!showCalibrator) setActiveModal("monedas"); }}
            title="Haz Clic para Ver Monedas"
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center right",
              transform: "perspective(1200px) rotateX(10deg) rotateY(-18deg) rotateZ(5deg) skewY(2.8deg)",
              cursor: "pointer",
              pointerEvents: "auto"
            }}
          >
            <div className="stat-3d-box">
              <span className="val" style={{ color: "#ffd166", fontSize: "38px", fontWeight: "bold", textShadow: "0 0 14px rgba(255,209,102,0.9)" }}>
                🪙 {user?.coins || 0}
              </span>
              <span className="lbl" style={{ fontSize: "16px", color: "#ffffff", fontWeight: "bold" }}>Monedas</span>
            </div>
          </div>
        </foreignObject>

        {/* VOCABULARIO CLAVE (Panel Superior Derecho) */}
        {missionBriefings[selectedDay] && (
          <foreignObject x="2000" y="150" width="380" height="425" style={{ overflow: "hidden", pointerEvents: "none" }}>
            <div
              className="mapped-screen mapped-vocab-right"
              onClick={(e) => { e.stopPropagation(); if (!showCalibrator) setActiveModal("vocabulario"); }}
              title="Haz Clic para Expandir Vocabulario Clave"
              style={{
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                transformOrigin: "top left",
                transform: "perspective(700px) rotateX(0deg) rotateY(-14deg) rotateZ(0deg) skewY(-4deg)",
                cursor: "pointer",
                pointerEvents: "auto",
                overflow: "hidden"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(155,230,223,0.3)",
                paddingBottom: "6px",
                marginBottom: "6px",
                flexShrink: 0
              }}>
                <h4 style={{ margin: 0, color: "#9be6df", fontSize: "17px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>🔤</span> VOCABULARIO CLAVE
                </h4>
                <span style={{ fontSize: "11px", background: "rgba(155,230,223,0.2)", color: "#9be6df", padding: "1px 6px", borderRadius: "8px", fontWeight: "bold" }}>
                  DÍA {selectedDay}
                </span>
              </div>

              <div
                className="vocab-scroll-list"
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  overflowX: "hidden",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  alignContent: "flex-start",
                  paddingRight: "2px"
                }}
              >
                {missionBriefings[selectedDay].vocabulary.map((vocab, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: "13px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(155,230,223,0.2)",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      color: "#e6f7ff",
                      lineHeight: "1.25"
                    }}
                  >
                    <strong style={{ color: "#ffffff" }}>{vocab.en}</strong>{" "}
                    <span style={{ color: "#ffd166" }}>({vocab.es})</span>
                  </span>
                ))}
              </div>

              <div style={{
                paddingTop: "4px",
                marginTop: "3px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
                fontSize: "11px",
                color: "#9be6df",
                opacity: 0.8,
                flexShrink: 0
              }}>
                🔍 Clic para ampliar en pantalla completa
              </div>
            </div>
          </foreignObject>
        )}

        {/* 11. STANDALONE MODULAR CALIBRATOR OVERLAY */}
        <RoomCalibratorTool active={showCalibrator} zones={ROOM_ZONES} />

      </svg>

      {/* SEQUENCED DAILY GAME RUNNER OVERLAY */}
      {activeRunnerDay && (
        <DailyGameRunner
          dayNumber={activeRunnerDay}
          activities={runnerActivities}
          userId={user?.id}
          token={token}
          onStageComplete={(stageNum, xp, coins) => {
            if (onUserUpdated) {
              onUserUpdated(prev => ({
                ...prev,
                xp: (prev?.xp || 0) + xp,
                coins: (prev?.coins || 0) + coins
              }));
            }
          }}
          onFinishAll={(runnerData) => {
            localStorage.setItem(`basescrib_day_${runnerData.dayNumber}_completed_at`, new Date().toISOString());
            setActiveRunnerDay(null);
            if (onActivityComplete) {
              onActivityComplete(1, runnerData.totalXP, runnerData.totalCoins);
            }
          }}
          onClose={() => setActiveRunnerDay(null)}
        />
      )}
    </div>
  );
}

RoomActivityPanel3D.propTypes = {
  user: PropTypes.object,
  activities: PropTypes.array.isRequired,
  completedList: PropTypes.object.isRequired,
  selectedDay: PropTypes.number.isRequired,
  setSelectedDay: PropTypes.func.isRequired,
  token: PropTypes.string,
  onActivityComplete: PropTypes.func,
  onUserUpdated: PropTypes.func,
  onStartGame: PropTypes.func.isRequired,
  onToggleViewMode: PropTypes.func.isRequired,
  onOpenStore: PropTypes.func,
  onOpenInventory: PropTypes.func,
  onOpenRank: PropTypes.func,
  onOpenEval: PropTypes.func,
  onOpenVallePortales: PropTypes.func,
  onLogout: PropTypes.func
};
