// Entry for the standalone build: no app server, requests answered in the browser.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { setLocalApi } from "./lib/api";
import { localApi, localStream } from "./standalone/localApi";
import { App } from "./App";
import "./styles.css";

setLocalApi(localApi, localStream);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </StrictMode>,
);
