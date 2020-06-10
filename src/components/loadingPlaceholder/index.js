import styles from './loadingPlaceholder.module.scss';

export default function LoadingPlaceholder({ width, children }) {
  return (
    <span className={styles.loadingPlaceholder} aria-hidden="true">
      {children ? children : null}
    </span>
  );
}
