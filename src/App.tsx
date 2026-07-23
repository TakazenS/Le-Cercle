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
import { AccentColorModal } from "./Theme/AccentColorModal.tsx";
import { ToggleTheme } from "./Theme/ToggleTheme.tsx";

function App() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const { currentServer } = useServers();
    const [showAddServersModal, setShowAddServersModal] = useState<boolean>(() => listServers().length === 0);
    const [showServersListModal, setShowServersListModal] = useState<boolean>(false);
    const [showAccentColorModal, setShowAccentColorModal] = useState<boolean>(false);

    const modalOpen = showAddServersModal || showServersListModal || showAccentColorModal;

    if (isLoading) return (
        <div className="boot">
            <div className="boot-spinner"></div>
            <p>Loading your session...</p>
        </div>
    )

    if (!isAuthenticated) {
        return (
            <main>
                {showAddServersModal && (
                    <ManageModal onClose={() => setShowAddServersModal(false)} />
                )}
                {showServersListModal && (
                    <ListModal onClose={() => setShowServersListModal(false)} />
                )}
                {showAccentColorModal && (
                    <AccentColorModal onClose={() => setShowAccentColorModal(false)}/>
                )}
                <AuthScreen modalOpen={modalOpen} />
                <div className={styles.toolbar} inert={modalOpen}>
                    <button
                        className={styles.selectServerBtn}
                        onClick={() => {
                            if (!showServersListModal) {
                                setShowServersListModal(true)
                            } else {
                                setShowServersListModal(false)
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
                            if (!showAddServersModal) {
                                setShowAddServersModal(true)
                            } else {
                                setShowAddServersModal(false)
                            }
                        }}
                    >
                        <FiServer size={25}/>
                    </button>
                    <button
                        className={styles.toolBtn}
                        onClick={() => {
                            if (!showAccentColorModal) {
                                setShowAccentColorModal(true)
                            } else {
                                setShowAccentColorModal(false)
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
