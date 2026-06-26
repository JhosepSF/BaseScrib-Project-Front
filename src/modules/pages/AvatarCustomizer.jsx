import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config";
import ReclutaPrincipal from "../../assets/amongus/recluta principal personaje solo.png";
import "../../styles/Panel.css";

export default function AvatarCustomizer() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

  // Customization state variables
  const [suitColor, setSuitColor] = useState("#2ec4b6"); // Cyan
  const [visorColor, setVisorColor] = useState("#a3e2f7"); // Visor Cyan
  const [accessory, setAccessory] = useState("none"); // "none", "antenna", "ring", "goggles"
  const [decal, setDecal] = useState("none"); // "none", "star", "heart", "planet"

  const token = localStorage.getItem("basescrib_token") || "";

  // Color options maps with CSS hue filters
  const suitColorsList = [
    { name: "Cyan Tripulante", hex: "#2ec4b6", filter: "none" },
    { name: "Rojo Impostor", hex: "#ff6b6b", filter: "hue-rotate(130deg) saturate(1.5)" },
    { name: "Amarillo Tarea", hex: "#ffd166", filter: "hue-rotate(45deg) saturate(1.5) brightness(1.1)" },
    { name: "Naranja Marte", hex: "#ff6b35", filter: "hue-rotate(20deg) saturate(1.4)" },
    { name: "Verde Tóxico", hex: "#00ff87", filter: "hue-rotate(85deg) saturate(1.6)" },
    { name: "Violeta Cósmico", hex: "#ab47bc", filter: "hue-rotate(250deg) saturate(1.3)" },
    { name: "Blanco Astronauta", hex: "#ffffff", filter: "saturate(0) brightness(1.7)" },
    { name: "Negro Espacio", hex: "#1a1a1a", filter: "brightness(0.3) contrast(1.3)" }
  ];

  const visorColorsList = [
    { name: "Celeste Clásico", hex: "#a3e2f7" },
    { name: "Oro Cibernético", hex: "#ffd700" },
    { name: "Fucsia Neón", hex: "#ff0055" },
    { name: "Verde Radiactivo", hex: "#39ff14" }
  ];

  // Fetch initial profile
  useEffect(() => {
    if (!token) {
      setError("No has iniciado sesión.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch current user details
        const meRes = await fetch(`${API_BASE}/users/me/`, { headers });
        if (!meRes.ok) throw new Error("Token inválido");
        const userData = await meRes.json();
        setUser(userData);

        if (userData.role !== "student") {
          throw new Error("Solo los estudiantes pueden personalizar su avatar.");
        }

        // Fetch Student Profile
        const profRes = await fetch(`${API_BASE}/student-profiles/me/`, { headers });
        if (profRes.ok) {
          const profileData = await profRes.json();
          if (profileData.avatar) {
            try {
              // Parse saved avatar configurations
              const config = JSON.parse(profileData.avatar);
              if (config.suitColor) setSuitColor(config.suitColor);
              if (config.visorColor) setVisorColor(config.visorColor);
              if (config.accessory) setAccessory(config.accessory);
              if (config.decal) setDecal(config.decal);
            } catch (e) {
              console.warn("Could not parse saved avatar configurations, using defaults.");
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Find active color filter from the list
  const activeColor = suitColorsList.find(c => c.hex === suitColor) || suitColorsList[0];
  const colorFilter = activeColor.filter;

  // Save selection to backend profile
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const config = JSON.stringify({
        suitColor,
        visorColor,
        accessory,
        decal
      });

      const res = await fetch(`${API_BASE}/student-profiles/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: config })
      });

      if (!res.ok) {
        throw new Error("No se pudo guardar la apariencia del avatar.");
      }

      setSuccess("¡Avatar guardado con éxito en tu panel de control!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container space-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="glass-console auth-card" style={{ maxWidth: 450 }}>
          <h2>Cargando personalizador...</h2>
          <p className="tagline">Preparando cabina de vestuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-bg" style={{ maxWidth: 1000 }}>
      {/* Scanline Overlay */}
      <div className="scan-line" />

      <header className="panel-header">
        <h1>DISEÑADOR DE TRIPULANTE (2D)</h1>
        <p className="tagline">Personaliza tu traje de exploración espacial</p>
      </header>

      {error && <div className="error-message" style={{ width: "100%", maxWidth: 900 }}>{error}</div>}
      {success && <div className="success-message" style={{ width: "100%", maxWidth: 900, background: "rgba(46,196,182,0.15)", border: "1px solid #2ec4b6", color: "#b8fff9", padding: 15, borderRadius: 8, textAlign: "center", marginBottom: 20 }}>{success}</div>}

      <div className="avatar-workspace" style={{ display: "flex", gap: 30, width: "100%", maxWidth: 1000, flexWrap: "wrap", zIndex: 10 }}>
        {/* Left Side: 2D Preview with User Character */}
        <div 
          className="glass-console auth-card" 
          style={{ 
            flex: "1 1 400px", 
            minHeight: 400, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            padding: 30,
            background: "radial-gradient(circle, rgba(15, 58, 71, 0.4) 0%, rgba(5, 24, 32, 0.25) 100%)"
          }}
        >
          <div className="avatar-preview-2d" style={{ width: 320, height: 380, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="floating-crewmate" style={{ position: "relative", width: 200, height: 230 }}>
              
              {/* Custom Character Base Body with Hue Filter */}
              <img 
                src={ReclutaPrincipal} 
                className="avatar-layer" 
                alt="Recluta Principal"
                style={{ 
                  filter: `${colorFilter} drop-shadow(0 0 8px ${suitColor})`,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />

              {/* Layer: Badges (Decals) */}
              {decal === "star" && (
                <div style={{ position: "absolute", top: "108px", left: "50px", fontSize: "2.5rem", zIndex: 12 }}>⭐</div>
              )}
              {decal === "heart" && (
                <div style={{ position: "absolute", top: "108px", left: "50px", fontSize: "2.5rem", zIndex: 12 }}>❤️</div>
              )}
              {decal === "planet" && (
                <div style={{ position: "absolute", top: "108px", left: "50px", fontSize: "2.5rem", zIndex: 12 }}>🪐</div>
              )}

              {/* Layer: Accessories */}
              {accessory === "antenna" && (
                <div style={{ position: "absolute", top: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "3.2rem", zIndex: 15 }}>📡</div>
              )}

              {accessory === "ring" && (
                <div style={{ position: "absolute", top: "86px", left: "50%", transform: "translateX(-50%)", fontSize: "3.5rem", zIndex: 9 }}>⭕</div>
              )}

              {accessory === "goggles" && (
                <div style={{ position: "absolute", top: "36px", left: "55%", transform: "translateX(-50%)", fontSize: "2.6rem", zIndex: 15 }}>🥽</div>
              )}

            </div>
          </div>

          <div style={{ width: "100%", marginTop: 25, color: "#9be6df", fontSize: "0.9rem", fontWeight: "bold" }}>
            🤖 ESTADO: TRIPULANTE LISTO PARA EL DESPEGUE
          </div>
        </div>

        {/* Right Side: Options Panel */}
        <div className="glass-console auth-card" style={{ flex: "1 1 400px", padding: 30, textAlign: "left" }}>
          <h2 style={{ borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: 10, marginTop: 0, color: "#b8fff9" }}>
            🛠️ Panel de Personalización
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20 }}>
            {/* Color of Suit */}
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "0.95rem", fontWeight: "bold" }}>👕 Color del Traje</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {suitColorsList.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSuitColor(c.hex)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: suitColor === c.hex ? "3px solid #b8fff9" : "2.5px solid #000",
                      padding: 0,
                      cursor: "pointer",
                      margin: 0,
                      boxShadow: suitColor === c.hex ? `0 0 12px ${c.hex}` : "none",
                      transition: "transform 0.15s ease"
                    }}
                    className="avatar-opt-color"
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Visor Color */}
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "0.95rem", fontWeight: "bold" }}>🕶️ Color de Visor</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {visorColorsList.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setVisorColor(c.hex)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: visorColor === c.hex ? "3px solid #ffffff" : "2.5px solid #000",
                      padding: 0,
                      cursor: "pointer",
                      margin: 0,
                      boxShadow: visorColor === c.hex ? `0 0 12px ${c.hex}` : "none",
                      transition: "transform 0.15s ease"
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Accessories Option */}
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "0.95rem", fontWeight: "bold" }}>👒 Accesorios (Sombreros)</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { id: "none", name: "Ninguno", emoji: "❌" },
                  { id: "antenna", name: "Antena", emoji: "📡" },
                  { id: "ring", name: "Aro Espacial", emoji: "⭕" },
                  { id: "goggles", name: "Gafas Cyber", emoji: "🥽" }
                ].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAccessory(a.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: accessory === a.id ? "2px solid #b8fff9" : "1px solid rgba(255,255,255,0.15)",
                      background: accessory === a.id ? "rgba(46, 196, 182, 0.18)" : "rgba(255,255,255,0.04)",
                      color: accessory === a.id ? "#b8fff9" : "#e6f7ff",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      margin: 0,
                      transition: "all 0.2s ease"
                    }}
                  >
                    {a.emoji} {a.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Emblem Option */}
            <div>
              <h4 style={{ margin: "0 0 10px 0", color: "#9be6df", fontSize: "0.95rem", fontWeight: "bold" }}>🛡️ Insignia de Pecho</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { id: "none", name: "Vacío", emoji: "🚫" },
                  { id: "star", name: "Estrella", emoji: "⭐" },
                  { id: "heart", name: "Corazón", emoji: "❤️" },
                  { id: "planet", name: "Saturno", emoji: "🪐" }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDecal(d.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: decal === d.id ? "2px solid #b8fff9" : "1px solid rgba(255,255,255,0.15)",
                      background: decal === d.id ? "rgba(46, 196, 182, 0.18)" : "rgba(255,255,255,0.04)",
                      color: decal === d.id ? "#b8fff9" : "#e6f7ff",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      margin: 0,
                      transition: "all 0.2s ease"
                    }}
                  >
                    {d.emoji} {d.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 15, marginTop: 35 }}>
            <button 
              className="btn-cancel" 
              style={{ flex: 1, padding: 14 }} 
              onClick={() => navigate("/panelprincipal")}
            >
              Volver
            </button>
            <button 
              className="btn-create" 
              style={{ flex: 2, background: "linear-gradient(135deg, #2ec4b6, #26a399)", color: "#002427", padding: 14 }} 
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Transmitiendo..." : "💾 Guardar Apariencia"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
