import Head from 'next/head';
import { Box } from '~/components-styled/base';
import { ContentBlock } from '~/components-styled/cms/content-block';
import { RichContent } from '~/components-styled/cms/rich-content';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { RichContentBlock } from '~/types/cms';

interface AccessibilityPageData {
  title: string | null;
  description: RichContentBlock[] | null;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<AccessibilityPageData>(`
  *[_type == 'toegankelijkheid']{
    ...,
    "description": {
      ...,
      "_type": description._type,
      "nl": [
        ...description.nl[]{
          ...,
          "asset": asset->,
          markDefs[]{
            ...,
            "asset": asset->
          }
        }
      ],
      "en": [
        ...description.en[]
        {
          ...,
          "asset": asset->,
          markDefs[]{
            ...,
            "asset": asset->
          }
        },
      ],

    }
  }[0]

  `)
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

      <Box bg="white" py={{ _: 4, md: 5 }}>
        <ContentBlock spacing={3}>
          {content.title && <h2>{content.title}</h2>}
          {content.description && <RichContent blocks={content.description} />}
        </ContentBlock>
      </Box>
    </>
  );
};

const metadata = {
  ...siteText.toegankelijkheid_metadata,
};

AccessibilityPage.getLayout = getLayoutWithMetadata(metadata);

export default AccessibilityPage;
