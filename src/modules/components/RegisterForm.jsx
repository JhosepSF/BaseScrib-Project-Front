import PropTypes from "prop-types";

export function RegisterForm({
  authUsername,
  authPassword,
  authEmail,
  setAuthUsername,
  setAuthPassword,
  setAuthEmail,
  registerRole,
  setRegisterRole,
  studentGrade,
  setStudentGrade,
  studentSection,
  setStudentSection,
  handleRegister,
  loading,
  setStep,
}) {
  return (
    <div className="auth-card">
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <label>Tipo de cuenta</label>
        <div className="role-buttons">
          <button
            type="button"
            className={registerRole === "student" ? "btn-student active" : "btn-teacher"}
            onClick={() => setRegisterRole("student")}
          >
            Estudiante
          </button>
        </div>

        <label>Usuario</label>
        <input
          required
          value={authUsername}
          onChange={(e) => setAuthUsername(e.target.value)}
          placeholder="Usuario"
        />

        <label>Email</label>
        <input
          required
          type="email"
          value={authEmail}
          onChange={(e) => setAuthEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
        />

        <label>Contraseña</label>
        <input
          required
          type="password"
          value={authPassword}
          onChange={(e) => setAuthPassword(e.target.value)}
          placeholder="Contraseña"
        />

        {registerRole === "student" && (
          <>
            <label>Grado</label>
            <input
              required
              value={studentGrade}
              onChange={(e) => setStudentGrade(e.target.value)}
              placeholder="4"
            />
            <label>Sección</label>
            <select value={studentSection} onChange={(e) => setStudentSection(e.target.value)}>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-create">
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          <button type="button" onClick={() => setStep("home")} className="btn-cancel">Volver</button>
        </div>
      </form>
    </div>
  );
}
RegisterForm.propTypes = {
  authUsername: PropTypes.string.isRequired,
  authPassword: PropTypes.string.isRequired,
  authEmail: PropTypes.string.isRequired,
  setAuthUsername: PropTypes.func.isRequired,
  setAuthPassword: PropTypes.func.isRequired,
  setAuthEmail: PropTypes.func.isRequired,
  registerRole: PropTypes.string.isRequired,
  setRegisterRole: PropTypes.func.isRequired,
  studentGrade: PropTypes.string.isRequired,
  setStudentGrade: PropTypes.func.isRequired,
  studentSection: PropTypes.string.isRequired,
  setStudentSection: PropTypes.func.isRequired,
  handleRegister: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setStep: PropTypes.func.isRequired,
};