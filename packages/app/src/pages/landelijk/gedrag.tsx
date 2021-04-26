import { css } from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import Gedrag from '~/assets/gedrag.svg';
import Phone from '~/assets/phone.svg';
import { ArticleStrip } from '~/components/article-strip';
import { ArticleSummary } from '~/components/article-teaser';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, Text } from '~/components/typography';
import { BehaviorChoroplethTile } from '~/domain/behavior/behavior-choropleth-tile';
import { BehaviorLineChartTile } from '~/domain/behavior/behavior-line-chart-tile';
import { BehaviorTableTile } from '~/domain/behavior/behavior-table-tile';
import { MoreInformation } from '~/domain/behavior/components/more-information';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import { createPageArticlesQuery } from '~/queries/create-page-articles-query';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
  createGetContent,
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData('corona_melder_app'),
  createGetChoroplethData({
    vr: ({ behavior }) => ({ behavior }),
  }),
  createGetContent<{
    articles?: ArticleSummary[];
  }>((_context) => {
    const locale = process.env.NEXT_PUBLIC_LOCALE || 'nl';
    return createPageArticlesQuery('behaviorPage', locale);
  })
);

const BehaviorPage = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText, formatNumber } = useIntl();

  const { selectedNlData: data, choropleth, content, lastGenerated } = props;
  const behaviorLastValue = data.behavior.last_value;
  const { nl_gedrag, corona_melder_app } = siteText;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: nl_gedrag.metadata.title,
    description: nl_gedrag.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NationalLayout data={data} lastGenerated={lastGenerated}>
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
                {replaceComponentsInText(
                  corona_melder_app.waarschuwingen.total,
                  {
                    totalDownloads: (
                      <span
                        css={css({ color: 'data.primary', fontWeight: 'bold' })}
                      >
                        {formatNumber(
                          data.corona_melder_app?.last_value.downloaded_total
                        )}
                      </span>
                    ),
                  }
                )}
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

          <ChartTile
            metadata={{
              source:
                corona_melder_app.waarschuwingen_over_tijd_grafiek.bronnen
                  .coronamelder,
            }}
            title={corona_melder_app.waarschuwingen_over_tijd_grafiek.title}
            description={
              corona_melder_app.waarschuwingen_over_tijd_grafiek.description
            }
            timeframeOptions={['all', '5weeks', 'week']}
          >
            {(timeframe) => (
              <TimeSeriesChart
                tooltipTitle={
                  corona_melder_app.waarschuwingen_over_tijd_grafiek.title
                }
                timeframe={timeframe}
                values={data.corona_melder_app.values}
                ariaLabelledBy={
                  corona_melder_app.waarschuwingen_over_tijd_grafiek
                    .ariaDescription
                }
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'warned_daily',
                    label:
                      corona_melder_app.waarschuwingen_over_tijd_grafiek.labels
                        .warnings,
                    color: colors.data.primary,
                  },
                ]}
              />
            )}
          </ChartTile>
        </TileList>
      </NationalLayout>
    </Layout>
  );
};

export default BehaviorPage;

const IconContainer = styled.span(
  css({
    marginRight: 3,
    color: 'gray',
    height: 25,
    width: 25,
  })
);
