import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import OnboardingModal from "../onboarding/components/OnboardingModal";

export function StudentPanel({
  joinedRoom,
  joinCode,
  setJoinCode,
  joinKey,
  setJoinKey,
  handleJoinRoom,
  loading,
  handleLogout,
  setStep,
}) {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem("onboarding_completed") !== "true";
  });

  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          localStorage.setItem("onboarding_completed", "true");
          setShowOnboarding(false);
        }}
      />

      <div className="glass-console student-panel" style={{ padding: 30 }}>
        <h2 style={{ color: "#b8fff9" }}>Panel estudiante</h2>
        {joinedRoom ? (
          <div className="room-card" style={{ background: "rgba(0,0,0,0.25)", padding: 20, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3>{joinedRoom.name}</h3>
            <p>Código: <code>{joinedRoom.code}</code></p>
            <p>Clave: <code>{joinedRoom.key}</code></p>
            <div className="form-actions">
              <button onClick={() => setStep("in-room")} className="btn-start">Ir a mi room</button>
              <button onClick={handleLogout} className="btn-cancel">Cerrar sesión</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleJoinRoom} className="student-form">
            <label>Código de room</label>
            <input
              required
              className="neon-input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Código proporcionado por tu docente"
            />

            <label>Clave</label>
            <input
              required
              className="neon-input"
              value={joinKey}
              onChange={(e) => setJoinKey(e.target.value)}
              placeholder="Clave proporcionada por tu docente"
            />

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-join">
                {loading ? "Uniéndose..." : "Unirse a room"}
              </button>
              <button type="button" onClick={handleLogout} className="btn-cancel">Cerrar sesión</button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 25, paddingTop: 20, borderTop: "1px solid rgba(184, 255, 249, 0.15)", width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <button 
            onClick={() => setShowOnboarding(true)} 
            className="btn-start" 
            style={{ 
              width: "100%", 
              background: "linear-gradient(135deg, #7000ff, #00f0ff)", 
              color: "#ffffff",
              fontWeight: "bold",
              boxShadow: "0 0 15px rgba(0, 240, 255, 0.4)"
            }}
          >
            🎬 Ver Historia & Entrenamiento Holográfico
          </button>
          
          <button 
            onClick={() => navigate("/avatar")} 
            className="btn-start" 
            style={{ 
              width: "100%", 
              background: "linear-gradient(135deg, #2ec4b6, #1f857b)", 
              color: "#e6f7ff" 
            }}
          >
            🎨 Personalizar mi Recluta 2D
          </button>
        </div>
      </div>
    </>
  );
}
StudentPanel.propTypes = {
  joinedRoom: PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
    key: PropTypes.string,
  }),
  joinCode: PropTypes.string.isRequired,
  setJoinCode: PropTypes.func.isRequired,
  joinKey: PropTypes.string.isRequired,
  setJoinKey: PropTypes.func.isRequired,
  handleJoinRoom: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
};