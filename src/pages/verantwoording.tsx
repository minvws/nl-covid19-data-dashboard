import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import { ensureUniqueSkipLinkIds, getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';
import { Collapsable } from '~/components-styled/collapsable';
import { TLocale } from '~/locale/localeContext';

interface ICijfer {
  cijfer: string;
  verantwoording: string;
  id?: string;
}

interface StaticProps {
  props: VerantwoordingProps;
}

interface VerantwoordingProps {
  siteText: TLocale;
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const siteText: TLocale = await import(
    `~/locale/${process.env.NEXT_PUBLIC_LOCALE}.json`
  ).then((text) => text.default);

  const serializedContent = siteText.verantwoording.cijfers.map(
    (item: ICijfer) => ({
      ...item,
      id: getSkipLinkId(item.cijfer),
      verantwoording: MDToHTMLString(item.verantwoording),
    })
  );

  ensureUniqueSkipLinkIds(serializedContent);

  siteText.verantwoording.cijfers = serializedContent;

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  return { props: { siteText, lastGenerated } };
}

const Verantwoording: FCWithLayout<VerantwoordingProps> = ({ siteText }) => (
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
          <h2>{siteText.verantwoording.title}</h2>
          <p>{siteText.verantwoording.paragraaf}</p>
          <article className={styles.faqList}>
            {siteText.verantwoording.cijfers.map((item: ICijfer) =>
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

Verantwoording.getLayout = getLayoutWithMetadata('verantwoording_metadata');

export default Verantwoording;
