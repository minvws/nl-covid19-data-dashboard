import { css } from '@styled-system/css';
import styled from 'styled-components';
import ExternalLinkIcon from '~/assets/external-link.svg';
import Phone from '~/assets/phone.svg';
import { ChartTile } from '~/components/chart-tile';
import { KpiTile } from '~/components/kpi-tile';
import { KpiValue } from '~/components/kpi-value';
import { PageInformationBlock } from '~/components/page-information-block';
import { Tile } from '~/components/tile';
import { TileList } from '~/components/tile-list';
import { TimeSeriesChart } from '~/components/time-series-chart';
import { TwoKpiSection } from '~/components/two-kpi-section';
import { Heading, Text } from '~/components/typography';
import { Layout } from '~/domain/layout/layout';
import { NlLayout } from '~/domain/layout/nl-layout';
import { useIntl } from '~/intl';
import {
  createGetStaticProps,
  StaticProps,
} from '~/static-props/create-get-static-props';
import {
  getLastGeneratedDate,
  selectNlPageMetricData,
} from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { Link } from '~/utils/link';
import { replaceComponentsInText } from '~/utils/replace-components-in-text';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  selectNlPageMetricData(
    'corona_melder_app_warning',
    'corona_melder_app_download'
  )
);

const CoronamelderPage = (props: StaticProps<typeof getStaticProps>) => {
  const { siteText, formatNumber } = useIntl();

  const { selectedNlData: data, lastGenerated } = props;
  const { nl_gedrag, corona_melder_app } = siteText;

  const warningLastValue = data.corona_melder_app_warning.last_value;

  const metadata = {
    ...siteText.nationaal_metadata,
    title: nl_gedrag.metadata.title,
    description: nl_gedrag.metadata.description,
  };

  return (
    <Layout {...metadata} lastGenerated={lastGenerated}>
      <NlLayout data={data} lastGenerated={lastGenerated}>
        <TileList>
          <PageInformationBlock
            category={corona_melder_app.header.category}
            title={corona_melder_app.header.title}
            icon={<Phone />}
            description={corona_melder_app.header.description}
            metadata={{
              datumsText: corona_melder_app.header.datums,
              dateOrRange: warningLastValue.date_unix,
              dateOfInsertionUnix: warningLastValue.date_of_insertion_unix,
              dataSources: [corona_melder_app.header.bronnen.rivm],
            }}
            referenceLink={corona_melder_app.header.reference.href}
          />

          <TwoKpiSection>
            <KpiTile
              title={corona_melder_app.waarschuwingen.title}
              metadata={{
                date: warningLastValue.date_unix,
                source: corona_melder_app.header.bronnen.rivm,
              }}
            >
              <KpiValue
                absolute={warningLastValue.count}
                difference={data.difference.corona_melder_app_warning__count}
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
                          data.corona_melder_app_download.last_value.count
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
                accessibility={{
                  key: 'coronamelder_warned_daily_over_time_chart',
                }}
                tooltipTitle={
                  corona_melder_app.waarschuwingen_over_tijd_grafiek.title
                }
                timeframe={timeframe}
                values={data.corona_melder_app_warning.values}
                seriesConfig={[
                  {
                    type: 'area',
                    metricProperty: 'count',
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
      </NlLayout>
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
