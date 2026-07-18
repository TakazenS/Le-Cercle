import styles from "./ServersList.module.css";
import { FiEdit3 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { useServers } from "./ServersProvider.tsx";
import { useState } from "react";
import { AddServers } from "./AddServers.tsx";

interface Props {
    onClose: () => void;
}

export function ServersList(props: Props) {
    const { onClose } = props;
    const { servers, selectServer, selectedId } = useServers();
    const [showEditServer, setShowEditServer] = useState<boolean>(false);
    const [serverId, setServerId] = useState<string>("");

    return showEditServer ? (
            <>
                <AddServers onClose={() => onClose()} editServer={servers.find(s => s.id === serverId)}/>
            </>
        ) : (
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
                                    onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            selectServer(s.id);
                                            onClose();
                                        }
                                    }}
                                >
                                    <div>
                                        <p
                                            onClick={(e) => {
                                                if (e.target === e.currentTarget) {
                                                    selectServer(s.id);
                                                    onClose();
                                                }
                                            }}
                                        >
                                            {s.name}
                                        </p>
                                        <p
                                            onClick={(e) => {
                                                if (e.target === e.currentTarget) {
                                                    selectServer(s.id);
                                                    onClose();
                                                }
                                            }}
                                        >
                                            {s.url}
                                        </p>
                                    </div>
                                    <div className={styles.iconBox}>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => {
                                                setShowEditServer(true);
                                                setServerId(s.id);
                                            }}
                                        >
                                            <FiEdit3 size={20}/>
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                        >
                                            <FaRegTrashCan size={20}/>
                                        </button>
                                    </div>
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