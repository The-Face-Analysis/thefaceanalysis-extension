// "Rate the extension" link. Shown only after the studio was used on ≥ MIN_DAYS different days,
// never again once dismissed or clicked. No incentive, no nagging: one quiet line.
import { api, t } from "./shared";

const MIN_DAYS = 5;
/** Firefox listing URL — set after the AMO listing exists; while null the link is hidden in Firefox. */
const AMO_URL: string | null = null;

const today = () => new Date().toISOString().slice(0, 10);

/** Call when the studio is actually used (camera started or photo opened). */
export async function recordUse() {
  const got = await api.storage.local.get(["useDays"]);
  const days: string[] = Array.isArray(got?.useDays) ? got.useDays : [];
  const d = today();
  if (days.includes(d)) return;
  await api.storage.local.set({ useDays: [...days, d].slice(-30) });
}

function isFirefox() {
  return api.runtime.getURL("").startsWith("moz-extension://");
}

function isEdge() {
  const brands: { brand: string }[] = (navigator as any).userAgentData?.brands ?? [];
  return brands.some((b) => b.brand === "Microsoft Edge") || /\bEdg\//.test(navigator.userAgent);
}

export function reviewUrl(): string | null {
  if (isFirefox()) return AMO_URL;
  const id = api.runtime.id;
  if (isEdge()) return `https://microsoftedge.microsoft.com/addons/detail/${id}`;
  return `https://chromewebstore.google.com/detail/${id}/reviews`;
}

/** Fills `holder` with the rate line when due; leaves it hidden otherwise. */
export async function mountRate(holder: HTMLElement) {
  const url = reviewUrl();
  if (!url) return;
  const got = await api.storage.local.get(["useDays", "rateDone"]);
  const days: string[] = Array.isArray(got?.useDays) ? got.useDays : [];
  if (got?.rateDone || days.length < MIN_DAYS) return;

  const done = () => {
    void api.storage.local.set({ rateDone: true });
    holder.hidden = true;
  };
  const text = document.createElement("span");
  text.textContent = t("rateAsk");
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = t("rateLink");
  a.addEventListener("click", done);
  const x = document.createElement("button");
  x.type = "button";
  x.className = "rate-x";
  x.textContent = "×";
  x.title = t("rateDismiss");
  x.setAttribute("aria-label", t("rateDismiss"));
  x.addEventListener("click", done);
  holder.replaceChildren(text, " ", a, x);
  holder.hidden = false;
}
