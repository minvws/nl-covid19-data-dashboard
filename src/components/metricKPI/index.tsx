import styles from './styles.module.scss';

type IProps = {
  label?: string;
  value: number | null | undefined;
  format: any | false;
  description?: string;
};

export function MetricKPI(props: IProps) {
  const { value, format, label, description } = props;

  return (
    <div className={styles.root}>
      <p className={styles.label}>{label}</p>
      <div className={styles.wrapper}>
        <p className={styles.value}>{format ? format(value) : value}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
