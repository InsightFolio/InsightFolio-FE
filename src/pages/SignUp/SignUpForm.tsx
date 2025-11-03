import TextField from '../../components/form/TextField';
import PrimaryButton from '../../components/form/PrimaryButton';
import styles from './SignUpForm.module.css';
import { Link } from 'react-router-dom';

const SignUpForm = () => (
  <form className={styles.form} noValidate>
    <header className={styles.header}>
      <h1>Create an account</h1>
      <p>Enter your details below to create your account.</p>
    </header>

    <TextField
      label="Username (optional)"
      name="username"
      placeholder="johndoe"
      helperText="Leave blank to use your email as username."
    />

    <TextField
      label="Email"
      name="email"
      type="email"
      placeholder="john@example.com"
      autoComplete="email"
    />

    <TextField
      label="Password"
      name="password"
      type="password"
      placeholder="••••••••"
      autoComplete="new-password"
    />

    <TextField
      label="Confirm Password"
      name="confirmPassword"
      type="password"
      placeholder="••••••••"
      autoComplete="new-password"
    />

    <PrimaryButton type="button" style={{ marginTop: "1.5rem" }}>Sign Up</PrimaryButton>

    <p className={styles.footer}>
      Already have an account? <Link to="/login">Log in</Link>
    </p>
  </form>
);

export default SignUpForm;
