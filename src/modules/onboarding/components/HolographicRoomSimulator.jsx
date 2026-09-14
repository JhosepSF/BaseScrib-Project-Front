import React, { useState } from "react";
import PropTypes from "prop-types";
import bgRoom2D from "../../../assets/cinematicas/bg_simulador_baseone.png";
import sparkyAvatar from "../../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA ABIERTA.png";
import { soundFx } from "../../utils/soundEffects";
import "../styles/HolographicRoomSimulator.css";

export default function HolographicRoomSimulator({ onFinishTour, onSkipTour }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: "hud",
      titleES: "🧑‍🚀 Barra de Menú y Estadísticas (HUD)",
      titleEN: "Recruit Identity & Cockpit HUD",
      es: "Aquí controlarás tu racha diaria de estudio 🔥, tus monedas 🪙 acumuladas, tu XP ⭐ y podrás acceder a la Tienda 🛒, Ranking 🏆 y Evaluaciones 📝.",
      spotlight: { top: "0%", left: "1%", width: "98%", height: "7%" }
    },
    {
      id: "missions",
      titleES: "📌 Bitácora de 14 Días y Mini-juegos",
      titleEN: "14-Day Timeline & Mini-Games",
      es: "¡Cada día abriás un nuevo capítulo! Jugarás el Cómic 📖, Lanzamiento de oraciones 🚀, Recuperación de palabras 🔋, Reparación de nave 🔧 y el Laboratorio de Escritura ✍️.",
      spotlight: { top: "7%", left: "16%", width: "70%", height: "25%" }
    },
    {
      id: "store_chest",
      titleES: "🛒 Cofre de la Tienda & Armario de Skins",
      titleEN: "Outfits, Pets & Animated Frames Chest",
      es: "¡Canjea tus monedas en el Cofre! Podrás equipar Trajes Cyberpunk, Lentes Cibernéticos, Mascotas acompañantes y Marcos de Usuario Animados 🔥⚡🕷️👑.",
      spotlight: { top: "75%", left: "1%", width: "24%", height: "24%" }
    },
    {
      id: "rankings",
      titleES: "🏆 Ranking de la Sala & Evaluaciones",
      titleEN: "Crew Leaderboard & Evaluations",
      es: "Compite por los primeros lugares del salón en tiempo real y demuestra tus habilidades en los exámenes de evaluación de la tripulación.",
      spotlight: { top: "0%", left: "70%", width: "15%", height: "7%" }
    },
    {
      id: "abyss",
      titleES: "🌌 Abismo Cuántico & Vocabulario Clave",
      titleEN: "Quantum Abyss Survival & Vocabulary",
      es: "Supera oleadas infinitas de preguntas rápidas en el Abismo Cuántico y consulta el vocabulario clave para resolver tus misiones diarias.",
      spotlight: { top: "82%", left: "88%", width: "12%", height: "18%" }
    }
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    soundFx.playClick();
    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      soundFx.playCoin();
      if (onFinishTour) onFinishTour();
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="holo-sim-overlay">
      {/* CONTAINER MODAL PRINCIPAL */}
      <div className="holo-sim-modal-container">
        {/* HEADER TOP DE PANTALLA HOLOGRÁFICA (AFUERA DE LA IMAGEN) */}
        <div className="holo-sim-header">
          <div className="holo-sim-title-badge">
            📡 SIMULADOR HOLOGRÁFICO BASE ONE — ENTRENAMIENTO DE CABINA
          </div>
          <button
            className="holo-sim-btn-skip"
            onClick={() => { soundFx.playClick(); if (onSkipTour) onSkipTour(); }}
          >
            Saltar Simulación ✕
          </button>
        </div>

        {/* PANTALLA PRINCIPAL 100% DESPEJADA */}
        <div
          className="holo-sim-screen-card"
          style={{ backgroundImage: `url(${bgRoom2D})` }}
        >
          {/* EFECTO SCANLINES HOLOGRÁFICAS */}
          <div className="holo-sim-scanlines" />

          {/* SPOTLIGHT ILUMINADO DE LA ZONA EXPLICADA */}
          <div
            className="holo-sim-spotlight-box"
            style={step.spotlight}
          />
        </div>

        {/* TARJETA DIÁLOGO DE SPARKY AL PIE (AFUERA DE LA IMAGEN) */}
        <div className="holo-sim-tooltip-card">
          <div className="holo-sim-tooltip-header">
            <img src={sparkyAvatar} alt="Sparky" className="holo-sim-sparky-avatar" />
            <div>
              <h3 className="holo-sim-step-title-es">{step.titleES}</h3>
              <p className="holo-sim-step-title-en">{step.titleEN}</p>
            </div>
          </div>

          <p className="holo-sim-tooltip-text">{step.es}</p>

          <div className="holo-sim-tooltip-footer">
            <span className="holo-sim-step-counter">
              Paso {currentStep + 1} de {steps.length}
            </span>

            <div style={{ display: "flex", gap: 10 }}>
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: 12,
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  ◀ Anterior
                </button>
              )}
              <button className="holo-sim-nav-btn" onClick={handleNext}>
                {currentStep + 1 === steps.length ? "¡Completar Simulación! 🚀" : "Siguiente ➔"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HolographicRoomSimulator.propTypes = {
  onFinishTour: PropTypes.func.isRequired,
  onSkipTour: PropTypes.func
};
