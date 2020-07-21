import Layout from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale/nl.json';
import styles from './error.module.scss';

ErrorPage.getLayout = Layout.getLayout(text.error_metadata);

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{text.error_titel.text.translation}</h2>
          <p>{text.error_beschrijving.text.translation}</p>
        </div>
      </MaxWidth>
    </div>
  );
}
