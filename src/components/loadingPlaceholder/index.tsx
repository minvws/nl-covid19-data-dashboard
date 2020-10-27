import styles from './loadingPlaceholder.module.scss';

interface IProps {
  children: React.ReactNode;
}

export function LoadingPlaceholder(props: IProps) {
  const { children } = props;
  return (
    <span className={styles.loadingPlaceholder} aria-hidden="true">
      {children ? children : null}
    </span>
  );
}
