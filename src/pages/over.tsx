import Head from 'next/head';
import React from 'react';

import Layout, { FunctionComponentWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import text from 'locale';
import styles from './over.module.scss';
import siteText from 'locale';
import MDToHTMLString from 'utils/MDToHTMLString';

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

interface StaticProps {
  props: {
    text: typeof siteText;
  };
}

// We use lokalise.com as our dictionary/text source and to support internationalisation.
// Lokakise will output JSON files which can be found in `src/locale`.
// However, all content lives inside plain strings. To support structured content and newlines,
// we (optionally) write markdown in Lokakise and parse it to HTML.
//
// Ideally this entire page would have been build from markdown, but that’s not possible
// with our internationalisation setup.
export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;
  const serializedContent = text.verantwoording.cijfers.map(function (
    item: IVraagEnAntwoord
  ) {
    return { ...item, verantwoording: MDToHTMLString(item.antwoord) };
  });

  text.verantwoording.cijfers = serializedContent;

  return { props: { text } };
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
                  <React.Fragment key={`item-${item}`}>
                    <dt>{item.vraag}</dt>
                    <dd
                      dangerouslySetInnerHTML={{
                        __html: item.antwoord,
                      }}
                    ></dd>
                  </React.Fragment>
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
