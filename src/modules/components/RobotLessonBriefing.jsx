import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { soundFx } from "../utils/soundEffects";

// Sparky Animated Frames
import sparkyOpenOpen from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA ABIERTA.png";
import sparkyOpenClosed from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA CERRADA.png";
import sparkyClosedOpen from "../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS CERRADOS - BOCA ABIERTA.png";

export const ROBOT_DAILY_LESSONS = {
  1: {
    title: "Misión Día 1: Identidad y Habilidades",
    topic: "Verb to Be & Modal 'Can'",
    robotIntro: "¡Saludos, cadete! Soy Sparky, tu asistente de vuelo IA. Antes de que entres a los módulos de hoy, aquí tienes la lección esencial:",
    rules: [
      {
        formula: "VERB TO BE: I am...",
        explanation: "Utilizamos 'I am' (verbo to be) para señalar quiénes somos, de dónde venimos o cómo nos sentimos.",
        example: '🎯 "I am a recruit on BaseScrib."',
        translation: '(Español: "Yo soy un recluta en BaseScrib.")'
      },
      {
        formula: "MODAL 'CAN': I can...",
        explanation: "Utilizamos 'I can' (¡yo puedo!) para indicar nuestras habilidades y capacidades técnicas en la nave.",
        example: '🎯 "I can repair the engine and write reports."',
        translation: '(Español: "Yo puedo reparar el motor y redactar informes.")'
      }
    ],
    hint: "💡 Tip de Sparky: Recuerda la conjugación básica: I am (yo soy), He/She is (él/ella es), We are (nosotros somos)."
  },
  2: {
    title: "Misión Día 2: Explorando la Nave",
    topic: "There is / There are (Existencia)",
    robotIntro: "¡Bienvenido a la cabina! Hoy aprenderás a reportar los equipos y suministros presentes en los módulos:",
    rules: [
      {
        formula: "SINGULAR: There is...",
        explanation: "Para indicar la existencia de un solo objeto o persona (singular).",
        example: '🎯 "There is a computer in the study room."',
        translation: '(Español: "Hay una computadora en la sala de estudio.")'
      },
      {
        formula: "PLURAL: There are...",
        explanation: "Para indicar la existencia de dos o más objetos o personas (plural).",
        example: '🎯 "There are three sensors in the cabin."',
        translation: '(Español: "Hay tres sensores en la cabina.")'
      }
    ],
    hint: "💡 Tip de Sparky: Usa 'There is a...' para 1 elemento y 'There are [número/plural]...' para varios."
  },
  3: {
    title: "Misión Día 3: Rutinas en el Espacio",
    topic: "Present Simple & Daily Routines",
    robotIntro: "¡Buenos días, tripulante! Hoy coordinaremos los horarios y tareas de toda la estación:",
    rules: [
      {
        formula: "I / You / We / They + Verbo base",
        explanation: "Para acciones que realizas habitualmente en tu jornada.",
        example: '🎯 "I study English every day at 4:00 p.m."',
        translation: '(Español: "Estudio inglés todos los días a las 4:00 p.m.")'
      },
      {
        formula: "He / She / It + Verbo + -s / -es",
        explanation: "En tercera persona, debes añadir -s o -es al final del verbo.",
        example: '🎯 "The Trainer cleans the shield panels every morning."',
        translation: '(Español: "El Entrenador limpia los paneles cada mañana.")'
      }
    ],
    hint: "💡 Tip de Sparky: ¡No olvides agregar la 's' final en los verbos cuando hables de He o She!"
  }
};

export function RobotLessonBriefing({
  dayNumber = 1,
  isOpen = false,
  onClose,
  onLaunchStage
}) {
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = [sparkyOpenClosed, sparkyOpenOpen, sparkyClosedOpen, sparkyOpenOpen];

  // Animated talking mouth/blink
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, 180);
    return () => clearInterval(timer);
  }, [isOpen, frames.length]);

  if (!isOpen) return null;

  const lesson = ROBOT_DAILY_LESSONS[dayNumber] || {
    title: `Misión Día ${dayNumber}`,
    topic: "Entrenamiento Diario BaseScrib",
    robotIntro: "¡Concentración, cadete! Repasa la regla clave del día para completar con éxito los 5 módulos:",
    rules: [
      {
        formula: "Estructura Clave",
        explanation: "Analiza el sujeto, verbo y complemento en cada oración.",
        example: '🎯 "Practice makes perfect on BaseScrib."',
        translation: '(Español: "La práctica hace al maestro en BaseScrib.")'
      }
    ],
    hint: "💡 Tip de Sparky: Lee con atención cada consigna antes de responder."
  };

  const handleConfirm = () => {
    soundFx.playWarp?.() || soundFx.playClick?.();
    if (onLaunchStage) {
      onLaunchStage();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(2, 6, 18, 0.88)",
        backdropFilter: "blur(12px)",
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, rgba(8, 20, 42, 0.98) 0%, rgba(4, 10, 24, 0.99) 100%)",
          border: "2px solid #00f0ff",
          borderRadius: "24px",
          maxWidth: "620px",
          width: "100%",
          padding: "28px 24px",
          color: "#e6f7ff",
          boxShadow: "0 0 60px rgba(0, 240, 255, 0.35)",
          position: "relative",
          textAlign: "left",
          animation: "fadeIn 0.3s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={() => { soundFx.playClick?.(); onClose(); }}
            style={{
              position: "absolute",
              top: 14,
              right: 16,
              background: "rgba(239, 68, 68, 0.2)",
              border: "1.5px solid #ef4444",
              color: "#fca5a5",
              borderRadius: "50%",
              width: 32,
              height: 32,
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        )}

        {/* Robot Header Row */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px", borderBottom: "1.5px solid rgba(0, 240, 255, 0.2)", paddingBottom: "14px" }}>
          <div style={{ position: "relative", width: "72px", height: "72px", flexShrink: 0 }}>
            <img
              src={frames[frameIndex]}
              alt="Sparky Robot Tutor"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 0 12px rgba(0, 240, 255, 0.6))"
              }}
            />
          </div>
          <div>
            <span style={{ color: "#ffd166", textTransform: "uppercase", fontSize: "0.76rem", fontWeight: "900", letterSpacing: "1px" }}>
              🤖 LECCIÓN PEDAGÓGICA DE SPARKY • DÍA {dayNumber}
            </span>
            <h2 style={{ margin: "2px 0 0 0", color: "#00f0ff", fontSize: "1.35rem", fontWeight: "800" }}>
              {lesson.title}
            </h2>
            <span style={{ color: "#9be6df", fontSize: "0.82rem" }}>
              Tema gramatical: <strong>{lesson.topic}</strong>
            </span>
          </div>
        </div>

        {/* Robot speech bubble intro */}
        <div style={{
          background: "rgba(0, 240, 255, 0.08)",
          border: "1.5px solid rgba(0, 240, 255, 0.3)",
          borderRadius: "14px",
          padding: "10px 14px",
          fontSize: "0.88rem",
          color: "#e6f7ff",
          lineHeight: "1.4",
          marginBottom: "16px"
        }}>
          💬 <em>{lesson.robotIntro}</em>
        </div>

        {/* Rules & Examples Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
          {lesson.rules.map((rule, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(0, 0, 0, 0.45)",
                border: "1.5px solid rgba(255, 209, 102, 0.3)",
                borderRadius: "14px",
                padding: "12px 14px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ color: "#ffd166", fontWeight: "900", fontSize: "0.88rem" }}>
                  {rule.formula}
                </span>
              </div>
              <p style={{ margin: "0 0 6px 0", color: "#cbd5e1", fontSize: "0.84rem", lineHeight: "1.3" }}>
                {rule.explanation}
              </p>
              <div style={{
                background: "rgba(46, 196, 182, 0.15)",
                borderLeft: "3px solid #2ec4b6",
                padding: "6px 10px",
                borderRadius: "6px"
              }}>
                <div style={{ color: "#b8fff9", fontWeight: "bold", fontSize: "0.92rem" }}>
                  {rule.example}
                </div>
                <div style={{ color: "#94a3b8", fontSize: "0.78rem", fontStyle: "italic" }}>
                  {rule.translation}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sparky Hint */}
        <div style={{ fontSize: "0.8rem", color: "#ffd166", background: "rgba(255, 209, 102, 0.08)", padding: "8px 12px", borderRadius: "10px", marginBottom: "20px", border: "1px dashed rgba(255, 209, 102, 0.3)" }}>
          {lesson.hint}
        </div>

        {/* Launch Button */}
        <button
          onClick={handleConfirm}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #00f0ff 0%, #2ec4b6 100%)",
            border: "none",
            borderRadius: "14px",
            color: "#02121e",
            fontWeight: "900",
            fontSize: "1.05rem",
            cursor: "pointer",
            letterSpacing: "0.5px",
            boxShadow: "0 0 25px rgba(0, 240, 255, 0.5)",
            transition: "all 0.2s ease"
          }}
        >
          ¡ENTENDIDO, A LA MISIÓN! 🚀
        </button>
      </div>
    </div>
  );
}

RobotLessonBriefing.propTypes = {
  dayNumber: PropTypes.number,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onLaunchStage: PropTypes.func
};

export default RobotLessonBriefing;
