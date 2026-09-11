import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config";
import { fetchWithAuth, getAccessToken } from "../utils/apiClient";
import StoreModal from "../components/StoreModal";
import "../../styles/Panel.css";

export default function AvatarCustomizer() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      setError("No has iniciado sesión.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const meRes = await fetchWithAuth(`${API_BASE}/users/me/`);
        if (!meRes.ok) throw new Error("Token inválido");
        const userData = await meRes.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="container space-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div className="glass-console auth-card" style={{ maxWidth: 450 }}>
          <h2>Cargando Armario Espacial...</h2>
          <p className="tagline">Conectando a la boutique del recluta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      {error && <div className="error-message">{error}</div>}
      {user && (
        <StoreModal
          user={user}
          token={token}
          onClose={() => navigate("/panelprincipal")}
          onUserUpdated={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </div>
  );
}
