import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";

export function RegisterForm({
  authUsername,
  authPassword,
  authEmail,
  setAuthUsername,
  setAuthPassword,
  setAuthEmail,
  registerRole,
  setRegisterRole,
  studentGrade,
  setStudentGrade,
  studentSection,
  setStudentSection,
  handleRegister,
  loading,
  setStep,
}) {
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
          {loading ? "Registrando cadete..." : "Registra tus datos de tripulante"}
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
              ? "hue-rotate(90deg) brightness(1.2) drop-shadow(0 0 15px #2ec4b6)" 
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
          maxWidth: "520px", 
          minWidth: "320px",
          padding: "40px 30px", 
          position: "relative",
          margin: "0"
        }}
      >
        {/* Scanline Overlay */}
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
            REGISTRO DE CADETE
          </h2>
          <span style={{ color: "#ffd166", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>
            {loading ? "CREANDO TRIPULANTE..." : "CREA TU IDENTIDAD ESPACIAL"}
          </span>
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {/* Hidden role indicator */}
          <div style={{ display: "none" }}>
            <button
              type="button"
              className={registerRole === "student" ? "btn-student active" : "btn-teacher"}
              onClick={() => setRegisterRole("student")}
            >
              Estudiante
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
            <label style={{ color: "#9be6df", fontSize: "0.85rem", fontWeight: "600" }}>USUARIO</label>
            <input
              required
              className="neon-input"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              placeholder="Escribe tu nombre de usuario..."
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
            <label style={{ color: "#9be6df", fontSize: "0.85rem", fontWeight: "600" }}>CORREO ELECTRÓNICO</label>
            <input
              required
              className="neon-input"
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
            <label style={{ color: "#9be6df", fontSize: "0.85rem", fontWeight: "600" }}>CONTRASEÑA</label>
            <input
              required
              className="neon-input"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres..."
            />
          </div>

          {registerRole === "student" && (
            <div style={{ display: "flex", gap: 15 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
                <label style={{ color: "#9be6df", fontSize: "0.85rem", fontWeight: "600" }}>GRADO</label>
                <input
                  required
                  className="neon-input"
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  placeholder="Ej. 4"
                />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
                <label style={{ color: "#9be6df", fontSize: "0.85rem", fontWeight: "600" }}>SECCIÓN</label>
                <select 
                  value={studentSection} 
                  onChange={(e) => setStudentSection(e.target.value)}
                  className="neon-input"
                  style={{
                    width: "100%",
                    height: "46px",
                    background: "rgba(0, 0, 0, 0.45)",
                    border: "1.5px solid rgba(0, 245, 255, 0.15)",
                    color: "#e6f7ff",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  <option value="A" style={{ background: "#08101c" }}>Sección A</option>
                  <option value="B" style={{ background: "#08101c" }}>Sección B</option>
                  <option value="C" style={{ background: "#08101c" }}>Sección C</option>
                </select>
              </div>
            </div>
          )}

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
              {loading ? "Iniciando..." : "Alistar Tripulante"}
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
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

RegisterForm.propTypes = {
  authUsername: PropTypes.string.isRequired,
  authPassword: PropTypes.string.isRequired,
  authEmail: PropTypes.string.isRequired,
  setAuthUsername: PropTypes.func.isRequired,
  setAuthPassword: PropTypes.func.isRequired,
  setAuthEmail: PropTypes.func.isRequired,
  registerRole: PropTypes.string.isRequired,
  setRegisterRole: PropTypes.func.isRequired,
  studentGrade: PropTypes.string.isRequired,
  setStudentGrade: PropTypes.func.isRequired,
  studentSection: PropTypes.string.isRequired,
  setStudentSection: PropTypes.func.isRequired,
  handleRegister: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
};