// Rate link (≥5 use days, dismiss forever) + German UI. Run from a dir with playwright: node e2e-rate-locale.mjs <dist/chrome>
import { chromium } from "playwright";
const ext = process.argv[2];
const out = "/tmp/ext-test-tfa";
const ctx = await chromium.launchPersistentContext(`${out}/profile-r${Date.now()}`, {
  channel: "chromium", headless: true, viewport: { width: 1280, height: 800 }, locale: "de-DE",
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, "--lang=de", "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", `--use-file-for-fake-video-capture=${out}/face.y4m`],
});
let [sw] = ctx.serviceWorkers();
if (!sw) sw = await ctx.waitForEvent("serviceworker");
const id = sw.url().split("/")[2];
const errors = [];
const pop = await ctx.newPage();
pop.on("pageerror", (e) => errors.push(e.message));
await pop.goto(`chrome-extension://${id}/popup.html`);
await pop.waitForTimeout(400);
console.log("lang:", await pop.evaluate(() => document.documentElement.lang), "| title:", await pop.textContent("h1"));
console.log("rate hidden at 0 days:", await pop.$eval("#rate", (e) => e.hidden));
// one real use through the studio, then seed four earlier days
const st = await ctx.newPage();
await st.goto(`chrome-extension://${id}/studio.html#camera`);
await st.waitForTimeout(2000);
console.log("studio h1:", await st.textContent("h1"));
const days = await sw.evaluate(() => chrome.storage.local.get("useDays"));
console.log("use days after camera:", days.useDays);
console.log("rate hidden after 1 day:", await st.$eval("#rate", (e) => e.hidden));
await sw.evaluate(() => chrome.storage.local.set({ useDays: ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04", new Date().toISOString().slice(0, 10)] }));
await pop.reload(); await pop.waitForTimeout(400);
console.log("rate at 5 days:", await pop.$eval("#rate", (e) => [e.hidden, e.textContent, e.querySelector("a")?.href]));
await pop.screenshot({ path: `${out}/8-popup-rate-de.png`, fullPage: true });
await pop.click(".rate-x"); await pop.waitForTimeout(200);
await pop.reload(); await pop.waitForTimeout(400);
console.log("rate after dismiss:", await pop.$eval("#rate", (e) => e.hidden), (await sw.evaluate(() => chrome.storage.local.get("rateDone"))).rateDone);
console.log("errors:", errors);
await ctx.close();
