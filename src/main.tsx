import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./Auth/AuthProvider.tsx";
import { ServersProvider } from "./Servers/ServersProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <ServersProvider>
          <AuthProvider>
              <App />
          </AuthProvider>
      </ServersProvider>
  </React.StrictMode>,
);
