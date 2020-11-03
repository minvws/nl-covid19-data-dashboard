import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components/maxWidth';
import siteText, { TALLLanguages } from '~/locale/index';
import { MDToHTMLString } from '~/utils/MDToHTMLString';
import { ensureUniqueSkipLinkIds, getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';
import { Collapsable } from '~/components-styled/collapsable';

interface IVraagEnAntwoord {
  vraag: string;
  antwoord: string;
  id?: string;
}

interface StaticProps {
  props: VeelgesteldeVragenProps;
}

interface VeelgesteldeVragenProps {
  text: TALLLanguages;
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const text: TALLLanguages = (await import('../locale/index')).default;
  const serializedContent = text.over_veelgestelde_vragen.vragen.map(function (
    item: IVraagEnAntwoord
  ) {
    return {
      ...item,
      id: getSkipLinkId(item.vraag),
      antwoord: MDToHTMLString(item.antwoord),
    };
  });

  ensureUniqueSkipLinkIds(serializedContent);
  text.over_veelgestelde_vragen.vragen = serializedContent;

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
              {text.over_veelgestelde_vragen.vragen.map(
                (item: IVraagEnAntwoord) => {
                  //@TODO, Why does this sometimes return empty strings for the
                  // antwoord key? Does this PR mess up something with promises/async behavior
                  // in getStaticProps?
                  return (
                    <Collapsable
                      key={item.id}
                      id={item.id}
                      summary={item.vraag}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.antwoord,
                        }}
                      ></div>
                    </Collapsable>
                  );
                }
              )}
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
