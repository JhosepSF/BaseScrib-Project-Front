import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReclutaPrincipal from "../../assets/amongus/PERSONAJES/Lia personaje solo.png";
import "../../styles/Panel.css";
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
    { id: "cq1-5", text: "What can the recruit do?", options: [{ id: "co1-13", text: "Repair spaceships", is_correct: true }, { id: "co1-14", text: "Fly a spaceship", is_correct: false }, { id: "co1-15", text: "Cook space food", is_correct: false }] }
  ],
  2: [
    { id: "cq2-1", text: "Where will the crew go to visit first?", options: [{ id: "co2-1", text: "The spaceship garden", is_correct: true }, { id: "co2-2", text: "The moon base", is_correct: false }, { id: "co2-3", text: "The engine room", is_correct: false }] },
    { id: "cq2-2", text: "What are in the study room?", options: [{ id: "co2-4", text: "Five computers and books", is_correct: true }, { id: "co2-5", text: "Three telescopes", is_correct: false }, { id: "co2-6", text: "Only chairs", is_correct: false }] },
    { id: "cq2-3", text: "What does the small robot show to the crew?", options: [{ id: "co2-7", text: "Photos of the new planet", is_correct: true }, { id: "co2-8", text: "A map of Earth", is_correct: false }, { id: "co2-9", text: "A video game", is_correct: false }] },
    { id: "cq2-4", text: "Who welcomes the crew to Basescrib?", options: [{ id: "co2-10", text: "The General", is_correct: true }, { id: "co2-11", text: "The alien guard", is_correct: false }, { id: "co2-12", text: "The pilot", is_correct: false }] },
    { id: "cq2-5", text: "How many computers are in the study room?", options: [{ id: "co2-13", text: "Five computers", is_correct: true }, { id: "co2-14", text: "Two computers", is_correct: false }, { id: "co2-15", text: "Zero computers", is_correct: false }] }
  ],
  3: [
    { id: "cq3-1", text: "What time does the General wake up?", options: [{ id: "co3-1", text: "At 7:00", is_correct: true }, { id: "co3-2", text: "At 8:30", is_correct: false }, { id: "co3-3", text: "At 6:00", is_correct: false }] },
    { id: "cq3-2", text: "What does the Trainer do every morning?", options: [{ id: "co3-4", text: "Eats fruits and trains", is_correct: true }, { id: "co3-5", text: "Cleans the control room", is_correct: false }, { id: "co3-6", text: "Sleeps all morning", is_correct: false }] },
    { id: "cq3-3", text: "What does the recruit do after lunch?", options: [{ id: "co3-7", text: "Cleans the control room", is_correct: true }, { id: "co3-8", text: "Trains with robots", is_correct: false }, { id: "co3-9", text: "Goes to sleep", is_correct: false }] },
    { id: "cq3-4", text: "What does another recruit do every day?", options: [{ id: "co3-10", text: "Studies English and sleeps early", is_correct: true }, { id: "co3-11", text: "Eats cereal all day", is_correct: false }, { id: "co3-12", text: "Plays video games", is_correct: false }] },
    { id: "cq3-5", text: "What does the General do every day?", options: [{ id: "co3-13", text: "Writes reports and reads", is_correct: true }, { id: "co3-14", text: "Cooks lunch", is_correct: false }, { id: "co3-15", text: "Repairs the engines", is_correct: false }] }
  ],
  4: [
    { id: "cq4-1", text: "What is the recruit in the learning room doing?", options: [{ id: "co4-1", text: "Studying English", is_correct: true }, { id: "co4-2", text: "Cleaning the room", is_correct: false }, { id: "co4-3", text: "Drawing maps", is_correct: false }] },
    { id: "cq4-2", text: "What is the recruit in the control room doing?", options: [{ id: "co4-4", text: "Cleaning the control room", is_correct: true }, { id: "co4-5", text: "Sleeping", is_correct: false }, { id: "co4-6", text: "Eating lunch", is_correct: false }] },
    { id: "cq4-3", text: "What is the recruit with the book doing?", options: [{ id: "co4-7", text: "Reading a space guide", is_correct: true }, { id: "co4-8", text: "Writing a novel", is_correct: false }, { id: "co4-9", text: "Drawing pictures", is_correct: false }] },
    { id: "cq4-4", text: "What is the recruit in the communication center doing?", options: [{ id: "co4-10", text: "Writing a report", is_correct: true }, { id: "co4-11", text: "Playing games", is_correct: false }, { id: "co4-12", text: "Watching videos", is_correct: false }] },
    { id: "cq4-5", text: "Why is the General resting today?", options: [{ id: "co4-13", text: "He is sick", is_correct: true }, { id: "co4-14", text: "He is on vacation", is_correct: false }, { id: "co4-15", text: "He is visiting Earth", is_correct: false }] }
  ],
  5: [
    { id: "cq5-1", text: "Where is the crew eating lunch?", options: [{ id: "co5-1", text: "In the spaceship garden", is_correct: true }, { id: "co5-2", text: "In the control room", is_correct: false }, { id: "co5-3", text: "In the dormitory", is_correct: false }] },
    { id: "cq5-2", text: "What time does your friend always wake up?", options: [{ id: "co5-4", text: "At 6:00 a.m.", is_correct: true }, { id: "co5-5", text: "At 9:00 a.m.", is_correct: false }, { id: "co5-6", text: "At 7:30 a.m.", is_correct: false }] },
    { id: "cq5-3", text: "How often does your friend study English?", options: [{ id: "co5-7", text: "Always at 4:00 p.m.", is_correct: true }, { id: "co5-8", text: "Never", is_correct: false }, { id: "co5-9", text: "Sometimes at night", is_correct: false }] },
    { id: "cq5-4", text: "What does your friend do after lunch?", options: [{ id: "co5-10", text: "Always helps new recruits", is_correct: true }, { id: "co5-11", text: "Always sleeps", is_correct: false }, { id: "co5-12", text: "Never talks to anyone", is_correct: false }] },
    { id: "cq5-5", text: "When does your friend draw?", options: [{ id: "co5-13", text: "Never during missions, but sometimes on weekends", is_correct: true }, { id: "co5-14", text: "Always during missions", is_correct: false }, { id: "co5-15", text: "Every morning at 6:00", is_correct: false }] }
  ],
  6: [
    { id: "cq6-1", text: "What does your friend have for training?", options: [{ id: "co6-1", text: "A notebook and a pencil", is_correct: true }, { id: "co6-2", text: "A calculator and ruler", is_correct: false }, { id: "co6-3", text: "Only a water bottle", is_correct: false }] },
    { id: "cq6-2", text: "What item does the second recruit have?", options: [{ id: "co6-4", text: "A ruler", is_correct: true }, { id: "co6-5", text: "A calculator", is_correct: false }, { id: "co6-6", text: "A dictionary", is_correct: false }] },
    { id: "cq6-3", text: "What item does the second recruit not have?", options: [{ id: "co6-7", text: "A calculator", is_correct: true }, { id: "co6-8", text: "A pencil", is_correct: false }, { id: "co6-9", text: "A backpack", is_correct: false }] },
    { id: "cq6-4", text: "What does every recruit have according to the General?", options: [{ id: "co6-10", text: "A backpack", is_correct: true }, { id: "co6-11", text: "A laptop", is_correct: false }, { id: "co6-12", text: "A robot assistant", is_correct: false }] },
    { id: "cq6-5", text: "Who wants all recruits to be ready before the mission?", options: [{ id: "co6-13", text: "The Great Boss", is_correct: true }, { id: "co6-14", text: "The alien visitor", is_correct: false }, { id: "co6-15", text: "Sparky Bot", is_correct: false }] }
  ],
  7: [
    { id: "cq7-1", text: "What is your friend recruit's favorite subject?", options: [{ id: "co7-1", text: "Science", is_correct: true }, { id: "co7-2", text: "Art", is_correct: false }, { id: "co7-3", text: "History", is_correct: false }] },
    { id: "cq7-2", text: "Where is the library located?", options: [{ id: "co7-4", text: "Next to the classroom", is_correct: true }, { id: "co7-5", text: "In the spaceship garden", is_correct: false }, { id: "co7-6", text: "Near the airlock", is_correct: false }] },
    { id: "cq7-3", text: "When does the new mission start?", options: [{ id: "co7-7", text: "At 9:00 a.m.", is_correct: true }, { id: "co7-8", text: "At midnight", is_correct: false }, { id: "co7-9", text: "Next week", is_correct: false }] },
    { id: "cq7-4", text: "How are the recruits feeling before training?", options: [{ id: "co7-10", text: "Happy and ready", is_correct: true }, { id: "co7-11", text: "Tired and bored", is_correct: false }, { id: "co7-12", text: "Scared", is_correct: false }] },
    { id: "cq7-5", text: "Who asked you to interview the new recruits?", options: [{ id: "co7-13", text: "The Great Boss", is_correct: true }, { id: "co7-14", text: "Sparky Bot", is_correct: false }, { id: "co7-15", text: "The pilot", is_correct: false }] }
  ],
  8: [
    { id: "cq8-1", text: "Whose blue jacket is on the chair?", options: [{ id: "co8-1", text: "The Trainer's jacket", is_correct: true }, { id: "co8-2", text: "The General's jacket", is_correct: false }, { id: "co8-3", text: "Emma's jacket", is_correct: false }] },
    { id: "cq8-2", text: "Whose tablet is found on the desk?", options: [{ id: "co8-4", text: "The recruit's tablet", is_correct: true }, { id: "co8-5", text: "The Trainer's tablet", is_correct: false }, { id: "co8-6", text: "The General's tablet", is_correct: false }] },
    { id: "cq8-3", text: "Whose headphones are near the books?", options: [{ id: "co8-7", text: "Emma's headphones (hers)", is_correct: true }, { id: "co8-8", text: "The Trainer's headphones", is_correct: false }, { id: "co8-9", text: "The recruit's headphones", is_correct: false }] },
    { id: "cq8-4", text: "Whose water bottle is on the table?", options: [{ id: "co8-10", text: "Our water bottle (ours)", is_correct: true }, { id: "co8-11", text: "The alien's bottle", is_correct: false }, { id: "co8-12", text: "Nobody's bottle", is_correct: false }] },
    { id: "cq8-5", text: "Why was the crew organizing the items?", options: [{ id: "co8-13", text: "They were preparing for an important mission", is_correct: true }, { id: "co8-14", text: "They were leaving the spaceship", is_correct: false }, { id: "co8-15", text: "They were having a party", is_correct: false }] }
  ],
  9: [
    { id: "cq9-1", text: "Whose tablet is missing before the report?", options: [{ id: "co9-1", text: "Emma's tablet", is_correct: true }, { id: "co9-2", text: "The Trainer's tablet", is_correct: false }, { id: "co9-3", text: "The General's tablet", is_correct: false }] },
    { id: "cq9-2", text: "Who finds Emma's tablet on the desk?", options: [{ id: "co9-4", text: "You (the recruit)", is_correct: true }, { id: "co9-5", text: "Sparky Bot", is_correct: false }, { id: "co9-6", text: "The Great Boss", is_correct: false }] },
    { id: "cq9-3", text: "Who helps the recruits when they need assistance?", options: [{ id: "co9-7", text: "The Trainer", is_correct: true }, { id: "co9-8", text: "The robot guard", is_correct: false }, { id: "co9-9", text: "The alien pilot", is_correct: false }] },
    { id: "cq9-4", text: "Who does the Great Boss congratulate for great teamwork?", options: [{ id: "co9-10", text: "The recruits (them)", is_correct: true }, { id: "co9-11", text: "Only the General", is_correct: false }, { id: "co9-12", text: "Nobody", is_correct: false }] },
    { id: "cq9-5", text: "Who helps the General organize the mission?", options: [{ id: "co9-13", text: "The Trainer (helps him)", is_correct: true }, { id: "co9-14", text: "The alien commander", is_correct: false }, { id: "co9-15", text: "The computer AI", is_correct: false }] }
  ],
  10: [
    { id: "cq10-1", text: "Whose notebook is on the desk?", options: [{ id: "co10-1", text: "The Trainer's notebook", is_correct: true }, { id: "co10-2", text: "The General's notebook", is_correct: false }, { id: "co10-3", text: "The recruit's notebook", is_correct: false }] },
    { id: "cq10-2", text: "Whose tablet is on another desk?", options: [{ id: "co10-4", text: "The General's tablet", is_correct: true }, { id: "co10-5", text: "The Trainer's tablet", is_correct: false }, { id: "co10-6", text: "The recruit's tablet", is_correct: false }] },
    { id: "cq10-3", text: "What are near the whiteboard?", options: [{ id: "co10-7", text: "The students' pencils", is_correct: true }, { id: "co10-8", text: "The recruits' backpacks", is_correct: false }, { id: "co10-9", text: "The English worksheets", is_correct: false }] },
    { id: "cq10-4", text: "What are near the door?", options: [{ id: "co10-10", text: "The recruits' backpacks", is_correct: true }, { id: "co10-11", text: "The students' pencils", is_correct: false }, { id: "co10-12", text: "The Trainer's notebooks", is_correct: false }] },
    { id: "cq10-5", text: "What do you find on the table?", options: [{ id: "co10-13", text: "The English worksheets", is_correct: true }, { id: "co10-14", text: "The General's laptops", is_correct: false }, { id: "co10-15", text: "The Trainer's markers", is_correct: false }] }
  ],
  11: [
    { id: "cq11-1", text: "What resource does Dani check in the main tanks?", options: [{ id: "co11-1", text: "Plasma fuel", is_correct: true }, { id: "co11-2", text: "Water supplies", is_correct: false }, { id: "co11-3", text: "Oxygen tanks", is_correct: false }] },
    { id: "cq11-2", text: "How many energy cells does the ship have?", options: [{ id: "co11-4", text: "A lot of energy cells", is_correct: true }, { id: "co11-5", text: "Zero energy cells", is_correct: false }, { id: "co11-6", text: "Only one cell", is_correct: false }] }
  ],
  12: [
    { id: "cq12-1", text: "Where does the crew encounter friendly alien explorers?", options: [{ id: "co12-1", text: "In Sector 7", is_correct: true }, { id: "co12-2", text: "On Earth", is_correct: false }, { id: "co12-3", text: "In the dormitory", is_correct: false }] },
    { id: "cq12-2", text: "How does the scientist describe the alien creature?", options: [{ id: "co12-4", text: "Small, fast, and intelligent", is_correct: true }, { id: "co12-5", text: "Slow and dangerous", is_correct: false }, { id: "co12-6", text: "Giant and noisy", is_correct: false }] }
  ],
  13: [
    { id: "cq13-1", text: "How does Scribtonia compare in size to Mars?", options: [{ id: "co13-1", text: "Scribtonia is larger than Mars", is_correct: true }, { id: "co13-2", text: "Mars is much bigger", is_correct: false }, { id: "co13-3", text: "They are identical", is_correct: false }] },
    { id: "cq13-2", text: "Which station is the safest in the sector?", options: [{ id: "co13-4", text: "Base ONE", is_correct: true }, { id: "co13-5", text: "Mining Station 4", is_correct: false }, { id: "co13-6", text: "Cargo Outpost", is_correct: false }] }
  ],
  14: [
    { id: "cq14-1", text: "What achievement is the Base ONE squadron celebrating?", options: [{ id: "co14-1", text: "Completing star academy training", is_correct: true }, { id: "co14-2", text: "Building a new spaceship", is_correct: false }, { id: "co14-3", text: "Returning to Earth", is_correct: false }] },
    { id: "cq14-2", text: "What is the squadron prepared for after graduation?", options: [{ id: "co14-4", text: "Deep space exploration", is_correct: true }, { id: "co14-5", text: "Retirement", is_correct: false }, { id: "co14-6", text: "Staying in base dorms", is_correct: false }] }
  ]
};

// Curricular Comic Bitácora Panels for all 14 Days (English only for full immersion)
const DEFAULT_COMIC_PANELS = {
  1: [
    {
      title: "Panel 1: Arrival at Base ONE",
      text: "Our spaceship has just docked successfully at Base ONE station.",
      illustration: "🚀🛰️"
    },
    {
      title: "Panel 2: Sparky Bot Assistant",
      text: "Greetings recruit! I am Sparky Bot, your artificial intelligence flight assistant.",
      illustration: "🤖⚡"
    },
    {
      title: "Panel 3: Recruit Leo",
      text: "The new crew member is recruit Leo. He is 13 years old, from Peru, and loves robots and science.",
      illustration: "🧑‍🚀🇵🇪"
    },
    {
      title: "Panel 4: Technical Skills",
      text: "Leo has a great technical skill: he can repair spaceships when they get damaged!",
      illustration: "🔧🛠️"
    }
  ],
  2: [
    {
      title: "Panel 1: Welcome to Basescrib",
      text: "The General welcomes the crew: 'Good morning, everyone! Welcome back to Basescrib.'",
      illustration: "🚀🪐"
    },
    {
      title: "Panel 2: Spaceship Garden",
      text: "The Grand Boss smiles and says: 'Today, we will visit the spaceship garden together.'",
      illustration: "🌱🌺"
    },
    {
      title: "Panel 3: The Study Room",
      text: "The Trainer opens the door: 'There are five computers and there are books.'",
      illustration: "💻📚"
    },
    {
      title: "Panel 4: Robot & Photos",
      text: "Suddenly, a small robot arrives: 'There is a robot!' It shows photos of the planet.",
      illustration: "🤖📷"
    }
  ],
  3: [
    {
      title: "Panel 1: Morning Routine",
      text: "The General wakes up at 7:00, eats cereal, and drinks milk at 7:30.",
      illustration: "⏰🥣"
    },
    {
      title: "Panel 2: Trainer's Routine",
      text: "'What do you do every morning?' The Trainer answers: 'I eat fruits and train.'",
      illustration: "🍎🏋️"
    },
    {
      title: "Panel 3: In the Control Room",
      text: "'What do you do after lunch?' 'I clean the control room,' the recruit replies.",
      illustration: "🧹🎛️"
    },
    {
      title: "Panel 4: Daily Habits",
      text: "'What does the General do every day?' 'The General writes reports and reads.'",
      illustration: "📖✍️"
    }
  ],
  4: [
    {
      title: "Panel 1: Supervising the Crew",
      text: "The General asks you to supervise the recruits and check what everyone is doing.",
      illustration: "👨‍✈️📋"
    },
    {
      title: "Panel 2: Learning Room",
      text: "'Hey, what are you doing?' 'I am studying English,' the recruit answers.",
      illustration: "📚💻"
    },
    {
      title: "Panel 3: Control Room",
      text: "'What are you doing?' 'I am cleaning the control room,' says another recruit.",
      illustration: "🧹🎛️"
    },
    {
      title: "Panel 4: Communication Center",
      text: "'I am reading a space guide and writing a mission report,' says the crew.",
      illustration: "📖✍️"
    }
  ],
  5: [
    {
      title: "Panel 1: Lunch in the Garden",
      text: "The crew is eating lunch together in the peaceful spaceship garden.",
      illustration: "🥗🌸"
    },
    {
      title: "Panel 2: Daily Schedule",
      text: "'I always wake up at 6:00 a.m. and I always study English at 4:00 p.m.'",
      illustration: "⏰📖"
    },
    {
      title: "Panel 3: Training & Helping",
      text: "'Then, I sometimes train at 5:00 p.m. and always help new recruits after lunch.'",
      illustration: "🏋️🤝"
    },
    {
      title: "Panel 4: Hobbies & Chat",
      text: "'I never draw during missions, but I sometimes draw on weekends!'",
      illustration: "🎨🚀"
    }
  ],
  6: [
    {
      title: "Panel 1: Checking Supplies",
      text: "The Trainer looks at the crew: 'Before training, let's check our materials.'",
      illustration: "📋🎒"
    },
    {
      title: "Panel 2: Notebook & Pencil",
      text: "'Do you have your notebook?' 'Yes, I do. I have my notebook and my pencil.'",
      illustration: "📓✏️"
    },
    {
      title: "Panel 3: Ruler & Calculator",
      text: "'Do you have your calculator?' 'No, I have my ruler, but I don't have my calculator.'",
      illustration: "📏🔢"
    },
    {
      title: "Panel 4: Ready for the Mission",
      text: "The General checks the supplies: 'Good. Every recruit has a backpack!'",
      illustration: "🎒🚀"
    }
  ],
  7: [
    {
      title: "Panel 1: The Interview Mission",
      text: "The Great Boss asks you to interview the new recruits and collect information.",
      illustration: "🎙️📋"
    },
    {
      title: "Panel 2: Favorite Subject",
      text: "'What is your favorite subject?' 'My favorite subject is Science,' answers your friend.",
      illustration: "🔬🧪"
    },
    {
      title: "Panel 3: Location & Time",
      text: "'Where is the library?' 'Next to the classroom.' 'When does the mission start?' 'At 9:00 a.m.'",
      illustration: "📚⏰"
    },
    {
      title: "Panel 4: Crew Readiness",
      text: "'How are the recruits feeling?' 'We are feeling happy and ready for training!'",
      illustration: "😊🚀"
    }
  ],
  8: [
    {
      title: "Panel 1: Lost Items",
      text: "The crew is preparing for a mission, but several items are left in the main room.",
      illustration: "🔍🛋️"
    },
    {
      title: "Panel 2: The Blue Jacket",
      text: "'Whose jacket is this?' 'That blue jacket is his,' says a recruit.",
      illustration: "🧥🪑"
    },
    {
      title: "Panel 3: Tablet & Headphones",
      text: "'That tablet is mine!' and 'Those headphones are hers,' answers Emma.",
      illustration: "📱🎧"
    },
    {
      title: "Panel 4: Returned Equipment",
      text: "'This water bottle is ours!' Everything is returned to its rightful owner.",
      illustration: "🍶🎒"
    }
  ],
  9: [
    {
      title: "Panel 1: Project Deadline",
      text: "The crew is working hard to complete their mission reports on time.",
      illustration: "📊💻"
    },
    {
      title: "Panel 2: The Missing Tablet",
      text: "Emma asks: 'Where is my tablet? Whose tablet is on that desk?'",
      illustration: "📱🔍"
    },
    {
      title: "Panel 3: Team Collaboration",
      text: "'This tablet is yours, Emma!' 'Thank you! The Trainer helps us with our project.'",
      illustration: "🤝✨"
    },
    {
      title: "Panel 4: Commendation",
      text: "The General smiles: 'The Great Boss congratulates them for their great teamwork!'",
      illustration: "🎖️👏"
    }
  ],
  10: [
    {
      title: "Panel 1: Organizing the Room",
      text: "The Great Boss wants the training room clean and organized before the mission.",
      illustration: "🧹🚪"
    },
    {
      title: "Panel 2: This Notebook & That Tablet",
      text: "'This is my notebook,' says the Trainer. 'That is the General's tablet.'",
      illustration: "📓📱"
    },
    {
      title: "Panel 3: These Pencils & Those Backpacks",
      text: "'These are the students' pencils, and those are the recruits' backpacks.'",
      illustration: "✏️🎒"
    },
    {
      title: "Panel 4: English Worksheets",
      text: "'Are these the English worksheets?' 'Yes, they are!' The room is ready.",
      illustration: "📑✨"
    }
  ],
  11: [
    {
      title: "Panel 1: Fuel Assessment",
      text: "Dani checks the reserves: 'How much plasma fuel do we have in the main tanks?'",
      illustration: "⚡🔋"
    },
    {
      title: "Panel 2: Energy Reserves",
      text: "'We have a lot of energy cells and enough power for the hyperjump!'",
      illustration: "🔋🚀"
    }
  ],
  12: [
    {
      title: "Panel 1: First Contact",
      text: "The crew encounters friendly extraterrestrial explorers in Sector 7.",
      illustration: "👽🛸"
    },
    {
      title: "Panel 2: Alien Dossier",
      text: "The scientist notes: 'This creature is small, fast, and very intelligent!'",
      illustration: "🐾🔬"
    }
  ],
  13: [
    {
      title: "Panel 1: Celestial Chart",
      text: "The navigator compares celestial bodies: 'Which planet has the densest atmosphere?'",
      illustration: "🪐📊"
    },
    {
      title: "Panel 2: Planetary Analysis",
      text: "'Scribtonia is larger than Mars, but Base ONE is the safest station in the sector!'",
      illustration: "🌌✨"
    }
  ],
  14: [
    {
      title: "Panel 1: Graduation Ceremony",
      text: "Today the Base ONE squadron proudly celebrates completing star academy training!",
      illustration: "🎓🏆"
    },
    {
      title: "Panel 2: Deep Space Frontier",
      text: "'Our squadron is fully prepared for deep space exploration across the galaxy!'",
      illustration: "🚀🌟"
    }
  ]
};

const panelsMap = DEFAULT_COMIC_PANELS;

export function ComicGame({ activity, onComplete, onClose, hideHeader = false }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [viewMode, setViewMode] = useState("reading"); // "reading" | "quiz"
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
  const missionId = activity?.mission || (dayNum + 6);
  const currentQuestion = questions[currentQIndex];

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

  const correctOption = currentQuestion?.options?.find(o => o.is_correct);
  const selectedUserOption = currentQuestion?.options?.find(o => o.id === selectedOptionId);

  return (
    <div 
      className="glass-console auth-card panel-large animate-fadeIn" 
      style={{ 
        maxWidth: 760, 
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
              Etapa 3: Bitácora y Lectura de Cómic
            </span>
            <h2 style={{ margin: "2px 0 0 0", color: "#b8fff9", fontSize: "clamp(1.1rem, 2.2vh, 1.35rem)" }}>{activity?.title || "Lectura de Cómic"}</h2>
          </div>
          <button onClick={onClose} className="btn-logout" style={{ margin: 0, padding: "4px 12px", fontSize: "0.82rem", background: "linear-gradient(135deg, #ff6b6b, #ee5a6f)" }}>
            Cerrar X
          </button>
        </div>
      )}

      {viewMode === "reading" ? (
        <div>
          <p style={{ color: "#9be6df", fontSize: "clamp(0.78rem, 1.5vh, 0.88rem)", marginBottom: "clamp(6px, 1.2vh, 12px)", textAlign: "left" }}>
            📖 Read the crew member's logs in English before starting the access quiz.
          </p>

          {/* Comic panels grid */}
          <div 
            className="comic-grid" 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
              gap: "clamp(8px, 1.4vh, 12px)", 
              marginBottom: "clamp(8px, 1.5vh, 14px)" 
            }}
          >
            {(DEFAULT_COMIC_PANELS[dayNum] || DEFAULT_COMIC_PANELS[1]).map((panel, idx) => (
              <div 
                key={idx} 
                className="comic-card" 
                style={{ 
                  background: "rgba(0, 0, 0, 0.35)", 
                  border: "1.5px solid rgba(184, 255, 249, 0.15)", 
                  borderRadius: 12, 
                  padding: "clamp(10px, 1.6vh, 14px)", 
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                  transition: "all 0.3s ease"
                }}
              >
                {/* Visual Novel layout Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(184, 255, 249, 0.1)", paddingBottom: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: "1.1rem" }}>📄</span>
                  <h4 style={{ color: "#ffd166", margin: 0, fontSize: "clamp(0.78rem, 1.6vh, 0.88rem)", fontWeight: "bold" }}>{panel.title}</h4>
                </div>

                {/* Floating Vector crewmate icon based on panel theme */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center", margin: "6px 0 10px 0" }}>
                  <div className="floating-crewmate" style={{ display: "flex", justifyContent: "center" }}>
                    <img 
                      src={ReclutaPrincipal} 
                      alt="Recluta" 
                      style={{ 
                        width: "clamp(45px, 7vh, 65px)", 
                        height: "clamp(45px, 7vh, 65px)",
                        filter: idx % 2 === 0 ? "hue-rotate(130deg) saturate(1.5)" : "none",
                        objectFit: "contain"
                      }} 
                    />
                  </div>
                  <span style={{ fontSize: "clamp(1.4rem, 3vh, 1.8rem)" }}>{panel.illustration}</span>
                </div>

                <div 
                  className="speech-bubble" 
                  style={{ 
                    background: "rgba(184, 255, 249, 0.08)", 
                    borderRadius: 10, 
                    padding: "10px 14px", 
                    fontWeight: "500",
                    color: "#e6f7ff",
                    border: "1px solid rgba(184, 255, 249, 0.2)",
                    fontSize: "0.88rem",
                    lineHeight: "1.4",
                    textAlign: "center"
                  }}
                >
                  "{panel.text}"
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button 
              className="btn-start" 
              style={{ 
                width: "100%", 
                maxWidth: 320, 
                padding: "12px 24px", 
                fontSize: "1rem",
                boxShadow: "0 0 20px rgba(255, 183, 3, 0.4)"
              }} 
              onClick={() => setViewMode("quiz")}
            >
              🚀 Iniciar Cuestionario de Acceso
            </button>
          </div>
        </div>
      ) : (
        // Quiz Mode
        <div style={{ textAlign: "left", padding: "5px 0" }}>
          {currentQuestion ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#9be6df", fontSize: "0.82rem", marginBottom: 10 }}>
                <span>PREGUNTA: {currentQIndex + 1} de {questions.length}</span>
                <span>ESTADO CONSOLA: <strong style={{ color: showSolution ? "#ef4444" : isError ? "#ff6b6b" : "#2ec4b6" }}>{showStatusText}</strong></span>
              </div>

              {/* Question Status Area */}
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
                  const isRightOpt = showSolution && opt.is_correct;
                  const isWrongOpt = showSolution && isSelected && !opt.is_correct;

                  let borderStyle = "1px solid rgba(255, 255, 255, 0.15)";
                  let bgStyle = "rgba(255, 255, 255, 0.04)";
                  let colorStyle = "#e6f7ff";
                  
                  if (isRightOpt) {
                    borderStyle = "2px solid #2ec4b6";
                    bgStyle = "rgba(46, 196, 182, 0.25)";
                    colorStyle = "#b8fff9";
                  } else if (isWrongOpt) {
                    borderStyle = "2px solid #ef4444";
                    bgStyle = "rgba(239, 68, 68, 0.25)";
                    colorStyle = "#fca5a5";
                  } else if (isSelected) {
                    borderStyle = "2px solid #2ec4b6";
                    bgStyle = "rgba(46, 196, 182, 0.25)";
                    colorStyle = "#b8fff9";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt)}
                      disabled={showSolution}
                      style={{
                        padding: "clamp(7px, 1.3vh, 10px) clamp(10px, 1.8vw, 14px)",
                        borderRadius: 10,
                        border: borderStyle,
                        background: bgStyle,
                        color: colorStyle,
                        textAlign: "left",
                        fontSize: "clamp(0.82rem, 1.6vh, 0.9rem)",
                        fontWeight: "600",
                        cursor: showSolution ? "default" : "pointer",
                        margin: 0,
                        transition: "all 0.2s ease",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      className="quiz-option-btn"
                    >
                      <span>🚀 {opt.text}</span>
                      {isRightOpt && <span style={{ fontWeight: "bold", color: "#2ec4b6" }}>✔️ CORRECTO</span>}
                      {isWrongOpt && <span style={{ fontWeight: "bold", color: "#ef4444" }}>❌ TU ELECCIÓN</span>}
                    </button>
                  );
                })}
              </div>

              {/* EXPLICIT ERROR FEEDBACK PANEL WITH CONTINUATION BUTTON */}
              {showSolution && (
                <div 
                  style={{ 
                    background: "rgba(239, 68, 68, 0.12)", 
                    border: "1.5px solid #ef4444", 
                    borderRadius: "14px", 
                    padding: "clamp(10px, 2vh, 16px)", 
                    marginTop: "clamp(8px, 1.5vh, 14px)", 
                    textAlign: "center" 
                  }} 
                  className="animate-fadeIn"
                >
                  <div style={{ color: "#ef4444", fontWeight: "900", fontSize: "clamp(0.95rem, 1.8vh, 1.05rem)", marginBottom: "4px" }}>
                    💥 ¡RESPUESTA INCORRECTA REGISTRADA! (-0.75 pts)
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.4)", padding: "8px 12px", borderRadius: 10, textAlign: "left", marginBottom: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ color: "#fca5a5", fontSize: "clamp(0.8rem, 1.5vh, 0.88rem)", marginBottom: 3 }}>
                      ❌ <strong>Tu respuesta:</strong> {selectedUserOption?.text || "Incorrecta"}
                    </div>
                    <div style={{ color: "#2ec4b6", fontSize: "clamp(0.85rem, 1.6vh, 0.92rem)", fontWeight: "bold" }}>
                      ✔️ <strong>Respuesta Correcta de la Bitácora:</strong> {correctOption?.text}
                    </div>
                  </div>

                  <button
                    onClick={handleNextAfterError}
                    style={{
                      padding: "clamp(8px, 1.6vh, 12px) clamp(16px, 3vw, 28px)",
                      background: "linear-gradient(135deg, #ffd166 0%, #ff9f1c 100%)",
                      border: "none",
                      borderRadius: "12px",
                      color: "#0d1b2a",
                      fontWeight: "900",
                      fontSize: "clamp(0.85rem, 1.7vh, 0.98rem)",
                      cursor: "pointer",
                      boxShadow: "0 0 20px rgba(255, 209, 102, 0.5)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    💡 ENTENDIDO - CONTINUAR A LA SIGUIENTE PREGUNTA ➔
                  </button>
                </div>
              )}

              {!showSolution && selectedOptionId && !isError && (
                <div style={{ marginTop: 12, color: "#2ec4b6", fontWeight: "bold", textAlign: "center", fontSize: "0.88rem" }}>
                  📡 TRANSMISIÓN OK: Avanzando...
                </div>
              )}
            </div>
          ) : (
            <p>No hay preguntas disponibles en esta actividad.</p>
          )}

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
            <button className="btn-cancel" onClick={() => setViewMode("reading")} style={{ margin: 0, padding: "6px 14px", fontSize: "0.82rem" }}>
              📖 Consultar Bitácoras
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

ComicGame.propTypes = {
  activity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    questions: PropTypes.array,
    mission: PropTypes.number,
    day_num: PropTypes.number
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  hideHeader: PropTypes.bool
};

