import styles from './maxWidth.module.scss';

interface MaxWidthProps {
  children: React.ReactNode;
}

export function MaxWidth(props: MaxWidthProps) {
  const { children } = props;
  return <div className={styles.maxWidth}>{children}</div>;
}
