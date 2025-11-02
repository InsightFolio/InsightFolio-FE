import { InputHTMLAttributes, useId } from 'react';
import styles from './TextField.module.css';

type TextFieldProps = {
  label: string;
  helperText?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextField = ({ label, helperText, id, name, type = 'text', ...inputProps }: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input id={inputId} name={name} type={type} className={styles.input} {...inputProps} />
      {helperText && <p className={styles.helper}>{helperText}</p>}
    </div>
  );
};

export default TextField;
