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
import { SEOHead } from '~/components-styled/seo-head';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import {
  hospitalAdmissionsEscalationThresholds,
  positiveTestedEscalationThresholds,
} from '~/domain/escalation-level/thresholds';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { EscalationLevel } from '~/domain/restrictions/type';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useEscalationColor } from '~/utils/use-escalation-color';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getVrData,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('escalationLevelPage'))
);

const RegionalRestrictions: FCWithLayout<typeof getStaticProps> = (props) => {
  const { safetyRegionName, text: siteText, content, data } = props;

  const text = siteText.vr_risiconiveau;

  const { escalation_level, hospital_nice_sum, tested_overall_sum } = data;
  const currentLevel = escalation_level.level as EscalationLevel;

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

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(text.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(text.metadata.description, {
          safetyRegionName,
        })}
      />
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
            <Box mt={{ sm: '-0.55rem' }}>
              <Text>
                {siteText.escalatie_niveau.types[currentLevel].toelichting}
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
              source: text.bronnen.rivm_positieve_testen,
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
              <InlineText>{text.positieve_testen.value_annotation}</InlineText>
            </Box>

            <CategoricalBarScale
              categories={positiveTestedEscalationThresholds}
              value={tested_overall_sum.last_value.infected_per_100k}
            />

            <Text
              as="div"
              dangerouslySetInnerHTML={{
                __html: text.positieve_testen.description,
              }}
            />
          </KpiTile>

          <KpiTile
            title={text.ziekenhuisopnames.title}
            metadata={{
              date: [
                hospital_nice_sum.last_value.date_start_unix,
                hospital_nice_sum.last_value.date_end_unix,
              ],
              source: text.bronnen.rivm_ziekenhuisopnames,
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
              <InlineText>{text.ziekenhuisopnames.value_annotation}</InlineText>
            </Box>

            <CategoricalBarScale
              categories={hospitalAdmissionsEscalationThresholds}
              value={hospital_nice_sum.last_value.admissions_per_1m}
            />

            <Text
              as="div"
              dangerouslySetInnerHTML={{
                __html: text.ziekenhuisopnames.description,
              }}
            />
          </KpiTile>
        </TwoKpiSection>

        <ArticleStrip articles={content.articles} />
      </TileList>
    </>
  );
};

RegionalRestrictions.getLayout = getSafetyRegionLayout();

export default RegionalRestrictions;
