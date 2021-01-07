import fs from 'fs';
import { groq } from 'next-sanity';
import Head from 'next/head';
import path from 'path';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { getClient, localize, PortableText } from '~/lib/sanity';
import siteText, { targetLanguage } from '~/locale/index';
import styles from './over.module.scss';

interface StaticProps {
  props: OverProps;
}

interface OverProps {
  data: {
    title: string | null;
    description: unknown[] | null;
  };
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const query = groq`
  *[_type == 'overDitDashboard'][0]
`;
  const rawData = await getClient(false).fetch(query);
  const data = localize(rawData, [targetLanguage, 'nl']);

  return { props: { data, lastGenerated } };
}

const Over: FCWithLayout<OverProps> = (props) => {
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
            {data.title && <h2>{data.title}</h2>}
            {data.description && <PortableText blocks={data.description} />}
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
