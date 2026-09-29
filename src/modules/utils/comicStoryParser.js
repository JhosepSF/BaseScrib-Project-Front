import { getBustEmotion } from "../../assets/emociones";
import ReclutaAvatar from "../../assets/amongus/PERSONAJES/Leo personaje solo.png";
import LiaAvatar from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import RobotAvatar from "../../assets/amongus/ROBOT/ROBOOOT SORPRENDIDO.png";
import BossAvatar from "../../assets/emociones/boss/holograma.png";
import GeneralAvatar from "../../assets/emociones/general/serio.png";

// Curricular Structured Story Scenarios for all 14 Days (matching backend populate_all_days.py)
export const DEFAULT_BACKEND_STORIES = {
  1: `Introduce Yourself Day

Escenario 1 - Saludo inicial en salón principal:
General: (emocionado) Welcome to Basescrib, recruit!
Leo: (sonriendo agradece al general) Thank you, General.

Escenario 2 - Interacción del general con Leo en salón principal:
General: (serio interroga al recluta Leo) What is your name?
Leo: (responde firme en posición de soldado) My name is Leo.
General: (amable) Nice to meet you, Leo. How old are you?
Leo: (responde sonriendo) I am thirteen years old.
General: (curioso) Where are you from?
Leo: I am from Peru. I am Peruvian.
General: (pregunta interesado) What do you like?
Leo: (emocionado) I like robots and science.
General: (contento) Interesting! Can you write documents?
Leo: (con confianza y seguridad) Yes, I can.
General: (feliz, le da la mano a Leo amistosamente) Excellent! Welcome to the crew!`,

  2: `Story: Knowing BaseScrib

Escenario 1 - Saludo inicial en salón principal:
General: (animado) Good morning, everyone! Welcome back to Basescrib.
Crew: (en coro) Good morning, General!
Grand Boss: (dando información) Today, we are going to explore our spaceship. Follow me!

Escenario 2 - Study room:
Trainer: (amable) Welcome to the study room.
Recruit: (sorprendido) Wow! There are five computers.
Trainer: (sonriendo) That's right. There are thirteen books for your lessons.
General: (señalando) Look over there. There is a table for group work.

Escenario 3 - En los pasillos:
Recruit: (asombrado) Look! There is a robot!
Robot: (beep alegre) Beep! Beep! Welcome to BaseScrib!

Escenario 4 - En el jardín:
Recruit: (maravillado) Wow! There are ten plants and there are six sofas.
Trainer: (sonriendo) Yes, and there is an alien in the garden today.
Alien: (amigable) Hello, everyone!
General: (contento) The alien helps us take care of the plants.`,

  3: `Story: A Normal Day on the Spaceship

Escenario 1 - El general entra al salón principal:
General: (sonriendo) Good morning, Trainer!
Trainer: (amable) Good morning, General!
General: (pregunta) What do you do every morning?
Trainer: (explicando) In the morning I eat fruit for breakfast and take a shower.
General: (conforme) Excellent!

Escenario 2 - El general se encuentra con un recluta en el pasillo:
General: (amable) Good morning, Recruit. What do you do in the afternoon?
Recruit: (respondiendo) In the afternoon, I have lunch and check the computers.
General: (orgulloso) Very good!

Escenario 3 - El General visita a otro recluta en study room:
General: (curioso) What do you do every evening?
Recruit: (estudiando) In the evening, I study English and sleep at 9:00 pm.
General: (pulgar arriba) Great!!`,

  4: `Story: Crew Supervision

Escenario 1 - En primera persona, videollamada con el General:
General: (enfermo en cama) Recruit, I don't feel well today.
You: (preocupado) I'm sorry, General.
General: (confiando) Please supervise the crew while I rest.
You: (con determinación) Yes, General. I can do it!

Escenario 2 - Supervisando la sala de control:
You: (inspeccionando) Hello! What are you doing?
Recruit 1: (estudiando inglés) I am studying English.
Recruit 2: (leyendo un libro) I am reading a space book.
Leo: (escribiendo un reporte) I am writing a mission report.
Lia: (comiendo almuerzo) I am eating my lunch before the mission.`,

  5: `Story: Frequency & Schedules

Escenario 1 - Almuerzo en el jardín de la nave:
Recruit: (sonriendo) I love eating lunch in the spaceship garden!
Trainer: (amable) It is very peaceful here. What is your daily routine?
Recruit: (explicando) I always wake up at 6:00 a.m. and I always study English at 4:00 p.m.

Escenario 2 - Charla sobre entrenamientos y pasatiempos:
Trainer: (curioso) Do you train every day?
Recruit: (animado) I sometimes train at 5:00 p.m. and I always help new recruits after lunch.
Trainer: (sonriendo) Do you draw during missions?
Recruit: (riéndose) No, I never draw during missions, but I sometimes draw on weekends!`,

  6: `Story: Preparing for Training

Escenario 1 - En el salón de entrenamiento con Great Boss:
Grand Boss: (holograma con autoridad) Recruits, today is training day on Basescrib. Check your materials!
Trainer: (revisando listas) Attention crew! Do you have your supplies ready?

Escenario 2 - Revisión de mochilas y materiales:
Recruit: (mostrando sus útiles) I have my notebook and my pencil, Trainer!
Recruit 2: (buscando en su mochila) I have a ruler, but I don't have my calculator.
Trainer: (anotando) Every recruit must have a backpack, a notebook, and a water bottle before we begin.
Recruit: (seguro) We are ready for the mission!`,

  7: `Story: Interviewing the New Recruits

Escenario 1 - En la biblioteca de la nave:
You: (con tableta de notas) Hello! The Great Boss wants to learn more about the recruits. Can I ask you some questions?
Recruit: (amable) Sure! My favorite subject is Science and I love doing homework here in the library.

Escenario 2 - Conociendo a la tripulación:
You: (curioso) When do you study English?
Recruit: (responde con entusiasmo) I study English every day after school, and I come to the spaceport by bus. I am thirteen years old!
You: (sonriendo) Great answers! The Great Boss will be very pleased to know the crew better.`,

  8: `Story: Lost Items on the Spaceship

Escenario 1 - En la sala de reuniones de la nave:
Trainer: (sosteniendo un cuaderno azul) Look, everyone! Someone left items in the meeting room. Is this your notebook?
Recruit: (acercándose) Yes, that is my notebook! Thank you, Trainer.

Escenario 2 - Devolviendo los objetos perdidos:
General: (examinando una mochila) I found this blue backpack near the door. Is it hers?
Lia: (feliz) Yes, that blue backpack is mine!
Grand Boss: (desde la pantalla) And these headphones on the desk are ours. Now that everything is collected, prepare for the mission!`,

  9: `Story: The Missing Tablet

Escenario 1 - En el escritorio de control central:
Trainer: (sosteniendo una tableta encendida) Whose tablet is this on the desk? We need it for the mission report!
General: (mirando la pantalla) I see Emma's name on the screen. Emma, here is your tablet!
Emma: (agradecida) Thank you for helping me, General!

Escenario 2 - Felicitación del comando:
Grand Boss: (aparece en la pantalla central) Recruits, you worked as a united team on this report.
Trainer: (orgulloso) They completed all the project data on time.
Grand Boss: (sonriendo) You did an excellent job. I am proud of the whole crew!`,

  10: `Story: Organizing the Training Room

Escenario 1 - Organizando el salón de entrenamiento:
Trainer: (señalando el escritorio) The Great Boss wants this room clean. This is my notebook on the desk, please don't move it.
Recruit: (señalando otra mesa) And that tablet over there is the General's tablet!

Escenario 2 - Clasificando los materiales didácticos:
Trainer: (junto a la pizarra) These pencils near the whiteboard are the students' pencils.
Grand Boss: (desde la puerta) Those backpacks near the entrance are the recruits' backpacks.
Recruit: (sosteniendo hojas de trabajo) Are these the English worksheets on the table?
Trainer: (asintiendo contento) Yes, they are! The room is finally organized and ready for training.`,

  11: `Story: Quantum Fuel and Supplies

Escenario 1 - En la bahía de tanques de plasma:
Dani: (inspeccionando el indicador) How much plasma fuel do we have in the main tanks?
Engineer: (comprobando el medidor holográfico) We have plenty of fuel! And how many energy cells do we have?
Dani: (marcando la pantalla) We have a lot of energy cells! The propulsion system is at 100% capacity.`,

  12: `Story: Meeting Scribtonians

Escenario 1 - Encuentro de primer contacto en Sector 7:
Explorer: (asombrado mirando el sensor) Look at the scanner! There is a friendly alien companion in this sector!
Alien: (luz azul brillante, flotando amigablemente) Greetings, travelers of Basescrib!
Explorer: (emocionado tomando notas) It is luminous, intelligent, and blue! It wants to be our guide through the galaxy.`,

  13: `Story: Space Data Comparison

Escenario 1 - En el puente de navegación estelar:
Navigator: (proyectando el mapa holográfico del sistema solar) Let's compare our planetary coordinates before warp jump!
Officer: (comparando las esferas planetarias) Scribtonia is bigger than Earth, but Jupiter is the biggest planet in the entire solar system!
Navigator: (ajustando controles) Understood! Setting course for the safest route in Sector 4.`,

  14: `Story: Graduation Day at BaseScrib

Escenario 1 - En la bóveda central de honor:
Captain Bric: (frente al podio con medallas de oro) Attention recruits of Base ONE! Today you complete your star academy training.
Leo: (firme y orgulloso junto a Lia) We are ready for deep space exploration, Captain!
Captain Bric: (otorgando la insignia dorada) The graduation medal is inside the central vault. Congratulations, you are now officially space commanders!`
};

/**
 * Resolves character avatar, theme color and display name for dialogue bubbles
 */
export function resolveCharacterMeta(speakerName, emotionText = "") {
  const nameLower = (speakerName || "").toLowerCase().trim();
  const emotionLower = (emotionText || "").toLowerCase().trim();

  // General / Captain Bric
  if (nameLower.includes("general") || nameLower.includes("bric") || nameLower.includes("captain")) {
    let emo = "serio";
    if (emotionLower.includes("feliz") || emotionLower.includes("sonri") || emotionLower.includes("content") || emotionLower.includes("orgull")) emo = "feliz";
    if (emotionLower.includes("sorprend") || emotionLower.includes("asombr")) emo = "sorprendido";
    if (emotionLower.includes("pens") || emotionLower.includes("curio") || emotionLower.includes("enferm")) emo = "pensativo";
    return {
      name: "General Bric",
      role: "Commander",
      color: "#ffd166",
      avatar: getBustEmotion("general", emo) || GeneralAvatar
    };
  }

  // Leo
  if (nameLower.includes("leo")) {
    let emo = "feliz";
    if (emotionLower.includes("emocion") || emotionLower.includes("segur")) emo = "emocionado";
    if (emotionLower.includes("pens") || emotionLower.includes("curio")) emo = "pensativo";
    if (emotionLower.includes("sorprend") || emotionLower.includes("asombr")) emo = "sorprendido";
    return {
      name: "Leo",
      role: "Recruit",
      color: "#2ec4b6",
      avatar: getBustEmotion("leo", emo) || ReclutaAvatar
    };
  }

  // Lia / Emma
  if (nameLower.includes("lia") || nameLower.includes("emma")) {
    let emo = "feliz";
    if (emotionLower.includes("anim") || emotionLower.includes("alegr")) emo = "animando";
    if (emotionLower.includes("pens")) emo = "pensativa";
    if (emotionLower.includes("sorprend")) emo = "sorprendida";
    return {
      name: nameLower.includes("emma") ? "Emma" : "Lia",
      role: "Crewmate",
      color: "#ff6b6b",
      avatar: getBustEmotion("lia", emo) || LiaAvatar
    };
  }

  // Grand Boss / Boss
  if (nameLower.includes("boss")) {
    return {
      name: "Grand Boss",
      role: "Authority",
      color: "#00f0ff",
      avatar: BossAvatar
    };
  }

  // Robot / Sparky
  if (nameLower.includes("robot") || nameLower.includes("sparky")) {
    return {
      name: "Sparky Bot",
      role: "AI Assistant",
      color: "#48cae4",
      avatar: RobotAvatar
    };
  }

  // Trainer
  if (nameLower.includes("trainer")) {
    return {
      name: "Space Trainer",
      role: "Instructor",
      color: "#a8dadc",
      avatar: getBustEmotion("general", "feliz") || GeneralAvatar
    };
  }

  // Default Crew / Recruit / You / Alien
  return {
    name: speakerName || "Recruit",
    role: "Explorer",
    color: "#b8fff9",
    avatar: ReclutaAvatar
  };
}

/**
 * Parses a backend raw story string into structured comic scenarios
 */
export function parseComicStory(rawStory, dayNum = 1) {
  const storyText = (rawStory && rawStory.trim().length > 20) 
    ? rawStory 
    : (DEFAULT_BACKEND_STORIES[dayNum] || DEFAULT_BACKEND_STORIES[1]);

  const scenarios = [];
  const parts = storyText.split(/(Escenario \d+[^:\n]*:)/i);

  if (parts.length <= 1) {
    // If not split by Escenario, treat as single scenario
    const lines = storyText.split("\n").filter(l => l.trim().length > 0);
    const dialogues = lines.map(line => {
      const match = line.match(/^([^:]+):\s*(?:\(([^)]+)\)\s*)?(.*)$/);
      if (match) {
        return {
          speaker: match[1].trim(),
          emotion: match[2] ? match[2].trim() : "",
          text: match[3].trim()
        };
      }
      return {
        speaker: "Narrator",
        emotion: "",
        text: line.trim()
      };
    });

    return [{
      title: `Mission Log — Day ${dayNum}`,
      dialogues: dialogues.length > 0 ? dialogues : [{ speaker: "Narrator", emotion: "", text: storyText }]
    }];
  }

  for (let i = 1; i < parts.length; i += 2) {
    const header = parts[i].replace(/:$/, "").trim();
    const body = parts[i + 1] ? parts[i + 1].trim() : "";
    const dialogues = [];

    const lines = body.split("\n");
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const match = line.match(/^([^:]+):\s*(?:\(([^)]+)\)\s*)?(.*)$/);
      if (match) {
        dialogues.push({
          speaker: match[1].trim(),
          emotion: match[2] ? match[2].trim() : "",
          text: match[3].trim()
        });
      } else {
        // Narrative description or action caption
        dialogues.push({
          speaker: "Narrator",
          emotion: "",
          text: line
        });
      }
    }

    scenarios.push({
      title: header,
      dialogues: dialogues
    });
  }

  return scenarios.length > 0 ? scenarios : [{
    title: `Mission Briefing — Day ${dayNum}`,
    dialogues: [{ speaker: "General Bric", emotion: "Welcome", text: "Welcome to Basescrib, recruit!" }]
  }];
}
