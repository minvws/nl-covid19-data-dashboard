import { useRouter } from 'next/router';
import Locatie from '~/assets/locaties.svg';
import { LineChart } from '~/components/charts/index';
import { ChoroplethLegenda } from '~/components/choropleth/legenda/choropleth-legenda';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/use-safety-region-legenda-data';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createInfectedLocationsRegionalTooltip } from '~/components/choropleth/tooltips/region/create-infected-locations-regional-tooltip';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { Text } from '~/components-styled/typography';
import { Metadata } from '~/components-styled/metadata';

const text = siteText.verpleeghuis_besmette_locaties;

const NursingHomeInfectedLocations: FCWithLayout<INationalData> = (props) => {
  const data = props.data.nursing_home;
  const router = useRouter();
  const legendItems = useSafetyRegionLegendaData(
    'nursing_home',
    'infected_locations_percentage'
  );

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <ContentHeader
        category={siteText.nationaal_layout.headings.verpleeghuis}
        title={text.titel}
        Icon={Locatie}
        subtitle={text.pagina_toelichting}
        metadata={{
          datumsText: text.datums,
          dateUnix: data.last_value.date_of_report_unix,
          dateInsertedUnix: data.last_value.date_of_insertion_unix,
          dataSource: text.bron,
        }}
      />

      <TwoKpiSection>
        <KpiTile
          title={text.kpi_titel}
          metadata={{
            date: data.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue
            absolute={data.last_value.infected_locations_total}
            percentage={data.last_value.infected_locations_percentage}
          />
          <Text>{text.kpi_toelichting}</Text>
        </KpiTile>

        <KpiTile
          title={text.barscale_titel}
          metadata={{
            date: data.last_value.date_of_report_unix,
            source: text.bron,
          }}
        >
          <KpiValue absolute={data?.last_value.newly_infected_locations} />
          <Text>{text.barscale_toelichting}</Text>
        </KpiTile>
      </TwoKpiSection>

      <article className="metric-article layout-choropleth">
        <div className="choropleth-header">
          <h3>{text.map_titel}</h3>
          <p>{text.map_toelichting}</p>
        </div>

        <div className="choropleth-chart">
          <SafetyRegionChoropleth
            metricName="nursing_home"
            metricValueName="infected_locations_percentage"
            tooltipContent={createInfectedLocationsRegionalTooltip(router)}
            onSelect={createSelectRegionHandler(
              router,
              'verpleeghuis-besmette-locaties'
            )}
          />
        </div>

        <div className="choropleth-legend">
          {legendItems && (
            <ChoroplethLegenda
              items={legendItems}
              title={text.chloropleth_legenda.titel}
            />
          )}
        </div>
        <Metadata
          date={data.last_value.date_of_report_unix}
          source={text.bron}
        />
      </article>

      <article className="metric-article">
        <LineChart
          title={text.linechart_titel}
          values={data.values.map((value) => ({
            value: value.infected_locations_total,
            date: value.date_of_report_unix,
          }))}
        />
        <Metadata source={text.bron} />
      </article>
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedLocations;
