import styles from './styles.module.scss';

type IProps = {
  title?: string;
  value?: number;
  format?: (value?: number) => string;
  description?: string;
};

export function MetricKPI(props: IProps) {
  const { value, format, title, description } = props;

  return (
    <div className={styles.root}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.wrapper}>
        <p className={styles.value}>{format ? format(value) : value}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
