import { Server } from "../models.ts";

const SERVERS_KEY = "servers-list";
const SELECTED_SERVER_KEY = "selected-server";

function readServers(): Server[] {
    const raw = localStorage.getItem(SERVERS_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeServers(servers: Server[]) {
    localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));
}

export function addServer(url: string, name: string): Server {
    const server: Server = {
        id: crypto.randomUUID(),
        name: name.trim(),
        url,
    };
    const servers = readServers();
    servers.push(server);
    writeServers(servers);
    selectServer(server.id);
    return server;
}

export function listServers(): Server[] {
    return readServers();
}

/*========Server Selection========*/

export function selectServer(id: string) {
    localStorage.setItem(SELECTED_SERVER_KEY, id);
}

export function getSelectedId(): string | null {
    return localStorage.getItem(SELECTED_SERVER_KEY);
}

export function getSelectedServer(): Server | null {
    const id = getSelectedId();
    if (!id) return null;
    return readServers().find(s => s.id === id) ?? null;
}

export function getSelectedUrl(): string | null {
    return getSelectedServer()?.url ?? null;
}
