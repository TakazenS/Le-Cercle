import { RegisterPayload, LoginPayload, AuthResponse, MeResponse } from "./models.ts";
import { getSelectedUrl } from "./Servers/servers.ts";

const TOKEN_KEY = "user-session-token";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(cb: () => void) { onUnauthorized = cb; }

interface RequestOptions {
    method: "GET" | "POST";
    body?: unknown;
    auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions): Promise<T> {
    const apiUrl = getSelectedUrl();
    if (!apiUrl) throw new Error("No server selected !");

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (options.auth) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${apiUrl}${path}`, {
        method: options.method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (options.auth && res.status === 401) {
        onUnauthorized?.();
        throw new Error("Session expired !");
    }
    if (!res.ok) throw new Error(await res.text());
    return await res.json() as Promise<T>;
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
    return request<AuthResponse>("/register", { method: "POST", body: payload });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
    return request<AuthResponse>("/login", { method: "POST", body: payload });
}

export function getMe(): Promise<MeResponse> {
    return request<MeResponse>("/me", { method: "GET", auth: true });
}
