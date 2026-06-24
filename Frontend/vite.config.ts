import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  vite: {
    server: {
      allowedHosts: ["instant-prop-firm-finder-production.up.railway.app"],
    },
    preview: {
      allowedHosts: ["instant-prop-firm-finder-production.up.railway.app"],
    },
  },
});