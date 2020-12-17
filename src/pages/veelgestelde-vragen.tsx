import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components-styled/max-width';
import siteText, { TALLLanguages } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';

import styles from './over.module.scss';
import { Collapsable } from '~/components-styled/collapsable';

import { groq } from 'next-sanity';
import {
  getClient,
  usePreviewSubscription,
  PortableText,
  localize,
} from '~/lib/sanity';

import { targetLanguage } from '../locale/index';

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
  faq: any;
}

const faqQuery = groq`
  *[_type == 'veelgesteldeVragen']
  {
    ...
  }[0]
`;

export async function getStaticProps(): Promise<StaticProps> {
  const text = parseMarkdownInLocale((await import('../locale/index')).default);

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const faq = await getClient(true).fetch(faqQuery);

  return { props: { text, lastGenerated, faq } };
}

const Verantwoording: FCWithLayout<VeelgesteldeVragenProps> = (props) => {
  const { text, faq } = props;

  const { data: staticOrPreviewData } = usePreviewSubscription(faqQuery, {
    initialData: faq,
    enabled: true,
  });

  const faqList = localize(staticOrPreviewData, [targetLanguage, 'nl']);

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
            <PortableText blocks={faqList.description} />

            <article className={styles.faqList}>
              {faqList.content.map((item: any) => {
                return (
                  <Collapsable
                    key={item._key}
                    id={item._key}
                    summary={item.title}
                  >
                    <PortableText blocks={item.description} />
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
