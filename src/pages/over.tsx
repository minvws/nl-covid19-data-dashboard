import fs from 'fs';
import Head from 'next/head';
import path from 'path';

import BlockContent from '@sanity/block-content-to-react';
import client, { localize } from '~/lib/sanity';

import { targetLanguage } from '../locale/index';

import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import siteText from '~/locale/index';
import styles from './over.module.scss';

interface StaticProps {
  props: OverProps;
}

interface OverProps {
  lastGenerated: string;
  overDitDashboard: any;
}

export async function getStaticProps(): Promise<StaticProps> {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const sanityData = await client.fetch(
    `
    *[_id == 'overDitDashboard']
    {
      ...
    }[0]
  `
  );

  const overDitDashboard = localize(sanityData, [targetLanguage, 'nl']);

  return { props: { lastGenerated, overDitDashboard } };
}

const Over: FCWithLayout<OverProps> = (props) => {
  const { overDitDashboard } = props;

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
            <h2>{overDitDashboard.title}</h2>
            {overDitDashboard.content.map((item: any) => (
              <BlockContent key={item['_key']} blocks={item} />
            ))}
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
