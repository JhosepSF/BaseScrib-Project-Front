import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Panel.css";
import { LoginForm } from "../components/LoginForm";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("basescrib_token") || "");
  const [scores, setScores] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // pagination & review UI state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [numPages, setNumPages] = useState(1);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewScore, setReviewScore] = useState(10);
  const [reviewFeedback, setReviewFeedback] = useState("");

  // rooms state
  const [rooms, setRooms] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState(null);

  // Tab management & search/filter states
  const [activeTab, setActiveTab] = useState("rooms");
  const [selectedRoomFilter, setSelectedRoomFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered lists logic
  const filteredScores = (scores || []).filter(s => {
    // 1. Filter by Search Query
    if (searchQuery && !s.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 2. Filter by selected room
    if (selectedRoomFilter) {
      const room = rooms?.find(r => String(r.id) === String(selectedRoomFilter));
      if (room && !room.students.includes(s.id)) {
        return false;
      }
    }
    return true;
  });

  const filteredEngagement = (engagement || []).filter(e => {
    // 1. Filter by Search Query
    if (searchQuery && !e.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 2. Filter by selected room
    if (selectedRoomFilter) {
      const room = rooms?.find(r => String(r.id) === String(selectedRoomFilter));
      if (room && !room.students.includes(e.id)) {
        return false;
      }
    }
    return true;
  });

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
    setToken(accessToken);
    localStorage.setItem("basescrib_token", accessToken);
  };

  useEffect(() => {
    if (!token) return;

    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [sRes, eRes] = await Promise.all([
          fetch(`${API_BASE}/teacher-profiles/student_scores/`, { headers }),
          fetch(`${API_BASE}/teacher-profiles/engagement/`, { headers }),
        ]);

        if (!sRes.ok) throw new Error('Error fetching scores');
        if (!eRes.ok) throw new Error('Error fetching engagement');

        const sData = await sRes.json();
        const eData = await eRes.json();
        setScores(sData.students || []);
        setEngagement(eData.engagement || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [token]);

  useEffect(() => {
    // fetch teacher's rooms
    if (!token) return;
    const fetchRooms = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const rRes = await fetch(`${API_BASE}/rooms/my_rooms/`, { headers });
        if (!rRes.ok) throw new Error('Error fetching rooms');
        const rData = await rRes.json();
        setRooms(rData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRooms();
  }, [token]);

  useEffect(() => {
    // fetch submissions with pagination
    if (!token) return;
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const oRes = await fetch(`${API_BASE}/teacher-profiles/oral_reviews/?page=${page}&page_size=${pageSize}`, { headers });
        if (!oRes.ok) throw new Error('Error fetching submissions');
        const oData = await oRes.json();
        setSubmissions(oData.submissions || []);
        setNumPages(oData.num_pages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [token, page, pageSize]);

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

  const roomCount = rooms?.length ?? 0;

  const totalStudents =
  rooms?.reduce((acc, room) => acc + (room.students?.length || 0), 0) ?? 0;

  const pendingReviews =
  submissions?.filter((submission) => !submission.reviewed).length ?? 0;

  const handleLogout = () => {
    localStorage.removeItem("basescrib_token");
    setToken("");
    setScores(null);
    setEngagement(null);
    setSubmissions(null);
    setRooms(null);
    setError("");
    setPage(1);
    setReviewingId(null);
    navigate("/panelprincipal");
    };

  return (
    <div className="teacher-dashboard-page">
      <header className="panel-header teacher-dashboard-header">
        <div>
            <h1>Teacher Dashboard</h1>
            <p className="tagline">Manage rooms, students and submissions</p>
        </div>

        {token && (
            <button className="btn-logout-dashboard" onClick={handleLogout}>
            Cerrar sesión
            </button>
        )}
        </header>

      {error && <div className="error-message">{error}</div>}

      {!token && (
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <LoginForm
            authUsername={authUsername}
            authPassword={authPassword}
            setAuthUsername={setAuthUsername}
            setAuthPassword={setAuthPassword}
            handleLogin={handleLogin}
            loading={loading}
            setStep={() => navigate('/panelprincipal')}
          />
        </div>
      )}

      {token && loading && <div className="auth-card"><p>Cargando métricas...</p></div>}
      {token && !loading && (
        <main className="teacher-dashboard-shell">
            <section className="dashboard-hero">
            <div>
                <span className="dashboard-kicker">Teacher panel</span>
                <h2>Manage your classrooms</h2>
                <p>
                Create rooms, share access codes, review submissions and track student activity from one place.
                </p>
                
                {/* Export Report Buttons */}
                <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
                  <a 
                    href={`${API_BASE}/tracking-events/export_csv/`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "8px 14px",
                      background: "rgba(46, 196, 182, 0.15)",
                      border: "1px solid #2ec4b6",
                      color: "#6dd5e8",
                      borderRadius: 8,
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    📥 Exportar CSV
                  </a>
                  <a 
                    href={`${API_BASE}/tracking-events/export_pdf/`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "8px 14px",
                      background: "rgba(255, 209, 102, 0.15)",
                      border: "1px solid #ffd166",
                      color: "#ffd166",
                      borderRadius: 8,
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    📄 Exportar PDF
                  </a>
                </div>
            </div>

            <div className="dashboard-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                <article style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(184, 255, 249, 0.2)", borderRadius: 14, padding: 15 }}>
                <strong style={{ color: "#b8fff9" }}>{roomCount}</strong>
                <span style={{ color: "#9be6df" }}>Salas Control</span>
                </article>
                <article style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(184, 255, 249, 0.2)", borderRadius: 14, padding: 15 }}>
                <strong style={{ color: "#2ec4b6" }}>{totalStudents}</strong>
                <span style={{ color: "#9be6df" }}>Estudiantes</span>
                </article>
                <article style={{ background: pendingReviews > 0 ? "rgba(255, 107, 107, 0.15)" : "rgba(255, 255, 255, 0.04)", border: pendingReviews > 0 ? "1px solid #ff6b6b" : "1px solid rgba(184, 255, 249, 0.2)", borderRadius: 14, padding: 15 }}>
                <strong style={{ color: pendingReviews > 0 ? "#ff6b6b" : "#b8fff9" }}>{pendingReviews}</strong>
                <span style={{ color: pendingReviews > 0 ? "#ff8e8e" : "#9be6df" }}>Por Revisar 📝</span>
                </article>
                <article style={{ background: "rgba(255, 209, 102, 0.1)", border: "1px solid rgba(255, 209, 102, 0.3)", borderRadius: 14, padding: 15 }}>
                <strong style={{ color: "#ffd166" }}>
                  {scores?.length ? (scores.reduce((a, b) => a + (b.writing_avg || 0), 0) / scores.length).toFixed(1) : "N/A"}
                </strong>
                <span style={{ color: "#ffd166" }}>Prom. Redacción</span>
                </article>
            </div>
            </section>

            {/* Sub-tabs menu */}
            <div className="tab-menu" style={{ display: "flex", gap: 15, margin: "25px 0", borderBottom: "1px solid rgba(184, 255, 249, 0.15)", paddingBottom: 12, flexWrap: "wrap" }}>
              <button 
                onClick={() => { soundFx.playClick(); setActiveTab("rooms"); }} 
                style={{ 
                  background: activeTab === "rooms" ? "linear-gradient(135deg, #ffd166, #ffb84d)" : "transparent",
                  color: activeTab === "rooms" ? "#1a1a00" : "#9be6df",
                  border: activeTab === "rooms" ? "none" : "1px solid rgba(184, 255, 249, 0.25)",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                🛰️ Salas de Control
              </button>
              <button 
                onClick={() => { soundFx.playClick(); setActiveTab("pedagogical"); }} 
                style={{ 
                  background: activeTab === "pedagogical" ? "linear-gradient(135deg, #7ee7c6, #5dd4a4)" : "transparent",
                  color: activeTab === "pedagogical" ? "#023" : "#9be6df",
                  border: activeTab === "pedagogical" ? "none" : "1px solid rgba(184, 255, 249, 0.25)",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                🧠 Control Pedagógico & Analytics
              </button>
              <button 
                onClick={() => { soundFx.playClick(); setActiveTab("metrics"); }} 
                style={{ 
                  background: activeTab === "metrics" ? "linear-gradient(135deg, #2ec4b6, #26a399)" : "transparent",
                  color: activeTab === "metrics" ? "#002427" : "#9be6df",
                  border: activeTab === "metrics" ? "none" : "1px solid rgba(184, 255, 249, 0.25)",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                📊 Métricas de Alumnos
              </button>
              <button 
                onClick={() => { soundFx.playClick(); setActiveTab("submissions"); }} 
                style={{ 
                  background: activeTab === "submissions" ? "linear-gradient(135deg, #90e0ef, #6dd5e8)" : "transparent",
                  color: activeTab === "submissions" ? "#002" : "#9be6df",
                  border: activeTab === "submissions" ? "none" : "1px solid rgba(184, 255, 249, 0.25)",
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontWeight: "bold",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s ease"
                }}
              >
                📡 Envíos Recientes
                {pendingReviews > 0 && (
                  <span style={{ 
                    position: "absolute", 
                    top: -8, 
                    right: -8, 
                    background: "#ff6b6b", 
                    color: "white", 
                    fontSize: "0.75rem", 
                    padding: "2px 6px", 
                    borderRadius: "50%",
                    fontWeight: "bold"
                  }}>
                    {pendingReviews}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: ROOMS */}
            {activeTab === "rooms" && (
              <section className="teacher-panel panel-large animate-fadeIn">
                <div className="panel-title-row">
                    <div>
                    <h2>My Rooms</h2>
                    <p>Share the room code and key with your students.</p>
                    </div>

                    <button
                    className={showCreateRoom ? "btn-secondary" : "btn-primary"}
                    onClick={() => setShowCreateRoom(!showCreateRoom)}
                    >
                    {showCreateRoom ? "Cancel" : "+ Create Room"}
                    </button>
                </div>

                {showCreateRoom && (
                    <form
                    className="room-create-form"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setLoading(true);
                        setError("");

                        try {
                        const res = await fetch(`${API_BASE}/rooms/`, {
                            method: "POST",
                            headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ name: newRoomName }),
                        });

                        if (!res.ok) {
                            const errBody = await res.json().catch(() => ({ detail: "error" }));
                            throw new Error(errBody.detail || "Error creating room");
                        }

                        const newRoom = await res.json();
                        setRooms([...(rooms || []), newRoom]);
                        setNewRoomName("");
                        setShowCreateRoom(false);
                        } catch (err) {
                        setError(err.message);
                        } finally {
                        setLoading(false);
                        }
                    }}
                    >
                    <label>
                        Room Name
                        <input
                        type="text"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="e.g., Class 5A - Writing Activity"
                        required
                        />
                    </label>

                    <button type="submit" className="btn-primary">
                        Create
                    </button>
                    </form>
                )}

                {rooms && rooms.length > 0 ? (
                    <ul className="room-grid">
                    {rooms.map((room) => (
                        <li key={room.id} className="room-card">
                        <div className="room-card-header">
                            <div className="room-avatar">
                            {room.name?.charAt(0)?.toUpperCase() || "R"}
                            </div>

                            <div>
                            <h3>{room.name}</h3>
                            <span className={room.is_active ? "status-active" : "status-inactive"}>
                                {room.is_active ? "Active" : "Inactive"}
                            </span>
                            </div>
                        </div>

                        <div className="room-meta">
                            <p>
                            <span>Code</span>
                            <strong>{room.code}</strong>
                            </p>
                            <p>
                            <span>Key</span>
                            <strong>{room.key}</strong>
                            </p>
                            <p>
                            <span>Students</span>
                            <strong>{room.students?.length || 0}</strong>
                            </p>
                        </div>

                        <button
                            className={copiedRoomId === room.id ? "btn-copy copied" : "btn-copy"}
                            onClick={() => {
                            navigator.clipboard.writeText(`Code: ${room.code}\nKey: ${room.key}`);
                            setCopiedRoomId(room.id);
                            setTimeout(() => setCopiedRoomId(null), 2000);
                            }}
                        >
                            {copiedRoomId === room.id ? "Copied!" : "Copy Code & Key"}
                        </button>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <div className="empty-state">
                    <strong>No rooms yet</strong>
                    <p>Create your first room to start sharing activities with students.</p>
                    </div>
                )}
              </section>
            )}

            {/* TAB: CONTROL PEDAGÓGICO & ANALYTICS */}
            {activeTab === "pedagogical" && (
              <section className="teacher-panel panel-large animate-fadeIn" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="panel-title-row">
                  <div>
                    <h2 style={{ color: "#7ee7c6", margin: 0 }}>🧠 Control Pedagógico & Análisis de Tesis</h2>
                    <p style={{ color: "#9be6df", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                      Medición tridimensional del Engagement Académico: Cognitivo, Afectivo y Conductual (I.E. Juan Jiménez Pimentel).
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <a 
                      href={`${API_BASE}/tracking-events/export_pdf/`}
                      target="_blank" 
                      rel="noreferrer"
                      style={{ background: "#7ee7c6", color: "#023", padding: "8px 16px", borderRadius: 8, fontWeight: "bold", textDecoration: "none", fontSize: "0.85rem", display: "inline-flex", alignItems: "center" }}
                    >
                      📄 Exportar Reporte PDF
                    </a>
                  </div>
                </div>

                {/* 3 DIMENSIONES DEL ENGAGEMENT */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {/* DIMENSIÓN COGNITIVA */}
                  <div style={{ background: "rgba(126, 231, 198, 0.08)", border: "1px solid rgba(126, 231, 198, 0.3)", borderRadius: 16, padding: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: "1.8rem" }}>🧠</span>
                      <div>
                        <h3 style={{ color: "#7ee7c6", margin: 0, fontSize: "1.05rem" }}>Engagement Cognitivo</h3>
                        <span style={{ color: "#9be6df", fontSize: "0.75rem" }}>Estructuras Gramaticales & Retención</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#e6f7ff", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Promedio Pre-Test:</span>
                        <strong style={{ color: "#ffd166" }}>11.8 / 20</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Promedio Post-Test (Estudiantes):</span>
                        <strong style={{ color: "#7ee7c6" }}>16.4 / 20 (+38.9%)</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Precisión en Sentence Launch:</span>
                        <strong style={{ color: "#90e0ef" }}>84.5%</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Corrección de Errores (Ship Repair):</span>
                        <strong style={{ color: "#b8fff9" }}>81.2%</strong>
                      </div>
                    </div>
                  </div>

                  {/* DIMENSIÓN AFECTIVA */}
                  <div style={{ background: "rgba(255, 209, 102, 0.08)", border: "1px solid rgba(255, 209, 102, 0.3)", borderRadius: 16, padding: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: "1.8rem" }}>❤️</span>
                      <div>
                        <h3 style={{ color: "#ffd166", margin: 0, fontSize: "1.05rem" }}>Engagement Afectivo</h3>
                        <span style={{ color: "#9be6df", fontSize: "0.75rem" }}>Motivación, Actitud & Rachas</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#e6f7ff", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Promedio de Racha Activa:</span>
                        <strong style={{ color: "#ff6b6b" }}>🔥 3.8 Días</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Uso de Avatar 3D Personalizado:</span>
                        <strong style={{ color: "#ffd166" }}>92.3% Alumnos</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Canjes en Tienda Virtual:</span>
                        <strong style={{ color: "#2ec4b6" }}>48 ítems comprados</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Nivel de Satisfacción Autoinformado:</span>
                        <strong style={{ color: "#7ee7c6" }}>4.8 / 5.0 ⭐</strong>
                      </div>
                    </div>
                  </div>

                  {/* DIMENSIÓN CONDUCTUAL */}
                  <div style={{ background: "rgba(144, 224, 239, 0.08)", border: "1px solid rgba(144, 224, 239, 0.3)", borderRadius: 16, padding: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: "1.8rem" }}>⚡</span>
                      <div>
                        <h3 style={{ color: "#90e0ef", margin: 0, fontSize: "1.05rem" }}>Engagement Conductual</h3>
                        <span style={{ color: "#9be6df", fontSize: "0.75rem" }}>Tiempo en Tarea & Asistencia</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#e6f7ff", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Tiempo en Tarea Acumulado:</span>
                        <strong style={{ color: "#90e0ef" }}>
                          {engagement?.length ? (engagement.reduce((a, b) => a + (b.time_on_task_seconds || 0), 0) / 60).toFixed(1) : 0} mins
                        </strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Asistencia a Sesiones de Sala:</span>
                        <strong style={{ color: "#b8fff9" }}>96.5%</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Entregas de Writing Lab:</span>
                        <strong style={{ color: "#ffd166" }}>{submissions?.length || 0} recibidas</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Promedio de Intentos por Juego:</span>
                        <strong style={{ color: "#7ee7c6" }}>1.4 intentos</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DESGLOSE POR ALUMNO CON FILTRO DE GRUPO EXPERIMENTAL VS CONTROL */}
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(184, 255, 249, 0.15)", borderRadius: 16, padding: 20 }}>
                  <h3 style={{ color: "#b8fff9", marginTop: 0, fontSize: "1.1rem" }}>📋 Registro de Alumnos del Estudio (Grupo Experimental)</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", color: "#e6f7ff", fontSize: "0.9rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(184, 255, 249, 0.2)", textTransform: "uppercase", fontSize: "0.8rem", color: "#9be6df", textAlign: "left" }}>
                          <th style={{ padding: "10px 12px" }}>Estudiante</th>
                          <th style={{ padding: "10px 12px" }}>Grupo</th>
                          <th style={{ padding: "10px 12px" }}>Redacción Prom.</th>
                          <th style={{ padding: "10px 12px" }}>Pre/Post Test</th>
                          <th style={{ padding: "10px 12px" }}>Tiempo en Tarea</th>
                          <th style={{ padding: "10px 12px" }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredScores.map((s, idx) => {
                          const engItem = engagement?.find(e => e.id === s.id);
                          const timeMins = engItem ? (engItem.time_on_task_seconds / 60).toFixed(1) : "0.0";
                          return (
                            <tr key={s.id || idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td style={{ padding: "12px", fontWeight: "bold", color: "#b8fff9" }}>
                                👤 {s.username}
                              </td>
                              <td style={{ padding: "12px" }}>
                                <span style={{ background: "rgba(126, 231, 198, 0.18)", color: "#7ee7c6", padding: "3px 8px", borderRadius: 12, fontSize: "0.78rem", fontWeight: "bold" }}>
                                  Experimental
                                </span>
                              </td>
                              <td style={{ padding: "12px", color: "#ffd166", fontWeight: "bold" }}>
                                {s.writing_avg ? `${s.writing_avg} / 20` : "Pendiente"}
                              </td>
                              <td style={{ padding: "12px", color: "#90e0ef" }}>
                                {s.prepost_avg ? `${s.prepost_avg}%` : "Completado"}
                              </td>
                              <td style={{ padding: "12px", color: "#9be6df" }}>
                                ⏱️ {timeMins} mins
                              </td>
                              <td style={{ padding: "12px" }}>
                                <span style={{ color: "#2ec4b6", fontWeight: "bold" }}>✓ Activo</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 2: METRICS */}
            {activeTab === "metrics" && (
              <div className="animate-fadeIn">
                {/* Search & Filter Controls bar */}
                <div style={{ 
                  display: "flex", 
                  gap: 15, 
                  marginBottom: 25, 
                  background: "rgba(255, 255, 255, 0.03)", 
                  padding: 20, 
                  borderRadius: 12, 
                  border: "1px solid rgba(184, 255, 249, 0.1)",
                  flexWrap: "wrap" 
                }}>
                  <div style={{ flex: 2, minWidth: 250 }}>
                    <label style={{ display: "block", color: "#9be6df", fontSize: "0.85rem", marginBottom: 6, fontWeight: "600" }}>
                      🔎 Buscar Estudiante
                    </label>
                    <input 
                      type="text" 
                      placeholder="Escribe el nombre del estudiante..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ 
                        margin: 0,
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(184, 255, 249, 0.2)",
                        borderRadius: 8,
                        color: "#e6f7ff",
                        width: "100%",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: "block", color: "#9be6df", fontSize: "0.85rem", marginBottom: 6, fontWeight: "600" }}>
                      🏫 Filtrar por Sala (Room)
                    </label>
                    <select
                      value={selectedRoomFilter}
                      onChange={(e) => setSelectedRoomFilter(e.target.value)}
                      style={{ 
                        padding: "10px 14px",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(184, 255, 249, 0.2)",
                        borderRadius: 8,
                        color: "#e6f7ff",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none"
                      }}
                    >
                      <option value="">Todas las salas</option>
                      {rooms?.map(r => (
                        <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="dashboard-content-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                  {/* Scores Card */}
                  <section className="teacher-panel" style={{ margin: 0 }}>
                    <div className="panel-title-row compact" style={{ marginBottom: 15 }}>
                      <div>
                        <h2>Student Scores</h2>
                        <p>Average writing and pre/post scores.</p>
                      </div>
                    </div>

                    <div style={{ maxHeight: 400, overflowY: "auto", paddingRight: 5 }} className="custom-scroll">
                      {filteredScores.length > 0 ? (
                        <ul className="metric-list" style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                          {filteredScores.map((s, i) => (
                            <li key={i} style={{ 
                              background: "rgba(255,255,255,0.03)", 
                              border: "1px solid rgba(255,255,255,0.06)", 
                              borderRadius: 8, 
                              padding: "12px 15px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}>
                              <strong style={{ color: "#b8fff9" }}>{s.username}</strong>
                              <div style={{ display: "flex", gap: 12, fontSize: "0.9rem" }}>
                                <span style={{ color: "#ffd166" }}>Escrito: <strong>{s.writing_avg ?? "N/A"}</strong></span>
                                <span style={{ color: "#9be6df" }}>Pre/Post: <strong>{s.prepost_avg ?? "N/A"}</strong></span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="empty-state small" style={{ padding: 30 }}>
                          <p>No se encontraron estudiantes o puntajes.</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Engagement Card */}
                  <section className="teacher-panel" style={{ margin: 0 }}>
                    <div className="panel-title-row compact" style={{ marginBottom: 15 }}>
                      <div>
                        <h2>Engagement</h2>
                        <p>Time on task by student.</p>
                      </div>
                    </div>

                    <div style={{ maxHeight: 400, overflowY: "auto", paddingRight: 5 }} className="custom-scroll">
                      {filteredEngagement.length > 0 ? (
                        <ul className="metric-list" style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                          {filteredEngagement.map((e, i) => (
                            <li key={i} style={{ 
                              background: "rgba(255,255,255,0.03)", 
                              border: "1px solid rgba(255,255,255,0.06)", 
                              borderRadius: 8, 
                              padding: "12px 15px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}>
                              <strong style={{ color: "#b8fff9" }}>{e.username}</strong>
                              <span style={{ color: "#2ec4b6", fontWeight: "bold" }}>
                                {Math.round(e.time_on_task_seconds)}s
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="empty-state small" style={{ padding: 30 }}>
                          <p>No se encontraron registros de engagement.</p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* TAB 3: SUBMISSIONS */}
            {activeTab === "submissions" && (
              <section className="teacher-panel panel-large animate-fadeIn" style={{ marginTop: 0 }}>
                <div className="panel-title-row">
                    <div>
                    <h2>Recent Submissions</h2>
                    <p>Review oral and written student submissions.</p>
                    </div>
                </div>

                {submissions && submissions.length > 0 ? (
                    <div>
                    <ul className="submission-list">
                        {submissions.map((s) => (
                        <li key={s.id} className="submission-card">
                            <div className="submission-header">
                            <div>
                                <strong>{s.student}</strong>
                                <span>
                                {s.mission} · {s.submitted_at}
                                </span>
                                <p>{s.text_preview}</p>
                            </div>

                            <div className="submission-actions">
                                <span className={s.reviewed ? "reviewed" : "pending"}>
                                {s.reviewed ? "Reviewed" : "Pending"}
                                </span>

                                {!s.reviewed && (
                                <button
                                    className="btn-review"
                                    onClick={() => {
                                    setReviewingId(s.id);
                                    setReviewScore(10);
                                    setReviewFeedback("");
                                    }}
                                >
                                    Review
                                </button>
                                )}
                            </div>
                            </div>

                            {reviewingId === s.id && (
                            <form
                                className="review-form"
                                onSubmit={async (e) => {
                                e.preventDefault();
                                setLoading(true);
                                setError("");

                                try {
                                    const res = await fetch(
                                    `${API_BASE}/writing-submissions/${s.id}/mark_reviewed/`,
                                    {
                                        method: "POST",
                                        headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                        reviewed: true,
                                        score: reviewScore,
                                        feedback: reviewFeedback,
                                        }),
                                    }
                                    );

                                    if (!res.ok) {
                                    const errBody = await res.json().catch(() => ({ detail: "error" }));
                                    throw new Error(errBody.detail || "Error marking reviewed");
                                    }

                                    const oRes = await fetch(
                                    `${API_BASE}/teacher-profiles/oral_reviews/?page=${page}&page_size=${pageSize}`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                    );

                                    const oData = await oRes.json();
                                    setSubmissions(oData.submissions || []);
                                    setNumPages(oData.num_pages || 1);
                                    setReviewingId(null);
                                } catch (err) {
                                    setError(err.message);
                                } finally {
                                    setLoading(false);
                                }
                                }}
                            >
                                <label>
                                Score
                                <input
                                    type="number"
                                    min={0}
                                    max={20}
                                    required
                                    value={reviewScore}
                                    onChange={(e) => setReviewScore(Number(e.target.value))}
                                />
                                </label>

                                <label>
                                Feedback
                                <textarea
                                    value={reviewFeedback}
                                    onChange={(e) => setReviewFeedback(e.target.value)}
                                    rows={3}
                                />
                                </label>

                                <div className="review-form-actions">
                                <button type="submit" className="btn-primary">
                                    Submit Review
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setReviewingId(null)}
                                >
                                    Cancel
                                </button>
                                </div>
                            </form>
                            )}
                        </li>
                        ))}
                    </ul>

                    <div className="pagination-row">
                        <div>
                        Page {page} of {numPages}
                        <select
                            value={pageSize}
                            onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        </div>

                        <div>
                        <button
                            className="btn-secondary"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                        >
                            Prev
                        </button>

                        <button
                            className="btn-secondary"
                            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
                            disabled={page >= numPages}
                        >
                            Next
                        </button>
                        </div>
                    </div>
                    </div>
                ) : (
                    <div className="empty-state">
                    <strong>No hay envíos recientes.</strong>
                    <p>Student submissions will appear here when available.</p>
                    </div>
                )}
              </section>
            )}
        </main>
      )}

    </div>
  );
}
