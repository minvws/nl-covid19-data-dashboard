import fs from 'fs';
import Head from 'next/head';
import path from 'path';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { MaxWidth } from '~/components-styled/max-width';
import siteText from '~/locale/index';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';
import { Collapsable } from '~/components-styled/collapsable';
import targetLanguage from '../locale/index'
import { groq } from 'next-sanity'
import {
  getClient,
  localize,
  PortableText
  } from '~/lib/sanity'
interface StaticProps {
  props: VeelgesteldeVragenProps;
}

interface VeelgesteldeVragenProps {
  text: {
    title: string;
    description: string;
    content: Array<{ content: Array<any>, title: string}>
  };
  lastGenerated: string;
}

const faqQuery = groq`
  *[_type == 'veelgesteldeVragen']
  {
    ...
  }[0]
`;

export async function getStaticProps(): Promise<StaticProps> {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const faqData = await getClient(false).fetch(faqQuery);
  const faqList = localize(faqData, [targetLanguage, 'nl']);

  return { props: { text: faqList, lastGenerated } };
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
            <h2>{ text.title }</h2>
            <PortableText blocks={ text.description } />

            <article className={styles.faqList}>
              {text.content.map((item: any) => {
                const id = getSkipLinkId(item.title);
                return (
                  <Collapsable key={id} id={id} summary={item.title}>
                    <PortableText blocks={ item.content } />
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
