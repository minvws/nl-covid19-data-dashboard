import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { MaxWidth } from '~/components-styled/max-width';
import siteText, { TALLLanguages } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import styles from './over.module.scss';
import { Collapsable } from '~/components-styled/collapsable';
import { getSkipLinkId } from '~/utils/skipLinks';

interface StaticProps {
  props: OverRisiconiveausProps;
}

interface OverRisiconiveausProps {
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

const OverRisicoNiveaus: FCWithLayout<OverRisiconiveausProps> = (props) => {
  const { text } = props;

  const { over_risiconiveaus } = text;

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
            <h2>{over_risiconiveaus.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: over_risiconiveaus.paragraaf,
              }}
            />
            <article className={styles.faqList}>
              {text.over_risiconiveaus.vragen.map((item) => {
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
              })}
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
