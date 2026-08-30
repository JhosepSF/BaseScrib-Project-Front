import { useState } from "react";
import { soundFx } from "../utils/soundEffects";

export default function PortalAltar({ onOpenAbyss }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundFx.playWarp();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className="portal-altar-container"
      onClick={() => { soundFx.playWarp(); onOpenAbyss(); }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: 170,
        height: 180,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        margin: "10px auto",
        userSelect: "none",
        transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      }}
    >
      {/* GLOWING PARTICLE BACKGROUND RING */}
      <div 
        style={{
          position: "absolute",
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247, 37, 133, 0.4) 0%, rgba(114, 9, 183, 0.2) 60%, transparent 80%)",
          filter: isHovered ? "drop-shadow(0 0 25px #f72585)" : "drop-shadow(0 0 10px #7209b7)",
          transform: isHovered ? "scale(1.15)" : "scale(1)",
          transition: "all 0.3s ease",
          zIndex: 1
        }}
      />

      {/* ROTATING OUTER ENERGY RING */}
      <div 
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "2px dashed #f72585",
          animation: isHovered ? "spin 3s linear infinite" : "spin 8s linear infinite",
          boxShadow: "0 0 15px #f72585, inset 0 0 15px #7209b7",
          zIndex: 2
        }}
      />

      {/* ROTATING INNER VORTEX SINGULARITY */}
      <div 
        style={{
          position: "absolute",
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "radial-gradient(circle, #f72585 10%, #7209b7 50%, #150a28 90%)",
          boxShadow: isHovered ? "0 0 35px #f72585" : "0 0 20px #7209b7",
          animation: isHovered ? "spin-reverse 2s linear infinite" : "spin-reverse 6s linear infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3
        }}
      >
        <span style={{ fontSize: "2.8rem", transform: isHovered ? "scale(1.2)" : "scale(1)", transition: "transform 0.3s ease" }}>
          🌀
        </span>
      </div>

      {/* PEDESTAL BASE */}
      <div 
        style={{
          position: "absolute",
          bottom: 10,
          width: 110,
          height: 22,
          background: "linear-gradient(180deg, rgba(181, 23, 158, 0.6), rgba(21, 10, 40, 0.9))",
          border: "1px solid #f72585",
          borderRadius: "12px 12px 6px 6px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.8)",
          zIndex: 2
        }}
      />

      {/* HOLOGRAPHIC LABEL BADGE */}
      <div 
        style={{
          position: "absolute",
          bottom: -8,
          background: "linear-gradient(135deg, #f72585, #7209b7)",
          color: "#white",
          padding: "4px 12px",
          borderRadius: 20,
          fontSize: "0.75rem",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          boxShadow: "0 0 12px rgba(247, 37, 133, 0.7)",
          whiteSpace: "nowrap",
          zIndex: 4,
          border: "1px solid rgba(255,255,255,0.4)"
        }}
      >
        ✨ EL ALTAR DEL ABISMO
      </div>

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
