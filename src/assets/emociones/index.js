// Centralized Character Emotions Directory
// Extracted with AI background transparency from official concept sheets

// Leo
import leoFeliz from "./leo/feliz.png";
import leoSorprendido from "./leo/sorprendido.png";
import leoPensativo from "./leo/pensativo.png";
import leoEmocionado from "./leo/emocionado.png";

// Lia (Entrenadora)
import liaFeliz from "./lia/feliz.png";
import liaSorprendida from "./lia/sorprendida.png";
import liaPensativa from "./lia/pensativa.png";
import liaAnimando from "./lia/animando.png";

// General One
import genFeliz from "./general/feliz.png";
import genSerio from "./general/serio.png";
import genPensativo from "./general/pensativo.png";
import genSorprendido from "./general/sorprendido.png";

// El Gran Boss
import bossHolo from "./boss/holograma.png";
import bossSimbolo from "./boss/simbolo.png";

// Sparky Robot
import sparkyHabla from "../amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA ABIERTA.png";
import sparkySorprendido from "../amongus/ROBOT/ROBOOOT SORPRENDIDO.png";
import sparkyTriste from "../amongus/ROBOT/ROBOT TRISTE.png";
import sparkyGuino from "../amongus/ROBOT/ROBOT GUIÑANDO OJO.png";
import sparkySospecha from "../amongus/ROBOT/ROBOT MIRADA SOSPECHOSA .png";

export const PERSONAJES_EMOCIONES = {
  leo: {
    name: "Leo",
    role: "Recluta Base ONE",
    color: "#00d2ff",
    feliz: leoFeliz,
    sorprendido: leoSorprendido,
    pensativo: leoPensativo,
    emocionado: leoEmocionado,
    default: leoFeliz,
  },
  lia: {
    name: "Lia",
    role: "Entrenadora BaseScrib",
    color: "#ff66cc",
    feliz: liaFeliz,
    sorprendida: liaSorprendida,
    pensativa: liaPensativa,
    animando: liaAnimando,
    default: liaFeliz,
  },
  general: {
    name: "General One",
    role: "Comandante Supremo",
    color: "#ffd166",
    feliz: genFeliz,
    serio: genSerio,
    pensativo: genPensativo,
    sorprendido: genSorprendido,
    default: genSerio,
  },
  boss: {
    name: "El Gran Boss",
    role: "Inteligencia Central",
    color: "#b026ff",
    holograma: bossHolo,
    simbolo: bossSimbolo,
    default: bossHolo,
  },
  sparky: {
    name: "Sparky Bot",
    role: "IA de Vuelo",
    color: "#06d6a0",
    habla: sparkyHabla,
    feliz: sparkyHabla,
    sorprendido: sparkySorprendido,
    triste: sparkyTriste,
    guino: sparkyGuino,
    sospecha: sparkySospecha,
    default: sparkyHabla,
  },
};

/**
 * Returns the exact emotion bust image for a given character and emotion.
 * Falls back safely to default if the emotion or character does not exist.
 *
 * @param {string} speaker - "leo" | "lia" | "general" | "boss" | "sparky"
 * @param {string} emotion - e.g. "feliz", "sorprendido", "pensativo", "emocionado", etc.
 * @returns {string} Image path / URL
 */
export function getBustEmotion(speaker = "leo", emotion = "default") {
  const normSpeaker = (speaker || "leo").toLowerCase().trim();
  const normEmotion = (emotion || "default").toLowerCase().trim();

  // Aliases support
  let resolvedSpeaker = normSpeaker;
  if (resolvedSpeaker.includes("leo")) resolvedSpeaker = "leo";
  else if (resolvedSpeaker.includes("lia") || resolvedSpeaker.includes("entrenadora")) resolvedSpeaker = "lia";
  else if (resolvedSpeaker.includes("gen") || resolvedSpeaker.includes("bric")) resolvedSpeaker = "general";
  else if (resolvedSpeaker.includes("boss")) resolvedSpeaker = "boss";
  else if (resolvedSpeaker.includes("sparky") || resolvedSpeaker.includes("robot")) resolvedSpeaker = "sparky";

  const charGroup = PERSONAJES_EMOCIONES[resolvedSpeaker] || PERSONAJES_EMOCIONES.leo;
  return charGroup[normEmotion] || charGroup.default || leoFeliz;
}

export default PERSONAJES_EMOCIONES;
