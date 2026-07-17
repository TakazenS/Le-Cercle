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
            <form className={styles.loginForm} onSubmit={onSubmit}>
                <label className={styles.emailLabel} htmlFor="email">EMAIL</label>
                <input
                    id="email"
                    className={styles.emailInput}
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label className={styles.passwordLabel} htmlFor="password">PASSWORD</label>
                <input
                    id="password"
                    className={styles.passwordInput}
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
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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
        <form onSubmit={onSubmit}>
            <label htmlFor="email">EMAIL</label>
            <input
                id={email}
                type="text"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="firstName">FIRST NAME</label>
            <input
                id={firstName}
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />
            <label htmlFor="lastName">LAST NAME</label>
            <input
                id={lastName}
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />
            <label htmlFor="nickname">NICKNAME</label>
            <input
                id={nickname}
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
            />
            <label htmlFor="password">PASSWORD</label>
            <input
                id={password}
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <label htmlFor="accessCode">ACCESS CODE</label>
            <input
                id={accessCode}
                type="text"
                placeholder="Access code"
                value={accessCode}
                onChange={e => setAccessCode(e.target.value)}
            />
            {error &&
                <p style={{ color: "red" }}>
                    {error}
                </p>
            }
            <button type="submit">Register</button>
            <button type="button" onClick={onSwitch}>Login</button>
        </form>
    )
}

export function AuthScreen() {
    const [mode, setMode] = useState<"login" | "register">("login");
    return mode === "login"
        ? (
            <main>
                <section className={styles.loginSection}>
                    <div className={styles.abstract}>
                        <h1>Le Cercle</h1>
                        <p>Happy to see you.</p>
                    </div>
                    <div className={styles.loginCard}>
                        <LoginForm onSwitch={() => setMode("register")} />
                    </div>
                </section>
            </main>
        )
        : <RegisterForm onSwitch={() => setMode("login")} />
}