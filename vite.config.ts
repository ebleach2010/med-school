import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The API server runs separately (server/main.ts). In dev, Vite proxies /api to it.
// Only files under src/, shared/ and the public content modules are bundled for the
// browser. Hidden case state lives in content/cases and is imported by the server only.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:8787", changeOrigin: false } },
  },
  build: { outDir: "dist", sourcemap: false },
});
