import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ReclutaPrincipal from "../../assets/amongus/recluta principal personaje solo.png";

const MESSAGES = [
  "¡Hola recluta! Bienvenido a BaseScrib",
  "Selecciona una opción del deck de acceso de al lado"
];

export function AuthHome({ setStep, setRegisterRole }) {
  const navigate = useNavigate();
  const [msgIndex, setMsgIndex] = useState(0);

  const handleCrewmateClick = () => {
    setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
  };

  return (
    <div 
      className="auth-home-container animate-fadeIn" 
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        flexWrap: "wrap",
        maxWidth: "1100px",
        width: "100%",
        padding: "20px 10px",
        boxSizing: "border-box"
      }}
    >
      {/* Column 1: Interactive Character (Outside the Deck Card) */}
      <div 
        className="character-side" 
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: "1 1 540px",
          minWidth: "400px"
        }}
      >
        {/* Interactive Speech Bubble */}
        <div 
          onClick={handleCrewmateClick}
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(30, 18, 28, 0.95)",
            border: "2.5px solid #c97aab",
            borderRadius: "14px",
            padding: "12px 18px",
            color: "#f5d8eb",
            fontSize: "0.9rem",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(200, 100, 160, 0.4)",
            width: "220px",
            zIndex: 100,
            cursor: "pointer",
            textAlign: "center",
            lineHeight: "1.3",
            animation: "fadeIn 0.3s ease-out"
          }}
        >
          {MESSAGES[msgIndex]}
          <div style={{
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "10px solid #c97aab"
          }} />
        </div>

        <img 
          src={ReclutaPrincipal} 
          alt="Recluta Principal" 
          className="recluta-main-avatar floating-crewmate" 
          style={{ 
            width: "540px", 
            height: "540px", 
            filter: "drop-shadow(0 0 15px rgba(46, 196, 182, 0.5))",
            cursor: "pointer",
            transition: "all 0.25s ease"
          }} 
          onClick={handleCrewmateClick}
        />
      </div>

      {/* Column 2: The Deck Access Console Box */}
      <div 
        className="glass-console auth-card" 
        style={{ 
          flex: "1 1 450px", 
          maxWidth: "500px", 
          minWidth: "320px",
          padding: "40px 30px", 
          position: "relative",
          margin: "0"
        }}
      >
        {/* Scanline Overlay */}
        <div className="scan-line" />

        <div style={{ marginBottom: 25 }}>
          <h2 style={{ 
            fontSize: "2rem", 
            color: "#f8dced", 
            textTransform: "uppercase", 
            letterSpacing: "1.5px", 
            marginBottom: 5,
            fontWeight: "900",
            WebkitTextStroke: "1.8px #000000",
            textShadow: "2.5px 2.5px 0px #000000, 0 0 18px rgba(240, 150, 200, 0.55)"
          }}>
            DECK DE ACCESO
          </h2>
          <span style={{ color: "#d4b8c8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
            BaseScrib - Consola de Tripulación
          </span>
        </div>

        <p style={{ color: "#e8d5e0", fontSize: "1rem", marginBottom: 25, lineHeight: "1.5", textAlign: "center" }}>
          ¡Prepárate para las misiones de escritura, recargar reactores y reparar el casco de la nave!
        </p>

        <div className="role-buttons" style={{ gap: 15, display: "flex", flexDirection: "column" }}>
          <button 
            onClick={() => setStep("login")} 
            className="btn-student"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#e8f4ff",
              padding: "16px 20px",
              borderRadius: "10px",
              fontSize: "1.05rem",
              fontWeight: "bold",
              cursor: "pointer",
              border: "1px solid rgba(100,160,255,0.40)",
              textTransform: "uppercase",
              boxShadow: "0 4px 20px rgba(30, 80, 220, 0.40)",
              transition: "all 0.3s ease"
            }}
          >
            Ingresar a la Cabina
          </button>
          <button
            onClick={() => { setRegisterRole("student"); setStep("register"); }}
            className="btn-teacher"
            style={{
              background: "linear-gradient(135deg, rgba(40,70,140,0.75), rgba(25,50,110,0.70))",
              color: "#b8d8f8",
              padding: "16px 20px",
              borderRadius: "10px",
              fontSize: "1.05rem",
              fontWeight: "bold",
              cursor: "pointer",
              border: "1px solid rgba(80,130,230,0.30)",
              textTransform: "uppercase",
              boxShadow: "0 4px 14px rgba(20, 50, 160, 0.30)",
              transition: "all 0.3s ease"
            }}
          >
            Registrar Nuevo Tripulante
          </button>
        </div>

        <div style={{ marginTop: 30, borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: 20 }}>
          <button
            onClick={() => navigate('/teacher')}
            className="btn-cancel"
            style={{ 
              padding: '10px 18px', 
              borderRadius: 8, 
              fontSize: '0.9rem', 
              border: '1.5px solid rgba(160,210,255,0.40)',
              color: '#b8e8ff',
              background: 'rgba(180,215,255,0.10)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: "100%"
            }}
          >
            Panel de Comando Docente
          </button>
        </div>
      </div>
    </div>
  );
}

AuthHome.propTypes = {
  setStep:         PropTypes.func.isRequired,
  setRegisterRole: PropTypes.func.isRequired,
};
