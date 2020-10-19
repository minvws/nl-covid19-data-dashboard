import styles from './styles.module.scss';

type IProps = {
  title?: string;
  value: number | null | undefined;
  format: (value: number | null | undefined) => string | false;
  description?: string;
};

export function MetricKPI(props: IProps) {
  const { value, format = false, title, description } = props;

  return (
    <div className={styles.root}>
      <p className={styles.title}>{title}</p>
      <div className={styles.wrapper}>
        <p className={styles.value}>{format ? format(value) : value}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
