import styles from "./ServersList.module.css";
import { useServers } from "./ServersProvider.tsx";

interface Props {
    onClose: () => void;
}

export function ServersList(props: Props) {
    const { onClose } = props;
    const { servers, selectServer, selectedId } = useServers();

    return (
        <section
            className={styles.listSection}
             onClick={(e) => {
                 if (e.target === e.currentTarget) onClose();
             }}
        >
            <div className={styles.abstract}>
                <h1>Le Cercle</h1>
                <p>Select a server to join.</p>
            </div>
            <div className={styles.card}>
                <h3>Select a server</h3>
                {servers.length !== 0 ? (
                    <div className={styles.list}>
                        {servers.map(s => (
                            <button
                                key={s.id}
                                className={`${styles.item} ${s.id === selectedId ? styles.selected : styles.notSelected}`}
                                onClick={() => {
                                    selectServer(s.id);
                                    onClose();
                                }}
                            >
                                <p>{s.name}</p>
                                <p>{s.url}</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p style={{color: "red"}}>No server found !</p>
                )}
            </div>
        </section>
    );
}