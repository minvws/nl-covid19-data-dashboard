import styles from './loadingPlaceholder.module.scss';

interface LoadingPlaceholderProps {
  children: React.ReactNode;
}

export function LoadingPlaceholder(props: LoadingPlaceholderProps) {
  const { children } = props;
  return (
    <span className={styles.loadingPlaceholder} aria-hidden="true">
      {children ? children : null}
    </span>
  );
}
