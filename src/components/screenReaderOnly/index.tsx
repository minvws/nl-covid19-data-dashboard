import styles from './screenReaderOnly.module.scss';
import { WithChildren } from 'types';

/**
 * A small utility component that renders text which is only
 * present for visually impaired users, alias it will be read out
 * loud by screenreaders without being visible on the screen.
 */
export function ScreenReaderOnly({ children }: WithChildren) {
  return <span className={styles.screenReaderOnly}>{children}</span>;
}
