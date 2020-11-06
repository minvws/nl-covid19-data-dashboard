import Warning from '~/assets/warning.svg';
import styles from '~/components/dataWarning/dataWarning.module.scss';

type DataWarningProps = {
  text: string;
};

export function DataWarning({ text }: DataWarningProps) {
  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <Warning />
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
