import { useState } from "react";
import ValleDePortalesBg from "../../assets/amongus/valle de portales.png";
import { soundFx } from "../utils/soundEffects";
import AbyssModal from "./AbyssModal";

export default function ValleDePortalesView({ user, token, onClose, onUserUpdated }) {
  const [showAbyss, setShowAbyss] = useState(false);
  const [hoveredPortal, setHoveredPortal] = useState(null);

  const handleOpenAbyss = () => {
    soundFx.playWarp();
    setShowAbyss(true);
  };

  return (
    <div 
      className="valle-de-portales-window"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        background: "#05020f",
        overflow: "hidden",
        userSelect: "none",
        animation: "vallePortalWarp 0.45s ease-out forwards"
      }}
    >
      {/* BACKGROUND SCENE: VALLE DE PORTALES ARTWORK */}
      <img 
        src={ValleDePortalesBg} 
        alt="Valle de Portales BaseScrib" 
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.95) contrast(1.1) saturate(1.2)",
          position: "absolute",
          top: 0,
          left: 0
        }}
      />

      {/* AMBIENT NEBULA & METEORS */}
      <div className="valle-ambient-nebula" />
      <div className="valle-meteor" />
      <div className="valle-meteor" />
      <div className="valle-meteor" />

      {/* SCANLINE, COSMIC VIGNETTE & EDGE-BLENDING OVERLAY */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse at center, rgba(181, 23, 158, 0.05) 0%, rgba(5, 2, 15, 0.4) 65%, rgba(5, 2, 15, 0.85) 90%, #05020f 100%)",
          pointerEvents: "none"
        }}
      />

      {/* TOP HEADER BAR */}
      <div 
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10
        }}
      >
        <div style={{ background: "rgba(10, 4, 25, 0.75)", border: "1.5px solid rgba(247, 37, 133, 0.5)", borderRadius: 12, padding: "8px 16px", backdropFilter: "blur(10px)", color: "#e6f7ff" }}>
          <h2 style={{ color: "#f72585", margin: 0, fontSize: "1.2rem", textShadow: "0 0 10px rgba(247, 37, 133, 0.8)", textTransform: "uppercase", letterSpacing: "1px" }}>
            🌀 Valle de Portales Interdimensional
          </h2>
          <span style={{ color: "#9be6df", fontSize: "0.8rem" }}>
            Sector 7 • Entradas a Dimensiones de Entrenamiento & Farmeo
          </span>
        </div>

        <button 
          onClick={() => { soundFx.playClick(); onClose(); }}
          className="station-exit-btn"
        >
          🚀 Volver al Centro de Control
        </button>
      </div>

      {/* INTERACTIVE ANIMATED PORTAL: EL ALTAR DEL ABISMO (CENTRO) */}
      <div 
        onClick={handleOpenAbyss}
        onMouseEnter={() => { setHoveredPortal("abyss"); soundFx.playWarp(); }}
        onMouseLeave={() => setHoveredPortal(null)}
        style={{
          position: "absolute",
          top: "48%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 280,
          height: 280,
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* ROTATING OUTER ENERGY RING */}
        <div 
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "4px dashed rgba(247, 37, 133, 0.6)",
            animation: hoveredPortal === "abyss" ? "spin 2s linear infinite" : "spin 6s linear infinite",
            boxShadow: hoveredPortal === "abyss" ? "0 0 45px #f72585, inset 0 0 30px #7209b7" : "0 0 25px rgba(114, 9, 183, 0.5)",
            transition: "all 0.3s ease"
          }}
        />

        {/* ROTATING VORTEX CORE */}
        <div 
          style={{
            position: "absolute",
            width: 190,
            height: 190,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247, 37, 133, 0.4) 10%, rgba(114, 9, 183, 0.2) 50%, transparent 90%)",
            animation: hoveredPortal === "abyss" ? "spin-reverse 1.5s linear infinite" : "spin-reverse 4s linear infinite",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: hoveredPortal === "abyss" ? "inset 0 0 40px rgba(255, 255, 255, 0.4)" : "none",
            transition: "all 0.3s ease"
          }}
        >
        </div>

        {/* HOLOGRAPHIC PORTAL TITLE CARD */}
        <div 
          style={{
            position: "absolute",
            bottom: -40,
            background: "linear-gradient(135deg, rgba(247, 37, 133, 0.9), rgba(114, 9, 183, 0.9))",
            color: "white",
            padding: "8px 24px",
            borderRadius: 20,
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: "0 0 20px rgba(247, 37, 133, 0.8)",
            border: "1.5px solid rgba(255, 255, 255, 0.4)",
            textAlign: "center",
            whiteSpace: "nowrap",
            backdropFilter: "blur(4px)",
            transform: hoveredPortal === "abyss" ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.2s ease"
          }}
        >
          ✨ ABISMO CUÁNTICO
          <span style={{ display: "block", fontSize: "0.72rem", color: "#ffd166", marginTop: 2, fontWeight: "500" }}>
            (Entrar a la dimensión de farmeo)
          </span>
        </div>
      </div>

      {/* PORTAL LATERAL IZQUIERDO (CIUDAD VERDE) - Placeholder */}
      <div 
        onMouseEnter={() => setHoveredPortal("left")}
        onMouseLeave={() => setHoveredPortal(null)}
        style={{
          position: "absolute",
          top: "60%",
          left: "25%",
          transform: "translate(-50%, -50%)",
          width: 140,
          height: 220,
          cursor: "not-allowed",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        <div 
          style={{
            background: "rgba(10, 20, 30, 0.8)",
            color: "white",
            padding: "4px 12px",
            borderRadius: 12,
            fontSize: "0.75rem",
            fontWeight: "bold",
            border: "1px solid rgba(46, 196, 182, 0.4)",
            opacity: hoveredPortal === "left" ? 1 : 0,
            transition: "opacity 0.2s ease",
            transform: "translateY(20px)",
            textAlign: "center"
          }}
        >
          🔒 Ciudad Verde<br/>
          <span style={{ fontSize: "0.6rem", color: "#ff6b6b" }}>Portal Cerrado</span>
        </div>
      </div>

      {/* PORTAL LATERAL DERECHO (CIUDAD NEWS) - Placeholder */}
      <div 
        onMouseEnter={() => setHoveredPortal("right")}
        onMouseLeave={() => setHoveredPortal(null)}
        style={{
          position: "absolute",
          top: "60%",
          left: "75%",
          transform: "translate(-50%, -50%)",
          width: 140,
          height: 220,
          cursor: "not-allowed",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        <div 
          style={{
            background: "rgba(10, 20, 30, 0.8)",
            color: "white",
            padding: "4px 12px",
            borderRadius: 12,
            fontSize: "0.75rem",
            fontWeight: "bold",
            border: "1px solid rgba(144, 224, 239, 0.4)",
            opacity: hoveredPortal === "right" ? 1 : 0,
            transition: "opacity 0.2s ease",
            transform: "translateY(20px)",
            textAlign: "center"
          }}
        >
          🔒 Ciudad News<br/>
          <span style={{ fontSize: "0.6rem", color: "#ff6b6b" }}>Portal Cerrado</span>
        </div>
      </div>

      {/* OVERLAY MODAL FOR ABYSS CHALLENGE */}
      {showAbyss && (
        <AbyssModal 
          user={user}
          token={token}
          onClose={() => setShowAbyss(false)}
          onUserUpdated={(updatedUser) => {
            if (onUserUpdated) onUserUpdated(updatedUser);
          }}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
