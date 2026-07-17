import styles from "./ServerLink.module.css";
import { useState } from "react";
import { setUrl } from "../lib.ts";

interface Props {
    onClose: () => void;
}

export function ServerLink(props: Props) {
    const { onClose } = props;
    const [ip, setIp] = useState<boolean>(true);
    const [protocol, setProtocol] = useState<string>("http://");
    const [serverIp, setServerIp] = useState<string>("127.0.0.1");
    const [port, setPort] = useState<string>("8080");
    const [serverDns, setServerDns] = useState<string>("");

    let serverIpUrl = `${protocol}${serverIp}:${port}`;
    let serverDnsUrl = `${protocol}${serverDns}`;

    function submit(url: string) {
        setUrl(url);
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
                    <p>Connect to the server.</p>
                </div>
                <div className={styles.card}>
                    <h3>Configure server connexion</h3>
                    <div className={styles.btnContainer}>
                        <button
                            className={styles.btn}
                            onClick={_ => {
                                setProtocol("http://");
                            }}
                        >
                            http
                        </button>
                        <p className={styles.orSign}>or</p>
                        <button
                            className={styles.btn}
                            onClick={_ => {
                                setProtocol("https://");
                            }}
                        >
                            https
                        </button>
                    </div>

                    <span className={styles.largeSeparator}></span>

                    <div className={styles.btnContainer}>
                        <button
                            className={styles.btn}
                            onClick={_ => {
                                setIp(true);
                            }}
                        >
                            Server IP
                        </button>
                        <p className={styles.orSign}>or</p>
                        <button
                            className={styles.btn}
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
                                    <input onChange={e => setServerIp(e.target.value)} type="text" placeholder={"Server IP (ex. 172.0.0.1)"}/>
                                    <p>:</p>
                                    <input onChange={e => setPort(e.target.value)} type="text" placeholder={"Port (ex. 8080)"}/>
                                </div>
                                <button
                                    onClick={() => (
                                        submit(serverIpUrl)
                                    )}
                                >
                                    Submit
                                </button>
                            </>
                        ) : (
                            <>
                                <div className={styles.configInputs}>
                                    <p>{protocol}</p>
                                    <input onChange={e => setServerDns(e.target.value)} type="text" placeholder={"Server Name (ex. le-cercle.com)"}/>
                                </div>
                                <button
                                    onClick={() => (
                                        submit(serverDnsUrl)
                                    )}
                                >
                                    Submit
                                </button>
                            </>
                        )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}