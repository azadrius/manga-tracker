import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// Sur GitHub Pages, l'appli est servie sous /<nom-du-dépôt>/ : BASE_PATH est fourni par le workflow.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  build: { chunkSizeWarningLimit: 800 }, // Firebase pèse ~200 Ko gzip, c'est attendu.
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Manga Tracker",
        short_name: "Mangas",
        description: "Où j'en suis dans mes mangas.",
        lang: "fr",
        start_url: base,
        scope: base,
        display: "standalone",
        background_color: "#0f1115",
        theme_color: "#0f1115",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
});
