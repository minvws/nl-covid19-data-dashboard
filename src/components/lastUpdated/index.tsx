import { FunctionComponent } from 'react';

import styles from './lastUpdated.module.scss';
import siteText from 'locale';
import formatDate from 'utils/formatDate';

type LastUpdatedProps = {
  lastUpdated?: number | string;
  loadingText?: string | null;
};

const LastUpdated: FunctionComponent<LastUpdatedProps> = (props) => {
  const { lastUpdated, loadingText } = props;

  let parsedLastUpdated = lastUpdated;
  if (typeof parsedLastUpdated === 'string') {
    parsedLastUpdated = parseInt(parsedLastUpdated, 10);
  }

  return (
    <p className={styles.text}>
      {parsedLastUpdated ? (
        <>
          {siteText.laatst_bijgewerkt.message}:{' '}
          <time dateTime={formatDate(parsedLastUpdated, 'iso')}>
            {formatDate(parsedLastUpdated, 'long')}
          </time>
        </>
      ) : (
        loadingText || siteText.laatst_bijgewerkt.loading
      )}
    </p>
  );
};

export default LastUpdated;
