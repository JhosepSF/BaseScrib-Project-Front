import PropTypes from "prop-types";

export function LoginForm({ authUsername, authPassword, setAuthUsername, setAuthPassword, handleLogin, loading, setStep }) {
  return (
    <div className="auth-card">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <label>Usuario</label>
        <input
          required
          value={authUsername}
          onChange={(e) => setAuthUsername(e.target.value)}
          placeholder="Usuario"
        />
        <label>Contraseña</label>
        <input
          required
          type="password"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-create">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <button type="button" onClick={() => setStep("home")} className="btn-cancel">Volver</button>
        </div>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  authUsername: PropTypes.string.isRequired,
  authPassword: PropTypes.string.isRequired,
  setAuthUsername: PropTypes.func.isRequired,
  setAuthPassword: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
};
