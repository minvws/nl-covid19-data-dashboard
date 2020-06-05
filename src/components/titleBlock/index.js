import styles from './titleBlock.module.scss';

export default function TitleBlock(props) {
  const { Icon, title, children } = props;

  return (
    <div className={styles.titleRow}>
      <Icon />
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
