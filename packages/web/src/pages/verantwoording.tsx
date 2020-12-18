import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { Collapsable } from '~/components-styled/collapsable';
import { FCWithLayout, getLayoutWithMetadata } from '~/components/layout';
import { MaxWidth } from '~/components-styled/max-width';
import siteText, { TALLLanguages } from '~/locale/index';
import { parseMarkdownInLocale } from '~/utils/parse-markdown-in-locale';
import styles from './over.module.scss';

import { groq } from 'next-sanity';
import {
  getClient,
  usePreviewSubscription,
  PortableText,
  localize,
} from '~/lib/sanity';

import { targetLanguage } from '../locale/index';

interface ICijfer {
  cijfer: string;
  verantwoording: string;
  id?: string;
}

interface StaticProps {
  props: VerantwoordingProps;
}

interface VerantwoordingProps {
  text: TALLLanguages;
  lastGenerated: string;
  cijferVerantwoording: any;
}

const cijferVerantwoordingQuery = groq`
  *[_type == 'cijferVerantwoording']
  {
    ...
  }[0]
`;

export async function getStaticProps(): Promise<StaticProps> {
  const text = parseMarkdownInLocale((await import('../locale/index')).default);

  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  // @ts-ignore
  const cijferVerantwoording = await getClient(true).fetch(
    cijferVerantwoordingQuery
  );

  return { props: { text, lastGenerated, cijferVerantwoording } };
}

const Verantwoording: FCWithLayout<VerantwoordingProps> = (props) => {
  const { cijferVerantwoording } = props;

  const { data: staticOrPreviewData } = usePreviewSubscription(
    cijferVerantwoordingQuery,
    {
      initialData: cijferVerantwoording,
      enabled: true,
    }
  );

  const verantwoordingList = localize(staticOrPreviewData, [
    targetLanguage,
    'nl',
  ]);

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
            <h2>{verantwoordingList.title}</h2>
            <PortableText blocks={verantwoordingList.description} />
            <article className={styles.faqList}>
              {verantwoordingList.content.map((item: any) => {
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
  ``;
};

const metadata = {
  ...siteText.verantwoording_metadata,
};

Verantwoording.getLayout = getLayoutWithMetadata(metadata);

export default Verantwoording;
