import styles from './lastUpdated.module.scss';
import siteText from 'locale';
import formatDate from 'utils/formatDate';

type LastUpdatedProps = {
  lastUpdated?: number;
  loadingText?: string | null;
};

export default LastUpdated;

function LastUpdated(props: LastUpdatedProps) {
  const { lastUpdated, loadingText } = props;

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
        loadingText || siteText.laatst_bijgewerkt.loading
      )}
    </p>
  );
}
