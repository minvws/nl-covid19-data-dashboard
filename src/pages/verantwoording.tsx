import path from 'path';
import fs from 'fs';

import { Fragment } from 'react';
import Head from 'next/head';

import { getLayout as getSiteLayout, FCWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import { ILastGeneratedData } from 'static-props/last-generated-data';

import styles from './over.module.scss';
import siteText from 'locale';

import MDToHTMLString from 'utils/MDToHTMLString';

import openGraphImageNL from 'assets/sharing/og-cijferverantwoording.png?url';
import twitterImageNL from 'assets/sharing/twitter-cijferverantwoording.png?url';
import openGraphImageEN from 'assets/sharing/og-data-explanation.png?url';
import twitterImageEN from 'assets/sharing/twitter-data-explanation.png?url';
import getLocale from 'utils/getLocale';

const locale = getLocale();

const openGraphImage = locale === 'nl' ? openGraphImageNL : openGraphImageEN;
const twitterImage = locale === 'nl' ? twitterImageNL : twitterImageEN;

interface ICijfer {
  cijfer: string;
  verantwoording: string;
}

interface StaticProps {
  props: {
    text: typeof siteText;
    lastGenerated: string;
  };
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;
  const serializedContent = text.verantwoording.cijfers.map(function (
    item: ICijfer
  ) {
    return { ...item, verantwoording: MDToHTMLString(item.verantwoording) };
  });

  text.verantwoording.cijfers = serializedContent;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated } };
}

const Verantwoording: FCWithLayout<{ text: any }> = (props) => {
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
            <h2>{text.verantwoording.title}</h2>
            <p>{text.verantwoording.paragraaf}</p>
            <article className={styles.faqList}>
              {text.verantwoording.cijfers.map((item: ICijfer) => (
                <Fragment key={`item-${item.cijfer}`}>
                  <h3>{item.cijfer}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.verantwoording,
                    }}
                  />
                </Fragment>
              ))}
            </article>
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

function getVerantwoordingLayout() {
  return function (page: React.ReactNode, pageProps: ILastGeneratedData) {
    const lastGenerated = pageProps.lastGenerated;

    return getSiteLayout(
      {
        ...siteText.verantwoording_metadata,
        openGraphImage,
        twitterImage,
      },
      lastGenerated
    )(<>{page}</>, pageProps);
  };
}

Verantwoording.getLayout = getVerantwoordingLayout();

export default Verantwoording;
