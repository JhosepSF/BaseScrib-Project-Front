import { useState } from "react";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";
import AvatarShowcase from "./AvatarShowcase";

export default function StoreModal({ user, token, onClose, onUserUpdated }) {
  const [activeStoreTab, setActiveStoreTab] = useState("outfits");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hoveredPreview, setHoveredPreview] = useState(null);

  const outfits = [
    { id: "f_base", name: "Entrenadora Lia (Base)", cost: 0, icon: "👩‍🚀", rarity: "Gratuito 🟢", desc: "Traje reglamentario de la entrenadora Lia." },
    { id: "m_base", name: "Recluta Leo (Base)", cost: 0, icon: "🧑‍🚀", rarity: "Gratuito 🟢", desc: "Traje reglamentario del recluta Leo." },
    
    // Female Skins (Lia)
    { id: "f_cyberpunk", name: "Skin Cyberpunk Neón (Lia)", cost: 100, icon: "⚡", rarity: "Legendario 💛", desc: "Traje futurista con líneas de neón rosa y cian." },
    { id: "f_cat_onesie", name: "Skin Onesie de Gato (Lia)", cost: 35, icon: "🐱", rarity: "Raro 🔵", desc: "Kigurumi/onesie de gato color rosa pastel." },
    { id: "f_fantasy_armor", name: "Armadura de Fantasía (Lia)", cost: 75, icon: "🛡️", rarity: "Épico 💜", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "f_streetwear", name: "Skin Urban Streetwear (Lia)", cost: 25, icon: "👟", rarity: "Común 🟢", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "f_superhero", name: "Skin Superheroína (Lia)", cost: 60, icon: "🦸‍♀️", rarity: "Épico 💜", desc: "Traje de superheroína con capa pequeña y emblema de estrella." },

    // Male Skins (Leo)
    { id: "m_cyberpunk", name: "Skin Cyberpunk Neón (Leo)", cost: 100, icon: "⚡", rarity: "Legendario 💛", desc: "Traje futurista con líneas de neón azul y cian." },
    { id: "m_cat_onesie", name: "Skin Onesie de Gato (Leo)", cost: 35, icon: "🐱", rarity: "Raro 🔵", desc: "Kigurumi/onesie de gato acolchado." },
    { id: "m_fantasy_armor", name: "Armadura de Caballero (Leo)", cost: 75, icon: "🛡️", rarity: "Épico 💜", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "m_streetwear", name: "Skin Urban Streetwear (Leo)", cost: 25, icon: "👟", rarity: "Común 🟢", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "m_superhero", name: "Skin Superhéroe (Leo)", cost: 60, icon: "🦸‍♂️", rarity: "Épico 💜", desc: "Traje de superhéroe con capa pequeña y emblema de estrella." },
  ];

  const pets = [
    { id: "pet_alien_blue", name: "Aliencito Nebuloso", cost: 40, icon: "👾", rarity: "Raro 🔵", auraColor: "#4cc9f0", desc: "Acompañante espacial con aura de energía estelar." },
    { id: "pet_drone_sparky", name: "Drone Reparador Sparky", cost: 25, icon: "🤖", rarity: "Común 🟢", auraColor: "#2ec4b6", desc: "Mini drone que emite señales de escaneo continuo." },
    { id: "pet_cyber_fox", name: "Zorrito Cibernético", cost: 80, icon: "🦊", rarity: "Épico 💜", auraColor: "#b5179e", desc: "Mascota mística con colas de plasma fosforescente." },
    { id: "pet_phoenix_quantum", name: "Fénix Cuántico de Scribtonia", cost: 120, icon: "🦅", rarity: "Legendario 💛", auraColor: "#ffd166", desc: "Criatura legendaria envuelta en fuego estelar puro." },
  ];

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
        throw new Error(data.error || "No se pudo desbloquear el outfit.");
      }

      soundFx.playCoin();
      setSuccess("¡Outfit desbloqueado con éxito! Puedes equiparlo en tu Inventario / Armario.");
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
        </div>

        {/* CONTENIDO DE OUTFITS EN VENTA */}
        {activeStoreTab === "outfits" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {outfits.map((o) => {
              const isUnlocked = unlockedOutfits.includes(o.id);
              const canAfford = (user?.coins || 0) >= o.cost;

              return (
                <div
                  key={o.id}
                  onMouseEnter={() => setHoveredPreview({ type: "outfit", id: o.id })}
                  onMouseLeave={() => setHoveredPreview(null)}
                  style={{
                    background: isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isUnlocked ? "1.5px solid #2ec4b6" : "1px solid rgba(255, 209, 102, 0.25)",
                    borderRadius: 16,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: "1.8rem" }}>{o.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#ffd166", background: "rgba(255,209,102,0.1)", padding: "2px 8px", borderRadius: 8 }}>
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
                      {canAfford ? `Comprar (🪙 ${o.cost} Coins)` : `Coins Insuficientes (🪙 ${o.cost})`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CONTENIDO DE MASCOTAS EN VENTA */}
        {activeStoreTab === "pets" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {pets.map((p) => {
              const canAfford = (user?.coins || 0) >= p.cost;
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredPreview({ type: "pet", id: p.id })}
                  onMouseLeave={() => setHoveredPreview(null)}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(247, 37, 133, 0.3)",
                    borderRadius: 16,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: "1.8rem" }}>{p.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#f72585", background: "rgba(247,37,133,0.15)", padding: "2px 8px", borderRadius: 8 }}>
                        {p.rarity}
                      </span>
                    </div>

                    <strong style={{ color: "#f8fafc", fontSize: "0.9rem", display: "block" }}>{p.name}</strong>
                    <p style={{ color: "#9be6df", fontSize: "0.78rem", margin: "4px 0 10px 0" }}>{p.desc}</p>
                  </div>

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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
