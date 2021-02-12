import Maatregelen from '~/assets/maatregelen.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import {
  CategoricalBarScale,
  getMetricLevel,
} from '~/components-styled/categorical-bar-scale';
import { ContentHeader } from '~/components-styled/content-header';
import { EscalationLevelIcon } from '~/components-styled/escalation-level-icon';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { SEOHead } from '~/components-styled/seo-head';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetContent,
  getLastGeneratedDate,
  getText,
  getVrData,
} from '~/static-props/get-data';
import theme, { colors } from '~/style/theme';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getText,
  getVrData,
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('hospitalPage')) // @TODO
);

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;

const RegionalRestrictions: FCWithLayout<typeof getStaticProps> = (props) => {
  const { safetyRegionName, text: siteText, content, data } = props;

  const text = siteText.vr_risiconiveau;

  const { escalation_level, hospital_nice_sum, tested_overall_sum } = data;
  const currentLevel = escalation_level.level as 1 | 2 | 3 | 4;

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
          icon={<Maatregelen fill={theme.colors.restrictions} />}
          title={replaceVariablesInText(text.titel, {
            safetyRegionName,
          })}
          subtitle={siteText.veiligheidsregio_layout.headings.inschaling}
          reference={{ text: '', href: '' }}
        />

        <Tile>
          <Heading level={3} as="h2">
            {text.current_escalation_level}
          </Heading>

          <Box
            display="flex"
            alignItems="center"
            spacing={{ _: 2, sm: 3 }}
            spacingHorizontal
            width={{ _: '8rem', md: '10rem' }}
          >
            <EscalationLevelIcon level={currentLevel} isLarge />
            <InlineText
              fontSize={3}
              fontWeight="bold"
              color={escalationThresholds[currentLevel].color}
            >
              {siteText.escalatie_niveau.types[currentLevel].titel}
            </InlineText>
          </Box>
          <Text>
            {siteText.escalatie_niveau.types[currentLevel].toelichting}
          </Text>
        </Tile>

        <TwoKpiSection>
          <KpiTile
            title={text.positieve_testen.title}
            metadata={{
              date: 12345,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={32}
              valueAnnotation={text.positieve_testen.value_annotation}
              color={
                colors.data.scale.magenta[
                  getMetricLevel(
                    [
                      {
                        name: 'Waakzaam',
                        threshold: 0,
                        color: colors.data.scale.magenta[0],
                      },
                      {
                        name: 'Zorgelijk',
                        threshold: 35,
                        color: colors.data.scale.magenta[1],
                      },
                      {
                        name: 'Ernstig',
                        threshold: 100,
                        color: colors.data.scale.magenta[2],
                      },
                      {
                        name: 'Zeer ernstig',
                        threshold: 250,
                        color: colors.data.scale.magenta[3],
                      },
                      {
                        threshold: 300,
                      },
                    ],
                    tested_overall_sum.last_value.infected_per_100k
                  )
                ]
              }
            />

            <CategoricalBarScale
              categories={[
                {
                  name: 'Waakzaam',
                  threshold: 0,
                  color: colors.data.scale.magenta[0],
                },
                {
                  name: 'Zorgelijk',
                  threshold: 35,
                  color: colors.data.scale.magenta[1],
                },
                {
                  name: 'Ernstig',
                  threshold: 100,
                  color: colors.data.scale.magenta[2],
                },
                {
                  name: 'Zeer ernstig',
                  threshold: 250,
                  color: colors.data.scale.magenta[3],
                },
                {
                  threshold: 300,
                },
              ]}
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
              date: 12345,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={18}
              valueAnnotation={text.ziekenhuisopnames.value_annotation}
              color={colors.data.scale.magenta[3 - 1]}
            />

            <CategoricalBarScale
              categories={[
                {
                  name: 'Waakzaam',
                  threshold: 0,
                  color: colors.data.scale.magenta[0],
                },
                {
                  name: 'Zorgelijk',
                  threshold: 4,
                  color: colors.data.scale.magenta[1],
                },
                {
                  name: 'Ernstig',
                  threshold: 16,
                  color: colors.data.scale.magenta[2],
                },
                {
                  name: 'Zeer ernstig',
                  threshold: 27,
                  color: colors.data.scale.magenta[3],
                },
                {
                  threshold: 30,
                },
              ]}
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
