import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import { LoginPayload, RegisterPayload } from "../models.ts";
import * as api from '../api.ts';
export interface AuthContextValue {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => api.getToken());
    const [isLoading, setIsLoading] = useState(true);

    function saveToken(t: string) {
        api.setToken(t);
        setToken(t);
    }

    function logout() {
        api.clearToken();
        setToken(null);
    }

    useEffect(() => {
        api.setOnUnauthorized(() => logout());
    }, []);

    useEffect(() => {
        if (!api.getToken()) {
            setIsLoading(false);
            return;
        }
        api.getMe()
            .catch(() => { /* Ignore */ })
            .finally(() => setIsLoading(false));
    }, []);

    async function login(payload: LoginPayload) {
        const res = await api.login(payload);
        saveToken(res.token);
    }

    async function register(payload: RegisterPayload) {
        const res = await api.register(payload);
        saveToken(res.token);
    }
    return (
        <AuthContext.Provider value={{ token, isAuthenticated: token !== null, isLoading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
