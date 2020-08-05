import { FunctionComponent } from 'react';

import styles from './lastUpdated.module.scss';
import { long } from 'data/months';
import siteText from 'locale';

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);

  let hh = date.getHours().toString();
  if (hh.length === 1) hh = '0' + hh;

  let mm = date.getMinutes().toString();
  if (mm.length === 1) mm = '0' + mm;

  return `${hh}:${mm}, ${date.getDate()} ${
    long[date.getMonth()]
  } ${date.getFullYear()}`;
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toISOString();
};

type LastUpdatedProps = {
  lastUpdated?: number;
};

const LastUpdated: FunctionComponent<LastUpdatedProps> = (props) => {
  const { lastUpdated } = props;

  return (
    <p className={styles.text}>
      {lastUpdated ? (
        <>
          {siteText.laatst_bijgewerkt.message.translation}:{' '}
          <time dateTime={formatTimestamp(lastUpdated)}>
            {formatDate(lastUpdated)}
          </time>
        </>
      ) : (
        siteText.laatst_bijgewerkt.loading.translation
      )}
    </p>
  );
};

export default LastUpdated;
