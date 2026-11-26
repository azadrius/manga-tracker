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
await writeFile("dist/manga-tracker.user.js", header + result.outputFiles[0].text);
console.log("dist/manga-tracker.user.js");
