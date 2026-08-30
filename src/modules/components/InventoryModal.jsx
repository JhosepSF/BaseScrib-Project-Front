import { useState } from "react";
import { soundFx } from "../utils/soundEffects";
import AvatarShowcase from "./AvatarShowcase";

export default function InventoryModal({ user, token, onClose, onUserUpdated }) {
  const [gender, setGender] = useState("female"); // 'female' or 'male'
  const [suitColor, setSuitColor] = useState("#2ec4b6");
  const [visorColor, setVisorColor] = useState("#a3e2f7");
  const [accessory, setAccessory] = useState("none");
  const [decal, setDecal] = useState("none");
  const [equippedPet, setEquippedPet] = useState(localStorage.getItem("basescrib_equipped_pet") || "pet_alien_blue");
  const [hoveredPreview, setHoveredPreview] = useState(null);

  const outfits = [
    { id: "f_base", name: "Entrenadora Lia (Base)", icon: "👩‍🚀", desc: "Traje reglamentario de la entrenadora Lia." },
    { id: "m_base", name: "Recluta Leo (Base)", icon: "🧑‍🚀", desc: "Traje reglamentario del recluta Leo." },
    { id: "f_cyberpunk", name: "Skin Cyberpunk Neón (Lia)", icon: "⚡", desc: "Traje futurista con líneas de neón rosa y cian." },
    { id: "f_cat_onesie", name: "Skin Onesie de Gato (Lia)", icon: "🐱", desc: "Kigurumi/onesie de gato color rosa pastel." },
    { id: "f_fantasy_armor", name: "Armadura de Fantasía (Lia)", icon: "🛡️", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "f_streetwear", name: "Skin Urban Streetwear (Lia)", icon: "👟", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "f_superhero", name: "Skin Superheroína (Lia)", icon: "🦸‍♀️", desc: "Traje de superheroína con capa pequeña y emblema de estrella." },
    { id: "m_cyberpunk", name: "Skin Cyberpunk Neón (Leo)", icon: "⚡", desc: "Traje futurista con líneas de neón azul y cian." },
    { id: "m_cat_onesie", name: "Skin Onesie de Gato (Leo)", icon: "🐱", desc: "Kigurumi/onesie de gato acolchado." },
    { id: "m_fantasy_armor", name: "Armadura de Caballero (Leo)", icon: "🛡️", desc: "Armadura de caballero de fantasía blanca y dorada." },
    { id: "m_streetwear", name: "Skin Urban Streetwear (Leo)", icon: "👟", desc: "Sudadera oversize moderna con zapatillas de deporte." },
    { id: "m_superhero", name: "Skin Superhéroe (Leo)", icon: "🦸‍♂️", desc: "Traje de superhéroe con capa pequeña y emblema de estrella." }
  ];

  const pets = [
    { id: "pet_alien_blue", name: "Aliencito Nebuloso", icon: "👾", auraColor: "#4cc9f0", desc: "Acompañante espacial con aura de energía estelar." },
    { id: "pet_drone_sparky", name: "Drone Reparador Sparky", icon: "🤖", auraColor: "#2ec4b6", desc: "Mini drone que emite señales de escaneo continuo." },
    { id: "pet_cyber_fox", name: "Zorrito Cibernético", icon: "🦊", auraColor: "#b5179e", desc: "Mascota mística con colas de plasma fosforescente." },
    { id: "pet_phoenix_quantum", name: "Fénix Cuántico de Scribtonia", icon: "🦅", auraColor: "#ffd166", desc: "Criatura legendaria envuelta en fuego estelar puro." }
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
    { name: "Visor Amarillo", hex: "#ffd166" },
    { name: "Visor Rojo", hex: "#ff6b6b" },
    { name: "Visor Verde", hex: "#00ff87" },
    { name: "Visor Violeta", hex: "#ab47bc" },
    { name: "Visor Oscuro", hex: "#1a1a1a" }
  ];

  const unlockedOutfits = user?.unlocked_outfits || ["f_base", "m_base"];
  const selectedOutfit = user?.selected_outfit || (gender === "female" ? "f_base" : "m_base");

  const handleSelectOutfit = (outfitId) => {
    soundFx.playClick();
    if (onUserUpdated) {
      onUserUpdated({
        ...user,
        selected_outfit: outfitId
      });
    }
  };

  const handleSelectPet = (petId) => {
    soundFx.playClick();
    setEquippedPet(petId);
    localStorage.setItem("basescrib_equipped_pet", petId);
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
        maxWidth: 780,
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
                  Equipa tus skins desbloqueadas, personaliza colores y selecciona tu mascota activa.
                </p>
              </div>
            </div>
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
                onClick={() => { setGender("female"); handleSelectOutfit("f_base"); }}
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
                onClick={() => { setGender("male"); handleSelectOutfit("m_base"); }}
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
            <h4 style={{ margin: "0 0 10px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>👗 Armario de Skins Desbloqueadas:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {outfits.map((o) => {
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
                        onClick={() => handleSelectOutfit(o.id)}
                        disabled={isSelected}
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

          {/* PALETA DE COLORES DE TRAJE & VISOR */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 14 }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#2ec4b6", fontSize: "0.85rem" }}>🎨 Color de Traje:</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {suitColorsList.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSuitColor(c.hex)}
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
              <h4 style={{ margin: "0 0 8px 0", color: "#2ec4b6", fontSize: "0.85rem" }}>🥽 Color de Visor:</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {visorColorsList.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setVisorColor(c.hex)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: c.hex,
                      border: visorColor === c.hex ? "3px solid #2ec4b6" : "1px solid rgba(255,255,255,0.3)",
                      cursor: "pointer"
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* MASCOTA EQUIPADA */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 14 }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#2ec4b6", fontSize: "0.9rem" }}>👾 Mascota Acompañante Equipada:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {pets.map((p) => {
                const isSelected = equippedPet === p.id;
                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHoveredPreview({ type: "pet", id: p.id })}
                    onMouseLeave={() => setHoveredPreview(null)}
                    onClick={() => handleSelectPet(p.id)}
                    style={{
                      background: isSelected ? "rgba(46, 196, 182, 0.15)" : "rgba(255,255,255,0.03)",
                      border: isSelected ? "2px solid #2ec4b6" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      padding: 10,
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: "1.5rem" }}>{p.icon}</div>
                    <strong style={{ color: "#f8fafc", fontSize: "0.8rem", display: "block" }}>{p.name}</strong>
                    <span style={{ color: isSelected ? "#2ec4b6" : "#94a3b8", fontSize: "0.75rem", fontWeight: "bold" }}>
                      {isSelected ? "✓ Equipada" : "Seleccionar"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
