import styles from "./ThemeToggle.module.css"
import { useTheme } from "./ThemeProvider.tsx";
import { FiMoon, FiSun } from "react-icons/fi";

export function ToggleTheme() {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <button
                type="button"
                className={styles.themeBtn}
                onClick={toggleTheme}
            >
                {theme === "dark" ? <FiSun size={25} /> : <FiMoon size={25} />}
            </button>
        </>
    )
}