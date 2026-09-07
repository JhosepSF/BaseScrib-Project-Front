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
  const [accessory, setAccessory] = useState(user?.accessory || "none");
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
    { id: "f_base", name: "Entrenadora Lia (Base)", icon: "👩‍🚀", desc: "Traje reglamentario de la entrenadora Lia." },
    { id: "m_base", name: "Recluta Leo (Base)", icon: "🧑‍🚀", desc: "Traje reglamentario del recluta Leo." },
    { id: "f_streetwear", name: "Skin Urban Streetwear (Lia)", icon: "👟", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "f_cat_onesie", name: "Skin Onesie de Gato (Lia)", icon: "🐱", desc: "Kigurumi/onesie de gato color rosa pastel." },
    { id: "f_superhero", name: "Skin Superheroína (Lia)", icon: "🦸‍♀️", desc: "Traje de superheroína con capa pequeña y emblema de estrella." },
    { id: "f_fantasy_armor", name: "Armadura de Fantasía (Lia)", icon: "🛡️", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "f_cyberpunk", name: "Skin Cyberpunk Neón (Lia)", icon: "⚡", desc: "Traje futurista con líneas de neón rosa y cian." },
    { id: "m_streetwear", name: "Skin Urban Streetwear (Leo)", icon: "👟", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "m_cat_onesie", name: "Skin Onesie de Gato (Leo)", icon: "🐱", desc: "Kigurumi/onesie de gato acolchado." },
    { id: "m_superhero", name: "Skin Superhéroe (Leo)", icon: "🦸‍♂️", desc: "Traje de superhéroe con capa pequeña y emblema de estrella." },
    { id: "m_fantasy_armor", name: "Armadura de Caballero (Leo)", icon: "🛡️", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "m_cyberpunk", name: "Skin Cyberpunk Neón (Leo)", icon: "⚡", desc: "Traje futurista con líneas de neón azul y cian." }
  ];

  const pets = [
    { id: "pet_drone_sparky", name: "Drone Reparador Sparky", icon: "🤖", auraColor: "#2ec4b6", desc: "Mini drone que emite señales de escaneo continuo." },
    { id: "pet_alien_blue", name: "Aliencito Nebuloso", icon: "👾", auraColor: "#4cc9f0", desc: "Acompañante espacial con aura de energía estelar." },
    { id: "pet_cyber_fox", name: "Zorrito Cibernético", icon: "🦊", auraColor: "#b5179e", desc: "Mascota mística con colas de plasma fosforescente." },
    { id: "pet_phoenix_quantum", name: "Fénix Cuántico de Scribtonia", icon: "🦅", auraColor: "#ffd166", desc: "Criatura legendaria envuelta en fuego estelar puro." }
  ];

  const framesList = [
    { id: "frame_default", name: "Marco Base de Recluta", icon: "🔵" },
    { id: "frame_fire", name: "Marco Fuego Infernal 🔥", icon: "🔥" },
    { id: "frame_electric", name: "Marco Voltaje Cuántico ⚡", icon: "⚡" },
    { id: "frame_spidey", name: "Marco Telaraña Superheroica 🕷️", icon: "🕷️" },
    { id: "frame_neon", name: "Marco Neón Cyberpunk 🌌", icon: "🌌" },
    { id: "frame_gold_crown", name: "Marco Corona Dorada 👑", icon: "👑" }
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
    { id: "none", name: "Sin Base", icon: "🚫" },
    { id: "ring", name: "Aro Neón Carmesí", icon: "⭕" },
    { id: "aura_cyan", name: "Portal Radar Cian", icon: "🌀" },
    { id: "aura_quantum", name: "Campo Cuántico", icon: "🔮" },
    { id: "aura_gold", name: "Cresta Celestial", icon: "⚜️" },
    { id: "aura_solar", name: "Plataforma Sol", icon: "🔥" }
  ];

  const headAccessoriesList = [
    { id: "none", name: "Sin Accesorio", icon: "🚫" },
    { id: "goggles", name: "Gafas Cibernéticas", icon: "🥽" },
    { id: "antenna", name: "Antena Espacial", icon: "📡" },
    { id: "crown", name: "Corona Estelar", icon: "👑" }
  ];

  const decalsList = [
    { id: "none", name: "Sin Insignia", icon: "🚫" },
    { id: "star", name: "Estrella ⭐", icon: "⭐" },
    { id: "heart", name: "Corazón ❤️", icon: "❤️" },
    { id: "planet", name: "Planeta 🪐", icon: "🪐" },
    { id: "lightning", name: "Rayo Cuántico ⚡", icon: "⚡" },
    { id: "fire", name: "Fuego Estelar 🔥", icon: "🔥" }
  ];

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
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(circle at center, rgba(15, 23, 42, 0.95), rgba(3, 7, 18, 0.99))",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: 20
    }}>
      <div className="modal-card animate-scaleUp" style={{
        background: "linear-gradient(150deg, #0f172a, #030712)",
        border: "2px solid #2ec4b6",
        borderRadius: 24,
        padding: "24px 26px",
        maxWidth: 860,
        width: "100%",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 60px rgba(46, 196, 182, 0.35)",
        position: "relative",
        color: "#e2e8f0"
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
            border: "1px solid rgba(46, 196, 182, 0.4)",
            color: "#2ec4b6",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10
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
              : "linear-gradient(135deg, rgba(46, 196, 182, 0.95), rgba(15, 76, 92, 0.95))",
            border: saveMessage.includes("⚠️") ? "1.5px solid #fca5a5" : "1.5px solid #b8fff9",
            borderRadius: 20,
            padding: "8px 22px",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "0.85rem",
            boxShadow: saveMessage.includes("⚠️") ? "0 8px 25px rgba(239, 68, 68, 0.6)" : "0 8px 25px rgba(46, 196, 182, 0.6)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "toastSlideDown 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
          }}>
            <span>{saveMessage}</span>
          </div>
        )}

        {/* HEADER DEL INVENTARIO + AVATAR PREVIEW */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: "2.3rem" }}>🎨</span>
              <div>
                <h2 style={{ color: "#2ec4b6", margin: 0, fontSize: "1.55rem", textShadow: "0 0 15px rgba(46, 196, 182, 0.5)" }}>
                  Inventario & Armario
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "2px 0 0 0" }}>
                  Selecciona la pestaña para personalizar tu recluta. Todo se aplica al instante.
                </p>
              </div>
            </div>
          </div>

          {/* PREVISUALIZACIÓN DEL AVATAR */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1.5px solid rgba(46, 196, 182, 0.3)",
            borderRadius: 20,
            padding: 6,
            boxShadow: "0 0 20px rgba(0,0,0,0.3)"
          }}>
            <AvatarShowcase 
              outfitId={selectedOutfit} 
              petId={equippedPet} 
              previewItem={hoveredPreview} 
              size="medium"
              suitColor={suitColor}
              visorColor={visorColor}
              accessory={accessory}
              decal={decal}
              gender={gender}
            />
          </div>
        </div>

        {/* NAVEGACIÓN DE APARTADOS HORIZONTALES (TABS) */}
        <div style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none"
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
                  gap: 6,
                  padding: "9px 16px",
                  borderRadius: 14,
                  border: isActive ? "2px solid #2ec4b6" : "1px solid rgba(255, 255, 255, 0.12)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(46, 196, 182, 0.25), rgba(15, 76, 92, 0.4))"
                    : "rgba(255, 255, 255, 0.04)",
                  color: isActive ? "#2ec4b6" : "#94a3b8",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isActive ? "0 0 15px rgba(46, 196, 182, 0.3)" : "none",
                  transform: isActive ? "scale(1.02)" : "scale(1)"
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
          overflowY: "auto",
          paddingRight: 4,
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          
          {/* TAB: SKINS */}
          {activeTab === "skins" && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#2ec4b6", fontSize: "0.95rem" }}>
                👗 Armario de Skins ({gender === "male" ? "Recluta Leo 🧑‍🚀" : "Entrenadora Lia 👩‍🚀"}):
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
                {outfits.filter(o => gender === "male" ? o.id.startsWith("m_") : o.id.startsWith("f_")).map((o) => {
                  const isUnlocked = unlockedOutfits.includes(o.id);
                  const isSelected = selectedOutfit === o.id;

                  return (
                    <div
                      key={o.id}
                      onMouseEnter={() => setHoveredPreview({ type: "outfit", id: o.id })}
                      onMouseLeave={() => setHoveredPreview(null)}
                      style={{
                        background: isSelected ? "rgba(46, 196, 182, 0.15)" : "rgba(255,255,255,0.03)",
                        border: isSelected ? "2px solid #2ec4b6" : isUnlocked ? "1px solid rgba(46, 196, 182, 0.3)" : "1px dashed rgba(255,255,255,0.15)",
                        borderRadius: 14,
                        padding: 12,
                        opacity: isUnlocked ? 1 : 0.45,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.15s ease"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "1.6rem", marginBottom: 4 }}>{o.icon}</div>
                        <strong style={{ color: "#f8fafc", fontSize: "0.88rem", display: "block" }}>{o.name}</strong>
                        <p style={{ color: "#94a3b8", fontSize: "0.76rem", margin: "4px 0 10px 0" }}>{o.desc}</p>
                      </div>

                      {isUnlocked ? (
                        <button
                          onClick={() => {
                            const newGender = o.id.startsWith("m_") ? "male" : "female";
                            setSelectedOutfit(o.id);
                            saveCustomization({ selectedOutfit: o.id, gender: newGender });
                          }}
                          disabled={isSelected || saving}
                          style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: 10,
                            border: "none",
                            background: isSelected ? "#2ec4b6" : "rgba(255,255,255,0.1)",
                            color: isSelected ? "#002427" : "#f8fafc",
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            cursor: isSelected ? "default" : "pointer"
                          }}
                        >
                          {isSelected ? "✓ Equipado" : "Equipar Skin"}
                        </button>
                      ) : (
                        <span style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: "bold" }}>
                          🔒 Bloqueado en Tienda
                        </span>
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
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>🌀 Plataformas & Auras de Suelo:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 10 }}>
                {basesList.map((b) => {
                  const isSel = accessory === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        setAccessory(b.id);
                        saveCustomization({ accessory: b.id });
                      }}
                      style={{
                        padding: "10px 8px",
                        borderRadius: 12,
                        border: isSel ? "2px solid #2ec4b6" : "1px solid rgba(255,255,255,0.1)",
                        background: isSel ? "rgba(46, 196, 182, 0.15)" : "rgba(255,255,255,0.03)",
                        color: isSel ? "#2ec4b6" : "#e2e8f0",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 6,
                        overflow: "hidden"
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>{b.icon}</span>
                      <span style={{
                        width: "100%",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        whiteSpace: "normal",
                        lineHeight: 1.25,
                        textAlign: "center"
                      }}>
                        {b.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: ACCESORIOS DE CABEZA */}
          {activeTab === "accessories" && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>👓 Accesorio de Casco / Cabeza:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 10 }}>
                {headAccessoriesList.map((acc) => {
                  const isSel = accessory === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setAccessory(acc.id);
                        saveCustomization({ accessory: acc.id });
                      }}
                      style={{
                        padding: "10px 8px",
                        borderRadius: 12,
                        border: isSel ? "2px solid #ffd166" : "1px solid rgba(255,255,255,0.1)",
                        background: isSel ? "rgba(255, 209, 102, 0.15)" : "rgba(255,255,255,0.03)",
                        color: isSel ? "#ffd166" : "#e2e8f0",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 6,
                        overflow: "hidden"
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>{acc.icon}</span>
                      <span style={{
                        width: "100%",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        whiteSpace: "normal",
                        lineHeight: 1.25,
                        textAlign: "center"
                      }}>
                        {acc.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: INSIGNIAS */}
          {activeTab === "decals" && (() => {
            const isBaseSkinSelected = selectedOutfit === "m_base" || selectedOutfit === "f_base" || selectedOutfit === "default";
            return (
              <div style={{
                background: isBaseSkinSelected ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.25)",
                border: isBaseSkinSelected ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(239, 68, 68, 0.35)",
                borderRadius: 16,
                padding: 16
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ margin: 0, color: "#2ec4b6", fontSize: "0.9rem" }}>🛡️ Insignia de Pecho:</h4>
                  {!isBaseSkinSelected && (
                    <span style={{ fontSize: "0.78rem", color: "#f87171", fontWeight: "bold" }}>
                      🔒 Bloqueado en Skins Especiales
                    </span>
                  )}
                </div>

                {!isBaseSkinSelected && (
                  <div style={{
                    marginBottom: 12,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px dashed rgba(239, 68, 68, 0.4)",
                    color: "#fca5a5",
                    fontSize: "0.8rem"
                  }}>
                    🔒 Las insignias de pecho solo se muestran en la <strong>Skin Base por defecto</strong>. Equipa la Skin Base para usarlas.
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 10 }}>
                  {decalsList.map((d) => {
                    const isSel = decal === d.id;
                    const isDisabled = !isBaseSkinSelected;
                    return (
                      <button
                        key={d.id}
                        disabled={isDisabled}
                        onClick={() => {
                          if (isDisabled) return;
                          setDecal(d.id);
                          saveCustomization({ decal: d.id });
                        }}
                        style={{
                          padding: "10px 8px",
                          borderRadius: 12,
                          border: isSel && isBaseSkinSelected ? "2px solid #2ec4b6" : "1px solid rgba(255,255,255,0.1)",
                          background: isSel && isBaseSkinSelected ? "rgba(46, 196, 182, 0.15)" : "rgba(255,255,255,0.03)",
                          color: isDisabled ? "#64748b" : (isSel ? "#2ec4b6" : "#e2e8f0"),
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                          opacity: isDisabled ? 0.45 : 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          gap: 6,
                          overflow: "hidden"
                        }}
                      >
                        <span style={{ fontSize: "1.3rem" }}>{d.icon}</span>
                        <span style={{
                          width: "100%",
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                          whiteSpace: "normal",
                          lineHeight: 1.25,
                          textAlign: "center"
                        }}>
                          {d.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* TAB: MASCOTAS */}
          {activeTab === "pets" && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>👾 Mascota Acompañante Equipada:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {pets.map((p) => {
                  const isUnlocked = unlockedOutfits.includes(p.id);
                  const isSelected = equippedPet === p.id;
                  return (
                    <div
                      key={p.id}
                      onMouseEnter={() => setHoveredPreview({ type: "pet", id: p.id })}
                      onMouseLeave={() => setHoveredPreview(null)}
                      onClick={() => {
                        if (!isUnlocked) return;
                        setEquippedPet(p.id);
                        saveCustomization({ equippedPet: p.id });
                      }}
                      style={{
                        background: isSelected ? "rgba(46, 196, 182, 0.15)" : "rgba(255,255,255,0.03)",
                        border: isSelected ? "2px solid #2ec4b6" : isUnlocked ? "1px solid rgba(255,255,255,0.2)" : "1px dashed rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        padding: 12,
                        opacity: isUnlocked ? 1 : 0.45,
                        cursor: isUnlocked ? "pointer" : "not-allowed"
                      }}
                    >
                      <div style={{ fontSize: "1.6rem", marginBottom: 4 }}>{p.icon}</div>
                      <strong style={{ color: "#f8fafc", fontSize: "0.85rem", display: "block" }}>{p.name}</strong>
                      <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "4px 0 8px 0" }}>{p.desc}</p>
                      {isUnlocked ? (
                        <span style={{ color: isSelected ? "#2ec4b6" : "#94a3b8", fontSize: "0.78rem", fontWeight: "bold" }}>
                          {isSelected ? "✓ Equipada" : "Seleccionar"}
                        </span>
                      ) : (
                        <span style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: "bold" }}>
                          🔒 Bloqueada en Tienda
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: MARCOS */}
          {activeTab === "frames" && (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16 }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>🖼️ Marco de Usuario Equipado (Barra de Menú & HUD):</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                {framesList.map((fr) => {
                  const isUnlocked = fr.id === "frame_default" || unlockedOutfits.includes(fr.id);
                  const isSelected = equippedFrame === fr.id;
                  return (
                    <div
                      key={fr.id}
                      onClick={() => {
                        if (!isUnlocked) return;
                        setEquippedFrame(fr.id);
                        saveCustomization({ equippedFrame: fr.id });
                      }}
                      style={{
                        background: isSelected ? "rgba(0, 240, 255, 0.15)" : "rgba(255,255,255,0.03)",
                        border: isSelected ? "2px solid #00f0ff" : isUnlocked ? "1px solid rgba(255,255,255,0.2)" : "1px dashed rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        padding: 12,
                        opacity: isUnlocked ? 1 : 0.45,
                        cursor: isUnlocked ? "pointer" : "not-allowed",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <AvatarFrame frameId={fr.id} size="medium">
                        <span style={{ fontSize: "1.2rem" }}>{fr.icon}</span>
                      </AvatarFrame>
                      <strong style={{ color: "#f8fafc", fontSize: "0.82rem", textAlign: "center" }}>{fr.name}</strong>
                      {isUnlocked ? (
                        <span style={{ color: isSelected ? "#00f0ff" : "#94a3b8", fontSize: "0.78rem", fontWeight: "bold" }}>
                          {isSelected ? "✓ Equipado" : "Equipar Marco"}
                        </span>
                      ) : (
                        <span style={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: "bold" }}>
                          🔒 Bloqueado en Tienda
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* BOTÓN CERRAR / LISTO FINAL */}
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <button
            onClick={() => {
              soundFx.playClick();
              saveCustomization();
              onClose();
            }}
            disabled={saving}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #2ec4b6, #00ff87)",
              color: "#031720",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: saving ? "wait" : "pointer",
              boxShadow: "0 0 20px rgba(46, 196, 182, 0.4)"
            }}
          >
            {saving ? "💾 Guardando..." : "✨ Guardar y Aplicar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
