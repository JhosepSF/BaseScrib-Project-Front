import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { soundFx } from "../utils/soundEffects";
import AvatarFrame from "./AvatarFrame";
import { WritingFeedbackModal } from "./WritingFeedbackModal";
import { API_BASE } from "../../config";

/**
 * RecluteHUD — Floating HUD bar with avatar identity, stats, notifications, and navigation.
 */
export default function RecluteHUD({ user, onOpenStore, onOpenRank, onOpenEval, onOpenInventory, onLogout }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const token = localStorage.getItem("basescrib_token");

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotifClick = async (notif) => {
    soundFx.playClick();
    setSelectedNotif(notif);
    setShowNotifMenu(false);

    // Mark as read in backend
    if (!notif.is_read) {
      try {
        await fetch(`${API_BASE}/notifications/${notif.id}/mark_read/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchNotifications();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!user) return null;

  const handleAvatarClick = () => {
    soundFx.playClick();
    if (onOpenInventory) onOpenInventory();
    else navigate("/avatar");
  };

  return (
    <div className="recrute-hud">
      {/* Identity with Animated Avatar Frame */}
      <div className="recrute-hud__identity" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AvatarFrame
          frameId={user.equipped_frame || "frame_default"}
          size="small"
          onClick={handleAvatarClick}
          title="¡Haz clic para personalizar tu Avatar y Marcos!"
        >
          <span style={{ fontSize: "1.2rem" }}>{user.gender === "male" ? "🧑‍🚀" : "👩‍🚀"}</span>
        </AvatarFrame>
        <span className="recrute-hud__name" style={{ fontWeight: "bold", fontSize: "1rem", color: "#e6f7ff" }}>
          {user.username}
        </span>
      </div>

      {/* Stats */}
      <div className="recrute-hud__stats">
        <span className="recrute-hud__stat recrute-hud__stat--xp">⭐ {user.xp || 0} XP</span>
        <span className="recrute-hud__stat recrute-hud__stat--coins" data-tour="coins-card">🪙 {user.coins || 0}</span>
        <span className="recrute-hud__stat recrute-hud__stat--streak" data-tour="streak-card">🔥 {user.streak_count || 0}d</span>
      </div>

      {/* Action Buttons & Notification Bell */}
      <div className="recrute-hud__actions" style={{ position: "relative" }}>
        {/* NOTIFICATION BELL WITH RED DOT */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { soundFx.playClick(); setShowNotifMenu(!showNotifMenu); }}
            style={{
              position: "relative",
              background: unreadCount > 0 ? "rgba(239, 68, 68, 0.25)" : "rgba(255, 255, 255, 0.08)",
              border: unreadCount > 0 ? "1.5px solid #ef4444" : "1.5px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: unreadCount > 0 ? "0 0 15px rgba(239, 68, 68, 0.6)" : "none",
              transition: "all 0.2s ease"
            }}
            title="Notificaciones de Evaluaciones"
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  background: "#ff0055",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: "900",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 8px #ff0055",
                  border: "2px solid #0d1b2a",
                  animation: "pulseRedDot 1.5s infinite ease-in-out"
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN POPUP */}
          {showNotifMenu && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                width: "320px",
                background: "linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(5, 12, 28, 0.99))",
                border: "2px solid #2ec4b6",
                borderRadius: "18px",
                padding: "14px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                zIndex: 3500,
                color: "#e6f7ff"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid rgba(255,255,255,0.1)", paddingBottom: "8px", marginBottom: "10px" }}>
                <strong style={{ fontSize: "0.9rem", color: "#ffd166" }}>🔔 NOTIFICACIONES DE PROFESOR</strong>
                <button onClick={() => setShowNotifMenu(false)} style={{ background: "none", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer" }}>✕</button>
              </div>

              {notifications.length === 0 ? (
                <p style={{ fontSize: "0.82rem", color: "#a0aec0", margin: "10px 0", textAlign: "center" }}>No tienes notificaciones por el momento.</p>
              ) : (
                <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      style={{
                        padding: "10px",
                        borderRadius: "12px",
                        background: n.is_read ? "rgba(255,255,255,0.04)" : "rgba(46, 196, 182, 0.15)",
                        border: n.is_read ? "1px solid rgba(255,255,255,0.1)" : "1.5px solid #2ec4b6",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "bold", fontSize: "0.82rem", color: "#ffffff" }}>{n.title}</span>
                        {n.score !== null && <span style={{ color: "#ffd166", fontWeight: "bold", fontSize: "0.85rem" }}>⭐ {n.score}/20</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#cbd5e0" }}>{n.message}</p>
                      <small style={{ fontSize: "0.68rem", color: "#718096", display: "block", marginTop: "4px" }}>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="recrute-hud__btn recrute-hud__btn--store"
          data-tour="store-button"
          onClick={() => { soundFx.playClick(); onOpenStore(); }}
        >
          🛒 Tienda
        </button>
        <button
          className="recrute-hud__btn recrute-hud__btn--rank"
          onClick={() => { soundFx.playClick(); onOpenRank(); }}
        >
          🏆 Ranking
        </button>
        <button
          className="recrute-hud__btn recrute-hud__btn--eval"
          onClick={() => { soundFx.playClick(); onOpenEval(); }}
        >
          📝 Evaluaciones
        </button>
        <button
          className="recrute-hud__btn recrute-hud__btn--avatar"
          onClick={handleAvatarClick}
        >
          🎨 Avatar
        </button>
        <button
          className="recrute-hud__btn recrute-hud__btn--logout"
          onClick={() => { soundFx.playClick(); onLogout(); }}
        >
          Salir
        </button>
      </div>

      {/* FEEDBACK MODAL WHEN CLICKED */}
      {selectedNotif && (
        <WritingFeedbackModal
          notification={selectedNotif}
          onClose={() => setSelectedNotif(null)}
        />
      )}
    </div>
  );
}

RecluteHUD.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    xp: PropTypes.number,
    coins: PropTypes.number,
    streak_count: PropTypes.number,
    gender: PropTypes.string,
    equipped_frame: PropTypes.string,
  }),
  onOpenStore: PropTypes.func.isRequired,
  onOpenRank: PropTypes.func.isRequired,
  onOpenEval: PropTypes.func.isRequired,
  onOpenInventory: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
};
