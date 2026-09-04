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
    en: "Somewhere beyond Earth's orbit, a new recruit begins their journey into the unknown...",
    es: "Más allá de la órbita terrestre, un nuevo recluta comienza su viaje hacia lo desconocido...",
  },
  {
    id: 2,
    bg: bgOrbit,
    speaker: SPEAKERS.SPARKY,
    en: "Welcome aboard, space explorer! I'm Sparky, your AI flight companion. You've been selected to join the crew of Base ONE.",
    es: "¡Bienvenido a bordo, explorador del espacio! Soy Sparky, tu asistente de vuelo IA. Has sido seleccionado para unirte a la tripulación de la Base ONE.",
  },
  {
    id: 3,
    bg: bgScribtonia,
    speaker: SPEAKERS.SPARKY,
    en: "Ahead of us lies Scribtonia — the star kingdom where the finest linguists of the system gather. Here you will master 5 daily mission dimensions!",
    es: "Frente a nosotros está Scribtonia, el reino estelar donde se forman los mejores lingüistas del sistema. ¡Aquí dominarás 5 dimensiones de entrenamiento diario!",
  },
  {
    id: 4,
    bg: bgGeneral,
    speaker: SPEAKERS.GENERAL_BRIC,
    en: "Welcome to Base ONE, recruit. We've heard great things about your potential. You will train daily through vocabulary, reading, grammar, and portal challenges, culminating in a daily written dispatch to me.",
    es: "Bienvenido a la Base ONE, recluta. Hemos oído grandes cosas sobre tu potencial. Entrenarás cada día con vocabulario, lectura, gramática y portales, culminando en un informe escrito diario dirigido a mí.",
  },
  {
    id: 5,
    bg: bgDorms,
    speaker: SPEAKERS.DANI,
    en: "You'll be living here in the dorms with Dino, Ale, Dani, and Captain Bric. Welcome to our squad!",
    es: "Vivirás aquí en los dormitorios junto a Dino, Ale, Dani y el Capitán Bric. ¡Es un honor tenerte en nuestro escuadrón!",
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
    speaker: SPEAKERS.GENERAL_BRIC,
    en: "Observe: this is the Space Mailbox. At the end of each day's Writing module, you will send your letter or dispatch here. I will review it at my console, assign your grade, and provide personal feedback.",
    es: "Observa: este es el Buzón Espacial. Al final de cada jornada redactarás tu carta o informe en el módulo de Writing; yo lo recibiré directamente en mi consola para evaluarlo y darte retroalimentación.",
  },
  {
    id: 8,
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
    bg: bgCabin,
    speaker: SPEAKERS.GENERAL_BRIC,
    en: "Recruit, your Day 1 mission starts now! Topic: Personal Information & Verb to Be. You will complete all 5 daily modules.",
    es: "¡Recluta, tu misión del Día 1 inicia ahora! Tema: Información Personal y Verbo to Be. Desarrollarás los 5 módulos del día.",
  },
  {
    id: "m1_vocab",
    bg: bgCabin,
    speaker: SPEAKERS.SPARKY,
    en: "Game 1: VOCABULARY. Learn essential base actions: 'Use computers', 'Read books', 'Write notes', and 'Work in teams'.",
    es: "Juego 1: VOCABULARIO. Aprende acciones clave de la base: 'Use computers', 'Read books', 'Write notes' y 'Work in teams'.",
  },
  {
    id: "m1_reading",
    bg: bgCabin,
    speaker: SPEAKERS.DANI,
    en: "Game 2: READING. Read our squad dialogue to practice comprehension: 'My name is Dani. I am 13 years old. I am from Peru.'",
    es: "Juego 2: LECTURA. Lee nuestro diálogo de escuadrón para practicar comprensión: 'My name is Dani. I am 13 years old. I am from Peru.'",
  },
  {
    id: "m1_grammar",
    bg: bgCabin,
    speaker: SPEAKERS.SPARKY,
    en: "Game 3 & 4: GRAMMAR LAUNCH & PORTALS. Sort words to repair flight power: 'My / name / is / Leo', then challenge the Portal Altar!",
    es: "Juegos 3 y 4: LANZAMIENTO GRAMATICAL Y PORTALES. Ordena palabras para reparar el código de vuelo: 'My / name / is / Leo', ¡y desafía el Altar de Portales!",
  },
  {
    id: "m1_writing",
    bg: bgMailbox,
    speaker: SPEAKERS.GENERAL_BRIC,
    en: "Game 5: WRITING PRODUCTION. Type your official presentation letter and send it via the Space Mailbox. Your professor will grade it and assign your score!",
    es: "Juego 5: PRODUCCIÓN ESCRITA (WRITING). Redacta tu carta o correo de presentación y envíalo por el Buzón Espacial. Tu profesor lo revisará y aplicará tu nota oficial.",
  },
];
