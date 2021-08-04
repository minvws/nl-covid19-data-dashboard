import { EscalationLevels, VrGeoProperties } from '@corona-dashboard/common';
import css from '@styled-system/css';
import Head from 'next/head';
import { ReactNode } from 'react';
import styled from 'styled-components';
import BarChart from '~/assets/bar-chart.svg';
import Calender from '~/assets/calender.svg';
import { Box } from '~/components/base';
import { VrChoropleth } from '~/components/choropleth';
import { VrEscalationTooltip } from '~/components/choropleth/tooltips';
import { RichContent } from '~/components/cms/rich-content';
import { ErrorBoundary } from '~/components/error-boundary';
import { Heading, InlineText, Text } from '~/components/typography';
import { Scoreboard } from '~/domain/escalation-level/scoreboard';
import { selectScoreboardData } from '~/domain/escalation-level/scoreboard/select-scoreboard-data';
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
} from '~/static-props/get-data';
import { asResponsiveArray } from '~/style/utils';
import { CollapsibleList, RichContentBlock } from '~/types/cms';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useEscalationColor } from '~/utils/use-escalation-color';

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
  selectScoreboardData,
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
            "asset": asset->,

            "content": {
              "_type": "localeCollapsible",
              "${locale}": [
                ...content.${locale}[]{
                  ...,
                  "asset": asset->,

                  "content": {
                    "_type": "localeCollapsible",
                    "${locale}": [
                      ...content.${locale}[]{
                        ...,
                        "asset": asset->
                      }
                    ]
                  }
                }
              ]
            }
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

  const unknownLevelColor = useEscalationColor(null);

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

        <Box
          display="flex"
          pt={4}
          px={{ _: 3, sm: 0 }}
          borderTopStyle="solid"
          borderTopWidth="1px"
          borderTopColor="lightGray"
          flexDirection={{ _: 'column', sm: 'row' }}
          spacing={{ _: 4, md: 0 }}
        >
          <Box display="flex" justifyContent="center">
            <Box
              p={1}
              minWidth={{ _: '30rem', sm: '17.25rem', lg: '20rem' }}
              minHeight={{ _: '20rem', sm: 0 }}
            >
              <ErrorBoundary>
                <VrChoropleth
                  accessibility={{ key: 'escalation_levels_choropleth' }}
                  minHeight={200}
                  data={choropleth.vr}
                  metricName="escalation_levels"
                  noDataFillColor={unknownLevelColor}
                  metricProperty="level"
                  tooltipContent={(
                    context: VrGeoProperties & EscalationLevels
                  ) => <VrEscalationTooltip context={context} hideValidFrom />}
                />
              </ErrorBoundary>
            </Box>
          </Box>
          <Box flex={1} maxWidth="maxWidthText" spacing={3}>
            <Heading level={3} as="h2">
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
