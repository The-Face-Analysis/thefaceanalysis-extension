// Build: esbuild bundles src/*.ts, static/ is copied, then one folder + zip per browser.
// Chrome zip also goes to Edge and Opera; Firefox gets its own manifest (background.scripts + gecko id).
import { build } from "esbuild";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { execSync } from "node:child_process";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const base = JSON.parse(readFileSync("static/manifest.json", "utf8"));
base.version = pkg.version;

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/tmp", { recursive: true });

await build({
  entryPoints: { background: "src/background.ts", popup: "src/popup.ts", studio: "src/studio.ts" },
  bundle: true,
  minify: false, // readable bundles: AMO asks for source otherwise, CWS reviews faster
  format: "iife",
  target: ["chrome110", "firefox115"],
  outdir: "dist/tmp",
  legalComments: "eof",
});

const FONTS = [
  ["@fontsource/inter/files/inter-latin-400-normal.woff2", "inter-400.woff2"],
  ["@fontsource/inter/files/inter-latin-500-normal.woff2", "inter-500.woff2"],
  ["@fontsource/inter/files/inter-latin-600-normal.woff2", "inter-600.woff2"],
  ["@fontsource/fraunces/files/fraunces-latin-500-normal.woff2", "fraunces-500.woff2"],
];

function out(target, manifest) {
  const dir = `dist/${target}`;
  cpSync("static", dir, { recursive: true });
  for (const f of ["background.js", "popup.js", "studio.js"]) copyFileSync(`dist/tmp/${f}`, `${dir}/${f}`);
  mkdirSync(`${dir}/fonts`, { recursive: true });
  for (const [from, to] of FONTS) copyFileSync(`node_modules/${from}`, `${dir}/fonts/${to}`);
  cpSync("LICENSES", `${dir}/LICENSES`, { recursive: true });
  writeFileSync(`${dir}/manifest.json`, JSON.stringify(manifest, null, 2));
  execSync(`cd ${dir} && zip -qrX ../${pkg.name}-${target}-${pkg.version}.zip . -x '*.DS_Store' -x '__MACOSX/*'`);
}

out("chrome", base);

const ff = structuredClone(base);
ff.background = { scripts: ["background.js"] };
ff.browser_specific_settings = {
  gecko: { id: "face-photo-helper@thefaceanalysis.com", strict_min_version: "140.0", data_collection_permissions: { required: ["none"] } },
  gecko_android: { strict_min_version: "142.0" },
};
out("firefox", ff);
rmSync("dist/tmp", { recursive: true, force: true });

// Source zip for addons.mozilla.org reviewers: everything needed to rebuild, nothing else.
// Rebuild: npm ci && npm run build → dist/firefox is identical to the uploaded add-on.
const SOURCE = ["package.json", "package-lock.json", "build.mjs", "tsconfig.json", "README.md", "LICENSE", "LICENSES", "src", "static"];
execSync(`zip -qrX dist/${pkg.name}-source-${pkg.version}.zip ${SOURCE.join(" ")} -x '*.DS_Store'`);
console.log("built", pkg.version, "→ dist/chrome, dist/firefox + zips, source zip");
