import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { MaxWidth } from '~/components-styled/max-width';
import { PortableText } from '~/lib/sanity';
import Head from 'next/head';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { Image } from '~/components-styled/image';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import { SanityImageProps } from '~/types/cms.d.ts';
import styles from './over.module.scss';

interface OverData {
  over: {
    title: string | null;
    description: PortableTextEntry[] | null;
  };
  imageContent: {
    coverImage: SanityImageProps;
  };
}

const query = `
"over": *[_type == 'overDitDashboard'][0],
"imageContent": *[_type == 'imagePipelineTest'][0]{
  ...,
  "coverImage": coverImage.asset->
}
`;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverData>(query)
);

const Over: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content } = props;
  const { over, imageContent } = content;
  const { coverImage } = imageContent;

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
            {over.title && <h2>{over.title}</h2>}

            <Image
              src={`/${coverImage.assetId}.${coverImage.extension}`}
              width={630}
              height={630 / coverImage.metadata.dimensions.aspectRatio}
            />

            {over.description && <PortableText blocks={over.description} />}
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.over_metadata,
};

Over.getLayout = getLayoutWithMetadata(metadata);

export default Over;
