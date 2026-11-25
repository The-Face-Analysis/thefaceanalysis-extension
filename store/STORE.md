# Store listing — True Mirror & Face Photo Helper by The Face Analysis

Upload: `dist/thefaceanalysis-extension-chrome-<v>.zip` → Chrome Web Store, Edge Add-ons (same zip).
`dist/thefaceanalysis-extension-firefox-<v>.zip` → addons.mozilla.org (source: readable, unminified bundle;
if asked, upload this repo without node_modules/dist + "npm ci && npm run build").
Developer account: The Face Analysis's own account (separate from the other brands), verified with the
thefaceanalysis.com domain via Search Console.

## Name
1.0.1: True Mirror & Flip Image – The Face Analysis (localised in _locales: en, es, pt_BR, de, fr — see "1.0.1 update" below).
1.0.0 (first submission): True Mirror & Face Photo Helper by The Face Analysis

## Summary (≤132)
1.0.1: Online true mirror for your webcam: see the non-reversed view others see, check your light and flip any image. Nothing is uploaded.
1.0.0: True mirror and camera view, lighting check, face guide grid and photo flip — take a straight, well-lit photo of your own face.

## Category
Chrome: Photos · Edge: Photos · Firefox: Photos, Music & Videos

## Description
See your face the way others do, and take a straight, well-lit photo of it — all on your own device.

TRUE MIRROR
• Switch between the mirror (flipped, the face you are used to) and the true view (how other people and cameras see you).
• Zoom up to 3×, a white light ring that brightens your face on screen, and a 3 or 10 second timer.

FACE GUIDE
• An oval with a centre line, an eye line and a thirds grid, so your face is level, centred and straight-on.

LIGHTING CHECK
• Reads the light inside the face guide: is it bright enough, is one side darker, is part of the face blown out?
• Tells you what to change — "turn toward the light", "move closer to the light", "soften the light".

FREEZE AND SAVE
• Freeze the frame, then save it as a JPEG in your downloads — as the camera sees you, or mirrored.

FLIP A PHOTO
• Drop, choose or paste any picture of yourself and see it as saved and flipped, side by side. Save the flipped version.

MEASURE IT
• One click opens a free measurement on thefaceanalysis.com — face symmetry, face shape, golden ratio, facial thirds, eye shape, canthal tilt, jawline. You upload the photo there yourself; the extension uploads nothing.

PRIVACY
The camera picture and your photos never leave your device. No account, no analytics, no tracking, no access to the websites you visit. Measurements on thefaceanalysis.com are proportions, not a medical or beauty verdict.

Made by The Face Analysis — free face measurement tools at thefaceanalysis.com.

## Single purpose (CWS field)
Help people take a straight, well-lit photo of their own face: a true-mirror camera view with a face guide and lighting check, a photo flipper, and saving the result locally.

## Permission justifications (paste each into its own CWS field)

**storage**
Remember the user's view settings (mirror/true view, zoom, guide, light ring, timer, chosen measurement).

**Camera**
Requested by the browser's own prompt on the extension's studio page (getUserMedia) when the user opens the mirror; it is not a manifest permission. Frames are processed in the page and never sent anywhere.

**No host permissions, no content scripts, no activeTab**
The extension never reads or changes websites.

**Remote code**
No.

## Data usage (CWS privacy tab)
Collects nothing. Tick none of the data types (the camera image is processed locally and not "collected" — it is never transmitted or stored by the developer). Certify: not sold, not used for unrelated purposes, not used for creditworthiness.
Privacy policy URL: https://thefaceanalysis.com/extension#privacy  (section must exist on the landing before submission)
Firefox `data_collection_permissions`: required ["none"] (already in the built manifest).

## Assets
- Icon 128: static/icons/128.png (site orb, transparent)
- Screenshots 1280×800 (store/):
  1. screenshot-1-mirror-guide.png — mirror view, face guide, "Good light"
  2. screenshot-2-true-view-light-ring.png — true view + light ring
  3. screenshot-3-light-check.png — lighting check catching side light
  4. screenshot-4-flip-photo.png — photo as saved vs flipped + measure card
  5. screenshot-5-toolbar-popup.png — toolbar popup
- Small promo tile 440×280: store/promo-small-440x280.png (source: store/tile.html)
- Regenerate: store/make-assets.mjs (see test/README.md for the camera feeds)
- Homepage: https://thefaceanalysis.com/extension
- Faces in screenshots: the site's own sample portraits (surgio_marketing/public/images/samples) — check their licence/model status before submitting.

## Before submitting
- thefaceanalysis.com/extension must be live (install/uninstall pages + #privacy) — install opens it.
- Review: "true mirror" is a generic term; no competitor names anywhere in the listing.


## CWS panel — every field, in panel order
Nothing on this list is optional to check; fields marked (leave empty) really stay empty.

### Package
Upload `dist/thefaceanalysis-extension-chrome-<version>.zip`.

### Store listing
- Description: "Description" section above (paste as-is).
- Category: Tools ("Araçlar"; if the panel offers "Photos", that also fits). Edge: "Photos"
- Language: English (other languages come from _locales automatically).
- Store icon: static/icons/128.png
- Screenshots: every store/screenshot-*.png (1280×800), in file-name order.
- Small promo tile: store/promo-small-440x280.png
- Marquee promo tile, promo video: (leave empty)
- Official URL: https://thefaceanalysis.com (shows only after the domain is verified in Search Console with this same Google account)
- Homepage URL: https://thefaceanalysis.com/extension
- Support URL: https://thefaceanalysis.com/extension
- Mature content: No

### Privacy
- Single purpose: "Single purpose" section above.
- Permission justifications: one field per permission, text from "Permission justifications" above.
- Are you using remote code? **No** (justification field: leave empty)
- Data usage — "What user data do you plan to collect?": tick **none** of the 9 boxes
  (personally identifiable, health, financial/payment, authentication, personal communications,
  location, web history, user activity, website content). Reading the open page or camera
  locally is not "collecting": nothing leaves the browser.
- Data usage — tick **all 3** certifications (not sold/transferred, not used for unrelated
  purposes, not used for creditworthiness/lending).
- Privacy policy URL: https://thefaceanalysis.com/extension#privacy (must be live before "Submit for review")

### Distribution
- Payments: Free (no in-app purchases)
- Visibility: Public
- Regions: All regions

### Test instructions
- Doesn't need one. Click the toolbar icon → Open mirror; allow the camera when the browser asks. No account or login.
- Username / password: (leave empty)

### Account (once per developer account)
- Trader declaration: non-trader (user's decision 2026-11-25)
- Publisher display name: brand name; verify the contact email.


## 1.0.1 update — panel steps (Chrome Web Store)
Do this only after 1.0.0 is approved (a new package during review restarts the review).

1. Package → **Upload new package** → `dist/thefaceanalysis-extension-chrome-1.0.1.zip`.
   The name and summary come from the package (`_locales`), so they change by themselves, in every language below.
2. Store listing → language menu (top of the listing) → keep **English**, then **Add language** for each row below and paste
   that language's description file into **Description**. Screenshots and promo tile: reuse the English ones (optional per language).
3. Privacy tab: unchanged (still only `storage`; no data collected; same privacy URL).
4. **Submit for review.**

| Listing language | Name (from package) | Summary (from package) | Description to paste |
|---|---|---|---|
| English | True Mirror & Flip Image – The Face Analysis | Online true mirror for your webcam: see the non-reversed view others see, check your light and flip any image. Nothing is uploaded. | `store/descriptions/en.md` |
| Spanish (Español) | Espejo online y voltear imagen – The Face Analysis | Espejo online para tu webcam: mira tu cara sin invertir, como te ven los demás, revisa la luz y voltea imágenes. Nada se sube. | `store/descriptions/es.md` |
| Portuguese (Brazil) | Espelho online e inverter foto – The Face Analysis | Espelho online na webcam: veja o rosto sem inverter, como os outros veem, confira a luz e inverta qualquer imagem. Nada é enviado. | `store/descriptions/pt_BR.md` |
| German (Deutsch) | Spiegel-Kamera & Bild spiegeln – The Face Analysis | Online-Spiegel für deine Webcam: sieh dein Gesicht ungespiegelt wie andere, prüfe das Licht und spiegle jedes Bild. Kein Upload. | `store/descriptions/de.md` |
| French (Français) | Miroir en ligne et webcam – The Face Analysis | Miroir en ligne pour votre webcam : voyez votre visage non inversé, vérifiez la lumière et inversez une image. Rien n'est envoyé. | `store/descriptions/fr.md` |

What changed in 1.0.1: keyword name + summary, UI in 5 languages (es, pt_BR, de, fr added; tool pages on the site stay English and say so),
a quiet "Rate it in the store" line shown only after use on 5 different days (never again once clicked or closed; no incentive),
`<html lang>` follows the UI language, zips no longer pick up `.DS_Store`, a source zip for Firefox reviewers.

### Keyword research (DataForSEO, Google Ads monthly volume, 2026-11-25)
| Market | Keyword | Volume | Used in |
|---|---|---|---|
| US | true mirror | 18,100 | name, description |
| US | online mirror / mirror online | 8,100 / 3,600 | summary, description |
| US | true mirror online | 3,600 | summary + description |
| US | webcam mirror | 2,900 | summary ("for your webcam"), description |
| US | non reversed mirror | 2,900 | summary ("non-reversed"), description |
| US | mirror camera / camera mirror | 2,900 / 1,300 | description, search terms |
| US | selfie mirror | 2,900 | — (not the main intent) |
| US | mirror on computer | 2,400 | description first line |
| US | flip image | 22,200 | name ("Flip Image"), description |
| US | lighting check | 590 | description, search terms |
| US | mirror chrome extension / mirror extension | 70 / 110 | — (small; covered by name) |
| US | webcam test / camera test | 74,000 / 27,100 | not used: different intent (testing a webcam) |
| ES+MX | espejo online | 1,900 + 590 | es name + summary |
| ES+MX | voltear imagen / invertir imagen | 590+880 / 720+590 | es name / description |
| ES+MX | espejo cámara, cámara espejo, espejo virtual | 170–260 each | description, search terms |
| BR | inverter imagem / espelhar imagem | 2,400 / 1,900 | pt name ("inverter foto", 50-char cap) + summary / description |
| BR | espelho online / espelho virtual | 880 / 720 | pt name + summary |
| BR | câmera espelho / espelho câmera | 320 / 170 | search terms |
| DE | bild spiegeln | 1,600 | de name |
| DE | spiegel kamera | 880 | de name |
| DE | "online spiegel" | 1,000,000 | not used: that is the news site |
| FR | inverser image / retourner image | 1,000 / 390 | summary ("inversez une image") / description |
| FR | miroir en ligne | 880 | fr name + summary |
| TR | ayna kamera / kamera ayna | 880 / 260 | not added yet: TR ≈1.8k mirror-intent searches, smallest market; next candidate |

Names are ≤50 characters in every language (AMO caps add-on names at 50; Chrome allows 75). Mirror-intent totals (excluding webcam-test terms): ES+MX ≈ 6.6k, BR ≈ 6.4k, DE ≈ 2.5k, FR ≈ 2.5k, TR ≈ 1.8k → es, pt_BR, de, fr added.

## Microsoft Edge Add-ons (Partner Center) — every field
Panel: https://partner.microsoft.com/dashboard/microsoftedge → **Create new extension**. Account: The Face Analysis's own Microsoft account (made with hi@thefaceanalysis.com).

### Packages
- Upload `dist/thefaceanalysis-extension-chrome-1.0.1.zip` (the Chrome zip; Edge needs no changes).

### Availability
- Visibility: **Public**
- Markets: **All markets** (default)

### Properties
- Category: **Photos**
- Privacy policy: **Yes, this extension needs a privacy policy** → URL `https://thefaceanalysis.com/extension#privacy`
  (it handles the camera picture, even though nothing leaves the device)
- Website URL: `https://thefaceanalysis.com/extension`
- Support contact details: `https://thefaceanalysis.com/extension`
- Mature content: **No**

### Store listings — one per language (English first, then **Add language** for es, pt-BR, de, fr)
For every language:
- Description (min 250 characters): paste `store/descriptions/<locale>.md` (en, es, pt_BR, de, fr).
- Extension Store logo (300×300): `store/edge-logo-300x300.png`
- Small promotional tile (440×280): `store/promo-small-440x280.png`
- Screenshots (1280×800, up to 6): `store/screenshot-1…5` in order
- Large promotional tile, YouTube video: leave empty
- Short description: the summary of that language (table in "1.0.1 update" above)
- Search terms (max 7 terms, each ≤30 characters, ≤21 words in total):

| Language | Search terms (one per box) |
|---|---|
| English | true mirror · online mirror · webcam mirror · non reversed mirror · mirror camera · flip image · lighting check |
| Español | espejo online · espejo de cámara · espejo virtual · voltear imagen · invertir imagen · cámara espejo · revisar luz |
| Português (BR) | espelho online · espelho virtual · câmera espelho · inverter imagem · espelhar imagem · espelho de câmera · verificar luz |
| Deutsch | spiegel kamera · online spiegel kamera · webcam spiegel · bild spiegeln · echter spiegel · spiegelbild · lichtcheck |
| Français | miroir en ligne · miroir webcam · inverser image · retourner image · miroir caméra · vrai miroir · miroir virtuel |

### Submit → Notes for certification
```
No account or login is needed. Click the toolbar icon → "Open the mirror" and allow the camera when Edge asks
(the camera is requested by getUserMedia on the extension's own page, not a manifest permission). Mirror/true view,
face guide, lighting check, freeze/save and "Flip a photo" all run locally; nothing is uploaded and the extension
makes no network requests. The only permission is "storage" (view settings). Links to thefaceanalysis.com open
in a new tab only when clicked. Source: https://github.com/The-Face-Analysis/thefaceanalysis-extension (MIT).
```

## Firefox Add-ons (AMO) — every field
Panel: https://addons.mozilla.org/developers/ → **Submit a New Add-on**. Account: Firefox account made with hi@thefaceanalysis.com.

1. **How to distribute:** On this site (listed).
2. **Upload:** `dist/thefaceanalysis-extension-firefox-1.0.1.zip`. Platforms: Firefox desktop **and** Firefox for Android (the manifest declares both).
3. **Source code:** "Do you need to submit source code?" → **Yes** (the bundle is built with esbuild; it is readable and unminified, but say yes to avoid a back-and-forth)
   → upload `dist/thefaceanalysis-extension-source-1.0.1.zip`.
4. **Describe add-on** (English first; then the locale menu → add es, pt-BR, de, fr with the same fields):
   - Name: comes from the package (per language, see the "1.0.1 update" table)
   - Add-on URL (slug): `true-mirror-webcam`
   - Summary (≤250): the summary of that language (table above)
   - Description: `store/descriptions/<locale>.md`
   - "This add-on is experimental": **No** · "Requires payment / non-free services": **No**
   - Categories — Firefox: **Photos, Music & Videos** · Firefox for Android: **Photos & Media**
   - Tags: AMO offers a fixed list; tick the ones that fit (e.g. "image", "photos" or "camera" if offered), otherwise leave empty
   - Support email: `hi@thefaceanalysis.com` · Support website: `https://thefaceanalysis.com/extension`
   - Homepage: `https://thefaceanalysis.com/extension`
   - License: **MIT License**
   - Privacy policy: **This add-on has a privacy policy** → paste:
```
The True Mirror extension by The Face Analysis collects no personal data. The camera picture and any photo you open are
processed only on your device and are never uploaded. There is no account, no analytics, no advertising and no tracking,
and the extension does not read or change the websites you visit. View settings (mirror/true view, zoom, guide, light ring,
timer) are saved in the browser's own extension storage and are deleted when you remove the add-on. Links to
thefaceanalysis.com open only when you click them. Full policy: https://thefaceanalysis.com/extension#privacy
```
5. **Notes to reviewer:**
```
Build from source: the JS bundles are produced by esbuild (unminified, format iife) from src/*.ts.
To rebuild: unzip the source zip, run `npm ci && npm run build` (Node 20+); dist/firefox is byte-identical
to the uploaded add-on. Source repo: https://github.com/The-Face-Analysis/thefaceanalysis-extension (MIT).
To test: toolbar icon → "Open the mirror", allow the camera. No login. Only permission: storage.
No remote code, no network requests; data_collection_permissions: none.
```
6. Icon/screenshots (Edit listing → Media after submission): icon is taken from the package; screenshots `store/screenshot-1…5`.
