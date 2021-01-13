import { useRouter } from 'next/router';
import CoronaVirus from '~/assets/coronavirus.svg';
import Gehandicaptenzorg from '~/assets/gehandicapte-zorg.svg';
import Locatie from '~/assets/locaties.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { Text } from '~/components-styled/typography';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createDisablityInfectedLocationsRegionalTooltip } from '~/components/choropleth/tooltips/region/create-disability-infected-locations-regional-tooltip';
import { SEOHead } from '~/components/seoHead';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import siteText from '~/locale/index';
import {
  createGetChoroplethData,
  getNlData,
  getLastGeneratedDate,
} from '~/static-props/get-data';
import { createGetStaticProps } from '~/static-props/create-get-static-props';

const infectedLocationsText = siteText.gehandicaptenzorg_besmette_locaties;
const positiveTestedPeopleText =
  siteText.gehandicaptenzorg_positief_geteste_personen;
const locationDeaths = siteText.gehandicaptenzorg_oversterfte;

export const getStaticProps = createGetStaticProps(
  getLastGeneratedDate,
  getNlData,
  createGetChoroplethData({
    vr: ({ disability_care }) => ({ disability_care }),
  })
);

const DisabilityCare: FCWithLayout<typeof getStaticProps> = (props) => {
  const { data, choropleth } = props;
  const lastValue = data.disability_care.last_value;
  const values = data.disability_care.values;

  const router = useRouter();

  return (
    <>
      <SEOHead
        title={infectedLocationsText.metadata.title}
        description={infectedLocationsText.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.kwetsbare_groepen}
          screenReaderCategory={
            siteText.verpleeghuis_positief_geteste_personen.titel_sidebar
          }
          title={positiveTestedPeopleText.titel}
          icon={<Gehandicaptenzorg />}
          subtitle={positiveTestedPeopleText.pagina_toelichting}
          metadata={{
            datumsText: positiveTestedPeopleText.datums,
            dateOrRange: lastValue.date_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [positiveTestedPeopleText.bronnen.rivm],
          }}
          reference={positiveTestedPeopleText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={positiveTestedPeopleText.barscale_titel}
            description={positiveTestedPeopleText.extra_uitleg}
            metadata={{
              date: lastValue.date_unix,
              source: positiveTestedPeopleText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="newly_infected_people"
              absolute={lastValue.newly_infected_people}
            />
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          metadata={{ source: positiveTestedPeopleText.bronnen.rivm }}
          title={positiveTestedPeopleText.linechart_titel}
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
          title={infectedLocationsText.titel}
          icon={<Locatie />}
          subtitle={infectedLocationsText.pagina_toelichting}
          metadata={{
            datumsText: infectedLocationsText.datums,
            dateOrRange: lastValue.date_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [infectedLocationsText.bronnen.rivm],
          }}
          reference={infectedLocationsText.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={infectedLocationsText.kpi_titel}
            metadata={{
              date: lastValue.date_unix,
              source: infectedLocationsText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="infected_locations_total"
              absolute={lastValue.infected_locations_total}
              percentage={lastValue.infected_locations_percentage}
            />
            <Text>{infectedLocationsText.kpi_toelichting}</Text>
          </KpiTile>

          <KpiTile
            title={infectedLocationsText.barscale_titel}
            metadata={{
              date: lastValue.date_unix,
              source: infectedLocationsText.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="newly_infected_locations"
              absolute={lastValue.newly_infected_locations}
            />
            <Text>{infectedLocationsText.barscale_toelichting}</Text>
          </KpiTile>
        </TwoKpiSection>

        <ChoroplethTile
          title={infectedLocationsText.map_titel}
          description={infectedLocationsText.map_toelichting}
          metadata={{
            date: lastValue.date_unix,
            source: infectedLocationsText.bronnen.rivm,
          }}
          legend={{
            thresholds:
              regionThresholds.nursing_home.infected_locations_percentage,
            title: infectedLocationsText.chloropleth_legenda.titel,
          }}
        >
          <SafetyRegionChoropleth
            data={choropleth.vr}
            metricName="disability_care"
            metricProperty="infected_locations_percentage"
            tooltipContent={createDisablityInfectedLocationsRegionalTooltip(
              createSelectRegionHandler(router, 'gehandicaptenzorg')
            )}
            onSelect={createSelectRegionHandler(router, 'gehandicaptenzorg')}
          />
        </ChoroplethTile>

        <LineChartTile
          metadata={{ source: infectedLocationsText.bronnen.rivm }}
          title={infectedLocationsText.linechart_titel}
          values={values}
          linesConfig={[
            {
              metricProperty: 'infected_locations_total',
            },
          ]}
        />

        <ContentHeader
          id="sterfte"
          skipLinkAnchor={true}
          title={locationDeaths.titel}
          icon={<CoronaVirus />}
          subtitle={locationDeaths.pagina_toelichting}
          metadata={{
            datumsText: locationDeaths.datums,
            dateOrRange: lastValue.date_unix,
            dateOfInsertionUnix: lastValue.date_of_insertion_unix,
            dataSources: [locationDeaths.bronnen.rivm],
          }}
          reference={locationDeaths.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={locationDeaths.barscale_titel}
            description={locationDeaths.extra_uitleg}
            metadata={{
              date: lastValue.date_unix,
              source: locationDeaths.bronnen.rivm,
            }}
          >
            <KpiValue
              data-cy="deceased_daily"
              absolute={lastValue.deceased_daily}
            />
          </KpiTile>
        </TwoKpiSection>

        <LineChartTile
          metadata={{ source: locationDeaths.bronnen.rivm }}
          title={locationDeaths.linechart_titel}
          values={values}
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

DisabilityCare.getLayout = getNationalLayout;

export default DisabilityCare;
