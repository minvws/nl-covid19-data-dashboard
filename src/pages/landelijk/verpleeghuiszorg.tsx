import { useRouter } from 'next/router';
import CoronaVirus from '~/assets/coronavirus.svg';
import Locatie from '~/assets/locaties.svg';
import Verpleeghuiszorg from '~/assets/verpleeghuiszorg.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createInfectedLocationsRegionalTooltip } from '~/components/choropleth/tooltips/region/create-infected-locations-regional-tooltip';
import { FCWithLayout } from '~/components/layout';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const infectedLocationsText = siteText.verpleeghuis_besmette_locaties;
const positiveTestedPeopleText =
  siteText.verpleeghuis_positief_geteste_personen;
const locationDeaths = siteText.verpleeghuis_oversterfte;

const NursingHomeCare: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;
  const nursinghomeData = data.nursing_home;

  const router = useRouter();

  return (
    <>
      <SEOHead
        title={infectedLocationsText.metadata.title}
        description={infectedLocationsText.metadata.description}
      />

      <ContentHeader
        category={siteText.nationaal_layout.headings.kwetsbare_groepen}
        screenreaderCategory={
          siteText.verpleeghuis_besmette_locaties.titel_sidebar
        }
        title={positiveTestedPeopleText.titel}
        icon={<Verpleeghuiszorg />}
        subtitle={positiveTestedPeopleText.pagina_toelichting}
        metadata={{
          datumsText: positiveTestedPeopleText.datums,
          dateInfo: nursinghomeData.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            nursinghomeData.last_value.date_of_insertion_unix,
          dataSources: [positiveTestedPeopleText.bronnen.rivm],
        }}
        reference={positiveTestedPeopleText.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={positiveTestedPeopleText.barscale_titel}
          description={positiveTestedPeopleText.extra_uitleg}
          metadata={{
            date: nursinghomeData.last_value.date_of_report_unix,
            source: positiveTestedPeopleText.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="newly_infected_people"
            absolute={nursinghomeData.last_value.newly_infected_people}
          />
        </KpiTile>
      </TwoKpiSection>

      <LineChartTile
        metadata={{ source: positiveTestedPeopleText.bronnen.rivm }}
        title={positiveTestedPeopleText.linechart_titel}
        values={nursinghomeData.values.map((value) => ({
          value: value.newly_infected_people,
          date: value.date_of_report_unix,
        }))}
      />

      <ContentHeader
        id="besmette-locaties"
        skipLinkAnchor={true}
        title={infectedLocationsText.titel}
        icon={<Locatie />}
        subtitle={infectedLocationsText.pagina_toelichting}
        metadata={{
          datumsText: infectedLocationsText.datums,
          dateInfo: nursinghomeData.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            nursinghomeData.last_value.date_of_insertion_unix,
          dataSources: [infectedLocationsText.bronnen.rivm],
        }}
        reference={infectedLocationsText.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={infectedLocationsText.kpi_titel}
          metadata={{
            date: nursinghomeData.last_value.date_of_report_unix,
            source: infectedLocationsText.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="infected_locations_total"
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
            source: infectedLocationsText.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="newly_infected_locations"
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
          source: infectedLocationsText.bronnen.rivm,
        }}
        legend={{
          thresholds:
            regionThresholds.nursing_home.infected_locations_percentage,
          title: infectedLocationsText.chloropleth_legenda.titel,
        }}
      >
        <SafetyRegionChoropleth
          metricName="nursing_home"
          metricProperty="infected_locations_percentage"
          tooltipContent={createInfectedLocationsRegionalTooltip(router)}
          onSelect={createSelectRegionHandler(router, 'verpleeghuiszorg')}
        />
      </ChoroplethTile>

      <LineChartTile
        metadata={{ source: infectedLocationsText.bronnen.rivm }}
        title={infectedLocationsText.linechart_titel}
        values={nursinghomeData.values.map((value) => ({
          value: value.infected_locations_total,
          date: value.date_of_report_unix,
        }))}
      />

      <ContentHeader
        id="sterfte"
        skipLinkAnchor={true}
        title={locationDeaths.titel}
        icon={<CoronaVirus />}
        subtitle={locationDeaths.pagina_toelichting}
        metadata={{
          datumsText: locationDeaths.datums,
          dateInfo: nursinghomeData.last_value.date_of_report_unix,
          dateOfInsertionUnix:
            nursinghomeData.last_value.date_of_insertion_unix,
          dataSources: [locationDeaths.bronnen.rivm],
        }}
        reference={locationDeaths.reference}
      />

      <TwoKpiSection>
        <KpiTile
          title={locationDeaths.barscale_titel}
          description={locationDeaths.extra_uitleg}
          metadata={{
            date: nursinghomeData.last_value.date_of_report_unix,
            source: locationDeaths.bronnen.rivm,
          }}
        >
          <KpiValue
            data-cy="deceased_daily"
            absolute={nursinghomeData.last_value.deceased_daily}
          />
        </KpiTile>
      </TwoKpiSection>

      {data && (
        <LineChartTile
          metadata={{ source: locationDeaths.bronnen.rivm }}
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

NursingHomeCare.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default NursingHomeCare;
