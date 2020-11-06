import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import styles from './over.module.scss';
import { TLocale } from '~/locale/localeContext';

interface StaticProps {
  props: OverRisiconiveausProps;
}

interface OverRisiconiveausProps {
  siteText: TLocale;
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const siteText: TLocale = await import(
    `~/locale/${process.env.NEXT_PUBLIC_LOCALE}.json`
  ).then((text) => text.default);

  siteText.over_risiconiveaus.toelichting = MDToHTMLString(
    siteText.over_risiconiveaus.toelichting
  );

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { siteText, lastGenerated } };
}

const OverRisicoNiveaus: FCWithLayout<OverRisiconiveausProps> = ({
  siteText,
}) => (
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
          <h2>{siteText.over_risiconiveaus.title}</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: siteText.over_risiconiveaus.toelichting,
            }}
          />
        </div>
      </MaxWidth>
    </div>
  </>
);

OverRisicoNiveaus.getLayout = getLayoutWithMetadata(
  'over_risiconiveaus_metadata'
);

export default OverRisicoNiveaus;
