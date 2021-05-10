import css from '@styled-system/css';
import Head from 'next/head';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import { Heading } from '~/components/typography';
import { vrData } from '~/data/vr';
import {
  Scoreboard,
  ScoreBoardData,
} from '~/domain/escalation-level/scoreboard';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  loadAndSortVrData,
  selectData,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { CollapsibleList, RichContentBlock } from '~/types/cms';

interface OverRisiconiveausData {
  title: string | null;
  description: RichContentBlock[] | null;
  collapsibleList: CollapsibleList[];
}

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(),
  selectData(() => {
    const scoreboardData = vrData.reduce<ScoreBoardData[]>(
      (sbData, vr) => {
        const vrData = loadAndSortVrData(vr.code);
        const index = vrData.escalation_level.level - 1;

        sbData[index].vrData.push({
          data: vrData.escalation_level,
          safetyRegionName: vr.name,
          vrCode: vr.code,
        });

        return sbData;
      },
      [1, 2, 3, 4].map<ScoreBoardData>((x) => ({
        escalatationLevel: x as 1 | 2 | 3 | 4,
        vrData: [],
      }))
    );

    return {
      scoreboardData,
    };
  }),
  createGetContent<OverRisiconiveausData>((_) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE;
    return `*[_type == 'overRisicoNiveaus']{
      ...,
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
      "collapsibleList": [...collapsibleList[]
        {
          "content":  [
              ...content.${locale}[]
              {
                ...,
                "asset": asset->
               },
            ],
          "title": title.${locale}
      }]
    }[0]
    `;
  })
);

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const {
    selectedNlData: data,
    lastGenerated,
    scoreboardData,
    content,
  } = props;

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
        <Box pb={3} px={{ _: 3, sm: 0 }} maxWidth="maxWidthText" mx="auto">
          {content.title && <Heading level={1}>{content.title}</Heading>}
          {content.description && <RichContent blocks={content.description} />}
        </Box>
        <Scoreboard data={scoreboardData} />
      </Content>
    </Layout>
  );
};

export default OverRisicoNiveaus;

interface ContentProps {
  children: ReactNode;
}

export function Content({ children }: ContentProps) {
  return (
    <StyledBox>
      <Box pt={5} pb={5} px={{ _: 3, sm: 0 }} maxWidth={1000} mx="auto">
        {children}
      </Box>
    </StyledBox>
  );
}

const StyledBox = styled(Box)(
  css({
    bg: 'white',
    fontSize: '1.125rem',
  })
);
