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
import { FCWithLayout } from '~/domain/layout/layout';
import { getSafetyRegionLayout } from '~/domain/layout/safety-region-layout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getSafetyRegionPaths,
  getSafetyRegionStaticProps,
  ISafetyRegionData,
} from '~/static-props/safetyregion-data';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

const locationsText =
  siteText.veiligheidsregio_gehandicaptenzorg_besmette_locaties;
const positiveTestPeopleText =
  siteText.veiligheidsregio_gehandicaptenzorg_positief_geteste_personen;
const mortalityText = siteText.veiligheidsregio_gehandicaptenzorg_oversterfte;

const DisabilityCare: FCWithLayout<ISafetyRegionData> = (props) => {
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
            dateInfo: lastValue.date_of_report_unix,
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
              date: lastValue.date_of_report_unix,
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
          values={values.map((value) => ({
            value: value.newly_infected_people,
            date: value.date_of_report_unix,
          }))}
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
            dateInfo: lastValue.date_of_report_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [locationsText.bronnen.rivm],
          }}
          reference={locationsText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={locationsText.kpi_titel}
            metadata={{
              date: lastValue.date_of_report_unix,
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
              date: lastValue.date_of_report_unix,
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
            values={values.map((value) => ({
              value: value.infected_locations_total,
              date: value.date_of_report_unix,
            }))}
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
            dateInfo: lastValue.date_of_report_unix,
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
              date: lastValue.date_of_report_unix,
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
          values={values.map((value) => ({
            value: value.deceased_daily,
            date: value.date_of_report_unix,
          }))}
        />
      </TileList>
    </>
  );
};

DisabilityCare.getLayout = getSafetyRegionLayout();

export const getStaticProps = getSafetyRegionStaticProps;
export const getStaticPaths = getSafetyRegionPaths();

export default DisabilityCare;
