import day1_scene1 from "./day1_scene1.jpg";
import day1_scene2 from "./day1_scene2.jpg";

import day2_scene1 from "./day2_scene1.jpg";
import day2_scene2 from "./day2_scene2.jpg";
import day2_scene3 from "./day2_scene3.jpg";
import day2_scene4 from "./day2_scene4.jpg";

import day3_scene1 from "./day3_scene1.jpg";
import day3_scene2 from "./day3_scene2.jpg";
import day3_scene3 from "./day3_scene3.jpg";

import day4_scene1 from "./day4_scene1.jpg";
import day4_scene2 from "./day4_scene2.jpg";

import day5_scene1 from "./day5_scene1.jpg";
import day6_scene1 from "./day6_scene1.jpg";

// High-resolution thematic scene backgrounds for subsequent days
import bgDay7 from "../cinematicas/bg_toma8_console.jpg";
import bgDay8 from "../cinematicas/bg_toma6_cabin.jpg";
import bgDay9 from "../cinematicas/bg_toma10_presentacion.jpg";
import bgDay10 from "../cinematicas/bg_toma13_juego3.jpg";
import bgDay11 from "../cinematicas/bg_toma11_juego1.jpg";
import bgDay12 from "../cinematicas/bg_toma12_juego2.jpg";
import bgDay13 from "../cinematicas/bg_toma1_orbit.jpg";
import bgDay14 from "../cinematicas/bg_toma15_juego5.jpg";

export const COMIC_SCENE_IMAGES = {
  1: [day1_scene1, day1_scene2],
  2: [day2_scene1, day2_scene2, day2_scene3, day2_scene4],
  3: [day3_scene1, day3_scene2, day3_scene3],
  4: [day4_scene1, day4_scene2],
  5: [day5_scene1],
  6: [day6_scene1],
  7: [bgDay7],
  8: [bgDay8],
  9: [bgDay9],
  10: [bgDay10],
  11: [bgDay11],
  12: [bgDay12],
  13: [bgDay13],
  14: [bgDay14],
};

export function getComicSceneImage(dayNum, sceneIndex = 0) {
  const dayImages = COMIC_SCENE_IMAGES[dayNum] || COMIC_SCENE_IMAGES[1];
  if (!dayImages || dayImages.length === 0) return day1_scene1;
  return dayImages[sceneIndex % dayImages.length] || dayImages[0];
}
