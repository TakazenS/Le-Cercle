import styles from "./ManageModal.module.css";
import { Server } from "../models.ts";
import { useEffect, useState } from "react";
import { useServers } from "./ServersProvider.tsx";

interface Props {
    onClose: () => void;
    editServer?: Server;
}

const regIp = /^\d{1,3}(\.\d{1,3}){3}$/;
const regPort = /^\d{1,4}$/

export function ManageModal(props: Props) {
    const { onClose, editServer } = props;
    const { addServer, updateServer } = useServers();
    const parsed = editServer ? parseUrl(editServer.url) : null;
    const [serverName, setServerName] = useState<string>(editServer?.name ?? "");
    const [protocol, setProtocol] = useState<string>(parsed?.protocol ?? "http://");
    const [ip, setIp] = useState<boolean>(parsed ? isIp(parsed.host) : true);
    const [serverIp, setServerIp] = useState<string>(parsed && isIp(parsed.host) ? parsed.host : "");
    const [serverPort, setPort] = useState<string>(parsed?.port || "");
    const [serverDns, setServerDns] = useState<string>(parsed && !isIp(parsed.host) ? parsed.host : "");
    const [invalid, setInvalid] = useState<string[]>([]);

    let serverIpUrl = `${protocol}${serverIp}:${serverPort}`;
    let serverDnsUrl = `${protocol}${serverDns}`;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const isInvalid = (field: string) => invalid.includes(field);

    const clearInvalid = (field: string) =>
        setInvalid(prev => prev.filter(f => f !== field));

    function parseUrl(url: string) {
        const u = new URL(url);
        return {
            protocol: u.protocol + "//",
            host: u.hostname,
            port: u.port,
        };
    }

    function isIp(host: string) {
        return regIp.test(host);
    }

    function submit(url: string) {
        const missing: string[] = [];

        if (!serverName.trim()) {
            missing.push("name");
        }
        if (ip) {
            if (!serverIp.trim() || !regIp.test(serverIp)) {
                missing.push("ip");
            }
            if (!serverPort.trim() || !regPort.test(serverPort)) {
                missing.push("port");
            }
        } else {
            if (!serverDns.trim()) {
                missing.push("dns");
            }
        }

        if (missing.length > 0) {
            setInvalid(missing);
            return;
        }

        if (editServer) {
            updateServer(editServer.id, {name: serverName, url: url});
        } else {
            addServer(url, serverName);
        }
        onClose();
    }

    return (
        <>
            <section
                className={styles.serverLinkSection}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        e.stopPropagation();
                        onClose();
                    }
                }}
            >
                <div className={styles.abstract}>
                    <h1>Le Cercle</h1>
                    {editServer ? (
                        <p>Change server connexion information.</p>
                    ) : (
                        <p>Add a server to your server list.</p>
                    )}
                </div>
                <div className={styles.card}>
                    <div className={styles.serverNameBox}>
                        <label htmlFor="serverName">Server Name</label>
                        <input
                            id="serverName"
                            className={`${isInvalid("name") ? styles.invalid : ""}`}
                            type="text"
                            placeholder="Server Name (ex. New Server)"
                            onAnimationEnd={() => clearInvalid("name")}
                            value={serverName}
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
                                <div
                                    className={`${styles.configInputs} ${isInvalid("ip") || isInvalid("port") ? styles.invalid : ""}`}
                                    onAnimationEnd={() => {
                                        clearInvalid("ip");
                                        clearInvalid("port");
                                    }}
                                >
                                    <p>{protocol}</p>
                                    <div className={styles.mergeInputs}>
                                        <input
                                            id="ip"
                                            onChange={e => setServerIp(e.target.value)}
                                            className={`${styles.inputs} ${styles.ipInput}`}
                                            type="text"
                                            value={serverIp}
                                            placeholder={"IP (ex. 127.0.0.1)"}
                                        />
                                        <p>:</p>
                                        <input
                                            id="port"
                                            onChange={e => setPort(e.target.value)}
                                            className={`${styles.inputs} ${styles.portInput}`}
                                            type="text"
                                            value={serverPort}
                                            placeholder={"Port (ex. 8080)"}
                                        />
                                    </div>
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
                                <div
                                    className={`${styles.configInputs} ${isInvalid("dns") || isInvalid("port") ? styles.invalid : ""}`}
                                    onAnimationEnd={() => clearInvalid("dns")}
                                >
                                    <p>{protocol}</p>
                                    <input
                                        id="name"
                                        onChange={e => setServerDns(e.target.value)}
                                        className={`${styles.inputs} ${styles.serverDnsInput}`}
                                        type="text"
                                        value={serverDns}
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