import { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { soundFx } from "../utils/soundEffects";
import AvatarShowcase from "./AvatarShowcase";
import AvatarFrame from "./AvatarFrame";

export default function StoreModal({ user, token, onClose, onUserUpdated }) {
  const [activeStoreTab, setActiveStoreTab] = useState("outfits");

  // Determine user character strictly: male = Leo, female = Lia
  const userCharacter = (
    user?.selected_avatar === "leo" ||
    user?.gender === "male" ||
    user?.gender === "M" ||
    user?.selected_outfit?.startsWith("m_")
  ) ? "male" : "female";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hoveredPreview, setHoveredPreview] = useState(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
  const equippedPet = user?.equipped_pet || localStorage.getItem("basescrib_equipped_pet") || "pet_alien_blue";
  const equippedFrame = user?.equipped_frame || "frame_default";
  const equippedAccessory = user?.accessory || "none";

  const handleUnlockOutfit = async (outfitId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const costMap = {
      f_streetwear: 40, m_streetwear: 40, pet_drone_sparky: 50,
      f_cat_onesie: 80, m_cat_onesie: 80, pet_alien_blue: 100,
      f_superhero: 140, m_superhero: 140, pet_cyber_fox: 220,
      f_fantasy_armor: 200, m_fantasy_armor: 200,
      f_cyberpunk: 350, m_cyberpunk: 350, pet_phoenix_quantum: 450,
      frame_fire: 60, frame_electric: 90, frame_spidey: 130, frame_neon: 180, frame_gold_crown: 250,
      ring: 70, aura_cyan: 120, aura_quantum: 180, aura_gold: 250, aura_solar: 350
    };
    const cost = costMap[outfitId] || 0;

    if ((user?.coins || 0) < cost) {
      soundFx.playError();
      setError(`Monedas insuficientes. Necesitas ${cost} 🪙, tienes ${user?.coins || 0} 🪙`);
      setLoading(false);
      return;
    }

    const applyLocalUnlock = () => {
      const unlocked = [...unlockedOutfits];
      if (!unlocked.includes(outfitId)) {
        unlocked.push(outfitId);
      }
      const updated = {
        ...user,
        coins: Math.max(0, (user?.coins || 0) - cost),
        unlocked_outfits: unlocked
      };
      if (outfitId.startsWith("m_") || outfitId.startsWith("f_")) {
        updated.selected_outfit = outfitId;
        updated.gender = outfitId.startsWith("m_") ? "male" : "female";
      } else if (outfitId.startsWith("pet_")) {
        updated.equipped_pet = outfitId;
        localStorage.setItem("basescrib_equipped_pet", outfitId);
      } else if (outfitId.startsWith("frame_")) {
        updated.equipped_frame = outfitId;
      } else {
        updated.accessory = outfitId;
      }
      soundFx.playCoin();
      soundFx.playStreakBonus();
      setSuccess("✨ ¡Artículo comprado y equipado con éxito!");
      if (onUserUpdated) onUserUpdated(updated);
    };

    if (!token) {
      applyLocalUnlock();
      setLoading(false);
      return;
    }

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
        if (data.error === "Ya tienes este artículo desbloqueado") {
          applyLocalUnlock();
          return;
        }
        throw new Error(data.error || data.detail || "No se pudo desbloquear el artículo.");
      }

      soundFx.playCoin();
      soundFx.playStreakBonus();
      setSuccess("✨ ¡Artículo comprado y equipado con éxito!");

      if (onUserUpdated) {
        if (data.user) {
          if (data.user.equipped_pet) {
            localStorage.setItem("basescrib_equipped_pet", data.user.equipped_pet);
          }
          onUserUpdated(data.user);
        } else {
          applyLocalUnlock();
        }
      }
    } catch (err) {
      console.warn("Unlock backend error, using local fallback:", err.message);
      applyLocalUnlock();
    } finally {
      setLoading(false);
    }
  };

  const handleEquipItem = async (itemId) => {
    setLoading(true);
    setError("");
    setSuccess("");
    const payload = {};
    if (itemId.startsWith("m_") || itemId.startsWith("f_")) {
      payload.outfit_id = itemId;
      payload.gender = itemId.startsWith("m_") ? "male" : "female";
    } else if (itemId.startsWith("pet_")) {
      payload.equipped_pet = itemId;
      localStorage.setItem("basescrib_equipped_pet", itemId);
    } else if (itemId.startsWith("frame_")) {
      payload.equipped_frame = itemId;
    } else {
      payload.accessory = itemId;
    }

    try {
      if (!token) {
        if (onUserUpdated) {
          onUserUpdated({ ...user, ...payload });
        }
        soundFx.playSuccess();
        setSuccess("✨ ¡Artículo equipado en tu personaje!");
        return;
      }

      const res = await fetch(`${API_BASE}/users/select_outfit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al equipar el artículo.");

      soundFx.playSuccess();
      setSuccess("✨ ¡Artículo equipado con éxito!");
      if (onUserUpdated) {
        if (data.user) {
          onUserUpdated(data.user);
        } else {
          onUserUpdated({ ...user, ...payload });
        }
      }
    } catch (err) {
      soundFx.playError();
      setError(err.message || "Error al equipar el artículo.");
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
                  Adquiere y equipa nuevos outfits, trajes legendarios y mascotas usando tus monedas 🪙.
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
              petId={equippedPet} 
              suitColor={user?.suit_color || "#2ec4b6"}
              visorColor={user?.visor_color || "#a3e2f7"}
              accessory={equippedAccessory}
              decal={user?.decal || "none"}
              gender={user?.gender || (selectedOutfit.startsWith("m_") ? "male" : "female")}
              previewItem={hoveredPreview} 
              size="large"
            />
          </div>
        </div>

        {/* FLOATING TOAST NOTIFICATIONS (PERFECTLY CENTERED, ZERO LAYOUT SHIFT) */}
        {error && (
          <div style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 10050,
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(153, 27, 27, 0.95))",
            border: "1.5px solid #fca5a5",
            borderRadius: 20,
            padding: "8px 22px",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "0.85rem",
            boxShadow: "0 8px 25px rgba(239, 68, 68, 0.6)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "toastSlideDown 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 10050,
            background: "linear-gradient(135deg, rgba(46, 196, 182, 0.95), rgba(15, 76, 92, 0.95))",
            border: "1.5px solid #b8fff9",
            borderRadius: 20,
            padding: "8px 22px",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "0.85rem",
            boxShadow: "0 8px 25px rgba(46, 196, 182, 0.6)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "toastSlideDown 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
          }}>
            <span>✨</span>
            <span>{success}</span>
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
            {/* TÍTULO DE SKINS DE PERSONAJE DEL ALUMNO */}
            <div style={{
              marginBottom: 14,
              background: "rgba(0,0,0,0.25)",
              padding: "10px 16px",
              borderRadius: 12,
              border: userCharacter === "male" ? "1.5px solid #2ec4b6" : "1.5px solid #f72585",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}>
              <span style={{ fontSize: "1.2rem" }}>{userCharacter === "male" ? "🧑‍🚀" : "👩‍🚀"}</span>
              <span style={{
                color: userCharacter === "male" ? "#2ec4b6" : "#f72585",
                fontWeight: "bold",
                fontSize: "0.95rem"
              }}>
                Skins Disponibles para {userCharacter === "male" ? "Recluta Leo" : "Entrenadora Lia"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {outfits.filter(o => userCharacter === "male" ? o.id.startsWith("m_") : o.id.startsWith("f_")).map((o) => {
                const isUnlocked = unlockedOutfits.includes(o.id);
                const isSelected = selectedOutfit === o.id;
                const canAfford = (user?.coins || 0) >= o.cost;
                const rStyle = getRarityStyle(o.rarity);

                return (
                  <div
                    key={o.id}
                    onMouseEnter={() => setHoveredPreview({ type: "outfit", id: o.id })}
                    onMouseLeave={() => setHoveredPreview(null)}
                    style={{
                      background: isSelected ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
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
                      isSelected ? (
                        <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                          ⚡ Equipado Actualmente
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEquipItem(o.id)}
                          disabled={loading}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: 10,
                            border: "1.5px solid #2ec4b6",
                            background: "rgba(46, 196, 182, 0.15)",
                            color: "#b8fff9",
                            fontWeight: "bold",
                            fontSize: "0.82rem",
                            cursor: "pointer"
                          }}
                        >
                          👕 Equipar Skin
                        </button>
                      )
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
                        {canAfford ? `Comprar y Equipar (🪙 ${o.cost})` : `Coins Insuficientes (🪙 ${o.cost})`}
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
              const isEquipped = equippedPet === p.id;
              const canAfford = (user?.coins || 0) >= p.cost;
              const rStyle = getRarityStyle(p.rarity);

              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredPreview({ type: "pet", id: p.id })}
                  onMouseLeave={() => setHoveredPreview(null)}
                  style={{
                    background: isEquipped ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isEquipped ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
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
                    isEquipped ? (
                      <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                        ⚡ Equipada Actualmente
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEquipItem(p.id)}
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: 10,
                          border: "1.5px solid #2ec4b6",
                          background: "rgba(46, 196, 182, 0.15)",
                          color: "#b8fff9",
                          fontWeight: "bold",
                          fontSize: "0.82rem",
                          cursor: "pointer"
                        }}
                      >
                        👾 Equipar Mascota
                      </button>
                    )
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
                      {canAfford ? `Comprar y Equipar (🪙 ${p.cost})` : `Coins Insuficientes (🪙 ${p.cost})`}
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
              const isEquipped = equippedFrame === fr.id;
              const canAfford = (user?.coins || 0) >= fr.cost;
              const rStyle = getRarityStyle(fr.rarity);

              return (
                <div
                  key={fr.id}
                  style={{
                    background: isEquipped ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isEquipped ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
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
                    isEquipped ? (
                      <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                        ⚡ Equipado Actualmente
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEquipItem(fr.id)}
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: 10,
                          border: "1.5px solid #2ec4b6",
                          background: "rgba(46, 196, 182, 0.15)",
                          color: "#b8fff9",
                          fontWeight: "bold",
                          fontSize: "0.82rem",
                          cursor: "pointer"
                        }}
                      >
                        🖼️ Equipar Marco
                      </button>
                    )
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
                      {canAfford ? `Comprar y Equipar (🪙 ${fr.cost})` : `Coins Insuficientes (🪙 ${fr.cost})`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CONTENIDO DE BASES EN VENTA */}
        {activeStoreTab === "bases" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {bases.map((b) => {
              const isUnlocked = unlockedOutfits.includes(b.id);
              const isEquipped = equippedAccessory === b.id;
              const canAfford = (user?.coins || 0) >= b.cost;
              const rStyle = getRarityStyle(b.rarity);

              return (
                <div
                  key={b.id}
                  style={{
                    background: isEquipped ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isEquipped ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
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
                      <span style={{ fontSize: "2rem" }}>{b.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: rStyle.badgeColor, background: rStyle.badgeBg, border: `1px solid ${rStyle.badgeColor}`, padding: "2px 8px", borderRadius: 8 }}>
                        {isUnlocked ? "🟢 Adquirida" : `🔒 ${b.rarity}`}
                      </span>
                    </div>

                    <strong style={{ color: "#f8fafc", fontSize: "0.9rem", display: "block" }}>{b.name}</strong>
                    <p style={{ color: "#9be6df", fontSize: "0.78rem", margin: "4px 0 10px 0" }}>{b.desc}</p>
                  </div>

                  {isUnlocked ? (
                    isEquipped ? (
                      <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                        ⚡ Equipada Actualmente
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEquipItem(b.id)}
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: 10,
                          border: "1.5px solid #2ec4b6",
                          background: "rgba(46, 196, 182, 0.15)",
                          color: "#b8fff9",
                          fontWeight: "bold",
                          fontSize: "0.82rem",
                          cursor: "pointer"
                        }}
                      >
                        🌀 Equipar Base
                      </button>
                    )
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
                      {canAfford ? `Comprar y Equipar (🪙 ${b.cost})` : `Coins Insuficientes (🪙 ${b.cost})`}
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
