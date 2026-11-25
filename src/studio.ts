import { analyse, type LightReport } from "./light";
import { DEFAULT_PREFS, i18nDom, loadPrefs, savePrefs, SITE, t, TOOLS, utm, type Prefs } from "./shared";

const $ = <T extends Element = HTMLElement>(id: string) => document.getElementById(id) as unknown as T;

let prefs: Prefs = { ...DEFAULT_PREFS };
let stream: MediaStream | null = null;
let frozen = false;
let frozenRaw: HTMLCanvasElement | null = null; // un-mirrored frozen frame
let lightTimer = 0;
let photoUrl: string | null = null;
let photoImg: HTMLImageElement | null = null;

const video = $<HTMLVideoElement>("video");
const frozenCanvas = $<HTMLCanvasElement>("frozen");

// ---------- shared bits ----------
function toast(msg: string) {
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout((el as any)._t);
  (el as any)._t = setTimeout(() => (el.hidden = true), 3600);
}

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function toolUrl(slug: string, medium: string) {
  return `${SITE}/${slug}?${utm(medium)}`;
}

function buildMeasure(holder: HTMLElement, medium: string) {
  const tpl = $<HTMLTemplateElement>("measureTpl");
  holder.replaceChildren(tpl.content.cloneNode(true));
  i18nDom(holder);
  const sel = holder.querySelector<HTMLSelectElement>("select")!;
  const go = holder.querySelector<HTMLAnchorElement>("a.go")!;
  for (const tool of TOOLS) {
    const o = document.createElement("option");
    o.value = tool.slug;
    o.textContent = t(tool.key);
    sel.appendChild(o);
  }
  sel.value = prefs.tool;
  go.dataset.medium = medium;
  go.href = toolUrl(sel.value, medium);
  sel.addEventListener("change", () => {
    prefs.tool = sel.value;
    void savePrefs(prefs);
    document.querySelectorAll<HTMLSelectElement>(".measure select").forEach((s) => (s.value = sel.value));
    document.querySelectorAll<HTMLAnchorElement>(".measure a.go").forEach((a) => (a.href = toolUrl(sel.value, a.dataset.medium!)));
  });
}

function paintMeter(prefix: "m" | "p", r: LightReport | null, statusId: string) {
  const status = $(statusId);
  if (!r) return;
  document.documentElement.dataset.light = `${Math.round(r.mean)}/${r.evenness.toFixed(2)}/${r.clipped.toFixed(3)}`; // for e2e
  status.dataset.level = r.level;
  status.textContent = t(r.key);
  $(`${prefix}Bright`).style.width = `${Math.round((r.mean / 255) * 100)}%`;
  $(`${prefix}Even`).style.width = `${Math.round(r.evenness * 100)}%`;
  $(`${prefix}Clip`).style.width = `${Math.min(100, Math.round(r.clipped * 400))}%`;
}

// ---------- tabs ----------
function showTab(tab: "camera" | "photo") {
  for (const k of ["camera", "photo"] as const) {
    $(`pane-${k}`).hidden = k !== tab;
    $(`tab-${k}`).setAttribute("aria-selected", String(k === tab));
  }
  history.replaceState(null, "", `#${tab}`);
  if (tab === "camera") void startCamera();
  else stopCamera();
}

// ---------- camera ----------
async function startCamera() {
  if (stream) return;
  const state = $("camState");
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1920 }, height: { ideal: 1440 }, facingMode: "user" },
      audio: false,
    });
    video.srcObject = stream;
    await video.play().catch(() => {});
    state.hidden = true;
    clearInterval(lightTimer);
    lightTimer = window.setInterval(() => {
      if (frozen || !video.videoWidth) return;
      paintMeter("m", analyse(video, video.videoWidth, video.videoHeight, prefs.view === "mirror", prefs.zoom), "lightStatus");
    }, 400);
  } catch (e) {
    stream = null;
    const name = (e as DOMException)?.name;
    $("camMsg").textContent = t(name === "NotAllowedError" ? "camDenied" : name === "NotFoundError" || name === "OverconstrainedError" ? "camMissing" : "camError");
    state.hidden = false;
  }
}

function stopCamera() {
  clearInterval(lightTimer);
  stream?.getTracks().forEach((tr) => tr.stop());
  stream = null;
}

function applyView() {
  const flip = prefs.view === "mirror";
  const tf = `${flip ? "scaleX(-1) " : ""}scale(${prefs.zoom})`;
  video.style.transform = tf;
  drawFrozen(); // the frozen frame is drawn in the chosen view, zoom already applied
  document.querySelectorAll<HTMLButtonElement>("#view button").forEach((b) => b.classList.toggle("on", b.dataset.v === prefs.view));
  $("viewBadge").textContent = t(flip ? "badgeMirror" : "badgeTrue");
  $("viewHint").textContent = t(flip ? "hintMirror" : "hintTrue");
  $<HTMLInputElement>("zoom").value = String(prefs.zoom);
  $("zoomOut").textContent = `${prefs.zoom.toFixed(1)}×`;
  $("guides").toggleAttribute("hidden", !prefs.grid);
  $("grid").setAttribute("aria-pressed", String(prefs.grid));
  $("ring").setAttribute("aria-pressed", String(prefs.ring));
  $("stageWrap").classList.toggle("ring", prefs.ring);
  $("timer").setAttribute("aria-pressed", String(prefs.timer > 0));
  $("timer").textContent = prefs.timer ? t("timerOn", [String(prefs.timer)]) : t("timerOff");
}

function setPrefs(patch: Partial<Prefs>) {
  prefs = { ...prefs, ...patch };
  applyView();
  void savePrefs(prefs);
}

function drawFrozen() {
  if (!frozenRaw) return;
  frozenCanvas.width = frozenRaw.width;
  frozenCanvas.height = frozenRaw.height;
  const ctx = frozenCanvas.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (prefs.view === "mirror") { ctx.translate(frozenRaw.width, 0); ctx.scale(-1, 1); }
  ctx.drawImage(frozenRaw, 0, 0);
}

function mirrored(src: HTMLCanvasElement, mirror: boolean) {
  if (!mirror) return src;
  const c = document.createElement("canvas");
  c.width = src.width;
  c.height = src.height;
  const ctx = c.getContext("2d")!;
  ctx.translate(c.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(src, 0, 0);
  return c;
}

/** Current frame as the 4:3 crop the user sees, at full sensor resolution. */
function grab(mirror: boolean): HTMLCanvasElement | null {
  const sw = video.videoWidth, sh = video.videoHeight;
  if (!sw || !sh) return null;
  const target = 4 / 3;
  let cw = sw, ch = sh;
  if (sw / sh > target) cw = sh * target; else ch = sw / target;
  cw /= prefs.zoom; ch /= prefs.zoom;
  const c = document.createElement("canvas");
  c.width = Math.round(cw);
  c.height = Math.round(ch);
  const ctx = c.getContext("2d")!;
  if (mirror) { ctx.translate(c.width, 0); ctx.scale(-1, 1); }
  ctx.drawImage(video, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, c.width, c.height);
  return c;
}

async function countdown() {
  if (!prefs.timer) return;
  const el = $("count");
  el.hidden = false;
  for (let i = prefs.timer; i > 0; i--) {
    el.textContent = String(i);
    await new Promise((r) => setTimeout(r, 1000));
  }
  el.hidden = true;
}

async function toggleFreeze() {
  if (frozen) {
    frozen = false;
    frozenRaw = null;
    frozenCanvas.hidden = true;
    if (!stream) void startCamera();
    video.hidden = false;
    $("freeze").textContent = t("freeze");
    return;
  }
  if (!stream) return;
  await countdown();
  const c = grab(false);
  if (!c) return;
  frozenRaw = c;
  drawFrozen();
  frozenCanvas.hidden = false;
  video.hidden = true;
  frozen = true;
  $("freeze").textContent = t("retake");
  paintMeter("m", analyse(c, c.width, c.height, prefs.view === "mirror"), "lightStatus");
}

async function saveCamera() {
  const mirror = $<HTMLInputElement>("saveMirrored").checked;
  let c: HTMLCanvasElement | null;
  if (frozen && frozenRaw) c = mirrored(frozenRaw, mirror);
  else {
    if (!stream) {
      toast(t("camFirst"));
      return;
    }
    await countdown();
    c = grab(mirror);
  }
  if (!c) return;
  c.toBlob((b) => {
    if (!b) return;
    download(b, `face-photo-${stamp()}.jpg`);
    toast(t("saved"));
    const m = $("measureCam");
    m.classList.remove("pulse");
    void m.offsetWidth;
    m.classList.add("pulse");
  }, "image/jpeg", 0.92);
}

// ---------- photo flip ----------
function loadPhoto(file: File) {
  if (!file.type.startsWith("image/")) {
    toast(t("notImage"));
    return;
  }
  if (photoUrl) URL.revokeObjectURL(photoUrl);
  photoUrl = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    photoImg = img;
    $<HTMLImageElement>("asSaved").src = photoUrl!;
    const f = $<HTMLImageElement>("flipped");
    f.src = photoUrl!;
    f.style.transform = "scaleX(-1)";
    $("drop").hidden = true;
    $("pair").hidden = false;
    $<HTMLButtonElement>("saveFlipped").disabled = false;
    paintMeter("p", analyse(img, img.naturalWidth, img.naturalHeight, false), "photoLight");
  };
  img.src = photoUrl;
}

function saveFlipped() {
  if (!photoImg) return;
  const c = document.createElement("canvas");
  c.width = photoImg.naturalWidth;
  c.height = photoImg.naturalHeight;
  const ctx = c.getContext("2d")!;
  ctx.translate(c.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(photoImg, 0, 0);
  c.toBlob((b) => b && (download(b, `face-photo-flipped-${stamp()}.jpg`), toast(t("savedFlipped"))), "image/jpeg", 0.92);
}

// ---------- wiring ----------
async function main() {
  i18nDom();
  document.title = t("extName");
  $<HTMLAnchorElement>("brand").href = `${SITE}/?${utm("studio")}`;
  prefs = await loadPrefs();
  applyView();
  buildMeasure($("measureCam"), "studio-camera");
  buildMeasure($("measurePhoto"), "studio-photo");

  document.querySelectorAll<HTMLButtonElement>(".tabs button").forEach((b) =>
    b.addEventListener("click", () => showTab(b.dataset.tab as "camera" | "photo")),
  );
  document.querySelectorAll<HTMLButtonElement>("#view button").forEach((b) =>
    b.addEventListener("click", () => setPrefs({ view: b.dataset.v as Prefs["view"] })),
  );
  $<HTMLInputElement>("zoom").addEventListener("input", (e) => setPrefs({ zoom: Number((e.target as HTMLInputElement).value) }));
  $("grid").addEventListener("click", () => setPrefs({ grid: !prefs.grid }));
  $("ring").addEventListener("click", () => setPrefs({ ring: !prefs.ring }));
  $("timer").addEventListener("click", () => setPrefs({ timer: prefs.timer === 0 ? 3 : prefs.timer === 3 ? 10 : 0 }));
  $("freeze").addEventListener("click", () => void toggleFreeze());
  $("save").addEventListener("click", () => void saveCamera());
  $("retryCam").addEventListener("click", () => void startCamera());
  $("toPhoto").addEventListener("click", () => showTab("photo"));

  const file = $<HTMLInputElement>("file");
  file.addEventListener("change", () => file.files?.[0] && loadPhoto(file.files[0]));
  $("choose").addEventListener("click", () => file.click());
  $("saveFlipped").addEventListener("click", saveFlipped);
  const drop = $("drop");
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("over");
    const f = (e as DragEvent).dataTransfer?.files?.[0];
    if (f) loadPhoto(f);
  });
  addEventListener("paste", (e) => {
    const f = Array.from(e.clipboardData?.files ?? []).find((x) => x.type.startsWith("image/"));
    if (f) { showTab("photo"); loadPhoto(f); }
  });

  addEventListener("keydown", (e) => {
    if ((e.target as HTMLElement).closest("input,select,textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
    if ($("pane-camera").hidden) return;
    const k = e.key.toLowerCase();
    if (k === " ") { e.preventDefault(); void toggleFreeze(); }
    if (k === "s") void saveCamera();
    if (k === "m") setPrefs({ view: prefs.view === "mirror" ? "camera" : "mirror" });
    if (k === "g") setPrefs({ grid: !prefs.grid });
    if (k === "l") setPrefs({ ring: !prefs.ring });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopCamera();
    else if (!$("pane-camera").hidden && !frozen) void startCamera();
  });

  showTab(location.hash === "#photo" ? "photo" : "camera");
}

void main();
