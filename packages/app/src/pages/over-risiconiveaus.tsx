import {
  EscalationLevels,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { flatten } from 'lodash';
import Head from 'next/head';
import { ReactNode } from 'react';
import styled from 'styled-components';
import BarChart from '~/assets/bar-chart.svg';
import Calender from '~/assets/calender.svg';
import { Box } from '~/components/base';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { EscalationRegionalTooltip } from '~/components/choropleth/tooltips/region/escalation-regional-tooltip';
import { RichContent } from '~/components/cms/rich-content';
import { Heading, InlineText, Text } from '~/components/typography';
import { vrData } from '~/data/vr';
import {
  Scoreboard,
  ScoreboardRow,
} from '~/domain/escalation-level/scoreboard';
import { Layout } from '~/domain/layout/layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  loadAndSortVrData,
  selectData,
} from '~/static-props/get-data';
import { asResponsiveArray } from '~/style/utils';
import { CollapsibleList, RichContentBlock } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';

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
  selectData(() => {
    const scoreboardRows = vrData.reduce<ScoreboardRow[]>(
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
      [1, 2, 3, 4].map<ScoreboardRow>((x) => ({
        escalationLevel: x as 1 | 2 | 3 | 4,
        vrData: [],
      }))
    );
    scoreboardRows.forEach((x) =>
      x.vrData.sort((a, b) =>
        a.safetyRegionName.localeCompare(b.safetyRegionName)
      )
    );

    const allScoreboardRows = flatten(
      scoreboardRows.map((row) => row.vrData)
    ).map((vr) => vr.data);

    const maxHospitalAdmissionsPerMillion = Math.max(
      ...allScoreboardRows.map((data) => data.hospital_admissions_per_million)
    );
    const maxPositiveTestedPer100k = Math.max(
      ...allScoreboardRows.map((data) => data.positive_tested_per_100k)
    );

    return {
      scoreboardRows,
      maxHospitalAdmissionsPerMillion,
      maxPositiveTestedPer100k,
    };
  }),
  createGetChoroplethData({
    vr: ({ escalation_levels }) => ({ escalation_levels }),
  }),
  createGetContent<OverRisiconiveausData>((_) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE;
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
            "asset": asset->
           },
        ]
      },
    }[0]
    `;
  })
);

const OverRisicoNiveaus = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText } = useIntl();
  const {
    lastGenerated,
    scoreboardRows,
    content,
    choropleth,
    maxHospitalAdmissionsPerMillion,
    maxPositiveTestedPer100k,
  } = props;

  const lastValue = scoreboardRows.find((x) => x.vrData.length)?.vrData[0].data;

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
          <Heading level={1}>{content.title}</Heading>
          <RichContent blocks={content.description} />
        </Box>
        <Box
          display="flex"
          py={{ _: 2, sm: 4 }}
          px={{ _: 3, sm: 0 }}
          borderTopStyle="solid"
          borderTopWidth="1px"
          borderTopColor="lightGray"
          flexDirection={{ _: 'column', sm: 'row' }}
        >
          <Box display="flex" justifyContent="center" py={{ _: 2, sm: 0 }}>
            <Box
              p={1}
              minWidth={{ _: '30rem', sm: '17.25rem', lg: '20rem' }}
              minHeight={{ _: '20rem', sm: 0 }}
              flex={0}
            >
              <SafetyRegionChoropleth
                minHeight={200}
                data={choropleth.vr}
                metricName="escalation_levels"
                metricProperty="level"
                tooltipContent={(
                  context: SafetyRegionProperties & EscalationLevels
                ) => (
                  <EscalationRegionalTooltip context={context} hideValidFrom />
                )}
              />
            </Box>
          </Box>
          <Box pr={{ md: 4 }} flex={1} maxWidth="maxWidthText">
            <Heading level={3} as={'h2'}>
              {content.scoreBoardTitle}
            </Heading>
            <Text>{content.scoreBoardDescription}</Text>
            {lastValue && (
              <UnorderedList>
                <ListItem
                  title={
                    siteText.over_risiconiveaus.scoreboard.current_level
                      .last_determined
                  }
                  icon={<Calender />}
                  date={lastValue.last_determined_unix}
                />
                <ListItem
                  title={
                    siteText.over_risiconiveaus.scoreboard.current_level
                      .established_with
                  }
                  icon={<BarChart />}
                  date={[
                    lastValue.based_on_statistics_from_unix,
                    lastValue.based_on_statistics_to_unix,
                  ]}
                />
                <ListItem
                  title={
                    siteText.over_risiconiveaus.scoreboard.current_level
                      .next_determined
                  }
                  icon={<Calender />}
                  date={lastValue.next_determined_unix}
                />
              </UnorderedList>
            )}
          </Box>
        </Box>
        <Scoreboard
          rows={scoreboardRows}
          maxHospitalAdmissionsPerMillion={maxHospitalAdmissionsPerMillion}
          maxPositiveTestedPer100k={maxPositiveTestedPer100k}
        />
        <Box mt={5} px={{ _: 3, sm: 0 }} maxWidth="maxWidthText" mx="auto">
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

export function Content({ children }: ContentProps) {
  return (
    <Box bg="white" fontSize={{ md: '1.125rem' }}>
      <Box pt={5} pb={5} px={{ _: 3, sm: 0 }} maxWidth="infoWidth" mx="auto">
        {children}
      </Box>
    </Box>
  );
}

const UnorderedList = styled.ul(
  css({
    m: 0,
    px: 0,
    py: asResponsiveArray({ _: 2, sm: 0 }),
    listStyleType: 'none',

    svg: {
      width: '100%',
    },
  })
);

interface ListItemProps {
  icon: ReactNode;
  title: string;
  date?: number | number[];
  children?: ReactNode;
  isAroundDate?: boolean;
}

function ListItem({
  title,
  date,
  icon,
  children,
  isAroundDate,
}: ListItemProps) {
  const { siteText, formatDateFromSeconds } = useIntl();

  return (
    <li
      css={css({
        paddingBottom: 1,
        marginBottom: 1,
      })}
    >
      <Box display="flex">
        <Box
          display="flex"
          alignItems="center"
          minWidth="26px"
          width={26}
          height={18}
          mt="2px"
          mr={2}
        >
          {icon}
        </Box>
        <Text
          m={0}
          css={css({
            display: asResponsiveArray({ _: 'block', xs: 'flex' }),
            flexWrap: 'wrap',
            whiteSpace: 'pre-wrap',
          })}
        >
          <InlineText fontWeight="bold">{`${title} `}</InlineText>
          {date && (
            <span>
              {Array.isArray(date)
                ? replaceVariablesInText(
                    siteText.vr_risiconiveau.momenteel.established_with
                      .description,
                    {
                      based_from: formatDateFromSeconds(date[0]),
                      based_to: formatDateFromSeconds(date[1]),
                    }
                  )
                : `${
                    isAroundDate ? `${siteText.common.rond} ` : ''
                  }${formatDateFromSeconds(date)}`}
            </span>
          )}
        </Text>
      </Box>
      {children}
    </li>
  );
}
