import { groq } from 'next-sanity';
import Head from 'next/head';

import Image from 'next/image';

import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { PortableText } from '~/lib/sanity';
import siteText from '~/locale/index';
import { getContent, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import styles from './over.module.scss';
import { findClosestSize } from '~/utils/findClosestSize';

interface OverData {
  title: string | null;
  description: unknown[] | null;
}

interface ImageData {
  coverImage: {
    assetId: string;
    extension: string;
    metadata: {
      dimensions: {
        aspectRatio: number;
      };
    };
  };
}

interface LoaderProps {
  src: string;
  width: number;
}

const myLoader = (props: LoaderProps) => {
  const { src, width } = props;
  const filename = src.split('.')[0];
  const extension = src.split('.')[1];

  return `cms/${filename}-${findClosestSize(width)}.${extension}`;
};

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,

  async () => ({
    content: await getContent<OverData>(groq`
      *[_type == 'overDitDashboard'][0]
    `),
  }),

  async () => ({
    imageContent: await getContent<ImageData>(groq`
      *[_type == 'imagePipelineTest'][0]{
      ...,
      "coverImage": coverImage.asset->
    }
    `),
  })
);

const Over: FCWithLayout<typeof getStaticProps> = (props) => {
  const { content, imageContent } = props;
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
            {content.title && <h2>{content.title}</h2>}

            <Image
              loader={myLoader}
              layout="responsive"
              src={`/${coverImage.assetId}.${coverImage.extension}`}
              width="630"
              height={630 / coverImage.metadata.dimensions.aspectRatio}
            />

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
  ...siteText.over_metadata,
};

Over.getLayout = getLayoutWithMetadata(metadata);

export default Over;
