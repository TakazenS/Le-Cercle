import { RegisterPayload, LoginPayload, AuthResponse } from "./models.ts";
import { getSelectedUrl } from "./Servers/servers.ts";

export async function postJson<T>(path: string, body: unknown): Promise<T> {
    const apiUrl = getSelectedUrl()
    if (!apiUrl) {
        throw new Error("No server selected !");
    }
    const res = await fetch(`${apiUrl}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new Error(await res.text());
    }
    return await res.json() as Promise<T>;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    return postJson<AuthResponse>("/register", payload);
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
    return postJson<AuthResponse>("/login", payload);
}
