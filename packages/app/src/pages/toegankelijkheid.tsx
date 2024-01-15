import { Box } from '~/components/base';
import { Content } from '~/domain/layout/content';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { RichContent } from '~/components/cms/rich-content';
import { RichContentBlock } from '~/types/cms';
import { useIntl } from '~/intl';
import css from '@styled-system/css';
import Head from 'next/head';
import styled from 'styled-components';

interface AccessibilityPageData {
  title: string | null;
  description: RichContentBlock[] | null;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<AccessibilityPageData>((context) => {
    const { locale = 'nl' } = context;

    return `*[_type == 'toegankelijkheid']{
      ...,
      "description": {
        ...,
        "_type": description._type,
        "${locale}": [
          ...description.${locale}[]{
            ...,
            "asset": asset->,
            markDefs[]{
              ...,
              "asset": asset->
            }
          }
        ]
      }
    }[0]
    `;
  })
);

const AccessibilityPage = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts } = useIntl();
  const { content, lastGenerated } = props;

  return (
    <Layout {...commonTexts.toegankelijkheid_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
        <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
      </Head>
      <Box id="content">
        <Content>
          {content.title && <Heading level={1}>{content.title}</Heading>}
          {content.description && <RichContent blocks={content.description} contentWrapper={RichContentWrapper} />}
        </Content>
      </Box>
    </Layout>
  );
};

const RichContentWrapper = styled.div(
  css({
    maxWidth: 'maxWidthText',
    width: '100%',
  })
);

export default AccessibilityPage;
