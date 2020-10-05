import styles from './metricValue.module.scss';

interface MetricValueProps {
  absolute: number;
  percentage?: number;
}

export function MetricValue({ absolute, percentage }: MetricValueProps) {
  return (
    <div className={styles.root}>
      <span>{absolute}</span>
      {percentage && <span>({percentage})</span>}
    </div>
  );
}
