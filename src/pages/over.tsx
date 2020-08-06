import Head from 'next/head';

import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
import styles from './over.module.scss';
import ReplaceLinks from 'components/replaceLinks';

import openGraphImage from 'assets/sharing/og-over.png?url';
import twitterImage from 'assets/sharing/twitter-over.png?url';

interface IVraagEnAntwoord {
  vraag: string;
  antwoord: string;
}

const Over: FunctionComponentWithLayout = () => {
  return (
    <>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <div className={styles.container}>
        <MaxWidth>
          <div className={styles.maxwidth}>
            <h2>{text.over_titel.text}</h2>
            <p>{text.over_beschrijving.text}</p>
            <h2>{text.over_disclaimer.title}</h2>
            <p>{text.over_disclaimer.text}</p>
            <h2>{text.over_veelgestelde_vragen.text}</h2>
            <dl className={styles.faqList}>
              {text.over_veelgestelde_vragen.vragen.map(
                (item: IVraagEnAntwoord) => (
                  <>
                    <dt>{item.vraag}</dt>
                    <dd>
                      <ReplaceLinks>{item.antwoord}</ReplaceLinks>
                    </dd>
                  </>
                )
              )}
            </dl>
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

Over.getLayout = Layout.getLayout({
  ...text.over_metadata,
  openGraphImage,
  twitterImage,
});

export default Over;
