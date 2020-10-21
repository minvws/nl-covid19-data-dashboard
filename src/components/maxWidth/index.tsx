import { WithChildren } from '~/types/index';
import styles from './maxWidth.module.scss';

export function MaxWidth({ children }: WithChildren) {
  return <div className={styles.maxWidth}>{children}</div>;
}
