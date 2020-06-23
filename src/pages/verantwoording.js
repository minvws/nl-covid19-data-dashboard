import Layout from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'data/textVerantwoording.json';
import styles from './over.module.scss';
import ReplaceLinks from 'components/replaceLinks';

Verantwoording.getLayout = Layout.getLayout(text.metadata.titel);

export default function Verantwoording() {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{text.verantwoording.title}</h2>
          <dl className={styles.faqList}>
            {text.verantwoording.cijfers.map((item) => (
              <>
                <dt>{item.cijfer}</dt>
                <dd>
                  <ReplaceLinks>{item.verantwoording}</ReplaceLinks>
                </dd>
              </>
            ))}
          </dl>
        </div>
      </MaxWidth>
    </div>
  );
}
