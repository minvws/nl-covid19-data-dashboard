import text from '~/locale/index';
import styles from '~/components/dataWarning/dataWarning.module.scss';
import Warning from '~/assets/warning.svg';

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
