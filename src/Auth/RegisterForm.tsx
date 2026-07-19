import styles from "./Auth.module.css";
import { useAuth } from "./AuthProvider.tsx";
import { useState } from "react";

interface Props {
    onSwitch: () => void;
}

export function RegisterForm(props: Props) {
    const { onSwitch } = props
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
                <button className={styles.submitBtn} type="submit">Register</button>
            </form>
            <div className={styles.switchBtn}>
                <p>Already have an account ? <button type="button" onClick={onSwitch}>Login</button></p>
            </div>
            <div className={styles.errorContainer}>
                {error &&
                    <p className={styles.errorLabel}>
                        {error}
                    </p>
                }
            </div>
        </>
    )
}
