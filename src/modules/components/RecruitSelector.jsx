import { useState } from "react";
import PropTypes from "prop-types";
import { API_BASE } from "../../config";

// Outfit images
import mBase      from "../../assets/recruits/m_base.png";
import mExplorer  from "../../assets/recruits/m_explorer.png";
import mTech      from "../../assets/recruits/m_tech.png";
import mCommander from "../../assets/recruits/m_commander.png";
import fBase      from "../../assets/recruits/f_base.png";
import fExplorer  from "../../assets/recruits/f_explorer.png";
import fScientist from "../../assets/recruits/f_scientist.png";
import fCommander from "../../assets/recruits/f_commander.png";

const OUTFITS = {
  male: [
    { id: "m_base",      name: "Recluta Base",       cost: 0,   img: mBase,      color: "#4a90d9" },
    { id: "m_explorer",  name: "Explorador",          cost: 30,  img: mExplorer,  color: "#e8820c" },
    { id: "m_tech",      name: "Técnico de Nave",     cost: 50,  img: mTech,      color: "#7b8c9e" },
    { id: "m_commander", name: "Comandante Elite",    cost: 100, img: mCommander, color: "#c9a227" },
  ],
  female: [
    { id: "f_base",      name: "Recluta Base",        cost: 0,   img: fBase,      color: "#9b59b6" },
    { id: "f_explorer",  name: "Exploradora",          cost: 30,  img: fExplorer,  color: "#27ae60" },
    { id: "f_scientist", name: "Científica",           cost: 50,  img: fScientist, color: "#1abc9c" },
    { id: "f_commander", name: "Comandante Elite",    cost: 100, img: fCommander, color: "#e74c3c" },
  ],
};

export function RecruitSelector({ user, onUserUpdate, token }) {
  const [gender, setGender]       = useState("male");
  const [outfitIdx, setOutfitIdx] = useState(0);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState(null); // { text, type: 'ok'|'err' }

  const outfits = OUTFITS[gender];
  const current = outfits[outfitIdx];

  const unlockedList = user?.unlocked_outfits || ["m_base", "f_base"];
  const selectedId   = user?.selected_outfit  || "m_base";

  const isUnlocked = unlockedList.includes(current.id);
  const isSelected = selectedId === current.id;

  const navigate = (dir) => {
    setOutfitIdx((prev) => (prev + dir + outfits.length) % outfits.length);
    setMessage(null);
  };

  const switchGender = (g) => {
    setGender(g);
    setOutfitIdx(0);
    setMessage(null);
  };

  const handleUnlock = async () => {
    if (!token) { setMessage({ text: "Debes iniciar sesión para canjear outfits", type: "err" }); return; }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/users/unlock_outfit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ outfit_id: current.id }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage({ text: data.error || "Error al canjear", type: "err" }); return; }
      setMessage({ text: `✅ ¡${current.name} desbloqueado!`, type: "ok" });
      if (onUserUpdate) onUserUpdate({ ...user, coins: data.coins, unlocked_outfits: data.unlocked_outfits });
    } catch {
      setMessage({ text: "Error de conexión", type: "err" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/select_outfit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ outfit_id: current.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "✓ Outfit seleccionado", type: "ok" });
        if (onUserUpdate) onUserUpdate({ ...user, selected_outfit: data.selected_outfit });
        localStorage.setItem("basescrib_outfit", current.id);
      }
    } catch {
      setMessage({ text: "Error al seleccionar", type: "err" });
    } finally {
      setLoading(false);
    }
  };

  // Also persist selection locally even without login
  const handleLocalSelect = () => {
    localStorage.setItem("basescrib_outfit", current.id);
    setMessage({ text: "✓ Recluta seleccionado", type: "ok" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>

      {/* Gender Tabs */}
      <div style={{ display: "flex", gap: 10, background: "rgba(0,0,0,0.3)", borderRadius: 30, padding: "4px 6px" }}>
        {[
          { key: "male",   label: "👨 Masculino" },
          { key: "female", label: "👩 Femenino" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => switchGender(key)}
            style={{
              padding: "8px 20px",
              borderRadius: 24,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.85rem",
              transition: "all 0.25s ease",
              background: gender === key
                ? "linear-gradient(135deg, rgba(46,196,182,0.8), rgba(30,140,130,0.8))"
                : "transparent",
              color: gender === key ? "#fff" : "rgba(255,255,255,0.55)",
              boxShadow: gender === key ? "0 0 14px rgba(46,196,182,0.35)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Character Carousel */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
        {/* Prev arrow */}
        <button onClick={() => navigate(-1)} style={arrowBtn}>‹</button>

        {/* Character Display */}
        <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            position: "relative",
            width: 220,
            height: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <img
              src={current.img}
              alt={current.name}
              className={isUnlocked ? "floating-crewmate" : ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: isUnlocked
                  ? `drop-shadow(0 0 18px ${current.color}88)`
                  : "grayscale(90%) brightness(0.45)",
                transition: "all 0.3s ease",
              }}
            />
            {/* Lock overlay */}
            {!isUnlocked && (
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}>
                <span style={{ fontSize: "2.5rem" }}>🔒</span>
                <span style={{
                  background: "rgba(0,0,0,0.75)",
                  color: "#ffd166",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  padding: "4px 10px",
                  borderRadius: 20,
                  border: "1px solid rgba(255,209,102,0.4)"
                }}>
                  {current.cost} 🪙
                </span>
              </div>
            )}
            {/* Selected badge */}
            {isSelected && isUnlocked && (
              <div style={{
                position: "absolute",
                top: 6, right: 6,
                background: "rgba(46,196,182,0.9)",
                color: "#002", fontSize: "0.7rem", fontWeight: "bold",
                padding: "3px 8px", borderRadius: 12,
                boxShadow: "0 0 10px rgba(46,196,182,0.5)"
              }}>✓ Activo</div>
            )}
          </div>

          {/* Outfit name */}
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <div style={{
              fontSize: "1rem", fontWeight: "bold",
              color: isUnlocked ? current.color : "rgba(255,255,255,0.4)",
              textShadow: isUnlocked ? `0 0 12px ${current.color}66` : "none",
            }}>
              {current.name}
            </div>
            {current.cost === 0 && !isUnlocked && (
              <div style={{ fontSize: "0.75rem", color: "#2ec4b6", marginTop: 2 }}>¡Gratis!</div>
            )}
          </div>

          {/* Outfit dots indicator */}
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {outfits.map((_, i) => (
              <div
                key={i}
                onClick={() => setOutfitIdx(i)}
                style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: i === outfitIdx ? current.color : "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: i === outfitIdx ? `0 0 8px ${current.color}` : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Next arrow */}
        <button onClick={() => navigate(1)} style={arrowBtn}>›</button>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 240 }}>
        {isUnlocked ? (
          !isSelected && (
            <button
              onClick={token ? handleSelect : handleLocalSelect}
              disabled={loading}
              style={{
                ...actionBtn,
                background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
                boxShadow: `0 4px 16px ${current.color}44`,
              }}
            >
              ✓ Elegir este Recluta
            </button>
          )
        ) : (
          <button
            onClick={handleUnlock}
            disabled={loading || !token || (user && user.coins < current.cost)}
            style={{
              ...actionBtn,
              background: (token && user && user.coins >= current.cost)
                ? "linear-gradient(135deg, #ffd166, #f4a824)"
                : "rgba(255,255,255,0.08)",
              color: (token && user && user.coins >= current.cost) ? "#1a0a00" : "rgba(255,255,255,0.35)",
              cursor: (!token || (user && user.coins < current.cost)) ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Canjeando..." :
              !token ? "🔒 Inicia sesión para canjear" :
              user && user.coins < current.cost ? `Necesitas ${current.cost - user.coins} 🪙 más` :
              `Canjear por ${current.cost} 🪙`}
          </button>
        )}

        {/* Coins display */}
        {user && (
          <div style={{
            textAlign: "center", fontSize: "0.8rem",
            color: "rgba(255,255,255,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6
          }}>
            <span>Saldo:</span>
            <span style={{ color: "#ffd166", fontWeight: "bold" }}>{user.coins} 🪙</span>
          </div>
        )}

        {/* Feedback message */}
        {message && (
          <div style={{
            textAlign: "center",
            fontSize: "0.82rem",
            color: message.type === "ok" ? "#2ec4b6" : "#ff6b6b",
            background: message.type === "ok" ? "rgba(46,196,182,0.1)" : "rgba(255,107,107,0.1)",
            border: `1px solid ${message.type === "ok" ? "rgba(46,196,182,0.3)" : "rgba(255,107,107,0.3)"}`,
            borderRadius: 8,
            padding: "6px 12px",
          }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

const arrowBtn = {
  width: 36, height: 36,
  borderRadius: "50%",
  border: "1.5px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: "1.4rem",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "all 0.2s ease",
  flexShrink: 0,
  lineHeight: 1,
};

const actionBtn = {
  padding: "11px 18px",
  borderRadius: 10,
  border: "none",
  fontSize: "0.9rem",
  fontWeight: "bold",
  cursor: "pointer",
  color: "#fff",
  transition: "all 0.3s ease",
  width: "100%",
};

RecruitSelector.propTypes = {
  user:         PropTypes.object,
  onUserUpdate: PropTypes.func,
  token:        PropTypes.string,
};
