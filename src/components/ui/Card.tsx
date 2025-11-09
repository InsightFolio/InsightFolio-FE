import { ReactNode } from 'react';
import styles from './Card.module.css';

type CardProps = {
  children: ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => (
  <div className={className ? `${styles.card} ${className}` : styles.card}>{children}</div>
);

export default Card;
