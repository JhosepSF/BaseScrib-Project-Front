import { useState } from "react";

import AutoScaledAvatar from "./AutoScaledAvatar";

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
  "#1a1a1a": GafasOscuras
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
  transparent = false
}) {
  const isLarge = size === "large";

  // Stage dimensions: spacious and prominent
  const stageWidth = isLarge ? 290 : 210;
  const stageHeight = isLarge ? 310 : 230;

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

  // 2. Coordenadas independientes para Leo (male) vs Lia (female)
  const accessoryPositions = {
    male: { // 🧑‍🚀 Coordenadas exclusivas para Leo
      goggles: {
        large: { top: "40px", left: "53%", width: "92px" },
        medium: { top: "30px", left: "50%", width: "62px" }
      },
      antenna: {
        large: { top: "-22px", left: "53%", fontSize: "2.4rem" },
        medium: { top: "-15px", left: "50%", fontSize: "1.7rem" }
      },
      ring: {
        large: { top: "150px", left: "51%", fontSize: "4.5rem" },
        medium: { top: "78px", left: "50%", fontSize: "3.0rem" }
      },
      decals: {
        star: {
          large: { top: "140px", left: "53%", fontSize: "1.7rem" },
          medium: { top: "108px", left: "50%", fontSize: "0.95rem" }
        },
        heart: {
          large: { top: "140px", left: "53%", fontSize: "1.7rem" },
          medium: { top: "108px", left: "50%", fontSize: "0.95rem" }
        },
        planet: {
          large: { top: "135px", left: "53%", fontSize: "1.8rem" },
          medium: { top: "108px", left: "50%", fontSize: "1.1rem" }
        }
      }
    },
    female: { // 👩‍🚀 Coordenadas exclusivas para Lia
      goggles: {
        large: { top: "44px", left: "55%", width: "92px" },
        medium: { top: "32px", left: "55%", width: "64px" }
      },
      antenna: {
        large: { top: "-20px", left: "53%", fontSize: "2.4rem" },
        medium: { top: "-14px", left: "53%", fontSize: "1.7rem" }
      },
      ring: {
        large: { top: "156px", left: "53%", fontSize: "4.5rem" },
        medium: { top: "78px", left: "53%", fontSize: "3.0rem" }
      },
      decals: {
        star: {
          large: { top: "170px", left: "32%", fontSize: "1.8rem" },
          medium: { top: "115px", left: "32%", fontSize: "1.1rem" }
        },
        heart: {
          large: { top: "170px", left: "32%", fontSize: "1.8rem" },
          medium: { top: "115px", left: "32%", fontSize: "1.1rem" }
        },
        planet: {
          large: { top: "160px", left: "32%", fontSize: "2.4rem" },
          medium: { top: "108px", left: "32%", fontSize: "1.4rem" }
        }
      }
    }
  };

  // 3. Selección dinámica de coordenadas según el personaje activo
  const pos = isMale ? accessoryPositions.male : accessoryPositions.female;
  const sizeKey = isLarge ? "large" : "medium";

  let characterImg = outfitImages[currentOutfit];
  if (!characterImg) {
    characterImg = isMale
      ? (leoColorMap[suitColor] || LeoDefault)
      : (liaColorMap[suitColor] || LiaDefault);
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

  // Character dimensions inside stage - LARGE AND PROMINENT!
  const charWidth = isLarge ? 200 : 140;
  const charHeight = isLarge ? 240 : 170;

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
        {/* OVERLAY ARO / HALO (RENDERIZADO ESTRICTAMENTE DETRÁS DEL PERSONAJE) */}
        {accessory === "ring" && (
          <div style={{
            position: "absolute",
            top: pos.ring[sizeKey].top,
            left: pos.ring[sizeKey].left,
            transform: "translateX(-50%)",
            fontSize: pos.ring[sizeKey].fontSize,
            pointerEvents: "none",
            zIndex: 1,
            filter: "drop-shadow(0 0 14px rgba(255, 107, 107, 0.95))"
          }}>⭕</div>
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
        {accessory === "goggles" && (
          <img
            src={glassesMap[visorColor] || GafasCian}
            alt="Gafas Cibernéticas"
            style={{
              position: "absolute",
              top: pos.goggles[sizeKey].top,
              left: pos.goggles[sizeKey].left,
              transform: "translateX(-50%)",
              width: pos.goggles[sizeKey].width,
              pointerEvents: "none",
              zIndex: 6,
              filter: "drop-shadow(0 0 10px rgba(184, 255, 249, 0.7))"
            }}
          />
        )}
        {accessory === "antenna" && (
          <div style={{
            position: "absolute",
            top: pos.antenna[sizeKey].top,
            left: pos.antenna[sizeKey].left,
            transform: "translateX(-50%)",
            fontSize: pos.antenna[sizeKey].fontSize,
            pointerEvents: "none",
            zIndex: 6
          }}>📡</div>
        )}

        {/* OVERLAY INSIGNIAS INDIVIDUALES DE PECHO */}
        {decal === "star" && (
          <div style={{ position: "absolute", top: pos.decals.star[sizeKey].top, left: pos.decals.star[sizeKey].left, transform: "translateX(-50%)", fontSize: pos.decals.star[sizeKey].fontSize, zIndex: 7 }}>⭐</div>
        )}
        {decal === "heart" && (
          <div style={{ position: "absolute", top: pos.decals.heart[sizeKey].top, left: pos.decals.heart[sizeKey].left, transform: "translateX(-50%)", fontSize: pos.decals.heart[sizeKey].fontSize, zIndex: 7 }}>❤️</div>
        )}
        {decal === "planet" && (
          <div style={{ position: "absolute", top: pos.decals.planet[sizeKey].top, left: pos.decals.planet[sizeKey].left, transform: "translateX(-50%)", fontSize: pos.decals.planet[sizeKey].fontSize, zIndex: 7 }}>🪐</div>
        )}

        {/* PET COMPANION FLOATING NEXT TO RECRUIT (LEFT SIDE) */}
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

      <style>{`
        @keyframes idleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes petBounce {
          0% { transform: translateY(0px) rotate(-8deg); }
          100% { transform: translateY(-14px) rotate(8deg); }
        }
      `}</style>
    </div>
  );
}
