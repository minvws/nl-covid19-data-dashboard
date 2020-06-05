import styles from './maxWidth.module.scss';

export default function MaxWidth(props) {
  return <div className={styles.maxWidth}>{props.children}</div>;
}
