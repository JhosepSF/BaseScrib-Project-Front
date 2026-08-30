import { useEffect, useState } from "react";
import { API_BASE } from "../../config";

export default function LeaderboardModal({ roomId, token, onClose }) {
  const [ranking, setRanking] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomId || !token) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/rooms/${roomId}/leaderboard/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error("Error al obtener la tabla de clasificación.");
        }

        const data = await res.json();
        setRanking(data.ranking || []);
        setRoomName(data.room_name || "Sala");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [roomId, token]);

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(3, 15, 23, 0.88)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: 20
    }}>
      <div className="modal-card animate-scaleUp" style={{
        background: "linear-gradient(145deg, #0d2833, #051820)",
        border: "2px solid #ffd166",
        borderRadius: 24,
        padding: 30,
        maxWidth: 600,
        width: "100%",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 50px rgba(255, 209, 102, 0.3)",
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
            border: "1px solid rgba(255, 209, 102, 0.4)",
            color: "#ffd166",
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
          <span style={{ fontSize: "3rem" }}>🏆</span>
          <h2 style={{ color: "#ffd166", margin: "5px 0 2px 0", fontSize: "1.8rem" }}>Ranking del Salón</h2>
          <p style={{ color: "#9be6df", fontSize: "0.9rem" }}>
            Los mejores reclutas de <strong style={{ color: "#b8fff9" }}>{roomName}</strong>
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9be6df" }}>
            <p>Cargando posiciones de la tripulación...</p>
          </div>
        ) : (
          <div style={{ overflowY: "auto", paddingRight: 5 }} className="custom-scroll">
            {/* PODIUM TOP 3 */}
            {top3.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: top3.length === 3 ? "1fr 1.1fr 1fr" : "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 10,
                marginBottom: 25,
                alignItems: "end"
              }}>
                {/* 2ND PLACE */}
                {top3[1] && (
                  <div style={{
                    background: "rgba(192, 192, 192, 0.15)",
                    border: "1px solid #c0c0c0",
                    borderRadius: 16,
                    padding: 15,
                    textAlign: "center",
                    boxShadow: "0 0 15px rgba(192, 192, 192, 0.2)"
                  }}>
                    <span style={{ fontSize: "2rem" }}>🥈</span>
                    <h4 style={{ color: "#e6e6e6", margin: "5px 0", fontSize: "0.95rem" }}>{top3[1].username}</h4>
                    <p style={{ color: "#ffd166", fontSize: "0.85rem", margin: 0, fontWeight: "bold" }}>{top3[1].xp} XP</p>
                    <div style={{ fontSize: "0.75rem", color: "#9be6df", marginTop: 4 }}>
                      🪙 {top3[1].coins} · 🔥 {top3[1].streak_count}d
                    </div>
                  </div>
                )}

                {/* 1ST PLACE (GOLD) */}
                {top3[0] && (
                  <div style={{
                    background: "linear-gradient(145deg, rgba(255, 209, 102, 0.25), rgba(255, 184, 77, 0.1))",
                    border: "2px solid #ffd166",
                    borderRadius: 18,
                    padding: 18,
                    textAlign: "center",
                    boxShadow: "0 0 25px rgba(255, 209, 102, 0.4)",
                    transform: "scale(1.05)"
                  }}>
                    <span style={{ fontSize: "2.8rem" }}>👑</span>
                    <h3 style={{ color: "#ffd166", margin: "5px 0", fontSize: "1.1rem" }}>{top3[0].username}</h3>
                    <p style={{ color: "#b8fff9", fontSize: "1rem", margin: 0, fontWeight: "bold" }}>{top3[0].xp} XP</p>
                    <div style={{ fontSize: "0.8rem", color: "#ffd166", marginTop: 4 }}>
                      🪙 {top3[0].coins} · 🔥 {top3[0].streak_count} días
                    </div>
                  </div>
                )}

                {/* 3RD PLACE */}
                {top3[2] && (
                  <div style={{
                    background: "rgba(205, 127, 50, 0.15)",
                    border: "1px solid #cd7f32",
                    borderRadius: 16,
                    padding: 15,
                    textAlign: "center",
                    boxShadow: "0 0 15px rgba(205, 127, 50, 0.2)"
                  }}>
                    <span style={{ fontSize: "2rem" }}>🥉</span>
                    <h4 style={{ color: "#e6c280", margin: "5px 0", fontSize: "0.95rem" }}>{top3[2].username}</h4>
                    <p style={{ color: "#ffd166", fontSize: "0.85rem", margin: 0, fontWeight: "bold" }}>{top3[2].xp} XP</p>
                    <div style={{ fontSize: "0.75rem", color: "#9be6df", marginTop: 4 }}>
                      🪙 {top3[2].coins} · 🔥 {top3[2].streak_count}d
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REST OF RANKINGS LIST */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {ranking.map((st) => (
                <li 
                  key={st.id}
                  style={{
                    background: st.rank <= 3 ? "rgba(255, 209, 102, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: st.rank <= 3 ? "1px solid rgba(255, 209, 102, 0.2)" : "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: 12,
                    padding: "12px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontWeight: "bold", fontSize: "1.1rem", minWidth: 35, color: "#ffd166" }}>
                      {getRankBadge(st.rank)}
                    </span>
                    <div>
                      <strong style={{ color: "#e6f7ff", fontSize: "1rem" }}>{st.username}</strong>
                      <div style={{ fontSize: "0.78rem", color: "#9be6df" }}>
                        Traje: <span style={{ color: "#b8fff9" }}>{st.selected_outfit}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#b8fff9", fontWeight: "bold", fontSize: "0.95rem" }}>
                        {st.xp} XP
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#ffd166" }}>
                        🪙 {st.coins}
                      </div>
                    </div>
                    {st.streak_count > 0 && (
                      <span style={{
                        background: "rgba(255, 107, 107, 0.15)",
                        border: "1px solid #ff6b6b",
                        color: "#ff8e8e",
                        fontSize: "0.78rem",
                        padding: "3px 8px",
                        borderRadius: 20,
                        fontWeight: "bold"
                      }}>
                        🔥 {st.streak_count}d
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
