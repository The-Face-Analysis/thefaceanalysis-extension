// Lighting check from pixels only — no face model. Samples inside the face-guide
// oval on a small canvas and reports brightness,
// left/right balance and blown highlights. Sides are reported as they appear
// on screen, so a mirrored view flips them.
export type Level = "good" | "mid" | "low";

export interface LightReport {
  mean: number; // 0..255 luminance
  evenness: number; // 0..1, 1 = both halves equal
  clipped: number; // 0..1 share of near-white pixels
  darker: "left" | "right" | null; // on-screen side that is darker, if uneven
  level: Level;
  key: string; // messages.json key for the status line
}

const W = 96;
const H = 72;
let canvas: HTMLCanvasElement | null = null;

export function analyse(src: CanvasImageSource, sw: number, sh: number, mirrored: boolean, zoom = 1): LightReport | null {
  if (!sw || !sh) return null;
  canvas ??= document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  // Same centre crop the user sees (object-fit: cover at 4:3 + zoom).
  const target = 4 / 3;
  let cw = sw, ch = sh;
  if (sw / sh > target) cw = sh * target; else ch = sw / target;
  cw /= zoom; ch /= zoom;
  ctx.drawImage(src, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);
  // Only pixels inside the face-guide oval count. The guide SVG is viewBox 300×400
  // (preserveAspectRatio meet) inside the 4:3 stage, ellipse cx150 cy190 rx92 ry126:
  // centre (0.5W, 0.475H), radii 0.23H and 0.315H. Shrunk to 85 % so hair at the
  // oval's edge does not count as shadow.
  const cx = W / 2, cy = 0.475 * H, rx = 0.23 * H * 0.85, ry = 0.315 * H * 0.85;
  let sum = 0, n = 0, l = 0, ln = 0, r = 0, rn = 0, clip = 0;
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
      if (dx * dx + dy * dy > 1 || x < 0 || y < 0 || x >= W || y >= H) continue;
      const i = (y * W + x) * 4;
      const Y = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      sum += Y; n++;
      if (Y > 248) clip++;
      if (Y < 40) continue; // brows, pupils, stray hair: not light on skin
      if (x + 0.5 < cx) { l += Y; ln++; } else { r += Y; rn++; }
    }
  }
  const mean = sum / n;
  let left = ln ? l / ln : 0, right = rn ? r / rn : 0;
  if (mirrored) [left, right] = [right, left];
  const evenness = 1 - Math.abs(left - right) / Math.max(1, Math.max(left, right));
  const clipped = clip / n;
  const darker = evenness < 0.75 ? (left < right ? "left" : "right") : null;

  let level: Level = "good", key = "lightGood";
  if (mean < 55) { level = "low"; key = "lightTooDark"; }
  else if (clipped > 0.12 || mean > 215) { level = "low"; key = "lightTooBright"; }
  else if (darker) { level = evenness < 0.55 ? "low" : "mid"; key = darker === "left" ? "lightUnevenLeft" : "lightUnevenRight"; }
  else if (mean < 85) { level = "mid"; key = "lightDim"; }
  else if (clipped > 0.04) { level = "mid"; key = "lightShiny"; }
  return { mean, evenness, clipped, darker, level, key };
}
