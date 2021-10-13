import css from '@styled-system/css';
import Head from 'next/head';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { Heading } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { RichContentBlock } from '~/types/cms';

interface OverRisiconiveausData {
  pageContent: RichContentBlock[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverRisiconiveausData>((context) => {
    const { locale } = context;
    return `*[_type == 'overRisicoNiveausNew']
    {
      "pageContent": {
            "_type": content._type,
            "${locale}": [
              ...content.${locale}[]
              {
                _type != 'dashboardChart' && _type != 'dashboardKpi' => {
                  ...
                },
                _type == 'dashboardChart' || _type == 'dashboardKpi' => {
                  ...*[_id == ^._ref][0]
                }
              }    
            ]
          },
    }[0]
    `;
  })
);

function mergeAdjacentKpiBlocks(blocks: RichContentBlock[]) {
  const result: RichContentBlock[] = [];
  for (let i = 0, ii = blocks.length; i < ii; i++) {
    const block = blocks[i];
    if (
      block._type === 'kpiConfiguration' &&
      blocks[i + 1]?._type === 'kpiConfiguration'
    ) {
      block._type = 'kpiConfigurations';
      (block as any).kpi = {
        _type: 'dashboardKpis',
        configs: [(block as any).kpi.config, (blocks[i + 1] as any).kpi.config],
      };
      i++;
    }
    result.push(block);
  }
  return result;
}

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, content } = props;

  if (isDefined(content.pageContent)) {
    content.pageContent = mergeAdjacentKpiBlocks(content.pageContent);
  }

  return (
    <Layout
      {...siteText.over_risiconiveaus_metadata}
      lastGenerated={lastGenerated}
    >
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
      <Content>
        <Box width="100%" maxWidth="maxWidthText">
          <Heading level={1}>Risiconiveaus</Heading>
        </Box>
        <Box
          textVariant="body1"
          css={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          })}
        >
          <RichContent
            blocks={content.pageContent}
            contentWrapper={RichContentWrapper}
          />
        </Box>
      </Content>
    </Layout>
  );
};

export default OverRisicoNiveaus;

const RichContentWrapper = styled.div(
  css({
    maxWidth: 'maxWidthText',
    width: '100%',
  })
);

interface ContentProps {
  children: ReactNode;
}

function Content({ children }: ContentProps) {
  return (
    <Box bg="white">
      <Box
        pt={5}
        pb={5}
        px={{ _: 3, sm: 0 }}
        maxWidth="infoWidth"
        width="100%"
        mx="auto"
        spacing={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {children}
      </Box>
    </Box>
  );
}
