import { useRouter } from 'next/router';
import Locatie from '~/assets/locaties.svg';
import { LineChart } from '~/components/charts/index';
import { ChoroplethLegenda } from '~/components/choropleth/legenda/ChoroplethLegenda';
import { useSafetyRegionLegendaData } from '~/components/choropleth/legenda/hooks/useSafetyRegionLegendaData';
import { SafetyRegionChoropleth } from '~/components/choropleth/SafetyRegionChoropleth';
import { createSelectRegionHandler } from '~/components/choropleth/selectHandlers/createSelectRegionHandler';
import { createInfectedLocationsRegionalTooltip } from '~/components/choropleth/tooltips/region/createInfectedLocationsRegionalTooltip';
import { FCWithLayout } from '~/components/layout';
import { ContentHeader } from '~/components/contentHeader';
import { getNationalLayout } from '~/components/layout/NationalLayout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import getNlData, { INationalData } from '~/static-props/nl-data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

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

      <div className="layout-two-column">
        <article className="metric-article column-item">
          <h3>{text.kpi_titel}</h3>
          <p className="text-blue kpi">
            {formatNumber(data.last_value.infected_locations_total)} (
            {formatPercentage(data.last_value.infected_locations_percentage)}
            %)
          </p>
          <p>{text.kpi_toelichting}</p>
        </article>

        <article className="metric-article column-item">
          <h3>{text.barscale_titel}</h3>
          <p className="text-blue kpi">
            {formatNumber(data?.last_value.newly_infected_locations)}
          </p>
          <p>{text.barscale_toelichting}</p>
        </article>
      </div>

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
      </article>

      <article className="metric-article">
        <LineChart
          title={text.linechart_titel}
          values={data.values.map((value) => ({
            value: value.newly_infected_locations,
            date: value.date_of_report_unix,
          }))}
        />
      </article>
    </>
  );
};

NursingHomeInfectedLocations.getLayout = getNationalLayout();

export const getStaticProps = getNlData();

export default NursingHomeInfectedLocations;
