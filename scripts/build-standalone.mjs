// Builds the standalone (serverless) version as one self-contained HTML page:
// dist-standalone/neuro-tutor.html. Used for the hosted page; the app server is not needed.
// Run: npm run build:standalone
import { build } from "vite";
import fs from "node:fs";

process.env.VITE_STANDALONE = "1";
const outDir = "dist-standalone";

await build({
  configFile: "vite.config.ts",
  logLevel: "warn",
  build: {
    outDir,
    emptyOutDir: true,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      input: "src/main.standalone.tsx",
      output: { entryFileNames: "app.js", assetFileNames: "app[extname]" },
    },
  },
});

const js = fs.readFileSync(`${outDir}/app.js`, "utf8").replace(/<\/script/gi, "<\\/script");
const css = fs.readFileSync(`${outDir}/app.css`, "utf8");
if (!js.includes("VITE_STANDALONE") && !/standalone/i.test(js)) console.warn("warning: could not confirm the standalone flag in the bundle");

const page = `<title>Neuro Tutor</title>
<meta name="description" content="Adaptive clinical neurology learning: placement, lessons, interactive models, patient simulations, and spaced review. Educational use only.">
<meta name="apple-mobile-web-app-title" content="Neuro Tutor">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;
fs.writeFileSync(`${outDir}/neuro-tutor.html`, page);
console.log(`Wrote ${outDir}/neuro-tutor.html (${(page.length / 1024).toFixed(0)} KB)`);
