import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import siteText, { TALLLanguages } from '~/locale/index';
import styles from './over.module.scss';

interface StaticProps {
  props: OverProps;
}

interface OverProps {
  text: TALLLanguages;
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated } };
}

const Over: FCWithLayout<OverProps> = (props) => {
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
