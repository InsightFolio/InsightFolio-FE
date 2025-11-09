import { useForm } from 'react-hook-form';
import TextField from '../../components/form/TextField';
import PrimaryButton from '../../components/form/PrimaryButton';
import styles from './SignUpForm.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

type SignUpValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>();

  const navigate = useNavigate();

  const onSubmit = async (values: SignUpValues) => {
    try {
      
      const response = await axios.post('http://127.0.0.1:5000/signup', {
        username: values.username || '',
        email: values.email,
        password: values.password
      })

      console.log('Signup success:', response.data);
      navigate('/login');

    } catch (error) {
      console.error('Signup failed:', error)
    }
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <header className={styles.header}>
        <h1>Create an account</h1>
        <p>Enter your details below to create your account.</p>
      </header>

      <TextField
        label="Username (optional)"
        placeholder="johndoe"
        helperText="Leave blank to use your email as username."
        {...register('username')}
      />

      <TextField
        label="Email"
        type="email"
        placeholder="john@example.com"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email', {
          required: 'This field is mandatory',
          pattern: {
            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
            message: 'Enter a valid email address',
          },
        })}
      />

      <TextField
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password', {
          required: 'This field is mandatory',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
          pattern: {
            value: /[!@#$%^&*(),.?":{}|<>]/,
            message: 'Password must contain at least one special character',
          },
        })}
      />

      <TextField
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'This field is mandatory',
          validate: (value: string) =>
            value === watch('password') || 'Passwords must match',
        })}
      />

      <PrimaryButton type="submit" style={{ marginTop: '1.5rem' }} disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </PrimaryButton>

      <p className={styles.footer}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
};

export default SignUpForm;
