// Construit l'extension dans dist/ (à charger dans chrome://extensions → « Charger l'extension non empaquetée »).
// EMULATORS=true : l'extension parle à l'émulateur Firebase local au lieu du vrai projet.
import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const useEmulators = process.env.EMULATORS === "true";
const outdir = "dist";

await rm(outdir, { recursive: true, force: true });
await mkdir(outdir, { recursive: true });
await cp("public", outdir, { recursive: true });

if (useEmulators) {
  const path = `${outdir}/manifest.json`;
  const manifest = JSON.parse(await readFile(path, "utf8"));
  manifest.host_permissions.push("http://127.0.0.1:8080/*");
  manifest.name += " (local)";
  await writeFile(path, JSON.stringify(manifest, null, 2));
}

await build({
  entryPoints: ["src/content.ts", "src/background.ts", "src/popup.ts"],
  outdir,
  bundle: true,
  format: "iife",
  target: "chrome120",
  minify: !useEmulators,
  define: { __USE_EMULATORS__: JSON.stringify(useEmulators) },
  logLevel: "info",
});
