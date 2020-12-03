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
  const text = (await import('../locale/index')).default;
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
            <PortableText blocks={verantwoordingList.beschrijving} />
            <article className={styles.faqList}>
              {verantwoordingList.content.map((item: any) =>
                item.titel && item.verantwoording ? (
                  <Collapsable key={item.id} id={item.id} summary={item.titel}>
                    <PortableText blocks={item.verantwoording} />
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
