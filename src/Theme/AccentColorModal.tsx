import styles from "./AccentColorModal.module.css";
import { RgbaColorPicker } from "react-colorful";
import { accentToHex, accentToRgba, useTheme, PRESET_ACCENTS } from "./ThemeProvider.tsx";
import { useEffect } from "react";

interface Props {
    onClose: () => void;
}

export function AccentColorModal(props: Props) {
    const { onClose } = props;
    const { accent, setAccent, resetAccent } = useTheme();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

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
                        <p className={styles.label}>ACCENT COLOR</p>
                        <div className={styles.swatches}>
                            {PRESET_ACCENTS.map(preset => {
                                const selected = preset.r === accent.r && preset.g === accent.g && preset.b === accent.b;
                                return (
                                    <button
                                        key={accentToHex(preset)}
                                        type="button"
                                        className={`${styles.swatch} ${selected ? styles.selected : ""}`}
                                        style={{ backgroundColor: accentToRgba({ ...preset, a: 1 }) }}
                                        onClick={() => setAccent({ ...preset, a: accent.a })}
                                    />
                                );
                            })}
                        </div>

                    </div>
                    <div>
                        <p className={styles.label}>CUSTOM COLOR</p>
                        <div className={styles.customRow}>
                            <div className={styles.colorPicker}>
                                <RgbaColorPicker color={accent} onChange={setAccent} />
                            </div>
                        </div>
                    </div>
                    <button type="button" className={styles.resetBtn} onClick={resetAccent}>Reset</button>
                </div>
            </section>
        </>
    )
}