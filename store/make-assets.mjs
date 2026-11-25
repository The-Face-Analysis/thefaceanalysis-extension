// Store screenshots 1280×800 + promo tile 440×280. Usage: node store.mjs <dist/chrome> <outdir>
import { chromium } from "playwright";
const [ext, outDir] = process.argv.slice(2);
const T = "/tmp/ext-test-tfa";
async function launch(feed) {
  const ctx = await chromium.launchPersistentContext(`${T}/profile-st${Date.now()}`, {
    channel: "chromium", headless: true, viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1,
    args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`, "--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", `--use-file-for-fake-video-capture=${feed}`],
  });
  let [sw] = ctx.serviceWorkers(); if (!sw) sw = await ctx.waitForEvent("serviceworker");
  return { ctx, id: sw.url().split("/")[2] };
}
const hideIntro = (p) => p.addStyleTag({ content: ".intro{display:none}.top{padding-bottom:14px}" });

// even light (sample-a)
{
  const { ctx, id } = await launch(`${T}/face-a.y4m`);
  const p = await ctx.newPage();
  await p.goto(`chrome-extension://${id}/studio.html#camera`);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${outDir}/screenshot-1-mirror-guide.png` });
  console.log("1:", await p.textContent("#lightStatus"));
  await p.click('#view button[data-v="camera"]');
  await p.click("#ring");
  await hideIntro(p);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${outDir}/screenshot-2-true-view-light-ring.png` });
  await p.click("#ring");
  await p.click('#view button[data-v="mirror"]');
  await p.click("#tab-photo");
  await p.setInputFiles("#file", `${T}/photo-a.jpg`);
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${outDir}/screenshot-4-flip-photo.png` });
  console.log("4:", await p.textContent("#photoLight"));
  // toolbar popup on a branded canvas
  const pop = await ctx.newPage();
  await pop.setViewportSize({ width: 330, height: 430 });
  await pop.goto(`chrome-extension://${id}/popup.html`);
  await pop.waitForTimeout(500);
  const shot = (await pop.screenshot({ fullPage: true })).toString("base64");
  const comp = await ctx.newPage();
  await comp.goto(`chrome-extension://${id}/studio.html`);
  await comp.evaluate((png) => {
    document.body.innerHTML = `<div class="aurora"></div><div style="position:relative;z-index:1;display:grid;grid-template-columns:1fr 430px;gap:60px;align-items:center;height:800px;padding:0 110px;box-sizing:border-box">
      <div><p class="eyebrow">One click from the toolbar</p><h1 style="text-align:left;font-size:52px">Mirror, flip, then measure</h1>
      <p class="lede" style="margin:18px 0 0;text-align:left;font-size:18px">Open the true mirror or flip a photo from any tab. Eight free face measurements on thefaceanalysis.com are one click away — you upload the photo yourself; the extension uploads nothing.</p></div>
      <img src="data:image/png;base64,${png}" style="width:430px;border-radius:18px;box-shadow:0 40px 80px -30px rgba(0,0,0,.8);border:1px solid rgba(255,255,255,.15)"></div>`;
  }, shot);
  await comp.waitForTimeout(500);
  await comp.screenshot({ path: `${outDir}/screenshot-5-toolbar-popup.png` });
  await ctx.close();
}
// side light (sample-c)
{
  const { ctx, id } = await launch(`${T}/face-c.y4m`);
  const p = await ctx.newPage();
  await p.goto(`chrome-extension://${id}/studio.html#camera`);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${outDir}/screenshot-3-light-check.png` });
  console.log("3:", await p.textContent("#lightStatus"));
  // promo tile
  const tile = await ctx.newPage();
  await tile.setViewportSize({ width: 440, height: 280 });
  await tile.goto(`chrome-extension://${id}/studio.html`); // same origin → bundled fonts + icon resolve
  await tile.evaluate((html) => { document.open(); document.write(html); document.close(); }, (await import("node:fs")).readFileSync(`${outDir}/tile.html`, "utf8"));
  await tile.waitForTimeout(800);
  await tile.screenshot({ path: `${outDir}/promo-small-440x280.png` });
  await ctx.close();
}
