import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "node:fs";
import { openDb } from "./db";
import { createApp } from "./app";
import { log } from "./log";

const db = openDb();
const app = createApp({ db });

if (process.env.NODE_ENV === "production" && fs.existsSync("dist")) {
  app.use("/*", serveStatic({ root: "./dist" }));
  app.get("*", serveStatic({ path: "./dist/index.html" }));
}

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, () => log.info(`Neuro tutor API listening on http://localhost:${port}`));
