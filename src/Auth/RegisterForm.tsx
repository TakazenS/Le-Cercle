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
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [invalid, setInvalid] = useState<string[]>([]);

    const isInvalid = (field: string) => invalid.includes(field);

    const clearInvalid = (field: string) =>
        setInvalid(prev => prev.filter(f => f !== field));

    const reg = {
        name: /[^\p{L}\p{M}' -]/gu,
        emailChar: /[^a-zA-Z0-9._%+@-]/g,
        emailFormat: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        nickname: /[^\p{L}\p{M}\p{N}]/gu,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/,
        accessCode: /[^a-zA-Z0-9]/g,
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const missing: string[] = [];

        if (!firstName.trim() || firstName.length < 2 || reg.name.test(firstName)) {
            missing.push("firstName");
        }
        if (!lastName.trim() || lastName.length < 2 || reg.name.test(lastName)) {
            missing.push("lastName");
        }
        if (!email.trim() || !reg.emailFormat.test(email)) {
            missing.push("email");
        }
        if (!nickname.trim() || nickname.length < 2 || reg.nickname.test(nickname)) {
            missing.push("nickname");
        }
        if (!password.trim() || !reg.password.test(password)) {
            missing.push("password");
        }
        if (!confirmPassword.trim() || password !== confirmPassword) {
            missing.push("password");
            missing.push("confirmPassword");
        }
        if (!accessCode.trim() || accessCode.length < 8 || reg.accessCode.test(accessCode)) {
            missing.push("accessCode");
        }

        if (missing.length > 0) {
            setInvalid(missing);
            setError(null);
            return;
        }

        const validate = {
            email: email.trim().toLowerCase(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            nickname: nickname.trim().toLowerCase(),
            password: password,
            accessCode: accessCode.trim().toUpperCase(),
        }

        try {
            await register({
                email: validate.email,
                first_name: validate.firstName,
                last_name: validate.lastName,
                nickname: validate.nickname,
                password: validate.password,
                access_code: validate.accessCode,
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
                            className={`${styles.smallInput} ${isInvalid("firstName") ? styles.invalid : ""}`}
                            type="text"
                            placeholder="Jonh"
                            value={firstName}
                            onAnimationEnd={() => clearInvalid("firstName")}
                            onChange={e => setFirstName(e.target.value.replace(reg.name, "").slice(0, 128))}
                        />
                    </div>
                    <div className={styles.name}>
                        <label className={styles.label} htmlFor="lastName">LAST NAME</label>
                        <input
                            id={lastName}
                            className={`${styles.smallInput} ${isInvalid("lastName") ? styles.invalid : ""}`}
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onAnimationEnd={() => clearInvalid("lastName")}
                            onChange={e => setLastName(e.target.value.replace(reg.name, "").slice(0, 128))}
                        />
                    </div>
                </div>
                <label className={styles.label} htmlFor="email">EMAIL</label>
                <input
                    id={email}
                    className={`${styles.longInput} ${isInvalid("email") ? styles.invalid : ""}`}
                    type="text"
                    placeholder="example@example.com"
                    value={email}
                    onAnimationEnd={() => clearInvalid("email")}
                    onChange={e => setEmail(e.target.value.replace(reg.emailChar, "").slice(0, 256))}
                />
                <label className={styles.label} htmlFor="nickname">NICKNAME</label>
                <input
                    id={nickname}
                    className={`${styles.longInput} ${isInvalid("nickname") ? styles.invalid : ""}`}
                    type="text"
                    placeholder="Your nickname"
                    value={nickname}
                    onAnimationEnd={() => clearInvalid("nickname")}
                    onChange={e => setNickname(e.target.value.replace(reg.nickname, "").slice(0, 32))}
                />
                <label className={styles.label} htmlFor="password">PASSWORD</label>
                <input
                    id={password}
                    className={`${styles.longInput} ${isInvalid("password") ? styles.invalid : ""}`}
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onAnimationEnd={() => clearInvalid("password")}
                    onChange={e => setPassword(e.target.value)}
                />
                <input
                    id={confirmPassword}
                    className={`${styles.longInput} ${isInvalid("confirmPassword") ? styles.invalid : ""}`}
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onAnimationEnd={() => clearInvalid("confirmPassword")}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <label className={styles.label} htmlFor="accessCode">ACCESS CODE</label>
                <input
                    id={accessCode}
                    className={`${styles.longInput} ${isInvalid("accessCode") ? styles.invalid : ""}`}
                    type="text"
                    placeholder="A7DI9K2P"
                    value={accessCode}
                    onAnimationEnd={() => clearInvalid("accessCode")}
                    onChange={e => {setAccessCode(e.target.value.replace(reg.accessCode, "").slice(0, 8))}}
                />
                <button className={styles.submitBtn} type="submit">Register</button>
            </form>
            <div className={styles.switchBtn}>
                <p>Already have an account ? <button type="button" onClick={onSwitch}>Log In</button></p>
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
