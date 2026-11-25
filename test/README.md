E2E (Playwright Chromium; Chrome stable ignores --load-extension):
  mkdir -p /tmp/ext-test-tfa && cd /tmp/ext-test-tfa && npm i playwright && npx playwright install chromium
  Feeds (from surgio_marketing/public/images/samples, centred 4:3 crops — never composite a portrait onto a background, the seam shows as a strip):
    face-a.jpg (sample-a, evenly lit, crop top 157) · face-c.jpg / face.jpg (sample-c, side-lit) → 1280×960
    ffmpeg -loop 1 -i face-X.jpg -t 3 -r 10 -pix_fmt yuv420p face-X.y4m ; photo-a.jpg / photo.jpg = the square originals
  node test/e2e.mjs dist/chrome             # popup, mirror, true view + ring, freeze/save (4:3 check), flip tab, narrow
  node test/e2e-denied.mjs dist/chrome      # camera-blocked state
  node test/e2e-light-even.mjs dist/chrome  # sym.jpg (right half mirrored) must read "Good light" 1.00; face.jpg "Uneven" ~0.62
  node store/make-assets.mjs dist/chrome store   # 1280×800 screenshots + 440×280 tile
