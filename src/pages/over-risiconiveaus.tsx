import fs from 'fs';
import Head from 'next/head';
import path from 'path';

import BlockContent from '@sanity/block-content-to-react';
import client, { localize } from '~/lib/sanity';

import { targetLanguage } from '../locale/index';

import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import siteText, { TALLLanguages } from '~/locale/index';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import styles from './over.module.scss';

interface StaticProps {
  props: OverRisiconiveausProps;
}

interface OverRisiconiveausProps {
  text: TALLLanguages;
  lastGenerated: string;
  overDeRisicoNiveaus: any;
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = (await import('../locale/index')).default;

  text.over_risiconiveaus.toelichting = MDToHTMLString(
    text.over_risiconiveaus.toelichting
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const sanityData = await client.fetch(
    `
    *[_id == 'overDeRisicoNiveaus']
    {
      ...
    }[0]
  `
  );

  const overDeRisicoNiveaus = localize(sanityData, [targetLanguage, 'nl']);

  return { props: { lastGenerated, overDeRisicoNiveaus } };
}

const OverRisicoNiveaus: FCWithLayout<OverRisiconiveausProps> = (props) => {
  const { overDeRisicoNiveaus } = props;

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
            <h2>{overDeRisicoNiveaus.title}</h2>
            <BlockContent blocks={overDeRisicoNiveaus.description} />
            {overDeRisicoNiveaus.content.map((item: any) => {
              return <BlockContent key={item['_key']} blocks={item} />;
            })}
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
