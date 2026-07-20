import styles from "./ThemeModal.module.css";
import { useTheme } from "./ThemeProvider.tsx";
import { FiSun, FiMoon } from "react-icons/fi";

interface Props {
    onClose: () => void;
}

export function ThemeModal(props: Props) {
    const { onClose } = props;
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <section
                className={styles.themeSection}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        e.stopPropagation();
                        onClose();
                    }
                }}
            >
                <div className={styles.abstract}>
                    <h1>Le Cercle</h1>
                    <p>Customise your application.</p>
                </div>
                <div className={styles.card}>
                    <div>
                        <p className={styles.label}>TOGGLE THEME</p>
                        <button
                            type="button"
                            className={styles.themeBtn}
                            onClick={toggleTheme}
                        >
                            {theme === "dark" ? <FiSun size={25} /> : <FiMoon size={25} />}
                        </button>
                    </div>
                    <div>
                        <p className={styles.label}>ACCENT COLOR</p>
                    </div>
                </div>
            </section>
        </>
    )
}