import { WithChildren } from '~/types/index';
import styles from './loadingPlaceholder.module.scss';

export function LoadingPlaceholder({ children }: WithChildren) {
  return (
    <span className={styles.loadingPlaceholder} aria-hidden="true">
      {children ? children : null}
    </span>
  );
}
