import path from 'path';
import fs from 'fs';

import { Fragment } from 'react';
import Head from 'next/head';

import { getLayoutWithMetadata, FCWithLayout } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';

import styles from './over.module.scss';
import siteText from '~/locale/index';

import { MDToHTMLString } from '~/utils/MDToHTMLString';

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
  let data;
  const text = require('../locale/index').default;
  const serializedContent = text.verantwoording.cijfers.map(function (
    item: ICijfer
  ) {
    return { ...item, verantwoording: MDToHTMLString(item.verantwoording) };
  });

  text.verantwoording.cijfers = serializedContent;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');

  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } else {
    if (process.env.NODE_ENV === 'development') {
      const res = await fetch(
        'https://coronadashboard.rijksoverheid.nl/json/NL.json'
      );
      data = await res.json();
    }
  }

  const lastGenerated = data.last_generated;

  return { props: { text, lastGenerated } };
}

const Verantwoording: FCWithLayout<{ text: any; lastGenerated: string }> = (
  props
) => {
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

const metadata = {
  ...siteText.verantwoording_metadata,
};

Verantwoording.getLayout = getLayoutWithMetadata(metadata);

export default Verantwoording;
