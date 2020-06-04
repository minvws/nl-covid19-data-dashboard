import styles from './lastUpdated.module.scss';
import {long} from "data/months";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  let hh = date.getHours().toString();
  if (hh.length === 1) hh = '0' + hh;

  let mm = date.getMinutes().toString();
  if (mm.length === 1) mm = '0' + mm;

  return `${hh}:${mm}, ${date.getDate()} ${long[date.getMonth()]} ${date.getFullYear()}`;
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString();
}

export default function LastUpdated(props) {
  const {lastUpdated} = props;

  return (
    <p className={styles.text}>
      {lastUpdated ? (<>Laatst bijgewerkt: <time datetime={formatTimestamp(lastUpdated)}>{formatDate(lastUpdated)}</time></>) : null}
    </p>
  );
}
