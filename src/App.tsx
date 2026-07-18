import "./App.css";
import { useAuth } from "./Auth/auth.tsx";
import { AuthScreen } from "./Auth/AuthScreen.tsx";
import { AddServers } from "./Servers/AddServers.tsx";
import { FiServer } from "react-icons/fi";
import { getUrl } from "./lib.ts";
import { useState } from "react";
import { ServersList } from "./Servers/ServersList.tsx";

function App() {
    const { isAuthenticated, logout } = useAuth();
    const [showServerLink, setShowServerLink] = useState<boolean>(() => getUrl() === null);

    if (!isAuthenticated) {
        return (
            <main className="mainAuth">
                {showServerLink && (
                    <AddServers onClose={() => setShowServerLink(false)} />
                )}
                <ServersList />
                <AuthScreen />
                <div className="toolbar">
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
