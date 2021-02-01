import Head from 'next/head';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { PortableText } from '~/lib/sanity';
import siteText from '~/locale/index';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import styles from './over.module.scss';
import { PortableTextEntry } from '@sanity/block-content-to-react';

interface AccessibilityPageData {
  title: string | null;
  description: PortableTextEntry[] | null;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<AccessibilityPageData>(`*[_type == 'toegankelijkheid'][0]`)
);

const AccessibilityPage: FCWithLayout<typeof getStaticProps> = (props) => {
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
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.toegankelijkheid_metadata,
};

AccessibilityPage.getLayout = getLayoutWithMetadata(metadata);

export default AccessibilityPage;
