import { Fragment } from 'react';
import Head from 'next/head';

import { getLayout, FCWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

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

export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;
  const serializedContent = text.over_veelgestelde_vragen.vragen.map(function (
    item: IVraagEnAntwoord
  ) {
    return { ...item, antwoord: MDToHTMLString(item.antwoord) };
  });

  text.over_veelgestelde_vragen.vragen = serializedContent;

  return { props: { text } };
}

const Over: FCWithLayout<{ text: typeof siteText }> = (props) => {
  const { text } = props;

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
            <article className={styles.faqList}>
              {text.over_veelgestelde_vragen.vragen.map(
                (item: IVraagEnAntwoord) => (
                  <Fragment key={`item-${item.vraag}`}>
                    <h3>{item.vraag}</h3>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.antwoord,
                      }}
                    />
                  </Fragment>
                )
              )}
            </article>
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

Over.getLayout = getLayout({
  ...siteText.over_metadata,
  openGraphImage,
  twitterImage,
});

export default Over;
