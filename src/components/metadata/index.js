import { useMemo } from 'react';
import styles from './metadata.module.scss';

import { long } from 'data/months';

const formatDateShort = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${long[date.getMonth()]}`;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${long[date.getMonth()]} ${date.getFullYear()}`;
};

export default function Metadata(props) {
  const { dataSource, lastUpdated, period } = props;

  const { start, end } = useMemo(() => {
    let start, end;

    if (period) {
      const timestamps = period
        .map((el) => parseInt(el) * 1000)
        .sort((a, b) => a - b);

      start = timestamps[0];
      end = timestamps[timestamps.length - 1];
    }

    return { start, end };
  }, [period]);

  return (
    <div className={styles.metadataContainer}>
      {start && end ? (
        <p>
          Periode: {formatDateShort(start)} – {formatDate(end)}
        </p>
      ) : null}
      {lastUpdated ? (
        <p>Wanneer gerapporteerd: {formatDate(lastUpdated)}</p>
      ) : null}
      {dataSource ? (
        <p>
          Bron data: <a href={dataSource.href}>{dataSource.text}</a>
        </p>
      ) : null}
    </div>
  );
}
