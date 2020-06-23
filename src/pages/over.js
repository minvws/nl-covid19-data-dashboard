import Layout from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'data/textOver.json';
import styles from './over.module.scss';
import ReplaceLinks from 'components/replaceLinks';

Over.getLayout = Layout.getLayout(text.metadata.titel);

export default function Over() {
  return (
    <div className={styles.container}>
      <MaxWidth>
        <div className={styles.maxwidth}>
          <h2>{text.over_titel.text}</h2>
          <p>{text.over_beschrijving.text}</p>
          <h2>{text.over_disclaimer.title}</h2>
          <p>{text.over_disclaimer.text}</p>
          <h2>{text.over_veelgestelde_vragen.text}</h2>
          <dl className={styles.faqList}>
            {text.over_veelgestelde_vragen.vragen.map((item) => (
              <>
                <dt>{item.vraag}</dt>
                <dd>
                  <ReplaceLinks>{item.antwoord}</ReplaceLinks>
                </dd>
              </>
            ))}
          </dl>
        </div>
      </MaxWidth>
    </div>
  );
}
