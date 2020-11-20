import { useRouter } from 'next/router';
import CoronaVirus from '~/assets/coronavirus.svg';
import Locatie from '~/assets/locaties.svg';
import Getest from '~/assets/test.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/use-safety-region-legenda-data';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createInfectedLocationsRegionalTooltip } from '~/components/choropleth/tooltips/region/create-infected-locations-regional-tooltip';
import { ContentHeader } from '~/components/contentHeader';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';

const infectedLocationsText = siteText.verpleeghuis_besmette_locaties;
const positiveTestedPeopleText =
  siteText.verpleeghuis_positief_geteste_personen;
const locationDeaths = siteText.verpleeghuis_oversterfte;

const NursingHomeInfectedLocations: FCWithLayout<INationalData> = (props) => {
  const { data } = props;
  const nursinghomeData = data.nursing_home;

  const router = useRouter();
  const legendItems = useSafetyRegionLegendaData(
    'nursing_home',
    'infected_locations_percentage'
  );

  return (
    <>
      <SEOHead
        title={infectedLocationsText.metadata.title}
        description={infectedLocationsText.metadata.description}
      />

      <ContentHeader
        category={siteText.nationaal_layout.headings.kwetsbare_groepen}
        title={positiveTestedPeopleText.titel}
        icon={<Getest />}
        subtitle={positiveTestedPeopleText.pagina_toelichting}
        metadata={{
          datumsText: positiveTestedPeopleText.datums,
          dateUnix: nursinghomeData.last_value.date_of_report_unix,
          dateInsertedUnix: nursinghomeData.last_value.date_of_insertion_unix,
          dataSource: positiveTestedPeopleText.bron,
        }}
        reference={positiveTestedPeopleText.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={positiveTestedPeopleText.barscale_titel}
          description={positiveTestedPeopleText.extra_uitleg}
          metadata={{
            date: nursinghomeData.last_value.date_of_report_unix,
            source: positiveTestedPeopleText.bron,
          }}
        >
          <KpiValue
            data-cy="infected_daily_total"
            absolute={nursinghomeData.last_value.newly_infected_people}
          />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        metadata={{ source: positiveTestedPeopleText.bron }}
        title={positiveTestedPeopleText.linechart_titel}
        values={nursinghomeData.values.map((value) => ({
          value: value.newly_infected_people,
          date: value.date_of_report_unix,
        }))}
      />

      <ContentHeader
        title={infectedLocationsText.titel}
        icon={<Locatie />}
        subtitle={infectedLocationsText.pagina_toelichting}
        metadata={{
          datumsText: infectedLocationsText.datums,
          dateUnix: nursinghomeData.last_value.date_of_report_unix,
          dateInsertedUnix: nursinghomeData.last_value.date_of_insertion_unix,
          dataSource: infectedLocationsText.bron,
        }}
        reference={infectedLocationsText.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={infectedLocationsText.kpi_titel}
          metadata={{
            date: nursinghomeData.last_value.date_of_report_unix,
            source: infectedLocationsText.bron,
          }}
        >
          <KpiValue
            absolute={nursinghomeData.last_value.infected_locations_total}
            percentage={
              nursinghomeData.last_value.infected_locations_percentage
            }
          />
          <Text>{infectedLocationsText.kpi_toelichting}</Text>
        </KpiTile>

        <KpiTile
          title={infectedLocationsText.barscale_titel}
          metadata={{
            date: nursinghomeData.last_value.date_of_report_unix,
            source: infectedLocationsText.bron,
          }}
        >
          <KpiValue
            absolute={nursinghomeData?.last_value.newly_infected_locations}
          />
          <Text>{infectedLocationsText.barscale_toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      <ChoroplethTile
        title={infectedLocationsText.map_titel}
        description={infectedLocationsText.map_toelichting}
        metadata={{
          date: nursinghomeData.last_value.date_of_report_unix,
          source: infectedLocationsText.bron,
        }}
        legend={
          legendItems && {
            items: legendItems,
            title: infectedLocationsText.chloropleth_legenda.titel,
          }
        }
      >
        <SafetyRegionChoropleth
          metricName="nursing_home"
          metricValueName="infected_locations_percentage"
          tooltipContent={createInfectedLocationsRegionalTooltip(router)}
          onSelect={createSelectRegionHandler(
            router,
            'verpleeghuis-besmette-locaties'
          )}
        />
      </ChoroplethTile>

      <LineChartTile
        metadata={{ source: infectedLocationsText.bron }}
        title={infectedLocationsText.linechart_titel}
        values={nursinghomeData.values.map((value) => ({
          value: value.infected_locations_total,
          date: value.date_of_report_unix,
        }))}
      />

      <ContentHeader
        title={locationDeaths.titel}
        icon={<CoronaVirus />}
        subtitle={locationDeaths.pagina_toelichting}
        metadata={{
          datumsText: locationDeaths.datums,
          dateUnix: nursinghomeData.last_value.date_of_report_unix,
          dateInsertedUnix: nursinghomeData.last_value.date_of_insertion_unix,
          dataSource: locationDeaths.bron,
        }}
        reference={locationDeaths.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={locationDeaths.barscale_titel}
          description={locationDeaths.extra_uitleg}
          metadata={{
            date: nursinghomeData.last_value.date_of_report_unix,
            source: locationDeaths.bron,
          }}
        >
          <KpiValue absolute={nursinghomeData.last_value.deceased_daily} />
        </KpiTile>
      </TwoKpiSection>

      {data && (
        <LineChartTile
          metadata={{ source: locationDeaths.bron }}
          title={locationDeaths.linechart_titel}
          values={nursinghomeData.values.map((value) => ({
            value: value.deceased_daily,
            date: value.date_of_report_unix,
          }))}
        />
      )}
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedLocations;
