import styles from "./AddServers.module.css";
import { Server } from "../models.ts";
import { useState } from "react";
import { useServers } from "./ServersProvider.tsx";

interface Props {
    onClose: () => void;
    editServer?: Server;
}

export function AddServers(props: Props) {
    const { onClose, editServer } = props;
    const { addServer, updateServer } = useServers();
    const [serverName, setServerName] = useState<string>("New Server");
    const [serverIp, setServerIp] = useState<string>("127.0.0.1");
    const [serverPort, setPort] = useState<string>("8080");
    const [serverDns, setServerDns] = useState<string>("");
    const parsed = editServer ? parseUrl(editServer.url) : null;
    const [protocol, setProtocol] = useState<string>(parsed?.protocol ?? "http://");
    const [ip, setIp] = useState<boolean>(parsed ? isIp(parsed.host) : true);

    const serverNameValue = editServer?.name ?? "";
    const serverIpValue = parsed && isIp(parsed.host) ? parsed.host : "";
    const serverPortValue = parsed?.port || "";
    const serverDnsValue = parsed && !isIp(parsed.host) ? parsed.host : "";

    let serverIpUrl = `${protocol}${serverIp}:${serverPort}`;
    let serverDnsUrl = `${protocol}${serverDns}`;

    function parseUrl(url: string) {
        const u = new URL(url);
        return {
            protocol: u.protocol + "//",
            host: u.hostname,
            port: u.port,
        };
    }

    function isIp(host: string) {
        return /^\d{1,3}(\.\d{1,3}){3}$/.test(host); // ressemble à une IPv4 ?
    }

    function submit(url: string) {
        if (editServer) {
            updateServer(editServer.id, {name: serverName, url})
        } else {
            addServer(url, serverName)
        }
        onClose();
    }

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
                    {editServer ? (
                        <p>Add a server to your server list.</p>
                    ) : (
                        <p>Change server information.</p>
                    )}
                </div>
                <div className={styles.card}>
                    {editServer ? (
                        <h3>Add a server connexion</h3>
                    ) : (
                        <h3>Change a server connexion</h3>
                    )}
                    <div className={styles.serverNameBox}>
                        <label htmlFor="serverName">Server Name</label>
                        <input
                            id="serverName"
                            type="text"
                            placeholder="Server Name (ex. New Server)"
                            value={editServer ? serverNameValue : ""}
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
                            Server DNS
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
                                        value={editServer ? serverIpValue : ""}
                                        placeholder={"IP (ex. 172.0.0.1)"}
                                    />
                                    <p>:</p>
                                    <input
                                        id="port"
                                        onChange={e => setPort(e.target.value)}
                                        className={`${styles.inputs} ${styles.portInput}`}
                                        type="text"
                                        value={editServer ? serverPortValue : ""}
                                        placeholder={"Port (ex. 8080)"}
                                    />
                                </div>
                                <div className={styles.saveBtnBox}>
                                    <button
                                        onClick={() => submit(serverIpUrl)}
                                        className={styles.saveBtn}
                                    >
                                        {editServer ? "Save" : "Add Server"}
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
                                        value={editServer ? serverDnsValue : ""}
                                        placeholder={"DNS (ex. le-cercle.com)"}
                                    />
                                </div>
                                <div className={styles.saveBtnBox}>
                                    <button
                                        onClick={() => submit(serverDnsUrl)}
                                        className={styles.saveBtn}
                                    >
                                        {editServer ? "Save" : "Add Server"}
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