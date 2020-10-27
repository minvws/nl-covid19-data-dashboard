import styles from './maxWidth.module.scss';

interface IProps {
  children: React.ReactNode;
}

export function MaxWidth(props: IProps) {
  const { children } = props;
  return <div className={styles.maxWidth}>{children}</div>;
}
