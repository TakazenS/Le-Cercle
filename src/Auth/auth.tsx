import { createContext, ReactNode, useContext, useState } from "react";
import { LoginPayload, RegisterPayload } from "../models.ts";
import * as api from '../api.ts';
export interface AuthContextValue {
    token: string | null;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "le-cercle-session-token";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

    function saveToken(t: string) {
        localStorage.setItem(TOKEN_KEY, t);
        setToken(t);
    }

    async function login(payload: LoginPayload) {
        const res = await api.login(payload);
        saveToken(res.token);
    }

    async function register(payload: RegisterPayload) {
        const res = await api.register(payload);
        saveToken(res.token);
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: token !== null, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
