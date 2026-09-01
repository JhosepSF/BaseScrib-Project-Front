import { useState, useRef } from "react";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";

export default function DatabaseManagementModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [importStats, setImportStats] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      soundFx.playClick();
      setLoading(true);
      setStatusMessage({ type: "info", text: "Generando respaldo de la base de datos..." });
      
      const token = localStorage.getItem("basescrib_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE}/database/export_db/`, { headers });
      if (!response.ok) throw new Error("Error al exportar la base de datos");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 10);
      a.download = `basescrib_bd_backup_${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      soundFx.playLevelUp?.() || soundFx.playSuccess?.();
      setStatusMessage({ type: "success", text: "¡Base de datos exportada y descargada exitosamente!" });
    } catch (err) {
      soundFx.playError?.();
      setStatusMessage({ type: "error", text: err.message || "Error al exportar respaldo" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      soundFx.playClick();
      setLoading(true);
      setStatusMessage({ type: "info", text: "Procesando e insertando datos en la BD..." });
      setImportStats(null);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("basescrib_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE}/database/import_db/`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Error al importar el archivo JSON");
      }

      soundFx.playLevelUp?.() || soundFx.playSuccess?.();
      setStatusMessage({ type: "success", text: "¡Base de datos importada e insertada con éxito!" });
      setImportStats(data.imported_counts || null);
    } catch (err) {
      soundFx.playError?.();
      setStatusMessage({ type: "error", text: err.message || "Error al importar la base de datos" });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePopulateDefault = async () => {
    if (!window.confirm("¿Deseas repoblar los 14 días predeterminados del currículo y del Abismo? Esto sincronizará el contenido predeterminado.")) {
      return;
    }

    try {
      soundFx.playClick();
      setLoading(true);
      setStatusMessage({ type: "info", text: "Sincronizando los 14 días predeterminados..." });
      setImportStats(null);

      const token = localStorage.getItem("basescrib_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE}/database/populate/`, {
        method: "POST",
        headers,
      });

      const data = await response.json();
      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Error al repoblar días");
      }

      soundFx.playLevelUp?.() || soundFx.playSuccess?.();
      setStatusMessage({ type: "success", text: data.message || "¡14 Días repoblados con éxito!" });
    } catch (err) {
      soundFx.playError?.();
      setStatusMessage({ type: "error", text: err.message || "Error al repoblar días" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>💾</span>
            <div>
              <h2 style={titleStyle}>Gestión de Base de Datos</h2>
              <p style={subtitleStyle}>Exporta, importa o repobla los datos de días y actividades</p>
            </div>
          </div>
          <button style={closeButtonStyle} onClick={onClose}>✕</button>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div style={{
            ...statusBannerStyle,
            backgroundColor: statusMessage.type === "success" ? "rgba(16, 185, 129, 0.15)" :
                             statusMessage.type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(59, 130, 246, 0.15)",
            borderColor: statusMessage.type === "success" ? "#10b981" :
                         statusMessage.type === "error" ? "#ef4444" : "#3b82f6",
            color: statusMessage.type === "success" ? "#34d399" :
                   statusMessage.type === "error" ? "#f87171" : "#60a5fa"
          }}>
            {loading && <span style={spinnerStyle}></span>}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Import Statistics Breakdown */}
        {importStats && (
          <div style={statsBoxStyle}>
            <h4 style={{ margin: "0 0 8px 0", color: "#a7f3d0", fontSize: "14px" }}>📊 Registro de Datos Insertados:</h4>
            <div style={statsGridStyle}>
              <div style={statItemStyle}><span>Días/Niveles:</span> <strong>{importStats.levels}</strong></div>
              <div style={statItemStyle}><span>Misiones:</span> <strong>{importStats.missions}</strong></div>
              <div style={statItemStyle}><span>Actividades:</span> <strong>{importStats.activities}</strong></div>
              <div style={statItemStyle}><span>Preguntas:</span> <strong>{importStats.questions}</strong></div>
              <div style={statItemStyle}><span>Abismo Días:</span> <strong>{importStats.abyss_levels}</strong></div>
              <div style={statItemStyle}><span>Salas:</span> <strong>{importStats.rooms}</strong></div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div style={cardsContainerStyle}>
          {/* Card 1: Export */}
          <div style={cardStyle}>
            <div style={iconBoxStyle}>📥</div>
            <div style={{ flex: 1 }}>
              <h3 style={cardTitleStyle}>Exportar Base de Datos</h3>
              <p style={cardDescStyle}>Descarga un archivo JSON completo con todos los datos de los 14 días, actividades, preguntas y salas.</p>
            </div>
            <button
              style={{ ...btnPrimaryStyle, opacity: loading ? 0.6 : 1 }}
              onClick={handleExport}
              disabled={loading}
            >
              Exportar BD (.json)
            </button>
          </div>

          {/* Card 2: Import */}
          <div style={cardStyle}>
            <div style={{ ...iconBoxStyle, background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>📤</div>
            <div style={{ flex: 1 }}>
              <h3 style={cardTitleStyle}>Importar / Insertar Datos</h3>
              <p style={cardDescStyle}>Carga un archivo de respaldo JSON para actualizar o poblar los datos de los días en la base de datos.</p>
            </div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <button
              style={{ ...btnPurpleStyle, opacity: loading ? 0.6 : 1 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              Seleccionar e Insertar BD
            </button>
          </div>

          {/* Card 3: Populate Defaults */}
          <div style={cardStyle}>
            <div style={{ ...iconBoxStyle, background: "linear-gradient(135deg, #059669, #10b981)" }}>🔄</div>
            <div style={{ flex: 1 }}>
              <h3 style={cardTitleStyle}>Repoblar Días Predeterminados</h3>
              <p style={cardDescStyle}>Sincroniza y restaura los 14 días completos del plan curricular (DCN 2019) y desafíos del Abismo.</p>
            </div>
            <button
              style={{ ...btnGreenStyle, opacity: loading ? 0.6 : 1 }}
              onClick={handlePopulateDefault}
              disabled={loading}
            >
              Repoblar 14 Días
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={footerNoteStyle}>
          💡 <strong>Tip:</strong> Puedes usar la exportación para mover los datos entre tu entorno local y el servidor de producción.
        </div>
      </div>
    </div>
  );
}

// Inline Styles for sleek futuristic sci-fi aesthetic
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(5, 10, 20, 0.82)",
  backdropFilter: "blur(12px)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const modalStyle = {
  backgroundColor: "#0d1322",
  border: "1px solid rgba(59, 130, 246, 0.25)",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "680px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: "28px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.15)",
  color: "#f3f4f6",
  fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  paddingBottom: "16px",
};

const titleStyle = {
  margin: 0,
  fontSize: "20px",
  fontWeight: "700",
  background: "linear-gradient(135deg, #ffffff 30%, #93c5fd 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const subtitleStyle = {
  margin: "4px 0 0 0",
  fontSize: "13px",
  color: "#9ca3af",
};

const closeButtonStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#9ca3af",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  cursor: "pointer",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

const statusBannerStyle = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid",
  fontSize: "14px",
  fontWeight: "500",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const spinnerStyle = {
  width: "16px",
  height: "16px",
  border: "2px solid rgba(255,255,255,0.3)",
  borderTopColor: "#fff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
  display: "inline-block",
};

const statsBoxStyle = {
  backgroundColor: "rgba(16, 185, 129, 0.08)",
  border: "1px solid rgba(16, 185, 129, 0.2)",
  borderRadius: "14px",
  padding: "14px",
  marginBottom: "20px",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
};

const statItemStyle = {
  fontSize: "13px",
  color: "#d1d5db",
  backgroundColor: "rgba(0,0,0,0.2)",
  padding: "8px 12px",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "space-between",
};

const cardsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const cardStyle = {
  backgroundColor: "rgba(17, 24, 39, 0.6)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  padding: "18px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  transition: "transform 0.2s ease, border-color 0.2s ease",
};

const iconBoxStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  boxShadow: "0 8px 16px rgba(59, 130, 246, 0.25)",
  flexShrink: 0,
};

const cardTitleStyle = {
  margin: "0 0 4px 0",
  fontSize: "16px",
  fontWeight: "600",
  color: "#f9fafb",
};

const cardDescStyle = {
  margin: 0,
  fontSize: "12.5px",
  color: "#9ca3af",
  lineHeight: "1.4",
};

const btnPrimaryStyle = {
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "12px",
  fontSize: "13.5px",
  fontWeight: "600",
  cursor: "pointer",
  whiteSpace: "nowrap",
  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
};

const btnPurpleStyle = {
  backgroundColor: "#8b5cf6",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "12px",
  fontSize: "13.5px",
  fontWeight: "600",
  cursor: "pointer",
  whiteSpace: "nowrap",
  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
};

const btnGreenStyle = {
  backgroundColor: "#10b981",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "12px",
  fontSize: "13.5px",
  fontWeight: "600",
  cursor: "pointer",
  whiteSpace: "nowrap",
  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
};

const footerNoteStyle = {
  marginTop: "20px",
  paddingTop: "16px",
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  fontSize: "12.5px",
  color: "#6b7280",
  textAlign: "center",
};
