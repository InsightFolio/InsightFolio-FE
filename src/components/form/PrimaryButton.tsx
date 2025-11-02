import { ButtonHTMLAttributes } from 'react';
import styles from './PrimaryButton.module.css';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton = ({ type = 'button', children, ...buttonProps }: PrimaryButtonProps) => (
  <button type={type} className={styles.button} {...buttonProps}>
    {children}
  </button>
);

export default PrimaryButton;
