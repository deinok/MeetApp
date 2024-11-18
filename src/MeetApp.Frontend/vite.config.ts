import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      includeAssets: [],
      injectRegister: "auto",
      manifest: {
        name: "MeetApp",
        short_name: "MeetApp",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      registerType: "autoUpdate",
      strategies: "generateSW",
      workbox: {
        globPatterns: [],
        runtimeCaching: [],
      }
    }),
  ],
  build: {
    outDir: "../MeetApp.Backend/wwwroot",
    emptyOutDir: true,
  },
});
