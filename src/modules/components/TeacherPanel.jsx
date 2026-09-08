import { useState } from "react";
import PropTypes from "prop-types";
import { TeacherWritingInbox } from "./TeacherWritingInbox";
import { API_BASE } from "../../config";

export function TeacherPanel({
  newRoomName,
  setNewRoomName,
  handleCreateRoom,
  loading,
  rooms,
  setRooms,
  handleLogout,
  token,
}) {
  const [activeTab, setActiveTab] = useState("rooms"); // "rooms" or "writing"
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (roomId) => {
    if (!roomId) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const authToken = token || localStorage.getItem("basescrib_token") || "";
      const res = await fetch(`${API_BASE}/rooms/${roomId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Error" }));
        throw new Error(err.detail || "No se pudo eliminar la sala");
      }
      if (setRooms) {
        setRooms(prev => prev.filter(r => r.id !== roomId));
      }
      setRoomToDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

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
                <li key={r.id} className="room-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{r.name}</strong> — Código: <code>{r.code}</code> | Clave: <code>{r.key}</code> | Estudiantes: {r.students_count}
                  </div>
                  <button
                    onClick={() => setRoomToDelete(r)}
                    style={{
                      background: "rgba(255, 107, 107, 0.15)",
                      border: "1px solid #ff6b6b",
                      color: "#ff6b6b",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginLeft: "10px"
                    }}
                    title="Eliminar esta clase"
                  >
                    🗑️ Eliminar
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        <TeacherWritingInbox token={token || localStorage.getItem("basescrib_token")} />
      )}

      {/* MODAL DE ADVERTENCIA PARA ELIMINAR SALA */}
      {roomToDelete && (
        <div className="modal-overlay animate-fadeIn" style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(3, 7, 18, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div className="modal-card animate-scaleUp" style={{
            background: "linear-gradient(135deg, #180a1e, #0b1329)",
            border: "2px solid #ff6b6b",
            borderRadius: "20px",
            padding: "26px",
            maxWidth: "480px",
            width: "90%",
            boxShadow: "0 0 40px rgba(255, 107, 107, 0.4)",
            color: "#ffffff",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>⚠️</div>
            <h2 style={{ color: "#ff6b6b", margin: "0 0 10px 0", fontSize: "1.35rem" }}>
              ¿Eliminar la Clase &quot;{roomToDelete.name}&quot;?
            </h2>
            <p style={{ color: "#e2e8f0", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "18px" }}>
              Esta acción <strong>borrará permanentemente</strong> la sala (Código: <code>{roomToDelete.code}</code>) y los estudiantes perderán el acceso a esta clase. <strong>No se puede deshacer.</strong>
            </p>
            {deleteError && (
              <div style={{ color: "#ff6b6b", marginBottom: "12px", fontSize: "0.85rem" }}>
                {deleteError}
              </div>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => setRoomToDelete(null)}
                disabled={deleting}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  padding: "10px 22px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(roomToDelete.id)}
                disabled={deleting}
                style={{
                  background: "linear-gradient(135deg, #ff6b6b, #c92a2a)",
                  border: "none",
                  color: "#ffffff",
                  padding: "10px 24px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 0 15px rgba(255, 107, 107, 0.5)"
                }}
              >
                {deleting ? "Eliminando..." : "Sí, eliminar clase"}
              </button>
            </div>
          </div>
        </div>
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
  setRooms: PropTypes.func,
  handleLogout: PropTypes.func.isRequired,
  token: PropTypes.string,
};

