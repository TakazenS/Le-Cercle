import styles from "./AccentColorModal.module.css";

interface Props {
    onClose: () => void;
}

export function AccentColorModal(props: Props) {
    const { onClose } = props;

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
                    </div>
                    <p>Comming soon</p>
                </div>
            </section>
        </>
    )
}