import styles from './loadingPlaceholder.module.scss';
import { WithChildren } from 'types';

export function LoadingPlaceholder({ children }: WithChildren) {
  return (
    <span className={styles.loadingPlaceholder} aria-hidden="true">
      {children ? children : null}
    </span>
  );
}
