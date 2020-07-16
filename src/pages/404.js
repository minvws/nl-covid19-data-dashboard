import Layout from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'data/textNotFound.json';
import styles from './over.module.scss';

NotFound.getLayout = Layout.getLayout(text.notfound_metadata.titel);

export default function NotFound() {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{text.notfound_titel.text}</h2>
          <p>{text.notfound_beschrijving.text}</p>
        </div>
      </MaxWidth>
    </div>
  );
}
