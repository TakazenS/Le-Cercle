import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
const THEME_KEY = "user-theme";
const ACCENT_KEY = "user-accent";

export interface Accent {
    r: number;
    g: number;
    b: number;
    a: number;
}

export const DEFAULT_ACCENT: Accent = { r: 149, g: 99, b: 237, a: 1 };

export const PRESET_ACCENTS: Accent[] = [
    DEFAULT_ACCENT,                      // purple
    { r: 222, g: 124,  b: 191,  a: 1 },  // rose
    { r: 250, g: 134,  b: 20,   a: 1 },  // orange
    { r: 77,  g: 107,  b: 254,  a: 1 },  // blue
    { r: 52,  g: 147,  b: 64,   a: 1 },  // green
    { r: 220, g: 190,  b: 60,   a: 1 },  // yellow
];

export function accentToRgba({ r, g, b, a }: Accent, alphaOverride?: number): string {
    return `rgba(${r}, ${g}, ${b}, ${alphaOverride ?? a})`;
}

export function accentToHex({ r, g, b }: Accent): string {
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    accent: Accent;
    setAccent: (accent: Accent) => void;
    setAccentRgb: (hex: string) => void;
    resetAccent: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [accent, setAccent] = useState<Accent>(getInitialAccent);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    function toggleTheme() {
        setTheme(t => (t === "dark" ? "light" : "dark"));
    }

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--color-accent", accentToRgba(accent, 1));
        root.style.setProperty("--color-accent-50", accentToRgba(accent, 0.5));
        localStorage.setItem(ACCENT_KEY, JSON.stringify(accent));
    }, [accent]);

    function getInitialAccent(): Accent {
        const saved = localStorage.getItem(ACCENT_KEY);
        if (saved) {
            try {
                const p = JSON.parse(saved) as Accent;
                if (typeof p.r === "number" && typeof p.a === "number") return p;
            } catch { /* Ignore */ }
        }
        return DEFAULT_ACCENT;
    }

    function setAccentRgb(hex: string) {
        setAccent(a => ({ ...a, ...hexToRgb(hex) }));
    }

    function resetAccent() {
        setAccent(DEFAULT_ACCENT);
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent, setAccentRgb, resetAccent }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
