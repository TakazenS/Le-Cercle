import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./PasswordInput.module.css";

interface PropsPasswordInputs {
    id: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    onAnimationEnd?: () => void;
}

export function PasswordInput(props: PropsPasswordInputs) {
    const { id, placeholder, value, onChange, className, onAnimationEnd } = props;
    const [show, setShow] = useState(false);

    return (
        <div className={styles.passwordWrapper}>
            <input
                id={id}
                className={className}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                onAnimationEnd={onAnimationEnd}
            />
            <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShow(v => !v)}
                aria-label={show ? "Hide password" : "Show password"}
            >
                {show ? <FiEye size={22} /> : <FiEyeOff size={22} />}
        </button>
        </div>
);
}