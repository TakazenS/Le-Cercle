import styles from "./Auth.module.css";
import { useState } from "react";
import { LoginForm } from "./LoginForm.tsx";
import { RegisterForm } from "./RegisterForm.tsx";

interface Props {
    modalOpen: boolean;
}

export function AuthScreen(props: Props) {
    const { modalOpen } = props;
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <>
            <section className={styles.connexionSection} inert={modalOpen}>
                <div className={styles.abstract}>
                    <h1>Le Cercle</h1>
                    {mode === "login" ? (
                        <p>Happy to see you.</p>
                    ) : (
                        <p>Create your account.</p>
                    )}
                </div>
                <div>{mode === "login" ? (
                    <LoginForm onSwitch={() => setMode("register")} />
                ) : (
                    <RegisterForm onSwitch={() => setMode("login")} />
                )}
                </div>
            </section>
        </>
    )
}