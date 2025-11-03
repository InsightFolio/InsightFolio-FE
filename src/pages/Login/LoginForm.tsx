import TextField from "../../components/form/TextField";
import PrimaryButton from "../../components/form/PrimaryButton";
import styles from './LoginForm.module.css';
import { Link } from "react-router-dom";

const LoginForm = () => (
    <form className={styles.form} noValidate>
        <header className={styles.header}>
            <h1>Log in to your account</h1>
        </header>

        <TextField
            label="Username (or Email)"
            name="username"
            placeholder="john@example.com"
        />

        <TextField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
        />

        <PrimaryButton type="button" style={{ marginTop: "1.5rem" }}>Log In</PrimaryButton>

        <p className={styles.footer}>
            Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
    </form>
);

export default LoginForm;