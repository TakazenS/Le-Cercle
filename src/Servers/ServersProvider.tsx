import { Server } from "../models.ts";
import * as store from "./servers.ts";
import { createContext, ReactNode, useContext, useState } from "react";

interface ServersContextValue {
    servers: Server[],
    addServer: (url: string, name: string) => void;
}

const ServersContext = createContext<ServersContextValue | undefined>(undefined);

export function ServersProvider({ children }: { children: ReactNode}) {
    const [servers, setServers] = useState<Server[]>(() => store.listServers());

    function addServer(url: string, name: string) {
        store.addServer(url, name);
        setServers(store.listServers());
    }

    return (
        <ServersContext.Provider value={{ servers, addServer }}>
            {children}
        </ServersContext.Provider>
    );
}

export function useServers() {
    const ctx = useContext(ServersContext);
    if (!ctx) throw new Error("useServers must be used within ServersProvider");
    return ctx;
}
