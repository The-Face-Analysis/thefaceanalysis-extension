export const api: typeof chrome = (globalThis as any).browser ?? chrome;

export const SITE = "https://thefaceanalysis.com";

export const utm = (medium: string) => `utm_source=extension&utm_medium=${medium}`;

/** Real tool pages on thefaceanalysis.com (app/(marketing)/<slug>). Each takes a front photo upload. */
export const TOOLS: { slug: string; key: string }[] = [
  { slug: "face-symmetry-test", key: "toolSymmetry" },
  { slug: "face-shape-detector", key: "toolShape" },
  { slug: "attractiveness-test", key: "toolAttractiveness" },
  { slug: "golden-ratio-face-calculator", key: "toolGolden" },
  { slug: "facial-thirds", key: "toolThirds" },
  { slug: "eye-shape-detector", key: "toolEyes" },
  { slug: "canthal-tilt", key: "toolCanthal" },
  { slug: "jawline-rating", key: "toolJawline" },
];

export function t(key: string, subs?: string[]) {
  return api.i18n.getMessage(key, subs) || key;
}

export function i18nDom(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n!);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle!);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria!));
  });
}

export interface Prefs {
  view: "mirror" | "camera";
  zoom: number;
  grid: boolean;
  ring: boolean;
  timer: 0 | 3 | 10;
  tool: string;
}

export const DEFAULT_PREFS: Prefs = { view: "mirror", zoom: 1, grid: true, ring: false, timer: 0, tool: "face-symmetry-test" };

export async function loadPrefs(): Promise<Prefs> {
  const got = await api.storage.local.get("prefs");
  return { ...DEFAULT_PREFS, ...((got?.prefs as Partial<Prefs>) ?? {}) };
}

export async function savePrefs(p: Prefs) {
  await api.storage.local.set({ prefs: p });
}
