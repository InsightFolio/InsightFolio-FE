import { InputHTMLAttributes, useId, forwardRef } from 'react';
import styles from './TextField.module.css';

type TextFieldProps = {
  label: string;
  helperText?: string;
  error?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, error, id, name, type = 'text', ...inputProps }, ref) => {
    const generatedId = useId();
    const inputId = id ?? name ?? generatedId;

    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          name={name}
          type={type}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          ref={ref}
          {...inputProps}
        />
        {helperText && (
          <p className={`${styles.helper} ${error ? styles.helperError : ''}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
