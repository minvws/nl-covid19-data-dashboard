import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { Collapsable } from '~/components/collapsable';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import siteText, { TALLLanguages } from '~/locale/index';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import { ensureUniqueSkipLinkIds, getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';

interface ICijfer {
  cijfer: string;
  verantwoording: string;
  id?: string;
}

interface StaticProps {
  props: {
    text: TALLLanguages;
    lastGenerated: string;
  };
}

export async function getStaticProps(): Promise<StaticProps> {
  const text = require('../locale/index').default;
  const serializedContent = text.verantwoording.cijfers.map(
    (item: ICijfer) => ({
      ...item,
      id: getSkipLinkId(item.cijfer),
      verantwoording: MDToHTMLString(item.verantwoording),
    })
  );

  ensureUniqueSkipLinkIds(serializedContent);

  text.verantwoording.cijfers = serializedContent;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { text, lastGenerated } };
}

const Verantwoording: FCWithLayout<{ text: any; lastGenerated: string }> = (
  props
) => {
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
              {text.verantwoording.cijfers.map((item: ICijfer) =>
                item.verantwoording && item.cijfer ? (
                  <Collapsable key={item.id} id={item.id} summary={item.cijfer}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.verantwoording,
                      }}
                    ></div>
                  </Collapsable>
                ) : null
              )}
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
