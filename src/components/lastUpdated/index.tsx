import { FunctionComponent } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';

import styles from './lastUpdated.module.scss';

type LastUpdatedProps = {
  lastUpdated?: number;
};

const LastUpdated: FunctionComponent<LastUpdatedProps> = (props) => {
  const { lastUpdated } = props;

  /** Easier to do this manually than hack around in react-intl
   *  Especially because this should always return the same format,
   *  ignoring the current locale
   */
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    let hh = date.getHours().toString();
    if (hh.length === 1) hh = '0' + hh;

    let mm = date.getMinutes().toString();
    if (mm.length === 1) mm = '0' + mm;

    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${hh}:${mm},`;
  };

  return (
    <p className={styles.text}>
      {lastUpdated ? (
        <>
          Laatst bijgewerkt: <FormattedTime value={lastUpdated} />
          {', '}
          <time dateTime={formatDate(lastUpdated)}>
            <FormattedDate
              value={lastUpdated}
              day="numeric"
              month="long"
              year="numeric"
            />
          </time>
        </>
      ) : null}
    </p>
  );
};

export default LastUpdated;
