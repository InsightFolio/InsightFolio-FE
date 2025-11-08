import { useForm } from 'react-hook-form';
import TextField from '../../components/form/TextField';
import PrimaryButton from '../../components/form/PrimaryButton';
import styles from './LoginForm.module.css';
import { Link } from 'react-router-dom';

type LoginValues = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>();

  const onSubmit = async (values: LoginValues) => {
    // TODO: Call your API here
    console.log('Login values:', values);
    // Example: await login(values);
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <header className={styles.header}>
        <h1>Log in to your account</h1>
      </header>

      <TextField
        label="Username (or Email)"
        placeholder="john@example.com"
        error={!!errors.username}
        helperText={errors.username?.message}
        {...register('username', {
          required: 'This field is mandatory',
        })}
      />

      <TextField
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password', {
          required: 'This field is mandatory',
        })}
      />

      <PrimaryButton type="submit" style={{ marginTop: '1.5rem' }} disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </PrimaryButton>

      <p className={styles.footer}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
};

export default LoginForm;