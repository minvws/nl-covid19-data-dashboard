import { FunctionComponent } from 'react';

import styles from './lastUpdated.module.scss';
import siteText from 'locale';
import formatDate from 'utils/formatDate';

type LastUpdatedProps = {
  lastUpdated?: number;
};

const LastUpdated: FunctionComponent<LastUpdatedProps> = (props) => {
  const { lastUpdated } = props;

  return (
    <p className={styles.text}>
      {lastUpdated ? (
        <>
          {siteText.laatst_bijgewerkt.message}:{' '}
          <time dateTime={formatDate(lastUpdated, 'iso')}>
            {formatDate(lastUpdated, 'long')}
          </time>
        </>
      ) : (
        siteText.laatst_bijgewerkt.loading
      )}
    </p>
  );
};

export default LastUpdated;
