import fs from 'fs';
import Head from 'next/head';
import path from 'path';

import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';

import { MaxWidth } from '~/components-styled/max-width';
import siteText from '~/locale/index';

import styles from './over.module.scss';
// import { Collapsable } from '~/components-styled/collapsable';

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

            <article className={styles.faqList}>
              {/* {text.over_risiconiveaus.vragen.map((item) => {
                const id = getSkipLinkId(item.vraag);
                return item.vraag ? (
                  <Collapsable key={id} id={id} summary={item.vraag}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.antwoord,
                      }}
                    />
                  </Collapsable>
                ) : null;
              })} */}
            </article>
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
