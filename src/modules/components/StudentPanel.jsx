import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export function StudentPanel({
  joinedRoom,
  joinCode,
  setJoinCode,
  joinKey,
  setJoinKey,
  handleJoinRoom,
  loading,
  handleLogout,
  setStep,
}) {
  const navigate = useNavigate();

  return (
    <div className="student-panel">
      <h2>Panel estudiante</h2>
      {joinedRoom ? (
        <div className="room-card">
          <h3>{joinedRoom.name}</h3>
          <p>Código: <code>{joinedRoom.code}</code></p>
          <p>Clave: <code>{joinedRoom.key}</code></p>
          <div className="form-actions">
            <button onClick={() => setStep("in-room")} className="btn-start">Ir a mi room</button>
            <button onClick={handleLogout} className="btn-cancel">Cerrar sesión</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleJoinRoom} className="student-form">
          <label>Código de room</label>
          <input
            required
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Código proporcionado por tu docente"
          />

          <label>Clave</label>
          <input
            required
            value={joinKey}
            onChange={(e) => setJoinKey(e.target.value)}
            placeholder="Clave proporcionada por tu docente"
          />

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-join">
              {loading ? "Uniéndose..." : "Unirse a room"}
            </button>
            <button type="button" onClick={handleLogout} className="btn-cancel">Cerrar sesión</button>
          </div>
        </form>
      )}

      <div style={{ marginTop: 25, paddingTop: 20, borderTop: "1px solid rgba(184, 255, 249, 0.15)", width: "100%" }}>
        <button 
          onClick={() => navigate("/avatar")} 
          className="btn-start" 
          style={{ 
            width: "100%", 
            margin: "5px 0", 
            background: "linear-gradient(135deg, #2ec4b6, #1f857b)", 
            color: "#e6f7ff" 
          }}
        >
          🎨 Personalizar mi Astronauta 3D
        </button>
      </div>
    </div>
  );
}
StudentPanel.propTypes = {
  joinedRoom: PropTypes.shape({
    name: PropTypes.string,
    code: PropTypes.string,
    key: PropTypes.string,
  }),
  joinCode: PropTypes.string.isRequired,
  setJoinCode: PropTypes.func.isRequired,
  joinKey: PropTypes.string.isRequired,
  setJoinKey: PropTypes.func.isRequired,
  handleJoinRoom: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
};