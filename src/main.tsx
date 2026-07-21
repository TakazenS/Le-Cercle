import React from "react";
import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ThemeProvider } from "./Theme/ThemeProvider.tsx";
import { ServersProvider } from "./Servers/ServersProvider.tsx";
import { AuthProvider } from "./Auth/AuthProvider.tsx";
import App from "./App";

getCurrentWindow().show();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <ThemeProvider>
          <ServersProvider>
              <AuthProvider>
                  <App />
              </AuthProvider>
          </ServersProvider>
      </ThemeProvider>
  </React.StrictMode>,
);
