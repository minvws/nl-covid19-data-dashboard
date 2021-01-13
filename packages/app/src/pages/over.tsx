import fs from 'fs';
import { groq } from 'next-sanity';
import Head from 'next/head';
import Image from 'next/image';

import path from 'path';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { getClient, localize, PortableText } from '~/lib/sanity';
import siteText, { targetLanguage } from '~/locale/index';
import styles from './over.module.scss';

interface StaticProps {
  props: OverProps;
}

interface OverProps {
  data: {
    title: string | null;
    description: unknown[] | null;
  };
  imageData: any;
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const query = groq`
  *[_type == 'overDitDashboard'][0]
`;

  const imageQuery = groq`*[_type == 'imagePipelineTest'][0]{
    ...,
    "coverImage": coverImage.asset->
  }`;

  const rawData = await getClient(false).fetch(query);
  const imageData = await getClient(false).fetch(imageQuery);
  const data = localize(rawData, [targetLanguage, 'nl']);

  return { props: { data, imageData, lastGenerated } };
}
// find closest resized element
function closest(width: number) {
  const sizes = [320, 640, 768, 1024, 1280, 1536, 2048];

  return sizes.reduce((a, b) => {
    const aDiff = Math.abs(a - width);
    const bDiff = Math.abs(b - width);

    if (aDiff == bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
}

interface LoaderProps {
  src: string;
  width: number;
}

const myLoader = (props: LoaderProps) => {
  const { src, width } = props;
  const filename = src.split('.')[0];
  const extension = src.split('.')[1];

  return `/sanity/${filename}-${closest(width)}.${extension}`;
};

const Over: FCWithLayout<OverProps> = (props) => {
  const { data, imageData } = props;
  const { coverImage } = imageData;

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
            {data.title && <h2>{data.title}</h2>}

            <Image
              loader={myLoader}
              layout="responsive"
              src={`${coverImage.assetId}.${coverImage.extension}`}
              width="630"
              height={630 / coverImage.metadata.dimensions.aspectRatio}
            />

            {data.description && <PortableText blocks={data.description} />}
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
