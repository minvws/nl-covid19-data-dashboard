import path from 'path';
import fs from 'fs';

import Head from 'next/head';

import { getLayoutWithMetadata, FCWithLayout } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';

import styles from './over.module.scss';
import siteText from '~/locale/index';

import { MDToHTMLString } from '~/utils/MDToHTMLString';

interface StaticProps {
  props: {
    text: typeof siteText;
    lastGenerated: string;
  };
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;
  text.over_risiconiveaus.toelichting = MDToHTMLString(
    text.over_risiconiveaus.toelichting
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated } };
}

const OverRisicoNiveaus: FCWithLayout<{
  text: any;
  lastGenerated: string;
}> = (props) => {
  const { text } = props;

  const { over_risiconiveaus } = text;

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
            <h2>{over_risiconiveaus.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: over_risiconiveaus.toelichting,
              }}
            />
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.over_risiconiveaus_metadata,
};

OverRisicoNiveaus.getLayout = getLayoutWithMetadata(metadata);

export default OverRisicoNiveaus;
