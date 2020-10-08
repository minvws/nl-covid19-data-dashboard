import text from '~/locale/index';
import styles from '~/components/dataWarning/dataWarning.module.scss';
import Warning from '~/assets/warning.svg';

export function DataWarning() {
  return (
    <div className={styles.dataWarning}>
      <Warning />
      <p className={styles.dataWarningText}>{text.data_warning_text}</p>
    </div>
  );
}
