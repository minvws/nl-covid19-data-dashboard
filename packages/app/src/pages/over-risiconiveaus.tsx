import css from '@styled-system/css';
import Head from 'next/head';
import { ReactNode } from 'react';
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
import { mergeAdjacentKpiBlocks } from '~/utils/merge-adjacent-kpi-blocks';

interface OverRisiconiveausData {
  title: string;
  content: RichContentBlock[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverRisiconiveausData>(() => {
    return "*[_type == 'overRisicoNiveausNew'][0]";
  })
);

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, content } = props;

  content.content = mergeAdjacentKpiBlocks(content.content);

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
          <Heading level={1}>{content.title}</Heading>
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
            blocks={content.content}
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
