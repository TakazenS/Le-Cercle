import "./App.css";
import { useAuth } from "./Auth/AuthProvider.tsx";
import { AuthScreen } from "./Auth/AuthScreen.tsx";
import { AddServers } from "./Servers/AddServers.tsx";
import { FiServer } from "react-icons/fi";
import { useState } from "react";
import { ServersList } from "./Servers/ServersList.tsx";
import { listServers } from "./Servers/servers.ts";

function App() {
    const { isAuthenticated, logout } = useAuth();
    const [showServerLink, setShowServerLink] = useState<boolean>(() => listServers().length === 0);

    if (!isAuthenticated) {
        return (
            <main className="mainAuth">
                {showServerLink && (
                    <AddServers onClose={() => setShowServerLink(false)} />
                )}
                <AuthScreen />
                <div className="toolbar">
                    <ServersList />
                    <button
                        className="selectServer"
                        onClick={() => {
                            if (!showServerLink) {
                                setShowServerLink(true)
                            } else {
                                setShowServerLink(false)
                            }
                        }}
                    >
                        <FiServer size={35}/>
                    </button>
                </div>
            </main>
        )
    }
  return (
    <main className="mainApp">
        <p>Connecté ! (bientôt le reste)</p>
        <button onClick={logout}>Se deconnecter</button>
    </main>
  );
}

export default App;
