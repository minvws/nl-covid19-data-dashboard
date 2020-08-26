import styles from './maxWidth.module.scss';
import { WithChildren } from 'types';

export default MaxWidth;

function MaxWidth({ children }: WithChildren) {
  return <div className={styles.maxWidth}>{children}</div>;
}
