// BaseScrib Onboarding Story Script & Spotlight Tour Steps (Bilingual EN / ES)
// Based strictly on BaseScrib_Guion_Cinematica.md and Concept Art images from BaseScrib_Cinematicas folder.

import generalBricImg from "../../../assets/avatares para escoger/m_commander.png";
import sparkyRobotImg from "../../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA ABIERTA.png";
import liaAvatarImg from "../../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import leoAvatarImg from "../../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_default.png";
import daniAvatarImg from "../../../assets/avatares para escoger/f_explorer.png";

// Official Concept Art Backgrounds from BaseScrib_Cinematicas folder
import bgOrbit from "../../../assets/cinematicas/bg_toma1_orbit.jpg";
import bgScribtonia from "../../../assets/cinematicas/bg_toma3_scribtonia.jpg";
import bgGeneral from "../../../assets/cinematicas/bg_toma4_general.jpg";
import bgDorms from "../../../assets/cinematicas/bg_toma5_dorms.jpg";
import bgCabin from "../../../assets/cinematicas/bg_toma6_cabin.jpg";
import bgMailbox from "../../../assets/cinematicas/bg_toma7_mailbox.jpg";
import bgConsole from "../../../assets/cinematicas/bg_toma8_console.jpg";

export const SPEAKERS = {
  GENERAL_BRIC: {
    name: "General Bric",
    role: "Commander of Base ONE",
    avatar: generalBricImg,
    color: "#3b82f6",
    badge: "GENERAL",
  },
  SPARKY: {
    name: "Sparky Bot",
    role: "AI Flight Companion",
    avatar: sparkyRobotImg,
    color: "#06b6d4",
    badge: "ROBOT AI",
  },
  LEO: {
    name: "Recluta Leo",
    role: "Spacecadet Explorer",
    avatar: leoAvatarImg,
    color: "#10b981",
    badge: "RECRUIT",
  },
  LIA: {
    name: "Recluta Lia",
    role: "Spacecadet Explorer",
    avatar: liaAvatarImg,
    color: "#ec4899",
    badge: "RECRUIT",
  },
  DANI: {
    name: "Recluta Dani",
    role: "Squadmate",
    avatar: daniAvatarImg,
    color: "#8b5cf6",
    badge: "RECRUIT",
  },
};

// 8 Official Cinematic Shots from BaseScrib_Guion_Cinematica.md
export const INTRO_CUTSCENE_SLIDES = [
  {
    id: 1,
    bg: bgOrbit,
    speaker: null,
    en: "Somewhere beyond Earth's orbit, a new recruit begins their journey...",
    es: "Más allá de la órbita terrestre, un nuevo recluta comienza su viaje...",
  },
  {
    id: 2,
    bg: bgOrbit,
    speaker: SPEAKERS.SPARKY,
    en: "Welcome, space explorer! I'm Sparky, your AI flight companion. You've been selected to join Base ONE.",
    es: "¡Bienvenido, explorador del espacio! Soy Sparky, tu asistente de vuelo. Has sido seleccionado para unirte a la Base ONE.",
  },
  {
    id: 3,
    bg: bgScribtonia,
    speaker: SPEAKERS.SPARKY,
    en: "This is Scribtonia — a kingdom where the best of the whole star system gather. You've been chosen to train here.",
    es: "Este es Scribtonia, un reino donde se reúnen los mejores de todo el sistema planetario. Has sido elegido para entrenar aquí.",
  },
  {
    id: 4,
    bg: bgGeneral,
    speaker: SPEAKERS.GENERAL_BRIC,
    en: "Welcome to Scribtonia. We've heard you're a very capable recruit. Since this is our first meeting, I'd like you to write me a short letter about yourself.",
    es: "Bienvenido a Scribtonia. Hemos oído que eres un recluta muy capaz. Como es nuestra primera vez trabajando juntos, me gustaría que me escribas una breve carta sobre ti.",
  },
  {
    id: 5,
    bg: bgDorms,
    speaker: SPEAKERS.DANI,
    en: "You'll be living here with Dino, Ale, Dani, and Captain Bric. Say hello to your new crew!",
    es: "Vivirás aquí junto a Dino, Ale, Dani y el Capitán Bric. ¡Saluda a tu nueva tripulación!",
  },
  {
    id: 6,
    bg: bgCabin,
    speaker: SPEAKERS.SPARKY,
    en: "Before we continue, let's choose your look. Will you be Leo or Lia?",
    es: "Antes de continuar, elijamos tu apariencia. ¿Serás Leo o Lia?",
  },
  {
    id: 7,
    bg: bgMailbox,
    speaker: SPEAKERS.GENERAL_BRIC,
    en: "There it is — the Space Mailbox. Write your presentation letter for the General, and your journey truly begins.",
    es: "Ahí está: el Buzón Espacial. Escribe tu carta de presentación para el General, y tu viaje comenzará de verdad.",
  },
  {
    id: 8,
    bg: bgConsole,
    speaker: SPEAKERS.SPARKY,
    en: "Good luck, recruit. Let me guide you through the cockpit HUD!",
    es: "¡Buena suerte, recluta! ¡Permíteme guiarte por los controles de tu cabina!",
  },
];

// Spotlight Tour Steps for Interactive HUD Training
export const HUD_SPOTLIGHT_STEPS = [
  {
    id: "streak",
    targetSelector: "[data-tour='streak-card']",
    titleEN: "Daily Study Streak 🔥",
    titleES: "Racha de Estudio Diario 🔥",
    speaker: SPEAKERS.SPARKY,
    en: "Keep your daily streak alive by studying every day! Higher streaks unlock exclusive coin multipliers and rare badges.",
    es: "¡Mantén tu racha diaria estudiando todos los días! Las rachas altas desbloquean multiplicadores de monedas e insignias raras.",
    position: "bottom",
  },
  {
    id: "coins",
    targetSelector: "[data-tour='coins-card']",
    titleEN: "Base Coins Balance 🪙",
    titleES: "Balance de Monedas 🪙",
    speaker: SPEAKERS.SPARKY,
    en: "Earn space coins by completing daily missions, grammar portals, and writing production tasks.",
    es: "Gana monedas espaciales completando misiones diarias, portales de gramática y trabajos de producción escrita.",
    position: "bottom",
  },
  {
    id: "store",
    targetSelector: "[data-tour='store-button']",
    titleEN: "Outfits & Pet Store 🛒",
    titleES: "Tienda de Trajes y Mascotas 🛒",
    speaker: SPEAKERS.SPARKY,
    en: "Visit the Store to customize your avatar! Equip Cyberpunk suits, Astronaut armor, glasses, and DragonBound-style companion pets.",
    es: "¡Visita la Tienda para personalizar tu avatar! Equipa trajes Cyberpunk, armaduras espaciales, lentes y mascotas acompañantes.",
    position: "bottom",
  },
  {
    id: "timeline",
    targetSelector: "[data-tour='day-selector']",
    titleEN: "14-Day Mission Timeline 🚀",
    titleES: "Línea de Tiempo de 14 Días 🚀",
    speaker: SPEAKERS.SPARKY,
    en: "Each day covers a full English dimension (Vocabulary, Reading, Grammar Launch, and Writing Production). Day 1 is unlocked for you now!",
    es: "¡Cada día abarca una dimensión completa de inglés (Vocabulario, Lectura, Lanzamiento Gramatical y Escritura). ¡El Día 1 está desbloqueado!",
    position: "top",
  },
  {
    id: "portals",
    targetSelector: "[data-tour='portals-button']",
    titleEN: "Valle de Portales 🌀",
    titleES: "Valle de Portales 🌀",
    speaker: SPEAKERS.SPARKY,
    en: "Enter the Portal Altar to test your DCN grammar skills. Clear portals with limited attempts to earn heavy coin rewards!",
    es: "Entra al Altar de Portales para probar tu gramática DCN. ¡Supera portales con intentos limitados para ganar recompensas de monedas!",
    position: "bottom",
  },
  {
    id: "abyss",
    targetSelector: "[data-tour='abyss-button']",
    titleEN: "Quantum Abyss Survival 🌌",
    titleES: "Supervivencia Abismo Cuántico 🌌",
    speaker: SPEAKERS.SPARKY,
    en: "Challenge endless waves of fast-paced questions in the Quantum Abyss! Climb the global Leaderboard and beat top scores.",
    es: "¡Desafía oleadas infinitas de preguntas rápidas en el Abismo Cuántico! Sube en la Tabla de Clasificación y supera el récord.",
    position: "bottom",
  },
];

// Mission 1 Guided Dialogue Steps (Live Mission Walkthrough)
export const MISSION_1_TUTORIAL_SLIDES = [
  {
    id: "m1_intro",
    bg: bgCabin,
    speaker: SPEAKERS.GENERAL_BRIC,
    en: "Recruit, your Day 1 mission starts now! Topic: Personal Information & Verb to Be.",
    es: "¡Recluta, tu misión del Día 1 inicia ahora! Tema: Información Personal y Verbo to Be.",
  },
  {
    id: "m1_vocab",
    bg: bgCabin,
    speaker: SPEAKERS.SPARKY,
    en: "Step 1: VOCABULARY. Learn essential base actions: 'Use computers', 'Read books', 'Write notes', and 'Work in teams'.",
    es: "Paso 1: VOCABULARIO. Aprende acciones clave de la base: 'Use computers', 'Read books', 'Write notes' y 'Work in teams'.",
  },
  {
    id: "m1_reading",
    bg: bgCabin,
    speaker: SPEAKERS.DANI,
    en: "Step 2: READING. Read our squad dialogue to practice comprehension: 'My name is Dani. I am 13 years old. I am from Peru.'",
    es: "Paso 2: LECTURA. Lee nuestro diálogo de escuadrón para practicar comprensión: 'My name is Dani. I am 13 years old. I am from Peru.'",
  },
  {
    id: "m1_grammar",
    bg: bgCabin,
    speaker: SPEAKERS.SPARKY,
    en: "Step 3: GRAMMAR LAUNCH. Unscramble the ship's control code! Sort the words to restore flight power: 'My / name / is / Leo'.",
    es: "Paso 3: LANZAMIENTO GRAMATICAL. ¡Descifra el código de control de la nave! Ordena las palabras para restaurar la energía: 'My / name / is / Leo'.",
  },
  {
    id: "m1_writing",
    bg: bgMailbox,
    speaker: SPEAKERS.GENERAL_BRIC,
    en: "Step 4: WRITING PRODUCTION. Write your official presentation letter and send it through the space mailbox to complete Day 1!",
    es: "Paso 4: PRODUCCIÓN ESCRITA. Redacta tu carta de presentación oficial y envíala por el buzón espacial para completar el Día 1.",
  },
];
