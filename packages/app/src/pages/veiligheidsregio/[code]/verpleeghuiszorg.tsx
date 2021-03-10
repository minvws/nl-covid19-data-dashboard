import CoronaVirus from '~/assets/coronavirus.svg';
import Locatie from '~/assets/locaties.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { addBackgroundRectangleCallback } from '~/components-styled/line-chart/logic';
import { SEOHead } from '~/components-styled/seo-head';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getVrData } from '~/static-props/get-data';
import { colors } from '~/style/theme';
import { getTrailingDateRange } from '~/utils/get-trailing-date-range';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const locationsText = siteText.veiligheidsregio_verpleeghuis_besmette_locaties;
const positiveTestPeopleText =
  siteText.veiligheidsregio_verpleeghuis_positief_geteste_personen;
const mortalityText = siteText.veiligheidsregio_verpleeghuis_oversterfte;
const graphDescriptions = siteText.accessibility.grafieken;

const NursingHomeCare: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, safetyRegionName } = props;

  const nursinghomeLastValue = data.nursing_home.last_value;
  const nursinghomeDataUnderReportedValues = getTrailingDateRange(
    data.nursing_home.values,
    7
  );

  return (
    <>
      <SEOHead
        title={replaceVariablesInText(locationsText.metadata.title, {
          safetyRegionName,
        })}
        description={replaceVariablesInText(
          locationsText.metadata.description,
          {
            safetyRegionName,
          }
        )}
      />
      <TileList>
        <ContentHeader
          category={siteText.veiligheidsregio_layout.headings.kwetsbare_groepen}
          screenReaderCategory={
            siteText.verpleeghuis_besmette_locaties.titel_sidebar
          }
          title={replaceVariablesInText(positiveTestPeopleText.titel, {
            safetyRegion: safetyRegionName,
          })}
          icon={<Verpleeghuiszorg />}
          subtitle={replaceVariablesInText(
            positiveTestPeopleText.pagina_toelichting,
            {
              safetyRegion: safetyRegionName,
            }
          )}
          metadata={{
            datumsText: positiveTestPeopleText.datums,
            dateOrRange: nursinghomeLastValue.date_unix,
            dateOfInsertionUnix: nursinghomeLastValue.date_of_insertion_unix,
            dataSources: [positiveTestPeopleText.bronnen.rivm],
          }}
          reference={positiveTestPeopleText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={positiveTestPeopleText.barscale_titel}
            description={positiveTestPeopleText.extra_uitleg}
            metadata={{
              date: nursinghomeLastValue.date_unix,
              source: positiveTestPeopleText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="newly_infected_people"
              absolute={nursinghomeLastValue.newly_infected_people}
              difference={data.difference.nursing_home__newly_infected_people}
            />
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          metadata={{ source: positiveTestPeopleText.bronnen.rivm }}
          title={positiveTestPeopleText.linechart_titel}
          ariaDescription={graphDescriptions.verpleeghuiszorg_positief_getest}
          values={data.nursing_home.values}
          linesConfig={[
            {
              metricProperty: 'newly_infected_people',
            },
          ]}
          componentCallback={addBackgroundRectangleCallback(
            nursinghomeDataUnderReportedValues,
            {
              fill: colors.data.underReported,
            }
          )}
          legendItems={[
            {
              color: colors.data.primary,
              label: positiveTestPeopleText.line_chart_legend_trend_label,
              shape: 'line',
            },
            {
              color: colors.data.underReported,
              label: positiveTestPeopleText.line_chart_legend_inaccurate_label,
              shape: 'square',
            },
          ]}
          showLegend
        />

        <ContentHeader
          id="besmette-locaties"
          skipLinkAnchor={true}
          title={replaceVariablesInText(locationsText.titel, {
            safetyRegion: safetyRegionName,
          })}
          icon={<Locatie />}
          subtitle={locationsText.pagina_toelichting}
          metadata={{
            datumsText: locationsText.datums,
            dateOrRange: nursinghomeLastValue.date_unix,
            dateOfInsertionUnix: nursinghomeLastValue.date_of_insertion_unix,
            dataSources: [locationsText.bronnen.rivm],
          }}
          reference={locationsText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={locationsText.kpi_titel}
            metadata={{
              date: nursinghomeLastValue.date_unix,
              source: locationsText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected_locations_total"
              absolute={nursinghomeLastValue.infected_locations_total}
              percentage={nursinghomeLastValue.infected_locations_percentage}
              difference={
                data.difference.nursing_home__infected_locations_total
              }
            />
            <Text>{locationsText.kpi_toelichting}</Text>
          </KpiTile>
          <KpiTile
            title={locationsText.barscale_titel}
            metadata={{
              date: nursinghomeLastValue.date_unix,
              source: locationsText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="newly_infected_locations"
              absolute={nursinghomeLastValue.newly_infected_locations}
            />
            <Text>{locationsText.barscale_toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        {nursinghomeLastValue.infected_locations_total !== undefined && (
          <LineChartTile
            title={locationsText.linechart_titel}
            ariaDescription={
              graphDescriptions.verpleeghuiszorg_besmette_locaties
            }
            values={data.nursing_home.values}
            linesConfig={[
              {
                metricProperty: 'infected_locations_total',
              },
            ]}
            metadata={{
              source: locationsText.bronnen.rivm,
            }}
          />
        )}

        <ContentHeader
          id="sterfte"
          skipLinkAnchor={true}
          title={replaceVariablesInText(mortalityText.titel, {
            safetyRegion: safetyRegionName,
          })}
          icon={<CoronaVirus />}
          subtitle={mortalityText.pagina_toelichting}
          metadata={{
            datumsText: mortalityText.datums,
            dateOrRange: nursinghomeLastValue.date_unix,
            dateOfInsertionUnix: nursinghomeLastValue.date_of_insertion_unix,
            dataSources: [mortalityText.bronnen.rivm],
          }}
          reference={mortalityText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={mortalityText.barscale_titel}
            description={mortalityText.extra_uitleg}
            metadata={{
              date: nursinghomeLastValue.date_unix,
              source: mortalityText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="deceased_daily"
              absolute={nursinghomeLastValue.deceased_daily}
              difference={data.difference.nursing_home__deceased_daily}
            />
          </KpiTile>
        </TwoKpiSection>

        {data && (
          <LineChartTile
            metadata={{ source: mortalityText.bronnen.rivm }}
            title={mortalityText.linechart_titel}
            values={data.nursing_home.values}
            ariaDescription={
              graphDescriptions.verpleeghuiszorg_overleden_getest
            }
            linesConfig={[
              {
                metricProperty: 'deceased_daily',
              },
            ]}
            componentCallback={addBackgroundRectangleCallback(
              nursinghomeDataUnderReportedValues,
              {
                fill: colors.data.underReported,
              }
            )}
            legendItems={[
              {
                color: colors.data.primary,
                label: mortalityText.line_chart_legend_trend_label,
                shape: 'line',
              },
              {
                color: colors.data.underReported,
                label: mortalityText.line_chart_legend_inaccurate_label,
                shape: 'square',
              },
            ]}
            showLegend
          />
        )}
      </TileList>
    </>
  );
};

NursingHomeCare.getLayout = getSafetyRegionLayout();

export default NursingHomeCare;
