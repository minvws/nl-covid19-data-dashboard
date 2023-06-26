import css from '@styled-system/css';
import Head from 'next/head';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { MaxWidth } from '~/components/max-width';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import { createGetStaticProps, StaticProps } from '~/static-props/create-get-static-props';
import { createGetContent, getLastGeneratedDate } from '~/static-props/get-data';
import { space } from '~/style/theme';
import { ImageBlock, RichContentBlock } from '~/types/cms';
interface OverData {
  title: string | null;
  intro: RichContentBlock[] | null;
  description: RichContentBlock[] | null;
  timelineImage: ImageBlock | null;
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverData>((context) => {
    const { locale = 'nl' } = context;
    return `
      *[
          _type == 'overDitDashboard' && !(_id in path('drafts.**'))
      ][0]{...,
        "description": {
          "_type": description._type,
          "${locale}": [
            ...description.${locale}[]
            {
              ...,
              "asset": asset->
             },
          ]
        },
        "intro": {
          "_type": intro._type && !(_id in path('drafts.**')),
          "${locale}": [
            ...intro.${locale}[]
            {
              ...,
              "asset": asset->
             },
          ]
        },
        "timelineImage": {
          "_type": timelineImage._type && !(_id in path('drafts.**')),
          "${locale}": [
            ...intro.${locale}[]
            {
              "alt": alt,
              "caption": caption,
              "asset": asset->
            },
          ]
        }
      },
    `;
  })
);

const Over = (props: StaticProps<typeof getStaticProps>) => {
  const { commonTexts } = useIntl();
  const { content, lastGenerated } = props;

  return (
    <Layout {...commonTexts.over_metadata} lastGenerated={lastGenerated}>
      <Head>
        <link key="dc-type" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" />
        <link key="dc-type-title" rel="dcterms:type" href="https://standaarden.overheid.nl/owms/terms/webpagina" title="webpagina" />
      </Head>

      <Box textVariant="body1" bg="white">
        <MaxWidth paddingTop={space[6]} paddingBottom={space[5]} paddingX={{ _: space[3], sm: '0' }}>
          <Box spacing={4}>{content.title && <Heading level={1}>{content.title}</Heading>}</Box>
          <Box spacing={4} display="grid" gridTemplateColumns={{ _: '1fr', xl: '1fr 1fr' }} gridGap={space[6]}>
            <div>{content.intro && <RichContent blocks={content.intro} contentWrapper={RichContentWrapper} />}</div>
            <div>{content.description && <RichContent blocks={content.description} contentWrapper={RichContentWrapper} />}</div>
          </Box>
        </MaxWidth>
      </Box>
    </Layout>
  );
};

const RichContentWrapper = styled.div(
  css({
    width: '100%',
  })
);

export default Over;
