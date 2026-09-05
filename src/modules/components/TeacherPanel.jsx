import { useState } from "react";
import PropTypes from "prop-types";
import { TeacherWritingInbox } from "./TeacherWritingInbox";

export function TeacherPanel({
  newRoomName,
  setNewRoomName,
  handleCreateRoom,
  loading,
  rooms,
  handleLogout,
  token,
}) {
  const [activeTab, setActiveTab] = useState("rooms"); // "rooms" or "writing"

  return (
    <div className="teacher-panel" style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      {/* Top Header & Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid rgba(46, 196, 182, 0.3)", paddingBottom: "14px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setActiveTab("rooms")}
            style={{
              padding: "10px 22px",
              borderRadius: "20px",
              background: activeTab === "rooms" ? "linear-gradient(135deg, #2ec4b6, #208b81)" : "rgba(255,255,255,0.05)",
              border: activeTab === "rooms" ? "1.5px solid #ffffff" : "1.5px solid rgba(255,255,255,0.2)",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            🚀 Mis Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab("writing")}
            style={{
              padding: "10px 22px",
              borderRadius: "20px",
              background: activeTab === "writing" ? "linear-gradient(135deg, #ffd166, #ff9f1c)" : "rgba(255,255,255,0.05)",
              border: activeTab === "writing" ? "1.5px solid #ffffff" : "1.5px solid rgba(255,255,255,0.2)",
              color: activeTab === "writing" ? "#0d1b2a" : "#ffffff",
              fontWeight: "bold",
              fontSize: "0.95rem",
              cursor: "pointer"
            }}
          >
            ✉️ Bandeja de Calificación Writing
          </button>
        </div>
        <button onClick={handleLogout} className="btn-cancel" style={{ padding: "8px 18px", borderRadius: "16px" }}>
          Cerrar Sesión
        </button>
      </div>

      {activeTab === "rooms" ? (
        <div>
          <h2>Panel docente — Crear rooms</h2>
          <form onSubmit={handleCreateRoom} className="room-form">
            <label>Nombre de la room (opcional)</label>
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Ej: 4A - Unit 1"
            />
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-create">
                {loading ? "Creando..." : "Crear room"}
              </button>
            </div>
          </form>

          <h3>Mis rooms ({rooms.length})</h3>
          <ul className="room-list">
            {rooms.length === 0 ? (
              <li className="room-item">Aún no tienes rooms.</li>
            ) : (
              rooms.map((r) => (
                <li key={r.id} className="room-item">
                  <strong>{r.name}</strong> — Código: <code>{r.code}</code> | Clave: <code>{r.key}</code> | Estudiantes: {r.students_count}
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        <TeacherWritingInbox token={token || localStorage.getItem("basescrib_token")} />
      )}
    </div>
  );
}

TeacherPanel.propTypes = {
  newRoomName: PropTypes.string.isRequired,
  setNewRoomName: PropTypes.func.isRequired,
  handleCreateRoom: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  rooms: PropTypes.array.isRequired,
  handleLogout: PropTypes.func.isRequired,
};
