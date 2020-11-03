import Warning from '~/assets/warning.svg';
import styles from '~/components/dataWarning/dataWarning.module.scss';
import text from '~/locale/index';

export function DataWarning() {
  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <Warning />
      </div>
      <p className={styles.text}>{text.data_warning_text}</p>
    </div>
  );
}
