import styles from "./Auth.module.css";
import { useAuth } from "./AuthProvider.tsx";
import { useState } from "react";

interface Props {
    onSwitch: () => void;
}

export function LoginForm(props: Props) {
    const { onSwitch } = props
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
