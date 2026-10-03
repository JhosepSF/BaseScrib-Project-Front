// BaseScrib Onboarding Story Script & Spotlight Tour Steps (Bilingual EN / ES)
// Based strictly on BaseScrib_Guion_Cinematica.md and Concept Art images from BaseScrib_Cinematicas folder.

import generalImg from "../../../assets/emociones/general/serio.png";
import trainerImg from "../../../assets/avatares para escoger/m_tech.png";
import sparkyRobotImg from "../../../assets/amongus/ROBOT/ROBOT EXPRESIONES HABLA/RBOT OJOS ABIERTOS - BOCA ABIERTA.png";
import liaAvatarImg from "../../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import leoAvatarImg from "../../../assets/amongus/PERSONAJES/SKIN BASE COLORES/LEO BASE/leo_default.png";

// Official Concept Art Backgrounds from BaseScrib_Cinematicas folder
import bgOrbit from "../../../assets/cinematicas/bg_toma1_orbit.jpg";
import bgScribtonia from "../../../assets/cinematicas/bg_toma3_scribtonia.jpg";
import bgGeneral from "../../../assets/cinematicas/bg_toma4_general.jpg";
import bgDorms from "../../../assets/cinematicas/bg_toma5_dorms.jpg";
import bgCabin from "../../../assets/cinematicas/bg_toma6_cabin.jpg";
import bgMailbox from "../../../assets/cinematicas/bg_toma7_mailbox.jpg";
import bgConsole from "../../../assets/cinematicas/bg_toma8_console.jpg";
import bgVallePortales from "../../../assets/cinematicas/bg_toma9_valle_portales.jpg";
import bgMission1Intro from "../../../assets/cinematicas/bg_toma10_presentacion.jpg";
import bgGame1 from "../../../assets/cinematicas/bg_toma11_juego1.jpg";
import bgGame2 from "../../../assets/cinematicas/bg_toma12_juego2.jpg";
import bgGame3 from "../../../assets/cinematicas/bg_toma13_juego3.jpg";
import bgGame4 from "../../../assets/cinematicas/bg_toma14_juego4.jpg";
import bgGame5 from "../../../assets/cinematicas/bg_toma15_juego5.jpg";

export const SPEAKERS = {
  GENERAL: {
    name: "General",
    role: "Comandante de BaseScrib",
    avatar: generalImg,
    color: "#3b82f6",
    badge: "GENERAL",
  },
  TRAINER: {
    name: "Entrenador",
    role: "Instructor de Vuelo",
    avatar: trainerImg,
    color: "#f59e0b",
    badge: "TRAINER",
  },
  SPARKY: {
    name: "Sparky Bot",
    role: "Asistente IA de Vuelo",
    avatar: sparkyRobotImg,
    color: "#06b6d4",
    badge: "ROBOT AI",
  },
  LEO: {
    name: "Recluta Leo",
    role: "Cadete Explorador",
    avatar: leoAvatarImg,
    color: "#10b981",
    badge: "RECRUIT",
  },
  LIA: {
    name: "Recluta Lia",
    role: "Cadete Exploradora",
    avatar: liaAvatarImg,
    color: "#ec4899",
    badge: "RECRUIT",
  },
};

// 8 Official Cinematic Shots from BaseScrib_Guion_Cinematica.md
export const INTRO_CUTSCENE_SLIDES = [
  {
    id: 1,
    bg: bgOrbit,
    speaker: null,
    en: "Somewhere beyond Earth's orbit, a new recruit begins their journey into the unknown...",
    es: "Más allá de la órbita terrestre, un nuevo recluta comienza su viaje hacia lo desconocido...",
  },
  {
    id: 2,
    bg: bgOrbit,
    speaker: SPEAKERS.SPARKY,
    en: "Welcome aboard, space explorer! I'm Sparky, your AI flight companion. You've been selected to join the crew of BaseScrib.",
    es: "¡Bienvenido a bordo, explorador del espacio! Soy Sparky, tu asistente de vuelo IA. Has sido seleccionado para unirte a la tripulación de BaseScrib.",
  },
  {
    id: 3,
    bg: bgScribtonia,
    speaker: SPEAKERS.SPARKY,
    en: "Ahead of us lies Scribtonia! Here you will complete 5 daily missions (different mission every day) to master English!",
    es: "¡Frente a nosotros está Scribtonia! Aquí completarás 5 misiones diarias (una misión diferente cada día) para dominar el inglés.",
  },
  {
    id: 4,
    bg: bgGeneral,
    speaker: SPEAKERS.GENERAL,
    en: "Welcome to BaseScrib, recruit. We've heard great things about your potential. You will train daily through vocabulary, grammar, reading, word recovery, and writing challenges.",
    es: "Bienvenido a BaseScrib, recluta. Hemos oído grandes cosas sobre tu potencial. Entrenarás cada día con vocabulario, gramática, lectura, recuperación de palabras y redacción.",
  },
  {
    id: 5,
    bg: bgDorms,
    speaker: SPEAKERS.LIA,
    en: "You'll be living here in the dorms alongside Lia, Leo, the Trainer, and the General. Welcome to our crew!",
    es: "Vivirás aquí en los dormitorios junto a Lia, Leo, el Entrenador y el General. ¡Es un honor tenerte en nuestra tripulación!",
  },
  {
    id: 6,
    bg: bgCabin,
    speaker: SPEAKERS.SPARKY,
    isAvatarSelectionStep: true,
    en: "Before reporting for duty, let's configure your crew suit and credentials. How will your recruit look?",
    es: "Antes de reportarte con el equipo, configuremos tu traje y credenciales de tripulante. ¿Cómo lucirá tu recluta?",
  },
  {
    id: 7,
    bg: bgMailbox,
    speaker: SPEAKERS.GENERAL,
    en: "Observe: this is the Space Mailbox. At the end of each day's Writing module, you will send your letter or dispatch here. I will review it at my console, assign your grade, and provide personal feedback.",
    es: "Observa: este es el Buzón Espacial. Al final de cada jornada redactarás tu carta o informe en el módulo de Writing; yo lo recibiré directamente en mi consola para evaluarlo y darte retroalimentación.",
  },
  {
    id: 8,
    bg: bgVallePortales,
    speaker: SPEAKERS.SPARKY,
    en: "And behold: the Valley of Portals! A cosmic rift where interdimensional vortexes open each day. Step through to conquer time-attack speed trials, defeat linguistic anomalies, and earn stars and coins for BaseScrib!",
    es: "¡Y contempla: el Valle de Portales! Una falla cósmica donde cada día se abren vórtices interdimensionales del Abismo. ¡Entra en ellos para superar desafíos a contrarreloj, vencer anomalías lingüísticas y ganar estrellas y monedas para BaseScrib!",
  },
  {
    id: 9,
    bg: bgConsole,
    speaker: SPEAKERS.SPARKY,
    en: "All systems green, recruit! Cockpit console initializing... Let me guide you through your flight HUD controls!",
    es: "¡Todo listo para el despegue, recluta! Inicializando consola de mando... ¡Permíteme guiarte por los controles de la nave!",
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
    en: "Visit the Store to customize your avatar! Equip Cyberpunk suits, Astronaut armor, glasses, and companion pets.",
    es: "¡Visita la Tienda para personalizar tu avatar! Equipa trajes Cyberpunk, armaduras espaciales, lentes y mascotas acompañantes.",
    position: "bottom",
  },
  {
    id: "timeline",
    targetSelector: "[data-tour='day-selector']",
    titleEN: "14-Day Mission Timeline 🚀",
    titleES: "Línea de Tiempo de 14 Días 🚀",
    speaker: SPEAKERS.SPARKY,
    en: "Each day covers 5 interactive dimensions: Vocabulary 🔤, Reading 📖, Grammar Launch 🚀, Portal Practice 🌀, and Writing Mailbox ✍️. Your professor will grade your daily writing submissions!",
    es: "¡Cada día abarca 5 dimensiones interactivas: Vocabulario 🔤, Lectura 📖, Lanzamiento Gramatical 🚀, Portales 🌀 y Producción Escrita ✍️. Tu profesor calificará tus entregas escritas en la plataforma!",
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
    bg: bgMission1Intro,
    speaker: SPEAKERS.GENERAL,
    en: "Recruit, your Day 1 mission starts now! Topic: Personal Information & Verb to Be. You will complete all 5 daily game modules.",
    es: "¡Recluta, tu misión del Día 1 inicia ahora! Tema: Información Personal y Verbo to Be. Desarrollarás los 5 módulos de juego del día.",
  },
  {
    id: "m1_game1",
    bg: bgGame1,
    speaker: SPEAKERS.SPARKY,
    en: "Stage 1: VOCABULARY (Power Cables). Connect matching words and vocabulary cables to restore the ship's communication grid!",
    es: "Stage 1: VOCABULARIO (Cables de Energía). ¡Conecta las palabras y cables de vocabulario correspondientes para restaurar la red de la nave!",
  },
  {
    id: "m1_game2",
    bg: bgGame2,
    speaker: SPEAKERS.TRAINER,
    en: "Stage 2: GRAMMAR (Ship Repair). Order scrambled words into correct sentence structures to calibrate the hull shields!",
    es: "Stage 2: GRAMÁTICA (Reparación de Nave). ¡Ordena las palabras en la estructura correcta de la oración para calibrar los escudos!",
  },
  {
    id: "m1_game3",
    bg: bgGame3,
    speaker: SPEAKERS.LIA,
    en: "Stage 3: READING (Comic Log). Read our illustrated comic mission log and answer comprehension questions!",
    es: "Stage 3: LECTURA (Cómic de Bitácora). ¡Lee la historieta ilustrada de la misión y responde las preguntas de comprensión!",
  },
  {
    id: "m1_game4",
    bg: bgGame4,
    speaker: SPEAKERS.SPARKY,
    en: "Stage 4: WORD RECOVERY (Reactor Fuel). Fill in the missing words in each sentence to stabilize the reactor core!",
    es: "Stage 4: RECUPERACIÓN DE PALABRAS (Combustible del Reactor). ¡Completa las oraciones con las palabras faltantes para estabilizar el reactor!",
  },
  {
    id: "m1_game5",
    bg: bgGame5,
    speaker: SPEAKERS.GENERAL,
    en: "Stage 5: WRITING (Space Mailbox). Write your official daily mission report and submit it through the Space Mailbox for my evaluation!",
    es: "Stage 5: PRODUCCIÓN ESCRITA (Buzón Espacial). ¡Redacta tu informe oficial de misión y envíalo por el Buzón Espacial para mi evaluación!",
  },
];
