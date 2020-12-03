import fs from 'fs';
import Head from 'next/head';
import path from 'path';

import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import siteText from '~/locale/index';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import styles from './over.module.scss';

import { groq } from 'next-sanity';
import {
  getClient,
  usePreviewSubscription,
  PortableText,
  localize,
} from '~/lib/sanity';

import { targetLanguage } from '../locale/index';

interface StaticProps {
  props: OverRisiconiveausProps;
}

interface OverRisiconiveausProps {
  lastGenerated: string;
  risicoData: any;
}

const risicoQuery = groq`
  *[_type == 'overRisicoNiveaus']
  {
    ...
  }[0]
`;

export async function getStaticProps(): Promise<StaticProps> {
  const text = (await import('../locale/index')).default;

  text.over_risiconiveaus.toelichting = MDToHTMLString(
    text.over_risiconiveaus.toelichting
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const risicoData = await getClient(true).fetch(risicoQuery);

  return { props: { lastGenerated, risicoData } };
}

const OverRisicoNiveaus: FCWithLayout<OverRisiconiveausProps> = (props) => {
  const { risicoData } = props;

  const { data: staticOrPreviewData } = usePreviewSubscription(risicoQuery, {
    initialData: risicoData,
    enabled: true,
  });

  const risico = localize(staticOrPreviewData, [targetLanguage, 'nl']);

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
            <h2>{risico.title}</h2>
            <PortableText blocks={risico.beschrijving} />
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
