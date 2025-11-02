import { ReactNode } from 'react';
import styles from './CenteredPage.module.css';

type CenteredPageProps = {
  children: ReactNode;
};

const CenteredPage = ({ children }: CenteredPageProps) => (
  <div className={styles.page}>{children}</div>
);

export default CenteredPage;
