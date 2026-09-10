// Utility to preload essential high-priority background images into browser memory
import bgOrbit from "../../assets/cinematicas/bg_toma1_orbit.jpg";
import bgScribtonia from "../../assets/cinematicas/bg_toma3_scribtonia.jpg";
import bgGeneral from "../../assets/cinematicas/bg_toma4_general.jpg";
import bgDorms from "../../assets/cinematicas/bg_toma5_dorms.jpg";
import bgCabin from "../../assets/cinematicas/bg_toma6_cabin.jpg";
import bgMailbox from "../../assets/cinematicas/bg_toma7_mailbox.jpg";
import bgConsole from "../../assets/cinematicas/bg_toma8_console.jpg";
import bgVallePortales from "../../assets/cinematicas/bg_toma9_valle_portales.jpg";
import vallePortalesMain from "../../assets/amongus/valle de portales.jpg";
import cabinaMain from "../../assets/amongus/cabina.png";

const KEY_BACKGROUNDS = [
  bgOrbit,
  bgScribtonia,
  bgGeneral,
  bgDorms,
  bgCabin,
  bgMailbox,
  bgConsole,
  bgVallePortales,
  vallePortalesMain,
  cabinaMain,
];

export function preloadKeyAssets() {
  if (typeof window === "undefined") return;
  
  KEY_BACKGROUNDS.forEach((src) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  });
}
