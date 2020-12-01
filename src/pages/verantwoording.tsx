import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { Collapsable } from '~/components-styled/collapsable';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import siteText, { TALLLanguages } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';

interface StaticProps {
  props: VerantwoordingProps;
}

interface VerantwoordingProps {
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

const Verantwoording: FCWithLayout<VerantwoordingProps> = (props) => {
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
            <h2>{text.verantwoording.title}</h2>
            <p>{text.verantwoording.paragraaf}</p>
            <article className={styles.faqList}>
              {text.verantwoording.cijfers.map((item) => {
                const id = getSkipLinkId(item.cijfer);

                return item.verantwoording && item.cijfer ? (
                  <Collapsable key={id} id={id} summary={item.cijfer}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.verantwoording,
                      }}
                    ></div>
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
  ...siteText.verantwoording_metadata,
};

Verantwoording.getLayout = getLayoutWithMetadata(metadata);

export default Verantwoording;
