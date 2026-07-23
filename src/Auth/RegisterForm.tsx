import styles from "./Auth.module.css";
import { useAuth } from "./AuthProvider.tsx";
import { useState } from "react";
import { PasswordInput } from "./PasswordInput.tsx";
import { RxQuestionMarkCircled } from "react-icons/rx";

interface Props {
    onSwitch: () => void;
}

const reg = {
    name: /[^\p{L}\p{M}' -]/gu,
    emailChar: /[^a-zA-Z0-9._%+@-]/g,
    emailFormat: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    nickname: /[^\p{L}\p{M}\p{N}]/gu,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/,
    accessCode: /[^a-zA-Z0-9]/g,
}

export function RegisterForm(props: Props) {
    const { onSwitch } = props
    const { register } = useAuth();
    const [invalid, setInvalid] = useState<string[]>([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    const isInvalid = (field: string) => invalid.includes(field);

    const clearInvalid = (field: string) =>
        setInvalid(prev => prev.filter(f => f !== field));

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const missing: string[] = [];

        if (!firstName.trim() || firstName.length < 2 || firstName.length > 64) {
            missing.push("firstName");
        }
        if (!lastName.trim() || lastName.length < 2 || lastName.length > 64) {
            missing.push("lastName");
        }
        if (!email.trim() || email.length < 6 || email.length > 128 || !reg.emailFormat.test(email)) {
            missing.push("email");
        }
        if (!nickname.trim() || nickname.length < 2 || nickname.length > 32) {
            missing.push("nickname");
        }
        if (!password.trim() || confirmPassword !== password|| !reg.password.test(password)) {
            missing.push("password");
            missing.push("confirmPassword");
        }
        if (!accessCode.trim() || accessCode.length != 8) {
            missing.push("accessCode");
        }

        if (missing.length > 0) {
            setInvalid(missing)
            setError(null);
            return;
        }

        const validate = {
            email: email.trim().toLowerCase(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            pseuname: nickname.trim().toLowerCase(),
            password: password,
            accessCode: accessCode.trim().toUpperCase(),
        }

        try {
            await register({
                email: validate.email,
                first_name: validate.firstName,
                last_name: validate.lastName,
                pseudo: validate.pseuname,
                nickname: validate.pseuname,
                password: validate.password,
                access_code: validate.accessCode,
            });
            setError(null);
        } catch (err) {
            const message = (err as Error).message;
            setError(message);
            if ((message.toLowerCase().startsWith("email"))) {
                setInvalid(["email"]);
            } else if (message.toLowerCase().startsWith("nickname")) {
                setInvalid(["nickname"]);
            } else if (message.toLowerCase().includes("access code")) {
                setInvalid(["accessCode"])
            }
        }
    }

    return (
        <>
            <form className={styles.form} onSubmit={onSubmit}>
                <div className={styles.nameContainer}>
                    <div className={styles.name}>
                        <label className={styles.label} htmlFor="firstName">FIRST NAME</label>
                        <input
                            id="firstName"
                            className={`${styles.smallInput} ${isInvalid("firstName") ? styles.invalid : ""}`}
                            type="text"
                            placeholder="Jonh"
                            value={firstName}
                            onAnimationEnd={() => clearInvalid("firstName")}
                            onChange={e => setFirstName(e.target.value.replace(reg.name, "").slice(0, 64))}
                        />
                    </div>
                    <div className={styles.name}>
                        <label className={styles.label} htmlFor="lastName">LAST NAME</label>
                        <input
                            id="lastName"
                            className={`${styles.smallInput} ${isInvalid("lastName") ? styles.invalid : ""}`}
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onAnimationEnd={() => clearInvalid("lastName")}
                            onChange={e => setLastName(e.target.value.replace(reg.name, "").slice(0, 64))}
                        />
                    </div>
                </div>
                <label className={styles.label} htmlFor="email">EMAIL</label>
                <input
                    id="email"
                    className={`${styles.longInput} ${isInvalid("email") ? styles.invalid : ""}`}
                    type="text"
                    placeholder="example@example.com"
                    value={email}
                    onAnimationEnd={() => clearInvalid("email")}
                    onChange={e => setEmail(e.target.value.replace(reg.emailChar, "").slice(0, 128))}
                />
                <label
                    className={`${styles.label} ${styles.questionMarkLabel}`}
                    tabIndex={0}
                    htmlFor="nickname"
                >
                    NICKNAME
                    <span className={styles.tooltipWrapper}>
                        <RxQuestionMarkCircled className={styles.questionMark} size={15} />
                        <span className={styles.tooltip}>
                            <p>
                                This nickname is <span className={styles.important}>unique</span>,
                                it can only contain <span className={styles.important}>lower case letters</span> and <span className={styles.important}>numbers</span>.
                                While your account created, you'll be allowed to change it, but also customise
                                your visible nickname without restrictions.
                            </p>
                        </span>
                    </span>
                </label>
                <input
                    id="nickname"
                    className={`${styles.longInput} ${isInvalid("nickname") ? styles.invalid : ""}`}
                    type="text"
                    placeholder="Your nickname"
                    value={nickname}
                    onAnimationEnd={() => clearInvalid("nickname")}
                    onChange={e => setNickname(e.target.value.replace(reg.nickname, "").slice(0, 32))}
                />
                <label
                    className={`${styles.label} ${styles.questionMarkLabel}`}
                    tabIndex={0}
                    htmlFor="password"
                >
                    PASSWORD
                    <span className={styles.tooltipWrapper}>
                        <RxQuestionMarkCircled className={styles.questionMark} size={15} />
                        <span className={styles.tooltip}>
                            <p><strong>Your password have to contain :</strong></p>
                            <p>- At least <span className={styles.important}>12</span> character</p>
                            <p>- <span className={styles.important}>1</span> special character</p>
                            <p>- <span className={styles.important}>1</span> lower case letter</p>
                            <p>- <span className={styles.important}>1</span> upper case letter</p>
                            <p>- <span className={styles.important}>1</span> number</p>
                        </span>
                    </span>
                </label>
                <PasswordInput
                    id="password"
                    placeholder="Your password"
                    value={password}
                    onChange={setPassword}
                    className={`${styles.longInput} ${isInvalid("password") ? styles.invalid : ""}`}
                    onAnimationEnd={() => clearInvalid("password")}
                />
                <PasswordInput
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    className={`${styles.longInput} ${isInvalid("confirmPassword") ? styles.invalid : ""}`}
                    onAnimationEnd={() => clearInvalid("confirmPassword")}
                />
                <label className={styles.label} htmlFor="accessCode">ACCESS CODE</label>
                <input
                    id="accessCode"
                    className={`${styles.longInput} ${isInvalid("accessCode") ? styles.invalid : ""}`}
                    type="text"
                    placeholder="A7DI9K2P"
                    value={accessCode}
                    onAnimationEnd={() => clearInvalid("accessCode")}
                    onChange={e => {setAccessCode(e.target.value.replace(reg.accessCode, "").slice(0, 8).toUpperCase())}}
                />
                <button className={styles.submitBtn} type="submit">Register</button>
            </form>
            <div className={styles.switchBtn}>
                <p>Already have an account ? <button type="button" onClick={onSwitch}>Log In</button></p>
            </div>
            <div className={styles.errorContainer}>
                {error ? (
                    <p className={`${styles.errorLabel} ${isInvalid("email") || isInvalid("nickname") || isInvalid("accessCode") ? styles.invalid : ""}`}>
                        {error}
                    </p>
                ) : (
                    <p></p>
                )}
            </div>
        </>
    )
}
