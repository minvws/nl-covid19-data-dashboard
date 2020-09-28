import path from 'path';
import fs from 'fs';

import Head from 'next/head';

import { getLayoutWithMetadata, FCWithLayout } from 'components/layout';
import MaxWidth from 'components/maxWidth';

import styles from './over.module.scss';
import siteText from 'locale';

import MDToHTMLString from 'utils/MDToHTMLString';

interface StaticProps {
  props: {
    text: typeof siteText;
    lastGenerated: string;
  };
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;
  text.over_risiconiveas.toelichting = MDToHTMLString(
    text.over_risiconiveas.toelichting
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

  const { over_risiconiveas } = text;

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
            <h2>{over_risiconiveas.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: over_risiconiveas.toelichting,
              }}
            />
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.over_risiconiveas_metadata,
};

OverRisicoNiveaus.getLayout = getLayoutWithMetadata(metadata);

export default OverRisicoNiveaus;
