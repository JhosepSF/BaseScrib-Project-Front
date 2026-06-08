import PropTypes from "prop-types";

export function TeacherPanel({
  newRoomName,
  setNewRoomName,
  handleCreateRoom,
  loading,
  rooms,
  handleLogout,
}) {
  return (
    <div className="teacher-panel">
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
          <button type="button" onClick={handleLogout} className="btn-cancel">Cerrar sesión</button>
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
