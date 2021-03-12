import { css } from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import Gedrag from '~/assets/gedrag.svg';
import Phone from '~/assets/phone.svg';
import { ArticleStrip } from '~/components-styled/article-strip';
import { ArticleSummary } from '~/components-styled/article-teaser';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { SEOHead } from '~/components-styled/seo-head';
import { Tile } from '~/components-styled/tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Heading, Text } from '~/components-styled/typography';
import { BehaviorChoroplethTile } from '~/domain/behavior/behavior-choropleth-tile';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  getNlData,
} from '~/static-props/get-data';
import { formatNumber } from '~/utils/formatNumber';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';
import { TimeSeriesChart } from '~/components-styled/time-series-chart';
import { ChartTileWithTimeframe } from '~/components-styled/chart-tile';
import { ParentSize } from '@visx/responsive';
import { colors } from '~/style/theme';
import { LineChartTile } from '~/components-styled/line-chart-tile';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetChoroplethData({
    vr: ({ behavior }) => ({ behavior }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>(createPageArticlesQuery('behaviorPage'))
);

const BehaviorPage: FCWithLayout<typeof getStaticProps> = ({
  data,
  choropleth,
  content,
}) => {
  const behaviorLastValue = data.behavior.last_value;
  const { nl_gedrag, corona_melder_app } = siteText;

  return (
    <>
      <SEOHead
        title={nl_gedrag.metadata.title}
        description={nl_gedrag.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.gedrag}
          title={nl_gedrag.pagina.titel}
          icon={<Gedrag />}
          subtitle={nl_gedrag.pagina.toelichting}
          metadata={{
            datumsText: nl_gedrag.datums,
            dateOrRange: {
              start: behaviorLastValue.date_start_unix,
              end: behaviorLastValue.date_end_unix,
            },
            dateOfInsertionUnix: behaviorLastValue.date_of_insertion_unix,
            dataSources: [nl_gedrag.bronnen.rivm],
          }}
          reference={nl_gedrag.reference}
        />

        <LineChartTile
          timeframeOptions={['all', '5weeks', 'week']}
          title={corona_melder_app.linechart.title}
          ariaDescription={''}
          description={corona_melder_app.linechart.description}
          values={data.corona_melder_app.values}
          linesConfig={[
            {
              metricProperty: 'warned_daily',
            },
          ]}
          metadata={{
            source: corona_melder_app.linechart.bronnen.coronamelder,
          }}
        />

        <ArticleStrip articles={content.articles} />

        <TwoKpiSection>
          <Tile height="100%">
            <Heading level={3}>{nl_gedrag.onderzoek_uitleg.titel}</Heading>
            <Text>{nl_gedrag.onderzoek_uitleg.toelichting}</Text>
          </Tile>

          <KpiTile
            title={nl_gedrag.kpi.aantal_respondenten.titel}
            metadata={{
              source: nl_gedrag.kpi.aantal_respondenten.bron,
              date: [
                behaviorLastValue.date_start_unix,
                behaviorLastValue.date_end_unix,
              ],
            }}
          >
            <KpiValue absolute={behaviorLastValue.number_of_participants} />
            <Text>{nl_gedrag.kpi.aantal_respondenten.toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <BehaviorTableTile
          behavior={behaviorLastValue}
          title={nl_gedrag.basisregels.title}
          introduction={nl_gedrag.basisregels.intro}
          footer={nl_gedrag.basisregels.voetnoot}
          footerAsterisk={nl_gedrag.basisregels.voetnoot_asterisk}
        />

        <BehaviorLineChartTile
          values={data.behavior.values}
          title={nl_gedrag.basisregels_over_tijd.title}
          introduction={nl_gedrag.basisregels_over_tijd.intro}
        />

        <BehaviorChoroplethTile data={choropleth.vr} />

        <MoreInformation />

        <ContentHeader
          category={corona_melder_app.header.category}
          title={corona_melder_app.header.title}
          icon={<Phone />}
          subtitle={corona_melder_app.header.description}
          metadata={{
            datumsText: corona_melder_app.header.datums,
            dateOrRange: data.corona_melder_app.last_value.date_unix,
            dateOfInsertionUnix:
              data.corona_melder_app.last_value.date_of_insertion_unix,
            dataSources: [corona_melder_app.header.bronnen.rivm],
          }}
          reference={corona_melder_app.header.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={corona_melder_app.waarschuwingen.title}
            metadata={{
              date: data.corona_melder_app.last_value.date_unix,
              source: corona_melder_app.header.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected"
              absolute={data.corona_melder_app.last_value.warned_daily}
              difference={data.difference.corona_melder_app__warned_daily}
            />

            <Text>{corona_melder_app.waarschuwingen.description}</Text>
            <Text>
              {replaceComponentsInText(corona_melder_app.waarschuwingen.total, {
                totalDownloads: (
                  <span
                    css={css({ color: 'data.primary', fontWeight: 'bold' })}
                  >
                    {formatNumber(
                      data.corona_melder_app?.last_value.downloaded_total
                    )}
                  </span>
                ),
              })}
            </Text>
          </KpiTile>

          <Tile>
            <Heading level={3}>{corona_melder_app.rapport.title}</Heading>
            <Text>{corona_melder_app.rapport.description}</Text>

            <Link href={corona_melder_app.rapport.link.href} passHref>
              <a target="_blank" css={css({ display: 'flex' })}>
                <IconContainer>
                  <ExternalLinkIcon />
                </IconContainer>
                <span css={css({ maxWidth: 200 })}>
                  {corona_melder_app.rapport.link.text}
                </span>
              </a>
            </Link>
          </Tile>
        </TwoKpiSection>

        <ChartTileWithTimeframe
          metadata={{
            source: corona_melder_app.linechart.bronnen.coronamelder,
          }}
          title={corona_melder_app.linechart.title}
          description={corona_melder_app.linechart.description}
        >
          {(timeframe) => (
            <ParentSize>
              {({ width }) => (
                <TimeSeriesChart
                  title={corona_melder_app.linechart.tooltip.title}
                  timeframe={timeframe}
                  width={width}
                  values={data.corona_melder_app.values}
                  showDateMarker
                  ariaLabelledBy=""
                  paddingLeft={40}
                  seriesConfig={[
                    {
                      type: 'area',
                      metricProperty: 'warned_daily',
                      label: corona_melder_app.linechart.tooltip.warnings,
                      color: colors.data.primary,
                    },
                  ]}
                />
              )}
            </ParentSize>
          )}
        </ChartTileWithTimeframe>
      </TileList>
    </>
  );
};

BehaviorPage.getLayout = getNationalLayout;

export default BehaviorPage;

const IconContainer = styled.span(
  css({
    marginRight: 3,
    color: 'gray',
    height: 25,
    width: 25,
  })
);
