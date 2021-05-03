import { css } from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import Phone from '~/assets/phone.svg';
import { ChartTile } from '~/components/chart-tile';
import { ContentHeader } from '~/components/content-header';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NationalLayout } from '~/domain/layout/national-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  createGetChoroplethData,
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
  })
);

const CoronamelderPage = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText, formatNumber } = useIntl();

  const { selectedNlData: data, lastGenerated } = props;
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
            timeframeOptions={['all', '5weeks']}
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

export default CoronamelderPage;

const IconContainer = styled.span(
  css({
    marginRight: 3,
    color: 'gray',
    height: 25,
    width: 25,
  })
);
