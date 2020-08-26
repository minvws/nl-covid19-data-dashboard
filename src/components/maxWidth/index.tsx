import { WithChildren } from 'types';
import styles from './maxWidth.module.scss';

function MaxWidth({ children }: WithChildren) {
  return <div className={styles.maxWidth}>{children}</div>;
}

export default MaxWidth;
