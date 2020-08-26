import styles from './maxWidth.module.scss';
import { WithChildren } from 'types';

function MaxWidth({ children }: WithChildren) {
  return <div className={styles.maxWidth}>{children}</div>;
}

export default MaxWidth;
