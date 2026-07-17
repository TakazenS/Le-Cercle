import styles from "./AuthScreen.module.css";
import { useState } from "react";
import { useAuth } from "./auth.tsx";

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await login({
                email,
                password
            });
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <>
            <form className={styles.form} onSubmit={onSubmit}>
                <label className={styles.label} htmlFor="email">EMAIL</label>
                <input
                    id="email"
                    className={styles.longInput}
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label className={styles.label} htmlFor="password">PASSWORD</label>
                <input
                    id="password"
                    className={styles.longInput}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div className={styles.errorContainer}>
                {error &&
                    <p className={styles.errorLabel}>
                        {error}
                    </p>
                }
                </div>
                <button className={styles.submitBtn} type="submit">Log In</button>
            </form>
            <div className={styles.switchBtn}>
                <p>No account yet ? <button type="button" onClick={onSwitch}>Create account</button></p>
            </div>
        </>
    )
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
    const { register } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await register({
                email,
                first_name: firstName,
                last_name: lastName,
                nickname, password,
                access_code: accessCode
            });
            setError(null);
        } catch (err) {
            setError((err as Error).message);
        }
    }

    return (
        <>
            <form className={styles.form} onSubmit={onSubmit}>
                <div className={styles.nameContainer}>
                    <div className={styles.name}>
                        <label className={styles.label} htmlFor="firstName">FIRST NAME</label>
                        <input
                            id={firstName}
                            className={styles.smallInput}
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className={styles.name}>
                        <label className={styles.label} htmlFor="lastName">LAST NAME</label>
                        <input
                            id={lastName}
                            className={styles.smallInput}
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <label className={styles.label} htmlFor="email">EMAIL</label>
                <input
                    id={email}
                    className={styles.longInput}
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label className={styles.label} htmlFor="nickname">NICKNAME</label>
                <input
                    id={nickname}
                    className={styles.longInput}
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                />
                <label className={styles.label} htmlFor="password">PASSWORD</label>
                <input
                    id={password}
                    className={styles.longInput}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <label className={styles.label} htmlFor="accessCode">ACCESS CODE</label>
                <input
                    id={accessCode}
                    className={styles.longInput}
                    type="text"
                    placeholder="Access code"
                    value={accessCode}
                    onChange={e => setAccessCode(e.target.value)}
                />
                <div className={styles.errorContainer}>
                {error &&
                    <p className={styles.errorLabel}>
                        {error}
                    </p>
                }
                </div>
                <button className={styles.submitBtn} type="submit">Register</button>
            </form>
            <div className={styles.switchBtn}>
                <p>Already have an account ? <button type="button" onClick={onSwitch}>Login</button></p>
            </div>
        </>
    )
}

export function AuthScreen() {
    const [mode, setMode] = useState<"login" | "register">("login");

    return mode === "login"
        ? (
            <>
                <section className={styles.connexionSection}>
                    <div className={styles.abstract}>
                        <h1>Le Cercle</h1>
                        <p>Happy to see you.</p>
                    </div>
                    <div className={styles.loginCard}>
                        <LoginForm onSwitch={() => setMode("register")} />
                    </div>
                </section>
            </>
        ) : (
            <>
                <section className={styles.connexionSection}>
                    <div className={styles.abstract}>
                        <h1>Le Cercle</h1>
                        <p>You need the server access code.</p>
                    </div>
                    <div className={styles.registerCard}>
                        <RegisterForm onSwitch={() => setMode("login")} />
                    </div>
                </section>
            </>
        )
}