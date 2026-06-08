import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export function AuthHome({ setStep, setRegisterRole }) {
  const navigate = useNavigate();
  return (
    <div className="entry-card">
      <h2>Bienvenido a BaseScrib</h2>
      <div className="role-buttons">
        <button onClick={() => setStep("login")} className="btn-student">Ingresar</button>
        <button
          onClick={() => { setRegisterRole("student"); setStep("register"); }}
          className="btn-teacher"
        >
          Registrarse (Estudiante)
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => navigate('/teacher')}
          className="btn-cancel"
          style={{ padding: '8px 14px', borderRadius: 8 }}
        >
          Panel Docente
        </button>
      </div>
    </div>
  );
}

AuthHome.propTypes = {
  setStep: PropTypes.func.isRequired,
  setRegisterRole: PropTypes.func.isRequired,
};
