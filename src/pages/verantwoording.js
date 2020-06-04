import Layout from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'data/textVerantwoording.json';
import styles from './over.module.scss';

Verantwoording.getLayout = Layout.getLayout(text.metadata.titel);

export default function Verantwoording() {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{text.verantwoording.title}</h2>
          <dl className={styles.faqList}>
            {text.verantwoording.cijfers.map((item) => {
              return (
                <>
                  <dt>{item.cijfer}</dt>
                  <dd>{item.verantwoording}</dd>
                </>
              );
            })}
          </dl>
        </div>
      </MaxWidth>
    </div>
  );
}
