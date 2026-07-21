import styles from "./App.module.css";
import { useState } from "react";
import { FiServer } from "react-icons/fi";
import { MdKeyboardArrowUp } from "react-icons/md";
import { LuPaintbrush } from "react-icons/lu";
import { useAuth } from "./Auth/AuthProvider.tsx";
import { AuthScreen } from "./Auth/AuthScreen.tsx";
import { ManageModal } from "./Servers/ManageModal.tsx";
import { ListModal } from "./Servers/ListModal.tsx";
import { listServers } from "./Servers/servers.ts";
import { useServers } from "./Servers/ServersProvider.tsx";
import {AccentColorModal} from "./Theme/AccentColorModal.tsx";
import { ToggleTheme } from "./Theme/ToggleTheme.tsx";

function App() {
    const { isAuthenticated, logout } = useAuth();
    const { currentServer } = useServers();
    const [showAddServers, setShowAddServers] = useState<boolean>(() => listServers().length === 0);
    const [showServerSList, setShowServersList] = useState<boolean>(false);
    const [showAccentColorModal, setShowThemeToggle] = useState<boolean>(false);

    if (!isAuthenticated) {
        return (
            <main>
                {showAddServers && (
                    <ManageModal onClose={() => setShowAddServers(false)} />
                )}
                {showServerSList && (
                    <ListModal onClose={() => setShowServersList(false)} />
                )}
                {showAccentColorModal && (
                    <AccentColorModal onClose={() => setShowThemeToggle(false)}/>
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
                                <p className={styles.pre}><strong>Current :</strong></p>
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
                        <FiServer size={25}/>
                    </button>
                    <button
                        className={styles.toolBtn}
                        onClick={() => {
                            if (!showAccentColorModal) {
                                setShowThemeToggle(true)
                            } else {
                                setShowThemeToggle(false)
                            }
                        }}
                    >
                        <LuPaintbrush size={25}/>
                    </button>
                    <ToggleTheme />
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
