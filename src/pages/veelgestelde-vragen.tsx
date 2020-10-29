import fs from 'fs';
import Head from 'next/head';
import path from 'path';

import { groq } from 'next-sanity';

import BlockContent from '@sanity/block-content-to-react';
import { getClient, usePreviewSubscription, localize } from '~/lib/sanity';

import { targetLanguage } from '../locale/index';

import { Collapsable } from '~/components/collapsable';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import siteText from '~/locale/index';
import styles from './over.module.scss';

interface IVraagEnAntwoord {
  vraag: string;
  antwoord: string;
  id?: string;
}

interface StaticProps {
  props: VeelgesteldeVragenProps;
}

interface VeelgesteldeVragenProps {
  lastGenerated: string;
  data: any;
}

const query = groq`
  *[_id == 'veelgesteldeVragen']
  {
   ...
  }[0]
`;

export async function getStaticProps(): Promise<StaticProps> {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const data = await getClient(true).fetch(query);

  return { props: { lastGenerated, data } };
}

const Verantwoording: FCWithLayout<VeelgesteldeVragenProps> = (props) => {
  const { data } = props;

  const { data: previewData } = usePreviewSubscription(query, {
    initialData: data,
    enabled: true,
  });

  const veelgesteldeVragen = localize(previewData, [targetLanguage, 'nl']);

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
            <h2>{veelgesteldeVragen.title}</h2>
            <BlockContent blocks={veelgesteldeVragen.description} />

            <article className={styles.faqList}>
              {veelgesteldeVragen.content.map((item: any) => {
                return (
                  <Collapsable
                    key={item['_key']}
                    id={item['_key']}
                    summary={item.vraag}
                  >
                    <BlockContent blocks={item.antwoord} />
                  </Collapsable>
                );
              })}
            </article>
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.veelgestelde_vragen_metadata,
};

Verantwoording.getLayout = getLayoutWithMetadata(metadata);

export default Verantwoording;
