import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import { getComicSceneImage } from "../../assets/comics";
import { parseComicStory, resolveCharacterMeta } from "../utils/comicStoryParser";
import "../../styles/Panel.css";
import "../../styles/ComicGame.css";
import { soundFx } from "../utils/soundEffects";

// Helper to shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Curricular Comic Comprehension Questions for all 14 Days (Fallback & Database Sync)
const DEFAULT_COMIC_QUESTIONS = {
  1: [
    { id: "cq1-1", text: "Where has the spaceship arrived?", options: [{ id: "co1-1", text: "Base ONE", is_correct: true }, { id: "co1-2", text: "Mars", is_correct: false }, { id: "co1-3", text: "Earth", is_correct: false }] },
    { id: "cq1-2", text: "What is the recruit's name?", options: [{ id: "co1-4", text: "Leo", is_correct: true }, { id: "co1-5", text: "Tom", is_correct: false }, { id: "co1-6", text: "Emma", is_correct: false }] },
    { id: "cq1-3", text: "Where is the recruit from?", options: [{ id: "co1-7", text: "Peru", is_correct: true }, { id: "co1-8", text: "Brazil", is_correct: false }, { id: "co1-9", text: "Mexico", is_correct: false }] },
    { id: "cq1-4", text: "What does the recruit like?", options: [{ id: "co1-10", text: "Robots and science", is_correct: true }, { id: "co1-11", text: "Football and music", is_correct: false }, { id: "co1-12", text: "Space guide books", is_correct: false }] },
    { id: "cq1-5", text: "What can the recruit do?", options: [{ id: "co1-13", text: "Write documents and repair", is_correct: true }, { id: "co1-14", text: "Fly a rocket alone", is_correct: false }, { id: "co1-15", text: "Cook space food", is_correct: false }] }
  ],
  2: [
    { id: "cq2-1", text: "Where will the crew go to explore first?", options: [{ id: "co2-1", text: "The spaceship rooms and study room", is_correct: true }, { id: "co2-2", text: "The moon base", is_correct: false }, { id: "co2-3", text: "The engine room", is_correct: false }] },
    { id: "cq2-2", text: "How many computers are in the study room?", options: [{ id: "co2-4", text: "Five computers", is_correct: true }, { id: "co2-5", text: "Two computers", is_correct: false }, { id: "co2-6", text: "Ten computers", is_correct: false }] },
    { id: "cq2-3", text: "What appears suddenly in the spaceship hallway?", options: [{ id: "co2-7", text: "A small robot (Sparky Bot)", is_correct: true }, { id: "co2-8", text: "A monster", is_correct: false }, { id: "co2-9", text: "A flying car", is_correct: false }] },
    { id: "cq2-4", text: "Who helps take care of the plants in the garden?", options: [{ id: "co2-10", text: "A friendly alien", is_correct: true }, { id: "co2-11", text: "Only the General", is_correct: false }, { id: "co2-12", text: "A giant robot", is_correct: false }] },
    { id: "cq2-5", text: "How many books are in the study room?", options: [{ id: "co2-13", text: "Thirteen books", is_correct: true }, { id: "co2-14", text: "Five books", is_correct: false }, { id: "co2-15", text: "One book", is_correct: false }] }
  ],
  3: [
    { id: "cq3-1", text: "What does the Trainer do every morning?", options: [{ id: "co3-1", text: "Eats fruit and takes a shower", is_correct: true }, { id: "co3-2", text: "Sleeps all morning", is_correct: false }, { id: "co3-3", text: "Flies away", is_correct: false }] },
    { id: "cq3-2", text: "What does the recruit do in the afternoon?", options: [{ id: "co3-4", text: "Has lunch and checks the computers", is_correct: true }, { id: "co3-5", text: "Goes to bed", is_correct: false }, { id: "co3-6", text: "Draws pictures", is_correct: false }] },
    { id: "cq3-3", text: "What does the other recruit do in the evening?", options: [{ id: "co3-7", text: "Studies English and sleeps at 9:00 pm", is_correct: true }, { id: "co3-8", text: "Cleans the outside hull", is_correct: false }, { id: "co3-9", text: "Plays video games all night", is_correct: false }] },
    { id: "cq3-4", text: "Who greets the Trainer in the morning?", options: [{ id: "co3-10", text: "General Bric", is_correct: true }, { id: "co3-11", text: "An alien", is_correct: false }, { id: "co3-12", text: "A pirate", is_correct: false }] },
    { id: "cq3-5", text: "What gesture does the General give the recruit?", options: [{ id: "co3-13", text: "A thumbs up", is_correct: true }, { id: "co3-14", text: "A red flag", is_correct: false }, { id: "co3-15", text: "A medal", is_correct: false }] }
  ],
  4: [
    { id: "cq4-1", text: "Why does the General ask you to supervise the crew?", options: [{ id: "co4-1", text: "Because he does not feel well today", is_correct: true }, { id: "co4-2", text: "Because he is on vacation", is_correct: false }, { id: "co4-3", text: "Because the base is empty", is_correct: false }] },
    { id: "cq4-2", text: "What is Recruit 1 doing in the control room?", options: [{ id: "co4-4", text: "Studying English", is_correct: true }, { id: "co4-5", text: "Sleeping", is_correct: false }, { id: "co4-6", text: "Cooking", is_correct: false }] },
    { id: "cq4-3", text: "What is Leo doing?", options: [{ id: "co4-7", text: "Writing a mission report", is_correct: true }, { id: "co4-8", text: "Eating lunch", is_correct: false }, { id: "co4-9", text: "Watching TV", is_correct: false }] },
    { id: "cq4-4", text: "What is Lia doing before the mission?", options: [{ id: "co4-10", text: "Eating her lunch", is_correct: true }, { id: "co4-11", text: "Drawing maps", is_correct: false }, { id: "co4-12", text: "Reading a novel", is_correct: false }] },
    { id: "cq4-5", text: "How does the General communicate with you?", options: [{ id: "co4-13", text: "Via holographic video call", is_correct: true }, { id: "co4-14", text: "By paper letter", is_correct: false }, { id: "co4-15", text: "Through a megaphone", is_correct: false }] }
  ],
  5: [
    { id: "cq5-1", text: "Where is the crew eating lunch?", options: [{ id: "co5-1", text: "In the spaceship garden", is_correct: true }, { id: "co5-2", text: "In the control room", is_correct: false }, { id: "co5-3", text: "In the dormitory", is_correct: false }] },
    { id: "cq5-2", text: "What time does the recruit always wake up?", options: [{ id: "co5-4", text: "At 6:00 a.m.", is_correct: true }, { id: "co5-5", text: "At 9:00 a.m.", is_correct: false }, { id: "co5-6", text: "At 12:00 p.m.", is_correct: false }] },
    { id: "cq5-3", text: "How often does the recruit study English?", options: [{ id: "co5-7", text: "Always at 4:00 p.m.", is_correct: true }, { id: "co5-8", text: "Never", is_correct: false }, { id: "co5-9", text: "Sometimes at midnight", is_correct: false }] },
    { id: "cq5-4", text: "When does the recruit draw?", options: [{ id: "co5-10", text: "Never during missions, sometimes on weekends", is_correct: true }, { id: "co5-11", text: "Always during missions", is_correct: false }, { id: "co5-12", text: "Never on weekends", is_correct: false }] },
    { id: "cq5-5", text: "Who does the recruit help after lunch?", options: [{ id: "co5-13", text: "New recruits", is_correct: true }, { id: "co5-14", text: "The spaceship cat", is_correct: false }, { id: "co5-15", text: "Nobody", is_correct: false }] }
  ],
  6: [
    { id: "cq6-1", text: "What does the recruit have for training?", options: [{ id: "co6-1", text: "A notebook and a pencil", is_correct: true }, { id: "co6-2", text: "Only a ruler", is_correct: false }, { id: "co6-3", text: "A video game", is_correct: false }] },
    { id: "cq6-2", text: "What item does the second recruit not have?", options: [{ id: "co6-4", text: "A calculator", is_correct: true }, { id: "co6-5", text: "A ruler", is_correct: false }, { id: "co6-6", text: "A backpack", is_correct: false }] },
    { id: "cq6-3", text: "What must every recruit have according to Trainer?", options: [{ id: "co6-7", text: "A backpack, a notebook, and a water bottle", is_correct: true }, { id: "co6-8", text: "A laser gun", is_correct: false }, { id: "co6-9", text: "A telescope", is_correct: false }] },
    { id: "cq6-4", text: "Who gives the opening announcement?", options: [{ id: "co6-10", text: "The Grand Boss", is_correct: true }, { id: "co6-11", text: "An alien", is_correct: false }, { id: "co6-12", text: "A visitor", is_correct: false }] }
  ],
  7: [
    { id: "cq7-1", text: "What is the recruit's favorite subject?", options: [{ id: "co7-1", text: "Science", is_correct: true }, { id: "co7-2", text: "Art", is_correct: false }, { id: "co7-3", text: "History", is_correct: false }] },
    { id: "cq7-2", text: "Where does the recruit love doing homework?", options: [{ id: "co7-4", text: "In the library", is_correct: true }, { id: "co7-5", text: "In the engine room", is_correct: false }, { id: "co7-6", text: "Outside the spaceship", is_correct: false }] },
    { id: "cq7-3", text: "How old is the recruit?", options: [{ id: "co7-7", text: "Thirteen years old", is_correct: true }, { id: "co7-8", text: "Twenty years old", is_correct: false }, { id: "co7-9", text: "Ten years old", is_correct: false }] }
  ],
  8: [
    { id: "cq8-1", text: "What item did someone leave in the meeting room?", options: [{ id: "co8-1", text: "A notebook", is_correct: true }, { id: "co8-2", text: "A space helmet", is_correct: false }, { id: "co8-3", text: "A telescope", is_correct: false }] },
    { id: "cq8-2", text: "Whose blue backpack did General Bric find?", options: [{ id: "co8-4", text: "Lia's backpack", is_correct: true }, { id: "co8-5", text: "The alien's backpack", is_correct: false }, { id: "co8-6", text: "The robot's backpack", is_correct: false }] }
  ],
  9: [
    { id: "cq9-1", text: "Whose tablet is found on the desk?", options: [{ id: "co9-1", text: "Emma's tablet", is_correct: true }, { id: "co9-2", text: "The General's tablet", is_correct: false }, { id: "co9-3", text: "The pilot's tablet", is_correct: false }] },
    { id: "cq9-2", text: "What did the crew complete on time?", options: [{ id: "co9-4", text: "All the project report data", is_correct: true }, { id: "co9-5", text: "A spaceship race", is_correct: false }, { id: "co9-6", text: "A music concert", is_correct: false }] }
  ],
  10: [
    { id: "cq10-1", text: "Whose notebook is on the desk in the training room?", options: [{ id: "co10-1", text: "The Trainer's notebook", is_correct: true }, { id: "co10-2", text: "The students' notebook", is_correct: false }, { id: "co10-3", text: "The alien's notebook", is_correct: false }] },
    { id: "cq10-2", text: "What are the worksheets found on the table?", options: [{ id: "co10-4", text: "The English worksheets", is_correct: true }, { id: "co10-5", text: "Math worksheets", is_correct: false }, { id: "co10-6", text: "Drawing sheets", is_correct: false }] }
  ],
  11: [
    { id: "cq11-1", text: "What quantifier is used for plasma fuel?", options: [{ id: "co11-1", text: "How much", is_correct: true }, { id: "co11-2", text: "How many", is_correct: false }] },
    { id: "cq11-2", text: "How many energy cells does the propulsion system have?", options: [{ id: "co11-3", text: "A lot of energy cells", is_correct: true }, { id: "co11-4", text: "Zero energy cells", is_correct: false }] }
  ],
  12: [
    { id: "cq12-1", text: "What color is the alien companion in Sector 7?", options: [{ id: "co12-1", text: "Luminous, intelligent, and blue", is_correct: true }, { id: "co12-2", text: "Red and dangerous", is_correct: false }] }
  ],
  13: [
    { id: "cq13-1", text: "Which planet is bigger than Earth?", options: [{ id: "co13-1", text: "Scribtonia", is_correct: true }, { id: "co13-2", text: "The Moon", is_correct: false }] },
    { id: "cq13-2", text: "Which planet is the biggest in the solar system?", options: [{ id: "co13-3", text: "Jupiter", is_correct: true }, { id: "co13-4", text: "Mars", is_correct: false }] }
  ],
  14: [
    { id: "cq14-1", text: "Where is the graduation medal located?", options: [{ id: "co14-1", text: "Inside the central vault", is_correct: true }, { id: "co14-2", text: "On the roof", is_correct: false }] },
    { id: "cq14-2", text: "What are Leo and Lia ready for after graduation?", options: [{ id: "co14-3", text: "Deep space exploration", is_correct: true }, { id: "co14-4", text: "Going back to sleep", is_correct: false }] }
  ]
};

export function ComicGame({ activity, onComplete, onClose, hideHeader = false }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [viewMode, setViewMode] = useState("reading"); // "reading" | "quiz"
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showFullScript, setShowFullScript] = useState(false);

  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [isError, setIsError] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showStatusText, setShowStatusText] = useState("SISTEMA OK");

  const dayNum = activity?.dayNumber || activity?.day_num || activity?.day || 1;
  const questions = (activity?.questions && activity.questions.length > 0)
    ? activity.questions
    : (DEFAULT_COMIC_QUESTIONS[dayNum] || DEFAULT_COMIC_QUESTIONS[1]);

  const currentQuestion = questions[currentQIndex];

  // Parse structured story scenarios from backend (with offline fallback)
  const scenarios = parseComicStory(activity?.mission_story, dayNum);
  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];
  const dialogues = currentScenario?.dialogues || [];
  const sceneImage = getComicSceneImage(dayNum, currentScenarioIndex);

  // Reset dialogue index when scenario changes
  useEffect(() => {
    setCurrentDialogueIndex(0);
  }, [currentScenarioIndex]);

  // Current active dialogue line
  const currentDialogue = dialogues[currentDialogueIndex] || dialogues[0];
  const currentMeta = resolveCharacterMeta(currentDialogue?.speaker, currentDialogue?.emotion);
  const currentSide = currentMeta?.side || "left";

  // Compute active left and right speech items for turn-by-turn comic layout
  let leftDialogue = null;
  let leftMeta = null;
  let rightDialogue = null;
  let rightMeta = null;

  if (currentSide === "left") {
    leftDialogue = currentDialogue;
    leftMeta = currentMeta;

    // Previous right speaker response if available
    for (let i = currentDialogueIndex - 1; i >= 0; i--) {
      const prevMeta = resolveCharacterMeta(dialogues[i].speaker, dialogues[i].emotion);
      if (prevMeta.side === "right") {
        rightDialogue = dialogues[i];
        rightMeta = prevMeta;
        break;
      }
    }
  } else if (currentSide === "right") {
    rightDialogue = currentDialogue;
    rightMeta = currentMeta;

    // Previous left speaker prompt if available
    for (let i = currentDialogueIndex - 1; i >= 0; i--) {
      const prevMeta = resolveCharacterMeta(dialogues[i].speaker, dialogues[i].emotion);
      if (prevMeta.side === "left") {
        leftDialogue = dialogues[i];
        leftMeta = prevMeta;
        break;
      }
    }
  }

  // Handle advancing line by line
  const handleAdvance = () => {
    if (currentDialogueIndex < dialogues.length - 1) {
      soundFx.playPop?.();
      setCurrentDialogueIndex(prev => prev + 1);
    } else if (currentScenarioIndex < scenarios.length - 1) {
      soundFx.playWarp?.();
      setCurrentScenarioIndex(prev => prev + 1);
      setCurrentDialogueIndex(0);
    } else {
      soundFx.playWarp?.();
      setViewMode("quiz");
    }
  };

  // Handle previous line
  const handlePrevious = () => {
    if (currentDialogueIndex > 0) {
      soundFx.playBeep?.();
      setCurrentDialogueIndex(prev => prev - 1);
    } else if (currentScenarioIndex > 0) {
      soundFx.playBeep?.();
      const prevScenario = scenarios[currentScenarioIndex - 1];
      setCurrentScenarioIndex(prev => prev - 1);
      setCurrentDialogueIndex(Math.max(0, (prevScenario?.dialogues?.length || 1) - 1));
    }
  };

  // Keyboard navigation for interactive comic reading (Space, ArrowRight, ArrowLeft)
  useEffect(() => {
    if (viewMode !== "reading") return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        handleAdvance();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, currentDialogueIndex, currentScenarioIndex, dialogues.length, scenarios.length]);

  const lastQRef = useRef(null);

  useEffect(() => {
    const qKey = `${dayNum}-${currentQIndex}-${currentQuestion?.id || currentQuestion?.text || 'def'}`;
    if (lastQRef.current === qKey && shuffledOptions.length > 0) return;
    lastQRef.current = qKey;

    setSelectedOptionId(null);
    setIsError(false);
    setShowSolution(false);
    setShowStatusText("SISTEMA OK");

    if (currentQuestion?.options && currentQuestion.options.length > 0) {
      setShuffledOptions(shuffle(currentQuestion.options));
    } else {
      setShuffledOptions([]);
    }
  }, [currentQIndex, dayNum, currentQuestion?.id, currentQuestion?.text]);

  const handleOptionClick = (option) => {
    if (showSolution) return;
    setSelectedOptionId(option.id);
    setIsError(false);

    if (option.is_correct) {
      soundFx.playLaser();
      soundFx.playSuccess();
      setShowStatusText("VERIFICACIÓN EXITOSA");
      setTimeout(() => {
        if (currentQIndex < questions.length - 1) {
          setCurrentQIndex(currentQIndex + 1);
          setSelectedOptionId(null);
          setShowStatusText("SISTEMA OK");
        } else {
          soundFx.playCoin();
          soundFx.playStreakBonus();
          onComplete(10, 10, mistakes); // 10 XP, 10 Coins, mistakes
        }
      }, 1200);
    } else {
      soundFx.playError();
      setMistakes((prev) => prev + 1);
      setIsError(true);
      setShowSolution(true);
      setShowStatusText("FALLO DE AUTENTICACIÓN");
    }
  };

  const handleNextAfterError = () => {
    setShowSolution(false);
    setIsError(false);
    setSelectedOptionId(null);
    setShowStatusText("SISTEMA OK");
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      soundFx.playCoin();
      soundFx.playStreakBonus();
      onComplete(10, 10, mistakes);
    }
  };

  const isScenarioCompleted = currentDialogueIndex >= dialogues.length - 1;
  const isAllScenariosCompleted = isScenarioCompleted && (currentScenarioIndex >= scenarios.length - 1);
  const correctOption = currentQuestion?.options?.find(o => o.is_correct);

  return (
    <div 
      className="glass-console auth-card panel-large animate-fadeIn comic-main-container" 
      style={{ 
        maxWidth: 880, 
        width: "100%", 
        padding: "clamp(8px, 1.8vh, 16px) clamp(10px, 2vw, 18px)", 
        position: "relative", 
        margin: "0 auto",
        boxSizing: "border-box" 
      }}
    >
      {/* Scanline Overlay */}
      <div className="scan-line" />

      {!hideHeader && (
        <div className="panel-title-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "clamp(6px, 1.2vh, 10px)", borderBottom: "1.5px solid rgba(184, 255, 249, 0.2)", paddingBottom: "clamp(4px, 1vh, 8px)" }}>
          <div style={{ textAlign: "left" }}>
            <span className="dashboard-kicker" style={{ color: "#ffd166", textTransform: "uppercase", fontSize: "clamp(0.7rem, 1.4vh, 0.78rem)", fontWeight: "bold" }}>
              Stage 3: Reading — Interactive Graphic Comic
            </span>
            <h2 style={{ margin: "2px 0 0 0", color: "#b8fff9", fontSize: "clamp(1.1rem, 2.2vh, 1.35rem)" }}>
              {activity?.title || `Day ${dayNum} Mission Comic`}
            </h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "4px 12px", fontSize: "0.82rem", background: "linear-gradient(135deg, #ff6b6b, #ee5a6f)" }}>
            Close ✕
          </button>
        </div>
      )}

      {viewMode === "reading" ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ color: "#9be6df", fontSize: "clamp(0.78rem, 1.5vh, 0.88rem)", margin: 0, textAlign: "left" }}>
              📖 Tap anywhere on the comic or press <kbd style={{ background: "rgba(255,255,255,0.15)", padding: "1px 6px", borderRadius: 4, color: "#fff" }}>Space</kbd> to advance dialogues.
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowFullScript(true); }}
                style={{
                  background: "rgba(46, 196, 182, 0.15)",
                  border: "1px solid #2ec4b6",
                  color: "#b8fff9",
                  borderRadius: "8px",
                  padding: "3px 10px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                title="View full script transcript"
              >
                📜 Full Script
              </button>
              <button 
                onClick={() => { soundFx.playWarp(); setViewMode("quiz"); }}
                style={{
                  background: "transparent",
                  border: "1px solid #ffd166",
                  color: "#ffd166",
                  borderRadius: "8px",
                  padding: "3px 10px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                title="Skip to Comprehension Quiz"
              >
                Skip to Quiz ➔
              </button>
            </div>
          </div>

          {/* Full Illustrated Comic Viewport (Clickable to advance) */}
          <div 
            className="comic-scene-viewport"
            style={{ backgroundImage: `url(${sceneImage})` }}
            onClick={handleAdvance}
            title="Click to advance dialogue (or use Next ▶)"
          >
            {/* Ambient Dark Overlay */}
            <div className="comic-scene-overlay" />

            {/* Top Scenario Header Bar */}
            <div className="comic-scene-header" onClick={(e) => e.stopPropagation()}>
              <div className="comic-scene-badge">
                <span className="comic-kicker-pill">
                  Scenario {currentScenarioIndex + 1} / {scenarios.length}
                </span>
                <h3 className="comic-scene-title">{currentScenario.title}</h3>
              </div>

              {/* Scenario jump dots */}
              <div className="comic-scenario-dots">
                {scenarios.map((_, idx) => (
                  <button 
                    key={idx}
                    className={`comic-dot ${idx === currentScenarioIndex ? "active" : ""}`}
                    onClick={() => {
                      soundFx.playPop?.();
                      setCurrentScenarioIndex(idx);
                      setCurrentDialogueIndex(0);
                    }}
                    title={`Jump to Scenario ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Turn-by-Turn Speech Stage */}
            <div className="comic-interactive-stage">
              {/* Top Row: Left-side speaker (e.g. General, Boss, Trainer) */}
              <div className="comic-row-top">
                {leftDialogue && (
                  <div 
                    className={`comic-bubble-left ${currentSide === "left" ? "comic-bubble-active" : "comic-bubble-dimmed"}`}
                    style={{ 
                      "--speaker-color": leftMeta.color, 
                      "--speaker-glow": `${leftMeta.color}44` 
                    }}
                  >
                    <div className="comic-avatar-wrap">
                      <img 
                        src={leftMeta.avatar} 
                        alt={leftMeta.name} 
                        className="comic-avatar-img animate-pop" 
                      />
                    </div>
                    <div className="comic-balloon">
                      <div className="comic-speaker-meta">
                        <span className="comic-speaker-name">{leftMeta.name}</span>
                        {leftDialogue.emotion && (
                          <span className="comic-speaker-emotion">({leftDialogue.emotion})</span>
                        )}
                      </div>
                      <p className="comic-balloon-text">"{leftDialogue.text}"</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Center Row: Narrator action caption if active */}
              {currentSide === "center" && (
                <div className="comic-row-center">
                  <div className="comic-narrator-box animate-pop">
                    "{currentDialogue.text}"
                  </div>
                </div>
              )}

              {/* Bottom Row: Right-side speaker (e.g. Leo, Lia, Recruit) */}
              <div className="comic-row-bottom">
                {rightDialogue && (
                  <div 
                    className={`comic-bubble-right ${currentSide === "right" ? "comic-bubble-active" : "comic-bubble-dimmed"}`}
                    style={{ 
                      "--speaker-color": rightMeta.color, 
                      "--speaker-glow": `${rightMeta.color}44` 
                    }}
                  >
                    <div className="comic-avatar-wrap">
                      <img 
                        src={rightMeta.avatar} 
                        alt={rightMeta.name} 
                        className="comic-avatar-img animate-pop" 
                      />
                    </div>
                    <div className="comic-balloon">
                      <div className="comic-speaker-meta">
                        <span className="comic-speaker-name">{rightMeta.name}</span>
                        {rightDialogue.emotion && (
                          <span className="comic-speaker-emotion">({rightDialogue.emotion})</span>
                        )}
                      </div>
                      <p className="comic-balloon-text">"{rightDialogue.text}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Click to Advance Floating Hint */}
            <div className="comic-click-hint">
              👆 Click scene or tap Next ▶ ({currentDialogueIndex + 1} / {dialogues.length})
            </div>

            {/* Bottom Controls Bar */}
            <div className="comic-scene-footer" onClick={(e) => e.stopPropagation()}>
              <div className="comic-footer-left">
                <button 
                  className="btn-comic-nav"
                  disabled={currentScenarioIndex === 0 && currentDialogueIndex === 0}
                  onClick={handlePrevious}
                >
                  ◀ Prev Line
                </button>
                <span className="comic-dialogue-counter">
                  Line {currentDialogueIndex + 1} / {dialogues.length}
                </span>
              </div>

              <div className="comic-footer-right">
                {isAllScenariosCompleted ? (
                  <button 
                    className="btn-launch-quiz"
                    onClick={() => {
                      soundFx.playWarp();
                      setViewMode("quiz");
                    }}
                  >
                    🚀 Iniciar Cuestionario de Acceso ➔
                  </button>
                ) : isScenarioCompleted ? (
                  <button 
                    className="btn-launch-quiz"
                    style={{ background: "linear-gradient(135deg, #2ec4b6, #00b4d8)" }}
                    onClick={() => {
                      soundFx.playWarp();
                      setCurrentScenarioIndex(prev => prev + 1);
                      setCurrentDialogueIndex(0);
                    }}
                  >
                    Next Scenario ({currentScenarioIndex + 2} / {scenarios.length}) ➔
                  </button>
                ) : (
                  <button 
                    className="btn-comic-nav"
                    style={{ background: "#2ec4b6", color: "#0d1b2a", fontWeight: "900" }}
                    onClick={handleAdvance}
                  >
                    Next Line ▶
                  </button>
                )}
              </div>
            </div>

            {/* Full Script Modal Overlay */}
            {showFullScript && (
              <div className="comic-script-modal animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                <div className="comic-script-header">
                  <h3 style={{ margin: 0, color: "#2ec4b6", fontSize: "1.1rem" }}>
                    📜 Full Mission Script — {currentScenario.title}
                  </h3>
                  <button 
                    className="btn-logout"
                    style={{ margin: 0, padding: "4px 10px" }}
                    onClick={() => setShowFullScript(false)}
                  >
                    ✕ Close
                  </button>
                </div>
                <div className="comic-script-body">
                  {dialogues.map((d, idx) => {
                    const char = resolveCharacterMeta(d.speaker, d.emotion);
                    return (
                      <div 
                        key={idx}
                        style={{
                          background: idx === currentDialogueIndex ? "rgba(46, 196, 182, 0.2)" : "rgba(0,0,0,0.35)",
                          borderLeft: `3px solid ${char.color}`,
                          borderRadius: "6px",
                          padding: "8px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10
                        }}
                      >
                        {char.avatar && (
                          <img src={char.avatar} alt={char.name} style={{ width: 28, height: 28, objectFit: "contain" }} />
                        )}
                        <div>
                          <strong style={{ color: char.color, fontSize: "0.82rem" }}>
                            {char.name} {d.emotion ? `(${d.emotion})` : ""}:
                          </strong>
                          <span style={{ color: "#e6f7ff", fontSize: "0.88rem", marginLeft: 6 }}>
                            "{d.text}"
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div style={{ textAlign: "left", padding: "5px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <button 
              className="btn-comic-nav"
              style={{ padding: "4px 12px", fontSize: "0.78rem" }}
              onClick={() => {
                soundFx.playBeep?.();
                setViewMode("reading");
              }}
            >
              📖 Back to Comic
            </button>
            <span style={{ color: "#ffd166", fontSize: "0.8rem", fontWeight: "bold" }}>
              COMPREHENSION QUIZ (STAGE 3)
            </span>
          </div>

          {currentQuestion ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.82rem", marginBottom: 10 }}>
                <span>QUESTION: {currentQIndex + 1} of {questions.length}</span>
                <span>STATUS: <strong style={{ color: showSolution ? "#ef4444" : isError ? "#ff6b6b" : "#2ec4b6" }}>{showStatusText}</strong></span>
              </div>

              {/* Question Box */}
              <div 
                style={{ 
                  background: showSolution 
                    ? "rgba(239, 68, 68, 0.08)" 
                    : selectedOptionId && !isError 
                      ? "rgba(46, 196, 182, 0.08)" 
                      : "rgba(0, 0, 0, 0.4)", 
                  border: showSolution 
                    ? "2px solid #ef4444" 
                    : selectedOptionId && !isError 
                      ? "2px solid #2ec4b6" 
                      : "1.5px solid rgba(184, 255, 249, 0.2)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 14,
                  position: "relative",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ display: "flex", gap: "clamp(8px, 1.5vw, 12px)", alignItems: "center" }}>
                  <div className="floating-crewmate">
                    <img 
                      src={ReclutaPrincipal} 
                      alt="Recluta Principal" 
                      style={{ 
                        width: "clamp(48px, 8vh, 72px)", 
                        height: "clamp(48px, 8vh, 72px)", 
                        filter: showSolution 
                          ? "hue-rotate(130deg) saturate(1.5) drop-shadow(0 0 8px #ff6b6b)" 
                          : selectedOptionId && !isError 
                            ? "hue-rotate(85deg) saturate(1.6) drop-shadow(0 0 8px #2ec4b6)" 
                            : "drop-shadow(0 0 6px rgba(0, 245, 255, 0.35))",
                        objectFit: "contain",
                        transition: "all 0.3s ease"
                      }} 
                    />
                  </div>
                  <h3 style={{ color: "#e6f7ff", margin: 0, fontSize: "clamp(0.85rem, 1.8vh, 1rem)", lineHeight: "1.3" }}>
                    {currentQuestion.text}
                  </h3>
                </div>
              </div>

              {/* Quiz Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(5px, 1vh, 8px)" }}>
                {shuffledOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let btnBg = "rgba(4, 15, 25, 0.65)";
                  let btnBorder = "rgba(184, 255, 249, 0.15)";
                  let btnColor = "#e6f7ff";

                  if (showSolution) {
                    if (opt.is_correct) {
                      btnBg = "rgba(46, 196, 182, 0.25)";
                      btnBorder = "#2ec4b6";
                      btnColor = "#b8fff9";
                    } else if (isSelected) {
                      btnBg = "rgba(239, 68, 68, 0.25)";
                      btnBorder = "#ef4444";
                      btnColor = "#ffb4b4";
                    }
                  } else if (isSelected) {
                    btnBg = "rgba(46, 196, 182, 0.2)";
                    btnBorder = "#2ec4b6";
                    btnColor = "#b8fff9";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt)}
                      disabled={showSolution}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "clamp(8px, 1.5vh, 12px) clamp(10px, 1.8vw, 16px)",
                        background: btnBg,
                        border: `1.5px solid ${btnBorder}`,
                        borderRadius: 10,
                        color: btnColor,
                        fontSize: "clamp(0.82rem, 1.6vh, 0.95rem)",
                        fontWeight: isSelected ? "bold" : "500",
                        cursor: showSolution ? "default" : "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "left",
                        width: "100%",
                        boxSizing: "border-box"
                      }}
                    >
                      <span>{opt.text}</span>
                      {showSolution && opt.is_correct && <span>✅</span>}
                      {showSolution && isSelected && !opt.is_correct && <span>❌</span>}
                    </button>
                  );
                })}
              </div>

              {/* Solution Notice if Mistake */}
              {showSolution && (
                <div style={{ marginTop: 14, textAlign: "center" }}>
                  <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", borderRadius: 10, padding: 10, marginBottom: 12 }}>
                    <p style={{ color: "#ffb4b4", margin: "0 0 6px 0", fontSize: "0.85rem" }}>
                      ⚠️ <strong>Fallo detectado:</strong> La respuesta correcta es: <strong>{correctOption?.text}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleNextAfterError}
                    style={{
                      background: "linear-gradient(135deg, #ffd166, #f77f00)",
                      border: "none",
                      color: "#0d1b2a",
                      fontWeight: "bold",
                      padding: "10px 24px",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontSize: "0.95rem"
                    }}
                  >
                    Entendido, Continuar ➔
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 20 }}>
              <p style={{ color: "#9be6df" }}>No hay preguntas configuradas para esta misión.</p>
              <button 
                className="btn-start"
                onClick={() => onComplete(10, 10, 0)}
              >
                Completar Etapa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ComicGame.propTypes = {
  activity: PropTypes.object,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  hideHeader: PropTypes.bool,
};
