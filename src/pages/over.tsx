import path from 'path';
import fs from 'fs';

import { Fragment } from 'react';
import Head from 'next/head';

import { getLayoutWithMetadata, FCWithLayout } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';

import styles from './over.module.scss';
import siteText, { TALLLanguages } from '~/locale/index';

import { MDToHTMLString } from '~/utils/MDToHTMLString';

interface IVraagEnAntwoord {
  vraag: string;
  antwoord: string;
}

interface StaticProps {
  props: {
    text: TALLLanguages;
    lastGenerated: string;
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

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated } };
}

const Over: FCWithLayout<{ text: TALLLanguages }> = (props) => {
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
                (item: IVraagEnAntwoord) => {
                  //@TODO, Why does this sometimes return empty strings for the
                  // antwoord key? Does this PR mess up something with promises/async behavior
                  // in getStaticProps?
                  return (
                    <Fragment key={`item-${item.vraag}`}>
                      <h3>{item.vraag}</h3>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.antwoord,
                        }}
                      />
                    </Fragment>
                  );
                }
              )}
            </article>
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.over_metadata,
};

Over.getLayout = getLayoutWithMetadata(metadata);

export default Over;
