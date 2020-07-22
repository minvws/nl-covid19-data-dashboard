import styles from './maxWidth.module.scss';

const MaxWidth: React.FC = (props) => {
  return <div className={styles.maxWidth}>{props.children}</div>;
};

export default MaxWidth;
