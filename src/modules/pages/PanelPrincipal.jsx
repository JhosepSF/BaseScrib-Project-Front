import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Panel.css";
import { AuthHome } from "../components/AuthHome";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { TeacherPanel } from "../components/TeacherPanel";
import { StudentPanel } from "../components/StudentPanel";
import { RoomCreated } from "../components/RoomCreated";
import { RoomView } from "../components/RoomView";
import { API_BASE } from "../../config";

export function PanelPrincipal() {
  const navigate = useNavigate();
  const [step, setStep] = useState("home");
  const [token, setToken] = useState(localStorage.getItem("basescrib_token") || "");
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warpTransition, setWarpTransition] = useState(false);
  const [warpText, setWarpText] = useState("⚡ VIAJANDO...");

  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [registerRole, setRegisterRole] = useState("student");
  const [studentGrade, setStudentGrade] = useState("");
  const [studentSection, setStudentSection] = useState("A");
  const [newRoomName, setNewRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinKey, setJoinKey] = useState("");

  const resetState = () => {
    setToken("");
    setUser(null);
    setRooms([]);
    setJoinedRoom(null);
    setCreatedRoom(null);
    setAuthUsername("");
    setAuthPassword("");
    setAuthEmail("");
    setRegisterRole("student");
    setStudentGrade("");
    setStudentSection("A");
    setNewRoomName("");
    setJoinCode("");
    setJoinKey("");
    setError("");
    setStep("home");
    localStorage.removeItem("basescrib_token");
  };

  const fetchMyRooms = useCallback(async (accessToken) => {
    try {
      const res = await fetch(`${API_BASE}/rooms/my_rooms/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      setRooms(data);
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, []);

  const fetchUser = useCallback(async (accessToken) => {
    try {
      const res = await fetch(`${API_BASE}/users/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        throw new Error("Token inválido");
      }
      const data = await res.json();
      setUser(data);
      const roomsData = await fetchMyRooms(accessToken);
      if (data.role === "teacher") {
        setStep("teacher");
      } else if (roomsData.length > 0) {
        setJoinedRoom(roomsData[0]);
        setStep("in-room");
      } else {
        setStep("student");
      }
    } catch (err) {
      resetState();
    }
  }, [fetchMyRooms]);

  useEffect(() => {
    if (!token) return;
    fetchUser(token);
  }, [token, fetchUser]);

  const loginUser = async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Credenciales incorrectas");
    }

    const data = await res.json();
    const accessToken = data.access;
    
    // Play hyperspace warp speed jump animation
    setWarpText("⚡ VIAJANDO A LOS DORMITORIOS DE LA BASE... ⚡");
    setWarpTransition(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setToken(accessToken);
    localStorage.setItem("basescrib_token", accessToken);
    setWarpTransition(false);
  };

  const changeStepWithWarp = async (newStep) => {
    if (newStep === "login") {
      setWarpText("🚀 INGRESANDO A LA CABINA DE MANDO... 🚀");
    } else if (newStep === "register") {
      setWarpText("📋 PREPARANDO PROTOCOLO DE REGISTRO... 📋");
    } else {
      setWarpText("⚡ ACCEDIENDO AL SISTEMA... ⚡");
    }
    setWarpTransition(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStep(newStep);
    setWarpTransition(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginUser(authUsername, authPassword);
      setAuthPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validations
    if (!authUsername || authUsername.length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      return;
    }
    if (!authEmail || !/^\S+@\S+\.\S+$/.test(authEmail)) {
      setError("Por favor ingresa un email válido");
      return;
    }
    if (!authPassword || authPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (registerRole === "student" && (!studentGrade || studentGrade.trim() === "")) {
      setError("Ingresa el grado del estudiante");
      return;
    }

    setLoading(true);

    try {
      const body = {
        username: authUsername,
        password: authPassword,
        email: authEmail,
        first_name: authUsername,
        last_name: registerRole === "teacher" ? "Teacher" : `Grade ${studentGrade}`,
        role: registerRole,
      };
      const res = await fetch(`${API_BASE}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        const message = data.username ? data.username.join(" ") : data.detail || "Error de registro";
        throw new Error(message);
      }

      await loginUser(authUsername, authPassword);
      setAuthPassword("");
      setAuthUsername("");
      setAuthEmail("");
      setStudentGrade("");
      setStudentSection("A");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/rooms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoomName || `Room ${Date.now()}` }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "No se pudo crear la room");
      }

      const room = await res.json();
      setCreatedRoom(room);
      setRooms((prev) => [...prev, room]);
      setNewRoomName("");
      setStep("teacher-room");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/rooms/join_room/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: joinCode.toUpperCase(), key: joinKey.toUpperCase() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Código o clave incorrectos");
      }

      const data = await res.json();
      setJoinedRoom(data.room);
      await fetchMyRooms(token);
      setStep("in-room");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    resetState();
  };

  return (
    <div className={`container space-bg ${
      step === "in-room" ? "user-room-bg" : 
      token ? "user-dormitories-bg" : 
      step === "login" ? "user-cabin-bg" : 
      "user-lobby-bg"
    }`}>
      {/* Dynamic comets layer */}
      <div className="comet-layer">
        <div className="comet comet-1" />
        <div className="comet comet-2" />
        <div className="comet comet-3" />
        <div className="comet comet-4" />
        <div className="comet comet-5" />
      </div>

      {/* Sci-fi transition overlay */}
      {warpTransition && (
        <div className="warp-transition-overlay">
          <div className="warp-lines" />
          <div className="warp-text">{warpText}</div>
        </div>
      )}
      <header className="panel-header">
        <h1 className={!token ? "home-title-comic" : ""}>BaseScrib</h1>
        <p className="tagline">Gamified writing practice — Student & Teacher portal</p>
        {user && (
          <div className="user-info" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>{user.username} ({user.role})</span>
            {user.role === "student" && (
              <>
                <span style={{
                  background: "rgba(255, 107, 107, 0.15)",
                  border: "1px solid #ff6b6b",
                  color: "#ff8e8e",
                  fontSize: "0.85rem",
                  padding: "4px 10px",
                  borderRadius: "14px",
                  fontWeight: "bold"
                }}>
                  🔥 {user.streak_count || 0}d Racha
                </span>

                <button 
                  onClick={() => navigate("/avatar")} 
                  className="btn-avatar"
                  style={{
                    margin: 0,
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    background: "linear-gradient(135deg, #2ec4b6, #26a399)",
                    color: "#002427",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                >
                  🎨 Avatar 3D
                </button>
              </>
            )}
            <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
          </div>
        )}
      </header>

      {error && <div className="error-message">{error}</div>}

      {step === "home" && !token && <AuthHome setStep={changeStepWithWarp} setRegisterRole={setRegisterRole} />}
      {step === "login" && !token && (
        <LoginForm
          authUsername={authUsername}
          authPassword={authPassword}
          setAuthUsername={setAuthUsername}
          setAuthPassword={setAuthPassword}
          handleLogin={handleLogin}
          loading={loading}
          error={error}
          setStep={setStep}
        />
      )}
      {step === "register" && !token && (
        <RegisterForm
          authUsername={authUsername}
          authPassword={authPassword}
          authEmail={authEmail}
          setAuthUsername={setAuthUsername}
          setAuthPassword={setAuthPassword}
          setAuthEmail={setAuthEmail}
          registerRole={registerRole}
          setRegisterRole={setRegisterRole}
          studentGrade={studentGrade}
          setStudentGrade={setStudentGrade}
          studentSection={studentSection}
          setStudentSection={setStudentSection}
          handleRegister={handleRegister}
          loading={loading}
          error={error}
          setStep={setStep}
        />
      )}
      {token && user?.role === "teacher" && step === "teacher" && (
        <TeacherPanel
          newRoomName={newRoomName}
          setNewRoomName={setNewRoomName}
          handleCreateRoom={handleCreateRoom}
          loading={loading}
          rooms={rooms}
          handleLogout={handleLogout}
        />
      )}

      {token && user?.role === "teacher" && step === "teacher-room" && createdRoom && (
        <RoomCreated createdRoom={createdRoom} setStep={setStep} />
      )}

      {token && user?.role === "student" && step === "student" && (
        <StudentPanel
          joinedRoom={joinedRoom}
          joinCode={joinCode}
          setJoinCode={setJoinCode}
          joinKey={joinKey}
          setJoinKey={setJoinKey}
          handleJoinRoom={handleJoinRoom}
          loading={loading}
          handleLogout={handleLogout}
          setStep={setStep}
        />
      )}

      {token && user?.role === "student" && step === "in-room" && joinedRoom && (
        <RoomView joinedRoom={joinedRoom} setStep={setStep} />
      )}

      <footer className="panel-footer">BaseScrib</footer>
    </div>
  );
}
