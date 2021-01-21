import CoronaVirus from '~/assets/coronavirus.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Locatie from '~/assets/locaties.svg';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import siteText from '~/locale/index';
import { createGetStaticProps } from '~/static-props/create-get-static-props';
import { getLastGeneratedDate, getVrData } from '~/static-props/get-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export { getStaticPaths } from '~/static-paths/vr';

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getVrData
);

const locationsText =
  siteText.veiligheidsregio_gehandicaptenzorg_besmette_locaties;
const positiveTestPeopleText =
  siteText.veiligheidsregio_gehandicaptenzorg_positief_geteste_personen;
const mortalityText = siteText.veiligheidsregio_gehandicaptenzorg_oversterfte;
const graphDescriptions = siteText.accessibility.grafieken;

const DisabilityCare: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, safetyRegionName } = props;

  const lastValue = data.disability_care.last_value;
  const values = data.disability_care.values;

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
          icon={<Gehandicaptenzorg />}
          subtitle={replaceVariablesInText(
            positiveTestPeopleText.pagina_toelichting,
            {
              safetyRegion: safetyRegionName,
            }
          )}
          metadata={{
            datumsText: positiveTestPeopleText.datums,
            dateOrRange: lastValue.date_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [positiveTestPeopleText.bronnen.rivm],
          }}
          reference={positiveTestPeopleText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={positiveTestPeopleText.barscale_titel}
            description={positiveTestPeopleText.extra_uitleg}
            metadata={{
              date: lastValue.date_unix,
              source: positiveTestPeopleText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="newly_infected_people"
              absolute={lastValue.newly_infected_people}
            />
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          metadata={{ source: positiveTestPeopleText.bronnen.rivm }}
          title={positiveTestPeopleText.linechart_titel}
          ariaDescription={graphDescriptions.gehandicaptenzorg_positief_getest}
          values={values}
          linesConfig={[
            {
              metricProperty: 'newly_infected_people',
            },
          ]}
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
            dateOrRange: lastValue.date_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [locationsText.bronnen.rivm],
          }}
          reference={locationsText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={locationsText.kpi_titel}
            metadata={{
              date: lastValue.date_unix,
              source: locationsText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected_locations_total"
              absolute={lastValue.infected_locations_total}
              percentage={lastValue.infected_locations_percentage}
            />
            <Text>{locationsText.kpi_toelichting}</Text>
          </KpiTile>
          <KpiTile
            title={locationsText.barscale_titel}
            metadata={{
              date: lastValue.date_unix,
              source: locationsText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="newly_infected_locations"
              absolute={lastValue.newly_infected_locations}
            />
            <Text>{locationsText.barscale_toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        {lastValue.infected_locations_total !== undefined && (
          <LineChartTile
            title={locationsText.linechart_titel}
            values={values}
            ariaDescription={
              graphDescriptions.gehandicaptenzorg_besmette_locaties
            }
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
            dateOrRange: lastValue.date_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [mortalityText.bronnen.rivm],
          }}
          reference={mortalityText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={mortalityText.barscale_titel}
            description={mortalityText.extra_uitleg}
            metadata={{
              date: lastValue.date_unix,
              source: mortalityText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="deceased_daily"
              absolute={lastValue.deceased_daily}
            />
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          metadata={{ source: mortalityText.bronnen.rivm }}
          title={mortalityText.linechart_titel}
          values={values}
          ariaDescription={graphDescriptions.gehandicaptenzorg_overleden}
          linesConfig={[
            {
              metricProperty: 'deceased_daily',
            },
          ]}
        />
      </TileList>
    </>
  );
};

DisabilityCare.getLayout = getSafetyRegionLayout();

export default DisabilityCare;
