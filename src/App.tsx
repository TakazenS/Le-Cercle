import styles from "./App.module.css";
import { useState } from "react";
import { FiServer } from "react-icons/fi";
import { MdKeyboardArrowUp } from "react-icons/md";
import { LuPaintbrush } from "react-icons/lu";
import { useAuth } from "./Auth/AuthProvider.tsx";
import { AuthScreen } from "./Auth/AuthScreen.tsx";
import { ManageServers } from "./Servers/ManageServers.tsx";
import { ServersList } from "./Servers/ServersList.tsx";
import { listServers } from "./Servers/servers.ts";
import { useServers } from "./Servers/ServersProvider.tsx";
import {ThemeModal} from "./Theme/ThemeModal.tsx";

function App() {
    const { isAuthenticated, logout } = useAuth();
    const { currentServer } = useServers();
    const [showAddServers, setShowAddServers] = useState<boolean>(() => listServers().length === 0);
    const [showServerSList, setShowServersList] = useState<boolean>(false);
    const [showThemeToggle, setShowThemeToggle] = useState<boolean>(false);

    if (!isAuthenticated) {
        return (
            <main>
                {showAddServers && (
                    <ManageServers onClose={() => setShowAddServers(false)} />
                )}
                {showServerSList && (
                    <ServersList onClose={() => setShowServersList(false)} />
                )}
                {showThemeToggle && (
                    <ThemeModal onClose={() => setShowThemeToggle(false)}/>
                )}
                <AuthScreen />
                <div className={styles.toolbar}>
                    <button
                        className={styles.selectServerBtn}
                        onClick={() => {
                            if (!showServerSList) {
                                setShowServersList(true)
                            } else {
                                setShowServersList(false)
                            }
                        }}
                    >
                        {currentServer === null ? (
                            <p className={styles.textNoServer}>No server selected</p>
                        ) : (
                            <>
                                <p className={styles.pre}>Current :</p>
                                <p className={styles.textServer}>{currentServer?.name} - {currentServer?.url}</p>
                                <MdKeyboardArrowUp className={styles.pre} size={35}/>
                            </>
                        )}
                    </button>
                    <button
                        className={styles.toolBtn}
                        onClick={() => {
                            if (!showAddServers) {
                                setShowAddServers(true)
                            } else {
                                setShowAddServers(false)
                            }
                        }}
                    >
                        <FiServer size={30}/>
                    </button>
                    <button
                        className={styles.toolBtn}
                        onClick={() => {
                            if (!showThemeToggle) {
                                setShowThemeToggle(true)
                            } else {
                                setShowThemeToggle(false)
                            }
                        }}
                    >
                        <LuPaintbrush size={30}/>
                    </button>
                </div>
            </main>
        )
    }
  return (
    <main>
        <p>Connecté ! (bientôt le reste)</p>
        <button onClick={logout}>Se deconnecter</button>
    </main>
  );
}

export default App;
