import PropTypes from "prop-types";

export function RoomCreated({ createdRoom, setStep }) {
  return (
    <div className="created-room">
      <h2>Room creada</h2>
      <p><strong>{createdRoom.name}</strong></p>
      <p>Código: <code>{createdRoom.code}</code></p>
      <p>Clave: <code>{createdRoom.key}</code></p>
      <p className="hint">Comparte estos datos con tus estudiantes.</p>
      <button onClick={() => setStep("teacher")} className="btn-back">Volver al panel</button>
    </div>
  );
}

RoomCreated.propTypes = {
  createdRoom: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
  setStep: PropTypes.func.isRequired,
};
