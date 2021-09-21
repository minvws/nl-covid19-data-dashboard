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
import { CollapsibleList, RichContentBlock } from '~/types/cms';

interface OverRisiconiveausData {
  title: string;
  description: RichContentBlock[];
  scoreBoardTitle: string;
  scoreBoardDescription: string;
  riskLevelExplanations: RichContentBlock[];
  collapsibleList: CollapsibleList[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  createGetContent<OverRisiconiveausData>((context) => {
    const { locale } = context;
    return `*[_type == 'overRisicoNiveaus']{
      "title": title.${locale},
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
      "scoreBoardTitle": scoreBoardTitle.${locale},
      "scoreBoardDescription": scoreBoardDescription.${locale},
      "riskLevelExplanations": {
        "_type": riskLevelExplanations._type,
        "${locale}": [
          ...riskLevelExplanations.${locale}[]
          {
            ...,
            "asset": asset->,
           },
        ]
      },
    }[0]
    `;
  })
);

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const { lastGenerated, content } = props;

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
        <Box px={{ _: 3, sm: 0 }} maxWidth="maxWidthText" mx="auto" spacing={4}>
          <Heading level={1}>{content.title}</Heading>
          <Box textVariant="body1">
            <RichContent blocks={content.description} />
          </Box>
        </Box>

        <Box px={{ _: 3, sm: 0 }} maxWidth="maxWidthText" mx="auto">
          <RichContent blocks={content.riskLevelExplanations} />
        </Box>
      </Content>
    </Layout>
  );
};

export default OverRisicoNiveaus;

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
        mx="auto"
        spacing={4}
      >
        {children}
      </Box>
    </Box>
  );
}
