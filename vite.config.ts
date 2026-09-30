import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",

        manifest: {
          name: "EdSync",
          short_name: "EdSync",
          description:
            "Offline-first personalized learning ecosystem.",
          start_url: "/",
          scope: "/",
          display: "standalone",

          theme_color: "#ffffff",
          background_color: "#ffffff",

          icons: [
            {
              src: "/pwa-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },

        workbox: {
          cleanupOutdatedCaches: true,

          runtimeCaching: [
            {
              urlPattern: ({ request }) =>
                request.destination === "document",

              handler: "NetworkFirst",

              options: {
                cacheName: "edsync-pages",
                networkTimeoutSeconds: 3,
              },
            },

            {
              urlPattern: ({ request }) =>
                ["script", "style", "worker"].includes(
                  request.destination,
                ),

              handler: "StaleWhileRevalidate",

              options: {
                cacheName: "edsync-assets",
              },
            },

            {
              urlPattern: ({ request }) =>
                request.destination === "image",

              handler: "CacheFirst",

              options: {
                cacheName: "edsync-images",
              },
            },
          ],
        },
      }),
    ],
  },

  tanstackStart: {
    server: { entry: "server" },
  },
});