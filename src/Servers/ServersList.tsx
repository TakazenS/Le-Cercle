import styles from "./ServersList.module.css";
import { Server } from "../models.ts";
import { FiEdit3 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { useServers } from "./ServersProvider.tsx";
import { useState } from "react";
import { ManageServers } from "./ManageServers.tsx";
import { TrashModal } from "./TrashModal.tsx";

interface Props {
    onClose: () => void;
}

export function ServersList(props: Props) {
    const { onClose } = props;
    const { servers, selectedId, selectServer } = useServers();
    const [showEditServer, setShowEditServer] = useState<boolean>(false);
    const [server, setServer] = useState<Server>();
    const [isTrash, setIsTrash] = useState<boolean>(false);

    return showEditServer ? (
            <>
                <ManageServers onClose={() => setShowEditServer(false)} editServer={servers.find(s => s.id === server?.id)} />
            </>
        ) : (
            <>
                {isTrash && (
                    <TrashModal onClose={() => setIsTrash(false)} server={server} />
                )}
                <section
                    className={styles.listSection}
                     onClick={(e) => {
                         if (e.target === e.currentTarget) {
                             e.stopPropagation();
                             onClose();
                         }
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
                                    <div
                                        key={s.id}
                                        className={`${styles.item} ${s.id === selectedId ? styles.selected : styles.notSelected}`}
                                        onClick={() => {
                                            selectServer(s.id);
                                            onClose();
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                selectServer(s.id);
                                                onClose();
                                            }
                                        }}
                                    >
                                        <div>
                                            <p>{s.name}</p>
                                            <p>{s.url}</p>
                                        </div>
                                        <div className={styles.iconBox}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowEditServer(true);
                                                    setServer(s);
                                                }}
                                            >
                                                <FiEdit3 size={20}/>
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsTrash(true);
                                                    setServer(s)
                                                }}
                                            >
                                                <FaRegTrashCan size={20}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{color: "red"}}>No server found !</p>
                        )}
                    </div>
                </section>
            </>
    );
}