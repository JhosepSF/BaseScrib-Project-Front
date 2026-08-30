import fixPerspective from "fix-perspective";

/**
 * Calculates exact CSS matrix3d using fix-perspective package.
 * @param {Array<{x: number, y: number}>} from - Flat 4-corner coordinates [{x,y}, {x,y}, {x,y}, {x,y}]
 * @param {Array<{x: number, y: number}>} to - Measured 4-corner perspective coordinates [{x,y}, {x,y}, {x,y}, {x,y}]
 * @returns {string} CSS matrix3d transform string
 */
export function getFixPerspectiveMatrix(from, to) {
  try {
    const solver = typeof fixPerspective === "function" ? fixPerspective : fixPerspective?.default;
    if (!solver) return "";
    const transform = solver(from, to);
    if (!transform || !transform.H) return "";
    const H = transform.H;
    return `matrix3d(${H[0][0]}, ${H[1][0]}, ${H[2][0]}, ${H[3][0]}, ${H[0][1]}, ${H[1][1]}, ${H[2][1]}, ${H[3][1]}, ${H[0][2]}, ${H[1][2]}, ${H[2][2]}, ${H[3][2]}, ${H[0][3]}, ${H[1][3]}, ${H[2][3]}, ${H[3][3]})`;
  } catch (err) {
    console.error("Error in getFixPerspectiveMatrix:", err);
    return "";
  }
}
