import styles from "./Auth.module.css";
import { useState } from "react";
import { LoginForm } from "./LoginForm.tsx";
import { RegisterForm } from "./RegisterForm.tsx";

export function AuthScreen() {
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <>
            <section className={styles.connexionSection}>
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