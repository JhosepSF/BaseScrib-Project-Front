import { useState, useEffect } from "react";
import { API_BASE } from "../../config";
import { fetchWithAuth, getAccessToken } from "../utils/apiClient";
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

  const headAccessories = [
    { id: "none", name: "Sin Accesorio", cost: 0, icon: "🚫", rarity: "Gratuito 🟢", desc: "Sin accesorio en la cabeza." },
    { id: "goggles", name: "Gafas Cibernéticas", cost: 40, icon: "🥽", rarity: "Común 🟢", desc: "Lentes de visión táctica cibernética neón." },
    { id: "antenna", name: "Antena Espacial", cost: 90, icon: "📡", rarity: "Raro 🔵", desc: "Transmisor de señal intergaláctica de alta frecuencia." },
    { id: "crown", name: "Corona Estelar", cost: 180, icon: "👑", rarity: "Épico 💜", desc: "Corona reluciente de soberano estelar." }
  ];

  const decals = [
    { id: "none", name: "Sin Insignia", cost: 0, icon: "🚫", rarity: "Gratuito 🟢", desc: "Sin emblema en el pecho." },
    { id: "star", name: "Estrella ⭐", cost: 30, icon: "⭐", rarity: "Común 🟢", desc: "Emblema de estrella de oficial espacial." },
    { id: "heart", name: "Corazón ❤️", cost: 30, icon: "❤️", rarity: "Común 🟢", desc: "Insignia de vitalidad y energía." },
    { id: "planet", name: "Planeta 🪐", cost: 60, icon: "🪐", rarity: "Común 🟢", desc: "Emblema de explorador planetario." },
    { id: "lightning", name: "Rayo Cuántico ⚡", cost: 100, icon: "⚡", rarity: "Raro 🔵", desc: "Insignia de energía de plasma descargada." },
    { id: "fire", name: "Fuego Estelar 🔥", cost: 150, icon: "🔥", rarity: "Épico 💜", desc: "Emblema de fuego estelar purificador." }
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
  const isLegacyBase = ["ring", "aura_cyan", "aura_gold", "aura_quantum", "aura_solar", "star", "planet", "fire_base"].includes(user?.accessory);
  const equippedBase = user?.base_platform || (isLegacyBase ? user.accessory : "none");
  const equippedAccessory = isLegacyBase ? "none" : (user?.accessory || "none");
  const equippedDecal = user?.decal || "none";

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
      ring: 70, aura_cyan: 120, aura_quantum: 180, aura_gold: 250, aura_solar: 350,
      goggles: 40, antenna: 90, crown: 180,
      star: 30, heart: 30, planet: 60, lightning: 100, fire: 150
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
      } else if (["star", "heart", "planet", "lightning", "fire"].includes(outfitId) || (activeStoreTab === "decals" && outfitId === "none")) {
        updated.decal = outfitId;
      } else {
        updated.accessory = outfitId;
      }
      soundFx.playCoin();
      soundFx.playStreakBonus();
      setSuccess("✨ ¡Artículo comprado y equipado con éxito!");
      if (onUserUpdated) onUserUpdated(updated);
    };

    const currentToken = token || getAccessToken();
    if (!currentToken) {
      applyLocalUnlock();
      setLoading(false);
      return;
    }

    try {
      const res = await fetchWithAuth(`${API_BASE}/users/unlock_outfit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
    } else if (["star", "heart", "planet", "lightning", "fire"].includes(itemId) || (activeStoreTab === "decals" && itemId === "none")) {
      payload.decal = itemId;
    } else if (activeStoreTab === "bases" || ["ring", "aura_cyan", "aura_gold", "aura_quantum", "aura_solar", "fire_base"].includes(itemId)) {
      payload.base_platform = itemId;
    } else {
      payload.accessory = itemId;
    }

    try {
      const currentToken = token || getAccessToken();
      if (!currentToken) {
        if (onUserUpdated) {
          onUserUpdated({ ...user, ...payload });
        }
        soundFx.playSuccess();
        setSuccess("✨ ¡Artículo equipado en tu personaje!");
        return;
      }

      const res = await fetchWithAuth(`${API_BASE}/users/select_outfit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
      width: "100%",
      height: "100dvh",
      minHeight: "100vh",
      background: "radial-gradient(circle at center, rgba(35, 12, 60, 0.95), rgba(4, 1, 14, 0.99))",
      backdropFilter: "blur(14px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: "clamp(6px, 1.5vh, 16px)"
    }}>
      <div className="modal-card animate-scaleUp" style={{
        background: "linear-gradient(150deg, #0d1b2a, #050c18)",
        border: "2px solid #ffd166",
        borderRadius: 24,
        padding: 0,
        maxWidth: 1080,
        width: "95%",
        maxHeight: "min(94vh, 94dvh)",
        height: "min(92vh, 880px)",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 55px rgba(255, 209, 102, 0.4), inset 0 0 25px rgba(255, 209, 102, 0.05)",
        position: "relative",
        color: "#e6f7ff",
        overflow: "hidden",
        boxSizing: "border-box"
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
            background: "rgba(255, 209, 102, 0.12)",
            border: "1px solid rgba(255, 209, 102, 0.5)",
            color: "#ffd166",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            boxShadow: "0 0 12px rgba(255, 209, 102, 0.3)"
          }}
        >
          ✖
        </button>

        {/* HEADER DE LA TIENDA */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 28px",
          background: "linear-gradient(180deg, rgba(255, 209, 102, 0.08) 0%, rgba(13, 27, 42, 0.45) 100%)",
          borderBottom: "1.5px solid rgba(255, 209, 102, 0.2)",
          flexShrink: 0,
          gap: 24
        }}>
          {/* LADO IZQUIERDO: EMBLEMA + TÍTULOS ALINEADOS + CONSOLA HUD ESTIRADA (ENCUADRE PERFECTO) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 0 }}>
            {/* BLOQUE DE IDENTIDAD: EMBLEMA + TÍTULO Y SUBTÍTULO EN EL MISMO EJE */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(255, 209, 102, 0.22), rgba(245, 158, 11, 0.38))",
                border: "1.5px solid #ffd166",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.65rem",
                boxShadow: "0 0 16px rgba(255, 209, 102, 0.35)",
                flexShrink: 0
              }}>
                🛒
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <h2 style={{
                  color: "#ffd166",
                  margin: 0,
                  fontSize: "1.55rem",
                  fontWeight: "900",
                  letterSpacing: "0.5px",
                  textShadow: "0 0 20px rgba(255, 209, 102, 0.6)",
                  lineHeight: 1.2
                }}>
                  Tienda Espacial Basescrib
                </h2>
                <p style={{
                  color: "#9be6df",
                  fontSize: "0.84rem",
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  Adquiere outfits legendarios, mascotas, auras y marcos usando tus monedas espaciales 🪙.
                </p>
              </div>
            </div>

            {/* HUD CONSOLA DE RECURSOS: ENMARCADA Y EXTENDIDA (ELIMINA ESPACIOS VACÍOS) */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(10, 20, 36, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 209, 102, 0.25)",
              borderRadius: 12,
              padding: "7px 22px",
              width: "100%",
              maxWidth: 620,
              boxSizing: "border-box",
              boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.08), 0 4px 18px rgba(0, 0, 0, 0.35)"
            }}>
              {/* Monedas */}
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: "1.2rem" }}>🪙</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.8px", color: "rgba(255, 209, 102, 0.75)", fontWeight: 700, lineHeight: 1 }}>
                    Tus Monedas
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#ffd166", letterSpacing: "0.3px", marginTop: 2, lineHeight: 1 }}>
                    {user?.coins || 0} <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>Coins</span>
                  </span>
                </div>
              </div>

              {/* Divisor vertical */}
              <div style={{ width: 1, height: 26, background: "rgba(255, 209, 102, 0.2)" }} />

              {/* Nivel XP */}
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: "1.2rem" }}>⭐</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.8px", color: "rgba(46, 196, 182, 0.75)", fontWeight: 700, lineHeight: 1 }}>
                    Progreso
                  </span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#2ec4b6", letterSpacing: "0.3px", marginTop: 2, lineHeight: 1 }}>
                    {user?.xp || 0} <span style={{ fontSize: "0.72rem", fontWeight: 600 }}>XP</span>
                  </span>
                </div>
              </div>

              {/* Divisor vertical */}
              <div style={{ width: 1, height: 26, background: "rgba(255, 209, 102, 0.2)" }} />

              {/* Piloto Activo */}
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: "1.2rem" }}>{userCharacter === "male" ? "🧑‍🚀" : "👩‍🚀"}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.8px", color: "rgba(196, 181, 253, 0.75)", fontWeight: 700, lineHeight: 1 }}>
                    Tripulante
                  </span>
                  <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#e2e8f0", letterSpacing: "0.3px", marginTop: 2, lineHeight: 1 }}>
                    {userCharacter === "male" ? "Recluta Leo" : "Entrenadora Lia"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: PREVISUALIZACIÓN DE SKIN EN VENTA */}
          <div style={{
            background: "rgba(10, 20, 36, 0.6)",
            border: "1.5px solid rgba(255, 209, 102, 0.45)",
            borderRadius: 18,
            padding: 6,
            boxShadow: "0 0 25px rgba(255, 209, 102, 0.22), inset 0 0 12px rgba(255, 209, 102, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 34,
            flexShrink: 0
          }}>
            <AvatarShowcase 
              outfitId={selectedOutfit} 
              petId={equippedPet} 
              suitColor={user?.suit_color || "#2ec4b6"}
              visorColor={user?.visor_color || "#a3e2f7"}
              accessory={equippedAccessory}
              basePlatform={equippedBase}
              decal={user?.decal || "none"}
              gender={user?.gender || (selectedOutfit.startsWith("m_") ? "male" : "female")}
              previewItem={hoveredPreview} 
              size="medium"
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
        <div style={{
          display: "flex",
          gap: 10,
          padding: "14px 26px 14px 26px",
          flexShrink: 0,
          overflowX: "auto"
        }}>
          <button 
            onClick={() => setActiveStoreTab("outfits")}
            style={{
              background: activeStoreTab === "outfits" ? "linear-gradient(135deg, #ffd166, #ffb84d)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "outfits" ? "#1a1a00" : "#9be6df",
              border: activeStoreTab === "outfits" ? "2px solid #ffd166" : "1px solid rgba(255, 209, 102, 0.3)",
              padding: "8px 18px",
              borderRadius: 12,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: activeStoreTab === "outfits" ? "0 0 15px rgba(255, 209, 102, 0.4)" : "none"
            }}
          >
            👗 Trajes Especiales
          </button>
          <button 
            onClick={() => setActiveStoreTab("pets")}
            style={{
              background: activeStoreTab === "pets" ? "linear-gradient(135deg, #f72585, #7209b7)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "pets" ? "white" : "#9be6df",
              border: activeStoreTab === "pets" ? "2px solid #f72585" : "1px solid rgba(247, 37, 133, 0.3)",
              padding: "8px 18px",
              borderRadius: 12,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: activeStoreTab === "pets" ? "0 0 15px rgba(247, 37, 133, 0.4)" : "none"
            }}
          >
            👾 Mascotas Companions
          </button>
          <button 
            onClick={() => setActiveStoreTab("frames")}
            style={{
              background: activeStoreTab === "frames" ? "linear-gradient(135deg, #00f0ff, #7000ff)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "frames" ? "white" : "#9be6df",
              border: activeStoreTab === "frames" ? "2px solid #00f0ff" : "1px solid rgba(0, 240, 255, 0.3)",
              padding: "8px 18px",
              borderRadius: 12,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: activeStoreTab === "frames" ? "0 0 15px rgba(0, 240, 255, 0.4)" : "none"
            }}
          >
            🖼️ Marcos de Avatar
          </button>
          <button 
            onClick={() => setActiveStoreTab("bases")}
            style={{
              background: activeStoreTab === "bases" ? "linear-gradient(135deg, #ff4d4d, #ff9f1c)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "bases" ? "white" : "#9be6df",
              border: activeStoreTab === "bases" ? "2px solid #ff4d4d" : "1px solid rgba(255, 77, 77, 0.3)",
              padding: "8px 18px",
              borderRadius: 12,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: activeStoreTab === "bases" ? "0 0 15px rgba(255, 77, 77, 0.4)" : "none"
            }}
          >
            🌀 Bases de Suelo
          </button>
          <button 
            onClick={() => setActiveStoreTab("accessories")}
            style={{
              background: activeStoreTab === "accessories" ? "linear-gradient(135deg, #2ec4b6, #00f0ff)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "accessories" ? "#002427" : "#9be6df",
              border: activeStoreTab === "accessories" ? "2px solid #2ec4b6" : "1px solid rgba(46, 196, 182, 0.3)",
              padding: "8px 18px",
              borderRadius: 12,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: activeStoreTab === "accessories" ? "0 0 15px rgba(46, 196, 182, 0.4)" : "none"
            }}
          >
            👓 Accesorios Cabeza
          </button>
          <button 
            onClick={() => setActiveStoreTab("decals")}
            style={{
              background: activeStoreTab === "decals" ? "linear-gradient(135deg, #a855f7, #ec4899)" : "rgba(255,255,255,0.04)",
              color: activeStoreTab === "decals" ? "white" : "#9be6df",
              border: activeStoreTab === "decals" ? "2px solid #a855f7" : "1px solid rgba(168, 85, 247, 0.3)",
              padding: "8px 18px",
              borderRadius: 12,
              fontWeight: "bold",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: activeStoreTab === "decals" ? "0 0 15px rgba(168, 85, 247, 0.4)" : "none"
            }}
          >
            🛡️ Insignias Pecho
          </button>
        </div>

        {/* CONTENEDOR PRINCIPAL SCROLLABLE DE TIENDA */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "0 26px 20px 26px",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
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
              const isEquipped = equippedBase === b.id;
              const canAfford = (user?.coins || 0) >= b.cost;
              const rStyle = getRarityStyle(b.rarity);

              return (
                <div
                  key={b.id}
                  onMouseEnter={() => setHoveredPreview({ type: "base", id: b.id })}
                  onMouseLeave={() => setHoveredPreview(null)}
                  style={{
                    background: isEquipped ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isEquipped ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
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

        {/* CONTENIDO DE ACCESORIOS DE CABEZA EN VENTA */}
        {activeStoreTab === "accessories" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {headAccessories.map((acc) => {
              const isUnlocked = acc.cost === 0 || unlockedOutfits.includes(acc.id);
              const isEquipped = equippedAccessory === acc.id;
              const canAfford = (user?.coins || 0) >= acc.cost;
              const rStyle = getRarityStyle(acc.rarity);

              return (
                <div
                  key={acc.id}
                  onMouseEnter={() => setHoveredPreview({ type: "accessory", id: acc.id })}
                  onMouseLeave={() => setHoveredPreview(null)}
                  style={{
                    background: isEquipped ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isEquipped ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
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
                      <span style={{ fontSize: "2rem" }}>{acc.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: rStyle.badgeColor, background: rStyle.badgeBg, border: `1px solid ${rStyle.badgeColor}`, padding: "2px 8px", borderRadius: 8 }}>
                        {isUnlocked ? "🟢 Adquirido" : `🔒 ${acc.rarity}`}
                      </span>
                    </div>

                    <strong style={{ color: "#f8fafc", fontSize: "0.9rem", display: "block" }}>{acc.name}</strong>
                    <p style={{ color: "#9be6df", fontSize: "0.78rem", margin: "4px 0 10px 0" }}>{acc.desc}</p>
                  </div>

                  {isUnlocked ? (
                    isEquipped ? (
                      <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                        ⚡ Equipado Actualmente
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEquipItem(acc.id)}
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
                        👓 Equipar Accesorio
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleUnlockOutfit(acc.id)}
                      disabled={loading || !canAfford}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: 10,
                        border: "none",
                        background: canAfford ? "linear-gradient(135deg, #2ec4b6, #00f0ff)" : "rgba(255,255,255,0.08)",
                        color: canAfford ? "#002427" : "#64748b",
                        fontWeight: "bold",
                        fontSize: "0.82rem",
                        cursor: canAfford ? "pointer" : "not-allowed"
                      }}
                    >
                      {canAfford ? `Comprar y Equipar (🪙 ${acc.cost})` : `Coins Insuficientes (🪙 ${acc.cost})`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CONTENIDO DE INSIGNIAS DE PECHO EN VENTA */}
        {activeStoreTab === "decals" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
            {decals.map((d) => {
              const isUnlocked = d.cost === 0 || unlockedOutfits.includes(d.id);
              const isEquipped = equippedDecal === d.id;
              const canAfford = (user?.coins || 0) >= d.cost;
              const rStyle = getRarityStyle(d.rarity);

              return (
                <div
                  key={d.id}
                  onMouseEnter={() => setHoveredPreview({ type: "decal", id: d.id })}
                  onMouseLeave={() => setHoveredPreview(null)}
                  style={{
                    background: isEquipped ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: isEquipped ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
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
                      <span style={{ fontSize: "2rem" }}>{d.icon}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "bold", color: rStyle.badgeColor, background: rStyle.badgeBg, border: `1px solid ${rStyle.badgeColor}`, padding: "2px 8px", borderRadius: 8 }}>
                        {isUnlocked ? "🟢 Adquirida" : `🔒 ${d.rarity}`}
                      </span>
                    </div>

                    <strong style={{ color: "#f8fafc", fontSize: "0.9rem", display: "block" }}>{d.name}</strong>
                    <p style={{ color: "#9be6df", fontSize: "0.78rem", margin: "4px 0 10px 0" }}>{d.desc}</p>
                  </div>

                  {isUnlocked ? (
                    isEquipped ? (
                      <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                        ⚡ Equipada Actualmente
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEquipItem(d.id)}
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
                        🛡️ Equipar Insignia
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleUnlockOutfit(d.id)}
                      disabled={loading || !canAfford}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: 10,
                        border: "none",
                        background: canAfford ? "linear-gradient(135deg, #a855f7, #ec4899)" : "rgba(255,255,255,0.08)",
                        color: canAfford ? "white" : "#64748b",
                        fontWeight: "bold",
                        fontSize: "0.82rem",
                        cursor: canAfford ? "pointer" : "not-allowed"
                      }}
                    >
                      {canAfford ? `Comprar y Equipar (🪙 ${d.cost})` : `Coins Insuficientes (🪙 ${d.cost})`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
