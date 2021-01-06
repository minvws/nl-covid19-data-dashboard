import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { Collapsable } from '~/components-styled/collapsable';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { MaxWidth } from '~/components-styled/max-width';
import siteText, { targetLanguage } from '~/locale/index';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';

import { groq } from 'next-sanity';
import { getClient, localize, PortableText } from '~/lib/sanity';

interface StaticProps {
  props: VerantwoordingProps;
}

interface VerantwoordingProps {
  data: {
    title: string;
    description: string | null;
    collapsibleList: Array<{ content: Array<any>; title: string }>;
  };
  lastGenerated: string;
}

const verantwoordingQuery = groq`
  *[_type == 'cijferVerantwoording'][0]
`;

export async function getStaticProps(): Promise<StaticProps> {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const verantwoordingData = await getClient(false).fetch(verantwoordingQuery);
  const data = localize(verantwoordingData, [targetLanguage, 'nl']);

  return { props: { data, lastGenerated } };
}

const Verantwoording: FCWithLayout<VerantwoordingProps> = (props) => {
  const { data } = props;

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
            <h2>{data.title}</h2>
            {data.description && <PortableText blocks={data.description} />}

            {data.collapsibleList ? (
              <article className={styles.faqList}>
                {data.collapsibleList.map((item: any) => {
                  const id = getSkipLinkId(item.title);
                  return (
                    <Collapsable key={id} id={id} summary={item.title}>
                      <PortableText blocks={item.content} />
                    </Collapsable>
                  );
                })}
              </article>
            ) : (
              <p>Er zijn geen verantwoordingen gevonden</p>
            )}
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
