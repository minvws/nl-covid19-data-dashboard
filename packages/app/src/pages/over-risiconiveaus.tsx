import Head from 'next/head';
import { Collapsible } from '~/components-styled/collapsible';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { PortableText } from '~/lib/sanity';
import siteText from '~/locale/index';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { CollapsibleList } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';

interface OverRisiconiveausData {
  title: string | null;
  description: unknown[] | null;
  collapsibleList: CollapsibleList[];
}

const query = `
*[_type == 'overRisicoNiveaus'][0]
`;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverRisiconiveausData>(query)
);

const OverRisicoNiveaus: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;

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
            {content.title && <h2>{content.title}</h2>}
            {content.description && (
              <PortableText blocks={content.description} />
            )}
            {content.collapsibleList && (
              <article className={styles.faqList}>
                {content.collapsibleList.map((item) => {
                  const id = getSkipLinkId(item.title);
                  return (
                    <Collapsible key={id} id={id} summary={item.title}>
                      <PortableText blocks={item.content} />
                    </Collapsible>
                  );
                })}
              </article>
            )}
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.over_risiconiveaus_metadata,
};

OverRisicoNiveaus.getLayout = getLayoutWithMetadata(metadata);

export default OverRisicoNiveaus;
