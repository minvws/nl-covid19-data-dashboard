import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import styled from 'styled-components';
import BarChart from '~/assets/bar-chart.svg';
import Calender from '~/assets/calender.svg';
import Getest from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import {
  CategoricalBarScale,
  getCategoryLevel,
} from '~/components/categorical-bar-scale';
import { ContentHeader } from '~/components/content-header';
import {
  EscalationLevelInfoLabel,
  EscalationLevelString,
} from '~/components/escalation-level';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, InlineText, Text } from '~/components/typography';
import { useEscalationThresholds } from '~/domain/escalation-level/thresholds';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { EscalationLevel } from '~/domain/restrictions/type';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useEscalationColor } from '~/utils/use-escalation-color';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData(
    'escalation_level',
    'hospital_nice_sum',
    'tested_overall_sum'
  ),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('escalationLevelPage', locale);
  })
);

const RegionalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const {
    safetyRegionName,
    content,
    selectedVrData: data,
    lastGenerated,
  } = props;

  const { siteText, formatDateFromSeconds } = useIntl();
  const breakpoints = useBreakpoints();
  const router = useRouter();

  const text = siteText.vr_risiconiveau;

  const { escalation_level, hospital_nice_sum, tested_overall_sum } = data;
  const currentLevel = escalation_level.level as EscalationLevel;

  const {
    hospitalAdmissionsEscalationThresholds,
    positiveTestedEscalationThresholds,
  } = useEscalationThresholds();

  const positiveTestedColor = useEscalationColor(
    getCategoryLevel(
      positiveTestedEscalationThresholds,
      tested_overall_sum.last_value.infected_per_100k
    )
  );

  const hospitalAdmissionsColor = useEscalationColor(
    getCategoryLevel(
      hospitalAdmissionsEscalationThresholds,
      hospital_nice_sum.last_value.admissions_per_1m
    )
  );

  const metadata = {
    ...siteText.veiligheidsregio_index.metadata,
    title: replaceVariablesInText(text.metadata.title, {
      safetyRegionName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName,
    }),
  };

  const escalationColor = useEscalationColor(currentLevel);

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout
        data={data}
        safetyRegionName={safetyRegionName}
        lastGenerated={lastGenerated}
      >
        <TileList>
          <ContentHeader
            category={siteText.veiligheidsregio_layout.headings.inschaling}
            title={replaceVariablesInText(text.titel, {
              safetyRegionName,
            })}
            subtitle={text.pagina_toelichting}
            reference={text.reference}
            metadata={{
              datumsText: text.datums,
              dateOrRange: hospital_nice_sum.last_value.date_end_unix,
              dateOfInsertionUnix:
                hospital_nice_sum.last_value.date_of_insertion_unix,
              dataSources: [
                text.bronnen.rivm_positieve_testen,
                text.bronnen.rivm_ziekenhuisopnames,
              ],
            }}
          />

          <Tile>
            <Heading level={3} as="h2">
              {text.current_escalation_level}
            </Heading>
            <Box display="flex" flexDirection={{ _: 'column', lg: 'row' }}>
              <Box width={{ _: '100%', lg: '50%' }} pr={{ _: 0, lg: 3 }}>
                <Box mb={3}>
                  <EscalationLevelInfoLabel
                    level={currentLevel}
                    fontSize={4}
                    useLevelColor
                    size="large"
                  />
                </Box>
                <Markdown content={text.types[currentLevel].toelichting} />
                <Text>
                  {replaceVariablesInText(text.momenteel.description_from_to, {
                    last_determined: formatDateFromSeconds(
                      data.escalation_level.last_determined_unix
                    ),
                    risk_level: `'${
                      siteText.escalatie_niveau.types[
                        currentLevel.toString() as EscalationLevelString
                      ].titel
                    }'`,
                    next_determined: formatDateFromSeconds(
                      data.escalation_level.next_determined_unix
                    ),
                  })}
                </Text>
              </Box>
              <Box width={{ _: '100%', lg: '50%' }} pl={{ _: 0, lg: 3 }} mb={3}>
                <UnorderedList>
                  <ListItem
                    title={text.momenteel.last_determined}
                    icon={<Calender />}
                    date={data.escalation_level.last_determined_unix}
                  />
                  <ListItem
                    title={text.momenteel.established_with.title}
                    icon={<BarChart />}
                    date={[
                      data.escalation_level.based_on_statistics_from_unix,
                      data.escalation_level.based_on_statistics_to_unix,
                    ]}
                  >
                    <UnorderedList>
                      <ListItem
                        title={text.momenteel.positive_tests.title}
                        icon={<Getest />}
                      >
                        <DataDescription
                          description={
                            text.momenteel.positive_tests.description
                          }
                          escalationColor={escalationColor}
                          amount={
                            data.escalation_level.positive_tested_per_100k
                          }
                        />
                      </ListItem>
                      <ListItem
                        title={text.momenteel.hospital_admissions.title}
                        icon={<Ziekenhuis />}
                      >
                        <DataDescription
                          description={
                            text.momenteel.hospital_admissions.description
                          }
                          escalationColor={escalationColor}
                          amount={
                            data.escalation_level
                              .hospital_admissions_per_million
                          }
                        />
                      </ListItem>
                    </UnorderedList>
                  </ListItem>
                  <ListItem
                    title={text.momenteel.next_determined}
                    icon={<Calender />}
                    date={data.escalation_level.next_determined_unix}
                    isAroundDate
                  />
                </UnorderedList>
              </Box>
            </Box>

            {!breakpoints.lg && text.momenteel.link_text && (
              <Box mb={3}>
                <Link
                  passHref
                  href={`/veiligheidsregio/${router.query.code}/maatregelen`}
                >
                  {text.momenteel.link_text}
                </Link>
              </Box>
            )}
          </Tile>

          <TwoKpiSection>
            <KpiTile
              title={text.positieve_testen.title}
              metadata={{
                date: [
                  tested_overall_sum.last_value.date_start_unix,
                  tested_overall_sum.last_value.date_end_unix,
                ],
                source: text.bronnen.rivm_positieve_testen_kpi,
              }}
            >
              <Box spacing={2} spacingHorizontal>
                <Box display="inline-block">
                  <KpiValue
                    data-cy="infected"
                    absolute={tested_overall_sum.last_value.infected_per_100k}
                    color={positiveTestedColor}
                  />
                </Box>
                <InlineText>
                  {text.positieve_testen.value_annotation}
                </InlineText>
              </Box>

              <CategoricalBarScale
                categories={positiveTestedEscalationThresholds}
                value={tested_overall_sum.last_value.infected_per_100k}
              />

              <Markdown content={text.positieve_testen.description} />
            </KpiTile>

            <KpiTile
              title={text.ziekenhuisopnames.title}
              metadata={{
                date: [
                  hospital_nice_sum.last_value.date_start_unix,
                  hospital_nice_sum.last_value.date_end_unix,
                ],
                source: text.bronnen.rivm_ziekenhuisopnames_kpi,
              }}
            >
              <Box spacing={2} spacingHorizontal>
                <Box display="inline-block">
                  <KpiValue
                    data-cy="infected"
                    absolute={hospital_nice_sum.last_value.admissions_per_1m}
                    color={hospitalAdmissionsColor}
                  />
                </Box>
                <InlineText>
                  {text.ziekenhuisopnames.value_annotation}
                </InlineText>
              </Box>

              <CategoricalBarScale
                categories={hospitalAdmissionsEscalationThresholds}
                value={hospital_nice_sum.last_value.admissions_per_1m}
              />

              <Markdown content={text.ziekenhuisopnames.description} />
            </KpiTile>
          </TwoKpiSection>

          <ArticleStrip articles={content.articles} />
        </TileList>
      </SafetyRegionLayout>
    </Layout>
  );
};

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
        paddingBottom: 3,
        marginBottom: 3,
        borderBottom: '1px solid',
        borderBottomColor: 'border',
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

interface DataDescriptionProps {
  escalationColor: string;
  description: string;
  amount: number;
}

function DataDescription({
  description,
  escalationColor,
  amount,
}: DataDescriptionProps) {
  return (
    <Box display="flex" pl={18} ml={2}>
      <Box
        minWidth="9px"
        height={9}
        width={9}
        backgroundColor={escalationColor}
        borderRadius="50%"
        ml={2}
        mr={1}
        mt="7px"
      />
      <Text m={0}>
        {replaceComponentsInText(description, {
          amount: <InlineText fontWeight="bold">{amount}</InlineText>,
        })}
      </Text>
    </Box>
  );
}

const UnorderedList = styled.ul(() =>
  css({
    margin: 0,
    padding: 0,
    listStyleType: 'none',

    svg: {
      width: '100%',
    },

    'ul:first-of-type li': {
      borderBottom: 0,
      marginBottom: 0,
    },

    ul: {
      pl: 22,
      ml: 2,

      'li:first-of-type': {
        pt: 3,
      },
    },

    li: {
      '&:last-of-type': {
        padding: 0,
        borderBottom: 0,
      },
    },
  })
);

export default RegionalRestrictions;
