import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";

export function LoginForm({ authUsername, authPassword, setAuthUsername, setAuthPassword, handleLogin, loading, error, setStep }) {
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
      {/* Column 1: Interactive Character */}
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
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(4, 10, 18, 0.95)",
            border: "2.5px solid #2ec4b6",
            borderRadius: "14px",
            padding: "12px 18px",
            color: "#b8fff9",
            fontSize: "0.9rem",
            fontWeight: "bold",
            boxShadow: "0 0 20px rgba(46, 196, 182, 0.4)",
            width: "220px",
            zIndex: 100,
            textAlign: "center",
            lineHeight: "1.3",
            animation: "fadeIn 0.3s ease-out"
          }}
        >
          {loading ? "Escaneando credenciales..." : (error ? "⚠️ Credenciales incorrectas" : "Ingresa tu usuario y código")}
          {/* Arrow pointing down at the crewmate */}
          <div style={{
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "10px solid #2ec4b6"
          }} />
        </div>

        <img 
          src={ReclutaPrincipal} 
          alt="Recluta Principal" 
          className="recluta-main-avatar floating-crewmate" 
          style={{ 
            width: "540px", 
            height: "540px", 
            filter: loading 
              ? "hue-rotate(180deg) brightness(1.2) drop-shadow(0 0 15px #2ec4b6)" 
              : "drop-shadow(0 0 15px rgba(46, 196, 182, 0.5))",
            transition: "all 0.3s ease"
          }} 
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
        {/* Dynamic Scanline based on loading state */}
        <div className={`scan-line ${loading ? 'scan-line-green' : ''}`} />

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ 
            fontSize: "1.8rem", 
            color: "#b8fff9", 
            textTransform: "uppercase", 
            letterSpacing: "1.5px", 
            marginBottom: 5,
            fontWeight: "900",
            WebkitTextStroke: "1.8px #000000",
            textShadow: "2.5px 2.5px 0px #000000, 0 0 15px rgba(184, 255, 249, 0.5)"
          }}>
            VERIFICACIÓN ID
          </h2>
          <span style={{ color: "#ffd166", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>
            {loading ? "ESCANEANDO CREDENCIALES..." : "INGRESA TU FIRMA DE TRIPULANTE"}
          </span>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.25)",
            border: "1.5px solid #ef4444",
            color: "#fca5a5",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "0.88rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "15px",
            boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)",
            animation: "fadeIn 0.3s ease-out"
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
            <label style={{ color: "#9be6df", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "0.5px" }}>NOMBRE DE USUARIO</label>
            <input
              required
              className="neon-input"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              placeholder="Introduce tu usuario..."
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
            <label style={{ color: "#9be6df", fontSize: "0.9rem", fontWeight: "600", letterSpacing: "0.5px" }}>CÓDIGO DE ACCESO</label>
            <input
              required
              className="neon-input"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="Introduce tu contraseña..."
            />
          </div>

          <div className="form-actions" style={{ gap: 12, marginTop: 15 }}>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-create"
              style={{
                background: loading ? "rgba(46, 196, 182, 0.4)" : "linear-gradient(135deg, #2ec4b6, #26a399)",
                color: "#023",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "14px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 0 15px rgba(46, 196, 182, 0.2)",
                transition: "all 0.3s ease",
                flex: 2
              }}
            >
              {loading ? "Verificando..." : "Acceder al Puente"}
            </button>
            <button 
              type="button" 
              onClick={() => setStep("home")} 
              className="btn-cancel"
              style={{
                padding: "14px 20px",
                borderRadius: "8px",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                background: "transparent",
                color: "#9be6df",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                flex: 1
              }}
            >
              Atrás
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

LoginForm.propTypes = {
  authUsername: PropTypes.string.isRequired,
  authPassword: PropTypes.string.isRequired,
  setAuthUsername: PropTypes.func.isRequired,
  setAuthPassword: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
};
