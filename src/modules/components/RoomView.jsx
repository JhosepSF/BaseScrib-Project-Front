import { useState } from "react";
import PropTypes from "prop-types";
import { RoomActivityPanel } from "./RoomActivityPanel";

export function RoomView({ joinedRoom, setStep }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return <RoomActivityPanel joinedRoom={joinedRoom} onBack={() => setIsPlaying(false)} />;
  }

  return (
    <div className="in-room">
      <h2>Estás en {joinedRoom.name}</h2>
      <p>Código: <code>{joinedRoom.code}</code></p>
      <p>Clave: <code>{joinedRoom.key}</code></p>
      <div className="in-room-actions">
        <button onClick={() => setIsPlaying(true)} className="btn-start">Entrar a la room</button>
        <button onClick={() => setStep("student")} className="btn-leave">Volver</button>
      </div>
    </div>
  );
}

RoomView.propTypes = {
  joinedRoom: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
  setStep: PropTypes.func.isRequired,
};

