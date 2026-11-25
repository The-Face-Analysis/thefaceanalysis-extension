import { chromium } from "playwright";
const ext = process.argv[2];
const out = "/tmp/ext-test-tfa";
const ctx = await chromium.launchPersistentContext(`${out}/profile-${Date.now()}`, {
  channel: "chromium", headless: true, viewport: { width: 1280, height: 800 }, acceptDownloads: true,
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", `--use-file-for-fake-video-capture=${out}/face.y4m`],
});
let [sw] = ctx.serviceWorkers();
if (!sw) sw = await ctx.waitForEvent("serviceworker");
const id = sw.url().split("/")[2];
await new Promise((r) => setTimeout(r, 1200));
console.log("pages after install:", ctx.pages().map((p) => p.url()));
const errors = [];
const watch = (p) => { p.on("pageerror", (e) => errors.push(e.message)); p.on("console", (m) => m.type() === "error" && errors.push(m.text())); };

// popup
const pop = await ctx.newPage(); watch(pop);
await pop.setViewportSize({ width: 330, height: 520 });
await pop.goto(`chrome-extension://${id}/popup.html`);
await pop.waitForTimeout(500);
await pop.screenshot({ path: `${out}/1-popup.png`, fullPage: true });
console.log("popup tool links:", await pop.$$eval("#tools a", (as) => as.map((a) => a.href)));

// studio camera
const page = await ctx.newPage(); watch(page);
await page.goto(`chrome-extension://${id}/studio.html#camera`);
await page.waitForTimeout(2500);
console.log("video:", await page.evaluate(() => [document.getElementById("video").videoWidth, document.getElementById("video").videoHeight]));
console.log("light:", await page.textContent("#lightStatus"), await page.evaluate(() => document.documentElement.dataset.light));
console.log("fill:", await page.evaluate(() => { const v = document.getElementById("video").getBoundingClientRect(), s = document.getElementById("stage").getBoundingClientRect(); return { fit: getComputedStyle(document.getElementById("video")).objectFit, video: [v.width, v.height], stage: [s.width, s.height] }; }));
await page.screenshot({ path: `${out}/2-mirror.png` });
await page.click('#view button[data-v="camera"]');
await page.fill("#zoom", "1.4"); await page.dispatchEvent("#zoom", "input");
await page.click("#ring");
await page.waitForTimeout(900);
await page.screenshot({ path: `${out}/3-true-ring.png`, fullPage: true });
await page.click("#ring");
await page.click("#freeze");
await page.waitForTimeout(400);
const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#save")]);
console.log("download:", dl.suggestedFilename());
await dl.saveAs(`${out}/saved.jpg`);
console.log("saved dims:", await page.evaluate(async (u) => { const i = new Image(); i.src = u; await i.decode(); return [i.naturalWidth, i.naturalHeight, (i.naturalWidth / i.naturalHeight).toFixed(3)]; }, "data:image/jpeg;base64," + (await import("node:fs")).readFileSync(`${out}/saved.jpg`).toString("base64")));
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/4-frozen-saved.png` });
console.log("measure href:", await page.getAttribute("#measureCam a.go", "href"));
await page.selectOption("#measureCam select", "face-shape-detector");
console.log("measure href after select:", await page.getAttribute("#measurePhoto a.go", "href"));

// photo tab
await page.click("#tab-photo");
await page.setInputFiles("#file", `${out}/photo.jpg`);
await page.waitForTimeout(800);
console.log("photo light:", await page.textContent("#photoLight"), await page.evaluate(() => document.documentElement.dataset.light));
await page.screenshot({ path: `${out}/5-photo.png` });
const [dl2] = await Promise.all([page.waitForEvent("download"), page.click("#saveFlipped")]);
console.log("download2:", dl2.suggestedFilename());

// mobile width
await page.setViewportSize({ width: 420, height: 900 });
await page.click("#tab-camera");
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/6-narrow.png`, fullPage: true });
console.log("errors:", errors);
await ctx.close();
