// Construit dist/manga-tracker.user.js, à installer dans l'app « Userscripts » (Safari, iPhone/iPad).
// EMULATORS=true : version reliée aux émulateurs Firebase locaux.
import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const useEmulators = process.env.EMULATORS === "true";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const scriptUrl = "https://azadrius.github.io/manga-tracker/manga-tracker.user.js";

const header = `// ==UserScript==
// @name         Manga Tracker
// @namespace    https://github.com/azadrius/manga-tracker
// @version      ${pkg.version}
// @description  Enregistre automatiquement le dernier chapitre lu de tes mangas.
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-idle
// @inject-into  content
// @noframes
// @updateURL    ${scriptUrl}
// @downloadURL  ${scriptUrl}
// ==/UserScript==
`;

const result = await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  write: false,
  format: "iife",
  target: "safari15",
  define: { __USE_EMULATORS__: JSON.stringify(useEmulators) },
});

await mkdir("dist", { recursive: true });
// Sonde de diagnostic, avant le code de l'appli : avec « #mt-debug » dans l'adresse, une alerte prouve que
// Userscripts exécute bien le fichier, et une 2e alerte montre toute erreur du code principal.
const probe = `var __mtDebug = location.hash.indexOf("mt-debug") !== -1;
if (__mtDebug) alert("Manga Tracker v${pkg.version} : le fichier est exécuté ✓ (GM : " + (typeof GM) + ")");
try {
`;
const probeEnd = `
} catch (e) {
  if (__mtDebug) alert("Manga Tracker : erreur au démarrage : " + (e && e.message ? e.message : e));
  else console.error("Manga Tracker", e);
}
`;
await writeFile("dist/manga-tracker.user.js", header + probe + result.outputFiles[0].text + probeEnd);
console.log("dist/manga-tracker.user.js");
