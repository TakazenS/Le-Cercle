import styles from "./AddServers.module.css";
import { useState } from "react";
import { useServers } from "./ServersProvider.tsx";

interface Props {
    onClose: () => void;
}

export function AddServers(props: Props) {
    const { onClose } = props;
    const { addServer } = useServers();
    const [serverName, setServerName] = useState<string>("New Server")
    const [ip, setIp] = useState<boolean>(true);
    const [protocol, setProtocol] = useState<string>("http://");
    const [serverIp, setServerIp] = useState<string>("127.0.0.1");
    const [port, setPort] = useState<string>("8080");
    const [serverDns, setServerDns] = useState<string>("");

    let serverIpUrl = `${protocol}${serverIp}:${port}`;
    let serverDnsUrl = `${protocol}${serverDns}`;

    return (
        <>
            <section
                className={styles.serverLinkSection}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div className={styles.abstract}>
                    <h1>Le Cercle</h1>
                    <p>Connect to a server.</p>
                </div>
                <div className={styles.card}>
                    <h3>Add a server connexion</h3>
                    <div className={styles.serverNameBox}>
                        <label htmlFor="serverName">Server Name</label>
                        <input
                            id="serverName"
                            type="text"
                            placeholder="Server Name (ex. New Server)"
                            onChange={e => setServerName(e.target.value)}
                        />
                    </div>

                    <span className={styles.largeSeparator}></span>

                    <div className={styles.btnContainer}>
                        <button
                            className={`${styles.btn} ${protocol === "http://" ? styles.btnOn : styles.btnOff}`}
                            onClick={_ => {
                                setProtocol("http://");
                            }}
                        >
                            HTTP
                        </button>
                        <p className={styles.orSign}>or</p>
                        <button
                            className={`${styles.btn} ${protocol === "https://" ? styles.btnOn : styles.btnOff}`}
                            onClick={_ => {
                                setProtocol("https://");
                            }}
                        >
                            HTTPS
                        </button>
                    </div>

                    <span className={styles.largeSeparator}></span>

                    <div className={styles.btnContainer}>
                        <button
                            className={`${styles.btn} ${ip ? styles.btnOn : styles.btnOff}`}
                            onClick={_ => {
                                setIp(true);
                            }}
                        >
                            Server IP
                        </button>
                        <p className={styles.orSign}>or</p>
                        <button
                            className={`${styles.btn} ${!ip ? styles.btnOn : styles.btnOff}`}
                            onClick={_ => {
                                setIp(false);
                            }}
                        >
                            Server name
                        </button>
                    </div>
                    <div className={styles.configBox}>
                        <div>
                        {ip ? (
                            <>
                                <div className={styles.configInputs}>
                                    <p>{protocol}</p>
                                    <input
                                        id="ip"
                                        onChange={e => setServerIp(e.target.value)}
                                        className={`${styles.inputs} ${styles.ipInput}`}
                                        type="text"
                                        placeholder={"Server IP (ex. 172.0.0.1)"}
                                    />
                                    <p>:</p>
                                    <input
                                        id="port"
                                        onChange={e => setPort(e.target.value)}
                                        className={`${styles.inputs} ${styles.portInput}`}
                                        type="text"
                                        placeholder={"Port (ex. 8080)"}
                                    />
                                </div>
                                <div className={styles.saveBtnBox}>
                                    <button
                                        onClick={() => (
                                            addServer(serverIpUrl, serverName)
                                        )}
                                        className={styles.saveBtn}
                                    >
                                        Add Server
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.configInputs}>
                                    <p>{protocol}</p>
                                    <input
                                        id="name"
                                        onChange={e => setServerDns(e.target.value)}
                                        className={`${styles.inputs} ${styles.serverDnsInput}`}
                                        type="text"
                                        placeholder={"Server Dns (ex. le-cercle.com)"}
                                    />
                                </div>
                                <div className={styles.saveBtnBox}>
                                    <button
                                        onClick={() => (
                                            addServer(serverDnsUrl, serverName)
                                        )}
                                        className={styles.saveBtn}
                                    >
                                        Add Server
                                    </button>
                                </div>
                            </>
                        )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}