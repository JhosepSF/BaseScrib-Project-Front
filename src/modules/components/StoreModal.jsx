import { useState } from "react";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";
import AvatarShowcase from "./AvatarShowcase";

import AvatarFrame from "./AvatarFrame";

export default function StoreModal({ user, token, onClose, onUserUpdated }) {
  const [activeStoreTab, setActiveStoreTab] = useState("outfits");
  const [skinFilterGender, setSkinFilterGender] = useState(user?.gender || (user?.selected_outfit?.startsWith("m_") ? "male" : "female"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hoveredPreview, setHoveredPreview] = useState(null);

  const outfits = [
    { id: "f_base", name: "Entrenadora Lia (Base)", cost: 0, icon: "👩‍🚀", rarity: "Gratuito 🟢", desc: "Traje reglamentario de la entrenadora Lia." },
    { id: "m_base", name: "Recluta Leo (Base)", cost: 0, icon: "🧑‍🚀", rarity: "Gratuito 🟢", desc: "Traje reglamentario del recluta Leo." },
    
    // Female Skins (Lia)
    { id: "f_streetwear", name: "Skin Urban Streetwear (Lia)", cost: 40, icon: "👟", rarity: "Común 🟢", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "f_cat_onesie", name: "Skin Onesie de Gato (Lia)", cost: 80, icon: "🐱", rarity: "Raro 🔵", desc: "Kigurumi/onesie de gato color rosa pastel." },
    { id: "f_superhero", name: "Skin Superheroína (Lia)", cost: 140, icon: "🦸‍♀️", rarity: "Épico 💜", desc: "Traje de superheroína con capa pequeña y emblema de estrella." },
    { id: "f_fantasy_armor", name: "Armadura de Fantasía (Lia)", cost: 200, icon: "🛡️", rarity: "Épico 💜", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "f_cyberpunk", name: "Skin Cyberpunk Neón (Lia)", cost: 350, icon: "⚡", rarity: "Legendario 💛", desc: "Traje futurista con líneas de neón rosa y cian." },

    // Male Skins (Leo)
    { id: "m_streetwear", name: "Skin Urban Streetwear (Leo)", cost: 40, icon: "👟", rarity: "Común 🟢", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "m_cat_onesie", name: "Skin Onesie de Gato (Leo)", cost: 80, icon: "🐱", rarity: "Raro 🔵", desc: "Kigurumi/onesie de gato acolchado." },
    { id: "m_superhero", name: "Skin Superhéroe (Leo)", cost: 140, icon: "🦸‍♂️", rarity: "Épico 💜", desc: "Traje de superhéroe con capa pequeña y emblema de estrella." },
    { id: "m_fantasy_armor", name: "Armadura de Caballero (Leo)", cost: 200, icon: "🛡️", rarity: "Épico 💜", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "m_cyberpunk", name: "Skin Cyberpunk Neón (Leo)", cost: 350, icon: "⚡", rarity: "Legendario 💛", desc: "Traje futurista con líneas de neón azul y cian." },
  ];

  const pets = [
    { id: "pet_drone_sparky", name: "Drone Reparador Sparky", cost: 50, icon: "🤖", rarity: "Común 🟢", auraColor: "#2ec4b6", desc: "Mini drone que emite señales de escaneo continuo." },
    { id: "pet_alien_blue", name: "Aliencito Nebuloso", cost: 100, icon: "👾", rarity: "Raro 🔵", auraColor: "#4cc9f0", desc: "Acompañante espacial con aura de energía estelar." },
    { id: "pet_cyber_fox", name: "Zorrito Cibernético", cost: 220, icon: "🦊", rarity: "Épico 💜", auraColor: "#b5179e", desc: "Mascota mística con colas de plasma fosforescente." },
    { id: "pet_phoenix_quantum", name: "Fénix Cuántico de Scribtonia", cost: 450, icon: "🦅", rarity: "Legendario 💛", auraColor: "#ffd166", desc: "Criatura legendaria envuelta en fuego estelar puro." },
  ];

  const frames = [
    { id: "frame_default", name: "Marco Base de Recluta", cost: 0, icon: "🔵", rarity: "Gratuito 🟢", desc: "Borde cibernético reglamentario de la base." },
    { id: "frame_fire", name: "Marco Fuego Infernal 🔥", cost: 60, icon: "🔥", rarity: "Común 🟢", desc: "Resplandor de fuego y partículas incandescentes." },
    { id: "frame_electric", name: "Marco Voltaje Cuántico ⚡", cost: 90, icon: "⚡", rarity: "Raro 🔵", desc: "Borde de descarga eléctrica con chispas de plasma." },
    { id: "frame_spidey", name: "Marco Telaraña Superheroica 🕷️", cost: 130, icon: "🕷️", rarity: "Épico 💜", desc: "Inspirado en el superhéroe arácnido con arañita en la esquina." },
    { id: "frame_neon", name: "Marco Neón Cyberpunk 🌌", cost: 180, icon: "🌌", rarity: "Épico 💜", desc: "Aura neón rosa y magenta en constante rotación." },
    { id: "frame_gold_crown", name: "Marco Corona de Rey Espacial 👑", cost: 250, icon: "👑", rarity: "Legendario 💛", desc: "Borde dorado con corona flotante reluciente." }
  ];

  const bases = [
    { id: "ring", name: "Aro Neón Carmesí", cost: 70, icon: "⭕", rarity: "Común 🟢", desc: "Plataforma holográfica de plasma rojo con giro continuo de doble anillo." },
    { id: "aura_cyan", name: "Portal Radar Cibernético Cian", cost: 120, icon: "🌀", rarity: "Raro 🔵", desc: "Escáner táctico cibernético con barrido de radar cian." },
    { id: "aura_quantum", name: "Campo Cuántico Violáceo", cost: 180, icon: "🔮", rarity: "Épico 💜", desc: "Vórtice de distorsión espacio-temporal octagonal en color púrpura neón." },
    { id: "aura_gold", name: "Cresta Celestial Dorada", cost: 250, icon: "⚜️", rarity: "Épico 💜", desc: "Base real cósmica con 4 estrellas celestiales en órbita constante." },
    { id: "aura_solar", name: "Plataforma Sol Estelar", cost: 350, icon: "🔥", rarity: "Legendario 💛", desc: "Anillo de fuego solar brillante con llamas estelares en rotación." }
  ];

  const getRarityStyle = (rarity = "") => {
    if (rarity.includes("Legendario") || rarity.includes("💛")) {
      return {
        border: "1.5px solid #ffd166",
        badgeBg: "rgba(255, 209, 102, 0.2)",
        badgeColor: "#ffd166",
        glow: "0 0 18px rgba(255, 209, 102, 0.4)"
      };
    }
    if (rarity.includes("Épico") || rarity.includes("💜")) {
      return {
        border: "1.5px solid #d946ef",
        badgeBg: "rgba(217, 70, 239, 0.2)",
        badgeColor: "#f0abfc",
        glow: "0 0 14px rgba(217, 70, 239, 0.35)"
      };
    }
    if (rarity.includes("Raro") || rarity.includes("🔵")) {
      return {
        border: "1.5px solid #00f0ff",
        badgeBg: "rgba(0, 240, 255, 0.2)",
        badgeColor: "#7dd3fc",
        glow: "0 0 12px rgba(0, 240, 255, 0.3)"
      };
    }
    return {
      border: "1.5px solid rgba(46, 196, 182, 0.6)",
      badgeBg: "rgba(46, 196, 182, 0.2)",
      badgeColor: "#b8fff9",
      glow: "none"
    };
  };

  const unlockedOutfits = user?.unlocked_outfits || ["f_base", "m_base"];
  const selectedOutfit = user?.selected_outfit || "m_base";

  const handleUnlockOutfit = async (outfitId) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/users/unlock_outfit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ outfit_id: outfitId })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo desbloquear el artículo.");
      }

      soundFx.playCoin();
      setSuccess("¡Artículo desbloqueado con éxito! Puedes equiparlo en tu Inventario / Armario.");
      if (onUserUpdated) {
        onUserUpdated({
          ...user,
          coins: data.coins,
          unlocked_outfits: data.unlocked_outfits
        });
      }
    } catch (err) {
      soundFx.playError();
      setError(err.message || "Error al conectar con la tienda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(circle at center, rgba(35, 12, 60, 0.95), rgba(4, 1, 14, 0.99))",
      backdropFilter: "blur(14px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: 20
    }}>
      <div className="modal-card animate-scaleUp" style={{
        background: "linear-gradient(150deg, #18092e, #070212)",
        border: "2px solid #ffd166",
        borderRadius: 24,
        padding: 26,
        maxWidth: 780,
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 0 60px rgba(255, 209, 102, 0.35)",
        position: "relative",
        color: "#e6f7ff"
      }}>
        {/* BOTÓN CERRAR */}
        <button 
          onClick={() => { soundFx.playClick(); onClose(); }}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 209, 102, 0.5)",
            color: "#ffd166",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ✖
        </button>

        {/* HEADER DE LA TIENDA */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20, flexWrap: "wrap", paddingRight: 40 }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "2.5rem" }}>🛒</span>
              <div>
                <h2 style={{ color: "#ffd166", margin: 0, fontSize: "1.65rem", textShadow: "0 0 15px rgba(255, 209, 102, 0.6)" }}>
                  Tienda Espacial Basescrib
                </h2>
                <p style={{ color: "#9be6df", fontSize: "0.88rem", margin: "2px 0 0 0" }}>
                  Adquiere nuevos outfits, trajes legendarios y mascotas usando tus monedas 🪙.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(255, 209, 102, 0.18)", border: "1.5px solid #ffd166", color: "#ffd166", padding: "6px 16px", borderRadius: 20, fontWeight: "bold", fontSize: "0.95rem" }}>
                🪙 {user?.coins || 0} Coins
              </span>
              <span style={{ background: "rgba(46, 196, 182, 0.18)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "6px 16px", borderRadius: 20, fontWeight: "bold", fontSize: "0.95rem" }}>
                ⭐ {user?.xp || 0} XP
              </span>
            </div>
          </div>

          {/* PREVISUALIZACIÓN DE SKIN EN VENTA */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1.5px solid rgba(255, 209, 102, 0.3)", borderRadius: 20, padding: 8 }}>
            <AvatarShowcase 
              outfitId={selectedOutfit} 
              petId={localStorage.getItem("basescrib_equipped_pet") || "pet_alien_blue"} 
              previewItem={hoveredPreview} 
              size="large"
            />
          </div>
        </div>

        {/* NOTIFICACIONES */}
        {error && (
          <div style={{ background: "rgba(255, 107, 107, 0.15)", border: "1px solid #ff6b6b", color: "#ff6b6b", padding: "10px 14px", borderRadius: 12, marginBottom: 14, fontSize: "0.85rem", fontWeight: "bold" }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(46, 196, 182, 0.15)", border: "1px solid #2ec4b6", color: "#b8fff9", padding: "10px 14px", borderRadius: 12, marginBottom: 14, fontSize: "0.85rem", fontWeight: "bold" }}>
            ✨ {success}
          </div>
        )}

        {/* PESTAÑAS DE CATEGORÍA DE TIENDA */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button 
            onClick={() => setActiveStoreTab("outfits")}
            style={{
              background: activeStoreTab === "outfits" ? "linear-gradient(135deg, #ffd166, #ffb84d)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "outfits" ? "#1a1a00" : "#9be6df",
              border: activeStoreTab === "outfits" ? "none" : "1px solid rgba(255, 209, 102, 0.3)",
              padding: "8px 18px",
              borderRadius: 10,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            👗 Trajes Especiales
          </button>
          <button 
            onClick={() => setActiveStoreTab("pets")}
            style={{
              background: activeStoreTab === "pets" ? "linear-gradient(135deg, #f72585, #7209b7)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "pets" ? "white" : "#9be6df",
              border: activeStoreTab === "pets" ? "none" : "1px solid rgba(247, 37, 133, 0.3)",
              padding: "8px 18px",
              borderRadius: 10,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            👾 Mascotas Companions
          </button>
          <button 
            onClick={() => setActiveStoreTab("frames")}
            style={{
              background: activeStoreTab === "frames" ? "linear-gradient(135deg, #00f0ff, #7000ff)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "frames" ? "white" : "#9be6df",
              border: activeStoreTab === "frames" ? "none" : "1px solid rgba(0, 240, 255, 0.3)",
              padding: "8px 18px",
              borderRadius: 10,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            🖼️ Marcos de Avatar
          </button>
          <button 
            onClick={() => setActiveStoreTab("bases")}
            style={{
              background: activeStoreTab === "bases" ? "linear-gradient(135deg, #ff4d4d, #ff9f1c)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "bases" ? "white" : "#9be6df",
              border: activeStoreTab === "bases" ? "none" : "1px solid rgba(255, 77, 77, 0.3)",
              padding: "8px 18px",
              borderRadius: 10,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            🌀 Bases de Suelo
          </button>
        </div>

        {/* CONTENIDO DE OUTFITS EN VENTA */}
        {activeStoreTab === "outfits" && (
          <div>
            {/* SUB-FILTRO DE PERSONAJE (LIA VS LEO) */}
            <div style={{ display: "flex", gap: 10, marginBottom: 14, background: "rgba(0,0,0,0.2)", padding: 6, borderRadius: 12 }}>
              <button
                onClick={() => setSkinFilterGender("female")}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: skinFilterGender === "female" ? "1.5px solid #f72585" : "none",
                  background: skinFilterGender === "female" ? "rgba(247, 37, 133, 0.25)" : "transparent",
                  color: skinFilterGender === "female" ? "#f72585" : "#94a3b8",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                👩‍🚀 Skins de Entrenadora Lia
              </button>
              <button
                onClick={() => setSkinFilterGender("male")}
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: skinFilterGender === "male" ? "1.5px solid #2ec4b6" : "none",
                  background: skinFilterGender === "male" ? "rgba(46, 196, 182, 0.25)" : "transparent",
                  color: skinFilterGender === "male" ? "#2ec4b6" : "#94a3b8",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                🧑‍🚀 Skins de Recluta Leo
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {outfits.filter(o => skinFilterGender === "male" ? o.id.startsWith("m_") : o.id.startsWith("f_")).map((o) => {
                const isUnlocked = unlockedOutfits.includes(o.id);
                const canAfford = (user?.coins || 0) >= o.cost;
                const rStyle = getRarityStyle(o.rarity);

                return (
                  <div
                    key={o.id}
                    onMouseEnter={() => setHoveredPreview({ type: "outfit", id: o.id })}
                    onMouseLeave={() => setHoveredPreview(null)}
                    style={{
                      background: isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                      borderRadius: 16,
                      padding: 14,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: isUnlocked ? "none" : rStyle.glow,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: "1.8rem" }}>{o.icon}</span>
                        <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: rStyle.badgeColor, background: rStyle.badgeBg, border: `1px solid ${rStyle.badgeColor}`, padding: "2px 8px", borderRadius: 8 }}>
                          {isUnlocked ? "🟢 Adquirido" : `🔒 ${o.rarity}`}
                        </span>
                      </div>

                      <strong style={{ color: "#f8fafc", fontSize: "0.9rem", display: "block" }}>{o.name}</strong>
                      <p style={{ color: "#9be6df", fontSize: "0.78rem", margin: "4px 0 10px 0" }}>{o.desc}</p>
                    </div>

                    {isUnlocked ? (
                      <div style={{ background: "rgba(46, 196, 182, 0.2)", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.8rem" }}>
                        ✓ Desbloqueado en Armario
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUnlockOutfit(o.id)}
                        disabled={loading || !canAfford}
                        style={{
                          width: "100%",
                          padding: "9px",
                          borderRadius: 10,
                          border: "none",
                          background: canAfford ? "linear-gradient(135deg, #ffd166, #ffb84d)" : "rgba(255,255,255,0.08)",
                          color: canAfford ? "#1a1a00" : "#64748b",
                          fontWeight: "bold",
                          fontSize: "0.82rem",
                          cursor: canAfford ? "pointer" : "not-allowed"
                        }}
                      >
                        {canAfford ? `Comprar Skin (🪙 ${o.cost})` : `Coins Insuficientes (🪙 ${o.cost})`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTENIDO DE MASCOTAS EN VENTA */}
        {activeStoreTab === "pets" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {pets.map((p) => {
              const isUnlocked = unlockedOutfits.includes(p.id);
              const canAfford = (user?.coins || 0) >= p.cost;
              const rStyle = getRarityStyle(p.rarity);

              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredPreview({ type: "pet", id: p.id })}
                  onMouseLeave={() => setHoveredPreview(null)}
                  style={{
                    background: isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                    borderRadius: 16,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: isUnlocked ? "none" : rStyle.glow
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: "2rem", filter: `drop-shadow(0 0 10px ${p.auraColor})` }}>{p.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: rStyle.badgeColor, background: rStyle.badgeBg, border: `1px solid ${rStyle.badgeColor}`, padding: "2px 8px", borderRadius: 8 }}>
                        {isUnlocked ? "🟢 Adquirida" : `🔒 ${p.rarity}`}
                      </span>
                    </div>

                    <strong style={{ color: "#f8fafc", fontSize: "0.9rem", display: "block" }}>{p.name}</strong>
                    <p style={{ color: "#9be6df", fontSize: "0.78rem", margin: "4px 0 10px 0" }}>{p.desc}</p>
                  </div>

                  {isUnlocked ? (
                    <div style={{ background: "rgba(46, 196, 182, 0.2)", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.8rem" }}>
                      ✓ Disponible en Armario
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlockOutfit(p.id)}
                      disabled={loading || !canAfford}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: 10,
                        border: "none",
                        background: canAfford ? "linear-gradient(135deg, #f72585, #7209b7)" : "rgba(255,255,255,0.08)",
                        color: canAfford ? "white" : "#64748b",
                        fontWeight: "bold",
                        fontSize: "0.82rem",
                        cursor: canAfford ? "pointer" : "not-allowed"
                      }}
                    >
                      {canAfford ? `Comprar Mascota (🪙 ${p.cost})` : `Coins Insuficientes (🪙 ${p.cost})`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CONTENIDO DE MARCOS DE AVATAR EN VENTA */}
        {activeStoreTab === "frames" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {frames.map((fr) => {
              const isUnlocked = fr.cost === 0 || unlockedOutfits.includes(fr.id);
              const canAfford = (user?.coins || 0) >= fr.cost;
              const rStyle = getRarityStyle(fr.rarity);

              return (
                <div
                  key={fr.id}
                  style={{
                    background: isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                    borderRadius: 16,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: isUnlocked ? "none" : rStyle.glow
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: rStyle.badgeColor, background: rStyle.badgeBg, border: `1px solid ${rStyle.badgeColor}`, padding: "2px 8px", borderRadius: 8 }}>
                        {isUnlocked ? "🟢 Adquirido" : `🔒 ${fr.rarity}`}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 14px 0" }}>
                      <AvatarFrame frameId={fr.id} size="large">
                        <span style={{ fontSize: "1.8rem" }}>{fr.icon}</span>
                      </AvatarFrame>
                    </div>

                    <strong style={{ color: "#f8fafc", fontSize: "0.9rem", display: "block", textAlign: "center" }}>{fr.name}</strong>
                    <p style={{ color: "#9be6df", fontSize: "0.78rem", margin: "4px 0 10px 0", textAlign: "center" }}>{fr.desc}</p>
                  </div>

                  {isUnlocked ? (
                    <div style={{ background: "rgba(46, 196, 182, 0.2)", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.8rem" }}>
                      ✓ Disponible en Armario
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlockOutfit(fr.id)}
                      disabled={loading || !canAfford}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: 10,
                        border: "none",
                        background: canAfford ? "linear-gradient(135deg, #00f0ff, #7000ff)" : "rgba(255,255,255,0.08)",
                        color: canAfford ? "white" : "#64748b",
                        fontWeight: "bold",
                        fontSize: "0.82rem",
                        cursor: canAfford ? "pointer" : "not-allowed"
                      }}
                    >
                      {canAfford ? `Comprar Marco (🪙 ${fr.cost})` : `Coins Insuficientes (🪙 ${fr.cost})`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CONTENIDO DE BASES DE SUELO EN VENTA */}
        {activeStoreTab === "bases" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {bases.map((b) => {
              const isUnlocked = unlockedOutfits.includes(b.id) || user?.accessory === b.id;
              const canAfford = (user?.coins || 0) >= b.cost;
              const rStyle = getRarityStyle(b.rarity);

              return (
                <div
                  key={b.id}
                  onMouseEnter={() => setHoveredPreview({ type: "accessory", id: b.id })}
                  onMouseLeave={() => setHoveredPreview(null)}
                  style={{
                    background: isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                    borderRadius: 16,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: isUnlocked ? "none" : rStyle.glow
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: "1.8rem" }}>{b.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: rStyle.badgeColor, background: rStyle.badgeBg, border: `1px solid ${rStyle.badgeColor}`, padding: "2px 8px", borderRadius: 8 }}>
                        {isUnlocked ? "🟢 Adquirida" : `🔒 ${b.rarity}`}
                      </span>
                    </div>

                    <strong style={{ color: "#f8fafc", fontSize: "0.9rem", display: "block" }}>{b.name}</strong>
                    <p style={{ color: "#9be6df", fontSize: "0.78rem", margin: "4px 0 10px 0" }}>{b.desc}</p>
                  </div>

                  {isUnlocked ? (
                    <div style={{ background: "rgba(46, 196, 182, 0.2)", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.8rem" }}>
                      ✓ Disponible en Armario
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUnlockOutfit(b.id)}
                      disabled={loading || !canAfford}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: 10,
                        border: "none",
                        background: canAfford ? "linear-gradient(135deg, #ff4d4d, #ff9f1c)" : "rgba(255,255,255,0.08)",
                        color: canAfford ? "white" : "#64748b",
                        fontWeight: "bold",
                        fontSize: "0.82rem",
                        cursor: canAfford ? "pointer" : "not-allowed"
                      }}
                    >
                      {canAfford ? `Comprar Base (🪙 ${b.cost})` : `Coins Insuficientes (🪙 ${b.cost})`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
