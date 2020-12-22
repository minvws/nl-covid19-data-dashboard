import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { MaxWidth } from '~/components-styled/max-width';
import siteText, { TALLLanguages } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import styles from './over.module.scss';

interface StaticProps {
  props: OverProps;
}

interface OverProps {
  text: TALLLanguages;
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = parseMarkdownInLocale((await import('../locale/index')).default);

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
            <div
              dangerouslySetInnerHTML={{ __html: text.over_beschrijving.text }}
            />
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
