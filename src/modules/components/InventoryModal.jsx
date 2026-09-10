import { useState, useEffect } from "react";
import { soundFx } from "../utils/soundEffects";
import { API_BASE } from "../../config";
import AvatarShowcase from "./AvatarShowcase";
import AvatarFrame from "./AvatarFrame";

export default function InventoryModal({ user, token, onClose, onUserUpdated }) {
  const userCharacter = (
    user?.selected_avatar === "leo" ||
    user?.gender === "male" ||
    user?.gender === "M" ||
    user?.selected_outfit?.startsWith("m_")
  ) ? "male" : "female";

  const [gender] = useState(userCharacter);
  const [suitColor, setSuitColor] = useState(user?.suit_color || "#2ec4b6");
  const [visorColor, setVisorColor] = useState(user?.visor_color || "#a3e2f7");
  const isLegacyBase = ["ring", "aura_cyan", "aura_gold", "aura_quantum", "aura_solar", "star", "planet", "fire_base"].includes(user?.accessory);
  const [accessory, setAccessory] = useState(isLegacyBase ? "none" : (user?.accessory || "none"));
  const [basePlatform, setBasePlatform] = useState(user?.base_platform || (isLegacyBase ? user.accessory : "none"));
  const [decal, setDecal] = useState(user?.decal || "none");
  const [equippedPet, setEquippedPet] = useState(user?.equipped_pet || localStorage.getItem("basescrib_equipped_pet") || "pet_alien_blue");
  const [equippedFrame, setEquippedFrame] = useState(user?.equipped_frame || "frame_default");
  const [selectedOutfit, setSelectedOutfit] = useState(user?.selected_outfit || (gender === "female" ? "f_base" : "m_base"));
  const [hoveredPreview, setHoveredPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const outfits = [
    { id: "f_base", name: "Entrenadora Lia (Base)", icon: "👩‍🚀", rarity: "Gratuito 🟢", desc: "Traje reglamentario de la entrenadora Lia." },
    { id: "m_base", name: "Recluta Leo (Base)", icon: "🧑‍🚀", rarity: "Gratuito 🟢", desc: "Traje reglamentario del recluta Leo." },
    { id: "f_streetwear", name: "Skin Urban Streetwear (Lia)", icon: "👟", rarity: "Común 🟢", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "f_cat_onesie", name: "Skin Onesie de Gato (Lia)", icon: "🐱", rarity: "Raro 🔵", desc: "Kigurumi/onesie de gato color rosa pastel." },
    { id: "f_superhero", name: "Skin Superheroína (Lia)", icon: "🦸‍♀️", rarity: "Épico 💜", desc: "Traje de superheroína con capa pequeña y emblema de estrella." },
    { id: "f_fantasy_armor", name: "Armadura de Fantasía (Lia)", icon: "🛡️", rarity: "Épico 💜", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "f_cyberpunk", name: "Skin Cyberpunk Neón (Lia)", icon: "⚡", rarity: "Legendario 💛", desc: "Traje futurista con líneas de neón rosa y cian." },
    { id: "m_streetwear", name: "Skin Urban Streetwear (Leo)", icon: "👟", rarity: "Común 🟢", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "m_cat_onesie", name: "Skin Onesie de Gato (Leo)", icon: "🐱", rarity: "Raro 🔵", desc: "Kigurumi/onesie de gato acolchado." },
    { id: "m_superhero", name: "Skin Superhéroe (Leo)", icon: "🦸‍♂️", rarity: "Épico 💜", desc: "Traje de superhéroe con capa pequeña y emblema de estrella." },
    { id: "m_fantasy_armor", name: "Armadura de Caballero (Leo)", icon: "🛡️", rarity: "Épico 💜", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "m_cyberpunk", name: "Skin Cyberpunk Neón (Leo)", icon: "⚡", rarity: "Legendario 💛", desc: "Traje futurista con líneas de neón azul y cian." }
  ];

  const pets = [
    { id: "pet_drone_sparky", name: "Drone Reparador Sparky", icon: "🤖", rarity: "Común 🟢", auraColor: "#2ec4b6", desc: "Mini drone que emite señales de escaneo continuo." },
    { id: "pet_alien_blue", name: "Aliencito Nebuloso", icon: "👾", rarity: "Raro 🔵", auraColor: "#4cc9f0", desc: "Acompañante espacial con aura de energía estelar." },
    { id: "pet_cyber_fox", name: "Zorrito Cibernético", icon: "🦊", rarity: "Épico 💜", auraColor: "#b5179e", desc: "Mascota mística con colas de plasma fosforescente." },
    { id: "pet_phoenix_quantum", name: "Fénix Cuántico de Scribtonia", icon: "🦅", rarity: "Legendario 💛", auraColor: "#ffd166", desc: "Criatura legendaria envuelta en fuego estelar puro." }
  ];

  const framesList = [
    { id: "frame_default", name: "Marco Base de Recluta", icon: "🔵", rarity: "Gratuito 🟢", desc: "Borde cibernético reglamentario de la base." },
    { id: "frame_fire", name: "Marco Fuego Infernal 🔥", icon: "🔥", rarity: "Común 🟢", desc: "Resplandor de fuego y partículas incandescentes." },
    { id: "frame_electric", name: "Marco Voltaje Cuántico ⚡", icon: "⚡", rarity: "Raro 🔵", desc: "Borde de descarga eléctrica con chispas de plasma." },
    { id: "frame_spidey", name: "Marco Telaraña Superheroica 🕷️", icon: "🕷️", rarity: "Épico 💜", desc: "Inspirado en el superhéroe arácnido con arañita en la esquina." },
    { id: "frame_neon", name: "Marco Neón Cyberpunk 🌌", icon: "🌌", rarity: "Épico 💜", desc: "Aura neón rosa y magenta en constante rotación." },
    { id: "frame_gold_crown", name: "Marco Corona Dorada 👑", icon: "👑", rarity: "Legendario 💛", desc: "Borde dorado con corona flotante reluciente." }
  ];

  const suitColorsList = [
    { name: "Original 🚫", hex: "#2ec4b6" },
    { name: "Rojo Impostor", hex: "#ff6b6b" },
    { name: "Amarillo Tarea", hex: "#ffd166" },
    { name: "Naranja Marte", hex: "#ff6b35" },
    { name: "Verde Tóxico", hex: "#00ff87" },
    { name: "Violeta Cósmico", hex: "#ab47bc" },
    { name: "Blanco Astronauta", hex: "#ffffff" },
    { name: "Negro Espacio", hex: "#1a1a1a" }
  ];

  const visorColorsList = [
    { name: "Visor Cian", hex: "#a3e2f7" },
    { name: "Lentes Amarillos 🟡", hex: "#ffd166" },
    { name: "Visor Rojo", hex: "#ff6b6b" },
    { name: "Visor Verde", hex: "#00ff87" },
    { name: "Visor Violeta", hex: "#ab47bc" },
    { name: "Visor Oscuro", hex: "#1a1a1a" }
  ];

  const basesList = [
    { id: "none", name: "Sin Base", icon: "🚫", rarity: "Gratuito 🟢", desc: "Sin plataforma de suelo." },
    { id: "ring", name: "Aro Neón Carmesí", icon: "⭕", rarity: "Común 🟢", desc: "Plataforma holográfica de plasma rojo con giro continuo." },
    { id: "aura_cyan", name: "Portal Radar Cian", icon: "🌀", rarity: "Raro 🔵", desc: "Escáner táctico cibernético con barrido de radar cian." },
    { id: "aura_quantum", name: "Campo Cuántico", icon: "🔮", rarity: "Épico 💜", desc: "Vórtice de distorsión espacio-temporal octagonal." },
    { id: "aura_gold", name: "Cresta Celestial", icon: "⚜️", rarity: "Épico 💜", desc: "Base real cósmica con estrellas celestiales." },
    { id: "aura_solar", name: "Plataforma Sol", icon: "🔥", rarity: "Legendario 💛", desc: "Anillo de fuego solar brillante con llamas estelares." }
  ];

  const headAccessoriesList = [
    { id: "none", name: "Sin Accesorio", icon: "🚫", rarity: "Gratuito 🟢", desc: "Sin accesorio en la cabeza." },
    { id: "goggles", name: "Gafas Cibernéticas", icon: "🥽", rarity: "Común 🟢", desc: "Lentes de visión táctica cibernética neón." },
    { id: "antenna", name: "Antena Espacial", icon: "📡", rarity: "Raro 🔵", desc: "Transmisor de señal intergaláctica de alta frecuencia." },
    { id: "crown", name: "Corona Estelar", icon: "👑", rarity: "Épico 💜", desc: "Corona reluciente de soberano estelar." }
  ];

  const decalsList = [
    { id: "none", name: "Sin Insignia", icon: "🚫", rarity: "Gratuito 🟢", desc: "Sin emblema en el pecho." },
    { id: "star", name: "Estrella ⭐", icon: "⭐", rarity: "Común 🟢", desc: "Emblema de estrella de oficial espacial." },
    { id: "heart", name: "Corazón ❤️", icon: "❤️", rarity: "Común 🟢", desc: "Insignia de vitalidad y energía." },
    { id: "planet", name: "Planeta 🪐", icon: "🪐", rarity: "Común 🟢", desc: "Emblema de explorador planetario." },
    { id: "lightning", name: "Rayo Cuántico ⚡", icon: "⚡", rarity: "Raro 🔵", desc: "Insignia de energía de plasma descargada." },
    { id: "fire", name: "Fuego Estelar 🔥", icon: "🔥", rarity: "Épico 💜", desc: "Emblema de fuego estelar purificador." }
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

  const saveCustomization = async (overrides = {}) => {
    soundFx.playClick();
    setSaving(true);
    setSaveMessage("");

    const newGender = overrides.gender !== undefined ? overrides.gender : gender;
    const newOutfit = overrides.selectedOutfit !== undefined ? overrides.selectedOutfit : selectedOutfit;
    const newSuitColor = overrides.suitColor !== undefined ? overrides.suitColor : suitColor;
    const newVisorColor = overrides.visorColor !== undefined ? overrides.visorColor : visorColor;
    const newAccessory = overrides.accessory !== undefined ? overrides.accessory : accessory;
    const newBasePlatform = overrides.basePlatform !== undefined ? overrides.basePlatform : basePlatform;
    const newDecal = overrides.decal !== undefined ? overrides.decal : decal;
    const newPet = overrides.equippedPet !== undefined ? overrides.equippedPet : equippedPet;
    const newFrame = overrides.equippedFrame !== undefined ? overrides.equippedFrame : equippedFrame;

    localStorage.setItem("basescrib_equipped_pet", newPet);

    if (!token) {
      if (onUserUpdated) {
        onUserUpdated({
          ...user,
          gender: newGender,
          selected_outfit: newOutfit,
          suit_color: newSuitColor,
          visor_color: newVisorColor,
          accessory: newAccessory,
          base_platform: newBasePlatform,
          decal: newDecal,
          equipped_pet: newPet,
          equipped_frame: newFrame
        });
      }
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/select_outfit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          outfit_id: newOutfit,
          suit_color: newSuitColor,
          visor_color: newVisorColor,
          accessory: newAccessory,
          base_platform: newBasePlatform,
          decal: newDecal,
          gender: newGender,
          equipped_pet: newPet,
          equipped_frame: newFrame
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar personalización");

      setSaveMessage("✨ ¡Personalización guardada con éxito!");
      if (onUserUpdated && data.user) {
        onUserUpdated(data.user);
      }
    } catch (err) {
      soundFx.playError();
      setSaveMessage(`⚠️ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const [activeTab, setActiveTab] = useState("skins");

  const tabs = [
    { id: "skins", label: "Armario Skins", icon: "👗" },
    { id: "colors", label: "Colores", icon: "🎨" },
    { id: "bases", label: "Bases de Suelo", icon: "🌀" },
    { id: "accessories", label: "Accesorios", icon: "👓" },
    { id: "decals", label: "Insignias", icon: "🛡️" },
    { id: "pets", label: "Mascotas", icon: "👾" },
    { id: "frames", label: "Marcos", icon: "🖼️" }
  ];

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100dvh",
      minHeight: "100vh",
      background: "radial-gradient(circle at center, rgba(13, 27, 42, 0.95), rgba(3, 10, 20, 0.99))",
      backdropFilter: "blur(12px)",
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
        color: "#e2e8f0",
        overflow: "hidden",
        boxSizing: "border-box"
      }}>
        {/* BOTÓN CERRAR CON NEÓN DORADO */}
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

        {/* FLOATING TOAST NOTIFICATION (CENTERED, ZERO LAYOUT SHIFT) */}
        {saveMessage && (
          <div style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 10050,
            background: saveMessage.includes("⚠️")
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(153, 27, 27, 0.95))"
              : "linear-gradient(135deg, rgba(255, 209, 102, 0.95), rgba(245, 158, 11, 0.95))",
            border: saveMessage.includes("⚠️") ? "1.5px solid #fca5a5" : "1.5px solid #fff3c4",
            borderRadius: 20,
            padding: "8px 24px",
            color: saveMessage.includes("⚠️") ? "#ffffff" : "#1a1a00",
            fontWeight: "bold",
            fontSize: "0.88rem",
            boxShadow: saveMessage.includes("⚠️") ? "0 8px 25px rgba(239, 68, 68, 0.6)" : "0 8px 25px rgba(255, 209, 102, 0.6)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "toastSlideDown 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
          }}>
            <span>{saveMessage}</span>
          </div>
        )}

        {/* HEADER DEL INVENTARIO */}
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
                🎨
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
                  Inventario & Armario
                </h2>
                <p style={{
                  color: "#9be6df",
                  fontSize: "0.84rem",
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  Personaliza el equipamiento de tu tripulante. Los cambios se guardan y reflejan al instante.
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
                <span style={{ fontSize: "1.2rem" }}>{gender === "male" ? "🧑‍🚀" : "👩‍🚀"}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.8px", color: "rgba(196, 181, 253, 0.75)", fontWeight: 700, lineHeight: 1 }}>
                    Tripulante
                  </span>
                  <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#e2e8f0", letterSpacing: "0.3px", marginTop: 2, lineHeight: 1 }}>
                    {gender === "male" ? "Recluta Leo" : "Entrenadora Lia"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DERECHO: PREVISUALIZACIÓN DEL AVATAR */}
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
              previewItem={hoveredPreview} 
              size="medium"
              suitColor={suitColor}
              visorColor={visorColor}
              accessory={accessory}
              basePlatform={basePlatform}
              decal={decal}
              gender={gender}
            />
          </div>
        </div>

        {/* NAVEGACIÓN DE APARTADOS HORIZONTALES CON NEÓN DORADO */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
          gap: 8,
          padding: "14px 26px 14px 26px",
          flexShrink: 0
        }}>
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(t.id);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: "9px 6px",
                  borderRadius: 14,
                  border: isActive ? "2px solid #ffd166" : "1px solid rgba(255, 255, 255, 0.15)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(255, 209, 102, 0.35), rgba(245, 158, 11, 0.5))"
                    : "rgba(255, 255, 255, 0.04)",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  fontWeight: "bold",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.18s ease",
                  boxShadow: isActive ? "0 0 18px rgba(255, 209, 102, 0.5)" : "none",
                  transform: isActive ? "scale(1.03)" : "scale(1)"
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENIDOR DEL APARTADO SELECCIONADO */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "0 26px 18px 26px",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          
          {/* TAB: SKINS */}
          {activeTab === "skins" && (
            <div>
              <div style={{
                marginBottom: 14,
                background: "rgba(0,0,0,0.25)",
                padding: "10px 16px",
                borderRadius: 12,
                border: gender === "male" ? "1.5px solid #2ec4b6" : "1.5px solid #f72585",
                display: "flex",
                alignItems: "center",
                gap: 10
              }}>
                <span style={{ fontSize: "1.2rem" }}>{gender === "male" ? "🧑‍🚀" : "👩‍🚀"}</span>
                <span style={{
                  color: gender === "male" ? "#2ec4b6" : "#f72585",
                  fontWeight: "bold",
                  fontSize: "0.95rem"
                }}>
                  Armario de Skins para {gender === "male" ? "Recluta Leo" : "Entrenadora Lia"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
                {outfits.filter(o => gender === "male" ? o.id.startsWith("m_") : o.id.startsWith("f_")).map((o) => {
                  const isUnlocked = unlockedOutfits.includes(o.id);
                  const isSelected = selectedOutfit === o.id;
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
                        boxShadow: isSelected ? "0 0 20px rgba(46, 196, 182, 0.4)" : isUnlocked ? "none" : rStyle.glow,
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
                            onClick={() => {
                              const newGender = o.id.startsWith("m_") ? "male" : "female";
                              setSelectedOutfit(o.id);
                              saveCustomization({ selectedOutfit: o.id, gender: newGender });
                            }}
                            disabled={saving}
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
                        <div style={{ background: "rgba(255, 209, 102, 0.08)", border: "1px dashed rgba(255, 209, 102, 0.4)", color: "#ffd166", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.78rem" }}>
                          🔒 Bloqueado (Ir a Tienda)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: COLORES */}
          {activeTab === "colors" && (() => {
            const isBaseSkinSelected = selectedOutfit === "m_base" || selectedOutfit === "f_base" || selectedOutfit === "default";
            return (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
                {/* COLOR DE TRAJE BASE */}
                <div style={{
                  background: isBaseSkinSelected ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.25)",
                  border: isBaseSkinSelected ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: 16,
                  padding: 16
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <h4 style={{ margin: 0, color: "#2ec4b6", fontSize: "0.9rem" }}>🎨 Color de Traje Base:</h4>
                    {!isBaseSkinSelected && (
                      <span style={{ fontSize: "0.78rem", color: "#f87171", fontWeight: "bold" }}>
                        🔒 Bloqueado en Skins Especiales
                      </span>
                    )}
                  </div>

                  {!isBaseSkinSelected && (
                    <div style={{
                      marginBottom: 12,
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px dashed rgba(239, 68, 68, 0.4)",
                      color: "#fca5a5",
                      fontSize: "0.78rem"
                    }}>
                      🔒 El color de traje base solo se puede cambiar con la <strong>Skin Base por defecto</strong>. Las skins compradas poseen su propia paleta de ropa.
                    </div>
                  )}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, opacity: isBaseSkinSelected ? 1 : 0.45 }}>
                    {suitColorsList.map((c, idx) => (
                      <button
                        key={idx}
                        disabled={!isBaseSkinSelected}
                        onMouseEnter={() => isBaseSkinSelected && setHoveredPreview({ type: "suit_color", id: c.hex })}
                        onMouseLeave={() => setHoveredPreview(null)}
                        onClick={() => {
                          if (!isBaseSkinSelected) return;
                          setSuitColor(c.hex);
                          saveCustomization({ suitColor: c.hex });
                        }}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: c.hex,
                          border: suitColor === c.hex && isBaseSkinSelected ? "3px solid #2ec4b6" : "1px solid rgba(255,255,255,0.3)",
                          cursor: isBaseSkinSelected ? "pointer" : "not-allowed",
                          boxShadow: suitColor === c.hex && isBaseSkinSelected ? "0 0 12px #2ec4b6" : "none",
                          transition: "transform 0.15s ease"
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* COLOR DE VISOR / LENTES (SIEMPRE DISPONIBLE EN TODAS LAS SKINS) */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>🥽 Color de Visor / Lentes:</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {visorColorsList.map((c, idx) => (
                      <button
                        key={idx}
                        onMouseEnter={() => setHoveredPreview({ type: "visor_color", id: c.hex })}
                        onMouseLeave={() => setHoveredPreview(null)}
                        onClick={() => {
                          setVisorColor(c.hex);
                          saveCustomization({ visorColor: c.hex });
                        }}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: c.hex,
                          border: visorColor === c.hex ? "3px solid #ffd166" : "1px solid rgba(255,255,255,0.3)",
                          cursor: "pointer",
                          boxShadow: visorColor === c.hex ? "0 0 12px #ffd166" : "none",
                          transition: "transform 0.15s ease"
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB: BASES DE SUELO */}
          {activeTab === "bases" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {basesList.map((b) => {
                const isUnlocked = b.id === "none" || unlockedOutfits.includes(b.id);
                const isSelected = basePlatform === b.id;
                const rStyle = getRarityStyle(b.rarity);

                return (
                  <div
                    key={b.id}
                    onMouseEnter={() => setHoveredPreview({ type: "base", id: b.id })}
                    onMouseLeave={() => setHoveredPreview(null)}
                    style={{
                      background: isSelected ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                      borderRadius: 16,
                      padding: 14,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: isSelected ? "0 0 20px rgba(46, 196, 182, 0.4)" : isUnlocked ? "none" : rStyle.glow,
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
                      isSelected ? (
                        <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                          ⚡ Equipada Actualmente
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setBasePlatform(b.id);
                            saveCustomization({ basePlatform: b.id });
                          }}
                          disabled={saving}
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
                      <div style={{ background: "rgba(255, 209, 102, 0.08)", border: "1px dashed rgba(255, 209, 102, 0.4)", color: "#ffd166", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.78rem" }}>
                        🔒 Bloqueada (Ir a Tienda)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: ACCESORIOS DE CABEZA */}
          {activeTab === "accessories" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {headAccessoriesList.map((acc) => {
                const isUnlocked = acc.id === "none" || unlockedOutfits.includes(acc.id);
                const isSelected = accessory === acc.id;
                const rStyle = getRarityStyle(acc.rarity);

                return (
                  <div
                    key={acc.id}
                    onMouseEnter={() => setHoveredPreview({ type: "accessory", id: acc.id })}
                    onMouseLeave={() => setHoveredPreview(null)}
                    style={{
                      background: isSelected ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                      borderRadius: 16,
                      padding: 14,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: isSelected ? "0 0 20px rgba(46, 196, 182, 0.4)" : isUnlocked ? "none" : rStyle.glow,
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
                      isSelected ? (
                        <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                          ⚡ Equipado Actualmente
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAccessory(acc.id);
                            saveCustomization({ accessory: acc.id });
                          }}
                          disabled={saving}
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
                      <div style={{ background: "rgba(255, 209, 102, 0.08)", border: "1px dashed rgba(255, 209, 102, 0.4)", color: "#ffd166", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.78rem" }}>
                        🔒 Bloqueado (Ir a Tienda)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: INSIGNIAS */}
          {activeTab === "decals" && (() => {
            const isBaseSkinSelected = selectedOutfit === "m_base" || selectedOutfit === "f_base" || selectedOutfit === "default";
            return (
              <div>
                {!isBaseSkinSelected && (
                  <div style={{
                    marginBottom: 14,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px dashed rgba(239, 68, 68, 0.4)",
                    color: "#fca5a5",
                    fontSize: "0.82rem"
                  }}>
                    🔒 Las insignias de pecho solo se muestran en la <strong>Skin Base por defecto</strong>. Equipa la Skin Base para usarlas.
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
                  {decalsList.map((d) => {
                    const isUnlocked = d.id === "none" || unlockedOutfits.includes(d.id);
                    const isSelected = decal === d.id;
                    const rStyle = getRarityStyle(d.rarity);
                    const isDisabled = !isBaseSkinSelected;

                    return (
                      <div
                        key={d.id}
                        onMouseEnter={() => isBaseSkinSelected && setHoveredPreview({ type: "decal", id: d.id })}
                        onMouseLeave={() => setHoveredPreview(null)}
                        style={{
                          background: isSelected && isBaseSkinSelected ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                          border: isSelected && isBaseSkinSelected ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                          borderRadius: 16,
                          padding: 14,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          opacity: isDisabled ? 0.45 : 1,
                          boxShadow: isSelected && isBaseSkinSelected ? "0 0 20px rgba(46, 196, 182, 0.4)" : isUnlocked ? "none" : rStyle.glow,
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
                          isSelected && isBaseSkinSelected ? (
                            <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                              ⚡ Equipada Actualmente
                            </div>
                          ) : (
                            <button
                              disabled={isDisabled || saving}
                              onClick={() => {
                                if (isDisabled) return;
                                setDecal(d.id);
                                saveCustomization({ decal: d.id });
                              }}
                              style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: 10,
                                border: "1.5px solid #2ec4b6",
                                background: "rgba(46, 196, 182, 0.15)",
                                color: "#b8fff9",
                                fontWeight: "bold",
                                fontSize: "0.82rem",
                                cursor: isDisabled ? "not-allowed" : "pointer"
                              }}
                            >
                              🛡️ Equipar Insignia
                            </button>
                          )
                        ) : (
                          <div style={{ background: "rgba(255, 209, 102, 0.08)", border: "1px dashed rgba(255, 209, 102, 0.4)", color: "#ffd166", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.78rem" }}>
                            🔒 Bloqueada (Ir a Tienda)
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* TAB: MASCOTAS */}
          {activeTab === "pets" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {pets.map((p) => {
                const isUnlocked = unlockedOutfits.includes(p.id);
                const isSelected = equippedPet === p.id;
                const rStyle = getRarityStyle(p.rarity);

                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHoveredPreview({ type: "pet", id: p.id })}
                    onMouseLeave={() => setHoveredPreview(null)}
                    style={{
                      background: isSelected ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                      borderRadius: 16,
                      padding: 14,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: isSelected ? "0 0 20px rgba(46, 196, 182, 0.4)" : isUnlocked ? "none" : rStyle.glow
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
                      isSelected ? (
                        <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                          ⚡ Equipada Actualmente
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEquippedPet(p.id);
                            saveCustomization({ equippedPet: p.id });
                          }}
                          disabled={saving}
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
                      <div style={{ background: "rgba(255, 209, 102, 0.08)", border: "1px dashed rgba(255, 209, 102, 0.4)", color: "#ffd166", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.78rem" }}>
                        🔒 Bloqueada (Ir a Tienda)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: MARCOS */}
          {activeTab === "frames" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              {framesList.map((fr) => {
                const isUnlocked = fr.id === "frame_default" || unlockedOutfits.includes(fr.id);
                const isSelected = equippedFrame === fr.id;
                const rStyle = getRarityStyle(fr.rarity);

                return (
                  <div
                    key={fr.id}
                    style={{
                      background: isSelected ? "rgba(46, 196, 182, 0.18)" : isUnlocked ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? "2px solid #2ec4b6" : isUnlocked ? "1.5px solid #2ec4b6" : rStyle.border,
                      borderRadius: 16,
                      padding: 14,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: isSelected ? "0 0 20px rgba(46, 196, 182, 0.4)" : isUnlocked ? "none" : rStyle.glow
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
                      isSelected ? (
                        <div style={{ background: "rgba(46, 196, 182, 0.25)", border: "1.5px solid #2ec4b6", color: "#b8fff9", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.82rem" }}>
                          ⚡ Equipado Actualmente
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEquippedFrame(fr.id);
                            saveCustomization({ equippedFrame: fr.id });
                          }}
                          disabled={saving}
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
                      <div style={{ background: "rgba(255, 209, 102, 0.08)", border: "1px dashed rgba(255, 209, 102, 0.4)", color: "#ffd166", padding: "8px", borderRadius: 10, textAlign: "center", fontWeight: "bold", fontSize: "0.78rem" }}>
                        🔒 Bloqueado (Ir a Tienda)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* BOTÓN CERRAR / LISTO FINAL CON NEÓN DORADO */}
        <div style={{
          padding: "14px 26px 20px 26px",
          borderTop: "1px solid rgba(255, 209, 102, 0.15)",
          background: "rgba(13, 27, 42, 0.96)",
          flexShrink: 0
        }}>
          <button
            onClick={() => {
              soundFx.playClick();
              saveCustomization();
              onClose();
            }}
            disabled={saving}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
              color: "#0d1b2a",
              fontWeight: "bold",
              fontSize: "1.05rem",
              cursor: saving ? "wait" : "pointer",
              boxShadow: "0 0 25px rgba(255, 209, 102, 0.5)",
              transition: "all 0.2s ease"
            }}
          >
            {saving ? "💾 Guardando Cambios..." : "✨ Guardar y Aplicar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
