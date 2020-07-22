import styles from './screenReaderOnly.module.scss';

/**
 * A small utility component that renders text which is only
 * present for visually impaired users, alias it will be read out
 * loud by screenreaders without being visible on the screen.
 */
const ScreenReaderOnly: React.FC = ({ children }) => {
  return <span className={styles.screenReaderOnly}>{children}</span>;
};

export default ScreenReaderOnly;
