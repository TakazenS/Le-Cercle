import { Server } from "../models.ts";

const SERVERS_KEY = "servers-list";

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
    return server;
}

export function listServers(): Server[] {
    return readServers();
}
