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

import BlockContent from '@sanity/block-content-to-react';
import client, { localize } from '~/lib/sanity';

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
  verantwoording: any;
}

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

  const sanityData = await client.fetch(
    `
    *[_type == 'cijferVerantwoording']
    {
      title,
      beschrijving,
      content,
    }[0]
  `
  );

  const verantwoording = localize(sanityData, [targetLanguage, 'nl']);

  return { props: { lastGenerated, verantwoording } };
}

const Verantwoording: FCWithLayout<VerantwoordingProps> = (props) => {
  const { verantwoording } = props;

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
            <h2>{verantwoording.title}</h2>
            <BlockContent blocks={verantwoording.beschrijving} />
            <article className={styles.faqList}>
              {verantwoording.content.map((item: any) =>
                item.titel && item.verantwoording ? (
                  <Collapsable key={item.id} id={item.id} summary={item.titel}>
                    <BlockContent blocks={item.verantwoording} />
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
