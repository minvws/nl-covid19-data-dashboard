import Maatregelen from '~/assets/maatregelen.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { Box } from '~/components-styled/base';
import { CategoricalBarScale } from '~/components-styled/categorical-bar-scale';
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
  const { safetyRegionName, text: siteText, content } = props;

  // @TODO
  const text = siteText.veiligheidsregio_positief_geteste_personen;

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
          category={'Inschaling'}
          icon={<Maatregelen fill={theme.colors.restrictions} />}
          title={replaceVariablesInText(
            'Risiconiveau in {{safetyRegionName}}',
            {
              safetyRegionName,
            }
          )}
        />

        <Tile>
          <Heading level={3} as="h2">
            Risiconiveau
          </Heading>

          <Box
            display="flex"
            alignItems="center"
            spacing={{ _: 2, sm: 3 }}
            spacingHorizontal
            width={{ _: '8rem', md: '10rem' }}
          >
            <EscalationLevelIcon level={3} isLarge />
            <InlineText
              fontSize={3}
              fontWeight="bold"
              color={escalationThresholds[3 - 1].color}
            >
              {siteText.escalatie_niveau.types[3].titel}
            </InlineText>
          </Box>
          <Text
            as="div"
            dangerouslySetInnerHTML={{
              __html: '<p>De situatie in deze regio is</p>',
            }}
          />
        </Tile>

        <TwoKpiSection>
          <KpiTile
            title={'Positieve testen'}
            metadata={{
              date: 12345,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={32}
              valueAnnotation="per 100.000 inwoners per week"
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
              value={250}
            />

            <Text
              as="div"
              dangerouslySetInnerHTML={{ __html: '<p>Nullam id dolor</p>' }}
            />
          </KpiTile>

          <KpiTile
            title={'Ziekenhuisopnames (inclusief IC)'}
            metadata={{
              date: 12345,
              source: text.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={18}
              valueAnnotation="per 1 miljoen inwoners per week"
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
              value={18}
            />

            <Text
              as="div"
              dangerouslySetInnerHTML={{ __html: '<p>Nullam id dolor</p>' }}
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
