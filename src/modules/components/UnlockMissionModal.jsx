import { useState } from "react";
import { API_BASE } from "../../config";

export default function UnlockMissionModal({ mission, token, onClose, onUnlocked }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE}/missions/${mission.id}/validate_code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Código de desbloqueo incorrecto.");
      }

      setSuccess("¡Código aceptado! Misión desbloqueada.");
      setTimeout(() => {
        onUnlocked(mission.id);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(3, 15, 23, 0.85)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: 20
    }}>
      <div className="modal-card animate-scaleUp" style={{
        background: "linear-gradient(145deg, #0d2833, #051820)",
        border: "2px solid #b8fff9",
        borderRadius: 20,
        padding: 30,
        maxWidth: 450,
        width: "100%",
        boxShadow: "0 0 40px rgba(184, 255, 249, 0.25)",
        position: "relative",
        color: "#e6f7ff"
      }}>
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            padding: 0,
            margin: 0,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(184, 255, 249, 0.4)",
            color: "#9be6df",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
        >
          ✖
        </button>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span style={{ fontSize: "3rem" }}>🔐</span>
          <h2 style={{ color: "#b8fff9", margin: "10px 0 5px 0" }}>Desbloqueo de Misión</h2>
          <p style={{ color: "#9be6df", fontSize: "0.9rem" }}>
            Ingresa la clave proporcionada por tu profesor para abrir: <strong style={{ color: "#ffd166" }}>{mission?.title || "Misión"}</strong>
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 107, 107, 0.15)",
            border: "1px solid #ff6b6b",
            color: "#ff8e8e",
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: "0.88rem",
            marginBottom: 15,
            textAlign: "center"
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "rgba(46, 196, 182, 0.15)",
            border: "1px solid #2ec4b6",
            color: "#6dd5e8",
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: "0.88rem",
            marginBottom: 15,
            textAlign: "center"
          }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleUnlock}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: "#b8fff9", fontSize: "0.85rem", marginBottom: 8, fontWeight: 600 }}>
              CLAVE DE ACCESO DE LA PROFESORA:
            </label>
            <input 
              type="text" 
              value={code} 
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              maxLength={12}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "1.2rem",
                letterSpacing: 3,
                textAlign: "center",
                fontWeight: "bold",
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(184, 255, 249, 0.4)",
                borderRadius: 10,
                color: "#ffd166",
                boxSizing: "border-box",
                outline: "none"
              }}
              autoFocus
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                background: "transparent",
                border: "1px solid rgba(184, 255, 249, 0.3)",
                color: "#9be6df",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || !code.trim()}
              style={{
                flex: 2,
                padding: "12px",
                background: "linear-gradient(135deg, #2ec4b6, #26a399)",
                border: "none",
                color: "#002427",
                fontWeight: "bold",
                borderRadius: 10,
                cursor: "pointer",
                boxShadow: "0 0 15px rgba(46, 196, 182, 0.4)"
              }}
            >
              {loading ? "Verificando..." : "Desbloquear 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
