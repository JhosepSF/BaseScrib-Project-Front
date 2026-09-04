import { useState } from "react";

import AutoScaledAvatar from "./AutoScaledAvatar";

// Base Solo & Sin Insignia Character Assets
import LiaSolo from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import LiaSoloSinInsignia from "../../assets/amongus/PERSONAJES/Lia personaje solo sin insignia.png";
import LeoSolo from "../../assets/amongus/PERSONAJES/Leo personaje solo.png";
import LeoSoloSinInsignia from "../../assets/amongus/PERSONAJES/Leo personaje solo sin insignia.png";

// Base Color Variants (Lia)
import LiaDefault from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LIA BASE/lia_default.png";
import LiaRed from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LIA BASE/lia_red.png";
import LiaYellow from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LIA BASE/lia_yellow.png";
import LiaOrange from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LIA BASE/lia_orange.png";
import LiaGreen from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LIA BASE/lia_green.png";
import LiaPurple from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LIA BASE/lia_purple.png";
import LiaWhite from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LIA BASE/lia_white.png";
import LiaBlack from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LIA BASE/lia_black.png";

// Base Color Variants (Leo)
import LeoDefault from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_default.png";
import LeoRed from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_red.png";
import LeoYellow from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_yellow.png";
import LeoOrange from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_orange.png";
import LeoGreen from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_green.png";
import LeoPurple from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_purple.png";
import LeoWhite from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_white.png";
import LeoBlack from "../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_black.png";

// Purchasable Female Skins
import fCyberpunk from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE FEMENINA/female_skin_cyberpunk.png";
import fCatOnesie from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE FEMENINA/female_skin_cat_onesie.png";
import fFantasyArmor from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE FEMENINA/female_skin_fantasy_armor.png";
import fStreetwear from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE FEMENINA/female_skin_streetwear.png";
import fSuperhero from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE FEMENINA/female_skin_superhero.png";

// Purchasable Male Skins
import mCyberpunk from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE MASCULINO/male_skin_cyberpunk.png";
import mCatOnesie from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE MASCULINO/male_skin_cat_onesie.png";
import mFantasyArmor from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE MASCULINO/male_skin_fantasy_armor.png";
import mStreetwear from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE MASCULINO/male_skin_streetwear.png";
import mSuperhero from "../../assets/amongus/PERSONAJES/SKINS/PERSONAJE MASCULINO/male_skin_superhero.png";

// Futuristic Sci-Fi Glasses Accessories (PNG)
import GafasCian from "../../assets/amongus/ACCESORIOS/GAFAS/gafas_cian.png";
import GafasAmarillas from "../../assets/amongus/ACCESORIOS/GAFAS/gafas_amarillas.png";
import GafasRojas from "../../assets/amongus/ACCESORIOS/GAFAS/gafas_rojas.png";
import GafasVerdes from "../../assets/amongus/ACCESORIOS/GAFAS/gafas_verdes.png";
import GafasVioletas from "../../assets/amongus/ACCESORIOS/GAFAS/gafas_violetas.png";
import GafasOscuras from "../../assets/amongus/ACCESORIOS/GAFAS/gafas_oscuras.png";

const glassesMap = {
  "#a3e2f7": GafasCian,
  "#2ec4b6": GafasCian,
  "#ffd166": GafasAmarillas,
  "#ff6b6b": GafasRojas,
  "#00ff87": GafasVerdes,
  "#ab47bc": GafasVioletas,
  "#1a1a1a": GafasOscuras,
  "gafas_oscuras": GafasOscuras,
  "gafas_cian": GafasCian,
  "gafas_amarillas": GafasAmarillas,
  "gafas_rojas": GafasRojas,
  "gafas_verdes": GafasVerdes,
  "gafas_violetas": GafasVioletas,
  "goggles": GafasCian
};

const liaColorMap = {
  "#2ec4b6": LiaDefault,
  "#ff6b6b": LiaRed,
  "#ffd166": LiaYellow,
  "#ff6b35": LiaOrange,
  "#00ff87": LiaGreen,
  "#ab47bc": LiaPurple,
  "#ffffff": LiaWhite,
  "#1a1a1a": LiaBlack
};

const leoColorMap = {
  "#2ec4b6": LeoDefault,
  "#ff6b6b": LeoRed,
  "#ffd166": LeoYellow,
  "#ff6b35": LeoOrange,
  "#00ff87": LeoGreen,
  "#ab47bc": LeoPurple,
  "#ffffff": LeoWhite,
  "#1a1a1a": LeoBlack
};

const outfitImages = {
  f_cyberpunk: fCyberpunk,
  f_cat_onesie: fCatOnesie,
  f_fantasy_armor: fFantasyArmor,
  f_streetwear: fStreetwear,
  f_superhero: fSuperhero,

  m_cyberpunk: mCyberpunk,
  m_cat_onesie: mCatOnesie,
  m_fantasy_armor: mFantasyArmor,
  m_streetwear: mStreetwear,
  m_superhero: mSuperhero
};

export default function AvatarShowcase({
  outfitId = "f_base",
  petId = "pet_alien_blue",
  previewItem = null,
  size = "medium",
  suitColor = "#2ec4b6",
  visorColor = "#a3e2f7",
  accessory = "none",
  decal = "none",
  gender = "female",
  transparent = false,
  showPet = true,
  showTitle = true
}) {
  const isLarge = size === "large" || size === "xlarge" || size === "xxlarge";

  // Stage dimensions: spacious and prominent
  const stageWidth = size === "xxlarge" ? 460 : (size === "xlarge" ? 360 : (isLarge ? 290 : 210));
  const stageHeight = size === "xxlarge" ? 520 : (size === "xlarge" ? 400 : (isLarge ? 310 : 230));

  // Determine active displayed outfit and pet
  let currentOutfit = outfitId;
  let currentPet = petId;

  if (typeof previewItem === "string") {
    if (previewItem.startsWith("pet_")) {
      currentPet = previewItem;
    } else {
      currentOutfit = previewItem;
    }
  } else if (previewItem && typeof previewItem === "object") {
    if (previewItem.type === "pet") currentPet = previewItem.id;
    else if (previewItem.type === "outfit") currentOutfit = previewItem.id;
    else if (previewItem.id) {
      if (previewItem.id.startsWith("pet_")) currentPet = previewItem.id;
      else currentOutfit = previewItem.id;
    }
  }

  // 1. Detect active character gender: true = Leo (male), false = Lia (female)
  const isMale = currentOutfit.startsWith("m_") || (gender === "male" && !currentOutfit.startsWith("f_"));

  // 2. Character dimensions inside stage - Supports presets & custom numeric sizes
  const charWidth = size === "xxlarge" ? 380 : (size === "xlarge" ? 260 : (isLarge ? 200 : (typeof size === "number" ? Math.round(size * 0.65) : 140)));
  const charHeight = size === "xxlarge" ? 450 : (size === "xlarge" ? 310 : (isLarge ? 240 : (typeof size === "number" ? Math.round(size * 0.8) : 170)));

  // 3. Dynamic vector ratios: automatically scales to ANY size, resolution or transform!
  const scale = charHeight / 240;
  const wScale = charWidth / 200;

  const pos = isMale
    ? {
      goggles: { top: `${Math.round(38.5 * scale)}px`, left: "54%", width: `${Math.round(98 * wScale)}px` },
      antenna: { top: `${Math.round(-22 * scale)}px`, left: "53%", fontSize: `${(2.4 * scale).toFixed(2)}rem` },
      crown: { top: `${Math.round(-22 * scale)}px`, left: "53%", fontSize: `${(2.4 * scale).toFixed(2)}rem` },
      ring: { top: `${Math.round(218 * scale)}px`, left: "50%" },
      decals: {
        star: { top: `${Math.round(140 * scale)}px`, left: "53%", fontSize: `${(1.7 * scale).toFixed(2)}rem` },
        heart: { top: `${Math.round(140 * scale)}px`, left: "53%", fontSize: `${(1.7 * scale).toFixed(2)}rem` },
        planet: { top: `${Math.round(135 * scale)}px`, left: "53%", fontSize: `${(1.8 * scale).toFixed(2)}rem` }
      }
    }
    : {
      goggles: { top: `${Math.round(40 * scale)}px`, left: "55%", width: `${Math.round(98 * wScale)}px` },
      antenna: { top: `${Math.round(-20 * scale)}px`, left: "53%", fontSize: `${(2.4 * scale).toFixed(2)}rem` },
      crown: { top: `${Math.round(-20 * scale)}px`, left: "53%", fontSize: `${(2.4 * scale).toFixed(2)}rem` },
      ring: { top: `${Math.round(220 * scale)}px`, left: "52.5%" },
      decals: {
        star: { top: `${Math.round(140 * scale)}px`, left: "53%", fontSize: `${(1.7 * scale).toFixed(2)}rem` },
        heart: { top: `${Math.round(140 * scale)}px`, left: "53%", fontSize: `${(1.7 * scale).toFixed(2)}rem` },
        planet: { top: `${Math.round(135 * scale)}px`, left: "53%", fontSize: `${(1.8 * scale).toFixed(2)}rem` }
      }
    };

  let characterImg = outfitImages[currentOutfit];
  if (!characterImg) {
    const hasCustomDecal = decal && decal !== "none";
    if (isMale) {
      if (hasCustomDecal) {
        characterImg = suitColor === "#2ec4b6" ? LeoSoloSinInsignia : (leoColorMap[suitColor] || LeoSoloSinInsignia);
      } else {
        characterImg = suitColor === "#2ec4b6" ? LeoSolo : (leoColorMap[suitColor] || LeoSolo);
      }
    } else {
      if (hasCustomDecal) {
        characterImg = suitColor === "#2ec4b6" ? LiaSoloSinInsignia : (liaColorMap[suitColor] || LiaSoloSinInsignia);
      } else {
        characterImg = suitColor === "#2ec4b6" ? LiaSolo : (liaColorMap[suitColor] || LiaSolo);
      }
    }
  }

  const title = isMale ? "🧑‍🚀 Recluta Leo" : "👩‍🚀 Entrenadora Lia";

  const outfitFilter = {
    f_base: "none",
    m_base: "none",
    f_explorer: "brightness(1.1)",
    m_explorer: "brightness(1.1)",
    f_scientist: "brightness(1.15)",
    m_tech: "brightness(1.15)",
    f_commander: "brightness(1.2)",
    m_commander: "brightness(1.2)"
  };

  const petConfig = {
    pet_alien_blue: { icon: "👾", aura: "#4cc9f0", name: "Aliencito Nebuloso" },
    pet_drone_sparky: { icon: "🤖", aura: "#2ec4b6", name: "Sparky Drone" },
    pet_cyber_fox: { icon: "🦊", aura: "#b5179e", name: "Zorrito Cyber" },
    pet_phoenix_quantum: { icon: "🦅", aura: "#ffd166", name: "Fénix Cuántico" },
  };

  const activeFilter = outfitFilter[currentOutfit] || "none";
  const pet = petConfig[currentPet] || petConfig.pet_alien_blue;

  return (
    <div
      className="avatar-showcase-stage"
      style={{
        width: stageWidth,
        height: stageHeight,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: transparent ? "transparent" : "radial-gradient(circle at center, rgba(20, 75, 95, 0.6) 0%, rgba(3, 18, 25, 0.96) 85%)",
        border: transparent ? "none" : (previewItem ? "2px dashed #ffd166" : "2px solid rgba(184, 255, 249, 0.4)"),
        borderRadius: 22,
        boxShadow: transparent ? "none" : (previewItem ? "0 0 30px rgba(255, 209, 102, 0.6)" : "0 0 25px rgba(46, 196, 182, 0.3)"),
        overflow: transparent ? "visible" : "hidden",
        userSelect: "none"
      }}
    >
      {/* PREVIEW FLOATING BADGE */}
      {previewItem && (
        <span style={{
          position: "absolute",
          top: 8,
          background: "linear-gradient(135deg, #ffd166, #ffb84d)",
          color: "#1a1a00",
          fontSize: "0.75rem",
          fontWeight: "bold",
          padding: "4px 12px",
          borderRadius: 14,
          zIndex: 10,
          boxShadow: "0 0 14px #ffd166"
        }}>
          👀 Previsualizando...
        </span>
      )}

      {/* BACKGROUND HOLOGRAM GLOW */}
      <div style={{
        position: "absolute",
        width: isLarge ? "180px" : "130px",
        height: isLarge ? "180px" : "130px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(46, 196, 182, 0.6) 0%, transparent 75%)",
        filter: "blur(12px)"
      }} />

      {/* CHARACTER ANIMATED CONTAINER */}
      <div
        style={{
          position: "relative",
          width: charWidth,
          height: charHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "idleFloat 3.5s ease-in-out infinite",
          zIndex: 2,
          marginTop: -6
        }}
      >
        {/* OVERLAY PLATAFORMAS DE SUELO HOLOGRÁFICAS ÚNICAS CON PERSONALIDAD PROPIA (PERSPECTIVA 3D EJE X) */}

        {/* BASE 1: ⭕ Aro Neón Carmesí — Plasma Láser Doble Giro */}
        {accessory === "ring" && (
          <div style={{
            position: "absolute",
            top: pos.ring.top,
            left: pos.ring.left,
            width: Math.round(124 * wScale),
            height: Math.round(124 * wScale),
            borderRadius: "50%",
            border: "3.5px solid #ff4d4d",
            background: "radial-gradient(circle at center, rgba(255, 77, 77, 0.55) 0%, rgba(255, 77, 77, 0.08) 75%, transparent 100%)",
            boxShadow: "0 0 28px rgba(255, 77, 77, 0.95), inset 0 0 18px rgba(255, 77, 77, 0.75)",
            animation: "floorRingSpin 5s linear infinite",
            pointerEvents: "none",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {/* Anillo Interno Punteado en Reversa */}
            <div style={{
              width: "72%",
              height: "72%",
              borderRadius: "50%",
              border: "2px dashed rgba(255, 120, 120, 0.9)",
              animation: "floorRingReverse 3s linear infinite",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {/* Núcleo de Plasma Rojo */}
              <div style={{
                width: "35%",
                height: "35%",
                borderRadius: "50%",
                background: "rgba(255, 77, 77, 0.8)",
                boxShadow: "0 0 16px #ff4d4d"
              }} />
            </div>
          </div>
        )}

        {/* BASE 2: 🌀 Portal Radar Cibernético Cian — Barrido Táctico HUD */}
        {(accessory === "aura_cyan" || accessory === "star") && (
          <div style={{
            position: "absolute",
            top: pos.ring.top,
            left: pos.ring.left,
            width: Math.round(130 * wScale),
            height: Math.round(130 * wScale),
            borderRadius: "50%",
            border: "3px dashed #00f0ff",
            background: "radial-gradient(circle at center, rgba(0, 240, 255, 0.55) 0%, rgba(0, 240, 255, 0.08) 75%, transparent 100%)",
            boxShadow: "0 0 30px rgba(0, 240, 255, 0.95), inset 0 0 20px rgba(0, 240, 255, 0.8)",
            animation: "radarSpin 4s linear infinite",
            pointerEvents: "none",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {/* Barrido de Radar Cono de Luz */}
            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, transparent 0deg, rgba(0, 240, 255, 0.45) 50deg, transparent 55deg)",
              animation: "radarSweep 2.5s linear infinite"
            }} />
            {/* Anillo Concéntrico HUD */}
            <div style={{
              width: "65%",
              height: "65%",
              borderRadius: "50%",
              border: "1.5px solid rgba(0, 240, 255, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2
            }}>
              <div style={{
                width: "40%",
                height: "40%",
                borderRadius: "50%",
                border: "1.5px dotted rgba(0, 240, 255, 0.7)"
              }} />
            </div>
          </div>
        )}

        {/* BASE 3: ⚜️ Cresta Celestial Dorada — Satélites y Constelación */}
        {accessory === "aura_gold" && (
          <div style={{
            position: "absolute",
            top: pos.ring.top,
            left: pos.ring.left,
            width: Math.round(132 * wScale),
            height: Math.round(132 * wScale),
            borderRadius: "50%",
            border: "3.5px double #ffd166",
            background: "radial-gradient(circle at center, rgba(255, 209, 102, 0.65) 0%, rgba(245, 158, 11, 0.12) 75%, transparent 100%)",
            boxShadow: "0 0 32px rgba(255, 209, 102, 1), inset 0 0 22px rgba(255, 209, 102, 0.85)",
            animation: "celestialOrbit 7s linear infinite",
            pointerEvents: "none",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 4px"
          }}>
            {/* 4 Estrellas en Órbita Cardinal */}
            <span style={{ position: "absolute", top: "2px", left: "50%", transform: "translateX(-50%)", fontSize: `${(0.85 * scale).toFixed(2)}rem` }}>✨</span>
            <span style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", fontSize: `${(0.85 * scale).toFixed(2)}rem` }}>✨</span>
            <span style={{ position: "absolute", left: "2px", top: "50%", transform: "translateY(-50%)", fontSize: `${(0.85 * scale).toFixed(2)}rem` }}>✨</span>
            <span style={{ position: "absolute", right: "2px", top: "50%", transform: "translateY(-50%)", fontSize: `${(0.85 * scale).toFixed(2)}rem` }}>✨</span>
          </div>
        )}

        {/* BASE 4: 🔮 Matriz Cuántica Violácea — Vórtice Octagonal y Distorsión */}
        {(accessory === "aura_quantum" || accessory === "planet") && (
          <div style={{
            position: "absolute",
            top: pos.ring.top,
            left: pos.ring.left,
            width: Math.round(128 * wScale),
            height: Math.round(128 * wScale),
            borderRadius: "50%",
            border: "3px solid #d946ef",
            outline: "2px dashed rgba(217, 70, 239, 0.8)",
            outlineOffset: "-8px",
            background: "radial-gradient(circle at center, rgba(217, 70, 239, 0.6) 0%, rgba(147, 51, 234, 0.15) 75%, transparent 100%)",
            boxShadow: "0 0 30px rgba(217, 70, 239, 0.95), inset 0 0 20px rgba(168, 85, 247, 0.8)",
            animation: "quantumWarp 3.2s ease-in-out infinite alternate",
            pointerEvents: "none",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {/* Núcleo Octagonal Vórtice */}
            <div style={{
              width: "55%",
              height: "55%",
              border: "1.5px solid rgba(217, 70, 239, 0.9)",
              transform: "rotate(45deg)",
              boxShadow: "0 0 14px rgba(217, 70, 239, 0.8)"
            }} />
          </div>
        )}

        {/* BASE 5: 🔥 Plataforma Sol Estelar — Anillo de Fuego Solar & Llamas Orbitantes */}
        {(accessory === "aura_solar" || accessory === "fire_base") && (
          <div style={{
            position: "absolute",
            top: pos.ring.top,
            left: pos.ring.left,
            width: Math.round(134 * wScale),
            height: Math.round(134 * wScale),
            borderRadius: "50%",
            border: "3.5px solid #ff9f1c",
            background: "radial-gradient(circle at center, rgba(255, 159, 28, 0.7) 0%, rgba(255, 69, 0, 0.18) 75%, transparent 100%)",
            boxShadow: "0 0 35px rgba(255, 159, 28, 1), inset 0 0 22px rgba(255, 69, 0, 0.9)",
            animation: "solarPulse 3s linear infinite",
            pointerEvents: "none",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {/* Destellos solares en órbita */}
            <span style={{ position: "absolute", top: "0px", left: "50%", transform: "translateX(-50%)", fontSize: `${(0.9 * scale).toFixed(2)}rem` }}>🔥</span>
            <span style={{ position: "absolute", bottom: "0px", left: "50%", transform: "translateX(-50%)", fontSize: `${(0.9 * scale).toFixed(2)}rem` }}>🔥</span>
            <div style={{
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              border: "2px dashed #ff4500",
              animation: "floorRingReverse 2.5s linear infinite"
            }} />
          </div>
        )}

        {/* AUTOMATICALLY NORMALIZED AVATAR (STRICT Z-INDEX 3) */}
        <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 3 }}>
          <AutoScaledAvatar
            src={characterImg}
            alt={title}
            activeFilter={activeFilter}
            targetHeightRatio={0.88}
          />
        </div>

        {/* OVERLAY ACCESORIOS FRONTALES (GAFAS / ANTENAS) */}
        {(accessory === "goggles" || (visorColor && visorColor !== "none")) && glassesMap[visorColor] && (
          <img
            src={glassesMap[visorColor]}
            alt="Gafas Cibernéticas"
            style={{
              position: "absolute",
              top: pos.goggles.top,
              left: pos.goggles.left,
              transform: "translateX(-50%)",
              width: pos.goggles.width,
              pointerEvents: "none",
              zIndex: 6,
              filter: "drop-shadow(0 0 10px rgba(184, 255, 249, 0.7))"
            }}
          />
        )}
        {accessory === "antenna" && (
          <div style={{
            position: "absolute",
            top: pos.antenna.top,
            left: pos.antenna.left,
            transform: "translateX(-50%)",
            fontSize: pos.antenna.fontSize,
            pointerEvents: "none",
            zIndex: 6
          }}>📡</div>
        )}
        {accessory === "crown" && (
          <div style={{
            position: "absolute",
            top: pos.crown.top,
            left: pos.crown.left,
            transform: "translateX(-50%)",
            fontSize: pos.crown.fontSize,
            pointerEvents: "none",
            filter: "drop-shadow(0 0 12px #ffd166)",
            zIndex: 6
          }}>👑</div>
        )}

        {/* OVERLAY INSIGNIAS INDIVIDUALES DE PECHO */}
        {decal === "star" && (
          <div style={{ position: "absolute", top: pos.decals.star.top, left: pos.decals.star.left, transform: "translateX(-50%)", fontSize: pos.decals.star.fontSize, zIndex: 7 }}>⭐</div>
        )}
        {decal === "heart" && (
          <div style={{ position: "absolute", top: pos.decals.heart.top, left: pos.decals.heart.left, transform: "translateX(-50%)", fontSize: pos.decals.heart.fontSize, zIndex: 7 }}>❤️</div>
        )}
        {decal === "planet" && (
          <div style={{ position: "absolute", top: pos.decals.planet.top, left: pos.decals.planet.left, transform: "translateX(-50%)", fontSize: pos.decals.planet.fontSize, zIndex: 7 }}>🪐</div>
        )}
        {decal === "lightning" && (
          <div style={{ position: "absolute", top: pos.decals.star.top, left: pos.decals.star.left, transform: "translateX(-50%)", fontSize: pos.decals.star.fontSize, filter: "drop-shadow(0 0 10px #ffd166)", zIndex: 7 }}>⚡</div>
        )}
        {decal === "fire" && (
          <div style={{ position: "absolute", top: pos.decals.star.top, left: pos.decals.star.left, transform: "translateX(-50%)", fontSize: pos.decals.star.fontSize, filter: "drop-shadow(0 0 10px #ff6b35)", zIndex: 7 }}>🔥</div>
        )}

        {/* PET COMPANION FLOATING NEXT TO RECRUIT (LEFT SIDE) */}
        {showPet && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: isLarge ? -30 : -20,
              fontSize: isLarge ? "3rem" : "2.2rem",
              filter: `drop-shadow(0 0 16px ${pet.aura})`,
              animation: "petBounce 2.2s ease-in-out infinite alternate"
            }}
            title={`Mascota: ${pet.name}`}
          >
            {pet.icon}
          </div>
        )}
      </div>

      {/* PEDESTAL BASE */}
      {!transparent && (
        <div style={{
          position: "absolute",
          bottom: 10,
          width: isLarge ? 170 : 120,
          height: 14,
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(184, 255, 249, 0.4)",
          borderRadius: "12px",
          boxShadow: "0 0 14px rgba(0,0,0,0.7)"
        }} />
      )}

      {/* BADGE TITLE */}
      {showTitle && !transparent && (
        <span style={{
          position: "absolute",
          bottom: 6,
          fontSize: isLarge ? "0.82rem" : "0.72rem",
          fontWeight: "bold",
          color: "#b8fff9",
          background: "rgba(5, 24, 32, 0.95)",
          padding: "3px 12px",
          borderRadius: 12,
          border: "1px solid rgba(184, 255, 249, 0.4)",
          zIndex: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
        }}>
          {title}
        </span>
      )}

      <style>{`
        @keyframes idleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes petBounce {
          0% { transform: translateY(0px) rotate(-8deg); }
          100% { transform: translateY(-14px) rotate(8deg); }
        }
        @keyframes floorRingSpin {
          0% { transform: translate(-50%, -50%) rotateX(74deg) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotateX(74deg) rotate(360deg); }
        }
        @keyframes floorRingReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes radarSpin {
          0% { transform: translate(-50%, -50%) rotateX(74deg) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotateX(74deg) rotate(360deg); }
        }
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes celestialOrbit {
          0% { transform: translate(-50%, -50%) rotateX(74deg) rotate(0deg); filter: drop-shadow(0 0 16px rgba(255, 209, 102, 0.8)); }
          50% { filter: drop-shadow(0 0 32px rgba(255, 209, 102, 1)); }
          100% { transform: translate(-50%, -50%) rotateX(74deg) rotate(360deg); filter: drop-shadow(0 0 16px rgba(255, 209, 102, 0.8)); }
        }
        @keyframes quantumWarp {
          0% { transform: translate(-50%, -50%) rotateX(74deg) rotate(0deg) scale(1); filter: drop-shadow(0 0 16px rgba(192, 38, 211, 0.8)); }
          50% { transform: translate(-50%, -50%) rotateX(74deg) rotate(180deg) scale(1.12); filter: drop-shadow(0 0 32px rgba(217, 70, 239, 1)); }
          100% { transform: translate(-50%, -50%) rotateX(74deg) rotate(360deg) scale(1); filter: drop-shadow(0 0 16px rgba(192, 38, 211, 0.8)); }
        }
        @keyframes solarPulse {
          0% { transform: translate(-50%, -50%) rotateX(74deg) rotate(0deg); filter: drop-shadow(0 0 18px rgba(255, 159, 28, 0.9)); }
          50% { transform: translate(-50%, -50%) rotateX(74deg) rotate(180deg) scale(1.08); filter: drop-shadow(0 0 35px rgba(255, 69, 0, 1)); }
          100% { transform: translate(-50%, -50%) rotateX(74deg) rotate(360deg); filter: drop-shadow(0 0 18px rgba(255, 159, 28, 0.9)); }
        }
      `}</style>
    </div>
  );
}
