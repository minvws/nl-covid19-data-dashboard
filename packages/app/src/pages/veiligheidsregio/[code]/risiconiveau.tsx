import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import {
  CategoricalBarScale,
  getCategoryLevel,
} from '~/components-styled/categorical-bar-scale';
import { ContentHeader } from '~/components-styled/content-header';
import { EscalationLevelInfoLabel } from '~/components-styled/escalation-level';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { useEscalationThresholds } from '~/domain/escalation-level/thresholds';
import { EscalationLevel } from '~/domain/restrictions/type';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getVrData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useIntl } from '~/intl';
import { Layout } from '~/domain/layout/layout';
import { SafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { Markdown } from '~/components-styled/markdown';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData,
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('escalationLevelPage', locale);
  })
);

const RegionalRestrictions = (props: StaticProps<typeof getStaticProps>) => {
  const { safetyRegionName, content, data, lastGenerated } = props;

  const { siteText, formatDateFromSeconds } = useIntl();

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

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <SafetyRegionLayout data={data} lastGenerated={lastGenerated}>
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

            <Box
              display={{ _: 'block', sm: 'flex' }}
              spacing={3}
              spacingHorizontal
            >
              <Box flex="0 0 10rem">
                <EscalationLevelInfoLabel
                  level={currentLevel}
                  fontSize={3}
                  useLevelColor
                />
              </Box>
              {/* alignment with baseline of EscalationLevelInfoLabel */}

              <Box mt={{ sm: '-.55rem' }}>
                <Box mb={3}>
                  <Markdown content={text.types[currentLevel].toelichting} />
                </Box>
                <Text fontWeight="bold">
                  {replaceVariablesInText(
                    text.escalation_level_last_determined,
                    {
                      last_determined: formatDateFromSeconds(
                        data.escalation_level.last_determined_unix
                      ),
                      based_from: formatDateFromSeconds(
                        data.escalation_level.based_on_statistics_from_unix
                      ),
                      based_to: formatDateFromSeconds(
                        data.escalation_level.based_on_statistics_to_unix
                      ),
                      next_determined: formatDateFromSeconds(
                        data.escalation_level.next_determined_unix
                      ),
                    }
                  )}
                </Text>
              </Box>
            </Box>
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

export default RegionalRestrictions;
