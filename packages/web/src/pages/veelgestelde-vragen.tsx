import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { MaxWidth } from '~/components-styled/max-width';
import siteText, { TALLLanguages } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';
import { Collapsable } from '~/components-styled/collapsable';

interface StaticProps {
  props: VeelgesteldeVragenProps;
}

interface VeelgesteldeVragenProps {
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

const Verantwoording: FCWithLayout<VeelgesteldeVragenProps> = (props) => {
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
            <h2>{text.over_veelgestelde_vragen.titel}</h2>
            <p>{text.over_veelgestelde_vragen.paragraaf}</p>
            <article className={styles.faqList}>
              {text.over_veelgestelde_vragen.vragen.map((item) => {
                const id = getSkipLinkId(item.vraag);
                return (
                  <Collapsable key={id} id={id} summary={item.vraag}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.antwoord,
                      }}
                    />
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
