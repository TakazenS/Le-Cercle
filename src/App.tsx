import "./App.css";
import { useAuth } from "./Auth/auth.tsx";
import { AuthScreen } from "./Auth/AuthScreen.tsx";
import { ServerLink } from "./Auth/ServerLink.tsx";
import { FiServer } from "react-icons/fi";
import { getUrl } from "./lib.ts";
import { useState } from "react";

function App() {
    const { isAuthenticated, logout } = useAuth();
    const [showServerLink, setShowServerLink] = useState<boolean>(() => getUrl() === null);

    if (!isAuthenticated) {
        return (
            <main className="mainAuth">
                {showServerLink && (
                    <ServerLink onClose={() => setShowServerLink(false)} />
                )}
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
