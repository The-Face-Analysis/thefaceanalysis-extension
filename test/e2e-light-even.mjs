import { chromium } from "playwright";
const ext = process.argv[2];
const ctx = await chromium.launchPersistentContext(`/tmp/ext-test-tfa/profile-s${Date.now()}`, { channel: "chromium", headless: true, viewport: { width: 1280, height: 800 }, args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`] });
let [sw] = ctx.serviceWorkers(); if (!sw) sw = await ctx.waitForEvent("serviceworker");
const id = sw.url().split("/")[2];
const p = await ctx.newPage();
await p.goto(`chrome-extension://${id}/studio.html#photo`); await p.waitForTimeout(400);
for (const f of ["sym.jpg", "face.jpg"]) {
  await p.setInputFiles("#file", `/tmp/ext-test-tfa/${f}`); await p.waitForTimeout(500);
  console.log(f, await p.textContent("#photoLight"), await p.evaluate(() => document.documentElement.dataset.light));
}
await ctx.close();
