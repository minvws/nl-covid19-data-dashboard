import Head from 'next/head';

import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
import styles from './over.module.scss';
import ReplaceLinks from 'components/replaceLinks';

import openGraphImageNL from 'assets/sharing/og-over.png?url';
import twitterImageNL from 'assets/sharing/twitter-over.png?url';
import openGraphImageEN from 'assets/sharing/og-about.png?url';
import twitterImageEN from 'assets/sharing/twitter-about.png?url';
import getLocale from 'utils/getLocale';

const locale = getLocale();

const openGraphImage = locale === 'nl' ? openGraphImageNL : openGraphImageEN;
const twitterImage = locale === 'nl' ? twitterImageNL : twitterImageEN;

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
