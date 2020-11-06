import { useContext } from 'react';
import LocaleContext, { ILocale } from '~/locale/localeContext';
import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import styles from './over.module.scss';

interface StaticProps {
  props: OverProps;
}

interface OverProps {
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { lastGenerated } };
}

const Over: FCWithLayout<OverProps> = () => {
  const { siteText }: ILocale = useContext(LocaleContext);

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
            <h2>{siteText.over_titel.text}</h2>
            <p>{siteText.over_beschrijving.text}</p>
            <h2>{siteText.over_disclaimer.title}</h2>
            <p>{siteText.over_disclaimer.text}</p>
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

Over.getLayout = getLayoutWithMetadata('over_metadata');

export default Over;
