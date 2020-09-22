import styles from './maxWidth.module.scss';
import { WithChildren } from '~/types/index';

export function MaxWidth({ children }: WithChildren) {
  return <div className={styles.maxWidth}>{children}</div>;
}
