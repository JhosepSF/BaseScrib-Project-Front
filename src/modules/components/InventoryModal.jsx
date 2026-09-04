import { useState } from "react";
import { soundFx } from "../utils/soundEffects";
import { API_BASE } from "../../config";
import AvatarShowcase from "./AvatarShowcase";
import AvatarFrame from "./AvatarFrame";

export default function InventoryModal({ user, token, onClose, onUserUpdated }) {
  const [gender, setGender] = useState(user?.gender || (user?.selected_outfit?.startsWith("m_") ? "male" : "female"));
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

  const accessoriesList = [
    { id: "none", name: "Sin Base", icon: "🚫" },
    { id: "ring", name: "Aro Neón Carmesí", icon: "⭕" },
    { id: "aura_cyan", name: "Portal Radar Cibernético Cian", icon: "🌀" },
    { id: "aura_quantum", name: "Campo Cuántico Violáceo", icon: "🔮" },
    { id: "aura_gold", name: "Cresta Celestial Dorada", icon: "⚜️" },
    { id: "aura_solar", name: "Plataforma Sol Estelar", icon: "🔥" },
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
        padding: 26,
        maxWidth: 820,
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
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
            justifyContent: "center"
          }}
        >
          ✖
        </button>

        {/* HEADER DEL INVENTARIO */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "2.5rem" }}>🎨</span>
              <div>
                <h2 style={{ color: "#2ec4b6", margin: 0, fontSize: "1.65rem", textShadow: "0 0 15px rgba(46, 196, 182, 0.5)" }}>
                  Inventario & Armario del Recluta
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: "2px 0 0 0" }}>
                  Equipa tus skins, lentes amarillos, accesorios y mascotas. Todo cambio se guarda permanentemente.
                </p>
              </div>
            </div>

            {saveMessage && (
              <div style={{ marginTop: 10, fontSize: "0.85rem", fontWeight: "bold", color: "#b8fff9" }}>
                {saveMessage}
              </div>
            )}
          </div>

          {/* PREVISUALIZACIÓN DEL AVATAR */}
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1.5px solid rgba(46, 196, 182, 0.3)", borderRadius: 20, padding: 8 }}>
            <AvatarShowcase 
              outfitId={selectedOutfit} 
              petId={equippedPet} 
              previewItem={hoveredPreview} 
              size="large"
              suitColor={suitColor}
              visorColor={visorColor}
              accessory={accessory}
              decal={decal}
              gender={gender}
            />
          </div>
        </div>

        {/* OPCIONES DE PERSONALIZACIÓN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* SELECCIÓN DE GÉNERO / BASE */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 14 }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>👤 Personaje Base:</h4>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  setGender("female");
                  setSelectedOutfit("f_base");
                  saveCustomization({ gender: "female", selectedOutfit: "f_base" });
                }}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: gender === "female" ? "2px solid #f72585" : "1px solid rgba(255,255,255,0.1)",
                  background: gender === "female" ? "rgba(247, 37, 133, 0.2)" : "rgba(255,255,255,0.04)",
                  color: gender === "female" ? "#f72585" : "#94a3b8",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                👩‍🚀 Entrenadora Lia
              </button>
              <button
                onClick={() => {
                  setGender("male");
                  setSelectedOutfit("m_base");
                  saveCustomization({ gender: "male", selectedOutfit: "m_base" });
                }}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: gender === "male" ? "2px solid #4cc9f0" : "1px solid rgba(255,255,255,0.1)",
                  background: gender === "male" ? "rgba(76, 201, 240, 0.2)" : "rgba(255,255,255,0.04)",
                  color: gender === "male" ? "#4cc9f0" : "#94a3b8",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                🧑‍🚀 Recluta Leo
              </button>
            </div>
          </div>

          {/* ARMARIO DE SKINS ADQUIRIDAS / UNLOCKED */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 14 }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>
              👗 Armario de Skins ({gender === "male" ? "Recluta Leo 🧑‍🚀" : "Entrenadora Lia 👩‍🚀"}):
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
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
                      borderRadius: 12,
                      padding: 12,
                      opacity: isUnlocked ? 1 : 0.45,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "1.6rem", marginBottom: 4 }}>{o.icon}</div>
                      <strong style={{ color: "#f8fafc", fontSize: "0.85rem", display: "block" }}>{o.name}</strong>
                      <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "4px 0 8px 0" }}>{o.desc}</p>
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          setSelectedOutfit(o.id);
                          saveCustomization({ selectedOutfit: o.id });
                        }}
                        disabled={isSelected || saving}
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: 8,
                          border: "none",
                          background: isSelected ? "#2ec4b6" : "rgba(255,255,255,0.1)",
                          color: isSelected ? "#002427" : "#f8fafc",
                          fontWeight: "bold",
                          fontSize: "0.78rem",
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

          {/* PALETA DE COLORES DE TRAJE & VISOR / LENTES */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 14 }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#2ec4b6", fontSize: "0.85rem" }}>🎨 Color de Traje Base:</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {suitColorsList.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSuitColor(c.hex);
                      saveCustomization({ suitColor: c.hex });
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: c.hex,
                      border: suitColor === c.hex ? "3px solid #2ec4b6" : "1px solid rgba(255,255,255,0.3)",
                      cursor: "pointer"
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 14 }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#2ec4b6", fontSize: "0.85rem" }}>🥽 Color de Visor / Lentes:</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {visorColorsList.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setVisorColor(c.hex);
                      saveCustomization({ visorColor: c.hex });
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: c.hex,
                      border: visorColor === c.hex ? "3px solid #ffd166" : "1px solid rgba(255,255,255,0.3)",
                      cursor: "pointer"
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ACCESORIOS Y INSIGNIAS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {/* ACCESORIOS */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 14 }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2ec4b6", fontSize: "0.85rem" }}>👓 Accesorio de Casco / Cabeza:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
                {accessoriesList.map((acc) => {
                  const isSel = accessory === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => {
                        setAccessory(acc.id);
                        saveCustomization({ accessory: acc.id });
                      }}
                      style={{
                        padding: "8px 6px",
                        borderRadius: 10,
                        border: isSel ? "2px solid #ffd166" : "1px solid rgba(255,255,255,0.1)",
                        background: isSel ? "rgba(255, 209, 102, 0.15)" : "rgba(255,255,255,0.03)",
                        color: isSel ? "#ffd166" : "#e2e8f0",
                        fontSize: "0.78rem",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      {acc.icon} {acc.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INSIGNIAS */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 14 }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#2ec4b6", fontSize: "0.85rem" }}>🛡️ Insignia de Pecho:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
                {decalsList.map((d) => {
                  const isSel = decal === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        setDecal(d.id);
                        saveCustomization({ decal: d.id });
                      }}
                      style={{
                        padding: "8px 6px",
                        borderRadius: 10,
                        border: isSel ? "2px solid #2ec4b6" : "1px solid rgba(255,255,255,0.1)",
                        background: isSel ? "rgba(46, 196, 182, 0.15)" : "rgba(255,255,255,0.03)",
                        color: isSel ? "#2ec4b6" : "#e2e8f0",
                        fontSize: "0.78rem",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      {d.icon} {d.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MASCOTA EQUIPADA */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 14 }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>👾 Mascota Acompañante Equipada:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
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
                      padding: 10,
                      opacity: isUnlocked ? 1 : 0.45,
                      cursor: isUnlocked ? "pointer" : "not-allowed"
                    }}
                  >
                    <div style={{ fontSize: "1.5rem" }}>{p.icon}</div>
                    <strong style={{ color: "#f8fafc", fontSize: "0.8rem", display: "block" }}>{p.name}</strong>
                    {isUnlocked ? (
                      <span style={{ color: isSelected ? "#2ec4b6" : "#94a3b8", fontSize: "0.75rem", fontWeight: "bold" }}>
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

          {/* MARCOS DE USUARIO ANIMADOS */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 14 }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>🖼️ Marco de Usuario Equipado (Barra de Menú & HUD):</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
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
                      padding: 10,
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
                    <strong style={{ color: "#f8fafc", fontSize: "0.8rem", textAlign: "center" }}>{fr.name}</strong>
                    {isUnlocked ? (
                      <span style={{ color: isSelected ? "#00f0ff" : "#94a3b8", fontSize: "0.75rem", fontWeight: "bold" }}>
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

          {/* BOTÓN GUARDAR FINAL */}
          <button
            onClick={() => saveCustomization()}
            disabled={saving}
            style={{
              padding: "14px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #2ec4b6, #00ff87)",
              color: "#031720",
              fontWeight: "bold",
              fontSize: "1.05rem",
              cursor: saving ? "wait" : "pointer",
              boxShadow: "0 0 20px rgba(46, 196, 182, 0.5)",
              marginTop: 10
            }}
          >
            {saving ? "💾 Guardando Personalización..." : "💾 Guardar y Aplicar Cambios de Avatar"}
          </button>

        </div>
      </div>
    </div>
  );
}
