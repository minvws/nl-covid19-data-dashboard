import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import BarChart from '~/assets/bar-chart.svg';
import Calender from '~/assets/calender.svg';
import Getest from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components/base';
import {
  CategoricalBarScale,
  getCategoryLevel,
} from '~/components/categorical-bar-scale';
import { ChartTile } from '~/components/chart-tile';
import { EscalationLevelInfoLabel } from '~/components/escalation-level';
import { HeadingWithIcon } from '~/components/heading-with-icon';
import { KpiValue } from '~/components/kpi-value';
import { Markdown } from '~/components/markdown';
import { Metadata } from '~/components/metadata';
import { PageInformationBlock } from '~/components/page-information-block';
import { TileList } from '~/components/tile-list';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { InlineText, Text } from '~/components/typography';
import { getEscalationLevelIndexKey } from '~/domain/escalation-level/get-escalation-level-index-key';
import { useEscalationThresholds } from '~/domain/escalation-level/thresholds';
import { Layout } from '~/domain/layout/layout';
import { VrLayout } from '~/domain/layout/vr-layout';
import { useIntl } from '~/intl';
import {
  createPageArticlesQuery,
  PageArticlesQueryResult,
} from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  selectVrPageMetricData,
} from '~/static-props/get-data';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useReverseRouter } from '~/utils/use-reverse-router';
export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectVrPageMetricData(
    'escalation_level',
    'hospital_nice_sum',
    'tested_overall_sum'
  ),
  createGetContent<PageArticlesQueryResult>(() => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('escalationLevelPage', locale);
  })
);

const RegionalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { vrName, content, selectedVrData: data, lastGenerated } = props;

  const { siteText, formatDateFromSeconds, formatNumber } = useIntl();
  const breakpoints = useBreakpoints();
  const router = useRouter();
  const reverseRouter = useReverseRouter();

  const text = siteText.vr_risiconiveau;

  const { escalation_level, hospital_nice_sum, tested_overall_sum } = data;
  const currentLevel = escalation_level.level;

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
      safetyRegionName: vrName,
    }),
    description: replaceVariablesInText(text.metadata.description, {
      safetyRegionName: vrName,
    }),
  };

  const escalationColor = useEscalationColor(currentLevel);

  const vrCode = router.query.code as string;

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <VrLayout data={data} vrName={vrName} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={siteText.veiligheidsregio_layout.headings.inschaling}
            title={replaceVariablesInText(text.titel, {
              safetyRegionName: vrName,
            })}
            description={text.pagina_toelichting}
            referenceLink={text.reference.href}
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
            articles={content.articles}
          />

          <ChartTile title={text.current_escalation_level} disableFullscreen>
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
                <Markdown
                  content={
                    text.types[getEscalationLevelIndexKey(currentLevel)]
                      .toelichting
                  }
                />
                <Text>
                  {replaceVariablesInText(text.momenteel.description_from_to, {
                    last_determined: formatDateFromSeconds(
                      data.escalation_level.last_determined_unix
                    ),
                    risk_level: `'${
                      siteText.escalatie_niveau.types[
                        getEscalationLevelIndexKey(currentLevel)
                      ].titel
                    }'`,
                    next_determined: formatDateFromSeconds(
                      data.escalation_level.next_determined_unix
                    ),
                  })}
                </Text>
              </Box>

              {
                /**
                 * Only display risk level details when there's a known level and
                 * data is available
                 */
                isPresent(currentLevel) &&
                  isPresent(data.escalation_level.positive_tested_per_100k) &&
                  isPresent(
                    data.escalation_level.hospital_admissions_per_million
                  ) && (
                    <Box
                      width={{ _: '100%', lg: '50%' }}
                      pl={{ _: 0, lg: 3 }}
                      mb={3}
                    >
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
                                amount={formatNumber(
                                  data.escalation_level.positive_tested_per_100k
                                )}
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
                                amount={formatNumber(
                                  data.escalation_level
                                    .hospital_admissions_per_million
                                )}
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
                  )
              }
            </Box>

            {!breakpoints.lg && text.momenteel.link_text && (
              <Box mb={3}>
                <Link passHref href={reverseRouter.vr.maatregelen(vrCode)}>
                  {text.momenteel.link_text}
                </Link>
              </Box>
            )}
          </ChartTile>

          <ChartTile title={text.recente_cijfers} disableFullscreen>
            <TwoKpiSection spacing={4}>
              <Box>
                <Box
                  mb={2}
                  ml={-1} // Align icon with text below
                >
                  <HeadingWithIcon
                    title={text.positieve_testen.title}
                    headingLevel={4}
                    icon={<Getest />}
                  />
                </Box>
                <Box spacingHorizontal={2}>
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

                <Box maxWidth="maxWidthText">
                  <CategoricalBarScale
                    categories={positiveTestedEscalationThresholds}
                    value={tested_overall_sum.last_value.infected_per_100k}
                  />
                </Box>

                <Markdown content={text.positieve_testen.description} />

                <Metadata
                  date={[
                    tested_overall_sum.last_value.date_start_unix,
                    tested_overall_sum.last_value.date_end_unix,
                  ]}
                  source={text.bronnen.rivm_positieve_testen_kpi}
                  mb={{ _: 0, lg: -3 }}
                  isTileFooter
                />
              </Box>

              <Box>
                <Box
                  mb={2}
                  ml={-2} // Align icon with text below
                >
                  <HeadingWithIcon
                    title={text.ziekenhuisopnames.title}
                    headingLevel={4}
                    icon={<Ziekenhuis />}
                  />
                </Box>
                <Box spacingHorizontal={2}>
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

                <Box maxWidth="maxWidthText">
                  <CategoricalBarScale
                    categories={hospitalAdmissionsEscalationThresholds}
                    value={hospital_nice_sum.last_value.admissions_per_1m}
                  />
                </Box>

                <Markdown content={text.ziekenhuisopnames.description} />

                <Metadata
                  date={[
                    hospital_nice_sum.last_value.date_start_unix,
                    hospital_nice_sum.last_value.date_end_unix,
                  ]}
                  source={text.bronnen.rivm_ziekenhuisopnames_kpi}
                  isTileFooter
                />
              </Box>
            </TwoKpiSection>
          </ChartTile>
        </TileList>
      </VrLayout>
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
        <Box
          display={{ _: 'block', xs: 'flex' }}
          flexWrap="wrap"
          css={css({ whiteSpace: 'pre-wrap' })}
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
        </Box>
      </Box>
      {children}
    </li>
  );
}

interface DataDescriptionProps {
  escalationColor: string;
  description: string;
  amount: string;
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
      <Text>
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
