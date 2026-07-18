import { Server } from "../models.ts";
import * as store from "./servers.ts";
import { createContext, ReactNode, useContext, useState } from "react";

interface ServersContextValue {
    servers: Server[],
    selectedId: string | null;
    currentServer: Server | null;
    addServer: (url: string, name: string) => void;
    updateServer: (id: string, patch: Partial<Pick<Server, "name" | "url">>) => void;
    selectServer: (id: string) => void;
}

const ServersContext = createContext<ServersContextValue | undefined>(undefined);

export function ServersProvider({ children }: { children: ReactNode}) {
    const [servers, setServers] = useState<Server[]>(() => store.listServers());
    const [selectedId, setSelectedId] = useState<string | null>(() => store.getSelectedId());

    function addServer(url: string, name: string) {
        store.addServer(url, name);
        setServers(store.listServers());
        setSelectedId(store.getSelectedId);
    }

    function updateServer(id: string, patch: Partial<Pick<Server, "name" | "url">>) {
        store.updateServer(id, patch);
        // setSelectedId(id);
    }

    function selectServer(id: string) {
        store.selectServer(id);
        setSelectedId(id);
    }

    const currentServer = servers.find(s => s.id === selectedId) ?? null;

    return (
        <ServersContext.Provider value={{ servers, selectedId, currentServer, addServer, updateServer, selectServer }}>
            {children}
        </ServersContext.Provider>
    );
}

export function useServers() {
    const ctx = useContext(ServersContext);
    if (!ctx) throw new Error("useServers must be used within ServersProvider");
    return ctx;
}
